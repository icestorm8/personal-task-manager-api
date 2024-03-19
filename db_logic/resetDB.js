const db = require("./db");
const User = require("./models/User");
const Task = require("./models/Task");
const Category = require("./models/Category");

main(); // reset the db by clearing all collections and inserting sample documents

async function main() {
  db.connect();

  console.log("deleting all users...");
  await User.deleteMany({});
  console.log("done");

  console.log("deleting all tasks...");
  await Task.deleteMany({});
  console.log("done");

  console.log("deleting all categories...");
  await Category.deleteMany({});
  console.log("done");

  // insert sample data here
  //   console.log("inserting users sample...");
  //   await Product.insertMany(sampleProducts);
  //   console.log("done");

  db.disconnect();
}
