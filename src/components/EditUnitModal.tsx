import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { Building2, X, Trash2, Save } from 'lucide-react';
import { Unit } from '../types';

interface EditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
}

export const EditUnitModal: React.FC<EditUnitModalProps> = ({ isOpen, onClose, unit }) => {
  const { updateUnitStatus, addUnit, units } = useTenant();

  const [unitNumber, setUnitNumber] = useState('');
  const [rentAmount, setRentAmount] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [status, setStatus] = useState<Unit['status']>('vacant');

  useEffect(() => {
    if (unit) {
      setUnitNumber(unit.unitNumber);
      setRentAmount(unit.rentAmount);
      setDepositAmount(unit.depositAmount);
      setStatus(unit.status);
    }
  }, [unit]);

  if (!isOpen || !unit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUnitStatus(unit.id, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Unit Details</h3>
            <p className="text-xs text-slate-500">{unit.propertyName} • {unit.unitNumber}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Unit Number</label>
            <input
              type="text"
              disabled
              value={unitNumber}
              className="w-full bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Monthly Rent (KES)</label>
              <input
                type="number"
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Deposit (KES)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Occupancy Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase"
            >
              <option value="vacant">Vacant (Ready to Lease)</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center justify-center gap-1.5 mt-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Update Unit Settings</span>
          </button>
        </form>
      </div>
    </div>
  );
};
