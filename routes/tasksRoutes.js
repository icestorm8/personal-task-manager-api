const express = require("express");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
const router = express.Router();
// const auth = require('../middlewares/auth');

// tasks can be accessed only by a logged in user (aka after auth)

// router.get("/", (req, res) => {
//   res.send("<h1>welcome to tasks</h1>");
// });

router.get("/", auth, async (req, res) => {
  try {
    console.log(req.user.id);
    const tasks = await Task.find({ userID: req.user.id }); // find tasks related to this logged in user by it's id
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
// create task
// read task
// delete task
// update task

module.exports = router;
