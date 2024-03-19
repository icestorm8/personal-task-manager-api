const mongoose = require("mongoose");

const uri = `mongodb://127.0.0.1:27017`;
const dbName = "taskManager"; // collection name

function connect() {
  // conecting to project's db
  mongoose.connect(uri, {
    dbName,
  });
}

function disconnect() {
  // disconnecting from db
  mongoose.connection.close();
}

// export functions to be used throughout app
module.exports = {
  connect,
  disconnect,
};
