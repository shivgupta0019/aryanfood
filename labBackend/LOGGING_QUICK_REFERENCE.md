# 📋 Logging System - Quick Reference Card

## 🚀 Quick Start (3 Steps)

### 1. Start Server

```bash
npm run dev
# or
node index.js
```

### 2. Make API Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'
```

### 3. Check Logs

```powershell
Get-Content "labBackend\log\logs\error.log" -Tail 30
```

---

## 📁 Log Files

| File               | Content         | Use Case        |
| ------------------ | --------------- | --------------- |
| **combined.log**   | All logs        | See everything  |
| **error.log**      | Errors only     | Find failures   |
| **api.log**        | API requests    | Track endpoints |
| **exceptions.log** | Uncaught errors | Debug crashes   |

---

## 🔍 Useful Commands (PowerShell)

### View Logs

```powershell
# Last 30 errors
Get-Content "labBackend\log\logs\error.log" -Tail 30

# Watch logs real-time
Get-Content "labBackend\log\logs\combined.log" -Wait -Tail 20

# All logs
Get-Content "labBackend\log\logs\combined.log"
```

### Search Logs

```powershell
# Find failed logins
Select-String "FAILED LOGIN" labBackend\log\logs\combined.log

# Find API errors
Select-String "API FAILED" labBackend\log\logs\error.log

# Find specific endpoint
Select-String "/api/users" labBackend\log\logs\combined.log

# Find specific email
Select-String "john@example.com" labBackend\log\logs\combined.log
```

### Count Errors

```powershell
# Total errors
(Select-String "ERROR" labBackend\log\logs\error.log | Measure-Object).Count

# API failures
(Select-String "API FAILED" labBackend\log\logs\combined.log | Measure-Object).Count
```

---

## 📊 What Gets Logged

### ✅ Request Logged

```
[2026-05-06 10:30:45] INFO : 📥 INCOMING REQUEST:
{
  "timestamp": "2026-05-06T10:30:45.123Z",
  "method": "POST",
  "url": "/api/auth/login",
  "ip": "127.0.0.1",
  "body": {"email": "user@example.com"}
}
```

### ✅ Success Logged

```
[2026-05-06 10:30:46] INFO : ✅ API SUCCESS:
{
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 200,
  "duration": "1234ms"
}
```

### ❌ Error Logged

```
[2026-05-06 10:35:20] ERROR : ❌ API FAILED / 💥 ERROR OCCURRED:
{
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 401,
  "errorMessage": "Invalid credentials",
  "errorStack": "Error: ...",
  "ip": "127.0.0.1"
}
```

---

## 💻 Using in Controllers

### Option 1: Auto Error Catching

```javascript
const {
  asyncHandler,
  sendSuccess,
  sendError,
  ApiError,
} = require("../utils/errorHandler");
const logger = require("../log/logger");

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new ApiError("User not found", 401);
    }
    sendSuccess(res, user, "Login successful");
  }),
);
```

### Option 2: Manual Logging

```javascript
router.post("/login", async (req, res, next) => {
  try {
    logger.info(`Login attempt: ${req.body.email}`);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      logger.warn(`Failed login: ${req.body.email}`);
      return res.status(401).json({ message: "Invalid" });
    }
    logger.info(`Success: ${user.email}`);
    res.json(user);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    next(error);
  }
});
```

---

## 🔍 Log Symbols

| Symbol | Meaning           |
| ------ | ----------------- |
| 📥     | Incoming request  |
| ✅     | Success (200-299) |
| ❌     | Failure (400-499) |
| 💥     | Error (500+)      |
| ⚠️     | Warning           |
| 🔴     | Async error       |

---

## ⏱️ Check Response Times

Log shows duration like: `"duration":"1234ms"`

| Duration   | Status       |
| ---------- | ------------ |
| < 100ms    | ✅ Very fast |
| 100-500ms  | ✅ Good      |
| 500-1000ms | ⚠️ Moderate  |
| > 1000ms   | ❌ Slow      |

---

## 🎯 Track What You Want

### Track Failed Logins

```powershell
Select-String "FAILED LOGIN" labBackend\log\logs\combined.log
```

### Track API Errors

```powershell
Select-String "API FAILED\|ERROR OCCURRED" labBackend\log\logs\error.log
```

### Track Slow APIs

```powershell
# Find APIs taking > 1 second
Get-Content "labBackend\log\logs\combined.log" | Where-Object { $_ -match '(\d{4})ms' -and [int]$matches[1] -gt 1000 }
```

### Track Specific User

```powershell
Select-String "john@example.com" labBackend\log\logs\combined.log
```

### Track Specific IP

```powershell
Select-String "192.168.1.100" labBackend\log\logs\combined.log
```

---

## 🔧 Configuration

### Change Log Level (in `log/logger.js`)

```javascript
level: "debug",  // Options: 'error', 'warn', 'info', 'debug'
```

### Change Log Rotation

```javascript
maxsize: 10485760,  // Size in bytes (5MB = 5242880)
maxFiles: 10,       // Number of files to keep
```

---

## 📝 Log File Examples

### Success

```
[2026-05-06 10:30:45] INFO : 📥 INCOMING REQUEST: {"method":"POST","url":"/api/users","body":{"email":"new@example.com"}}
[2026-05-06 10:30:46] INFO : ✅ API SUCCESS: {"statusCode":201,"duration":"1234ms"}
```

### Failure

```
[2026-05-06 10:35:20] INFO : 📥 INCOMING REQUEST: {"method":"POST","url":"/api/users","body":{"email":"existing@example.com"}}
[2026-05-06 10:35:20] ERROR : ❌ API FAILED: {"statusCode":400,"duration":"89ms"}
[2026-05-06 10:35:20] ERROR : 💥 ERROR OCCURRED: {"errorMessage":"Email already exists","statusCode":400}
```

---

## ✅ Common Tasks

### View Last Errors

```powershell
Get-Content "labBackend\log\logs\error.log" -Tail 20
```

### Find All Failures Today

```powershell
Select-String "2026-05-06" labBackend\log\logs\error.log
```

### Export Logs to File

```powershell
Get-Content "labBackend\log\logs\combined.log" | Out-File "backup_logs.txt"
```

### Find Database Errors

```powershell
Select-String "Database\|Connection\|ECONNREFUSED" labBackend\log\logs\error.log
```

---

## 🆘 Troubleshooting

**Q: No logs appearing?**

- Check `labBackend/log/logs/` folder exists
- Restart server
- Make API request
- Check combined.log

**Q: Can't find specific error?**

- Search error.log (errors only): `Select-String "error text" labBackend\log\logs\error.log`
- Search combined.log (all logs): `Select-String "error text" labBackend\log\logs\combined.log`

**Q: Logs too big?**

- They auto-rotate at 5MB
- Keeps 5 versions
- Old files are preserved

**Q: Want to log custom data?**

- Use: `logger.info('Custom message: ' + JSON.stringify(data))`

---

## 📚 Full Docs

- **LOGGING_GUIDE.md** - Complete documentation
- **LOGGING_EXAMPLE.js** - Real examples
- **LOG_MONITORING_GUIDE.md** - Advanced monitoring
- **errorHandler.js** - Utility functions

---

## 🎯 What You Can Now Do

✅ Track every API hit with exact timestamp
✅ See which APIs succeeded/failed
✅ Know why APIs failed (full error details)
✅ Monitor API response times
✅ Track user activity by IP
✅ Monitor failed logins
✅ Audit trail of all API calls
✅ Find performance bottlenecks
✅ Investigate security issues

---

**🎉 You're all set! Start logging now!**
