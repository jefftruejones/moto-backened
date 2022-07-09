require("dotenv").config();

const vars = {
  mongodb: process.env.MONGO,
};

module.exports = vars;
