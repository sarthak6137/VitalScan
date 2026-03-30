require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Absolute Path for Uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Security
app.use(helmet({
    crossOriginResourcePolicy: false,
}));


app.use(cors({
    origin: [
        "https://vital-scan-beta.vercel.app", // Use your main production URL
        "https://vital-scan-ctaz27f3y-sarthak-gokhales-projects.vercel.app", // Your specific build URL
        "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return cors()(req, res, next);
    }
    next();
});

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
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 VitalScan AI Server live on Port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });