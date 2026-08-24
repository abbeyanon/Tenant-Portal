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
  DollarSign
} from 'lucide-react';

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
                  Visitor Pass
                </span>
                <span className="text-[11px] text-slate-500">24-hour gate code</span>
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
                <span className="text-[11px] text-slate-500">Bylaws & signed contract</span>
              </div>
            </Link>
          </div>

          {/* Active Maintenance Tickets for Resident */}
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">My Maintenance Requests</h3>
              </div>
              <button
                onClick={() => setIsMaintenanceModalOpen(true)}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                + New Request
              </button>
            </div>

            {tenantTickets.length > 0 ? (
              <div className="space-y-3">
                {tenantTickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <span>{t.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({t.ticketNumber})</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{t.description}</p>
                      {t.assignedTechnician && (
                        <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                          🔧 Assigned to: {t.assignedTechnician} ({t.technicianPhone})
                        </span>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase self-start sm:self-center bg-amber-50 text-amber-600 border border-amber-200">
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No open repair requests.</p>
            )}
          </div>

          {/* Building Notices */}
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Estate Notices & Announcements</h3>
            <div className="space-y-2">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-900 dark:text-white">{ann.title}</span>
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. LANDLORD / PROPERTY MANAGER EXECUTIVE DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Multi-Property Executive Portal</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Portfolio Overview & Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Real-time multi-property occupancy metrics, rent collection ledger, tenant directory, and ERPNext accounts reconciliation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs shadow-sm flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>+ Add Property</span>
            </button>

            <button
              onClick={() => setIsAddUnitModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>+ Add Unit</span>
            </button>

            <button
              onClick={() => setIsAddTenantModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Onboard Tenant</span>
            </button>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Portfolio Properties</span>
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white block">
              {properties.length} Estates
            </span>
            <span className="text-xs text-slate-400">{units.length} total units configured</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Occupancy Rate</span>
            <span className="text-3xl font-display font-extrabold text-emerald-600 block">
              {allTenants.length} / {units.length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">{units.filter(u => u.status === 'vacant').length} vacant units available</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Rent Collected</span>
            <span className="text-3xl font-display font-extrabold text-brand-600 dark:text-brand-400 block">
              {formatCurrency(payments.reduce((acc, p) => acc + p.amount, 0))}
            </span>
            <span className="text-xs text-slate-400">Reconciled via M-Pesa</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Maintenance Queue</span>
            <span className="text-3xl font-display font-extrabold text-amber-500 block">
              {maintenanceTickets.filter(t => t.status !== 'resolved').length} Active
            </span>
            <span className="text-xs text-slate-400">Technicians assigned</span>
          </div>
        </div>

        {/* Multi-Property Portfolio Showcase */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Properties in Your Portfolio
            </h2>
            <Link to="/properties" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
              <span>View All Estates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((p) => {
              const pUnits = units.filter((u) => u.propertyId === p.id || u.propertyName === p.name);
              return (
                <div key={p.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                      {p.propertyType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{p.location} • Caretaker: {p.caretakerPhone}</p>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{pUnits.length} Units</span>
                    <Link to="/units" className="text-blue-600 font-bold hover:underline">
                      Manage Units &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
