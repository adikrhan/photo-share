const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const photoSchema = new Schema({
  title: { type: String, required: true },
  camera: { type: String, required: false },
  lens: { type: String, required: false },
  location: { type: String, required: false },
  coordinates: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
  date: { type: String, required: false },
  tags: [{ type: String, required: false }],
  image: { type: String, required: true },
  publicId: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  likes: [{ type: mongoose.Types.ObjectId, required: false, ref: "User" }],
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

module.exports = mongoose.model("Photo", photoSchema);
