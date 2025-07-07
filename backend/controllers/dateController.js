const {
  getDatesByServiceId,
  createDates,
  deleteDate,
} = require("../models/dateModel");
const AppError = require("../utils/appError");

// GET
exports.getDates = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const dates = await getDatesByServiceId(serviceId);

    if (!dates || dates.length === 0) {
      throw new AppError("No dates found for this service", 404);
    }

    res.status(200).json({
      status: "success",
      data: dates,
    });
  } catch (error) {
    next(error);
  }
};

// POST
exports.addDates = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { dates } = req.body;

    if (!Array.isArray(dates)) {
      throw new AppError("Dates must be an array", 400);
    }

    for (const date of dates) {
      if (isNaN(Date.parse(date))) {
        throw new AppError(`Invalid date format: ${date}`, 400);
      }
    }

    const createdDates = await createDates(serviceId, dates);

    res.status(201).json({
      status: "success",
      data: createdDates,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.removeDate = async (req, res, next) => {
  try {
    const { dateId } = req.params;

    const deleted = await deleteDate(dateId);

    if (!deleted) {
      throw new AppError("Date not found", 404);
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
