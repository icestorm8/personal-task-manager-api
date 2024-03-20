const express = require("express");
const Task = require("../models/Task");
const Category = require("../models/Category");
const router = express.Router();
const auth = require("../middlewares/auth");

// tasks can be accessed only by a logged in user (aka after auth)

// router.get("/", (req, res) => {
//   res.send("<h1>welcome to tasks</h1>");
// });

// view all tasks
router.get("/", auth, async (req, res) => {
  try {
    console.log(req.user.name);
    const tasks = await Task.find({ userID: req.user.id }); // find tasks related to this logged in user by it's id
    if (tasks.length == 0) {
      res.send(`no tasks were found for user ${req.user.name}`);
    } else {
      res.json(tasks);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// create task
router.post("/create", auth, async (req, res) => {
  //   const categoryId = await Category.findOne({ title: req.categoryName });
  // categoryId would be "undefined" if no category matched the title entered
  var newTask = {
    title: req.body.title,
    description: req.body.description,
    userID: req.user.id,
    // // task has category id (assuming it belongs to only one category)
    // categoryID: categoryId, This can be undefined or null
  };

  const categoryName = req.body.category_name;
  console.log(categoryName);
  // check if i got a category name in my req body:
  if (categoryName) {
    let category = await Category.findOne({ title: categoryName }); // search for category by the title given in my categories
    if (!category) {
      // Create a new category if it doesn't exist
      try {
        category = { title: categoryName };
        await Category.create(category);
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      }
    }
    newTask.categoryID = category._id; // save id of newly created category to task
  }
  try {
    await Task.create(newTask);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
// read task
// delete task
// update task

module.exports = router;
