const express = require("express");
const { default: mongoose } = require("mongoose");
const { verifyAuthorization } = require("../middleware/auth");
const { User } = require("../models/user");
const router = express.Router();

// @Route GET /follow/:id
// @desc Follow a user
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
      message: "Incorrect Object Id",
    });
  }

  //   Checking that user followed and following user is same or not
  if (req.user.user_id == req.params.id) {
    return res
      .status(400)
      .send({ status: false, message: "User can't followed themselves." });
  }

  // Finding the user , whom to be followed
  const followedUser = await User.findById(req.params.id);

  // Checking followed User
  if (!followedUser) {
    return res.status(400).send({
      status: false,
      message: "No Followed User Found",
    });
  }

  //  Checking that user is already followed or not

  const alreadyFollowed = user.followings.includes(req.params.id);
  if (alreadyFollowed) {
    return res.status(400).send({ status: false, message: "Already Followed" });
  }
  //   console.log(alreadyFollowed);

  //   Pushing the datas

  user.followings.push(followedUser._id);
  followedUser.followers.push(req.user.user_id);

  //   Saving the doc
  await user.save();
  await followedUser.save();

  //    Throwing Res
  res.send({
    status: true,
    user,
  });
});

module.exports = router;

//  ek user dusre user ko do bar follow na kre
// user apne aap ko follow na kr paye
