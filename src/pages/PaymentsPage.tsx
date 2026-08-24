import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Smartphone,
  Building2,
  FileText
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { activeTenant, payments, formatCurrency, setIsPayRentModalOpen } = useTenant();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Financials & Billing</span>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Rent & Utility Billing Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Pay monthly rent, electricity tokens, water utilities, and download official electronic receipts.
            </p>
          </div>

          <button
            onClick={() => setIsPayRentModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Rent via M-Pesa</span>
          </button>
        </div>

        {/* Invoices Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">August 2026 Rent</span>
            <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white block">
              {formatCurrency(activeTenant.rentAmount)}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Paid in Full</span>
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Water Meter Bill</span>
            <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white block">
              {formatCurrency(3200)}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reconciled</span>
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Service Charge</span>
            <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white block">
              {formatCurrency(4500)}
            </span>
            <span className="text-xs text-slate-500">Security, Elevator & Cleaning</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Current Balance Due</span>
            <span className="text-2xl font-display font-extrabold text-emerald-600 block">
              KES 0
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Account in good standing</span>
          </div>
        </div>

        {/* Complete Payment Ledger */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Complete Payment History & Tax Receipts
            </h2>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 hover:bg-slate-200"
            >
              <Printer className="w-4 h-4" />
              <span>Print Statement</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Receipt No</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Invoice Month</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Transaction Reference</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p) => (
                  <tr key={p.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-3.5 font-mono font-bold text-brand-600">{p.receiptNumber}</td>
                    <td className="py-3.5 font-semibold capitalize">{p.type.replace('_', ' ')}</td>
                    <td className="py-3.5">{p.invoiceMonth}</td>
                    <td className="py-3.5 uppercase font-semibold">{p.method}</td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{formatCurrency(p.amount)}</td>
                    <td className="py-3.5 font-mono text-slate-500">{p.transactionRef}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
