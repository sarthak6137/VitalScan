/**
 * VitalScan AI Utility Helpers
 */

// 1. Clean Gemini JSON String
// Sometimes Gemini wraps JSON in markdown blocks (```json ... ```)
// This utility ensures we get a clean object.
exports.parseAiResponse = (rawString) => {
  try {
    const cleanString = rawString.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanString);
  } catch (error) {
    console.error("Utility Error: Failed to parse AI JSON", error);
    return { error: "Failed to parse analysis", raw: rawString };
  }
};

// 2. Validate Vitals
// Ensures the user isn't sending junk data to the AI (which saves tokens/costs)
exports.validateVitals = (data) => {
  const errors = [];
  if (data.age < 0 || data.age > 120) errors.push("Invalid age range");
  if (data.spo2 && (data.spo2 < 50 || data.spo2 > 100)) errors.push("SpO2 out of physiological range");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 3. Format Date
exports.formatDate = (date) => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(date));
};