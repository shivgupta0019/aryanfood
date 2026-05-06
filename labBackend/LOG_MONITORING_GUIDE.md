# 🔍 How to Monitor and Check Logs - Windows/PowerShell Guide

## Quick Log Check Commands

### 1️⃣ View Latest Errors (Last 30 lines)

```powershell
# In PowerShell
Get-Content "labBackend\log\logs\error.log" -Tail 30

# Or using tail command (if available)
tail -30 labBackend/log/logs/error.log
```

### 2️⃣ Monitor Logs in Real-Time

```powershell
# Watch error.log as new errors occur (Real-time monitoring)
Get-Content "labBackend\log\logs\error.log" -Wait -Tail 10

# Watch combined.log for all activity
Get-Content "labBackend\log\logs\combined.log" -Wait -Tail 20
```

### 3️⃣ Search for Specific Errors

```powershell
# Find all failed login attempts
Select-String "FAILED LOGIN" labBackend\log\logs\combined.log

# Find all API failures
Select-String "API FAILED\|ERROR OCCURRED" labBackend\log\logs\error.log

# Find errors from specific API endpoint
Select-String "POST /api/users" labBackend\log\logs\combined.log

# Find errors in last 2 hours
Get-Content "labBackend\log\logs\error.log" | Select-String "ERROR"
```

### 4️⃣ Count Different Error Types

```powershell
# Count total errors
(Select-String "ERROR" labBackend\log\logs\error.log | Measure-Object).Count

# Count API failures
(Select-String "API FAILED" labBackend\log\logs\combined.log | Measure-Object).Count

# Count successful logins
(Select-String "USER LOGIN" labBackend\log\logs\combined.log | Measure-Object).Count
```

### 5️⃣ View Logs by Time Range

```powershell
# Show logs from the last 5 minutes
$cutoffTime = (Get-Date).AddMinutes(-5)
Get-Content "labBackend\log\logs\combined.log" | Where-Object {
    $line = $_
    # Extract timestamp (adjust pattern based on your log format)
    if ($line -match '\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]') {
        [DateTime]::ParseExact($matches[1], "yyyy-MM-dd HH:mm:ss", $null) -gt $cutoffTime
    }
}
```

---

## 📊 Log Analysis Scripts

### Script 1: Get Summary of API Activity

```powershell
# Show summary of API endpoints called
$logs = Get-Content "labBackend\log\logs\api.log"
$endpoints = $logs | Select-String -Pattern 'POST|GET|PUT|DELETE|PATCH' |
    ForEach-Object { if ($_ -match '([A-Z]+)\s+([^\s]+)\s+(\d+)') { "$($matches[1]) $($matches[2])" } }
$endpoints | Group-Object | Select-Object Name, Count
```

### Script 2: Find Slow APIs (Taking > 1000ms)

```powershell
# Find APIs that took more than 1 second to respond
Get-Content "labBackend\log\logs\combined.log" | Where-Object {
    $_ -match '(\d+)ms'
    [int]$matches[1] -gt 1000
}
```

### Script 3: Find All User Registration Attempts

```powershell
# Track all registration attempts and their results
Get-Content "labBackend\log\logs\combined.log" | Select-String "register\|REGISTERED"
```

### Script 4: Get Error Statistics

```powershell
# Count errors by type
$errorLog = Get-Content "labBackend\log\logs\error.log"
Write-Host "=== ERROR STATISTICS ===" -ForegroundColor Yellow

Write-Host "Total Errors: $(($errorLog | Measure-Object).Count)" -ForegroundColor Red
Write-Host "API Failures: $((Select-String 'API FAILED' $errorLog | Measure-Object).Count)" -ForegroundColor Red
Write-Host "Async Errors: $((Select-String 'ASYNC ERROR' $errorLog | Measure-Object).Count)" -ForegroundColor Red
Write-Host "Route Not Found: $((Select-String 'ROUTE NOT FOUND' $errorLog | Measure-Object).Count)" -ForegroundColor Red
```

---

## 🔐 Security Monitoring - Check for Suspicious Activity

### Find Failed Login Attempts

```powershell
# Show all failed login attempts with IP addresses
Select-String "FAILED LOGIN" labBackend\log\logs\combined.log

# Count failed logins per IP
$failedLogins = Select-String "FAILED LOGIN.*from IP (\d+\.\d+\.\d+\.\d+)" labBackend\log\logs\combined.log
$failedLogins | ForEach-Object { if ($_ -match 'IP (\d+\.\d+\.\d+\.\d+)') { $matches[1] } } | Group-Object | Select-Object Name, @{Name="Failed Count"; Expression={$_.Count}}
```

### Find Unauthorized Access Attempts

```powershell
# Find 401 (Unauthorized) errors
Select-String "statusCode\":401" labBackend\log\logs\error.log

# Find 403 (Forbidden) errors
Select-String "statusCode\":403" labBackend\log\logs\error.log
```

### Track Duplicate Registration Attempts

```powershell
# Find attempts to register with existing emails
Select-String "DUPLICATE USER\|Email already" labBackend\log\logs\combined.log
```

---

## 📈 Performance Monitoring

### Find Slowest APIs

