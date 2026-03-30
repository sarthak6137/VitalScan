/**
 * VitalScan AI Logger Utility
 * Helps track the flow of PDF processing and AI calls
 */
const logger = {
  info: (message) => {
    console.log(`[INFO] ℹ️  ${new Date().toLocaleTimeString()}: ${message}`);
  },
  error: (message, err) => {
    console.error(`[ERROR] 🔥 ${new Date().toLocaleTimeString()}: ${message}`, err ? (err.message || err) : '');
  },
  ai: (message) => {
    console.log(`[GEMINI AI] 🤖 ${message}...`);
  }
};

module.exports = logger;