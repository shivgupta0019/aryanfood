# 📋 Node.js Logging System - Complete Guide

## Overview

Your Node.js backend now has a comprehensive logging system using **Winston** that tracks:

- ✅ All API requests with timestamps
- ✅ API response status codes
- ✅ Response times
- ✅ All errors with detailed error messages
- ✅ Request/Response data
- ✅ Client IP addresses

---

## 📁 Log Files Created

### Location: `labBackend/log/logs/`

Your logs will be stored in 4 main files:

### 1. **combined.log**

Contains ALL logs (info, warnings, and errors)

```
[2026-05-06 10:30:45] INFO : 📥 INCOMING REQUEST: {"timestamp":"2026-05-06T10:30:45.123Z","method":"POST","url":"/api/users","ip":"127.0.0.1",...}
[2026-05-06 10:30:46] INFO : ✅ API SUCCESS: {"timestamp":"2026-05-06T10:30:46.456Z","method":"POST","url":"/api/users","statusCode":200,"duration":"1234ms"...}
[2026-05-06 10:31:00] ERROR : 💥 ERROR OCCURRED: {"timestamp":"2026-05-06T10:31:00.789Z",...}
```

### 2. **api.log**

Tracks API-specific requests and responses

```
[2026-05-06 10:30:45] INFO : POST /api/users 200 - 1234ms
[2026-05-06 10:30:50] INFO : GET /api/users?page=1 200 - 456ms
```

### 3. **error.log** ⚠️

Contains ONLY ERROR entries - Critical for debugging

```
[2026-05-06 10:31:00] ERROR : ❌ API FAILED: {"method":"POST","url":"/api/login","statusCode":401,"error":"Invalid credentials"}
[2026-05-06 10:31:15] ERROR : 💥 ERROR OCCURRED: {"method":"GET","url":"/api/users/999","statusCode":404,"errorMessage":"User not found"}
```

### 4. **exceptions.log**

Captures uncaught exceptions and unhandled promise rejections

### 5. **combined.log** (Rotated)

- Files are automatically rotated when they reach **5MB**
- Keeps up to **5 previous versions** of each log file

---

## 🔍 Log Format Explained

### Incoming Request Log

```json
{
  "timestamp": "2026-05-06T10:30:45.123Z",
  "method": "POST",
  "url": "/api/users/register",
  "ip": "192.168.1.100",
  "query": { "redirect": "true" },
  "body": { "email": "user@example.com", "password": "***" },
  "headers": {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0..."
  }
}
```

### API Success Response Log

```json
{
  "timestamp": "2026-05-06T10:30:46.456Z",
  "method": "POST",
  "url": "/api/users/register",
  "statusCode": 201,
  "duration": "1234ms",
  "ip": "192.168.1.100"
}
```

### API Failure Log

```json
{
  "method": "POST",
  "url": "/api/users/register",
  "statusCode": 400,
  "duration": "234ms",
  "error": "Email already exists"
}
```

### Error Log

```json
{
  "timestamp": "2026-05-06T10:31:00.789Z",
  "method": "POST",
  "url": "/api/users/register",
  "errorMessage": "Database connection failed",
  "errorStack": "Error: connect ECONNREFUSED...",
  "statusCode": 500,
  "ip": "192.168.1.100"
}
```

---

## 💻 How to Use Error Handler in Controllers

### Example 1: Using asyncHandler Wrapper

```javascript
// controllers/authController.js
const {
  asyncHandler,
  sendSuccess,
  sendError,
  ApiError,
} = require("../utils/errorHandler");
const logger = require("../log/logger");

// Wrap async functions to catch errors automatically
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      throw new ApiError("Email and password are required", 400);
    }

    // Your business logic
    const user = await User.create({ email, password });

    sendSuccess(res, user, "User registered successfully", 201);
  }),
);
```

### Example 2: Manual Try-Catch with Logger

```javascript
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`⚠️  FAILED LOGIN ATTEMPT: Email ${email} not found`);
      return sendError(res, "Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`⚠️  FAILED LOGIN ATTEMPT: Wrong password for ${email}`);
      return sendError(res, "Invalid email or password", 401);
    }

    sendSuccess(res, { token: user.token }, "Login successful");
  } catch (error) {
    logger.error(`💥 LOGIN ERROR: ${error.message}`);
    next(error); // Pass to error handler middleware
  }
});
```

### Example 3: Logging Custom Warnings

```javascript
router.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      logger.warn(`⚠️  USER NOT FOUND: ID ${req.params.id}`);
      throw new ApiError("User not found", 404);
    }

    // Log when retrieving sensitive data
    logger.info(`📖 USER RETRIEVED: ${user.email} (IP: ${req.ip})`);

    sendSuccess(res, user);
  }),
);
```

---

## 🚀 How to Check Logs

### Option 1: Real-time Logs in Terminal

```bash
# Monitor error logs in real-time (Linux/Mac)
tail -f labBackend/log/logs/error.log

# Monitor on Windows (PowerShell)
Get-Content .\labBackend\log\logs\error.log -Wait -Tail 20
```

