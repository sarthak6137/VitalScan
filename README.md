# 🛡️ VitalScan AI 
### *Precision Pre-Operative Intelligence & Risk Analysis*

**VitalScan AI** is a professional-grade, full-stack medical platform. 
It bridges the critical gap between complex medical data and surgical readiness. 
By leveraging **Google Gemini 1.5 Flash AI**, the application extracts deep clinical 
insights from unstructured PDF reports to provide instant surgical safety analysis.

---

## 📌 The Problem
Every year, millions of surgeries face complications because critical patient risks 
are buried in dense, multi-page medical reports. Overworked clinicians and 
patients often struggle to identify "silent" contraindications in lab data.

**VitalScan AI** acts as a "Digital Second Opinion." It automates the extraction 
of vitals to ensure every surgery is a safe surgery by flagging risks 
before they reach the operating table.

---

## ✨ Key Features & Capabilities

### 🧠 1. AI-Driven Clinical Reasoning
Powered by **Gemini AI**, the system doesn't just read text—it understands medical context:
* **Hemodynamic Markers:** Automatically extracts Hemoglobin, Platelets, and Clotting factors.
* **Organ Function:** Analyzes Creatinine (Renal), ALT/AST (Liver), and Glucose levels.
* **Risk Flagging:** Identifies critical imbalances (e.g., Anemia or Electrolyte shifts) that require immediate clinical attention.

### 📊 2. Comprehensive Risk Scoring
The platform calculates a weighted **Surgical Risk Percentage** by cross-referencing:
* **ASA Physical Status:** AI-suggested classification based on comorbidities.
* **Functional Capacity:** Evaluates METs (Metabolic Equivalents) via interactive patient intake.
* **Biometric Integration:** Adjusts risk based on Age, BMI, and lifestyle habits (Smoking/Alcohol).

### 🫀 3. Multi-System Analysis
Continuous monitoring across 8 critical physiological domains:
* **Cardiac & Lung Health:** BP trends and oxygen saturation markers.
* **Neurological & Metabolic:** Cognitive response and insulin sensitivity.
* **Renal & Immune:** Filtration rates and infection risk markers.

---

## 🚀 The Advantages

| Benefit | How VitalScan AI Delivers |
| :--- | :--- |
| **Speed** | Reduces pre-op screening time from days to roughly 10 seconds. |
| **Accuracy** | Minimizes human error by flagging subtle markers in lab reports. |
| **Clarity** | Translates complex medical jargon into clear, patient-friendly advice. |
| **Efficiency** | Helps hospitals prioritize high-risk cases for senior specialist review. |

---

## 🛠️ Technical Stack

* **Frontend:** React 18, **Tailwind CSS**, Framer Motion (Animations).
* **Backend:** Node.js, Express.js (REST API).
* **Database:** **MongoDB Atlas** (Secure Patient History).
* **Intelligence:** Google Gemini 1.5 Flash API.
* **Assets:** **Cloudinary** (Cloud-based icon and image hosting).
* **Icons:** Lucide-React.

---

## 🚦 Getting Started
1. Clone the repo: `https://github.com/sarthak6137/VitalScan.git`
2. Install dependencies: `npm install` in both root and frontend folders.
3. Set up your `.env` with Gemini and MongoDB credentials.
4. Run: `npm run dev`
