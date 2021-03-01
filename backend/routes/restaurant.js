const { Restaurant } = require("../models/restaurant");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const restaurantList = await Restaurant.find({ registered: true }).select("-_id");
  if (!restaurantList) {
    res.status(500).json({ success: false });
  } else {
    res.send(restaurantList);
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Restaurant Id");
  }

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    res.status(500).json({ success: false });
    res.send(err);
  }
  res.send(restaurant);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Restaurant Id");
  }
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    {
      registered: req.body.registered,
      max_capacity: req.body.max_capacity,
      current_capacity: req.body.current_capacity,
      location_latitude: req.body.location_latitude,
      location_longitude: req.body.location_longitude,
      img_src: req.body.img_src,
      icon_arr: req.body.icon_arr,
      msg: req.body.msg,
    },
    { new: true }
  );
  res.send("Updated!");
});

module.exports = router;
