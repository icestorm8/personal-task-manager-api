const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

// router.get("/", (req, res) => {
//   res.send("<h1>welcome to categories</h1>");
// });

router.get("/", auth, (req, res) => {
  // print all catagories - are categories different between users? in that case those should have user id?
  res.send("<h1>welcome to categories</h1>");
});

router.get("/:categoryName", auth, (req, res) => {
  const categoryName = req.params.categoryName;
  // print all notes in category specified
  res.send(`<h1>all your notes in ${categoryName}</h1>`);
});

router.post("/createNew", auth, (req, res) => {
  res.send("<h1>create new category</h1>");
});

// create category
// delete category
// update category
// view categories
// view notes in specific category
module.exports = router;
