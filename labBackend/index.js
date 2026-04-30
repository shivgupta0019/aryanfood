// const express = require("express");
// const cors = require("cors");
// const userRoutes = require("./routes/userRoutes");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// require("./config/db");

// const pro = "http://80.225.246.52:5137/";
// const dev = "http://localhost:5173";
// const app = express();

// // ✅ CORS FIX
// app.use(
//   cors({
//     origin: pro,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(morgan("dev"));

// app.use("/uploads", express.static("uploads"));

// // Routes
// app.use("/api", userRoutes);

// // Server
// app.listen(5000, () => {
//   console.log("🚀 Server running on port 5000");
// });

const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
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
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", userRoutes);

// Server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
