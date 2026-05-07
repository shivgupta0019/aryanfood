/**
 * Example: How to Integrate Logging into Your Existing Controllers
 *
 * This file shows you step-by-step how to add the new error handler
 * to your existing controllers like authController.js
 */

// ============================================================
// BEFORE: Your existing code (without logging)
// ============================================================
/*
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.create({ email, password });
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
*/

// ============================================================
// AFTER: With new logging system
// ============================================================

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  asyncHandler,
  sendSuccess,
  sendError,
  ApiError,
} = require("../utils/errorHandler");
const logger = require("../log/logger");

/**
 * POST /api/auth/register
 * Register a new user
 *
 * LOG OUTPUT:
 * - Request logged with email, password, IP
 * - Success: {"statusCode":201,"duration":"1234ms"}
 * - Error: {"errorMessage":"Email already exists","statusCode":400}
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      logger.warn(
        `⚠️  VALIDATION ERROR: Register attempt with missing fields from IP ${req.ip}`,
      );
      throw new ApiError("Email and password are required", 400);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(
        `⚠️  DUPLICATE USER: Registration attempt with email ${email}`,
      );
      throw new ApiError("Email already registered", 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    logger.info(`✅ NEW USER REGISTERED: ${email} from IP ${req.ip}`);

    sendSuccess(
      res,
      { id: user.id, email: user.email },
      "Registration successful",
      201,
    );
  }),
);

/**
 * POST /api/auth/login
 * User login with email and password
 *
 * LOG OUTPUT:
 * - Request: {"method":"POST","url":"/api/auth/login","body":{"email":"..."}}
 * - Success: {"statusCode":200,"duration":"456ms"}
 * - Failed attempt: {"statusCode":401,"error":"Invalid credentials"}
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ApiError("Email and password are required", 400);
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(
        `⚠️  FAILED LOGIN: Email ${email} not found from IP ${req.ip}`,
      );
      throw new ApiError("Invalid email or password", 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(
        `⚠️  FAILED LOGIN: Wrong password for ${email} from IP ${req.ip}`,
      );
      throw new ApiError("Invalid email or password", 401);
    }

    // Log successful login
    logger.info(`✅ USER LOGIN: ${email} from IP ${req.ip}`);

    sendSuccess(
      res,
      {
        id: user.id,
        email: user.email,
        token: generateToken(user.id),
      },
      "Login successful",
    );
  }),
);

/**
 * GET /api/auth/profile
 * Get user profile (protected route)
 *
 * LOG OUTPUT:
 * - Success: {"statusCode":200,"userId":"123","email":"user@example.com"}
 * - Unauthorized: {"statusCode":401,"error":"No token provided"}
 * - Not found: {"statusCode":404,"error":"User not found"}
 */
router.get(
  "/profile",
  asyncHandler(async (req, res) => {
    const userId = req.user.id; // From auth middleware

    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`⚠️  USER NOT FOUND: ID ${userId} from IP ${req.ip}`);
      throw new ApiError("User not found", 404);
    }

    logger.info(`📖 PROFILE VIEWED: ${user.email} from IP ${req.ip}`);

    sendSuccess(res, user, "Profile retrieved successfully");
  }),
);

/**
 * PUT /api/auth/update-profile
 * Update user profile
 *
 * LOG OUTPUT:
 * - Request: {"method":"PUT","url":"/api/auth/update-profile","body":{"email":"newemail@..."}}
 * - Success: {"statusCode":200,"updatedFields":["email","phone"]}
 * - Error: {"statusCode":500,"errorMessage":"Database error"}
 */
router.put(
  "/update-profile",
  asyncHandler(async (req, res) => {
    const { email, phone, name } = req.body;
    const userId = req.user.id;

    // Validate at least one field is provided
    if (!email && !phone && !name) {
      throw new ApiError("At least one field is required for update", 400);
    }

    // Check if email is already taken
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.id !== userId) {
        logger.warn(
          `⚠️  EMAIL CONFLICT: User ${userId} trying to use email ${email}`,
        );
        throw new ApiError("Email already in use", 400);
      }
    }

    // Update user
    const updateData = {};
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (name) updateData.name = name;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    logger.info(
      `✏️  USER PROFILE UPDATED: ${updatedUser.email} - Fields: ${Object.keys(updateData).join(", ")} from IP ${req.ip}`,
    );

    sendSuccess(res, updatedUser, "Profile updated successfully");
  }),
);

/**
 * POST /api/auth/logout
 * User logout
 *
 * LOG OUTPUT:
 * - Success: {"statusCode":200,"userId":"123","message":"Logout successful"}
 */
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Invalidate token in database if needed
    // await Token.deleteOne({ userId });

    logger.info(`👋 USER LOGOUT: ${userId} from IP ${req.ip}`);

    sendSuccess(res, null, "Logout successful");
  }),
);

/**
 * POST /api/auth/forgot-password
 * Request password reset
 *
 * LOG OUTPUT:
 * - Request: {"email":"user@example.com","method":"POST"}
 * - Success: {"statusCode":200,"message":"Reset email sent"}
 * - Error: {"statusCode":404,"error":"User not found"}
 */
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError("Email is required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`⚠️  PASSWORD RESET: Email ${email} not found`);
      throw new ApiError("User not found", 404);
    }

    // Generate reset token
    const resetToken = generateResetToken();
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    logger.info(`📧 PASSWORD RESET REQUESTED: ${email}`);

    sendSuccess(res, null, "Password reset email sent");
  }),
);

module.exports = router;

// ============================================================
// SUMMARY OF CHANGES
// ============================================================
/*
✅ BEFORE vs AFTER:

BEFORE:
- Manual try-catch blocks
- Generic error messages
- No request logging
- Hard to track which API failed
- No timestamp tracking
- Manual error responses

AFTER:
- asyncHandler automatically catches errors
- Detailed error messages with context
- Every request logged with timestamp
- Clear identification of which API failed
- Response time tracking
- Consistent error/success responses
- Auto-logged to files for audit trail

🔍 What Gets Logged:
1. Every API request (method, URL, query params, body, IP)
2. Every API response (status code, duration)
3. Every error (message, stack trace, request context)
4. Failed login attempts (for security)
5. Data modifications (who changed what, when, from where)

📊 View Logs:
- Error.log: Only shows failures
- Combined.log: Shows all activity
- API.log: Shows API-specific requests

✅ You can now track:
- Which API was called
- When it was called
- Who called it (IP address)
- What data was sent
- Did it succeed or fail
- How long it took
- If it failed, why it failed
*/
