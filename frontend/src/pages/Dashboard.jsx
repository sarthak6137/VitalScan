import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  UploadCloud, FileText, Activity, AlertTriangle, 
  CheckCircle, ChevronRight, History, LogOut, User,
  Baby, Scale, Ruler, Wind, Wine, Stethoscope
} from 'lucide-react';

import FullAnalysisReport from '../components/dashboard/FullAnalysisReport';

const Dashboard = () => {
  const [step, setStep] = useState('input'); 
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const [vitals, setVitals] = useState({
    age: '', 
    gender: 'male', 
    weight: '', 
    height: '', 
    smokingStatus: 'never', 
    drinkingStatus: 'none', 
    canClimbStairs: 'yes',
    surgicalHistory: '', 
    conditions: '', 
    medications: ''
  });

  const [analysis, setAnalysis] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/reports/history');
      setHistory(res.data);
    } catch (err) { console.error("History fetch failed"); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // 🔥 MANDATORY FIELD VALIDATION
    const requiredFields = ['age', 'weight', 'height'];
    const isMissingBiometrics = requiredFields.some(field => !vitals[field]);

    if (isMissingBiometrics) {
      return toast.error("Please fill in mandatory Age, Weight, and Height.");
    }

    if (!file) {
      return toast.error("Please select a PDF report to analyze.");
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('report', file);
    Object.keys(vitals).forEach(key => formData.append(key, vitals[key]));

    try {
      const res = await api.post('/reports/analyze', formData);
      setAnalysis(res.data.data);
      setStep('result');
      toast.success("Analysis Complete!");
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.error || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-12 px-4 md:px-8 text-navy-900">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-navy-900 p-2 rounded-lg text-white group-hover:bg-medical-600 transition-colors">
            <Activity size={20}/>
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-navy-900 leading-none text-lg tracking-tighter uppercase">VitalScan</h2>
            <span className="text-[10px] font-bold text-medical-600 uppercase tracking-[0.2em]">Dashboard</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block border-r border-slate-100 pr-4">
            <p className="text-sm font-bold text-navy-900">{user?.name}</p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-navy-900">Clinical Portal</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-500 rounded-xl transition-all font-bold text-sm">
            <LogOut size={18}/>
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 'input' ? (
              <motion.div 
                key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[32px] shadow-xl border border-slate-200 p-8"
              >
                <div className="mb-8">
                    <h3 className="text-2xl font-black text-navy-900 flex items-center gap-3 uppercase tracking-tighter">
                    <Stethoscope className="text-medical-500" /> Patient Intake Form
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Please fill out all mandatory (*) fields to ensure analysis accuracy.</p>
                </div>
                
                <form onSubmit={handleUpload} className="space-y-8">
                  {/* SECTION 1: IDENTITY & BIOMETRICS (Mandatory) */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <InputField label="Age *" type="number" icon={<Baby size={14}/>} value={vitals.age} required onChange={val => setVitals({...vitals, age: val})} />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Gender *</label>
                        <select 
                            required
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-medical-500 transition-all text-navy-900"
                            value={vitals.gender}
                            onChange={(e) => setVitals({...vitals, gender: e.target.value})}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <InputField label="Weight (kg) *" type="number" icon={<Scale size={14}/>} value={vitals.weight} required onChange={val => setVitals({...vitals, weight: val})} />
                    <InputField label="Height (cm) *" type="number" icon={<Ruler size={14}/>} value={vitals.height} required onChange={val => setVitals({...vitals, height: val})} />
                  </div>

                  {/* SECTION 2: LIFESTYLE & HABITS (Mandatory Buttons) */}
                  <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Wind size={14}/> Smoking History *
                        </label>
                        <div className="flex gap-2">
                            {['never', 'former', 'active'].map(s => (
                                <button key={s} type="button" onClick={() => setVitals({...vitals, smokingStatus: s})}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${vitals.smokingStatus === s ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-400 border-slate-200'}`}
                                >{s}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Wine size={14}/> Alcohol Usage *
                        </label>
                        <div className="flex gap-2">
                            {['none', 'social', 'heavy'].map(s => (
                                <button key={s} type="button" onClick={() => setVitals({...vitals, drinkingStatus: s})}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${vitals.drinkingStatus === s ? 'bg-medical-600 text-white border-medical-600' : 'bg-white text-slate-400 border-slate-200'}`}
                                >{s}</button>
                            ))}
                        </div>
                    </div>
                  </div>

                  {/* SECTION 3: FUNCTIONAL CAPACITY (Mandatory) */}
                  <div className="flex items-center justify-between p-5 bg-medical-50 border border-medical-100 rounded-2xl">
                    <div>
                        <p className="font-bold text-navy-900 text-sm">Functional Capacity Check *</p>
                        <p className="text-xs text-medical-700">Can the patient climb 2 flights of stairs without stopping?</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-xl border border-medical-200">
                        {['yes', 'no'].map(choice => (
                            <button key={choice} type="button" onClick={() => setVitals({...vitals, canClimbStairs: choice})}
                                className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${vitals.canClimbStairs === choice ? 'bg-medical-500 text-white' : 'text-slate-400'}`}
                            >{choice}</button>
                        ))}
                    </div>
                  </div>

                  {/* SECTION 4: DETAILED HISTORY (Optional but recommended) */}
                  <div className="space-y-4">
                    <textarea 
                      placeholder="Surgical History (Optional)"
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-medical-500 outline-none h-20 text-sm text-navy-900"
                      onChange={e => setVitals({...vitals, surgicalHistory: e.target.value})}
                    ></textarea>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <textarea 
                        placeholder="Known Medical Conditions (Optional)"
                        className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-medical-500 outline-none h-20 text-sm text-navy-900"
                        onChange={e => setVitals({...vitals, conditions: e.target.value})}
                      ></textarea>
                      <textarea 
                        placeholder="Current Medications (Optional)"
                        className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-medical-500 outline-none h-20 text-sm text-navy-900"
                        onChange={e => setVitals({...vitals, medications: e.target.value})}
                      ></textarea>
                    </div>
                  </div>

                  {/* FILE UPLOAD (Mandatory) */}
                  <div className="relative border-2 border-dashed border-medical-200 rounded-[24px] p-10 bg-medical-50/30 flex flex-col items-center justify-center text-center hover:bg-medical-50 transition-all cursor-pointer group">
                    <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files[0])} />
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-medical-600 mb-4 group-hover:scale-110 transition-transform"><FileText size={32}/></div>
                    <p className="font-bold text-navy-900">{file ? file.name : "Select Clinical Report (PDF) *"}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest text-navy-900">Secure clinical processing via Gemini AI</p>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-navy-900 text-white py-5 rounded-[20px] font-black text-lg hover:bg-navy-800 shadow-xl shadow-navy-900/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <span className="animate-pulse italic">Clinical Analysis in Progress...</span> : "Analyze Surgery Risk"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <FullAnalysisReport data={analysis} />
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                   <button onClick={() => setStep('input')} className="flex-1 bg-navy-900 text-white py-4 rounded-2xl font-bold hover:bg-navy-800 transition shadow-lg flex items-center justify-center gap-2">
                    <ChevronRight className="rotate-180"/> Start New Intake
                   </button>
                   <button onClick={() => window.print()} className="flex-1 bg-white border-2 border-navy-900 text-navy-900 py-4 rounded-2xl font-bold hover:bg-navy-50 transition">
                    Save Report as PDF
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-6 sticky top-10">
            <h4 className="font-black text-navy-900 flex items-center gap-2 mb-6 uppercase text-xs tracking-widest">
              <History size={16} className="text-medical-500" /> Patient History
            </h4>
            <div className="space-y-3">
              {history.length > 0 ? history.slice(0, 8).map((item, i) => (
                <div key={i} onClick={() => { setAnalysis(item); setStep('result'); }}
                  className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center hover:bg-medical-50 hover:border-medical-200 border border-transparent transition cursor-pointer"
                >
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(item.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm font-bold text-navy-900">Risk: {item.aiResponse?.surgery_risk?.level || 'N/A'}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              )) : <p className="text-sm text-slate-400">No records found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, type = "text", value, onChange, required = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-1">
        {icon} {label}
    </label>
    <input 
      type={type} 
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-medical-500 transition-all text-navy-900"
    />
  </div>
);

export default Dashboard;