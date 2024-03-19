const express = require("express");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
const router = express.Router();
// const auth = require('../middlewares/auth');

router.get("/", (req, res) => {
  res.send("<h1>welcome to users</h1>");
});
// create user - signup
// get user - login
// delete user - remove user from db
// update user - change details (like password but not unique details)

module.exports = router;
