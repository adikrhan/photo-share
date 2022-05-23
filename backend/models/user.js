const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: false },
  dateOfBirth: { type: String, required: false },
  city: { type: String, required: false },
  description: { type: String, required: false },
  uses: {
    camera: { type: String, required: false },
    lens: { type: String, required: false },
    editingSoftware: { type: String, required: false },
  },
  photos: [{ type: mongoose.Types.ObjectId, required: true, ref: "Photo" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
