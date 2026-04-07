import React from 'react';
import { 
  AlertOctagon, CheckCircle2, ClipboardList, 
  Stethoscope, Activity, ShieldAlert, Heart, Wind, Droplets, Info, TrendingDown, FileWarning
} from 'lucide-react';

const FullAnalysisReport = ({ data }) => {
  if (!data || !data.aiResponse) return null;

  const { aiResponse, ai_message, createdAt } = data;

  // 🔥 NEW: GUARDRAIL FOR INVALID REPORTS
  // If the backend flagged this as an invalid report, show the Error State immediately
  if (aiResponse.critical_flags?.includes("INVALID_REPORT") || aiResponse.surgery_risk?.level === "UNKNOWN") {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border-2 border-red-100 shadow-xl text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileWarning size={40} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-black text-navy-900 mb-2">Invalid Document Detected</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          {aiResponse.surgery_risk?.explanation || "The uploaded file does not appear to be a clinical medical report. Please ensure you upload a PDF containing patient vitals and lab results."}
        </p>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left mb-6">
          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Why was this rejected?</h4>
          <ul className="text-xs text-slate-500 space-y-2">
            <li>• Document lacks clinical markers (BP, SpO2, Hemoglobin)</li>
            <li>• Content matches non-medical patterns (Resume, Invoice, etc.)</li>
            <li>• Insufficient data to generate a safe surgical assessment</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-navy-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-medical-600 transition-colors"
        >
          Try Again with Medical PDF
        </button>
      </div>
    );
  }

  // --- REST OF YOUR BEAUTIFUL DASHBOARD CODE ---

  const renderSummaryContent = (summary) => {
    if (typeof summary === 'string') return <p>{summary}</p>;
    if (typeof summary === 'object' && summary !== null) {
      return (
        <div className="grid gap-2 text-xs md:text-sm leading-snug">
          <p><span className="text-medical-400 font-black uppercase text-[10px] mr-2">Status:</span> {summary.condition_explanation}</p>
          <p><span className="text-medical-400 font-black uppercase text-[10px] mr-2">Significance:</span> {summary.why_it_matters}</p>
          <p className="text-red-300"><span className="font-black uppercase text-[10px] mr-2">Impact:</span> {summary.risk_impact}</p>
          <p className="text-medical-300 font-bold border-t border-white/5 pt-1 mt-1">
            <span className="uppercase text-[10px] mr-2">Next Steps:</span> {summary.what_to_do}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. DOCTOR GREETING */}
      <div className="bg-navy-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden border-b-8 border-medical-500">
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 text-medical-400 mb-3">
            <Stethoscope size={20} />
            <span className="font-black uppercase tracking-widest text-[10px]">AI Clinical Assessment</span>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-bold leading-tight">
              {typeof ai_message === 'string' ? ai_message.split('\n').filter(l => l.trim())[0] : 'Hi Patient,'}
              <span className="text-medical-400 font-medium italic block text-sm mt-0.5">I am your AI Doctor.</span>
            </h2>
            <p className="text-base md:text-lg font-semibold text-slate-200 leading-tight mt-1">
              Based on your report, surgery risk is <span className="text-red-400 underline">{aiResponse.surgery_risk?.level}</span>.
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
             {renderSummaryContent(aiResponse.patient_friendly_summary)}
          </div>
        </div>
        <Activity size={120} className="absolute -right-6 -bottom-6 opacity-10 rotate-12 pointer-events-none" />
      </div>

      {/* 2. TOP LEVEL RISK GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        <RiskMainCard 
          title="Surgery Risk" 
          value={aiResponse.surgery_risk?.level} 
          percent={aiResponse.surgery_risk?.percentage} 
          desc={aiResponse.surgery_risk?.explanation}
        />
        <RiskMainCard 
          title="Mortality Risk" 
          value={aiResponse.mortality_risk?.level} 
          desc={aiResponse.mortality_risk?.explanation}
        />
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center h-full">
          <span className="text-xs font-black text-slate-400 uppercase mb-1 tracking-tighter">ASA Classification</span>
          <span className="text-4xl font-black text-navy-900">{aiResponse.asa_score}</span>
          <span className="text-[10px] font-bold text-medical-600 mt-2 bg-medical-50 px-2 py-0.5 rounded-full">
            Confidence: {aiResponse.confidence_score}%
          </span>
        </div>
      </div>

      {/* 3. SYSTEMIC ORGAN RISKS */}
      <div className="grid lg:grid-cols-3 gap-6">
        <OrganCard icon={<Heart className="text-red-500" />} label="Cardiac" level={aiResponse.cardiac_risk?.level} reason={aiResponse.cardiac_risk?.reason} />
        <OrganCard icon={<Wind className="text-blue-500" />} label="Respiratory" level={aiResponse.respiratory_risk?.level} reason={aiResponse.respiratory_risk?.reason} />
        <OrganCard icon={<Droplets className="text-purple-500" />} label="Blood" level={aiResponse.blood_risk?.level} reason={aiResponse.blood_risk?.reason} />
      </div>

      {/* 4. DECISION & TIMELINE */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl border-l-8 shadow-lg flex flex-col justify-center ${getDecisionStyles(aiResponse.final_decision)}`}>
          <h4 className="text-[10px] font-black uppercase opacity-70 mb-1">Final Clinical Decision</h4>
          <p className="text-3xl font-black">{aiResponse.final_decision}</p>
          <p className="text-sm font-bold flex items-center gap-2 mt-1">
            <TrendingDown size={16}/> Timeline: {aiResponse.surgery_timeline}
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
          <h4 className="text-red-700 font-bold mb-3 flex items-center gap-2 uppercase text-[10px] tracking-widest">
            <AlertOctagon size={18} /> Critical Flags
          </h4>
          <div className="flex flex-wrap gap-2">
            {aiResponse.critical_flags?.map((flag, i) => (
              <span key={i} className="bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                ⚠️ {flag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RISK FACTORS GRID */}
      <div className="bg-slate-900 p-6 rounded-3xl text-white">
          <h4 className="text-medical-400 font-black mb-4 uppercase text-[10px] tracking-widest">Identified Key Risk Factors</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {aiResponse.key_risk_factors?.map((factor, i) => (
              <div key={i} className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-xs font-medium">
                • {factor}
              </div>
            ))}
          </div>
      </div>

      {/* 6. ADVICE & TESTS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="text-navy-900 font-black mb-4 flex items-center gap-2 text-sm">
            <ClipboardList size={18} className="text-medical-500" /> Recommended Tests
          </h4>
          <div className="space-y-2">
            {aiResponse.recommended_tests?.map((test, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 font-bold text-navy-800 text-xs">
                <CheckCircle2 size={14} className="text-medical-500" /> {test}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-medical-50 p-6 rounded-3xl border border-medical-100">
          <h4 className="text-medical-900 font-black mb-4 flex items-center gap-2 text-sm">
            <ShieldAlert size={18} className="text-medical-600" /> Medical Advice
          </h4>
          <ul className="space-y-3">
            {aiResponse.doctor_advice?.map((advice, i) => (
              <li key={i} className="flex items-start gap-3 text-medical-800 text-xs font-semibold italic bg-white/50 p-3 rounded-xl">
                <Info size={14} className="mt-0.5 flex-shrink-0" />
                {advice}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. FOOTER DISCLAIMER */}
      <div className="text-center py-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
          {aiResponse.disclaimer} • Processed: {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>

    </div>
  );
};

/* --- SUB COMPONENTS --- */

const RiskMainCard = ({ title, value, percent, desc }) => (
  <div className={`p-6 rounded-3xl border-2 shadow-sm flex flex-col h-full ${value === 'High' ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
      {percent && <span className="text-2xl font-black text-red-600 leading-none">{percent}%</span>}
    </div>
    <div className="flex-grow">
      <p className={`text-3xl font-black leading-tight ${value === 'High' ? 'text-red-600' : 'text-navy-900'}`}>{value}</p>
    </div>
    <p className="text-[11px] text-slate-500 font-medium mt-3 leading-snug border-t border-slate-100 pt-3">{desc}</p>
  </div>
);

const OrganCard = ({ icon, label, level, reason }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
    <div className="flex items-center gap-3 mb-3">
      <div className="bg-slate-50 p-2 rounded-lg">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{label}</p>
        <p className={`text-lg font-black leading-none ${level === 'High' ? 'text-red-600' : 'text-navy-900'}`}>{level}</p>
      </div>
    </div>
    <div className="w-full bg-slate-100 h-1.5 rounded-full mb-3 overflow-hidden">
        <div className={`h-full ${level === 'High' ? 'bg-red-500 w-[90%]' : level === 'Moderate' ? 'bg-amber-500 w-[50%]' : 'bg-green-500 w-[20%]'}`} />
    </div>
    <p className="text-[10px] text-slate-500 italic font-medium leading-tight flex-grow">{reason}</p>
  </div>
);

const getDecisionStyles = (decision = "") => {
  const d = String(decision).toLowerCase();
  if (d.includes('delay')) return "bg-red-50 border-red-500 text-red-700";
  if (d.includes('safe')) return "bg-green-50 border-green-500 text-green-700";
  return "bg-amber-50 border-amber-500 text-amber-700";
};

export default FullAnalysisReport;