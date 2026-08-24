import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { CreditCard, X, DollarSign, Smartphone, Landmark, CheckCircle2 } from 'lucide-react';
import { PaymentEntry } from '../types';

interface AddPaymentEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPaymentEntryModal: React.FC<AddPaymentEntryModalProps> = ({ isOpen, onClose }) => {
  const { allTenants, createPaymentEntry, formatCurrency } = useTenant();

  const [selectedTenantId, setSelectedTenantId] = useState(allTenants[0]?.id || '');
  const [amount, setAmount] = useState<number>(allTenants[0]?.rentAmount || 48000);
  const [modeOfPayment, setModeOfPayment] = useState<PaymentEntry['modeOfPayment']>('M-Pesa');
  const [referenceNo, setReferenceNo] = useState(`QK${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [paidToAccount, setPaidToAccount] = useState('1120 - Safaricom M-Pesa Till Account');
  const [remarks, setRemarks] = useState('Rent & Utilities Settlement');

  if (!isOpen) return null;

  const currentTenant = allTenants.find((t) => t.id === selectedTenantId) || allTenants[0];

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    const chosen = allTenants.find((t) => t.id === tenantId);
    if (chosen) {
      setAmount(chosen.balanceDue > 0 ? chosen.balanceDue : chosen.rentAmount);
    }
  };

  const handleModeChange = (mode: PaymentEntry['modeOfPayment']) => {
    setModeOfPayment(mode);
    if (mode === 'M-Pesa') {
      setPaidToAccount('1120 - Safaricom M-Pesa Till Account');
      setReferenceNo(`QK${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    } else if (mode === 'Bank Transfer') {
      setPaidToAccount('1110 - KCB Operating Bank Account');
      setReferenceNo(`FT${Date.now().toString().slice(-8)}`);
    } else if (mode === 'Card') {
      setPaidToAccount('1130 - Visa/Mastercard Merchant Account');
      setReferenceNo(`CRD_${Date.now()}`);
    } else {
      setPaidToAccount('1100 - Petty Cash Account');
      setReferenceNo(`CSH_${Date.now()}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || amount <= 0) return;

    createPaymentEntry({
      partyName: currentTenant.name,
      tenantPhone: currentTenant.phone,
      unitNumber: currentTenant.unitNumber,
      propertyName: currentTenant.propertyName,
      paidAmount: Number(amount),
      modeOfPayment,
      paidToAccount,
      referenceNo: referenceNo || `REF-${Date.now()}`,
      remarks: remarks || `Settlement for ${currentTenant.unitNumber}`
    });

    onClose();
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
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Record ERPNext Payment Entry</h3>
            <p className="text-xs text-slate-500">Reconcile tenant payment against sales invoices & general ledger</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Tenant Selector */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
              Select Tenant *
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => handleTenantSelect(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {allTenants.map((t) => (
                <option key={t.id} value={t.id}>
                  👤 {t.name} — {t.unitNumber} ({t.propertyName}) • Balance Due: KES {t.balanceDue.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Amount Received (KES) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Mode of Payment</label>
              <select
                value={modeOfPayment}
                onChange={(e) => handleModeChange(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
              >
                <option value="M-Pesa">Safaricom M-Pesa</option>
                <option value="Bank Transfer">Bank Transfer (EFT/RTGS)</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Reference / Tx No *</label>
              <input
                type="text"
                required
                placeholder="e.g. QK8921KL9"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono uppercase font-bold"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Paid To Account</label>
              <input
                type="text"
                value={paidToAccount}
                onChange={(e) => setPaidToAccount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Remarks / Description</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 mt-2 transition"
          >
            <CreditCard className="w-4 h-4" />
            <span>Post & Reconcile Payment ({formatCurrency(amount)})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
