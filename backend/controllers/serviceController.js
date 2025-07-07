const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../models/serviceModel");
const AppError = require("../utils/appError");

// GET ALL
exports.getAllServices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { category, search, date } = req.query;

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError("Page and limit must be numbers", 400);
    }

    const { services, totalCount } = await getAllServices({
      limit,
      offset,
      category,
      search,
      date,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: "success",
      data: services,
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

// GET BY ID
exports.getServiceById = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const service = await getServiceById(serviceId);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// POST
exports.createService = async (req, res, next) => {
  try {
    const newService = req.body;

    // multer puts the uploaded file info in req.file
    if (req.file) {
      // Save the relative path to the image in the service object
      newService.image = req.file.filename;
    }
    if (!newService.image) {
      throw new AppError("Image is required", 400);
    }

    if (
      !newService ||
      !newService.name ||
      !newService.description ||
      !newService.category ||
      !newService.duration ||
      !newService.dates
    ) {
      throw new AppError("Missing required fields", 400);
    }

    const createdService = await createService(newService, newService.dates);

    res.status(201).json({
      status: "success",
      data: createdService,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE (PATCH)
exports.updateService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const updatedService = req.body;

    if (req.file) {
      updatedService.image = req.file.filename;
    }

    const updated = await updateService(serviceId, updatedService);

    if (!updated) {
      throw new AppError("Service not found", 404);
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
exports.deleteService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const deleted = await deleteService(serviceId);

    if (!deleted) {
      throw new AppError("Service not found", 404);
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
