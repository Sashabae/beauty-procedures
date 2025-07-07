const express = require("express");
const {
  getDates,
  addDates,
  removeDate,
} = require("../controllers/dateController");
const { allowAccessTo } = require("../middlewares/roleAccess");
const { protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { validateDate } = require("../validators/date");

const router = express.Router();

router.route("/:serviceId").get(getDates);
router
  .route("/:serviceId")
  .post(protect, allowAccessTo("admin"), validateDate, validate, addDates);
router
  .route("/delete/:dateId")
  .delete(protect, allowAccessTo("admin"), removeDate);

module.exports = router;
