const db = require("./mongo");
const employeeModel = require("../models/models");
const data = require("./data.json");

function getFormattedDate(date) {
  let year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return month + "/" + day + "/" + year;
}

const seed = async (request, response) => {
  try {
    await Promise.all(
      data.map(async (datum) => {
        let date = new Date();
        let dateOfHire = getFormattedDate(date);
        datum.Status = "ACTIVE";
        datum.DateOfEmployment = dateOfHire;
        const employee = new employeeModel(datum);

        await employee.save();
      })
    );

    return console.log("Seeded successfully");
  } catch (error) {
    console.log(error);
  }
};

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected successfully");
});

seed();
