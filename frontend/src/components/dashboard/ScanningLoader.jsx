import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ShieldPulse, Search, Database, CheckCircle2, Loader2 } from 'lucide-react';

const ScanningLoader = () => {
  const steps = [
    { icon: <Search size={18}/>, text: "Extracting Clinical PDF Data..." },
    { icon: <Database size={18}/>, text: "Cross-referencing Vitals History..." },
    { icon: <Brain size={18}/>, text: "Consulting Gemini AI Medical Models..." },
    { icon: <ShieldPulse size={18}/>, text: "Finalizing Surgery Risk Score..." }
  ];

  return (
    <div className="fixed inset-0 bg-navy-950 z-[100] flex items-center justify-center p-6 overflow-hidden">
      
      {/* BACKGROUND TECH EFFECT: Floating Binary Bits */}
      <div className="absolute inset-0 opacity-[0.03] text-[10px] font-mono text-medical-400 pointer-events-none select-none overflow-hidden break-all leading-none p-4">
        {Array(20).fill("01101001 11001010 10101101 00101011 11110001 ").map((v, i) => <p key={i} className="mb-2">{v.repeat(10)}</p>)}
      </div>

      <div className="max-w-md w-full relative z-10">
        
        {/* TOP: Rotating Neural Hub */}
        <div className="relative flex justify-center mb-16">
          {/* Outer Pulsing Rings */}
          {[1, 1.3, 1.6].map((s, i) => (
            <motion.div 
              key={i}
              animate={{ scale: [1, s, 1], opacity: [0.1, 0, 0.1] }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
              className="absolute w-32 h-32 border border-medical-500 rounded-full"
            />
          ))}

          {/* Inner Rotating Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute w-36 h-36 border-t-2 border-b-2 border-medical-400/30 rounded-full"
          />

          <div className="relative bg-navy-900 w-24 h-24 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(66,153,225,0.3)]">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Brain className="text-medical-400" size={40} strokeWidth={1.5} />
            </motion.div>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
            VitalScan<span className="text-medical-500">AI</span>
          </h2>
          <div className="flex justify-center items-center gap-2 mt-2">
            <Loader2 className="animate-spin text-medical-500" size={14} />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              Deep Clinical Scan in Progress
            </p>
          </div>
        </div>

        {/* PROGRESS STEPS */}
        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.6 }}
              className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl relative overflow-hidden group hover:bg-white/[0.06] transition-colors"
            >
              {/* Progress fill animation inside the card */}
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: i * 0.8, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 h-[1px] bg-medical-500/30"
              />

              <div className="bg-navy-900 p-2 rounded-lg text-medical-400 border border-white/10 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>

              <p className="text-white/70 font-semibold text-xs tracking-tight">{step.text}</p>
              
              <div className="ml-auto">
                <StatusIndicator delay={i * 2} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* FOOTER TIP */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="text-center text-[10px] text-slate-500 mt-10 italic font-medium"
        >
          Analyzing vitals against ASA Class III standards...
        </motion.p>
      </div>
    </div >
  );
};

// Helper component for the checkmark animation
const StatusIndicator = ({ delay }) => {
  return (
    <div className="relative flex items-center justify-center w-5 h-5">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 1.5, type: "spring", stiffness: 200 }}
      >
        <CheckCircle2 size={16} className="text-green-500" />
      </motion.div>
      
      {/* Loading ring before checkmark appears */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: delay + 1.5 }}
        className="absolute inset-0"
      >
        <Loader2 size={16} className="text-medical-500 animate-spin" />
      </motion.div>
    </div>
  );
};

export default ScanningLoader;