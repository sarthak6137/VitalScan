import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, ShieldCheck, FileText, ArrowRight, 
  Stethoscope, Heart, Wind, Droplets, Brain, Zap, Syringe, Eye,
  UploadCloud, Cpu, ClipboardCheck, AlertTriangle, User
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const organData = [
  { title: "Cardiac Health", desc: "Maintain BP and cholesterol for a healthy heart.", advice: "Limit sodium and saturated fats.", icon: <Heart className="text-red-500" />, label: "HEART", imageUrl: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774814135/Gemini_Generated_Image_q8ycw5q8ycw5q8yc_xogeni.png" },
  { title: "Lung Health", desc: "Optimized oxygen saturation markers (SpO2).", advice: "Avoid pollutants and practice deep breathing.", icon: <Wind className="text-blue-500" />, label: "LUNGS", imageUrl: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774814165/Gemini_Generated_Image_cm7b4ccm7b4ccm7b_epcryn.png" },
  { title: "Blood Health", desc: "Analysis of hemoglobin and clotting factors.", advice: "Monitor iron and vitamin B12 levels.", icon: <Droplets className="text-purple-500" />, label: "BLOOD", imageUrl: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774814137/qimono-cells-1813410_v7ljia.jpg" },
  { title: "Neurological", desc: "Assessment of cognitive and nerve responses.", advice: "Prioritize sleep and mental stimulation.", icon: <Brain className="text-indigo-500" />, label: "BRAIN", imageUrl: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774814157/Gemini_Generated_Image_put9wkput9wkput9_w9qok1.png" },
  { title: "Metabolic Rate", desc: "Glucose levels and insulin sensitivity.", advice: "Keep a consistent exercise routine.", icon: <Zap className="text-amber-500" />, label: "METABOLIC", imageUrl: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774814454/Gemini_Generated_Image_6v04jz6v04jz6v04_ffu0kn.png" },
  { title: "Immune System", desc: "White blood cell count and infection risk.", advice: "Stay updated on vaccinations.", icon: <ShieldCheck className="text-teal-500" />, label: "IMMUNE", imageUrl: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774814168/Gemini_Generated_Image_xagodexagodexago_owgjum.png" },
  { title: "Renal Function", desc: "Monitoring kidney filtration and hydration.", advice: "Drink adequate water daily.", icon: <Syringe className="text-green-500" />, label: "KIDNEYS", imageUrl: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774814158/Gemini_Generated_Image_ndxswcndxswcndxs_tjpqbh.png" },
  { title: "Ocular Health", desc: "Blood vessel integrity and vision clarity.", advice: "Regular screenings for pressure.", icon: <Eye className="text-cyan-500" />, label: "EYES", imageUrl: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774814154/Gemini_Generated_Image_8ud368ud368ud368_dy29p0.png" },
];

const workSteps = [
  { 
    id: "01", 
    title: "Upload PDF", 
    desc: "Securely upload your latest medical reports or blood tests.", 
    icon: <UploadCloud size={20} />,
    img: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774819607/Screenshot_2026-03-30_024952_qgluab.jpg" 
  },
  { 
    id: "02", 
    title: "AI Processing", 
    desc: "Our Gemini-tuned AI extracts and cross-references vitals.", 
    icon: <Cpu size={20} />,
    img: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774820168/Screenshot_2026-03-30_030536_xcwevt.png" 
  },
  { 
    id: "03", 
    title: "Risk Report", 
    desc: "Receive a detailed surgery risk percentage and doctor advice.", 
    icon: <ClipboardCheck size={20} />,
    img: "https://res.cloudinary.com/dcqzfywlp/image/upload/v1774819621/Screenshot_2026-03-30_025429_wnhpgq.png" 
  }
];

const LandingPage = () => {
  const loopData = [...organData, ...organData];
  const [activeStep, setActiveStep] = useState(0);

  // --- 🔥 AUTH CHECK LOGIC ---
  const token = localStorage.getItem('token');
  const ctaLink = token ? "/dashboard" : "/register";
  const ctaText = token ? "Go to Dashboard" : "Get Started Free";

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workSteps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white text-navy-900 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section id="home-section" className="relative min-h-screen flex items-center pt-20 bg-linear-to-b from-medical-50 to-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="bg-medical-100 text-medical-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              AI-Powered Healthcare
            </span>
            <h1 className="text-5xl md:text-6xl font-black mt-6 leading-tight">
              Predict Surgery Risk <br />
              <span className="text-medical-500">With Precision AI</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg leading-relaxed">
              Upload your medical reports and let VitalScan AI provide a deep clinical analysis of your surgical safety markers in seconds.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {/* --- 🔥 Updated Dynamic Link --- */}
              <Link to={ctaLink} className="bg-navy-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-navy-800 flex items-center gap-2 group transition-all active:scale-95">
                {ctaText} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => {
                  document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-navy-900 px-8 py-4 rounded-xl font-bold hover:bg-navy-50 transition active:scale-95">
                Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative hidden lg:block h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img src="https://res.cloudinary.com/dcqzfywlp/image/upload/v1774815021/Gemini_Generated_Image_lj8ltalj8ltalj8l_yi9bmv.png" alt="Medical AI Dashboard" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy-900/10 mix-blend-multiply"></div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-medical-500/10 rounded-full animate-pulse z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* 2. INFINITE LOOP ORGAN CARDS */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Comprehensive Vital Analysis</h2>
          <p className="text-gray-500 mt-2">Continuous AI monitoring across 8 critical organ systems</p>
        </div>

        <div className="relative flex whitespace-nowrap">
          <motion.div className="flex gap-8 px-4" animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 50, repeat: Infinity }} whileHover={{ transition: { duration: 0 } }}>
            {loopData.map((card, i) => (
              <div key={i} className="w-[320px] p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-2xl hover:border-medical-100 transition-all duration-300 whitespace-normal group">
                <div className="w-full h-40 overflow-hidden rounded-2xl mb-6 shadow-inner border border-slate-100 relative">
                  <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-navy-900/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">{card.icon}</div>
                  <h3 className="font-bold text-lg text-navy-900 leading-tight">{card.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 h-12 flex items-center">{card.desc}</p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-medical-600 uppercase tracking-widest mb-1.5">Doctor Advice</p>
                  <p className="text-xs font-medium text-navy-800 italic bg-slate-50 px-3 py-2 rounded-lg">{card.advice}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (CRISP SEQUENTIAL UI) */}
      <section id="how-it-works-section" className="py-24 bg-navy-900 text-white overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 uppercase tracking-tighter">How it <span className="text-medical-500">Works</span></h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-4">
              {workSteps.map((item, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`flex gap-6 p-6 rounded-3xl transition-all duration-500 cursor-pointer border ${
                    activeStep === idx 
                      ? "bg-white/10 border-white/20 shadow-2xl scale-[1.02]" 
                      : "bg-transparent border-transparent opacity-40 hover:opacity-70"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${activeStep === idx ? "bg-medical-500 text-white" : "bg-white/10 text-white/50"}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      {item.title} 
                      {activeStep === idx && <motion.div layoutId="activeDot" className="w-2 h-2 bg-medical-400 rounded-full" />}
                    </h4>
                    <p className="text-gray-400 mt-1 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-white/10 p-2 rounded-[40px] border border-white/20 shadow-3xl relative overflow-hidden h-[480px]">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeStep}
                    src={workSteps[activeStep].img}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 0.95, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover rounded-[34px] shadow-2xl"
                  />
                </AnimatePresence>

                <motion.div 
                  animate={{ y: [0, 440, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-4 left-4 right-4 h-0.5 bg-medical-400 shadow-[0_0_20px_#4299e1] z-20 opacity-60"
                />

                <div className="absolute top-8 right-8 bg-navy-900/90 px-4 py-2 rounded-full border border-white/20 z-30 shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest text-medical-400">
                    Step {workSteps[activeStep].id} Active
                  </p>
                </div>
              </div>
              <div className="absolute -inset-10 bg-medical-500/10 blur-[80px] -z-10 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT & VISION SECTION */}
      <section id="about-section" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-4xl font-black text-navy-900 uppercase tracking-tighter mb-6">
                Our Motive: <span className="text-medical-500">Bridging the Gap</span> <br />
                Between Data and Decisions
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                VitalScan AI was born from a simple yet critical observation: medical reports are often dense and fragmented. Our mission is to provide instant clinical reasoning that ensures every surgery is a safe surgery.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-medical-50 rounded-full flex items-center justify-center text-medical-600">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="font-bold text-navy-900">Clinically Validated</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-medical-50 rounded-full flex items-center justify-center text-medical-600">
                    <Brain size={24} />
                  </div>
                  <span className="font-bold text-navy-900">Gemini-Powered</span>
                </div>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Rapid Screening", desc: "Reduce pre-surgery clearance from weeks to seconds.", icon: <Zap className="text-amber-500" /> },
                { title: "Error Mitigation", desc: "Identify critical contraindications overlooked by humans.", icon: <AlertTriangle className="text-red-500" /> },
                { title: "Patient Literacy", desc: "Translates jargon into clear, patient-friendly summaries.", icon: <User className="text-blue-500" /> },
                { title: "Resource Efficiency", desc: "Help hospitals prioritize high-risk surgical cases.", icon: <Activity className="text-emerald-500" /> }
              ].map((adv, idx) => (
                <motion.div key={idx} whileHover={{ y: -5 }} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="mb-4">{adv.icon}</div>
                  <h4 className="font-bold text-navy-900 mb-2">{adv.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{adv.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION (CTA) */}
      <section className="py-20 bg-gradient-to-r from-navy-900 to-navy-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">Ready to secure your surgical journey?</h2>
          <p className="text-navy-100 mb-10 text-lg opacity-80 italic">
            Join thousands of users using VitalScan AI to bring precision to their healthcare decisions.
          </p>
          {/* --- 🔥 Updated Dynamic Bottom Link --- */}
          <Link to={ctaLink} className="bg-medical-500 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-medical-500/20 hover:bg-medical-400 transition-all inline-flex items-center gap-3 active:scale-95">
            {ctaText} <ArrowRight />
          </Link>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer id="footer-section" className="py-12 border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-bold text-navy-900 uppercase tracking-tighter">VitalScan AI</p>
          <p className="text-xs text-gray-500 mt-4 max-w-md mx-auto">
            Disclaimer: This is an AI-based guidance system, not a medical diagnosis. Always consult with a certified surgeon.
          </p>
          <div className="mt-8 flex justify-center gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-navy-900 transition-colors uppercase">Home</button>
            <button onClick={() => { document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-navy-900 transition-colors uppercase">About</button>
            <button onClick={() => { document.getElementById('footer-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-navy-900 transition-colors uppercase">Contact Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;