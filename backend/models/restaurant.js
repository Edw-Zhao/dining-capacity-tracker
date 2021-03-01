const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
  facility: String,
  permit_type: String,
  permit_status: String,
  facility_address: String,
  facility_town: String,
  registered: Boolean,
  max_capacity: Number,
  current_capacity: Number,
  location_latitude: Number,
  location_longitude: Number,
  img_src: String,
  icon_arr: Array,
  msg: String,
});

exports.Restaurant = mongoose.model("Restaurant", restaurantSchema);
