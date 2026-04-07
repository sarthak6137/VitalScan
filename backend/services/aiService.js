const axios = require("axios");

exports.analyzeMedicalData = async (patientData, reportText) => {
  try {
    // 🛡️ STEP 1: PRE-PROCESSING (Segment Filtering)
    // We break the text into lines and only keep those with clinical units.
    // This effectively deletes "Experience" or "Education" sections from a CV.
    const lines = reportText.split('\n');
    const medicalMarkers = [
      'mg/dl', 'mmol/l', 'g/dl', 'bp', 'spo2', 'systolic', 'diastolic', 
      'glucose', 'hemoglobin', 'bilirubin', 'creatinine', 'urea', 
      'platelets', 'wbc', 'rbc', 'vitals', 'range', 'clinical'
    ];

    const filteredSegments = lines.filter(line => 
      medicalMarkers.some(marker => line.toLowerCase().includes(marker))
    ).join('\n');

    // 🚩 CIRCUIT BREAKER: If no clinical segments found, skip Gemini entirely.
    if (filteredSegments.trim().length < 30) {
        console.log("🚫 AI Service: No clinical evidence found. Returning Invalid JSON.");
        return getInvalidJsonResponse();
    }

    const prompt = `
You are a senior pre-surgery doctor.
Analyze the following CLINICAL SEGMENTS extracted from a report.

IMPORTANT:
- If the segments do not contain valid medical lab values or vitals, you MUST return the INVALID_REPORT JSON below.
- Do NOT assume values for missing data.

-----------------------------------
PATIENT DATA:
Age: ${patientData.age}
Weight: ${patientData.weight}kg | Height: ${patientData.height}cm
Vitals Input: BP ${patientData.bp || 'N/A'}, SpO2 ${patientData.spo2 || 'N/A'}

CLINICAL REPORT SEGMENTS:
${filteredSegments}
-----------------------------------

VALIDATION RULE:
If the report segments are random, non-medical, or a resume, return:
{
  "surgery_risk": { "level": "UNKNOWN", "percentage": 0, "explanation": "Invalid report. Please upload a proper clinical medical report." },
  "critical_flags": ["INVALID_REPORT"],
  "confidence_score": 0,
  "patient_friendly_summary": {
    "condition_explanation": "The uploaded file is not a valid medical report.",
    "what_to_do": "Upload a proper clinical report with medical details."
  },
  "final_decision": "Cannot assess"
}

OTHERWISE, return full analysis in this structure:
{
  "surgery_risk": { "level": "", "percentage": 0, "explanation": "" },
  "mortality_risk": { "level": "", "explanation": "" },
  "asa_score": "",
  "cardiac_risk": { "level": "", "reason": "" },
  "respiratory_risk": { "level": "", "reason": "" },
  "blood_risk": { "level": "", "reason": "" },
  "key_risk_factors": [],
  "critical_flags": [],
  "recommended_tests": [],
  "doctor_advice": [],
  "patient_friendly_summary": {
    "condition_explanation": "",
    "why_it_matters": "",
    "risk_impact": "",
    "what_to_do": ""
  },
  "final_decision": "",
  "surgery_timeline": "",
  "confidence_score": 0,
  "disclaimer": ""
}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json" // 🔥 Forces Gemini to output pure JSON
        }
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(text.trim());

  } catch (error) {
    console.log("⚠️ Gemini failed or rejected → Using strict fallback check");
    return generateFallback(patientData, reportText);
  }
};

// Standardized Invalid Response
function getInvalidJsonResponse() {
    return {
        surgery_risk: { level: "UNKNOWN", percentage: 0, explanation: "Invalid report. No medical data found." },
        critical_flags: ["INVALID_REPORT"],
        confidence_score: 0,
        patient_friendly_summary: {
            condition_explanation: "This file is not a valid medical report.",
            what_to_do: "Please upload a clinical PDF."
        },
        final_decision: "Cannot assess"
    };
}

function generateFallback(data, report) {
  const reportLower = report.toLowerCase();

  // 🛡️ Hard Gatekeeper for Fallback: Don't hallucinate if it's a CV
  const isMedical = ['mg/dl', 'bp', 'glucose', 'hemoglobin'].some(m => reportLower.includes(m));
  if (!isMedical) return getInvalidJsonResponse();

  // ... (Your existing fallback logic here) ...
  let riskScore = 0;
  let alerts = [];
  // (Include your existing keyword logic for riskScore and alerts)
  
  return {
    surgery_risk: { level: "Moderate", percentage: 50, explanation: "Fallback analysis active." },
    critical_flags: ["FALLBACK_MODE"],
    final_decision: "Consult Surgeon"
  };
}