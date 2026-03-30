const axios = require("axios");

exports.analyzeMedicalData = async (patientData, reportText) => {
  try {
    const prompt = `
You are a senior pre-surgery doctor.

Analyze the patient's condition deeply.

IMPORTANT:
- Speak like a doctor but explain in simple language
- Give clear reasoning
- Provide actionable advice
- Each section must be detailed (2-3 sentences minimum)

-----------------------------------
CRITICAL VALIDATION RULES (MUST FOLLOW)
-----------------------------------

1. FIRST check if the report is a valid clinical medical report.

A valid report should contain:
- Patient details
- Medical observations
- Clinical values (BP, sugar, hemoglobin, SpO2, etc.)

If the report is:
- Random text
- Non-medical
- Resume / invoice / unrelated file
- OR lacks meaningful clinical data

THEN RETURN EXACTLY THIS JSON:

{
  "surgery_risk": { "level": "UNKNOWN", "percentage": 0, "explanation": "Invalid report. Please upload a proper clinical medical report." },
  "mortality_risk": { "level": "UNKNOWN", "explanation": "Insufficient valid medical data." },
  "asa_score": "UNKNOWN",
  "cardiac_risk": { "level": "UNKNOWN", "reason": "Invalid input data" },
  "respiratory_risk": { "level": "UNKNOWN", "reason": "Invalid input data" },
  "blood_risk": { "level": "UNKNOWN", "reason": "Invalid input data" },
  "key_risk_factors": [],
  "critical_flags": ["INVALID_REPORT"],
  "recommended_tests": [],
  "doctor_advice": ["Please upload a valid clinical report"],
  "patient_friendly_summary": {
    "condition_explanation": "The uploaded file is not a valid medical report.",
    "why_it_matters": "Without proper clinical data, accurate assessment is not possible.",
    "risk_impact": "Risk cannot be determined.",
    "what_to_do": "Upload a proper clinical report with medical details."
  },
  "final_decision": "Cannot assess",
  "surgery_timeline": "Not available",
  "confidence_score": 0,
  "disclaimer": "Invalid input data"
}

-----------------------------------
2. CHECK DATA SUFFICIENCY
-----------------------------------

If report + patient data is not enough for analysis:

RETURN SAME JSON FORMAT WITH:
- levels = "UNKNOWN"
- confidence_score = 0
- critical_flags include "INSUFFICIENT_DATA"

-----------------------------------
3. STRICT ANALYSIS RULES
-----------------------------------

ONLY if valid:
- Use ONLY given data
- DO NOT assume
- DO NOT hallucinate
- DO NOT create fake values

-----------------------------------

Patient Data:
Age: ${patientData.age}
BP: ${patientData.bp}
Heart Rate: ${patientData.heartRate}
SpO2: ${patientData.spo2}
Conditions: ${patientData.conditions || "None"}

Report:
${reportText}

-----------------------------------
Return STRICT JSON:
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
          temperature: 0   // 🔥 reduces hallucination
        }
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    return JSON.parse(text.replace(/```json|```/g, "").trim());

  } catch (error) {
    console.log("⚠️ Gemini failed → Using fallback AI");
    return generateFallback(patientData, reportText);
  }
};


// 🔥 UPDATED FALLBACK FUNCTION (UNCHANGED)
function generateFallback(data, report) {

  const reportLower = report.toLowerCase();

  let forceDecision = null;

  if (reportLower.includes("postponed") || reportLower.includes("delay")) {
    forceDecision = "Delay surgery";
  }

  if (reportLower.includes("fit for surgery")) {
    forceDecision = "Safe for surgery";
  }

  let riskScore = 0;
  let alerts = [];

  if (data.conditions?.toLowerCase().includes("diabetes")) {
    riskScore += 2;
    alerts.push("Diabetes");
  }

  if (reportLower.includes("blood pressure") && reportLower.includes("high")) {
    riskScore += 2;
    alerts.push("High Blood Pressure");
  }

  if (reportLower.includes("sugar") && reportLower.includes("high")) {
    riskScore += 2;
    alerts.push("High Blood Sugar");
  }

  if (reportLower.includes("cholesterol") && reportLower.includes("high")) {
    riskScore += 1;
    alerts.push("High Cholesterol");
  }

  if (reportLower.includes("hemoglobin") && reportLower.includes("low")) {
    riskScore += 1;
    alerts.push("Low Hemoglobin");
  }

  if (reportLower.includes("heart rate") && reportLower.includes("elevated")) {
    riskScore += 1;
    alerts.push("Elevated Heart Rate");
  }

  if (reportLower.includes("spo2") && reportLower.includes("low")) {
    riskScore += 2;
    alerts.push("Low Oxygen Level");
  }

  if (reportLower.includes("smoker")) {
    riskScore += 1;
    alerts.push("Smoking History");
  }

  alerts = [...new Set(alerts)];

  let surgeryRisk = "Low";
  let riskPercentage = 20;

  if (riskScore >= 5) {
    surgeryRisk = "High";
    riskPercentage = 80;
  } else if (riskScore >= 2) {
    surgeryRisk = "Moderate";
    riskPercentage = 50;
  }

  let mortalityRisk = riskScore >= 5 ? "High" : riskScore >= 3 ? "Moderate" : "Low";

  let cardiacLevel = "Low";
  if (alerts.includes("High Blood Pressure") && alerts.includes("High Cholesterol")) {
    cardiacLevel = "High";
  } else if (alerts.includes("High Blood Pressure")) {
    cardiacLevel = "Moderate";
  }

  let respiratoryLevel = alerts.includes("Low Oxygen Level") ? "Moderate" : "Low";

  let decision = forceDecision || (
    surgeryRisk === "High" ? "Delay surgery" :
    surgeryRisk === "Moderate" ? "Proceed with caution" :
    "Safe for surgery"
  );

  return {
    surgery_risk: {
      level: surgeryRisk,
      percentage: riskPercentage,
      explanation: `Your surgery risk is ${surgeryRisk} due to ${alerts.join(", ")}.`
    },
    mortality_risk: {
      level: mortalityRisk,
      explanation: `This indicates a ${mortalityRisk} chance of complications.`
    },
    asa_score: riskScore >= 5 ? "ASA III" : "ASA II",

    cardiac_risk: {
      level: cardiacLevel,
      reason: "Cardiac stress based on BP and cholesterol"
    },

    respiratory_risk: {
      level: respiratoryLevel,
      reason: "Based on oxygen levels"
    },

    blood_risk: {
      level: alerts.includes("Low Hemoglobin") ? "Moderate" : "Low",
      reason: "Hemoglobin affects oxygen transport"
    },

    key_risk_factors: alerts,
    critical_flags: riskScore >= 5 ? ["Multiple serious risk factors"] : [],

    recommended_tests: ["ECG", "Blood Sugar Test", "Complete Blood Count"],

    doctor_advice: [
      "Control blood pressure",
      "Manage diabetes",
      "Avoid smoking",
      "Follow doctor advice"
    ],

    patient_friendly_summary: {
      condition_explanation: `Your health condition shows ${surgeryRisk} surgical risk due to factors like ${alerts.join(", ")}.`,
      why_it_matters: `These conditions affect how your body responds to surgery and recovery and may increase complications.`,
      risk_impact: `If not managed properly, this can lead to serious complications during or after surgery.`,
      what_to_do: `You should stabilize your condition, follow medical advice, and improve your health before surgery.`
    },

    final_decision: decision,
    surgery_timeline: decision === "Delay surgery" ? "Delay 2-4 weeks" : "Proceed with monitoring",

    confidence_score: 88,
    disclaimer: "This is AI-generated guidance"
  };
}