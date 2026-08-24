import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { KeyRound, X, CheckCircle2, QrCode } from 'lucide-react';
import { GatePass } from '../types';

export const GatePassModal: React.FC = () => {
  const { isGatePassModalOpen, setIsGatePassModalOpen, activeTenant, createGatePass } = useTenant();

  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [generatedPass, setGeneratedPass] = useState<GatePass | null>(null);

  if (!isGatePassModalOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName) return;
    const pass = createGatePass(visitorName, visitorPhone, activeTenant.unitNumber);
    setGeneratedPass(pass);
  };

  const handleClose = () => {
    setIsGatePassModalOpen(false);
    setGeneratedPass(null);
    setVisitorName('');
    setVisitorPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        {!generatedPass ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Visitor Gate Pass</h3>
                <p className="text-xs text-slate-500">Generate a digital entry passcode for security guards</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dennis Mwangi (Uber Delivery)"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Visitor Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="0711 223 344"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20"
              >
                Generate Digital Entry Passcode
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-emerald-600">Access Granted</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {generatedPass.visitorName}
              </h3>
              <p className="text-xs text-slate-500">Destination: {generatedPass.unitNumber}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs text-slate-500 uppercase tracking-widest block font-bold">Passcode for Main Gate</span>
              <span className="text-4xl font-mono font-extrabold text-brand-600 dark:text-brand-400 tracking-wider block">
                {generatedPass.passCode}
              </span>
              <p className="text-[11px] text-slate-500">Valid for today ({generatedPass.validDate})</p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
