import React from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import {
  Building2,
  Users,
  CreditCard,
  Wrench,
  KeyRound,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  PlusCircle,
  Smartphone,
  PhoneCall,
  UserPlus,
  Home,
  DollarSign,
  Droplets,
  Zap,
  Briefcase,
  PieChart,
  BarChart3
} from 'lucide-react';
import { RevenueCollectionChart } from '../components/charts/RevenueCollectionChart';
import { MaintenanceCharts } from '../components/charts/MaintenanceCharts';

export const DashboardPage: React.FC = () => {
  const {
    currentRole,
    activeTenant,
    properties,
    units,
    allTenants,
    payments,
    maintenanceTickets,
    announcements,
    stats,
    formatCurrency,
    setIsPayRentModalOpen,
    setIsMaintenanceModalOpen,
    setIsGatePassModalOpen,
    setIsAddPropertyModalOpen,
    setIsAddUnitModalOpen,
    setIsAddTenantModalOpen
  } = useTenant();

  // =========================================================================
  // 1. SIMPLE RESIDENT TENANT PORTAL
  // =========================================================================
  if (currentRole === 'tenant') {
    const tenantTickets = maintenanceTickets.filter((t) => t.unitNumber === activeTenant.unitNumber);
    const tenantPayments = payments.filter((p) => p.unitNumber === activeTenant.unitNumber);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-10 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4">
              {activeTenant.avatar ? (
                <img
                  src={activeTenant.avatar}
                  alt={activeTenant.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-display font-extrabold text-2xl flex items-center justify-center">
                  {activeTenant.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome Home, {activeTenant.name.split(' ')[0]}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  {activeTenant.propertyName} • <strong className="text-brand-600 dark:text-brand-400">{activeTenant.unitNumber}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                activeTenant.paymentStatus === 'paid'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200 dark:border-rose-800'
              }`}>
                {activeTenant.paymentStatus === 'paid' ? '✓ Rent Paid (August)' : 'Rent Due'}
              </span>
            </div>
          </div>

          {/* Primary Rent Balance Card with M-Pesa STK Button */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Monthly Rent & Lease Status
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
                    {formatCurrency(activeTenant.rentAmount)}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300">
                  Lease active until <strong className="text-white">{activeTenant.leaseEnd}</strong> • Caretaker: +254 759 508 348
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsPayRentModalOpen(true)}
                  className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <Smartphone className="w-5 h-5 animate-pulse" />
                  <span>Pay Rent via M-Pesa STK</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Tenant Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/payments"
              className="p-5 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-emerald-600">
                  Rent & Bills
                </span>
                <span className="text-[11px] text-slate-500">Statements & Receipts</span>
              </div>
            </Link>

            <button
              onClick={() => setIsMaintenanceModalOpen(true)}
              className="p-5 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 transition group flex flex-col justify-between space-y-3 text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-amber-600">
                  Report Issue
                </span>
                <span className="text-[11px] text-slate-500">Log repair request</span>
              </div>
            </button>

            <button
              onClick={() => setIsGatePassModalOpen(true)}
              className="p-5 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition group flex flex-col justify-between space-y-3 text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-blue-600">
                  Gate Pass
                </span>
                <span className="text-[11px] text-slate-500">Generate visitor code</span>
              </div>
            </button>

            <Link
              to="/documents"
              className="p-5 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500 transition group flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-purple-600">
                  My Lease
                </span>
                <span className="text-[11px] text-slate-500">Tenancy agreement</span>
              </div>
            </Link>
          </div>

          {/* Tenant Graphical Maintenance Lifecycle Tracker */}
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Maintenance & Repair Requests</h2>
              </div>
              <Link to="/maintenance" className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline">
                View All ({tenantTickets.length})
              </Link>
            </div>

            <MaintenanceCharts tickets={tenantTickets} isTenantView={true} />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. FULL EXECUTIVE & PROPERTY MANAGER DASHBOARD WITH CHARTS
  // =========================================================================
  const occupiedCount = units.filter((u) => u.status === 'occupied').length;
  const totalUnitsCount = Math.max(units.length, 1);
  const occupancyPercentage = Math.round((occupiedCount / totalUnitsCount) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-10 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Multi-Asset Portfolio & ERPNext Accounts Live</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Executive Property Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Comprehensive real-time analytics for commercial & residential leases, metered utility billing, arrears aging, and maintenance dispatch.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>+ Property</span>
            </button>

            <button
              onClick={() => setIsAddUnitModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>+ Unit / Space</span>
            </button>

            <button
              onClick={() => setIsAddTenantModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-600/20 transition transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Onboard Tenant</span>
            </button>
          </div>
        </div>

        {/* Executive Stats Cards with Circular Radial Ring */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Portfolio Occupancy</span>
              <span className="text-3xl font-display font-extrabold text-brand-600 dark:text-brand-400 mt-2 block">
                {occupancyPercentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {occupiedCount} of {units.length} Units Leased
              </span>
            </div>
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
                  className="text-brand-600 transition-all duration-1000 ease-out"
                  strokeDasharray={`${occupancyPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold font-mono text-brand-600">{occupancyPercentage}%</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">August Collections</span>
            <span className="text-3xl font-display font-extrabold text-emerald-600 block">
              {formatCurrency(1569000)}
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>98.2% collection velocity</span>
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Outstanding Arrears</span>
            <span className="text-3xl font-display font-extrabold text-rose-600 block">
              {formatCurrency(124000)}
            </span>
            <span className="text-xs text-slate-400">2 accounts past due (Net 5 days)</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Repair Orders</span>
            <span className="text-3xl font-display font-extrabold text-amber-500 block">
              {maintenanceTickets.filter((t) => t.status !== 'resolved').length}
            </span>
            <span className="text-xs text-slate-400">All assigned to technicians</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. REVENUE STREAMS & UTILITIES GRAPHICAL TRAJECTORY CHART */}
        {/* ========================================================================= */}
        <RevenueCollectionChart />

        {/* ========================================================================= */}
        {/* 2. MAINTENANCE & ISSUE RESOLUTION FUNNEL CHARTS */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Estate Maintenance & Issue Resolution Graphics
              </h2>
            </div>
            <Link to="/maintenance" className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1">
              <span>Open Work Order Dispatcher</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <MaintenanceCharts tickets={maintenanceTickets} />
        </div>
      </div>
    </div>
  );
};
