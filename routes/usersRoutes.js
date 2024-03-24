const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const auth = require("../middlewares/auth");

// signup (post)
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
    if (givenPass === "" || req.body.email === "" || req.body.name === "") {
      res.send("all details (name, email, password) must be filled in");
      return;
    }
    if (!givenPass || !req.body.email || !req.body.name) {
      res.send("problem with request - parameters missing");
      return;
    }
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

// login (post)
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

// view current user name (as logged user) (get)
router.get("/whoami", auth, (req, res) => {
  res.send(req.user.name);
});

// only an admin (manually changed to an admin from db) can watch all users (get)
router.get("/", auth, async (req, res) => {
  if (req.user.isAdmin) {
    var users = await User.find(); // should this include the admin user?
    if (!users) {
      res.status(200).send("no users exist yet");
      return;
    }
    res.json(users);
  } else {
    res.status(403).send("access denied");
  }
});

// only admin can view user details (by it's id) (get)
router.get("/:userID", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      var userID = req.params.userID;
      var user = await User.findById(userID);

      if (user) {
        res.status(200).json(user);
        return;
      }
      res.status(404).send("user with id stated wasn't found");
      return;
    } else {
      res.status(403).send("access denied");
    }
  } catch (err) {
    res.send("bad id");
  }
});

// only admin can view user details (by it's email) (get)
router.get("/:email", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      var email = req.params.email;
      var user = await User.findOne({ email: email });

      if (user) {
        res.status(200).json(user);
        return;
      }
      res.status(404).send("user with email stated wasn't found");
      return;
    } else {
      res.status(403).send("access denied");
    }
  } catch (err) {
    res.send("err");
  }
});

// only admin can remove a user (by it's id) (delete)
router.delete("/:userID", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      var userID = req.params.userID;
      var user = await User.findById(userID);

      if (user) {
        user = await User.deleteOne({ _id: userID });
        res.status(200).send(`user with id ${userID} was removed`);
        return;
      }
      res.status(404).send("user with id stated wasn't found");
      return;
    } else {
      res.status(403).send("access denied");
    }
  } catch (err) {
    res.send("bad id");
  }
});

// every logged in user can change it's details (but which? ) - must finish this!!
router.patch("/edit", auth, async (req, res) => {
  var loggedUser = req.user;
  var givenName = req.body.name;
  var givenPassword = req.body.password;
  if (givenPassword === "") {
    res.send("password must contain at least one char");
    return;
  }
  try {
    await User.updateOne(
      { _id: req.user.id },
      {
        name: givenName,
        password: await bcrypt.hash(givenPassword, 10),
      }
    );

    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      const dataForToken = {
        name: user.name,
        email: user.email,
        id: user._id,
        isAdmin: user.isAdmin,
      };
      const token = jwt.sign(dataForToken, "175"); // generate new token
      res.json({ token: token, user: user }); // new token since we want to see the changes (who am i shows the logged in user but it's old name, since it's the old token) and the user we view is the one saved on our request (details from jwt)
      return;
    } else {
      res.send("something went wrong");
    }
  } catch (err) {
    res.send("something went wrong");
  }
  // which details should i allow the user to change?
});

module.exports = router;
