import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                <Home className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                Tenant<span className="text-brand-400">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Emerald Heights Luxury Residences Management Platform. Simplifying rent payments, maintenance ticketing, security gate passes, and lease compliance.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider">Estate Contacts</h4>
            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-400" /> Ngong Road, Nairobi, Kenya</p>
            <p className="flex items-center gap-2"><PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> +254 759 508 348</p>
            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-400" /> management@emeraldheights.co.ke</p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider">Resident Quick Links</h4>
            <ul className="space-y-1.5">
              <li><Link to="/payments" className="hover:text-white transition">Online Rent Payment</Link></li>
              <li><Link to="/maintenance" className="hover:text-white transition">Report Maintenance Issue</Link></li>
              <li><Link to="/gate-pass" className="hover:text-white transition">Generate Visitor Gate Pass</Link></li>
              <li><Link to="/documents" className="hover:text-white transition">Tenancy Agreement & Bylaws</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} TenantHub Property Management Systems. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Tenancy Terms</span>
            <span>Estate Bylaws</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
