const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("./config/db");
const pro = "http://80.225.246.52:5173";
const dev = "http://localhost:5173";
const app = express();

// ✅ CORS FIX
app.use(
  cors({
    origin: pro,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
