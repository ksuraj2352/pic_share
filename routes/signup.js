const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validateUsersSchema, User } = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("./../config/nodemailer");

// Get config variables
dotenv.config();

// access secret token
const secret_token = process.env.SECRET_TOKEN;

// @Route POST /users/signup
// @desc Registering a new user
// @access Public Access
router.post("/signup", async (req, res) => {
  try {
    //  Validating User Inputs

    const { error } = validateUsersSchema(req.body);
    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }

    // Checking email

    let user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.status(400).send({
        status: false,
        message: "User already exists",
      });
    }

    // Creating a confirmation code or token

    const token = jwt.sign(req.body.email, secret_token);

    // Creating Mongo Doc

    user = new User({
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
      activationCode: token,
    });

    // Encrypting Password

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Saving Doc and sending the activation link

    await user.save();

    // Send Activation Link

    nodemailer.sendActivationLink(
      user.fullName,
      user.email,
      user.activationCode
    );

    // Return response

    res.send({
      status: true,
      message: "Sign up Successfully. Please verify the mail.",
      email: user.email,
      fullName: user.fullName,
    });
  } catch (err) {
    console.log({ status: false, message: "Something Went wrong" });
    res.status(400).send({status : false , error : err})
  }
});

// @Route GET /users/activate/:activationId
// @desc Activating a user
// @access Public Access
router.get("/activate/:activationCode", async (req, res) => {
  try {
    // We will query DB using Activation code

    let user = await User.findOne({
      activationCode: req.params.activationCode,
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "No user Found with the given activation Code",
      });
    }

    // Change the status to true

    user.isActivated = true;

    // Saving the doc

    await user.save();

    res.send({ status: true, message: "Activated Succesfully" });
  } catch (err) {
    res.status(400).send({ status: false, message: "Something Went wrong" });
  }
});

module.exports = router;
