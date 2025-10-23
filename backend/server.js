require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const summaryRoutes = require('./routes/summaryRoutes');
const historyRoutes = require('./routes/historyRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
connectDB();

// Dynamic CORS: allow comma-separated CLIENT_ORIGINS and common Vite ports
const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
);
// Allow localhost:5173-5179 by default for dev
for (let p = 5173; p <= 5179; p++) allowedOrigins.add(`http://localhost:${p}`);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // mobile apps, curl
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('CORS blocked: ' + origin));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/history', historyRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
