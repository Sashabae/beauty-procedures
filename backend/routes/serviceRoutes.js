const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect } = require("../middlewares/auth");
const { allowAccessTo } = require("../middlewares/roleAccess");
const validate = require("../middlewares/validate");
const { validateService, validateUpdatedService } = require("../validators/service");
const validatePagination = require("../validators/pagination");
const normalizeDates = require("../middlewares/normalizeDates");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router
  .route("/")
  .get(validatePagination, validate, getAllServices)
  .post(
    protect,
    allowAccessTo("admin"),
    upload.single("image"),
    normalizeDates,
    validateService,
    validate,
    createService
  );

router
  .route("/:serviceId")
  .get(getServiceById)
  .patch(
    protect,
    allowAccessTo("admin"),
    upload.single("image"),
    normalizeDates,
    validateUpdatedService,
    validate,
    updateService
  )
  .delete(protect, allowAccessTo("admin"), deleteService);

module.exports = router;
