const express = require("express");
const {
  addRegistration,
  getRegistrations,
  getUserRegistrations,
  changeRegistrationDate,
  changeRegistrationStatus,
  cancelRegistration,
} = require("../controllers/registrationController");
const { protect } = require("../middlewares/auth");
const { allowAccessTo } = require("../middlewares/roleAccess");
const {
  validateRegistration,
  validateRegistrationStatus,
} = require("../validators/registration");
const validatePagination = require("../validators/pagination");
const validate = require("../middlewares/validate");

const router = express.Router();

// Admin
router
  .route("/")
  .get(
    protect,
    allowAccessTo("admin"),
    validatePagination,
    validate,
    getRegistrations
  );
router
  .route("/:registrationId/status")
  .patch(
    protect,
    allowAccessTo("admin"),
    validateRegistrationStatus,
    validate,
    changeRegistrationStatus
  );

// User
router
  .route("/user/:userId")
  .get(protect, validatePagination, validate, getUserRegistrations);
router
  .route("/")
  .post(protect, validateRegistration, validate, addRegistration);
router.route("/:registrationId/date").patch(protect, changeRegistrationDate);
router.route("/:registrationId").delete(protect, cancelRegistration);

module.exports = router;
