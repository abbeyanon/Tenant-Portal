import React from 'react';
import { useTenant } from '../context/TenantContext';
import {
  KeyRound,
  PlusCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  QrCode
} from 'lucide-react';

export const GatePassPage: React.FC = () => {
  const { gatePasses, activeTenant, setIsGatePassModalOpen } = useTenant();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Access & Security</span>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Visitor Gate Pass Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Generate 24-hour temporary access passcodes for visitors, deliveries, and service contractors.
            </p>
          </div>

          <button
            onClick={() => setIsGatePassModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Gate Pass</span>
          </button>
        </div>

        {/* Gate Passes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gatePasses.map((pass) => (
            <div
              key={pass.id}
              className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase">
                  {pass.status}
                </span>
                <span className="text-xs text-slate-500">{pass.createdDate}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pass.visitorName}</h3>
                <p className="text-xs text-slate-500">Destination: {pass.unitNumber}</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Security Entry Code</span>
                <span className="text-3xl font-mono font-extrabold text-brand-600 dark:text-brand-400 tracking-wider block">
                  {pass.passCode}
                </span>
                <p className="text-[11px] text-slate-400">Valid for {pass.validDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
