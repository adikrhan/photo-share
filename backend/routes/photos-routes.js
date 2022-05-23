const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const checkAuth = require('../middleware/check-auth');
const photosCtrl = require("../controllers/photos-controllers");

router.get("/", photosCtrl.getPhotos);

router.get("/:pid", photosCtrl.getPhotoById);

router.patch('/like/:pid', photosCtrl.updateLikes);

router.get("/user/:uid", photosCtrl.getPhotoByUserId);

router.get('/search/:searchTerm', photosCtrl.getPhotosBySearchTerm);


router.use(checkAuth);

router.post("/", photosCtrl.postPhoto);

router.patch("/:pid", photosCtrl.updatePhoto);

router.delete("/:pid", photosCtrl.deletePhoto);

module.exports = router;
