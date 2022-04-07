const express = require("express");
const { verifyAuthorization } = require("../middleware/auth");
const { Picture } = require("../models/picture");
const { User } = require("../models/user");
const router = express.Router();

// @Route GET /picturefeed?page=1
// @desc List all pics of a user's followings(Not more than 5)
// @access Private Access
router.get("/", verifyAuthorization, async (req, res) => {
  // Pagination Data
  const pageNumber = req.query.page;
  const pageSize = 5;
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
  const pics = await Picture.find({ userId: followings })
    .sort({ _id: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  // Throw Result
  res.send({
    status: true,
    feed: pics,
  });
});

module.exports = router;
