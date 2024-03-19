const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  description: String,
  // task has user id, which is takan from user model
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
  },
  // task has category id (assuming it belongs to only one category)
  categoryID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "category",
  },
});

module.exports = mongoose.model("task", schema);
