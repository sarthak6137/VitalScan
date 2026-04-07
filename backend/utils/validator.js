const natural = require('natural');

/**
 * Level 3 Specialized Classifier
 * This trains a local model to distinguish between Medical Reports 
 * and Non-Medical documents (Resumes, Invoices, etc.)
 */
const classifier = new natural.BayesClassifier();

// 🏥 CATEGORY: MEDICAL (The "Clinical" Profile)
const medicalSamples = [
    'hemoglobin wbc rbc platelets glucose bp systolic diastolic spo2',
    'patient diagnosis hospital clinic laboratory test results fasting',
    'bilirubin creatinine urea sodium potassium thyroid tsh clinical findings',
    'discharge summary referral history physical examination physician notes',
    'lipid profile triglycerides cholesterol hdl ldl normal range mg/dl mmol/l',
    'cardiology respiratory assessment surgical clearance physical vitals'
];
medicalSamples.forEach(text => classifier.addDocument(text, 'medical'));

// 📄 CATEGORY: NON-MEDICAL (The "Professional" Profile)
const nonMedicalSamples = [
    'experience education skills projects internship achievements curriculum vitae',
    'work history professional summary profile languages github linkedin contact',
    'developed implemented managed collaborated lead software developer engineer',
    'billing invoice amount price quantity tax subtotal total due payment',
    'university degree bachelor master gpa honors certification personal profile',
    'hobbies interests objective references available upon request'
];
nonMedicalSamples.forEach(text => classifier.addDocument(text, 'non-medical'));

// Train the model (happens instantly on server start)
classifier.train();

/**
 * Validates if the text belongs to a medical report
 * @param {string} text - Extracted text from PDF
 * @returns {boolean}
 */
const isMedicalReport = (text) => {
    if (!text || text.trim().length < 50) return false;

    // Use lowercase for better matching
    const label = classifier.classify(text.toLowerCase());
    
    // Optional: Log for debugging in your terminal
    console.log(`🛡️  Validator Result: ${label}`);

    return label === 'medical';
};

module.exports = isMedicalReport;