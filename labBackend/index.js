const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const logger = require("./log/logger");
require("./config/db");

const app = express();

// ✅ Allowed origins (NO trailing slash)
const allowedOrigins = ["http://localhost:5173", "http://80.225.246.52:5137"];

// ✅ CORS FIX (dynamic)
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middlewares (MUST be before logging middleware to populate req.body)
app.use(express.json());
app.use(cookieParser());

// ============ LOGGING MIDDLEWARES ============

// Create morgan stream for logger
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Custom morgan format to log API hits with detailed info
const morganFormat =
  ":method :url :status :response-time ms - IP: :remote-addr";
app.use(morgan(morganFormat, { stream: morganStream }));

// Enhanced API Request Logging Middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log incoming request details
  const requestDetails = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    query: Object.keys(req.query).length > 0 ? req.query : null,
    body: req.body && Object.keys(req.body).length > 0 ? req.body : null,
    headers: {
      "content-type": req.headers["content-type"],
      "user-agent": req.headers["user-agent"],
    },
  };

  logger.info(`📥 INCOMING REQUEST: ${JSON.stringify(requestDetails)}`);

  // Intercept response.json() to capture response body
  const originalJson = res.json;
  res.json = function (data) {
    res.locals.responseBody = data;
    return originalJson.call(this, data);
  };

  // Capture response
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const responseBody = res.locals.responseBody || {};

    const responseDetails = {
      timestamp,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
    };

    // Log based on status code
    if (res.statusCode >= 400) {
      // For failed requests, include error message/reason
      const errorLog = {
        ...responseDetails,
        reason: responseBody.message || responseBody.error || "Unknown error",
        errorDetails: responseBody,
      };
      logger.error(
        `❌ API FAILED: ${JSON.stringify(errorLog)} - REQUEST: ${JSON.stringify(requestDetails)}`,
      );
    } else {
      logger.info(`✅ API SUCCESS: ${JSON.stringify(responseDetails)}`);
    }
  });

  next();
});

// ============ END LOGGING MIDDLEWARES ============

// ✅ Handle favicon requests (prevents unnecessary 404 logs)
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // 204 No Content - silent response
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "uploads/products")),
);
// Routes
app.use("/api", userRoutes);

// ============ ERROR HANDLING MIDDLEWARE ============

// 404 Not Found Handler
app.use((req, res) => {
  const timestamp = new Date().toISOString();
  const errorDetails = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    error: "NOT_FOUND",
    reason: `Route ${req.method} ${req.originalUrl} does not exist`,
    statusCode: 404,
    ip: req.ip || req.connection.remoteAddress,
  };
  logger.error(
    `⚠️  ROUTE NOT FOUND (404): ${errorDetails.reason} - ${JSON.stringify(errorDetails)}`,
  );
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    reason: `The requested ${req.method} ${req.originalUrl} endpoint does not exist`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const errorDetails = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    errorMessage: err.message,
    errorStack: err.stack,
    statusCode: err.statusCode || 500,
    ip: req.ip || req.connection.remoteAddress,
    body: req.body
      ? Object.keys(req.body).length > 0
        ? req.body
        : null
      : null,
  };

  logger.error(
    `💥 ERROR OCCURRED (${err.statusCode || 500}): ${err.message} - ${JSON.stringify(errorDetails)}`,
  );

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || 500,
    timestamp,
  });
});

// ============ END ERROR HANDLING MIDDLEWARE ============

// Server
app.listen(5000, () => {
  const timestamp = new Date().toISOString();
  console.log("🚀 Server running on port 5000");
  logger.info(
    `🚀 SERVER STARTED: Application started at ${timestamp} on PORT 5000`,
  );
});
