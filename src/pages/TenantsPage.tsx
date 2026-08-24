import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Phone,
  Mail,
  Home,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Send,
  Building2
} from 'lucide-react';
import { Tenant } from '../types';

export const TenantsPage: React.FC = () => {
  const {
    properties,
    allTenants,
    formatCurrency,
    sendPaymentReminder,
    setIsAddTenantModalOpen,
    selectedPropertyId,
    setSelectedPropertyId
  } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'due' | 'overdue'>('all');

  const filteredTenants = allTenants.filter((t) => {
    const matchesProperty = selectedPropertyId === 'all' || t.propertyId === selectedPropertyId;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery);

    const matchesStatus = filterStatus === 'all' || t.paymentStatus === filterStatus;
    return matchesProperty && matchesSearch && matchesStatus;
  });

  const paidCount = filteredTenants.filter((t) => t.paymentStatus === 'paid').length;
  const dueCount = filteredTenants.filter((t) => t.paymentStatus === 'due').length;
  const overdueCount = filteredTenants.filter((t) => t.paymentStatus === 'overdue').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Resident Tenants Registry</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tenants Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Directory of all active resident tenants across your properties, payment status, contact records, and rent reminders.
            </p>
          </div>

          <button
            onClick={() => setIsAddTenantModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 transition transform hover:-translate-y-0.5 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Onboard New Tenant</span>
          </button>
        </div>

        {/* Property Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter Property:</span>
          <button
            onClick={() => setSelectedPropertyId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedPropertyId === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            All Estates ({allTenants.length} Tenants)
          </button>
          {properties.map((p) => {
            const count = allTenants.filter((t) => t.propertyId === p.id).length;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPropertyId(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedPropertyId === p.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                🏢 {p.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white block">
              {filteredTenants.length} Tenants
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Registered Residents</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-emerald-600 block">
              {paidCount}
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Rent Up-To-Date</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-amber-500 block">
              {dueCount}
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Rent Due</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-rose-600 block">
              {overdueCount}
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Overdue Arrears</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by tenant name, unit number, estate, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Payment Status:</span>
            {[
              { id: 'all', label: `All (${filteredTenants.length})` },
              { id: 'paid', label: `Paid (${paidCount})` },
              { id: 'due', label: `Due (${dueCount})` },
              { id: 'overdue', label: `Overdue (${overdueCount})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  filterStatus === f.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tenants Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-purple-500 transition flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-bold text-lg flex items-center justify-center">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-base font-bold text-slate-900 dark:text-white block">{t.name}</span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-bold block">{t.unitNumber}</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    t.paymentStatus === 'paid'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                      : t.paymentStatus === 'due'
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                      : 'bg-rose-50 dark:bg-rose-950 text-rose-600'
                  }`}>
                    {t.paymentStatus}
                  </span>
                </div>

                {/* Property & Contacts */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Property:</span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">{t.propertyName}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Phone:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{t.phone}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Monthly Rent:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(t.rentAmount)}</span>
                  </div>
                  {t.balanceDue > 0 && (
                    <div className="flex justify-between items-center text-rose-600 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span className="font-semibold">Arrears Due:</span>
                      <span className="font-bold">{formatCurrency(t.balanceDue)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => sendPaymentReminder(t.id)}
                  className="flex-1 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send SMS Reminder</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
