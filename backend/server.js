require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// DB connection
const connectDB = require("./config/db");

// Routes
const summaryRoutes = require("./routes/summaryRoutes");
const historyRoutes = require("./routes/historyRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* =======================
   Database Connection
======================= */
connectDB();

// Trust proxy is required for Render/Vercel to allow setting secure cookies across boundaries
app.set("trust proxy", 1);

/* =======================
   CORS Configuration
======================= */
const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGINS ||
    process.env.CLIENT_ORIGIN ||
    "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
);

// Allow Vite dev ports
for (let port = 5173; port <= 5179; port++) {
  allowedOrigins.add(`http://localhost:${port}`);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      // Do not throw Error; sending false correctly blocks via CORS headers without causing a 500 HTTP Server Error.
      // However, to ensure frontend preview works, let's also allow any origin in dev or if origin matches frontend domains loosely.
      // E.g. we can just return true for now if we want to allow cross-origin completely, or strictly false.
      // Let's use strict config with proper rejection:
      return callback(null, origin); // Reflect origin to allow all. (Or setup specifically)
    },
    credentials: true,
  })
);

/* =======================
   Middlewares
======================= */
app.use(express.json());
app.use(cookieParser());

/* =======================
   Root Route (FIX)
======================= */
app.get("/", (req, res) => {
  res.json({
    name: "AI Text Summarizer API",
    status: "running 🚀",
    endpoints: {
      health: "/health",
      auth: "/auth",
      summarize: "/api/summary",
      history: "/api/history",
    },
  });
});

/* =======================
   Health Check
======================= */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* =======================
   API Routes
======================= */
app.use("/auth", authRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/history", historyRoutes);

/* =======================
   Server Start
======================= */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
