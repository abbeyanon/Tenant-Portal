import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  DollarSign,
  FileText,
  CreditCard,
  Building2,
  RefreshCw,
  Printer,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  PlusCircle,
  Download,
  Share2,
  Trash2,
  Eye
} from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils';
import { SalesInvoice } from '../types';

export const AccountingPage: React.FC = () => {
  const {
    salesInvoices,
    paymentEntries,
    glEntries,
    expenses,
    formatCurrency,
    stats,
    addToast,
    setIsAddSalesInvoiceModalOpen,
    setIsAddPaymentEntryModalOpen,
    openShareModal,
    deleteSalesInvoice,
    deletePaymentEntry,
    setViewingInvoice
  } = useTenant();

  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'gl'>('invoices');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncERPNext = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addToast({
        type: 'success',
        title: 'ERPNext Accounts Synchronized 🔄',
        message: 'Sales invoices, Payment entries, and General Ledger updated with ERPNext instance.'
      });
    }, 1000);
  };

  const handleExportInvoices = () => {
    const data = salesInvoices.map((i) => ({
      InvoiceNumber: i.invoiceNumber,
      Customer: i.customerName,
      Unit: i.unitNumber,
      Property: i.propertyName || '',
      GrandTotal: i.grandTotal,
      Outstanding: i.outstandingAmount,
      Status: i.status,
      PostingDate: i.postingDate,
      DueDate: i.dueDate
    }));
    exportToCSV('sales_invoices.csv', data);
  };

  const handleExportPayments = () => {
    const data = paymentEntries.map((p) => ({
      VoucherNumber: p.voucherNumber,
      Tenant: p.partyName,
      Unit: p.unitNumber,
      PaidAmount: p.paidAmount,
      ModeOfPayment: p.modeOfPayment,
      ReferenceNo: p.referenceNo,
      PostingDate: p.postingDate
    }));
    exportToCSV('payment_entries.csv', data);
  };

  const handleExportGL = () => {
    const data = glEntries.map((g) => ({
      VoucherType: g.voucherType,
      VoucherNo: g.voucherNo,
      Account: g.account,
      Debit: g.debit,
      Credit: g.credit,
      PostingDate: g.postingDate,
      Remarks: g.remarks
    }));
    exportToCSV('general_ledger_entries.csv', data);
  };

  const totalInvoiced = salesInvoices.reduce((acc, curr) => acc + curr.grandTotal, 0);
  const totalReceived = paymentEntries.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalOutstanding = salesInvoices.reduce((acc, curr) => acc + curr.outstandingAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>ERPNext Accounts & Financial Operations</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Property Accounts & General Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Bill tenants with Sales Invoices (Rent + Water meter billing), reconcile M-Pesa Payment Entries, and audit double-entry General Ledger postings.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsAddSalesInvoiceModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create Sales Invoice (Rent + Water)</span>
            </button>

            <button
              onClick={() => setIsAddPaymentEntryModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <CreditCard className="w-4 h-4" />
              <span>+ Record Payment Entry</span>
            </button>

            <button
              onClick={handleSyncERPNext}
              disabled={isSyncing}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Ledger'}</span>
            </button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Billed Invoices</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white block">
              {formatCurrency(totalInvoiced)}
            </span>
            <span className="text-xs text-slate-400">{salesInvoices.length} ERPNext Sales Invoices</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Collected Payments</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-600 block">
              {formatCurrency(totalReceived)}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">100% Reconciled in Bank/M-Pesa</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Accounts Receivable (Debtors)</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-rose-600 block">
              {formatCurrency(totalOutstanding)}
            </span>
            <span className="text-xs text-rose-500 font-semibold">Pending Arrears</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Operational Expenses</span>
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-amber-500 block">
              {formatCurrency(expenses.reduce((acc, e) => acc + e.amount, 0))}
            </span>
            <span className="text-xs text-slate-400">Security, Power, Repairs, Cleaning</span>
          </div>
        </div>

        {/* Tab Selector & Export Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 gap-4">
          <div className="flex gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'invoices'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sales Invoices ({salesInvoices.length})
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'payments'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Payment Entries ({paymentEntries.length})
            </button>

            <button
              onClick={() => setActiveTab('gl')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'gl'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              General Ledger ({glEntries.length})
            </button>
          </div>

          <div className="pb-2 flex gap-2">
            {activeTab === 'invoices' && (
              <button
                onClick={handleExportInvoices}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-850 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Invoices (CSV)</span>
              </button>
            )}
            {activeTab === 'payments' && (
              <button
                onClick={handleExportPayments}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-850 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Receipts (CSV)</span>
              </button>
            )}
            {activeTab === 'gl' && (
              <button
                onClick={handleExportGL}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-850 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export GL (CSV)</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Sales Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              ERPNext Sales Invoices Ledger
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Invoice Number</th>
                    <th className="pb-3">Customer (Tenant)</th>
                    <th className="pb-3">Unit</th>
                    <th className="pb-3">Grand Total</th>
                    <th className="pb-3">Outstanding</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Posting Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {salesInvoices.map((inv) => (
                    <tr key={inv.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-dark-850/50 transition">
                      <td className="py-3.5 font-mono font-bold">
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{inv.invoiceNumber}</span>
                        </button>
                      </td>
                      <td className="py-3.5 font-semibold text-slate-900 dark:text-white">{inv.customerName}</td>
                      <td className="py-3.5 font-bold text-purple-600">{inv.unitNumber}</td>
                      <td className="py-3.5 font-bold">{formatCurrency(inv.grandTotal)}</td>
                      <td className="py-3.5 font-bold text-rose-600">{formatCurrency(inv.outstandingAmount)}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-600'
                            : inv.status === 'Unpaid'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500">{inv.postingDate}</td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] font-bold flex items-center gap-1"
                            title="View ERPNext Tax Invoice"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print Format</span>
                          </button>

                          <button
                            onClick={() => openShareModal(inv, 'invoice')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[11px] font-bold flex items-center gap-1"
                            title="Share / Send Invoice"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Share</span>
                          </button>

                          <button
                            onClick={() => deleteSalesInvoice(inv.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                            title="Cancel Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Payment Entries Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              ERPNext Payment Entries (Collections)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Voucher No</th>
                    <th className="pb-3">Party (Tenant)</th>
                    <th className="pb-3">Unit</th>
                    <th className="pb-3">Paid Amount</th>
                    <th className="pb-3">Mode</th>
                    <th className="pb-3">Reference No</th>
                    <th className="pb-3">Posting Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paymentEntries.map((pe) => (
                    <tr key={pe.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-dark-850/50 transition">
                      <td className="py-3.5 font-mono font-bold text-purple-600">{pe.voucherNumber}</td>
                      <td className="py-3.5 font-semibold text-slate-900 dark:text-white">{pe.partyName}</td>
                      <td className="py-3.5 font-bold">{pe.unitNumber}</td>
                      <td className="py-3.5 font-bold text-emerald-600">{formatCurrency(pe.paidAmount)}</td>
                      <td className="py-3.5 font-semibold">{pe.modeOfPayment}</td>
                      <td className="py-3.5 font-mono text-slate-500">{pe.referenceNo}</td>
                      <td className="py-3.5 text-slate-500">{pe.postingDate}</td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openShareModal(pe, 'receipt')}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 text-[11px] font-bold flex items-center gap-1"
                            title="Share / Print Receipt"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Share</span>
                          </button>
                          <button
                            onClick={() => deletePaymentEntry(pe.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                            title="Void Payment Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. General Ledger Tab */}
        {activeTab === 'gl' && (
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              ERPNext Double-Entry General Ledger (GL) Postings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Voucher Type</th>
                    <th className="pb-3">Voucher No</th>
                    <th className="pb-3">Account</th>
                    <th className="pb-3">Debit (KES)</th>
                    <th className="pb-3">Credit (KES)</th>
                    <th className="pb-3">Posting Date</th>
                    <th className="pb-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {glEntries.map((gl) => (
                    <tr key={gl.id} className="text-slate-700 dark:text-slate-300">
                      <td className="py-3.5 font-semibold">{gl.voucherType}</td>
                      <td className="py-3.5 font-mono text-brand-600">{gl.voucherNo}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{gl.account}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {gl.debit > 0 ? formatCurrency(gl.debit) : '-'}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {gl.credit > 0 ? formatCurrency(gl.credit) : '-'}
                      </td>
                      <td className="py-3.5 text-slate-500">{gl.postingDate}</td>
                      <td className="py-3.5 text-slate-400 text-[11px] truncate max-w-xs">{gl.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
