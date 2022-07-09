//Import the mongoose module
const mongoose = require("mongoose");
const config = require("../config/vars");

//Set up default mongoose connection
const mongoDB = config.mongodb;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Get the default connection
const db = mongoose.connection;

module.exports = db;
