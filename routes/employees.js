const express = require("express");
const router = express.Router();
const controller = require("../controllers/employees.controller");
const { validate } = require("express-validation");
const {
  update,
  create,
  destroy,
  read,
} = require("../validations/users.validation");

router
  .route("/")
  .get(controller.list)
  .post(validate(create), controller.create);

router
  .route("/:id")
  .get(validate(read), controller.read)
  .put(validate(update), controller.update)
  .delete(validate(destroy), controller.destroy);

module.exports = router;
