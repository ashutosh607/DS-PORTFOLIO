const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid format for resource identifier: ${err.value}`);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(", ");
    error = new ApiError(400, `Duplicate entry: ${fields} already exists`);
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    error = new ApiError(400, `Validation failed: ${messages.join("; ")}`, messages);
  }

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const isProduction = process.env.NODE_ENV === "production";
    const message = isProduction && statusCode === 500 ? "Internal Server Error" : (error.message || "Internal Server Error");
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    statusCode: error.statusCode,
    message: error.message,
    success: false,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
