import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  CreditCard,
  DollarSign,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
  Droplets,
  Zap,
  Sparkles,
  Smartphone,
  Eye,
  FileText
} from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils';

export const PaymentsPage: React.FC = () => {
  const {
    activeTenant,
    payments,
    salesInvoices,
    formatCurrency,
    setIsPayRentModalOpen,
    setActiveReceipt,
    setViewingInvoice
  } = useTenant();

  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'history'>('overview');

  const tenantInvoices = salesInvoices.filter((i) => i.unitNumber === activeTenant.unitNumber);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Rent & Utilities Settlement</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Rent & Utility Billing
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Pay monthly rent and metered water utility bills via Safaricom M-Pesa STK push or bank transfer.
            </p>
          </div>

          <button
            onClick={() => setIsPayRentModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition transform hover:-translate-y-0.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Rent via M-Pesa STK</span>
          </button>
        </div>

        {/* Current Month Rent & Water Surcharge Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Due Card */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block">Current Invoice Total Due</span>
                <span className="text-4xl font-display font-extrabold text-slate-900 dark:text-white mt-1 block">
                  {formatCurrency(activeTenant.balanceDue || activeTenant.rentAmount + 2880)}
                </span>
                <span className="text-xs text-rose-600 font-semibold mt-1 block">
                  Payment Due by 5th September 2026
                </span>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                activeTenant.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {activeTenant.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
              </span>
            </div>

            {/* Itemized Breakdown (Rent + Water + Service Charge) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-750 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                Itemized Monthly Breakdown (ERPNext Format):
              </span>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>1. Monthly Apartment Lease Rent ({activeTenant.unitNumber})</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(activeTenant.rentAmount)}</span>
              </div>
              <div className="flex justify-between text-cyan-600 dark:text-cyan-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>2. Metered Water Bill (Meter #WM-402: 16 m³ @ KES 180)</span>
                </span>
                <span className="font-bold">KES 2,880.00</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>3. Estate Service Charge (Security, Cleaning)</span>
                <span className="font-bold text-slate-900 dark:text-white">KES 5,000.00</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-emerald-600 text-sm">
                <span>Grand Total:</span>
                <span>{formatCurrency(activeTenant.rentAmount + 2880 + 5000)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsPayRentModalOpen(true)}
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <Smartphone className="w-4 h-4" />
                <span>Dispatch M-Pesa STK Prompt to Phone</span>
              </button>

              {tenantInvoices[0] && (
                <button
                  onClick={() => setViewingInvoice(tenantInvoices[0])}
                  className="px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>View ERPNext Invoice</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Paybill Reference Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Payment Channel</span>
              </div>
              <h3 className="text-xl font-bold">Manual M-Pesa Paybill</h3>
              <p className="text-xs text-slate-400 mt-1">If paying manually via your Safaricom Sim Toolkit menu:</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Paybill Business No:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">892400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Number:</span>
                <span className="font-mono font-bold text-white text-sm">{activeTenant.unitNumber}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Payments are automatically reconciled against ERPNext Accounts Receivable.
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Official Payment Receipts & History
            </h2>
            <button
              onClick={() => {
                const data = payments.map((p) => ({
                  ReceiptNo: p.receiptNumber,
                  Date: p.date,
                  Unit: p.unitNumber,
                  Amount: p.amount,
                  Type: p.type.toUpperCase(),
                  Method: p.method.toUpperCase(),
                  TransactionRef: p.transactionRef
                }));
                exportToCSV('payment_receipts.csv', data);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-850 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Receipts (CSV)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Receipt No</th>
                  <th className="pb-3">Posting Date</th>
                  <th className="pb-3">Unit</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Billing Cycle</th>
                  <th className="pb-3">Tx Reference</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((pay) => (
                  <tr key={pay.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-3.5 font-mono font-bold text-emerald-600">{pay.receiptNumber}</td>
                    <td className="py-3.5 text-slate-500">{pay.date}</td>
                    <td className="py-3.5 font-bold">{pay.unitNumber}</td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{formatCurrency(pay.amount)}</td>
                    <td className="py-3.5 font-semibold">{pay.invoiceMonth}</td>
                    <td className="py-3.5 font-mono text-slate-500">{pay.transactionRef}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600">
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setActiveReceipt(pay)}
                        className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold"
                      >
                        View Receipt
                      </button>
                    </td>
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
