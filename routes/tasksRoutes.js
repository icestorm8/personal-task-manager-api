const express = require("express");
const Task = require("../models/Task");
const Category = require("../models/Category");
const router = express.Router();
const auth = require("../middlewares/auth");

// tasks can be accessed only by a logged in user (aka after auth)

// read out of my own tasks by id
router.get("/:taskID", auth, async (req, res) => {
  var taskID = req.params.taskID;
  try {
    var task = await Task.findOne({ _id: taskID }); // find tasks related to this logged in user by it's id
    if (!task) {
      res.status(404).send(`task wasn't found`);
      return;
    } else {
      if (task.userID !== req.user.id) {
        res.status(404).send("task wasn't found");
      }
      res.status(200).json(task);
    }
  } catch (err) {
    res.status(500).send("<h1>bad id</h1>");
  }
});

// view all logged in user's tasks
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

// create task as logged in user
router.post("/", auth, async (req, res) => {
  //   const categoryId = await Category.findOne({ title: req.categoryName });
  // categoryId would be "undefined" if no category matched the title entered
  var newTask = {
    title: req.body.title,
    description: req.body.description,
    userID: req.user.id,
    // // task has category id (assuming it belongs to only one category)
    // categoryID: categoryId, This can be undefined or null
  };

  var categoryName = req.body.category_name;
  // not mandatory to add category
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

// remove task by it's id as long as it belongs to loged in user
router.delete("/:taskID", auth, async (req, res) => {
  const taskID = req.params.taskID;
  try {
    let task = await Task.findOne({ _id: taskID });
    if (task) {
      if (task.userID === req.user.id) {
        task = await Task.deleteOne({ _id: taskID });
        res
          .status(200)
          .send(`<h1>task with id ${taskID} was deleted successfuly</h1>`);
      } else {
        // user tried to delete item that doesn't belong to it
        res.status(404).send("task wasn't found");
      }
    } else {
      res.status("task wasn't found");
    }
  } catch (err) {
    res.send(err);
  }
});

// update task's details (title, desctiption, category)
router.patch("/:taskID", auth, async (req, res) => {
  var taskID = req.params.taskID;
  var title = req.body.title;
  var description = req.body.description;
  var categoryName = req.body.category_name;

  try {
    let task = await Task.findOne({ _id: taskID });
    if (!task) {
      console.log("task not found");
      res.status(404).send("<h1>task wasn't found</h1>");
      return;
    }
    if (task && task.userID != req.user.id) {
      console.log("access denied");
      res.status(404).send("<h1>task wasn't found</h1>");
      return;
    }
  } catch (err) {
    res.status(400).send("<h1>bad id</h1>");
  }

  try {
    var category = await Category.findOne({ title: categoryName });
    // console.log(category);
    if (!category) {
      res
        .status(400)
        .send("<h1>category id wasn't found. 0 tasks were modified</h1>");
      return;
    }

    await Task.updateOne(
      { _id: taskID },
      {
        title: title,
        description: description,
        categoryID: category._id,
      }
    );
    res.status(200).send("<h1>task was modified</h1>");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
