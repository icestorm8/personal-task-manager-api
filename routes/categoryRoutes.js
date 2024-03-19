const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>welcome to categories</h1>");
});
// create category
// delete category
// update category
module.exports = router;
