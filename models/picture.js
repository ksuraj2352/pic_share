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
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  }
});

//  Creating Models

const Picture = mongoose.model("Picture", pictureSchema);

exports.Picture = Picture;
