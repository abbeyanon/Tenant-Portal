import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  CreditCard,
  Smartphone,
  Building2,
  X,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Sparkles
} from 'lucide-react';
import { PaymentRecord } from '../types';

export const PayRentModal: React.FC = () => {
  const { isPayRentModalOpen, setIsPayRentModalOpen, activeTenant, payRent, formatCurrency } = useTenant();

  const [paymentType, setPaymentType] = useState<PaymentRecord['type']>('rent');
  const [method, setMethod] = useState<'mpesa' | 'card' | 'bank_transfer'>('mpesa');
  const [amount, setAmount] = useState<number>(48000);
  const [mpesaPhone, setMpesaPhone] = useState(activeTenant.phone || '0712 345 678');
  const [invoiceMonth, setInvoiceMonth] = useState('August 2026');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<PaymentRecord | null>(null);

  if (!isPayRentModalOpen) return null;

  const handleTypeChange = (type: PaymentRecord['type']) => {
    setPaymentType(type);
    if (type === 'rent') setAmount(48000);
    else if (type === 'water') setAmount(3200);
    else if (type === 'electricity') setAmount(2500);
    else if (type === 'service_charge') setAmount(4500);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(async () => {
      const res = await payRent({
        unitNumber: activeTenant.unitNumber,
        tenantName: activeTenant.name,
        tenantPhone: activeTenant.phone,
        amount,
        type: paymentType,
        method,
        invoiceMonth,
        mpesaNumber: mpesaPhone
      });

      setIsProcessing(false);
      setCompletedPayment(res.payment);
    }, 1800);
  };

  const handleClose = () => {
    setIsPayRentModalOpen(false);
    setCompletedPayment(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedPayment ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pay Rent & Utilities</h3>
                <p className="text-xs text-slate-500">{activeTenant.propertyName} • {activeTenant.unitNumber}</p>
              </div>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
              {/* Payment Type Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Payment Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'rent', label: 'Monthly Rent', amount: 48000 },
                    { id: 'water', label: 'Water Bill', amount: 3200 },
                    { id: 'electricity', label: 'Token Power', amount: 2500 },
                    { id: 'service_charge', label: 'Service Charge', amount: 4500 }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTypeChange(item.id as any)}
                      className={`p-3 rounded-xl border text-left transition ${
                        paymentType === item.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'bg-slate-50 dark:bg-dark-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="block">{item.label}</span>
                      <span className="text-[11px] font-semibold text-slate-500">KES {item.amount.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount & Month */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    Amount (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    Invoice Month
                  </label>
                  <select
                    value={invoiceMonth}
                    onChange={(e) => setInvoiceMonth(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="August 2026">August 2026</option>
                    <option value="September 2026">September 2026</option>
                    <option value="July 2026">July 2026</option>
                  </select>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('mpesa')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                      method === 'mpesa'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'bg-slate-50 dark:bg-dark-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span>M-Pesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                      method === 'card'
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                        : 'bg-slate-50 dark:bg-dark-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-brand-600" />
                    <span>Card / Visa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('bank_transfer')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                      method === 'bank_transfer'
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                        : 'bg-slate-50 dark:bg-dark-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span>Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* M-Pesa STK Prompt Field */}
              {method === 'mpesa' && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                    M-Pesa Number for Instant PIN Prompt:
                  </span>
                  <input
                    type="tel"
                    required
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    className="w-full bg-white dark:bg-dark-900 border border-emerald-300 dark:border-emerald-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white font-mono"
                  />
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    A Safaricom STK prompt will appear on your handset. Enter your M-Pesa PIN to authorize payment.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing M-Pesa STK Push...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Authorize {formatCurrency(amount)} Payment</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Receipt Screen */
          <div className="text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-xs font-bold uppercase">
                Rent Payment Successful
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                Electronic Rent Receipt Issued
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Payment reconciled to {completedPayment.unitNumber}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-750">
                <span className="text-slate-500">Official Receipt No:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{completedPayment.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-750">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-600 text-sm">{formatCurrency(completedPayment.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-750">
                <span className="text-slate-500">Payment Category:</span>
                <span className="font-semibold uppercase">{completedPayment.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">M-Pesa Transaction Ref:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{completedPayment.transactionRef}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-lg hover:bg-brand-500"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
