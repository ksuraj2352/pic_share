// Imports

const { default: mongoose } = require("mongoose");
const Joi = require("joi");

// Creating User Schema

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      minlength: 6,
      maxlength: 32,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 12,
      trim: true,
      lowercase : true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
    },
    fullName: {
      type: String,
      minlength: 3,
      maxlength: 128,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      maxlength: 8,
      trim: true,
    },
    phoneNumber: {
      type: Number,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activationCode: {
      type: String,
      unique: true,
    },
    profilePic: {
      type: String,
    },
    pictures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

// Validating User Inputs

function validateUsersSchema(user) {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .required()
      .min(6)
      .max(32)
      .email()
      .lowercase(),
    username: Joi.string()
      .trim()
      .required()
      .min(4)
      .max(12)
      .lowercase(),
    password: Joi.string()
      .trim()
      .required()
      .min(6)
      .max(128),
    fullName: Joi.string()
      .required()
      .min(3)
      .max(128),
  });

  return schema.validate(user);
}

function validateProfile(data) {
  const schema = Joi.object({
    fullName: Joi.string()
      .min(3)
      .max(128),
    age: Joi.number()
      .max(99)
      .min(0),
    gender: Joi.string()
      .trim()
      .max(8),
    phoneNumber: Joi.number().max(9999999999),
  });

  return schema.validate(data);
}

//  Creating Models

const User = mongoose.model("User", userSchema);

// Exports

exports.User = User;
exports.validateUsersSchema = validateUsersSchema;
exports.validateProfile = validateProfile;
