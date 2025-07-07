const { body } = require("express-validator");

const validateRegistration = [
  body("date_id")
    .notEmpty()
    .withMessage("Date ID is required")
    .isInt({ min: 1 })
    .withMessage("Date ID must be a positive integer"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed"])
    .withMessage("Status must be 'pending' or 'confirmed'"),
];

const validateRegistrationStatus = [
  body("newStatus")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "confirmed"])
    .withMessage("Status must be 'pending' or 'confirmed'"),
];

module.exports = { validateRegistration, validateRegistrationStatus };
