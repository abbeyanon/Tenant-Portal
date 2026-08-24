import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { UserCheck, X, Trash2, Save, AlertTriangle } from 'lucide-react';
import { Tenant } from '../types';

interface EditTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

export const EditTenantModal: React.FC<EditTenantModalProps> = ({ isOpen, onClose, tenant }) => {
  const { updateTenant, deleteTenant } = useTenant();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [rentAmount, setRentAmount] = useState<number>(0);
  const [balanceDue, setBalanceDue] = useState<number>(0);
  const [vehiclePlate, setVehiclePlate] = useState('');

  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setEmail(tenant.email);
      setPhone(tenant.phone);
      setUnitNumber(tenant.unitNumber);
      setRentAmount(tenant.rentAmount);
      setBalanceDue(tenant.balanceDue);
      setVehiclePlate(tenant.vehiclePlate || '');
    }
  }, [tenant]);

  if (!isOpen || !tenant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenant(tenant.id, {
      name,
      email,
      phone,
      unitNumber,
      rentAmount: Number(rentAmount),
      balanceDue: Number(balanceDue),
      paymentStatus: Number(balanceDue) === 0 ? 'paid' : Number(balanceDue) > Number(rentAmount) ? 'overdue' : 'due',
      vehiclePlate
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove tenant ${tenant.name}? The unit ${tenant.unitNumber} will be marked vacant.`)) {
      deleteTenant(tenant.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Tenant Details</h3>
            <p className="text-xs text-slate-500">{tenant.propertyName} • {tenant.unitNumber}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Tenant Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Unit Number</label>
              <input
                type="text"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Rent (KES)</label>
              <input
                type="number"
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Arrears Due (KES)</label>
              <input
                type="number"
                value={balanceDue}
                onChange={(e) => setBalanceDue(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-rose-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Vehicle License Plate</label>
            <input
              type="text"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-mono uppercase"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Tenant</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center justify-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