### Option 2: View Complete Logs

```bash
# View last 50 lines of error.log
tail -50 labBackend/log/logs/error.log

# View all combined logs
cat labBackend/log/logs/combined.log

# Search for specific API in logs
grep "POST /api/users" labBackend/log/logs/combined.log

# Search for all errors with "Database"
grep "Database" labBackend/log/logs/error.log
```

### Option 3: Using VS Code

1. Open the integrated terminal
2. Navigate to: `labBackend/log/logs/`
3. Open the log file you want to inspect

---

## 📊 Log Symbols Used

| Symbol | Meaning                 | Status Code |
| ------ | ----------------------- | ----------- |
| 📥     | Incoming Request        | -           |
| ✅     | Successful API Response | 200-299     |
| ❌     | Failed API Response     | 400-499     |
| 💥     | Critical Error          | 500-599     |
| ⚠️     | Warning/Incomplete      | -           |
| 🔴     | Async Handler Error     | -           |

---

## 🔧 Configuration

### To Change Log Level (in `log/logger.js`)

```javascript
const logger = winston.createLogger({
  level: "debug", // Change to: 'error', 'warn', 'info', 'debug'
  // ... rest of config
});
```

### Log Levels (from most to least severe)

- **error** - Only errors
- **warn** - Errors + warnings
- **info** - Errors + warnings + info (DEFAULT)
- **debug** - All of the above + debug messages

### To Disable Console Logs (keep only files)

```javascript
// In log/logger.js, comment out:
logger.add(
  new winston.transports.Console({
    // ...
  }),
);
```

---

## 📝 Example Log Entries

### Successful POST Request (User Registration)

```
[2026-05-06 10:30:45] INFO : 📥 INCOMING REQUEST: {"timestamp":"2026-05-06T10:30:45.123Z","method":"POST","url":"/api/auth/register","ip":"192.168.1.100","body":{"email":"john@example.com"}...}
[2026-05-06 10:30:46] INFO : ✅ API SUCCESS: {"timestamp":"2026-05-06T10:30:46.456Z","method":"POST","url":"/api/auth/register","statusCode":201,"duration":"1234ms","ip":"192.168.1.100"}
```

### Failed GET Request (User Not Found)

```
[2026-05-06 10:35:20] INFO : 📥 INCOMING REQUEST: {"timestamp":"2026-05-06T10:35:20.111Z","method":"GET","url":"/api/users/999","ip":"192.168.1.101"...}
[2026-05-06 10:35:20] ERROR : ❌ API FAILED: {"timestamp":"2026-05-06T10:35:20.234Z","method":"GET","url":"/api/users/999","statusCode":404,"duration":"89ms","ip":"192.168.1.101"}
[2026-05-06 10:35:20] ERROR : 💥 ERROR OCCURRED: {"timestamp":"2026-05-06T10:35:20.234Z","method":"GET","url":"/api/users/999","errorMessage":"User not found","statusCode":404","ip":"192.168.1.101"}
```

### Database Connection Error

```
[2026-05-06 10:40:15] INFO : 📥 INCOMING REQUEST: {"timestamp":"2026-05-06T10:40:15.555Z","method":"POST","url":"/api/data/save"...}
[2026-05-06 10:40:16] ERROR : 💥 ERROR OCCURRED: {"timestamp":"2026-05-06T10:40:16.666Z","method":"POST","url":"/api/data/save","errorMessage":"Connection timeout","errorStack":"Error: ECONNREFUSED 127.0.0.1:3306","statusCode":500,"ip":"192.168.1.102"}
[2026-05-06 10:40:16] ERROR : ❌ API FAILED: {"timestamp":"2026-05-06T10:40:16.666Z","method":"POST","url":"/api/data/save","statusCode":500,"duration":"1100ms","ip":"192.168.1.102"}
```

---

## ✅ What You Can Now Track

1. **API Hit Tracking** ✅
   - Every API request is logged with timestamp
   - See exactly which API was called and when

2. **Response Time Monitoring** ✅
   - Duration in milliseconds for each request
   - Identify slow APIs

3. **Status Code Tracking** ✅
   - Know which APIs succeeded (200-299) or failed (400-599)
   - Automatically separates success from errors

4. **Error Details** ✅
   - Full error message and stack trace
   - Request data that caused the error
   - Client IP address for audit trail

5. **Request/Response Inspection** ✅
   - See what data was sent to the API
   - See response status and timing
   - Track query parameters and request headers

6. **Automatic File Rotation** ✅
   - Logs are rotated every 5MB
   - Keeps 5 previous versions
   - Prevents disk space issues

---

## 🎯 Quick Start Checklist

- [x] Winston logger installed and configured
- [x] Logger imported in `index.js`
- [x] Logging middleware added
- [x] Error handling middleware added
- [x] Error handler utility created (`utils/errorHandler.js`)
- [x] Log files directory auto-created
- [x] Morgan integration for detailed API logs
- [x] Color-coded console logs for easy reading

🎉 **Your logging system is ready to use!**
