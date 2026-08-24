import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { CreditCard, Smartphone, CheckCircle2, X, ShieldCheck, Building2, Phone, Calendar } from 'lucide-react';
import { PaymentRecord } from '../types';

export const PayRentModal: React.FC = () => {
  const {
    isPayRentModalOpen,
    setIsPayRentModalOpen,
    activeTenant,
    formatCurrency,
    triggerMpesaStkPush
  } = useTenant();

  const [paymentType, setPaymentType] = useState<PaymentRecord['type']>('rent');
  const [customAmount, setCustomAmount] = useState<number>(activeTenant.rentAmount);
  const [phone, setPhone] = useState(activeTenant.phone.replace(/[^0-9]/g, '').slice(-9));
  const [month, setMonth] = useState('August 2026');

  if (!isPayRentModalOpen) return null;

  const handleTypeChange = (type: PaymentRecord['type']) => {
    setPaymentType(type);
    if (type === 'rent') setCustomAmount(activeTenant.rentAmount);
    else if (type === 'water') setCustomAmount(3200);
    else if (type === 'service_charge') setCustomAmount(5000);
    else if (type === 'electricity') setCustomAmount(4500);
    else if (type === 'deposit') setCustomAmount(activeTenant.depositAmount);
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = phone.startsWith('254') ? `+${phone}` : `+254${phone.replace(/^0+/, '')}`;

    triggerMpesaStkPush({
      amount: Number(customAmount),
      phone: formattedPhone,
      unitNumber: activeTenant.unitNumber,
      propertyName: activeTenant.propertyName,
      tenantName: activeTenant.name,
      type: paymentType,
      invoiceMonth: month
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsPayRentModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pay via M-Pesa STK</h3>
            <p className="text-xs text-slate-500">{activeTenant.propertyName} • {activeTenant.unitNumber}</p>
          </div>
        </div>

        <form onSubmit={handleInitiatePayment} className="space-y-4 text-xs">
          {/* Billing Category Selection */}
          <div>
            <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
              Select Invoice / Bill Item
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'rent', label: 'Monthly Rent', amount: activeTenant.rentAmount },
                { id: 'water', label: 'Water Utility', amount: 3200 },
                { id: 'service_charge', label: 'Service Charge', amount: 5000 },
                { id: 'electricity', label: 'Electricity Token', amount: 4500 }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTypeChange(item.id as any)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    paymentType === item.id
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="block text-xs">{item.label}</span>
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block mt-0.5">
                    {formatCurrency(item.amount)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount field */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
              Payment Amount (KES)
            </label>
            <input
              type="number"
              required
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* M-Pesa Phone Number Field */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
              Safaricom M-Pesa Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-xs font-bold">+254</span>
              <input
                type="tel"
                required
                placeholder="712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(-9))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-14 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              An instant STK Push prompt will be sent to this phone.
            </span>
          </div>

          {/* Month selector */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
              Invoice Billing Period
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-semibold"
            >
              <option value="August 2026">August 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="October 2026">October 2026</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-4 transition transform hover:-translate-y-0.5"
          >
            <Smartphone className="w-4 h-4" />
            <span>Send M-Pesa STK Push ({formatCurrency(customAmount)})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
