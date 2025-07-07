const { body } = require("express-validator");

const validateDate = [
  body("dates")
    .notEmpty()
    .withMessage("Date is required")
    .isArray()
    .withMessage("Dates must be an array"),

  // Check each date in the array
  body("dates.*")
    .isISO8601()
    .withMessage("Each date must be a valid ISO8601 date"),
];

const validateUpdatedDate = [
  body("dates").optional().isArray().withMessage("Dates must be an array"),

  body("dates.*")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO8601 date"),
];

module.exports = { validateDate, validateUpdatedDate };
