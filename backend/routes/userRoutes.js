const express = require("express");
const {
  signup,
  login,
  logout,
  getMe,
} = require("../controllers/userController");
const validateNewUser = require("../validators/signup");
const validateLogin = require("../validators/login");
const validate = require("../middlewares/validate");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/signup").post(validateNewUser, validate, signup);
router.route("/login").post(validateLogin, validate, login);
router.route("/logout").get(protect, logout);
router.route("/me").get(protect, getMe);

module.exports = router;
