const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Get config variables
dotenv.config();

// access secret token
const secret_token = process.env.SECRET_TOKEN;

// @Route POST /users/login
// @desc Login route for a user
// @access Public Access
router.post("/login", async (req, res) => {
  try {
    //  User Inputs
    const { email, password } = req.body;

    // empty email and password not allowed
    if (!(email && password)) {
      return res
        .status(400)
        .send({ status: false, message: "Inputs required." });
    }

    // Check that user exist or not

    let user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Credentials" });
    }

    // Check that account is activated or not

    if (!user.isActivated) {
      return res.status(400).send({
        status: false,
        message:
          "PLease activate you account. An activation link has been sent to your Email. ",
      });
    }

    // If exist then check the password is correct or not

    if (user && (await bcrypt.compare(password, user.password))) {
      // If correct then genearte token

      const token = generateToken(user._id, email);

      // Throwing Response
      res.send({
        status: true,
        message: "Logged in Succesfully",
        token: token,
      });
    } else {
      res.status(400).send({
        status: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// generate token function
// takes _id and email as inputs
function generateToken(id, email) {
  const token = jwt.sign({ user_id: id, email }, secret_token, {
    expiresIn: "1h",
  });
  return token;
}

module.exports = router;
