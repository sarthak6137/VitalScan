require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path'); // Added for path handling

const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// 🔥 FIX 1: Use Absolute Path for Uploads (Important for Render)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Security
app.use(helmet({
    crossOriginResourcePolicy: false, // Allows images/files to be served if needed
}));

// 🔥 FIX 2: Restricted CORS for Production
// Replace the URL with your actual Vercel deployment URL
app.use(cors({
    origin: [
        "https://your-vitalscan-app.vercel.app", 
        "http://localhost:5173" // Keep local development working
    ],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'VitalScan AI Online' }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error Stack:", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
}); 

// Database Connection
const PORT = process.env.PORT || 5000;

// Set strictQuery to suppress warning in newer Mongoose versions
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    // Listen on 0.0.0.0 is correct for Render
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 VitalScan AI Server live on Port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });