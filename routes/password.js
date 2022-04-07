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

  res.send({
    status: true,
    message: "Password changed successfully",
    email: user.email,
  });
});

module.exports = router;
