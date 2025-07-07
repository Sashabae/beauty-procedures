const { getUserById } = require("../models/userModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

// Protect
exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      console.log("No token found");
      throw new AppError("You are not logged in", 401);
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await getUserById(id);
    if (!currentUser) throw new AppError("User not found", 401);

    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
