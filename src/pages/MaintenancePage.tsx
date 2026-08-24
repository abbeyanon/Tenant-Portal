import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  Wrench,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Search
} from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { maintenanceTickets, activeTenant, setIsMaintenanceModalOpen } = useTenant();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = maintenanceTickets.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Repairs & Facilities</span>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Maintenance Request Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Report unit plumbing, electrical, carpentry, or appliance issues for prompt technician dispatch.
            </p>
          </div>

          <button
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Maintenance Issue</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {['all', 'plumbing', 'electrical', 'carpentry', 'appliance', 'painting'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-brand-500 transition flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500">{t.ticketNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.status === 'resolved'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">{t.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{t.title}</h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.description}
                </p>

                {t.assignedTechnician && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Assigned Contractor:</span>
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span>{t.assignedTechnician}</span>
                      <a href={`tel:${t.technicianPhone}`} className="text-brand-600 flex items-center gap-1 font-bold">
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Reported: {t.reportedDate}</span>
                <span className="capitalize font-semibold text-amber-600">{t.priority} Priority</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
