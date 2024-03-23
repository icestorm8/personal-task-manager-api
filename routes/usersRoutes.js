const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const auth = require("../middlewares/auth");

// router.get("/", (req, res) => {
//   res.send("<h1>welcome to users</h1>");
// });

// signup - change so admin can enter
router.post("/", async (req, res) => {
  var alreadyExists = await User.findOne({ email: req.body.email });
  // console.log(alreadyExists);
  if (alreadyExists) {
    res
      .status(400)
      .send("email already taken. if you already have an account - log in");
    return;
  } else {
    const givenPass = req.body.password;

    const hashedPass = await bcrypt.hash(givenPass, 10);

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
      isAdmin: false, // to change this you have to have access to db and change manualy
    };

    try {
      await User.create(newUser);
      res.sendStatus(201);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
});

router.post("/login", async (req, res) => {
  const givenEmail = req.body.email;
  const givenPass = req.body.password;

  const user = await User.findOne({ email: givenEmail });

  if (!user) {
    res.status(404).send("unknown email");
    return;
  }

  const hashedPass = user.password;

  if (!(await bcrypt.compare(givenPass, hashedPass))) {
    res.status(403).send("bad password");
    return;
  }

  // data that will be kept in token
  const dataForToken = {
    name: user.name,
    email: user.email,
    id: user._id,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(dataForToken, "175");

  res.json({ token });
});

router.get("/whoami", auth, (req, res) => {
  res.send(req.user.name);
});

router.get("/all", auth, async (req, res) => {
  if (req.user.isAdmin) {
    var users = await User.find(); // should this include the admin user?
    if (!users) {
      res.status(200).send("no users exist yet");
      return;
    }
    res.json(users);
    return;
  } else {
    res.status(403).send("access denied");
  }
});

// router.delete("/delete/:userID", async (req, res)=>{
  
// })

router.patch("/edit", auth, (req, res)=>{
  
})
// create user - signup
// get user - login
// delete user - remove user from db
// update user - change details (like password but not unique details)

module.exports = router;
