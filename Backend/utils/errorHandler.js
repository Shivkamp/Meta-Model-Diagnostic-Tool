// Custom error class for throwing errors with custom properties
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware for Express
const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    // Operational error (user-defined error)
    res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
  } else {
    // Unexpected errors (programming bugs)
    console.error(err);
    res.status(500).json({
      message: 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
  }
};

// Helper function to handle errors in controllers
const handleError = (message, statusCode) => {
  throw new AppError(message, statusCode);
};

module.exports = { AppError, errorHandler, handleError };
