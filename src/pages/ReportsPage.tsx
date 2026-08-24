import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Building2,
  DollarSign,
  PieChart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils';

export const ReportsPage: React.FC = () => {
  const {
    properties,
    units,
    allTenants,
    salesInvoices,
    paymentEntries,
    expenses,
    formatCurrency
  } = useTenant();

  const [selectedReport, setSelectedReport] = useState<'pnl' | 'rent_roll' | 'aging' | 'occupancy'>('pnl');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');

  const filteredInvoices = salesInvoices.filter(
    (inv) => selectedPropertyId === 'all' || inv.propertyId === selectedPropertyId
  );
  const filteredPayments = paymentEntries.filter((pe) => selectedPropertyId === 'all');
  const filteredExpenses = expenses.filter((exp) => selectedPropertyId === 'all');

  const totalRevenue = filteredPayments.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalOperatingExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netOperatingIncome = totalRevenue - totalOperatingExpenses;

  const totalOutstandingArrears = allTenants.reduce((acc, curr) => acc + curr.balanceDue, 0);

  const handleExportCurrentReport = () => {
    if (selectedReport === 'pnl') {
      const pnlData = [
        { Category: 'Rental & Utility Revenue (Collections)', Amount: totalRevenue },
        ...filteredExpenses.map((exp) => ({ Category: `Expense: ${exp.category} (${exp.paidTo})`, Amount: -exp.amount })),
        { Category: 'NET OPERATING INCOME (NOI)', Amount: netOperatingIncome }
      ];
      exportToCSV('profit_and_loss_statement.csv', pnlData);
    } else if (selectedReport === 'rent_roll') {
      const rentRollData = allTenants.map((t) => ({
        Tenant: t.name,
        Property: t.propertyName,
        Unit: t.unitNumber,
        MonthlyRent: t.rentAmount,
        BalanceDue: t.balanceDue,
        PaymentStatus: t.paymentStatus.toUpperCase(),
        LeaseEnd: t.leaseEnd
      }));
      exportToCSV('property_rent_roll.csv', rentRollData);
    } else if (selectedReport === 'occupancy') {
      const occData = units.map((u) => ({
        UnitNumber: u.unitNumber,
        Property: u.propertyName,
        Bedrooms: u.bedrooms,
        Status: u.status.toUpperCase(),
        Rent: u.rentAmount,
        Tenant: u.currentTenantName || 'Vacant'
      }));
      exportToCSV('occupancy_report.csv', occData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Financial Statements & Analytical Reports</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Financial Reports & Rent Roll
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Comprehensive statement generation, Profit & Loss audit, Arrears Aging ledger, and CSV export.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportCurrentReport}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Report (CSV)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-90"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Statement</span>
            </button>
          </div>
        </div>

        {/* Report Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
          {[
            { id: 'pnl', label: 'Profit & Loss Statement (P&L)' },
            { id: 'rent_roll', label: 'Rent Roll Ledger' },
            { id: 'aging', label: 'Arrears Aging Report' },
            { id: 'occupancy', label: 'Occupancy & Inventory Statement' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id as any)}
              className={`pb-3 transition border-b-2 ${
                selectedReport === tab.id
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. Profit & Loss Statement */}
        {selectedReport === 'pnl' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Revenue (Collected)</span>
                <span className="text-3xl font-display font-extrabold text-emerald-600 block">
                  {formatCurrency(totalRevenue)}
                </span>
                <span className="text-xs text-slate-400">Rent & Utility Collections</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Operating Expenses</span>
                <span className="text-3xl font-display font-extrabold text-rose-600 block">
                  {formatCurrency(totalOperatingExpenses)}
                </span>
                <span className="text-xs text-slate-400">Security, Repairs, Power, Cleaning</span>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Net Operating Income (NOI)</span>
                <span className="text-3xl font-display font-extrabold text-brand-600 dark:text-brand-400 block">
                  {formatCurrency(netOperatingIncome)}
                </span>
                <span className="text-xs text-slate-400">Net Profit after disbursements</span>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                Detailed Operating Expenses Breakdown
              </h2>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Voucher No</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Beneficiary / Supplier</th>
                    <th className="pb-3">Account Code</th>
                    <th className="pb-3">Posting Date</th>
                    <th className="pb-3 text-right">Disbursed (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id}>
                      <td className="py-3.5 font-mono text-purple-600 font-bold">{exp.voucherNo}</td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{exp.category}</td>
                      <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">{exp.paidTo}</td>
                      <td className="py-3.5 text-slate-400 text-[11px]">{exp.expenseAccount}</td>
                      <td className="py-3.5 text-slate-500">{exp.postingDate}</td>
                      <td className="py-3.5 text-right font-mono font-bold text-rose-600">
                        {formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Rent Roll Ledger */}
        {selectedReport === 'rent_roll' && (
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Estate Rent Roll & Lease Ledger
            </h2>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Tenant</th>
                  <th className="pb-3">Property</th>
                  <th className="pb-3">Unit</th>
                  <th className="pb-3">Monthly Rent</th>
                  <th className="pb-3">Arrears Due</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Lease Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allTenants.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{t.name}</td>
                    <td className="py-3.5 text-slate-500">{t.propertyName}</td>
                    <td className="py-3.5 font-bold text-purple-600">{t.unitNumber}</td>
                    <td className="py-3.5 font-bold">{formatCurrency(t.rentAmount)}</td>
                    <td className="py-3.5 font-bold text-rose-600">{formatCurrency(t.balanceDue)}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {t.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500">{t.leaseEnd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Arrears Aging Report */}
        {selectedReport === 'aging' && (
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Accounts Receivable Aging Analysis
            </h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200">
                <span className="text-xs text-emerald-600 block">Current (0 - 30 Days)</span>
                <span className="text-xl font-bold text-emerald-700">{formatCurrency(48000)}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                <span className="text-xs text-amber-600 block">31 - 60 Days</span>
                <span className="text-xl font-bold text-amber-700">{formatCurrency(38000)}</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200">
                <span className="text-xs text-rose-600 block">61 - 90 Days</span>
                <span className="text-xl font-bold text-rose-700">{formatCurrency(38000)}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 text-white">
                <span className="text-xs text-slate-400 block">Total Overdue Arrears</span>
                <span className="text-xl font-bold text-rose-400">{formatCurrency(totalOutstandingArrears)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Occupancy Statement */}
        {selectedReport === 'occupancy' && (
          <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Estate Units Inventory & Occupancy Statement
            </h2>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Unit Number</th>
                  <th className="pb-3">Property</th>
                  <th className="pb-3">Bedrooms</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Monthly Rent</th>
                  <th className="pb-3">Assigned Tenant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {units.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{u.unitNumber}</td>
                    <td className="py-3.5 text-slate-500">{u.propertyName}</td>
                    <td className="py-3.5">{u.bedrooms} Bed</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.status === 'vacant' ? 'bg-blue-50 text-blue-600' : u.status === 'occupied' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold">{formatCurrency(u.rentAmount)}</td>
                    <td className="py-3.5 text-purple-600 font-semibold">{u.currentTenantName || '— (Vacant)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
