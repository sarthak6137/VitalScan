import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- HELPER: Smooth Scroll Logic ---
  const scrollToSection = (id) => {
    setIsOpen(false); // Close mobile menu if open
    
    if (location.pathname !== '/') {
      // If user is on Dashboard/Login, navigate home first then scroll
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // If already on home, just scroll
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAuthPage = ['/login', '/register', '/dashboard'].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled || isOpen ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LEFT: LOGO */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="bg-navy-900 p-2 rounded-lg text-white group-hover:bg-medical-600 transition-colors">
            <Activity size={24} />
          </div>
          <span className="text-xl font-black text-navy-900 tracking-tighter uppercase">VITALSCAN AI</span>
        </Link>

        {/* CENTER: DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-500 uppercase tracking-widest">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-navy-900 transition">Home</button>
          <button onClick={() => scrollToSection('how-it-works-section')} className="hover:text-navy-900 transition">Process</button>
          <button onClick={() => scrollToSection('about-section')} className="hover:text-navy-900 transition">About</button>
          <button onClick={() => scrollToSection('footer-section')} className="hover:text-navy-900 transition">Contact</button>
        </div>

        {/* RIGHT: AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <Link to="/dashboard" className="bg-navy-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-navy-800 transition shadow-lg shadow-navy-900/10 active:scale-95">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-navy-900 font-bold text-sm hover:text-medical-600 transition">Login</Link>
              <Link to="/register" className="bg-medical-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-medical-600 transition shadow-lg shadow-medical-500/10 active:scale-95">
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-navy-900 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6 font-bold text-navy-900 uppercase tracking-widest text-sm">
              <button onClick={() => { setIsOpen(false); window.scrollTo({top: 0, behavior: 'smooth'}) }} className="text-left">Home</button>
              <button onClick={() => scrollToSection('about-section')} className="text-left">About</button>
              <button onClick={() => scrollToSection('how-it-works-section')} className="text-left">Process</button>
              <button onClick={() => scrollToSection('footer-section')} className="text-left text-medical-600">Contact</button>
              
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                {token ? (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="bg-navy-900 text-white p-4 rounded-xl text-center">Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-center p-4 border border-navy-900 rounded-xl">Login</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="bg-medical-500 text-white p-4 rounded-xl text-center">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;