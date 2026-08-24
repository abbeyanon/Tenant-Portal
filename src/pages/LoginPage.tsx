import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import {
  Home,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Building2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useTenant();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
    navigate('/');
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('••••••••');
    setIsSubmitting(true);
    await login(demoEmail, 'password123');
    setIsSubmitting(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Brand Logo */}
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-brand-500/20 transition transform group-hover:scale-105">
            <div className="w-full h-full bg-white dark:bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Home className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
          <span className="font-display font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white">
            Tenant<span className="text-brand-600 dark:text-brand-400">Hub</span>
          </span>
        </Link>

        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sign In to Your Portal
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Connected to Frappe Framework & ERPNext Accounts Authentication
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your registered email via ERPNext."); }} className="text-brand-600 dark:text-brand-400 hover:underline text-[11px]">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded" />
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating with ERPNext...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              1-Click Demo Personas
            </span>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('john.kamau@example.com')}
                className="w-full p-3 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-left flex items-center justify-between hover:bg-brand-100 transition"
              >
                <div>
                  <span className="font-bold text-brand-900 dark:text-brand-200 block">Resident Tenant (Unit 4B)</span>
                  <span className="text-[10px] text-slate-500">john.kamau@example.com</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-brand-600 text-white text-[10px] font-bold">
                  Quick Login &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@emeraldheights.co.ke')}
                className="w-full p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-left flex items-center justify-between hover:bg-purple-100 transition"
              >
                <div>
                  <span className="font-bold text-purple-900 dark:text-purple-200 block">Estate Manager & ERPNext Accountant</span>
                  <span className="text-[10px] text-slate-500">admin@emeraldheights.co.ke</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold">
                  Quick Login &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
