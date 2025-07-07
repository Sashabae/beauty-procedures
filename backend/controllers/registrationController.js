const {
  createRegistration,
  getAllRegistrations,
  getRegistrationsByUser,
  updateRegistrationDate,
  updateRegistrationStatus,
  deleteRegistration,
  getRegistrationById,
  getRegistrationByUserAndDate,
} = require("../models/registrationModel");
const { getDateById } = require("../models/dateModel");
const AppError = require("../utils/appError");

// POST
exports.addRegistration = async (req, res, next) => {
  try {
    const { date_id } = req.body;
    const user_id = req.user.id;

    const date = await getDateById(date_id);
    if (!date) {
      throw new AppError("Selected date does not exist", 400);
    }

    const existing = await getRegistrationByUserAndDate(user_id, date_id);
    if (existing) {
      throw new AppError("You have already registered for this date", 400);
    }

    const newReg = await createRegistration({ user_id, date_id });

    res.status(201).json({
      status: "success",
      data: newReg,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL
exports.getRegistrations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError("Page and limit must be numbers", 400);
    }

    const { registrations, totalCount } = await getAllRegistrations({
      limit,
      offset,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: "success",
      data: registrations,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET BY USER
exports.getUserRegistrations = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const page = parseInt(req.query.page) || 1; // page, default to 1
    const limit = parseInt(req.query.limit) || 10; // items per page, default to 10
    const offset = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError("Page and limit must be numbers", 400);
    }

    // If not admin, only allow viewing own registrations
    if (req.user.role !== "admin" && req.user.id !== Number(userId)) {
      throw new AppError("Not authorized to view these registrations", 403);
    }

    const { registrations, totalCount } = await getRegistrationsByUser(userId, {
      limit,
      offset,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: "success",
      data: registrations,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE DATE
exports.changeRegistrationDate = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const { newDateId } = req.body;

    const date = await getDateById(newDateId);
    if (!date) {
      throw new AppError("Date not found", 404);
    }

    const registration = await getRegistrationById(registrationId);

    if (!registration) {
      throw new AppError("Registration not found", 404);
    }

    // Only allow changing own registration date
    if (registration.user_id !== req.user.id) {
      throw new AppError("Not authorized to update this registration", 403);
    }

    const existing = await getRegistrationByUserAndDate(
      registration.user_id,
      newDateId
    );
    if (existing) {
      throw new AppError("You have already registered for this date", 400);
    }

    const updated = await updateRegistrationDate(registrationId, newDateId);

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE STATUS
exports.changeRegistrationStatus = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const { newStatus } = req.body;

    const updated = await updateRegistrationStatus(registrationId, newStatus);

    if (!updated) {
      throw new AppError("Registration not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.cancelRegistration = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const registration = await getRegistrationById(registrationId);

    if (!registration) {
      throw new AppError("Registration not found", 404);
    }

    // If not admin, only allow deleting own registration
    if (req.user.role !== "admin" && registration.user_id !== req.user.id) {
      throw new AppError("You can only cancel your own registrations", 403);
    }

    const deleted = await deleteRegistration(registrationId);

    if (!deleted) {
      throw new AppError("Registration not found", 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
