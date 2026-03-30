const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  patientData: {
    age: Number,
    gender: String,
    bp: String,
    heartRate: Number,
    sugar: Number,
    spo2: Number,
    conditions: String,
    medications: String
  },

  reportText: String,

  // 🔥 ADD THIS (you were missing it)
  reportUrl: String,

  // 🔥 STRUCTURED AI RESPONSE
  aiResponse: {
    surgery_risk: {
      level: String,
      percentage: Number,
      explanation: String
    },

    mortality_risk: {
      level: String,
      explanation: String
    },

    asa_score: String,

    cardiac_risk: {
      level: String,
      reason: String
    },

    respiratory_risk: {
      level: String,
      reason: String
    },

    blood_risk: {
      level: String,
      reason: String
    },

    key_risk_factors: [String],
    critical_flags: [String],
    recommended_tests: [String],
    doctor_advice: [String],

    patient_friendly_summary: {
    condition_explanation: String,
    why_it_matters: String,
    risk_impact: String,
    what_to_do: String
    },
    detailed_explanation: String,

    final_decision: String,
    surgery_timeline: String,

    confidence_score: Number,
    disclaimer: String
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 🔥 PERFORMANCE BOOST (for history feature)
analysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);