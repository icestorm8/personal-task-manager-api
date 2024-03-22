const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean,
});

module.exports = mongoose.model("user", schema);
