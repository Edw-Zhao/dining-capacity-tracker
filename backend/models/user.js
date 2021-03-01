const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  id: { type: String, required: false },
  userName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  facilityId: { type: String, required: true },
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
