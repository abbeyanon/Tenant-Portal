import React from 'react';
import { useTenant } from '../context/TenantContext';
import { Printer, Share2, X, Download, Building2, CheckCircle2, ShieldCheck, QrCode, Zap, Droplets } from 'lucide-react';
import { SalesInvoice } from '../types';
import { numberToKenyanShillings } from '../utils/numberToWords';

interface ERPNextInvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: SalesInvoice | null;
}

export const ERPNextInvoiceViewModal: React.FC<ERPNextInvoiceViewModalProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  const { formatCurrency, openShareModal } = useTenant();

  if (!isOpen || !invoice) return null;

  const inWords = invoice.inWords || numberToKenyanShillings(invoice.grandTotal);
  const isCommercial = invoice.unitCategory === 'commercial' || invoice.customerType === 'corporate';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative max-h-[94vh] overflow-y-auto font-sans text-slate-900 dark:text-slate-100">
        {/* Floating Action Buttons */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              ERPNext Standard Print Format
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400">
              {isCommercial ? 'Commercial Tax Invoice' : 'Residential Lease Invoice'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openShareModal(invoice, 'invoice')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share to Client</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:opacity-90"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OFFICIAL ERPNEXT TAX INVOICE PRINT LAYOUT */}
        {/* ========================================================================= */}
        <div className="space-y-6 print:p-0">
          {/* Letterhead Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-900 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">
                {invoice.propertyName || 'EMERALD HEIGHTS PROPERTY MANAGEMENT LTD'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                P.O. Box 48291 - 00100, Nairobi, Kenya
              </p>
              <p className="text-xs text-slate-500">
                KRA PIN: <strong className="text-slate-800 dark:text-slate-200 font-mono">P051982734Z</strong> • Hotline: +254 759 508 348
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xl font-display font-black text-emerald-600 block tracking-tight uppercase">
                TAX INVOICE
              </span>
              <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                {invoice.invoiceNumber}
              </span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 ${
                invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* 2-Column Metadata Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Billed To (Client / Customer):</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{invoice.customerName}</p>
              {invoice.customerPin && (
                <p className="text-slate-600 dark:text-slate-400">Client PIN: <strong className="font-mono">{invoice.customerPin}</strong></p>
              )}
              <p className="text-slate-600 dark:text-slate-400">Space / Unit: <strong className="text-brand-600 font-bold">{invoice.unitNumber}</strong></p>
              <p className="text-slate-600 dark:text-slate-400 font-mono">Phone: {invoice.tenantPhone || '+254 712 345 678'}</p>
              <p className="text-slate-600 dark:text-slate-400">{invoice.propertyName}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Invoice Details:</span>
              <div className="flex justify-between"><span className="text-slate-500">Posting Date:</span><strong className="text-slate-900 dark:text-white font-mono">{invoice.postingDate}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Due Date:</span><strong className="text-rose-600 font-mono font-bold">{invoice.dueDate}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Payment Terms:</span><strong className="text-slate-900 dark:text-white">Net 5 Days</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Currency:</span><strong className="text-slate-900 dark:text-white">KES (Kenyan Shillings)</strong></div>
            </div>
          </div>

          {/* ERPNext Items Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5 w-10">#</th>
                  <th className="p-3.5">Item Code & Description</th>
                  <th className="p-3.5 w-20 text-center">Qty / Units</th>
                  <th className="p-3.5 w-28 text-right">Rate (KES)</th>
                  <th className="p-3.5 w-32 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="p-3.5 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block">{item.itemName}</span>
                        {item.description && (
                          <span className="text-[11px] text-slate-500 block leading-relaxed italic">{item.description}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center font-bold">{item.qty}</td>
                      <td className="p-3.5 text-right font-mono">{formatCurrency(item.rate)}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3.5 text-slate-400 font-bold">1</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 dark:text-white block">Monthly Rent</span>
                      <span className="text-[11px] text-slate-500 italic">Lease rent billing for {invoice.unitNumber}</span>
                    </td>
                    <td className="p-3.5 text-center font-bold">1</td>
                    <td className="p-3.5 text-right font-mono">{formatCurrency(invoice.grandTotal)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(invoice.grandTotal)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & In Words */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                Total Amount in Words:
              </span>
              <p className="text-xs font-semibold text-slate-900 dark:text-white italic leading-relaxed">
                "{inWords}"
              </p>
            </div>

            <div className="space-y-1 text-right text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Net Subtotal:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(invoice.netTotal || invoice.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>VAT (16% or Exempt 0%):</span>
                <span className="font-mono text-slate-900 dark:text-white">{formatCurrency(invoice.taxAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-emerald-600 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                <span>Grand Total Due:</span>
                <span className="font-mono text-lg">{formatCurrency(invoice.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment & Banking Instructions (M-Pesa Paybill / Till) */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
              Official M-Pesa & Bank Remittance Instructions:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
              <div className="p-2.5 rounded-xl bg-white dark:bg-dark-900 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Option 1: Safaricom M-Pesa</span>
                <p>Paybill: <strong className="font-mono font-bold text-emerald-600">892400</strong></p>
                <p>Account No: <strong className="font-mono font-bold text-slate-900 dark:text-white">{invoice.unitNumber}</strong></p>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-dark-900 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Option 2: Direct Bank EFT</span>
                <p>Bank: <strong className="font-bold">KCB Bank Kenya Ltd</strong></p>
                <p>Acc No: <strong className="font-mono font-bold">1204928192</strong> (Prestige Plaza)</p>
              </div>
            </div>
          </div>

          {/* ERPNext Digital Sign-off & Verification */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end text-xs text-slate-500">
            <div className="space-y-1">
              <p>Prepared electronically by <strong className="text-slate-800 dark:text-slate-200">ERPNext Accounts Module</strong>.</p>
              <p className="text-[10px] text-slate-400">Timestamp: {invoice.postingDate} • Document Hash: #{invoice.id}</p>
            </div>

            <div className="text-right">
              <div className="h-10 border-b border-dashed border-slate-400 w-44 mb-1" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                Authorized Signatory
              </span>
              <span className="text-[10px] text-slate-400">Emerald Heights Management Ltd</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
