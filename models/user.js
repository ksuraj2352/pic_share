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
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activationCode: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
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

//  Creating Models

const User = mongoose.model("User", userSchema);

// Exports

exports.User = User;
exports.validateUsersSchema = validateUsersSchema;
