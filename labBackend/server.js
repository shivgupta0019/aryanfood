const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5137;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = "1h";

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Dummy user for validation
const dummyUser = {
  id: 1,
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
};

// ============ MIDDLEWARE ============

/**
 * JWT Authentication Middleware
 * Extracts and verifies Bearer token from Authorization header
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // Extract Bearer token
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // Attach decoded token data to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token verification failed",
    });
  }
};

// ============ ROUTES ============

/**
 * POST /api/login
 * Authenticates user and returns JWT token
 */
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Validate user (dummy validation)
    if (email === dummyUser.email && password === dummyUser.password) {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: dummyUser.id,
          email: dummyUser.email,
          name: dummyUser.name,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY },
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: dummyUser.id,
          email: dummyUser.email,
          name: dummyUser.name,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

/**
 * GET /api/user
 * Protected route - returns authenticated user info
 */
app.get("/api/user", authenticateToken, (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user data",
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// ============ ERROR HANDLING ============

// 404 Not Found
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ============ SERVER START ============

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 CORS enabled for: http://localhost:5173`);
  console.log(
    `🔐 JWT Secret: ${JWT_SECRET !== "your-secret-key-change-in-production" ? "***" : "DEFAULT (CHANGE IN PRODUCTION)"}`,
  );
});

module.exports = app;
