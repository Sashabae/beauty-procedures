const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');

// Error handling
const AppError = require("./utils/appError");
const errorHandler = require("./middlewares/errorHandler");

const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const dateRoutes = require("./routes/dateRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/dates", dateRoutes);
app.use("/api/v1/registrations", registrationRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling
app.all("/{*any}", (req, res, next) => {
  next(new AppError("Not found", 404));
});

app.use(errorHandler);

module.exports = app;
