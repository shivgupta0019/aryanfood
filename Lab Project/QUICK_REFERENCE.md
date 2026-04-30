# JWT Authentication - Quick Reference Card

## 🔑 Core Concepts

| Concept           | Details                         |
| ----------------- | ------------------------------- |
| **Token Storage** | `localStorage.getItem("token")` |
| **Token Key**     | `"token"`                       |
| **API Base URL**  | `http://80.225.246.52:5137/api` |
| **Auth Header**   | `Authorization: Bearer <token>` |
| **No Cookies**    | `withCredentials: false`        |

---

## 🚀 Files & Locations

```
src/
├── api/
│   └── axiosConfig.js           ← Interceptors here
├── Components/
│   ├── User/
│   │   └── Login.jsx            ← Login page
│   ├── home/
│   │   ├── Dashboard.jsx        ← Navbar (all pages)
│   │   └── DashboardPage.jsx    ← User dashboard ✨ NEW
│   └── routes/
│       └── ProtectedRoute.jsx   ← Guard routes
└── App.jsx                       ← Routes config
```

---

## 🔄 Authentication Flow

### 1️⃣ User Login

```
Email + Password
    ↓
POST /api/login (NO withCredentials)
    ↓
Get accessToken
    ↓
localStorage.setItem("token", accessToken)
    ↓
Navigate to /dashboard
```

### 2️⃣ Dashboard Load

```
Check: localStorage.getItem("token")
    ↓
If missing → Redirect to /
    ↓
If exists → Fetch GET /api/user
    ↓
Axios adds header: Authorization: Bearer <token>
    ↓
Display user data
```

### 3️⃣ Protected Routes

```
Navigate to /dashboard
    ↓
ProtectedRoute checks token
    ↓
If missing → Navigate to /
    ↓
If exists → Show component
```

---

## 💻 Code Snippets

### Get Token

```javascript
const token = localStorage.getItem("token");
```

### Store Token (After Login)

```javascript
localStorage.setItem("token", res.data.accessToken);
```

### Clear Token (Logout)

```javascript
localStorage.removeItem("token");
```

### Use Protected API

```javascript
import api from "../../api/axiosConfig";

api
  .get("/user") // Token added automatically!
  .then((res) => console.log(res.data))
  .catch((err) => console.log(err));
```

### Check Auth Status

```javascript
const isAuth = !!localStorage.getItem("token");
```

---

## 🛡️ Routes Map

| Route              | Type      | Purpose           |
| ------------------ | --------- | ----------------- |
| `/`                | Public    | Login page        |
| `/signup`          | Public    | Register          |
| `/otp`             | Public    | OTP verification  |
| `/forgot-password` | Public    | Password recovery |
| `/dashboard`       | Protected | User dashboard    |
| `/project`         | Protected | Project page      |
| `/centrallab`      | Protected | Lab page          |
| `/result`          | Protected | Results page      |

---

## 🔍 Debugging

### Check Token in Console

```javascript
console.log(localStorage.getItem("token"));
```

### Check Authorization Header (Network Tab)

1. Open DevTools → Network
2. Make any API request
3. Click request → Headers
4. Look for: `Authorization: Bearer ...`

### Check Axios Config

```javascript
import api from "../../api/axiosConfig";
console.log(api.defaults);
```

---

## ⚠️ Common Issues & Fixes

| Issue          | Solution                                        |
| -------------- | ----------------------------------------------- |
| Token not set  | Check login response has `accessToken` field    |
| 401 errors     | Token might be expired or invalid               |
| Missing header | Ensure using `api` instance, not `axios`        |
| Stuck on login | Clear localStorage and try again                |
| Redirect loops | Check ProtectedRoute is only on protected paths |

---

## 📡 API Endpoints

### Login

```
POST /api/login
Body: { email, password }
Response: { accessToken, otpRequired? }
```

### Get User

```
GET /api/user
Headers: Authorization: Bearer <token>
Response: { name, email, phone, role, ... }
```

### Logout

```
POST /api/logout
Headers: Authorization: Bearer <token>
```

---

## 🔐 Security Checklist

- ✅ Token stored in localStorage
- ✅ No `withCredentials` used
- ✅ Authorization header auto-attached
- ✅ 401 triggers logout
- ✅ Protected routes guard access
- ✅ Errors handled gracefully
- ✅ Loading states shown
- ✅ Token cleared on logout

---

## 📊 State Management in Components

```javascript
const [userData, setUserData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  // Check token
  const token = localStorage.getItem("token");
  if (!token) navigate("/");

  // Fetch data
  api
    .get("/user")
    .then((res) => setUserData(res.data))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, []);
```

---

## 🎯 Key Takeaways

1. **Token is in localStorage** under key `"token"`
2. **Axios interceptor** automatically adds auth header
3. **ProtectedRoute** prevents unauthorized access
4. **401 response** triggers automatic logout
5. **Dashboard** shows user data from `/api/user`
6. **No cookies** - pure JWT approach
7. **Error handling** included for all flows

---

## ✅ Verification Checklist

Before going to production:

- [ ] Test login with valid credentials
- [ ] Verify token in localStorage
- [ ] Check Authorization header in network requests
- [ ] Test protected route without token
- [ ] Test logout functionality
- [ ] Test 401 error handling
- [ ] Test dashboard data loading
- [ ] Test error messages on failed login
- [ ] Clear localStorage and test again
- [ ] Test on multiple browsers

---

**Last Updated:** April 30, 2026  
**Implementation Status:** ✅ COMPLETE
