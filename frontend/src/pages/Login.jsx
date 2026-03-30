import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(`Welcome back, ${res.data.user.name}!`);
        window.location.href = '/dashboard'; // Hard reload to update App state
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-medical-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-medical-100"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-medical-100 p-4 rounded-2xl">
            <ShieldCheck className="text-medical-600 size-10" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-navy-900 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mt-2 mb-8">Access your clinical dashboard.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 size-5" />
            <input 
              type="email" placeholder="Email" required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-medical-500 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 size-5" />
            <input 
              type="password" placeholder="Password" required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-medical-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-medical-600 text-white py-4 rounded-xl font-bold hover:bg-medical-700 transition"
          >
            {loading ? "Authenticating..." : "Login to Portal"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;