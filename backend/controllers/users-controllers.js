const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HttpError("Could not fetch users, please try again later.", 500)
    );
  }

  res.json(users.map((user) => user.toObject({ getters: true })));
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId).populate({
      path: "photos",
      populate: { path: "likes", select: 'name image id email' }
    });
  } catch (error) {
    return next(
      new HttpError("Could not get user, please try again later.", 500)
    );
  }

  if (!user) {
    return next(new HttpError("Found no user for the provided id.", 500));
  }

  res.json(user.toObject({ getters: true }));
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("User already exists, please login instead", 422)
    );
  }

  let hashedPw;
  try {
    hashedPw = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  const newUser = new User({
    name,
    email,
    password: hashedPw,
    city: "",
    dateOfBirth: "",
    description: "",
    image: "",
    uses: {
      camera: "",
      lens: "",
      editingSoftware: "",
    },
    photos: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      "secret_photo_share",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  res.status(200).json({
    userId: newUser.id,
    name: newUser.name,
    image: newUser.image,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Login failed, please try again later.", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid credentials.", 403));
  }

  let isValidPw = false;
  try {
    isValidPw = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError("Could not log you in, please try again later.", 500)
    );
  }

  if (!isValidPw) {
    return next(new HttpError("Invalid credentials.", 403));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      "secret_photo_share",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Log in failed, please try again later.", 500));
  }

  res.json({
    userId: existingUser.id,
    name: existingUser.name,
    existingUser: existingUser.image,
    token: token,
  });
};

const updateUser = async (req, res, next) => {
  console.log("updateUser");
  const {
    name,
    email,
    dateOfBirth,
    city,
    description,
    image,
    camera,
    lens,
    software,
  } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    return next(new HttpError("Could not find user for the provided id.", 404));
  }

  user.name = name;
  user.email = email;
  user.dateOfBirth = dateOfBirth;
  user.city = city;
  user.description = description;
  user.image = image;
  user.uses.camera = camera;
  user.uses.lens = lens;
  user.uses.editingSoftware = software;

  try {
    await user.save({ validateModifiedOnly: true });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Could not save changes, please try again later.", 500)
    );
  }

  res.status(200).json(user.toObject({ getters: true }));
};

const deleteUser = async (req, res, next) => {
  // const userId = req.params.uid;
  // let user;
  // try {
  //   user = await User.findById(userId).populate('photos');
  // } catch (error) {
  //   return next(
  //     new HttpError("Could not find user with the provided id", 404)
  //   );
  // }
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
