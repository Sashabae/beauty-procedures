const AppError = require("../utils/appError");

// Role access
exports.allowAccessTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role))
        throw new AppError("You do not have access to this route", 403);
      next();
    } catch (error) {
      next(error);
    }
  };
};
