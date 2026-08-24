import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { Users, X, PlusCircle } from 'lucide-react';

export const AddTenantModal: React.FC = () => {
  const { isAddTenantModalOpen, setIsAddTenantModalOpen, addTenant } = useTenant();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [unitNumber, setUnitNumber] = useState('Unit 3C');
  const [rentAmount, setRentAmount] = useState<number>(48000);
  const [depositAmount, setDepositAmount] = useState<number>(48000);
  const [leaseStart, setLeaseStart] = useState('2026-09-01');
  const [leaseEnd, setLeaseEnd] = useState('2027-08-31');

  if (!isAddTenantModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addTenant({
      name,
      email,
      phone,
      unitId: unitNumber.toLowerCase().replace(' ', '-'),
      unitNumber,
      propertyName: 'Emerald Heights Residences',
      rentAmount,
      depositAmount,
      leaseStart,
      leaseEnd,
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+254 700 000 000',
        relationship: 'Family'
      }
    });

    setIsAddTenantModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsAddTenantModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Onboard New Tenant</h3>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold mb-1">Tenant Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Alice Chepkirui"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+254 7..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Assigned Unit *</label>
              <select
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="Unit 3C">Unit 3C (Vacant)</option>
                <option value="Unit 5A">Unit 5A (Penthouse)</option>
                <option value="Unit 1A">Unit 1A</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Monthly Rent (KES) *</label>
              <input
                type="number"
                required
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Lease Start Date</label>
              <input
                type="date"
                value={leaseStart}
                onChange={(e) => setLeaseStart(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Lease End Date</label>
              <input
                type="date"
                value={leaseEnd}
                onChange={(e) => setLeaseEnd(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg mt-2"
          >
            Register & Activate Tenant Lease
          </button>
        </form>
      </div>
    </div>
  );
};
