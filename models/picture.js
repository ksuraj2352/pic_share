// Imports

const { default: mongoose } = require("mongoose");
const Joi = require("joi");

// Creating User Schema

const pictureSchema = new mongoose.Schema({
  pictureLocation: {
    type: String,
  },
  pictureName: {
    type: String,
  },
});

//  Creating Models

const Picture = mongoose.model("Picture", pictureSchema);

exports.Picture = Picture;
