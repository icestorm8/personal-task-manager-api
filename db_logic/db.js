const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME; // collection name

function connect() {
  // conecting to project's db
  try {
    // check if db connection was successful
    mongoose.connect(uri, {
      dbName,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

function disconnect() {
  // disconnecting from db
  try {
    mongoose.connection.close();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

// export functions to be used throughout app
module.exports = {
  connect,
  disconnect,
};
