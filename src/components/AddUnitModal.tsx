import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { Building2, X, PlusCircle, Home } from 'lucide-react';
import { Unit } from '../types';

export const AddUnitModal: React.FC = () => {
  const { isAddUnitModalOpen, setIsAddUnitModalOpen, addUnit } = useTenant();

  const [unitNumber, setUnitNumber] = useState('');
  const [propertyName, setPropertyName] = useState('Emerald Heights Residences');
  const [floor, setFloor] = useState<number>(1);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [squareFeet, setSquareFeet] = useState<number>(1150);
  const [rentAmount, setRentAmount] = useState<number>(48000);
  const [depositAmount, setDepositAmount] = useState<number>(48000);
  const [status, setStatus] = useState<Unit['status']>('vacant');

  if (!isAddUnitModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber) return;

    addUnit({
      unitNumber,
      propertyName,
      floor,
      bedrooms,
      bathrooms,
      squareFeet,
      rentAmount,
      depositAmount,
      status
    });

    setIsAddUnitModalOpen(false);
    setUnitNumber('');
    setFloor(1);
    setBedrooms(2);
    setBathrooms(2);
    setSquareFeet(1150);
    setRentAmount(48000);
    setDepositAmount(48000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsAddUnitModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Apartment Unit</h3>
            <p className="text-xs text-slate-500">Register a new unit into estate inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Unit Number / Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Unit 6B, Penthouse 2"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Estate / Building</label>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Floor Level</label>
              <input
                type="number"
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs"
              >
                <option value={1}>1 Bed</option>
                <option value={2}>2 Bed</option>
                <option value={3}>3 Bed</option>
                <option value={4}>4 Bed</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Baths</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Sq Feet</label>
              <input
                type="number"
                value={squareFeet}
                onChange={(e) => setSquareFeet(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Monthly Rent (KES) *</label>
              <input
                type="number"
                required
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Security Deposit (KES) *</label>
              <input
                type="number"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Initial Unit Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase"
            >
              <option value="vacant">Vacant (Ready to Lease)</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Under Maintenance / Renovation</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 mt-2"
          >
            Save & Add Unit to Inventory
          </button>
        </form>
      </div>
    </div>
  );
};
