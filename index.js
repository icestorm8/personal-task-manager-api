require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./db_logic/db");
app.use(express.json()); // instead of body parser

app.get("/", (req, res) => {
  res.send("<h1>welcome to task mangaer</h1>");
});
app.use("/users", require("./routes/usersRoutes"));
app.use("/tasks", require("./routes/tasksRoutes"));
app.use("/categories", require("./routes/categoryRoutes"));

app.get("*", function (req, res) {
  res.status(404).send("<h1>404 page not found</h1>");
});

db.connect(); // connect to db
app.listen(port, () => {
  console.log(`listens on port ${port}`);
});
