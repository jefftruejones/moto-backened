const employeeModel = require("../models/models");
//function that formats date to MM-DD-YYYY
function getFormattedDate(date) {
  let year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return month + "/" + day + "/" + year;
}

//create a new employee
const create = async (request, response) => {
  try {
    const input = request.body;
    //regex to verify date format MM-DD-YYY
    var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!date_regex.test(input.DateOfBirth)) {
      throw new Error("Date must be formatted MM-DD-YYYY");
    }

    let date = new Date();
    let dateOfHire = getFormattedDate(date);

    input.Status = "ACTIVE";
    input.DateOfEmployment = dateOfHire;
    const employee = new employeeModel(input);
    //save employee in DB
    await employee.save();
    response.send(employee);
  } catch (error) {
    response.status(400).send(error.message);
  }
};
//get employee by id
const read = async (request, response) => {
  try {
    const employee = await employeeModel.findOne({ _id: request.params.id });
    //check to see if employee exists
    if (employee.Status === "INACTIVE") {
      throw new Error("employee has been deleted");
    } else {
      response.send(employee);
    }
  } catch (error) {
    response.status(400).send(error.message);
  }
};
//update specific employee
const update = async (request, response) => {
  try {
    const input = request.body;
    const employee = await employeeModel.findOne({ _id: request.params.id });
    //update employee fields
    employee.FirstName = input.FirstName ? input.FirstName : employee.FirstName;
    employee.MiddleInitial = input.MiddleInitial
      ? input.MiddleInitial
      : employee.MiddleInitial;
    employee.LastName = input.LastName ? input.LastName : employee.LastName;

    await employee.save();
    response.send(employee);
  } catch (error) {
    response.status(500).send(error);
  }
};
//delete employee
const destroy = async (request, response) => {
  try {
    if (request.headers.authorization != "password") {
      throw new Error("Authorization header required");
    }
    const employee = await employeeModel.findOne({ _id: request.params.id });

    if (employee.Status === "INACTIVE") {
      throw new Error("Employee already deleted");
    }
    //change employee status to inactive
    employee.Status = "INACTIVE";

    await employee.save();
    response.status(204).send(employee);
  } catch (error) {
    response.status(400).json(error.message);
  }
};
//list all employees
const list = async (request, response) => {
  const { page = 1, limit = 10, include = false } = request.query;
  try {
    //find employees in pages - default is one page with 10 results
    const employees = await employeeModel
      .find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await employeeModel.countDocuments();
    //return employees with active and inactive status
    if (include === "true") {
      response.json({
        employees,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } else {
      //only return employees with active status
      const filteredemployees = employees.filter(
        (employee) => employee.Status === "ACTIVE"
      );
      response.json({
        filteredemployees,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    }
  } catch (error) {
    response.status(500).send(error.message);
  }
};

module.exports = {
  create,
  read,
  update,
  destroy,
  list,
};
