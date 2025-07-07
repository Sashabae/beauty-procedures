const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../models/userModel");

// JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// COOKIES
const sendCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
};

// REGISTER
exports.signup = async (req, res, next) => {
  try {
    const newUser = req.body;

    // Hash password
    const hashedPassword = await argon2.hash(newUser.password);
    newUser.password = hashedPassword;

    // Default role
    newUser.role = "user";
    const createdUser = await createUser(newUser);

    // JWT
    const token = signToken(createdUser.id);
    sendCookie(token, res);

    // Remove password and id from response
    createdUser.password = undefined;
    createdUser.id = undefined;

    res.status(201).json({
      status: "success",
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    const token = signToken(user.id);
    sendCookie(token, res);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
exports.logout = (req, res) => {
  return res.clearCookie("jwt").status(200).json({
    status: "success",
    message: "You are logged out",
  });
};

// GET CURRENT USER
exports.getMe = (req, res, next) => {
  try {
    const me = req.user;
    me.password = undefined;

    res.status(200).json({
      status: "success",
      data: me,
    });
  } catch (error) {
    next(error);
  }
};
