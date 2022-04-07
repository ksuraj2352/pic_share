const express = require("express");
const { verifyAuthorization } = require("../middleware/auth");
const { User } = require("../models/user");
const router = express.Router();

// @Route GET /search?username=nobita
// @desc Searching Users using their username
// @access Private Access
router.get("/", verifyAuthorization, async (req, res) => {
  // Storing query
  const search = req.query.username;

  //   Checking User
  const user = await User.findById(req.user.user_id);
  if (!user) {
    return res.status(400).send({
      status: false,
      message: "No user Found.",
    });
  }

  //  Searching Users
  const allUsers = await User.find({ username: new RegExp(search) });

  if (allUsers.length == 0) {
    return res.status(400).send({
      status: false,
      message: "No users found with the given username",
    });
  }

  //   Throwing Results
  res.send({ status: true, allUsers });
});

module.exports = router;
