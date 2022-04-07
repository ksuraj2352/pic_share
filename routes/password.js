const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  validateUsersSchema,
  User,
  validateProfile,
} = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { verifyAuthorization } = require("../middleware/auth");
const { sendPasswordForgotLink } = require("../config/nodemailer");

// Get config variables
dotenv.config();

// access secret token
const secret_token = process.env.SECRET_TOKEN;

// @Route POST /password/changepassword/
// @desc Change Password
// @access Private Access
router.post("/changepassword", verifyAuthorization, async (req, res) => {
  // Checking that the request body is not empty
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      status: false,
      message: "No data provided",
    });
  }

  // Checking User
  const user = await User.findById(req.user.user_id);
  if (!user) {
    return res.status(400).send({
      status: false,
      message: "No user Found.",
    });
  }

  //  Validating user's Data
  const { error } = validateProfile(req.body);
  if (error) {
    return res.status(400).send({
      status: false,
      message: error.details[0].message,
    });
  }

  // Encrypting Password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  // Saving the pass
  user.password = password;

  //   Saving the doc
  await user.save();

  //   Throwinf response
  res.send({
    status: true,
    message: "Password changed successfully",
    email: user.email,
  });
});

// @Route POST /password/forgotpassword/
// @desc Forgot Password
// @access Public Access
router.post("/forgotpassword", async (req, res) => {
  // Checking that the request body is not empty
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      status: false,
      message: "No data provided",
    });
  }
  // Checking user exist or not
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({
      status: false,
      message: "No user found",
    });
  }

  // Creating a Reset password code or token
  const token = jwt.sign(req.body.email, secret_token);

  // Storing token in reset password code
  user.resetPasswordCode = token;

  // Saving Doc and sending the activation link
  await user.save();

  // Send Activation Link

  sendPasswordForgotLink(user.fullName, user.email, user.resetPasswordCode);

  res.send({ status: true, message: "Password reset link sent to the mail" });
});

// @Route GET /password/forgotpassword/:resetPasswordCode
// @desc Forget password Link Checker
// @access Public Access
router.get("/forgotpassword/:resetPasswordCode", async (req, res) => {
  try {
    // We will query DB using Reset code
    let user = await User.findOne({
      resetPasswordCode: req.params.resetPasswordCode,
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "No user Found with the given Reset Code",
      });
    }

    // Creating new Password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("123456", salt);

    user.password = password;

    // Saving the doc
    await user.save();

    res.send({
      status: true,
      message: "Password changed succesfully, Your new password is 123456",
    });
  } catch (err) {
    res.status(400).send({ status: false, message: "Something Went wrong" });
  }
});

module.exports = router;
