const Joi = require("joi");

module.exports = {
  update: {
    body: Joi.object({
      FirstName: Joi.string(),
      MiddleInitial: Joi.string(),
      LastName: Joi.string(),
    }).unknown(),
  },
  destroy: {
    headers: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  read: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  create: {
    body: Joi.object({
      FirstName: Joi.string().required(),
      MiddleInitial: Joi.string().required(),
      LastName: Joi.string().required(),
      DateOfBirth: Joi.string().required(),
    }),
  },
};
