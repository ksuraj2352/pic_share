const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyAuthorization } = require("../middleware/auth");
const { User } = require("../models/user");
const router = express.Router();

// @Route GET /unfollow/:id
// @desc Unollow a user
// @access Private Access
router.get("/:id", verifyAuthorization, async (req, res) => {
  //  Checking User
  const user = await User.findById(req.user.user_id);
  if (!user) {
    return res.status(400).send({
      status: false,
      message: "No user Found.",
    });
  }

  // Validating the object ID
  const validObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  console.log(validObjectId);

  if (!validObjectId) {
    return res.status(400).send({
      status: false,
      message: "Incorrect unfollower Id",
    });
  }

  //   Checking that user unfollowed and unfollowing user is same or not
  if (req.user.user_id == req.params.id) {
    return res
      .status(400)
      .send({ status: false, message: "User can't unfollowed themselves." });
  }

  // Finding the user , whom to be followed
  const unFollowedUser = await User.findById(req.params.id);

  // Checking followed User
  if (!unFollowedUser) {
    return res.status(400).send({
      status: false,
      message: "No Unfollowed User Found",
    });
  }

  //  Checking that user is already followed or not
  const alreadyUnfollowed = user.followings.includes(req.params.id);
  if (!alreadyUnfollowed) {
    return res
      .status(400)
      .send({ status: false, message: "Already Unfollowed" });
  }

  //   Pushing the datas
  await User.findOneAndUpdate(
    { _id: user._id },
    { $pull: { followings: req.params.id } }
  );

  await User.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { followers: user._id } }
  );

  //   Saving the doc
  await user.save();

  //    Throwing Res
  res.send({
    status: true,
    user,
  });
});

module.exports = router;
