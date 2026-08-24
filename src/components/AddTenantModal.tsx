import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { Users, X, PlusCircle, UserPlus, Home, Car, Phone, Mail } from 'lucide-react';

export const AddTenantModal: React.FC = () => {
  const {
    isAddTenantModalOpen,
    setIsAddTenantModalOpen,
    units,
    addTenant,
    preselectedUnitNumber,
    setPreselectedUnitNumber
  } = useTenant();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedUnitMode, setSelectedUnitMode] = useState<'dropdown' | 'custom'>('dropdown');
  const [unitNumber, setUnitNumber] = useState('Unit 3C');
  const [customUnitNumber, setCustomUnitNumber] = useState('');
  const [rentAmount, setRentAmount] = useState<number>(48000);
  const [depositAmount, setDepositAmount] = useState<number>(48000);
  const [leaseStart, setLeaseStart] = useState('2026-09-01');
  const [leaseEnd, setLeaseEnd] = useState('2027-08-31');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // When preselectedUnitNumber changes (e.g. from Units page)
  useEffect(() => {
    if (preselectedUnitNumber) {
      setUnitNumber(preselectedUnitNumber);
      const matched = units.find((u) => u.unitNumber === preselectedUnitNumber);
      if (matched) {
        setRentAmount(matched.rentAmount);
        setDepositAmount(matched.depositAmount);
      }
    }
  }, [preselectedUnitNumber, units]);

  if (!isAddTenantModalOpen) return null;

  const handleUnitDropdownChange = (chosenUnit: string) => {
    if (chosenUnit === '__custom__') {
      setSelectedUnitMode('custom');
      return;
    }
    setUnitNumber(chosenUnit);
    const matched = units.find((u) => u.unitNumber === chosenUnit);
    if (matched) {
      setRentAmount(matched.rentAmount);
      setDepositAmount(matched.depositAmount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUnitNumber = selectedUnitMode === 'custom' ? customUnitNumber : unitNumber;
    if (!name || !phone || !finalUnitNumber) return;

    addTenant({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone,
      unitId: finalUnitNumber.toLowerCase().replace(/\s+/g, '-'),
      unitNumber: finalUnitNumber,
      propertyName: 'Emerald Heights Residences',
      rentAmount,
      depositAmount,
      leaseStart,
      leaseEnd,
      vehiclePlate,
      emergencyContact: {
        name: emergencyName || 'Emergency Contact',
        phone: emergencyPhone || '+254 700 000 000',
        relationship: 'Family'
      }
    });

    setIsAddTenantModalOpen(false);
    setPreselectedUnitNumber(null);
    setName('');
    setEmail('');
    setPhone('');
    setCustomUnitNumber('');
    setVehiclePlate('');
    setEmergencyName('');
    setEmergencyPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => {
            setIsAddTenantModalOpen(false);
            setPreselectedUnitNumber(null);
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tenant Onboarding & Unit Allocation</h3>
            <p className="text-xs text-slate-500">Specify unit assignment, lease duration, and rent terms</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Tenant Name */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Tenant Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Alice Chepkirui"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Email Address *</label>
              <input
                type="email"
                required
                placeholder="alice@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Phone Number (M-Pesa) *</label>
              <input
                type="tel"
                required
                placeholder="+254 712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Unit Specification (Dropdown or Custom) */}
          <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-purple-900 dark:text-purple-300">
                Specify Assigned Unit *
              </label>
              <button
                type="button"
                onClick={() => setSelectedUnitMode(selectedUnitMode === 'dropdown' ? 'custom' : 'dropdown')}
                className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline"
              >
                {selectedUnitMode === 'dropdown' ? '+ Enter Custom Unit' : '← Select from Estate Inventory'}
              </button>
            </div>

            {selectedUnitMode === 'dropdown' ? (
              <select
                value={unitNumber}
                onChange={(e) => handleUnitDropdownChange(e.target.value)}
                className="w-full bg-white dark:bg-dark-900 border border-purple-300 dark:border-purple-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.unitNumber}>
                    {u.unitNumber} — ({u.bedrooms} Bed, {u.status.toUpperCase()}) • KES {u.rentAmount.toLocaleString()}
                  </option>
                ))}
                <option value="__custom__">➕ Type Custom / Other Unit Number...</option>
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="e.g. Unit 6B, Penthouse 2, Block C Apt 10"
                value={customUnitNumber}
                onChange={(e) => setCustomUnitNumber(e.target.value)}
                className="w-full bg-white dark:bg-dark-900 border border-purple-300 dark:border-purple-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Monthly Rent (KES) *</label>
              <input
                type="number"
                required
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Security Deposit (KES) *</label>
              <input
                type="number"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Lease Start Date</label>
              <input
                type="date"
                value={leaseStart}
                onChange={(e) => setLeaseStart(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Lease Expiry Date</label>
              <input
                type="date"
                value={leaseEnd}
                onChange={(e) => setLeaseEnd(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Vehicle Plate (Parking Permit)</label>
              <input
                type="text"
                placeholder="e.g. KDF 778Z"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Emergency Phone</label>
              <input
                type="tel"
                placeholder="+254 7..."
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 mt-2"
          >
            Register & Allocate Unit
          </button>
        </form>
      </div>
    </div>
  );
};
