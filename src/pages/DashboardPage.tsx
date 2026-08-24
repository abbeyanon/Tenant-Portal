import React from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import {
  Home,
  CreditCard,
  Wrench,
  KeyRound,
  ShieldCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  FileText,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Printer
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    currentRole,
    activeTenant,
    allTenants,
    units,
    payments,
    maintenanceTickets,
    announcements,
    gatePasses,
    stats,
    formatCurrency,
    setIsPayRentModalOpen,
    setIsMaintenanceModalOpen,
    setIsGatePassModalOpen,
    setIsAddTenantModalOpen,
    sendPaymentReminder,
    updateTicketStatus
  } = useTenant();

  const myTickets = maintenanceTickets.filter((t) => t.unitNumber === activeTenant.unitNumber);
  const myPayments = payments.filter((p) => p.unitNumber === activeTenant.unitNumber);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-10 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6">
        {/* ========================================================================= */}
        {/* TENANT WORKSPACE VIEW */}
        {/* ========================================================================= */}
        {currentRole === 'tenant' ? (
          <div className="space-y-10">
            {/* Top Welcome & Unit Hero Card */}
            <div className="bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold">
                  <Home className="w-3.5 h-3.5" />
                  <span>{activeTenant.propertyName}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
                  Welcome Home, {activeTenant.name.split(' ')[0]} 👋
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Your lease for <strong>{activeTenant.unitNumber}</strong> is active until {activeTenant.leaseEnd}. You have zero pending maintenance emergencies.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsPayRentModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-white text-brand-600 hover:bg-blue-50 font-bold text-xs shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Rent (M-Pesa)</span>
                </button>

                <button
                  onClick={() => setIsMaintenanceModalOpen(true)}
                  className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs backdrop-blur-md transition flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Report Maintenance</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Monthly Rent</span>
                <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white block">
                  {formatCurrency(activeTenant.rentAmount)}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Paid for August 2026</span>
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Next Due Date</span>
                <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white block">
                  5th Sept 2026
                </span>
                <span className="text-xs text-slate-500">Auto-reminders enabled via SMS</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Tickets</span>
                <span className="text-2xl font-display font-extrabold text-blue-600 dark:text-blue-400 block">
                  {myTickets.filter((t) => t.status !== 'resolved').length} Ticket
                </span>
                <span className="text-xs text-slate-500">Lead plumber assigned</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Security Deposit</span>
                <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white block">
                  {formatCurrency(activeTenant.depositAmount)}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">Held securely in escrow</span>
              </div>
            </div>

            {/* Main Content 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: 8 Cols */}
              <div className="lg:col-span-8 space-y-8">
                {/* Active Maintenance Tickets */}
                <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                        My Maintenance Requests ({myTickets.length})
                      </h2>
                      <p className="text-xs text-slate-500">Track technician visits and repair status</p>
                    </div>
                    <button
                      onClick={() => setIsMaintenanceModalOpen(true)}
                      className="text-xs text-brand-600 font-bold hover:underline"
                    >
                      + Log New Issue
                    </button>
                  </div>

                  <div className="space-y-4">
                    {myTickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-500">{t.ticketNumber}</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-bold uppercase">
                              {t.category}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            t.status === 'resolved'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                              : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                          }`}>
                            {t.status.replace('_', ' ')}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{t.description}</p>

                        {t.assignedTechnician && (
                          <div className="p-3 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-brand-600" />
                              <span>Technician: <strong>{t.assignedTechnician}</strong></span>
                            </div>
                            <span className="font-mono text-slate-500">{t.technicianPhone}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Payments Ledger */}
                <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                        Recent Payment History
                      </h2>
                      <p className="text-xs text-slate-500">M-Pesa and card transaction receipts</p>
                    </div>
                    <Link to="/payments" className="text-xs text-brand-600 font-bold hover:underline">
                      View Full Ledger &rarr;
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {myPayments.map((p) => (
                      <div key={p.id} className="py-3.5 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-brand-600">{p.receiptNumber}</span>
                          <p className="text-slate-800 dark:text-slate-200 font-semibold">{p.type.toUpperCase()} • {p.invoiceMonth}</p>
                          <span className="text-[10px] text-slate-400">{p.date} • {p.transactionRef}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{formatCurrency(p.amount)}</span>
                          <button onClick={() => window.print()} className="p-2 rounded-lg bg-slate-100 dark:bg-dark-800 hover:bg-slate-200">
                            <Printer className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: 4 Cols */}
              <div className="lg:col-span-4 space-y-8">
                {/* Visitor Gate Pass Card */}
                <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Visitor Gate Pass</h3>
                    <KeyRound className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Generate instant digital QR codes and passcodes for guests and food delivery couriers.
                  </p>
                  <button
                    onClick={() => setIsGatePassModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                  >
                    + Generate Visitor Passcode
                  </button>

                  {gatePasses.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 text-xs space-y-1 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 block">Active Pass:</span>
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-900 dark:text-white">{gatePasses[0].visitorName}</span>
                        <span className="font-mono text-brand-600 text-sm">{gatePasses[0].passCode}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Building Announcements Card */}
                <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Building Notices</h3>
                  <div className="space-y-3 text-xs">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="p-3 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-slate-900 dark:text-white block">{ann.title}</span>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">{ann.content}</p>
                        <span className="text-[10px] text-slate-400 block pt-1">{ann.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* PROPERTY MANAGER / LANDLORD WORKSPACE VIEW */
          /* ========================================================================= */
          <div className="space-y-10">
            {/* Top Landlord Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Property Manager Workspace</span>
                <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                  Emerald Heights Property Dashboard
                </h1>
              </div>

              <button
                onClick={() => setIsAddTenantModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Onboard New Tenant</span>
              </button>
            </div>

            {/* Executive Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white block">
                  {stats.totalUnits} Units
                </span>
                <span className="text-xs text-slate-500 font-semibold mt-1 block">Total Estate Capacity</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="text-3xl font-display font-extrabold text-emerald-600 block">
                  {stats.occupancyRate}%
                </span>
                <span className="text-xs text-slate-500 font-semibold mt-1 block">Occupancy Rate</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="text-3xl font-display font-extrabold text-brand-600 dark:text-brand-400 block">
                  {formatCurrency(stats.totalCollectedThisMonth)}
                </span>
                <span className="text-xs text-slate-500 font-semibold mt-1 block">Collected This Month</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="text-3xl font-display font-extrabold text-rose-600 block">
                  {formatCurrency(stats.totalPendingArrears)}
                </span>
                <span className="text-xs text-slate-500 font-semibold mt-1 block">Pending Arrears</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <span className="text-3xl font-display font-extrabold text-amber-500 block">
                  {stats.activeMaintenanceTickets}
                </span>
                <span className="text-xs text-slate-500 font-semibold mt-1 block">Open Tickets</span>
              </div>
            </div>

            {/* Tenant Roster & Payment Status */}
            <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Active Tenant Roster & Payment Status
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Unit</th>
                      <th className="pb-3">Tenant Name</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Monthly Rent</th>
                      <th className="pb-3">Payment Status</th>
                      <th className="pb-3">Lease Expiry</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allTenants.map((t) => (
                      <tr key={t.id} className="text-slate-700 dark:text-slate-300">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{t.unitNumber}</td>
                        <td className="py-3 font-semibold">{t.name}</td>
                        <td className="py-3 text-slate-500">{t.phone}</td>
                        <td className="py-3 font-bold">{formatCurrency(t.rentAmount)}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            t.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-600'
                              : t.paymentStatus === 'due'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}>
                            {t.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">{t.leaseEnd}</td>
                        <td className="py-3">
                          {t.paymentStatus !== 'paid' && (
                            <button
                              onClick={() => sendPaymentReminder(t.id)}
                              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-dark-800 text-brand-600 font-bold hover:bg-slate-200"
                            >
                              Send Reminder
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Maintenance Dispatch Center */}
            <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Estate Maintenance Dispatch Board
              </h2>

              <div className="space-y-4">
                {maintenanceTickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{t.unitNumber} • {t.title}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">{t.description}</p>
                      <span className="text-[11px] text-brand-600">Assigned: {t.assignedTechnician || 'Unassigned'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {t.status !== 'resolved' ? (
                        <button
                          onClick={() => updateTicketStatus(t.id, 'resolved', 'Repairs verified by caretaker')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold">✓ Resolved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
