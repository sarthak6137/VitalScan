const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Multer Configuration (Local Temp Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDFs are allowed!'), false);
  }
});

// The Main Analysis Endpoint
router.post('/analyze', authMiddleware, upload.single('report'), reportController.analyzeReport);

// Get History Endpoint
router.get('/history', authMiddleware, async (req, res) => {
  const Analysis = require('../models/Analysis');
  const history = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(history);
});

module.exports = router;