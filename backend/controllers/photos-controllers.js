const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordinatesForAddress = require("../util/location");
const { cloudinary } = require("../util/cloudinary");
const Photo = require("../models/photo");
const User = require("../models/user");
const { findById } = require("../models/photo");

const getPhotos = async (req, res, next) => {
  let photos;
  try {
    photos = await Photo.find({ limit: 10 }, "title publicId")
      .sort({ createdAt: "desc" })
      .populate("creator", "name");
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Could not fetch photos, please try again later.", 500)
    );
  }

  res.json(photos.map((photo) => photo.toObject({ getters: true })));
};

const getPhotoById = async (req, res, next) => {
  console.log("getPhotoById");
  const photoId = req.params.pid;

  let photo;
  try {
    photo = await Photo.findById(photoId)
      .populate("creator", "-password")
      .populate("likes", "name image id");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find photo.", 500)
    );
  }

  if (!photo) {
    return next(
      new HttpError("Could not find a photo for the provided id!", 404)
    );
  }

  res.json(photo.toObject({ getters: true }));
};

const getPhotosByUserId = async (req, res, next) => {
  let photos;
  try {
    photos = await Photo.find({ creator: userId });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not fetch photos.", 500)
    );
  }

  if (!photos || photos.length === 0) {
    return next(
      new HttpError("Could not find photos for the provided user.", 404)
    );
  }

  res.json(photos.map((photo) => photo.toObject({ getters: true })));
};

const getPhotosBySearchTerm = async (req, res, next) => {
  let photos;
  const tag = req.params.searchTerm;

  try {
    photos = await Photo.find({ tags: tag }).populate("creator", "-password");
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not fetch photos.", 500)
    );
  }

  if (!photos || photos.length === 0) {
    return next(
      new HttpError("Could not find photos for the provided search term.", 404)
    );
  }

  res.json(photos.map((photo) => photo.toObject({ getters: true })));
};

const postPhoto = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return next(
  //     new HttpError("Invalid inputs passed, please check your data.", 422)
  //   );
  // }

  const { title, camera, lens, location, date, tags, image } = req.body;
  const creator = req.userData.userId;

  let coordinates;
  if (location) {
    try {
      coordinates = await getCoordinatesForAddress(location);
    } catch (error) {
      return next(error);
    }
  }

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(
      new HttpError("Posting photo failed, problems finding the user.", 500)
    );
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id.", 404));
  }

  let uploadedResponse;

  try {
    const fileStr = image;
    uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "photo-share_photos",
      tags: tags,
    });
  } catch (error) {
    return next(
      new HttpError(error || "Posting photo on cloudinary failed.", 500)
    );
  }

  let { Model, Lens, CreateDate } = uploadedResponse.image_metadata;
  CreateDate = CreateDate.split(' ')[0].split(':').join('-');

  const { url, public_id } = uploadedResponse;

  const postedPhoto = new Photo({
    title,
    camera: Model,
    lens: Lens || '',
    location,
    coordinates,
    date: CreateDate,
    tags,
    image: url,
    publicId: public_id,
    creator,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await postedPhoto.save({ session: sess, validateModifiedOnly: true });
    user.photos.push(postedPhoto);
    await user.save({ session: sess, validateModifiedOnly: true });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Posting photo failed, please try again.", 500));
  }

  res.status(201).json(postedPhoto.toObject({ getters: true }));
  // res.status(201).json({ message: "Posted photo" });
};

const updatePhoto = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   throw new HttpError("Invalid input passed, please check your data", 422);
  // }
  const { title, camera, lens, location, date, tags } = req.body;
  const photoId = req.params.pid;

  let photo;
  try {
    photo = await Photo.findById(photoId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not update photo.", 500)
    );
  }

  if (photo.creator.toString() !== req.userData.userId) {
    return next(
      new HttpError("You are not authorized to edit this photo.", 401)
    );
  }

  let updateResponse;
  if (tags && tags.length > 0) {
    try {
      updateResponse = await cloudinary.uploader.replace_tag(
        tags,
        photo.publicId
      );
    } catch (error) {
      return next(
        new HttpError("Something went wrong, could not update photo.", 500)
      );
    }
  }

  let coordinates;
  if (location && !coordinates || location !== photo.location) {
    try {
      photo.coordinates = await getCoordinatesForAddress(location);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  photo.title = title;
  photo.camera = camera;
  photo.lens = lens;
  photo.location = location;
  photo.date = date;
  photo.tags = tags;
  photo.updatedAt = new Date();

  try {
    await photo.save({ validateModifiedOnly: true });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not update photo", 500)
    );
  }

  res.status(200).json(photo.toObject({ getters: true }));
};

const deletePhoto = async (req, res, next) => {
  const photoId = req.params.pid;
  let photo;
  try {
    photo = await Photo.findById(photoId).populate("creator");
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not delete photo", 500)
    );
  }

  if (!photo) {
    return next(
      new HttpError("Could not find a photo for the provided id.", 404)
    );
  }

  if (photo.creator.id !== req.userData.userId) {
    return next(
      new HttpError("You are not authorized to edit this photo.", 401)
    );
  }

  let destroyResponse;
  try {
    destroyResponse = await cloudinary.uploader.destroy(photo.publicId);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        "Something went wrong when deleting photo, please try again later",
        500
      )
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await photo.remove({ session: sess, validateModifiedOnly: true });
    photo.creator.photos.pull(photo);
    await photo.creator.save({ session: sess, validateModifiedOnly: true });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not delete photo", 500)
    );
  }

  res.status(200).json({ message: "Deleted photo" });
};

const updateLikes = async (req, res, next) => {
  const photoId = req.params.pid;

  const { uid, action } = req.body;

  let photo;
  try {
    photo = await Photo.findById(photoId)
      .populate("creator", "-password")
      .populate("likes", "name image id");
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not like photo", 500)
    );
  }

  if (!photo) {
    return next(
      new HttpError("Could not find a photo for the provided id.", 404)
    );
  }

  if (action === "like") {
    photo.likes.push(uid);
  } else {
    photo.likes.pull(uid);
  }
  console.log("Line 309", photo);

  try {
    await photo.save({ validateModifiedOnly: true });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not like photo", 500)
    );
  }

  res.status(200).json(photo.toObject({ getters: true }));
};

exports.getPhotos = getPhotos;
exports.getPhotoById = getPhotoById;
exports.getPhotoByUserId = getPhotosByUserId;
exports.getPhotosBySearchTerm = getPhotosBySearchTerm;
exports.postPhoto = postPhoto;
exports.updatePhoto = updatePhoto;
exports.deletePhoto = deletePhoto;
exports.updateLikes = updateLikes;
