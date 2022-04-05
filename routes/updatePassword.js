const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { verifyAuthorization } = require("../middleware/auth");

// Get config variables
dotenv.config();

// access secret token
const secret_token = process.env.SECRET_TOKEN;

// @Route POST /users/updatepassword
// @desc Update Password route for user
// @access Private Access

router.post("/updatepassword", verifyAuthorization, (req,res) => {
    res.send("working")
})



module.exports = router
