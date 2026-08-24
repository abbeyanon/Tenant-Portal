import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { FileText, X, PlusCircle, Trash2, DollarSign, Calculator, Send } from 'lucide-react';
import { InvoiceItem } from '../types';

interface AddSalesInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSalesInvoiceModal: React.FC<AddSalesInvoiceModalProps> = ({ isOpen, onClose }) => {
  const { allTenants, properties, createSalesInvoice, formatCurrency } = useTenant();

  const [selectedTenantId, setSelectedTenantId] = useState(allTenants[0]?.id || '');
  const [invoiceMonth, setInvoiceMonth] = useState('September 2026');
  const [dueDate, setDueDate] = useState('2026-09-05');
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'itm-1',
      itemCode: 'RENT-RESIDENTIAL',
      itemName: 'Monthly Residential Apartment Rent',
      qty: 1,
      rate: allTenants[0]?.rentAmount || 48000,
      amount: allTenants[0]?.rentAmount || 48000
    },
    {
      id: 'itm-2',
      itemCode: 'SERVICE-CHARGE',
      itemName: 'Estate Service Charge & Security',
      qty: 1,
      rate: 5000,
      amount: 5000
    }
  ]);
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const currentTenant = allTenants.find((t) => t.id === selectedTenantId) || allTenants[0];

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    const chosen = allTenants.find((t) => t.id === tenantId);
    if (chosen) {
      setItems([
        {
          id: 'itm-1',
          itemCode: 'RENT-RESIDENTIAL',
          itemName: `Monthly Rent (${chosen.unitNumber})`,
          qty: 1,
          rate: chosen.rentAmount,
          amount: chosen.rentAmount
        },
        {
          id: 'itm-2',
          itemCode: 'SERVICE-CHARGE',
          itemName: 'Estate Service Charge & Amenities',
          qty: 1,
          rate: 5000,
          amount: 5000
        }
      ]);
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: 'itm-' + Date.now(),
      itemCode: 'UTILITY-WATER',
      itemName: 'Water Meter Utility Reading',
      qty: 1,
      rate: 3200,
      amount: 3200
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setItems((prev) =>
      prev.map((itm) => {
        if (itm.id === id) {
          const updated = { ...itm, [field]: val };
          if (field === 'qty' || field === 'rate') {
            updated.amount = Number(updated.qty) * Number(updated.rate);
          }
          return updated;
        }
        return itm;
      })
    );
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((itm) => itm.id !== id));
  };

  const grandTotal = items.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || grandTotal <= 0) return;

    createSalesInvoice({
      customerName: currentTenant.name,
      tenantPhone: currentTenant.phone,
      unitNumber: currentTenant.unitNumber,
      propertyId: currentTenant.propertyId,
      propertyName: currentTenant.propertyName,
      grandTotal,
      dueDate,
      items,
      remarks: remarks || `Monthly Billing for ${invoiceMonth}`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create ERPNext Sales Invoice</h3>
            <p className="text-xs text-slate-500">Bill a tenant with autofetched rate schedule & post to Accounts Receivable</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Tenant Autofetch Selection */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <label className="block font-bold text-emerald-900 dark:text-emerald-300">
              1. Select Resident Tenant (Autofetches Unit & Rates) *
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => handleTenantSelect(e.target.value)}
              className="w-full bg-white dark:bg-dark-900 border border-emerald-300 dark:border-emerald-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {allTenants.map((t) => (
                <option key={t.id} value={t.id}>
                  👤 {t.name} — {t.unitNumber} ({t.propertyName}) • Rent: KES {t.rentAmount.toLocaleString()}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 text-slate-600 dark:text-slate-400">
              <div>Unit: <strong className="text-slate-900 dark:text-white">{currentTenant.unitNumber}</strong></div>
              <div>Estate: <strong className="text-slate-900 dark:text-white truncate block">{currentTenant.propertyName}</strong></div>
              <div>Phone: <strong className="text-slate-900 dark:text-white font-mono">{currentTenant.phone}</strong></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Billing Cycle / Month</label>
              <input
                type="text"
                value={invoiceMonth}
                onChange={(e) => setInvoiceMonth(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Invoice Payment Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                2. Itemized Billing Breakdown
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Add Item Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 items-center"
                >
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Item Description"
                      value={item.itemName}
                      onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                      className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                      className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center font-bold"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                      className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-right font-mono font-bold"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400 block">Total Invoice Amount:</span>
              <span className="text-2xl font-display font-extrabold text-emerald-400">
                {formatCurrency(grandTotal)}
              </span>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <span>GL Posting: Debit Debtors / Credit 4110 Rental Income</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-2 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Submit & Issue ERPNext Sales Invoice</span>
          </button>
        </form>
      </div>
    </div>
  );
};
