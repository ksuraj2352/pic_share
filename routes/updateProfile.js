const express = require("express");
const { User, validateProfile } = require("../models/user");
const router = express.Router();
const dotenv = require("dotenv");
const { verifyAuthorization } = require("../middleware/auth");
const multer = require("multer");
const AWS = require("aws-sdk");

// Get config variables
dotenv.config();

// AWS setup
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// for uploading file
const storage = multer.memoryStorage({
  dest: function(req, file, callback) {
    callback(null, "");
  },
});

// Checking the file is type is valid or not
const fileChecker = (req, file, cb) => {
  const regularExp = new RegExp(/\.(gif|jpe?g|tiff?|png)$/i);
  const isImage = regularExp.test(file.originalname);
  console.log(file.originalname);
  console.log(isImage);
  if (isImage) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//  Configuring the uploader
const upload = multer({ storage: storage, fileFilter: fileChecker });

// @Route POST /users/changeprofilepic
// @desc Change Profile Pic
// @access Private Access
router.post(
  "/updateprofilepic",
  verifyAuthorization,
  upload.single("image"),
  async (req, res) => {
    //  Checking User
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(400).send({
        status: false,
        message: "No user Found.",
      });
    }

    console.log(req.file);
    // Checking the file exist or not
    if (!req.file || req.file === undefined) {
      return res.status(400).send({
        status: false,
        message: "Not type of image",
      });
    }

    const fileName = `${Date.now()}${req.file.originalname}`;

    // Creating Params
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
    };

    // S3 Uploader
    s3.upload(params, async (error, data) => {
      if (error) {
        return res.status(400).send({ status: false, error });
      }
      //  Updating Profile Pic Link
      user.profilePic = data.Location;
      // Saving The doc
      await user.save();
      // Throwing Result
      res.send({ status: true, user });
    });
  }
);

// @Route POST /users/updateProfile
// @desc Update Profile Data
// @access Private Access
router.post("/updateprofile", verifyAuthorization, async (req, res) => {
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

  // Checking and updating values

  if (req.body.fullName) {
    user.fullName = req.body.fullName;
  }

  if (req.body.age) {
    user.age = req.body.age;
  }

  if (req.body.gender) {
    user.gender = req.body.gender;
  }

  if (req.body.phoneNumber) {
    const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    if (!regex.test(req.body.phoneNumber)) {
      return res.status(400).send({
        status: false,
        message: "Phone Number is not valid ",
      });
    }

    const phoneCheck = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    // console.log(phoneCheck);
    if (phoneCheck) {
      return res.status(400).send({
        status: false,
        message: "This phone number is linked with someone else's profile.",
      });
    }
    user.phoneNumber = req.body.phoneNumber;
  }

  await user.save();
  res.send({ status: true, user });
});

module.exports = router;

// hmum log aisa kr skte he ki hum profile pic jb naya upload hoga purana wala ko delete kr skte he
// view picture ke liye v ek route create krna he
//  Error handling krna he ya fir try catch block use krna hoga
//  Unfollow a user
