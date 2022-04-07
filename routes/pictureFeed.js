const express = require("express");
const { verifyAuthorization } = require("../middleware/auth");
const { Picture } = require("../models/picture");
const { User } = require("../models/user");
const router = express.Router();

// @Route GET /picturefeed
// @desc List all pics of a user's followings
// @access Private Access
router.get("/", verifyAuthorization, async (req, res) => {
  //  Checking User
  const user = await User.findById(req.user.user_id);
  if (!user) {
    return res.status(400).send({
      status: false,
      message: "No user Found.",
    });
  }

  //   Validating that user have FOLLOWINGS
  const followings = user.followings;
  if (followings.length === 0 || !followings) {
    return res.status(400).send({
      status: false,
      message: "Follow someone first.",
    });
  }

  //   Getting pics of the FOLLOWINGS user
  let pics = [];
  await Promise.all(
    followings.map(async (followingId) => {
      const pic = await Picture.find({
        userId: followingId,
      });
      pics.push(pic);
    })
  );

  //   Throw Result
  res.send({
    status: true,
    feed: pics,
  });
});

module.exports = router;
