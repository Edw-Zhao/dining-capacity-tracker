const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
});

router.post("/signup", async (req, res) => {
  const checkUser = await User.findOne({ userName: req.body.userName });
  if (!checkUser) {
    console.log("posted!");
    let user = new User({
      userName: req.body.userName,
      passwordHash: bcrypt.hashSync(req.body.password, 8),
      facilityId: req.body.facilityId,
    });
    user = await user.save();

    if (!user) {
      return res.status(400).send("User cannot be created!");
    }

    res.send(user);
  } else {
    return res.status(403).send("User already exists!");
  }
});

router.post("/login", async (req, res) => {
  let secret = "secretsqueech";
  const user = await User.findOne({ userName: req.body.userName });

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user._id,
        facilityId: user.facilityId,
      },
      secret
    );
    res.status(200).send(token);
    //return (facverif = user.facility);
  } else {
    res.status(400).send("Incorrect credentials");
  }
});

module.exports = router;
