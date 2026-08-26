import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { CreditCard, X, DollarSign, Smartphone, ShieldCheck, CheckCircle2, Droplets, Zap } from 'lucide-react';

export const PayRentModal: React.FC = () => {
  const {
    activeTenant,
    isPayRentModalOpen,
    setIsPayRentModalOpen,
    triggerMpesaStkPush,
    formatCurrency
  } = useTenant();

  const [phone, setPhone] = useState(activeTenant.phone || '+254 712 345 678');
  const [paymentType, setPaymentType] = useState<'full' | 'rent' | 'water' | 'electricity'>('full');
  
  const estimatedWater = 2880;
  const estimatedElectricity = 2422;
  const totalFull = activeTenant.rentAmount + estimatedWater + estimatedElectricity;

  const [customAmount, setCustomAmount] = useState<number>(totalFull);

  if (!isPayRentModalOpen) return null;

  const handleTypeChange = (type: 'full' | 'rent' | 'water' | 'electricity') => {
    setPaymentType(type);
    if (type === 'rent') setCustomAmount(activeTenant.rentAmount);
    else if (type === 'water') setCustomAmount(estimatedWater);
    else if (type === 'electricity') setCustomAmount(estimatedElectricity);
    else setCustomAmount(totalFull);
  };

  const handleInitiateSTK = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || customAmount <= 0) return;

    const labelMap = {
      full: 'Rent, Water & Electricity Power Settlement',
      rent: 'Monthly Lease Rent',
      water: 'Water Utility Consumption Bill',
      electricity: 'Electricity Power Sub-Meter Bill'
    };

    triggerMpesaStkPush({
      phone,
      amount: Number(customAmount),
      unitNumber: activeTenant.unitNumber,
      tenantName: activeTenant.name,
      propertyName: activeTenant.propertyName,
      type: labelMap[paymentType],
      invoiceMonth: 'September 2026'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6 text-xs">
        <button
          onClick={() => setIsPayRentModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pay via M-Pesa STK Push</h3>
            <p className="text-xs text-slate-500">{activeTenant.propertyName} • {activeTenant.unitNumber}</p>
          </div>
        </div>

        <form onSubmit={handleInitiateSTK} className="space-y-4">
          {/* Payment Type Switcher */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300">Select Bill to Pay:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('full')}
                className={`p-2.5 rounded-xl font-bold transition text-center ${
                  paymentType === 'full'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All (Rent + Water + Power)
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('rent')}
                className={`p-2.5 rounded-xl font-bold transition text-center ${
                  paymentType === 'rent'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Rent Only
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('water')}
                className={`p-2.5 rounded-xl font-bold transition text-center flex items-center justify-center gap-1 ${
                  paymentType === 'water'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Water Bill</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('electricity')}
                className={`p-2.5 rounded-xl font-bold transition text-center flex items-center justify-center gap-1 ${
                  paymentType === 'electricity'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Electricity Bill</span>
              </button>
            </div>
          </div>

          {/* Amount & Phone Input */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Total Amount (KES) *</label>
            <input
              type="number"
              required
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-base text-slate-900 dark:text-white font-bold font-mono"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Safaricom M-Pesa Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Clicking below sends the prompt directly to your phone handset for instant M-Pesa PIN authorization.</span>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
          >
            <Smartphone className="w-4 h-4" />
            <span>Send M-Pesa STK Prompt ({formatCurrency(customAmount)})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
