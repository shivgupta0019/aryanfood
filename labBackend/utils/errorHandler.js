const logger = require("../log/logger");

/**
 * Error Handler Utility for API responses
 * Usage: In your controller, use asyncHandler to wrap async functions
 * Example:
 * router.get('/data', asyncHandler(async (req, res) => {
 *   const data = await getData();
 *   res.json(data);
 * }));
 */

// Wrapper for async route handlers to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      errorMessage: err.message,
      errorStack: err.stack,
      statusCode: err.statusCode || 500,
      ip: req.ip || req.connection.remoteAddress,
    };

    logger.error(
      `🔴 ASYNC ERROR IN ${req.method} ${req.originalUrl}: ${JSON.stringify(errorDetails)}`,
    );

    next({
      message: err.message || "Internal Server Error",
      statusCode: err.statusCode || 500,
    });
  });
};

// Custom Error Class
class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

// Success Response Helper
const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  logger.info(`✅ SUCCESS RESPONSE: ${statusCode} - ${message}`);
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// Error Response Helper
const sendError = (
  res,
  message = "Error",
  statusCode = 500,
  details = null,
) => {
  logger.error(
    `❌ ERROR RESPONSE: ${statusCode} - ${message} - Details: ${JSON.stringify(details)}`,
  );
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
  });
};

module.exports = {
  asyncHandler,
  ApiError,
  sendSuccess,
  sendError,
};
