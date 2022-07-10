const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const db = require("./db/mongo");
const helmet = require("helmet");
const cors = require("cors");

const indexRouter = require("./routes/index");
const employeesRouter = require("./routes/employees");

const app = express();
//allow all traffic
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use("/", indexRouter);
app.use("/employees", employeesRouter);

module.exports = app;
