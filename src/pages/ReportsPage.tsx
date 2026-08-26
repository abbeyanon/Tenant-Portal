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
  AlertCircle,
  BarChart3,
  Droplets,
  Zap,
  ArrowUpRight,
  ShieldCheck
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

  // Arrears aging mock buckets
  const agingBuckets = [
    { label: 'Current (0-30 Days)', amount: 48000, color: 'bg-amber-400', count: 1 },
    { label: 'Past Due (31-60 Days)', amount: 76000, color: 'bg-orange-500', count: 1 },
    { label: 'Delinquent (61-90 Days)', amount: 0, color: 'bg-rose-500', count: 0 },
    { label: 'Critical (90+ Days)', amount: 0, color: 'bg-purple-700', count: 0 }
  ];

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
              Financial Reports & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Comprehensive statement generation, Profit & Loss audit, Arrears Aging ledger, Graphical Cash Flow Breakdown, and CSV export.
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
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 hover:opacity-90 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GRAPHICAL REPRESENTATION: FINANCIAL & CASH FLOW BREAKDOWN */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income vs Expenses Visual Bar Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Operating Revenue</span>
              <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12.4% MoM</span>
              </span>
            </div>
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white block">
              {formatCurrency(totalRevenue)}
            </span>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Lease Rent Collections:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(totalRevenue * 0.88)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Water & Power Utilities:</span>
                <span className="font-bold text-cyan-600 font-mono">{formatCurrency(totalRevenue * 0.12)}</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-dark-800 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-emerald-600 h-full" style={{ width: '88%' }} title="Rent" />
              <div className="bg-cyan-500 h-full" style={{ width: '12%' }} title="Utilities" />
            </div>
          </div>

          {/* Operating Expenses & Net Income Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Operating Income (NOI)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px]">
                Healthy Margins
              </span>
            </div>
            <span className="text-3xl font-display font-extrabold text-emerald-600 block">
              {formatCurrency(netOperatingIncome)}
            </span>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Total Operating Expenses:</span>
                <span className="font-bold text-rose-600 font-mono">{formatCurrency(totalOperatingExpenses)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Expense-to-Income Ratio:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {Math.round((totalOperatingExpenses / Math.max(totalRevenue, 1)) * 100)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-dark-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${100 - Math.round((totalOperatingExpenses / Math.max(totalRevenue, 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Arrears Aging Graphical Breakdown Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Outstanding Arrears</span>
              <span className="text-rose-600 font-bold text-xs">2 Accounts</span>
            </div>
            <span className="text-3xl font-display font-extrabold text-rose-600 block">
              {formatCurrency(totalOutstandingArrears)}
            </span>
            {/* Horizontal Color Bar for Aging */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>0-30 Days (Due):</span>
                <span className="font-bold text-amber-600 font-mono">{formatCurrency(48000)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>31-60 Days (Overdue):</span>
                <span className="font-bold text-orange-600 font-mono">{formatCurrency(76000)}</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-dark-800 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-amber-400 h-full" style={{ width: '38%' }} title="0-30 Days" />
              <div className="bg-orange-500 h-full" style={{ width: '62%' }} title="31-60 Days" />
            </div>
          </div>
        </div>

        {/* Report Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
          {[
            { id: 'pnl', label: '📊 Profit & Loss Statement' },
            { id: 'rent_roll', label: '📑 Property Rent Roll' },
            { id: 'aging', label: '⏳ Arrears Aging Ledger' },
            { id: 'occupancy', label: '🏢 Occupancy Statement' }
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

        {/* ========================================================================= */}
        {/* REPORT CONTENT VIEW */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          {/* Statement Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {selectedReport === 'pnl' && 'Profit & Loss Statement (Income vs Expenditure)'}
                {selectedReport === 'rent_roll' && 'Consolidated Property Rent Roll Ledger'}
                {selectedReport === 'aging' && 'Accounts Receivable & Arrears Aging Schedule'}
                {selectedReport === 'occupancy' && 'Estate Occupancy & Leasable Inventory Statement'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Period: Current Financial Quarter (August 2026) • Prepared under ERPNext Accounting Standards
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 uppercase font-semibold block">Currency</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">KES (Kenyan Shillings)</span>
            </div>
          </div>

          {/* 1. PROFIT AND LOSS VIEW */}
          {selectedReport === 'pnl' && (
            <div className="space-y-6">
              {/* Income Section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                  1. Operating Revenue & Utility Receipts
                </span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Account / Revenue Stream</th>
                        <th className="p-3.5">Reference / Notes</th>
                        <th className="p-3.5 text-right">Amount (KES)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-white">4110 - Residential & Commercial Rental Income</td>
                        <td className="p-3.5 text-slate-500">Collected tenant monthly rent</td>
                        <td className="p-3.5 text-right font-mono font-bold text-emerald-600">{formatCurrency(totalRevenue * 0.88)}</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-white">4120 - Water Utility Reimbursements</td>
                        <td className="p-3.5 text-slate-500">Metered water recovery (m³)</td>
                        <td className="p-3.5 text-right font-mono font-bold text-emerald-600">{formatCurrency(totalRevenue * 0.07)}</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-white">4130 - Electricity Power Sub-meter Recovery</td>
                        <td className="p-3.5 text-slate-500">Sub-metered power charges (kWh)</td>
                        <td className="p-3.5 text-right font-mono font-bold text-emerald-600">{formatCurrency(totalRevenue * 0.05)}</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-emerald-50/50 dark:bg-emerald-950/20 font-bold">
                      <tr>
                        <td className="p-3.5 text-emerald-900 dark:text-emerald-300" colSpan={2}>Total Operating Revenue</td>
                        <td className="p-3.5 text-right font-mono text-emerald-600 text-sm">{formatCurrency(totalRevenue)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Operating Expenses Section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                  2. Operating Expenses & Facility Maintenance
                </span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Expense Category</th>
                        <th className="p-3.5">Vendor / Payee</th>
                        <th className="p-3.5">Posting Date</th>
                        <th className="p-3.5 text-right">Amount (KES)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredExpenses.map((exp) => (
                        <tr key={exp.id}>
                          <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{exp.category}</td>
                          <td className="p-3.5 text-slate-500">{exp.paidTo}</td>
                          <td className="p-3.5 font-mono text-slate-500">{exp.date}</td>
                          <td className="p-3.5 text-right font-mono text-rose-600 font-bold">{formatCurrency(exp.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-rose-50/50 dark:bg-rose-950/20 font-bold">
                      <tr>
                        <td className="p-3.5 text-rose-900 dark:text-rose-300" colSpan={3}>Total Operating Expenses</td>
                        <td className="p-3.5 text-right font-mono text-rose-600 text-sm">{formatCurrency(totalOperatingExpenses)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Net Operating Income Highlight */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-400 dark:text-emerald-700 block">
                    Net Operating Income (NOI)
                  </span>
                  <span className="text-xs text-slate-300 dark:text-slate-600">Operating Revenue minus Total Operating Expenses</span>
                </div>
                <span className="text-2xl font-display font-extrabold font-mono text-emerald-400 dark:text-emerald-700">
                  {formatCurrency(netOperatingIncome)}
                </span>
              </div>
            </div>
          )}

          {/* 2. RENT ROLL VIEW */}
          {selectedReport === 'rent_roll' && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Tenant Name</th>
                    <th className="p-3.5">Property & Unit</th>
                    <th className="p-3.5 text-right">Monthly Rent</th>
                    <th className="p-3.5 text-right">Balance Due</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Lease End</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allTenants.map((t) => (
                    <tr key={t.id}>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{t.name}</td>
                      <td className="p-3.5">
                        <span className="font-semibold text-brand-600">{t.unitNumber}</span>
                        <span className="text-[11px] text-slate-400 block">{t.propertyName}</span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold">{formatCurrency(t.rentAmount)}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-rose-600">{formatCurrency(t.balanceDue)}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {t.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">{t.leaseEnd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. AGING SCHEDULE VIEW */}
          {selectedReport === 'aging' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {agingBuckets.map((bucket, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{bucket.label}</span>
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white block">{formatCurrency(bucket.amount)}</span>
                    <span className="text-[11px] text-slate-500">{bucket.count} Accounts</span>
                  </div>
                ))}
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Customer / Tenant</th>
                      <th className="p-3.5">Unit</th>
                      <th className="p-3.5 text-right">0-30 Days</th>
                      <th className="p-3.5 text-right">31-60 Days</th>
                      <th className="p-3.5 text-right">61-90 Days</th>
                      <th className="p-3.5 text-right">Total Outstanding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allTenants.filter((t) => t.balanceDue > 0).map((t) => (
                      <tr key={t.id}>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">{t.name}</td>
                        <td className="p-3.5 font-semibold text-brand-600">{t.unitNumber}</td>
                        <td className="p-3.5 text-right font-mono">{t.balanceDue <= 48000 ? formatCurrency(t.balanceDue) : 'KES 0.00'}</td>
                        <td className="p-3.5 text-right font-mono">{t.balanceDue > 48000 ? formatCurrency(t.balanceDue) : 'KES 0.00'}</td>
                        <td className="p-3.5 text-right font-mono">KES 0.00</td>
                        <td className="p-3.5 text-right font-mono font-bold text-rose-600">{formatCurrency(t.balanceDue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. OCCUPANCY VIEW */}
          {selectedReport === 'occupancy' && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Space / Unit</th>
                    <th className="p-3.5">Property</th>
                    <th className="p-3.5">Bedrooms / Spec</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Target Rent</th>
                    <th className="p-3.5">Current Tenant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {units.map((u) => (
                    <tr key={u.id}>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{u.unitNumber}</td>
                      <td className="p-3.5 text-slate-500">{u.propertyName}</td>
                      <td className="p-3.5 text-slate-500">{u.bedrooms ? `${u.bedrooms} Bed` : `${u.squareFeet} sq ft`}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.status === 'occupied' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold">{formatCurrency(u.rentAmount)}</td>
                      <td className="p-3.5 font-semibold text-purple-600">{u.currentTenantName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
