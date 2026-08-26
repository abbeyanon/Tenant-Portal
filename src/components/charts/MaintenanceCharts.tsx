import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PieChart,
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  Droplets,
  ShieldAlert,
  Building2,
  Check,
  Calendar
} from 'lucide-react';
import { MaintenanceTicket } from '../../types';

interface MaintenanceChartsProps {
  tickets: MaintenanceTicket[];
  propertyName?: string;
  isTenantView?: boolean;
}

export const MaintenanceCharts: React.FC<MaintenanceChartsProps> = ({
  tickets,
  propertyName,
  isTenantView = false
}) => {
  const [chartTimeframe, setChartTimeframe] = useState<'month' | 'quarter' | 'year'>('month');

  // Category counts
  const categoryMap: Record<string, { count: number; color: string; bg: string; icon: string }> = {
    plumbing: { count: 0, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500', icon: '🚰' },
    electrical: { count: 0, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500', icon: '⚡' },
    carpentry: { count: 0, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500', icon: '🪚' },
    hvac: { count: 0, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500', icon: '❄️' },
    appliance: { count: 0, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500', icon: '🔌' },
    security: { count: 0, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500', icon: '🛡️' },
    painting: { count: 0, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500', icon: '🎨' }
  };

  // Status counts
  let reported = 0;
  let assigned = 0;
  let inProgress = 0;
  let resolved = 0;

  // Priority counts
  let emergency = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  // Property distribution
  const propertyCounts: Record<string, number> = {};

  tickets.forEach((t) => {
    // Category
    const cat = (t.category || 'plumbing').toLowerCase();
    if (categoryMap[cat]) {
      categoryMap[cat].count += 1;
    } else {
      categoryMap['plumbing'].count += 1;
    }

    // Status
    if (t.status === 'reported') reported++;
    else if (t.status === 'assigned') assigned++;
    else if (t.status === 'in_progress') inProgress++;
    else if (t.status === 'resolved') resolved++;

    // Priority
    if (t.priority === 'emergency') emergency++;
    else if (t.priority === 'high') high++;
    else if (t.priority === 'medium') medium++;
    else if (t.priority === 'low') low++;

    // Property
    const pName = t.propertyName || 'Emerald Heights Luxury Residences';
    propertyCounts[pName] = (propertyCounts[pName] || 0) + 1;
  });

  const totalTickets = Math.max(tickets.length, 1);
  const activeCount = reported + assigned + inProgress;
  const resolutionRate = Math.round((resolved / totalTickets) * 100);

  // Velocity Mock Days (MTTR)
  const avgResolutionHours = 14.5;
  const slaCompliance = 96.8;

  const categoriesSorted = Object.entries(categoryMap)
    .map(([key, data]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      count: data.count,
      percent: Math.round((data.count / totalTickets) * 100),
      color: data.color,
      bg: data.bg,
      icon: data.icon
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Top Banner Stats with Visual Progress Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Issues Logged */}
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tickets</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {tickets.length}
            </span>
            <span className="text-xs text-slate-500">Logged Requests</span>
          </div>
          {/* Visual Mini Trend Bar */}
          <div className="mt-3 w-full bg-slate-100 dark:bg-dark-800 h-2 rounded-full overflow-hidden flex">
            <div className="bg-amber-500 h-full" style={{ width: `${(reported / totalTickets) * 100}%` }} title="Reported" />
            <div className="bg-blue-500 h-full" style={{ width: `${(assigned / totalTickets) * 100}%` }} title="Assigned" />
            <div className="bg-purple-500 h-full" style={{ width: `${(inProgress / totalTickets) * 100}%` }} title="In Progress" />
            <div className="bg-emerald-500 h-full" style={{ width: `${(resolved / totalTickets) * 100}%` }} title="Resolved" />
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block">
            {activeCount} Active / In-Flight • {resolved} Closed
          </span>
        </div>

        {/* Resolution Rate Circular Gauge */}
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Resolution Rate</span>
            <span className="text-3xl font-display font-extrabold text-emerald-600 mt-2 block">
              {resolutionRate}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              SLA Standard: <strong className="text-slate-800 dark:text-slate-200">{slaCompliance}%</strong>
            </span>
          </div>
          {/* Radial SVG Circular Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-dark-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${resolutionRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-emerald-600">{resolutionRate}%</span>
          </div>
        </div>

        {/* Mean Time To Resolution (MTTR) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Resolution Time</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {avgResolutionHours} hrs
            </span>
            <span className="text-xs text-emerald-600 font-bold">▼ 22% faster</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Emergency avg: <strong className="text-slate-800 dark:text-slate-200">2.1 hrs</strong></span>
          </div>
        </div>

        {/* Priority Urgency Gauge */}
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority Breakdown</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 font-bold text-xs">
              🚨 {emergency} Critical
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 font-bold text-xs">
              ⚠️ {high} High
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 font-bold text-xs">
              {medium + low} Normal
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-3">All critical emergencies are prioritized in under 2 hours.</p>
        </div>
      </div>

      {/* 2-Column Main Graphical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Maintenance Status Lifecycle Funnel (7 Columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Issue Resolution Pipeline & Status Funnel
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live lifecycle tracking from intake to technician dispatch and final sign-off
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-dark-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 self-start sm:self-auto">
              Real-time Audit
            </span>
          </div>

          {/* Visual Step-by-Step Flow Chart */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Step 1: Reported */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 relative overflow-hidden">
              <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 font-bold text-xs">
                <span>1. Reported</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              </div>
              <span className="text-2xl font-extrabold text-amber-900 dark:text-amber-200 font-display block mt-2">
                {reported}
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Awaiting Dispatch</span>
              {/* Progress Level Bar */}
              <div className="w-full bg-amber-200 dark:bg-amber-900/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${(reported / totalTickets) * 100}%` }} />
              </div>
            </div>

            {/* Step 2: Assigned */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 relative overflow-hidden">
              <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 font-bold text-xs">
                <span>2. Assigned</span>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <span className="text-2xl font-extrabold text-blue-900 dark:text-blue-200 font-display block mt-2">
                {assigned}
              </span>
              <span className="text-[10px] text-blue-700 dark:text-blue-400 font-medium">Tech Dispatched</span>
              <div className="w-full bg-blue-200 dark:bg-blue-900/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${(assigned / totalTickets) * 100}%` }} />
              </div>
            </div>

            {/* Step 3: In Progress */}
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 relative overflow-hidden">
              <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 font-bold text-xs">
                <span>3. In Progress</span>
                <span className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
              <span className="text-2xl font-extrabold text-purple-900 dark:text-purple-200 font-display block mt-2">
                {inProgress}
              </span>
              <span className="text-[10px] text-purple-700 dark:text-purple-400 font-medium">On-Site Repairs</span>
              <div className="w-full bg-purple-200 dark:bg-purple-900/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: `${(inProgress / totalTickets) * 100}%` }} />
              </div>
            </div>

            {/* Step 4: Resolved */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 relative overflow-hidden">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <span>4. Resolved</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200 font-display block mt-2">
                {resolved}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Signed & Cleared</span>
              <div className="w-full bg-emerald-200 dark:bg-emerald-900/50 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${(resolved / totalTickets) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Graphical Multi-Day Incident Velocity Chart (Interactive SVG) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Weekly Repair Velocity & Closure Trend</span>
              </span>
              <span className="text-[11px] text-slate-400">August 2026</span>
            </div>

            {/* SVG Interactive Multi-Bar Graph */}
            <div className="h-36 w-full flex items-end justify-between gap-3 pt-4 px-2">
              {[
                { day: 'Mon', reported: 4, resolved: 3 },
                { day: 'Tue', reported: 6, resolved: 5 },
                { day: 'Wed', reported: 3, resolved: 4 },
                { day: 'Thu', reported: 8, resolved: 7 },
                { day: 'Fri', reported: 5, resolved: 6 },
                { day: 'Sat', reported: 2, resolved: 3 },
                { day: 'Sun', reported: 1, resolved: 2 }
              ].map((bar, idx) => {
                const maxVal = 9;
                const repHeight = (bar.reported / maxVal) * 100;
                const resHeight = (bar.resolved / maxVal) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-24">
                      {/* Reported bar */}
                      <div
                        style={{ height: `${repHeight}%` }}
                        className="w-3 bg-amber-400 dark:bg-amber-500/80 rounded-t-md transition-all duration-500 group-hover:bg-amber-300"
                        title={`${bar.reported} Reported on ${bar.day}`}
                      />
                      {/* Resolved bar */}
                      <div
                        style={{ height: `${resHeight}%` }}
                        className="w-3 bg-emerald-500 rounded-t-md transition-all duration-500 group-hover:bg-emerald-400"
                        title={`${bar.resolved} Resolved on ${bar.day}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{bar.day}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-200 dark:border-slate-750 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400 dark:bg-amber-500" />
                <span className="text-slate-600 dark:text-slate-400">Issues Reported</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">Issues Resolved</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Category Distribution & Property Heatmap (5 Columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Issue Breakdown by Category
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{categoriesSorted.length} Categories</span>
            </div>

            {/* Horizontal Graphical Bars for Categories */}
            <div className="mt-4 space-y-3.5">
              {categoriesSorted.slice(0, 5).map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-slate-500 font-mono">
                      {cat.count} tickets ({cat.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-dark-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${cat.bg} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(cat.percent, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property-wise Distribution Pills */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Asset / Property Heatmap
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(propertyCounts).map(([name, count], idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]" title={name}>
                    {name.split(' ')[0]} {name.split(' ')[1] || ''}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                    {count} {count === 1 ? 'issue' : 'issues'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
