const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Task = require("../models/Task");
const Category = require("../models/Category");

// logical problem!!
// are categories different between users? in that case those should have user id????
// how can i do that without repeating categories with different user id's?

// ----- currently categories are shared and would be shown to all users (when adding new one or deleting) -----

// print all catagories
router.get("/", auth, async (req, res) => {
  try {
    var categories = await Category.find();
    if (categories) {
      res.json(categories);
    } else {
      res.send("no categories were found");
    }
  } catch (err) {
    res.json(err);
  }
});

// watch all logged in user's tasks in specified category
router.get("/:categoryName", auth, async (req, res) => {
  // to check with spaces pass firstword%20secondword...
  const categoryName = req.params.categoryName;
  // print all notes in category specified
  try {
    var category = await Category.findOne({ title: categoryName }); // find category by name
    if (category) {
      // were category id and user id match current search and logged in user
      var tasks = await Task.find({
        categoryID: category._id,
        userID: req.user.id,
      });
      if (tasks.length > 0) {
        res.json(tasks);
      } else {
        res.send(`no tasks were found in category '${categoryName}'`);
      }
    } else {
      res.send(`category '${categoryName}' wasn't found`);
    }
  } catch (err) {
    res.json(err);
  }
});

// create a new category (send title in req body)
router.post("/", auth, async (req, res) => {
  var categoryName = req.body.title;
  // Create a new category if it doesn't exist
  if (!categoryName) {
    res.send("category_name wasn't stated");

    return;
  }
  try {
    var category = await Category.findOne({ title: categoryName }); // search for category by the title given in my categories
    if (!category) {
      category = { title: categoryName };
      await Category.create(category);
      res.status(200).send("category created");
    } else {
      res.send("category in this name already exists");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// delete a category by it's name
router.delete("/:categoryName", auth, async (req, res) => {
  // currently when deleting a category, if its linked - i wouldn't be able to search by it anymore, hance i wouldn't see the tasks inside but i would see it in all of my tasks, tho the id of the category will still be there?
  var categoryName = req.params.categoryName;
  try {
    var category = await Category.findOne({ title: categoryName });
    if (category) {
      category = await Category.deleteOne({ _id: category._id });
      res.status(200).send(`category '${categoryName} 'was deleted`); // what happens to tasks inside it when deleting a category?
      return;
    }
    res.send(`category "${categoryName}" wasn't found`);
  } catch (err) {
    res.json(err);
  }
});

// change the title of the category by it's name
router.patch("/:categoryName", auth, async (req, res) => {
  const categoryName = req.params.categoryName;
  var title = req.body.title; // get title to change to
  if (!title) {
    res.send("missing parameters");
    return;
  }
  try {
    var category = await Category.findOne({ title: categoryName }); // get category that needs to update by it's name
    if (category) {
      await Category.updateOne({ _id: category._id }, { title: title });
      res
        .status(200)
        .send(`category ${category.title} was modified to ${title}`);
      return;
    } else {
      res.send(`category "${categoryName}" wasn't found`);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("something went wrong");
    return;
  }

  try {
    await Task.updateOne(
      { _id: taskID },
      {
        title: title,
        description: description,
        categoryID: category._id,
      }
    );
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
