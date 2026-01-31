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
      if (!origin) return callback(null, true); // Postman, curl
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("CORS blocked: " + origin));
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
