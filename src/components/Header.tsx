import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useTheme } from '../context/ThemeContext';
import {
  Home,
  ShieldCheck,
  CreditCard,
  Wrench,
  KeyRound,
  Bell,
  Sun,
  Moon,
  Users,
  Building2,
  FileText,
  Menu,
  X,
  PlusCircle,
  PhoneCall,
  UserPlus
} from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const {
    currentRole,
    switchRole,
    activeTenant,
    announcements,
    setIsPayRentModalOpen,
    setIsMaintenanceModalOpen,
    setIsGatePassModalOpen,
    setIsAddTenantModalOpen
  } = useTenant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-dark-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* 1. Top Estate Bar & Role Switcher */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-[1550px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span>Caretaker & Security Hotline: <strong className="text-white">+254 759 508 348</strong></span>
            </div>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-300">Emerald Heights Residences (Ngong Road)</span>
          </div>

          <div className="flex items-center gap-3">
            {/* 1-Click Role Switcher */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>View Mode:</span>
              <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
                <button
                  onClick={() => switchRole('tenant')}
                  className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition ${
                    currentRole === 'tenant'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Resident Tenant (4B)
                </button>
                <button
                  onClick={() => switchRole('landlord')}
                  className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition ${
                    currentRole === 'landlord'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Property Manager / Landlord
                </button>
              </div>
            </div>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-brand-500/20 transition transform group-hover:scale-105">
              <div className="w-full h-full bg-white dark:bg-dark-950 rounded-[14px] flex items-center justify-center">
                <Home className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                Tenant<span className="text-brand-600 dark:text-brand-400">Hub</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase block">
                Resident & Property Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                isActive('/')
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-dark-850'
              }`}
            >
              Dashboard
            </Link>

            {/* Tenant List / Directory Link */}
            <Link
              to="/tenants"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive('/tenants')
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-dark-850'
              }`}
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Tenants Directory</span>
            </Link>

            <Link
              to="/payments"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                isActive('/payments')
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-dark-850'
              }`}
            >
              Rent & Billing
            </Link>

            <Link
              to="/maintenance"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                isActive('/maintenance')
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-dark-850'
              }`}
            >
              Maintenance
            </Link>

            <Link
              to="/gate-pass"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                isActive('/gate-pass')
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-dark-850'
              }`}
            >
              Visitor Pass
            </Link>

            <Link
              to="/documents"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                isActive('/documents')
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-dark-850'
              }`}
            >
              Lease & Docs
            </Link>

            <Link
              to="/settings"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                isActive('/settings')
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-dark-850'
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3">
            {/* Direct Add Tenant Button for Property Managers & Quick access */}
            <button
              onClick={() => setIsAddTenantModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Tenant</span>
            </button>

            {/* Quick Action CTA Button for Rent Payment */}
            <button
              onClick={() => setIsPayRentModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Rent (M-Pesa)</span>
            </button>

            {/* Notices Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-dark-850 hover:bg-slate-200 dark:hover:bg-dark-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition relative"
                aria-label="Announcements"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {announcements.length}
                </span>
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl z-50 text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-sm">Building Notices & Alerts</span>
                    <button onClick={() => setNotifDropdownOpen(false)} className="text-xs text-brand-600 hover:underline">
                      Close
                    </button>
                  </div>
                  <div className="py-2 max-h-72 overflow-y-auto space-y-2 text-xs">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-900 dark:text-white">{ann.title}</span>
                          <span className="text-[10px] text-slate-400">{ann.date}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Mini Card */}
            <Link
              to="/settings"
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
            >
              {activeTenant.avatar ? (
                <img src={activeTenant.avatar} alt={activeTenant.name} className="w-7 h-7 rounded-lg object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                  {activeTenant.name.charAt(0)}
                </div>
              )}
              <span className="hidden md:inline">{currentRole === 'tenant' ? 'Unit 4B' : 'Manager'}</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-dark-850 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-50 dark:bg-dark-850 text-slate-800 dark:text-slate-200">
              Dashboard
            </Link>
            <Link to="/tenants" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
              Tenants List
            </Link>
            <Link to="/payments" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-50 dark:bg-dark-850 text-slate-800 dark:text-slate-200">
              Rent & Billing
            </Link>
            <Link to="/maintenance" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-50 dark:bg-dark-850 text-slate-800 dark:text-slate-200">
              Maintenance
            </Link>
            <Link to="/gate-pass" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-50 dark:bg-dark-850 text-slate-800 dark:text-slate-200">
              Visitor Gate Pass
            </Link>
            <Link to="/documents" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-50 dark:bg-dark-850 text-slate-800 dark:text-slate-200">
              Lease & Documents
            </Link>
            <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-50 dark:bg-dark-850 text-slate-800 dark:text-slate-200">
              Settings & Profile
            </Link>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAddTenantModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Onboard New Tenant</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPayRentModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Rent via M-Pesa</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
