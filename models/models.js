const mongoose = require("mongoose");
//employee schema
const EmployeeSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  MiddleInitial: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  DateOfBirth: {
    type: String,
    required: true,
  },
  DateOfEmployment: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
