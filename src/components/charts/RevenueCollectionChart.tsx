import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Droplets,
  Zap,
  Briefcase,
  PieChart,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export const RevenueCollectionChart: React.FC = () => {
  const { formatCurrency, units, allTenants } = useTenant();
  const [activeMetric, setActiveMetric] = useState<'all' | 'rent' | 'utilities'>('all');

  const monthsData = [
    { month: 'Mar', rent: 1120000, water: 64000, power: 52000, target: 1250000 },
    { month: 'Apr', rent: 1180000, water: 68000, power: 56000, target: 1300000 },
    { month: 'May', rent: 1220000, water: 72000, power: 61000, target: 1350000 },
    { month: 'Jun', rent: 1290000, water: 76000, power: 65000, target: 1400000 },
    { month: 'Jul', rent: 1340000, water: 81000, power: 69000, target: 1450000 },
    { month: 'Aug', rent: 1410000, water: 86400, power: 72600, target: 1500000 }
  ];

  const currentMonth = monthsData[monthsData.length - 1];
  const currentTotal = currentMonth.rent + currentMonth.water + currentMonth.power;
  const targetAchieved = Math.round((currentTotal / currentMonth.target) * 100);

  const maxVal = 1600000;

  return (
    <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white">
              Revenue Streams & Utility Collections Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            6-Month consolidated cash collections for Rent, Metered Water, Power Sub-meters & CAM Charges
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 dark:bg-dark-800 p-1 rounded-2xl text-xs font-bold">
          {[
            { id: 'all', label: 'Consolidated Revenue' },
            { id: 'rent', label: 'Lease Rent' },
            { id: 'utilities', label: 'Water + Electricity' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeMetric === tab.id
                  ? 'bg-white dark:bg-dark-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graphical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider block">August Gross Receipts</span>
          <span className="text-2xl font-display font-extrabold text-emerald-600 block mt-1">
            {formatCurrency(currentTotal)}
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.8% vs last quarter</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30">
          <span className="text-[11px] text-cyan-700 dark:text-cyan-300 font-bold uppercase tracking-wider block">Utility Collections</span>
          <span className="text-2xl font-display font-extrabold text-cyan-600 block mt-1">
            {formatCurrency(currentMonth.water + currentMonth.power)}
          </span>
          <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium mt-1 block">
            Water ({formatCurrency(currentMonth.water)}) + Power ({formatCurrency(currentMonth.power)})
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
          <span className="text-[11px] text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider block">Target Achievement</span>
          <span className="text-2xl font-display font-extrabold text-blue-600 block mt-1">
            {targetAchieved}%
          </span>
          <span className="text-[11px] text-blue-700 dark:text-blue-400 font-medium mt-1 block">
            Target: {formatCurrency(currentMonth.target)}
          </span>
        </div>
      </div>

      {/* SVG Interactive Multi-Bar Chart */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="h-52 w-full flex items-end justify-between gap-4 pt-6 px-4">
          {monthsData.map((m, idx) => {
            const rentH = (m.rent / maxVal) * 100;
            const waterH = (m.water / 120000) * 100;
            const powerH = (m.power / 120000) * 100;
            const totalH = ((m.rent + m.water + m.power) / maxVal) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-40">
                  {activeMetric === 'all' ? (
                    /* Stacked Bar */
                    <div className="w-9 sm:w-12 bg-slate-200 dark:bg-dark-800 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all duration-500 group-hover:opacity-90 shadow-sm" style={{ height: `${totalH}%` }}>
                      <div className="bg-amber-500 w-full" style={{ height: `${(m.power / (m.rent + m.water + m.power)) * 100}%` }} title={`Power: ${formatCurrency(m.power)}`} />
                      <div className="bg-cyan-500 w-full" style={{ height: `${(m.water / (m.rent + m.water + m.power)) * 100}%` }} title={`Water: ${formatCurrency(m.water)}`} />
                      <div className="bg-emerald-600 w-full" style={{ height: `${(m.rent / (m.rent + m.water + m.power)) * 100}%` }} title={`Rent: ${formatCurrency(m.rent)}`} />
                    </div>
                  ) : activeMetric === 'rent' ? (
                    <div
                      style={{ height: `${rentH}%` }}
                      className="w-9 sm:w-12 bg-emerald-600 rounded-t-xl transition-all duration-500 group-hover:bg-emerald-500 shadow-sm"
                      title={`Rent: ${formatCurrency(m.rent)}`}
                    />
                  ) : (
                    <div className="flex items-end gap-1 w-full justify-center">
                      <div
                        style={{ height: `${waterH}%` }}
                        className="w-4 sm:w-5 bg-cyan-500 rounded-t-md transition-all duration-500"
                        title={`Water: ${formatCurrency(m.water)}`}
                      />
                      <div
                        style={{ height: `${powerH}%` }}
                        className="w-4 sm:w-5 bg-amber-500 rounded-t-md transition-all duration-500"
                        title={`Electricity: ${formatCurrency(m.power)}`}
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-500">{m.month} 2026</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-3 border-t border-slate-200 dark:border-slate-750 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Lease Rent Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-cyan-500" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Water Utility (Metered m³)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-500" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Electricity Power (Sub-meters kWh)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
