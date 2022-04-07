const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const dotenv = require("dotenv");
const { verifyAuthorization } = require("../middleware/auth");
const multer = require("multer");
const AWS = require("aws-sdk");
const { Picture } = require("../models/picture");

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

// @Route POST /picture/upload
// @desc Posting a pic
// @access Private Access
router.post(
  "/upload",
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
        return res.status(400).send({
          status: false,
          error,
        });
      }

      // Creating Mongo Doc
      const picture = new Picture({
        pictureLocation: data.Location,
        pictureName: data.Key,
        userId : user._id
      });

      //  Pushing the Object ID of the pictures to the user
      user.pictures.push(picture._id);

      //  Saving the doc
      await picture.save();
      await user.save();

      //   Throwing Response
      res.send({
        status: true,
        picture,
      });
    });
  }
);

module.exports = router;
