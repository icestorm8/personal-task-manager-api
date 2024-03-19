const express = require("express");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
const router = express.Router();
// const auth = require('../middlewares/auth');

// tasks can be accessed only by a logged in user (aka after auth)

router.get("/", (req, res) => {
  res.send("<h1>welcome to tasks</h1>");
});
// create task
// read task
// delete task
// update task

module.exports = router;
