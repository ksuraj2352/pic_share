const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validateUsersSchema, User } = require("../models/user");

// @Route POST /users/signup
// @desc Registering a new user
// @access Public Access
router.post("/signup", async (req, res) => {
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

  // Creating Mongo Doc

  user = new User({
    email: req.body.email,
    password: req.body.password,
    fullName: req.body.fullName,
  });

  // Encrypting Password

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Saving Doc

  await user.save();

  // Return response

  res.send({
    status: true,
    message: "Sign up Successful.",
    email: user.email,
    fullname: user.fullName,
  });

});

module.exports = router;
