require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const summaryRoutes = require('./routes/summaryRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/summarize', summaryRoutes);
app.use('/api/history', historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));