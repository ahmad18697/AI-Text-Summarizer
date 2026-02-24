// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// // DB connection
// const connectDB = require("./config/db");

// // Routes
// const summaryRoutes = require("./routes/summaryRoutes");
// const historyRoutes = require("./routes/historyRoutes");
// const authRoutes = require("./routes/authRoutes");

// const app = express();

// /* =======================
//    Database Connection
// ======================= */
// connectDB();

// /* =======================
//    CORS Configuration
// ======================= */
// const allowedOrigins = new Set(
//   (process.env.CLIENT_ORIGINS ||
//     process.env.CLIENT_ORIGIN ||
//     "http://localhost:5173")
//     .split(",")
//     .map((o) => o.trim())
//     .filter(Boolean)
// );

// // Allow Vite dev ports
// for (let port = 5173; port <= 5179; port++) {
//   allowedOrigins.add(`http://localhost:${port}`);
// }

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true); // Postman, curl
//       if (allowedOrigins.has(origin)) return callback(null, true);
//       return callback(new Error("CORS blocked: " + origin));
//     },
//     credentials: true,
//   })
// );

// /* =======================
//    Middlewares
// ======================= */
// app.use(express.json());
// app.use(cookieParser());

// /* =======================
//    Root Route (FIX)
// ======================= */
// app.get("/", (req, res) => {
//   res.json({
//     name: "AI Text Summarizer API",
//     status: "running 🚀",
//     endpoints: {
//       health: "/health",
//       auth: "/auth",
//       summarize: "/api/summary",
//       history: "/api/history",
//     },
//   });
// });

// /* =======================
//    Health Check
// ======================= */
// app.get("/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// /* =======================
//    API Routes
// ======================= */
// app.use("/auth", authRoutes);
// app.use("/api/summary", summaryRoutes);
// app.use("/api/history", historyRoutes);

// /* =======================
//    Server Start
// ======================= */
// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const summaryRoutes = require("./routes/summaryRoutes");
const historyRoutes = require("./routes/historyRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* ================= DATABASE ================= */
connectDB();

/* ================= CORS ================= */
const allowedOrigins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, mobile apps
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

/* ================= MIDDLEWARES ================= */
app.use(express.json());
app.use(cookieParser());

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.json({
    name: "AI Text Summarizer API",
    status: "running 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

/* ================= HEALTH ================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/history", historyRoutes);

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});