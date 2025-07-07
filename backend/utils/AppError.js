class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    console.log(statusCode);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); // We want to capture the stack trace, so we can know where the error happened
  }
}

module.exports = AppError;
