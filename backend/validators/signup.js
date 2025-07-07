const { body } = require("express-validator");
const { getUserByEmail } = require("../models/userModel");

const validateNewUser = [
  // Check if body is not empty
  body().notEmpty().withMessage("Body cannot be empty"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .custom(async (value, { req }) => {
      const existingUser = await getUserByEmail(value);

      if (existingUser) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
    )
    .custom((value, { req }) => {
      if (value !== req.body.passwordconfirm) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

module.exports = validateNewUser;
