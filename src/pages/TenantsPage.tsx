import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  Phone,
  Mail,
  Home,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  UserPlus,
  Building2,
  Calendar,
  Car,
  FileText,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { Tenant } from '../types';

export const TenantsPage: React.FC = () => {
  const {
    allTenants,
    units,
    formatCurrency,
    addTenant,
    sendPaymentReminder,
    setIsAddTenantModalOpen,
    payRent,
    addToast
  } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'due' | 'overdue'>('all');

  // Quick inline add tenant form state
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newUnitNumber, setNewUnitNumber] = useState('Unit 3C');
  const [newRentAmount, setNewRentAmount] = useState<number>(48000);
  const [newDepositAmount, setNewDepositAmount] = useState<number>(48000);
  const [newLeaseStart, setNewLeaseStart] = useState('2026-09-01');
  const [newLeaseEnd, setNewLeaseEnd] = useState('2027-08-31');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newEmergencyName, setNewEmergencyName] = useState('');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('');

  const filteredTenants = allTenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || tenant.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newUnitNumber) {
      addToast({
        type: 'warning',
        title: 'Missing Required Fields',
        message: 'Please fill in the tenant name, phone number, and unit number.'
      });
      return;
    }

    addTenant({
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newPhone,
      unitId: newUnitNumber.toLowerCase().replace(/\s+/g, '-'),
      unitNumber: newUnitNumber,
      propertyName: 'Emerald Heights Residences',
      rentAmount: newRentAmount,
      depositAmount: newDepositAmount,
      leaseStart: newLeaseStart,
      leaseEnd: newLeaseEnd,
      vehiclePlate: newVehiclePlate,
      emergencyContact: {
        name: newEmergencyName || 'Emergency Contact',
        phone: newEmergencyPhone || '+254 700 000 000',
        relationship: 'Family'
      }
    });

    // Reset form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewVehiclePlate('');
    setNewEmergencyName('');
    setNewEmergencyPhone('');
    setShowInlineForm(false);
  };

  const handleRecordPayment = (tenant: Tenant) => {
    payRent({
      unitNumber: tenant.unitNumber,
      tenantName: tenant.name,
      tenantPhone: tenant.phone,
      amount: tenant.balanceDue || tenant.rentAmount,
      type: 'rent',
      method: 'mpesa',
      invoiceMonth: 'August 2026'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Property Management & Tenancy Registry</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Resident Tenants Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              View registered resident leases, send automated rent reminders, record payments, and onboard new tenants.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowInlineForm(!showInlineForm)}
              className="px-5 py-3.5 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-800 font-bold text-xs shadow-sm flex items-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4 text-purple-600" />
              <span>{showInlineForm ? 'Hide Quick Form' : 'Quick Add Tenant'}</span>
            </button>

            <button
              onClick={() => setIsAddTenantModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Onboard New Tenant (Modal)</span>
            </button>
          </div>
        </div>

        {/* Quick Inline Onboarding Form */}
        {showInlineForm && (
          <div className="bg-white dark:bg-dark-900 border-2 border-purple-400 dark:border-purple-600 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Register & Onboard New Tenant</h3>
                  <p className="text-xs text-slate-500">Add a resident tenant directly to the estate roster</p>
                </div>
              </div>
              <button
                onClick={() => setShowInlineForm(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Close Form ✕
              </button>
            </div>

            <form onSubmit={handleInlineSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Tenant Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alice Chepkirui"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="alice.chepkirui@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Phone Number (M-Pesa) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 712 345 678"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Assigned Unit *</label>
                  <select
                    value={newUnitNumber}
                    onChange={(e) => setNewUnitNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                  >
                    <option value="Unit 3C">Unit 3C (3 Bed - Vacant)</option>
                    <option value="Unit 5A">Unit 5A (Penthouse)</option>
                    <option value="Unit 1A">Unit 1A (1 Bed)</option>
                    <option value="Unit 2B">Unit 2B (2 Bed)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Monthly Rent (KES) *</label>
                  <input
                    type="number"
                    required
                    value={newRentAmount}
                    onChange={(e) => setNewRentAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Security Deposit (KES) *</label>
                  <input
                    type="number"
                    required
                    value={newDepositAmount}
                    onChange={(e) => setNewDepositAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Vehicle Plate (Parking)</label>
                  <input
                    type="text"
                    placeholder="e.g. KDF 778Z"
                    value={newVehiclePlate}
                    onChange={(e) => setNewVehiclePlate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Lease Start Date</label>
                  <input
                    type="date"
                    value={newLeaseStart}
                    onChange={(e) => setNewLeaseStart(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Lease Expiry Date</label>
                  <input
                    type="date"
                    value={newLeaseEnd}
                    onChange={(e) => setNewLeaseEnd(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Emergency Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Patrick Chepkirui"
                    value={newEmergencyName}
                    onChange={(e) => setNewEmergencyName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+254 7..."
                    value={newEmergencyPhone}
                    onChange={(e) => setNewEmergencyPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInlineForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/20"
                >
                  Save & Register Tenant
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by tenant name, unit (e.g. 4B), phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Filter Status:</span>
            {[
              { id: 'all', label: 'All Tenants' },
              { id: 'paid', label: 'Paid in Full' },
              { id: 'due', label: 'Payment Due' },
              { id: 'overdue', label: 'Overdue Arrears' }
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
                {/* Unit & Payment Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-sm">
                      {t.unitNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{t.propertyName}</span>
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

                {/* Tenant Avatar and Details */}
                <div className="flex items-center gap-4">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-bold text-lg flex items-center justify-center">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.email}</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.phone}</p>
                  </div>
                </div>

                {/* Financial Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Rent:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(t.rentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Balance Due:</span>
                    <span className={`font-bold ${t.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {t.balanceDue > 0 ? formatCurrency(t.balanceDue) : 'KES 0 (Paid)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Security Deposit:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(t.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-750">
                    <span className="text-slate-500">Lease Validity:</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">{t.leaseStart} to {t.leaseEnd}</span>
                  </div>
                </div>

                {/* Vehicle & Emergency info */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    <span>Plate: <strong>{t.vehiclePlate || 'N/A'}</strong></span>
                  </span>
                  <span>Emergency: {t.emergencyContact.name.split(' ')[0]}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                {t.paymentStatus !== 'paid' ? (
                  <button
                    onClick={() => sendPaymentReminder(t.id)}
                    className="flex-1 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reminder</span>
                  </button>
                ) : (
                  <div className="flex-1 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-xs flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Rent Cleared</span>
                  </div>
                )}

                <button
                  onClick={() => handleRecordPayment(t)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                  title="Record manual rent receipt"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Receive</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