```powershell
# Extract API duration and sort by slowest
$logs = Get-Content "labBackend\log\logs\api.log"
$logs | ForEach-Object {
    if ($_ -match '([A-Z]+)\s+(.*?)\s+(\d+)\s+.*?(\d+)ms') {
        [PSCustomObject]@{
            Method = $matches[1]
            URL = $matches[2]
            Status = $matches[3]
            Duration = [int]$matches[4]
        }
    }
} | Sort-Object Duration -Descending | Select-Object -First 20
```

### Find APIs with Error Status Codes

```powershell
# Show all APIs that returned 4xx or 5xx status
Get-Content "labBackend\log\logs\api.log" | Where-Object { $_ -match '\s[45]\d{2}\s' }
```

---

## 🎯 Specific Queries

### Find a Specific User's Activity

```powershell
# Replace "john@example.com" with the email you're looking for
Select-String "john@example.com" labBackend\log\logs\combined.log
```

### Find Activity from Specific IP

```powershell
# Replace "192.168.1.100" with the IP you're looking for
Select-String "192.168.1.100" labBackend\log\logs\combined.log
```

### Find Specific API Endpoint Activity

```powershell
# Find all hits to /api/users endpoint
Select-String "/api/users" labBackend\log\logs\combined.log

# Find all POST requests to /api/data
Select-String "POST.*?/api/data" labBackend\log\logs\combined.log
```

### Find Database Connection Errors

```powershell
# Search for database-related errors
Select-String "Database\|ECONNREFUSED\|Connection" labBackend\log\logs\error.log
```

---

## 📂 Useful File Locations

```
labBackend/
├── log/
│   └── logs/
│       ├── combined.log       ← All logs (requests + errors)
│       ├── error.log          ← Errors only
│       ├── api.log            ← API requests and responses
│       └── exceptions.log      ← Uncaught exceptions
```

---

## 🚀 Pro Tips

### 1. Create a PowerShell Profile Command

Add this to your PowerShell profile (`$PROFILE`) for quick log access:

```powershell
function Show-Errors { Get-Content "labBackend\log\logs\error.log" -Tail 30 }
function Watch-Logs { Get-Content "labBackend\log\logs\combined.log" -Wait -Tail 20 }
function Find-Failed-Logins { Select-String "FAILED LOGIN" labBackend\log\logs\combined.log }
```

Then use: `Show-Errors` instead of typing the full command

### 2. Export Logs for Analysis

```powershell
# Export error logs to CSV for Excel analysis
Get-Content "labBackend\log\logs\error.log" | Export-Csv error_analysis.csv -NoTypeInformation
```

### 3. Archive Old Logs

```powershell
# Compress old log files (older than 7 days)
Get-ChildItem "labBackend\log\logs\*.log" -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Compress-Archive -DestinationPath "labBackend\log\logs\archive_$(Get-Date -Format 'yyyyMMdd').zip"
```

### 4. Real-time Monitoring Dashboard

```powershell
# Monitor logs in a loop with statistics
while($true) {
    Clear-Host
    $errorCount = (Get-Content "labBackend\log\logs\error.log" | Measure-Object).Count
    $totalLogs = (Get-Content "labBackend\log\logs\combined.log" | Measure-Object).Count

    Write-Host "=== LOG MONITOR ===" -ForegroundColor Cyan
    Write-Host "Total Logs: $totalLogs" -ForegroundColor White
    Write-Host "Total Errors: $errorCount" -ForegroundColor Red
    Write-Host ""
    Write-Host "Recent Errors:" -ForegroundColor Yellow
    Get-Content "labBackend\log\logs\error.log" -Tail 5
    Write-Host ""
    Write-Host "(Refreshing every 10 seconds... Press Ctrl+C to stop)"
    Start-Sleep -Seconds 10
}
```

---

## ✅ Daily Monitoring Checklist

- [ ] Check error.log for new errors
- [ ] Monitor failed login attempts
- [ ] Check API response times
- [ ] Look for database connection issues
- [ ] Review 5xx errors
- [ ] Check for duplicate registration attempts
- [ ] Monitor unauthorized access attempts (4xx errors)

---

## 📝 Example Log Output

### Successful API Call

```
[2026-05-06 10:30:45] INFO : 📥 INCOMING REQUEST: {"timestamp":"2026-05-06T10:30:45.123Z","method":"GET","url":"/api/users","ip":"127.0.0.1"}
[2026-05-06 10:30:46] INFO : ✅ API SUCCESS: {"timestamp":"2026-05-06T10:30:46.456Z","method":"GET","url":"/api/users","statusCode":200,"duration":"1234ms"}
```

### Failed API Call

```
[2026-05-06 10:35:20] INFO : 📥 INCOMING REQUEST: {"timestamp":"2026-05-06T10:35:20.111Z","method":"POST","url":"/api/login","ip":"192.168.1.100","body":{"email":"user@example.com"}}
[2026-05-06 10:35:20] ERROR : ❌ API FAILED: {"timestamp":"2026-05-06T10:35:20.234Z","method":"POST","url":"/api/login","statusCode":401,"error":"Invalid password"}
[2026-05-06 10:35:20] ERROR : 💥 ERROR OCCURRED: {"timestamp":"2026-05-06T10:35:20.234Z","method":"POST","url":"/api/login","errorMessage":"Invalid credentials","statusCode":401,"ip":"192.168.1.100"}
```

---

💡 **Happy logging!** 🎉
