import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  FileText,
  X,
  PlusCircle,
  Trash2,
  Droplets,
  Calculator,
  CheckCircle2,
  Building2,
  DollarSign
} from 'lucide-react';
import { InvoiceItem } from '../types';
import { numberToKenyanShillings } from '../utils/numberToWords';

interface AddSalesInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSalesInvoiceModal: React.FC<AddSalesInvoiceModalProps> = ({ isOpen, onClose }) => {
  const { allTenants, properties, createSalesInvoice, formatCurrency } = useTenant();

  const [selectedTenantId, setSelectedTenantId] = useState(allTenants[0]?.id || '');
  const [invoiceMonth, setInvoiceMonth] = useState('September 2026');
  const [dueDate, setDueDate] = useState('2026-09-05');
  const [remarks, setRemarks] = useState('Monthly residential rent and metered water utility billing');

  // Water Meter Billing States
  const [includeWaterBill, setIncludeWaterBill] = useState(true);
  const [waterBillMode, setWaterBillMode] = useState<'metered' | 'fixed'>('metered');
  const [meterNumber, setMeterNumber] = useState('WM-402');
  const [prevMeterReading, setPrevMeterReading] = useState<number>(142);
  const [currMeterReading, setCurrMeterReading] = useState<number>(158);
  const [waterRatePerUnit, setWaterRatePerUnit] = useState<number>(180);
  const [fixedWaterAmount, setFixedWaterAmount] = useState<number>(3200);

  const currentTenant = allTenants.find((t) => t.id === selectedTenantId) || allTenants[0];

  const unitsConsumed = Math.max(0, currMeterReading - prevMeterReading);
  const calculatedWaterAmount = waterBillMode === 'metered' ? unitsConsumed * waterRatePerUnit : fixedWaterAmount;

  // ERPNext Item Rows
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'itm-rent',
      itemCode: 'RENT-RESIDENTIAL',
      itemName: 'Residential Apartment Lease Rent',
      description: `Apartment lease rent for ${allTenants[0]?.unitNumber || 'Unit 4B'} - September 2026`,
      qty: 1,
      rate: allTenants[0]?.rentAmount || 48000,
      amount: allTenants[0]?.rentAmount || 48000,
      incomeAccount: '4110 - Rental Income - Emerald Heights',
      costCenter: 'Emerald Heights - Operations'
    },
    {
      id: 'itm-water',
      itemCode: 'UTILITY-WATER',
      itemName: 'Water Consumption Utility',
      description: `Meter #WM-402: Prev 142 m³ - Curr 158 m³ = 16 m³ consumed @ KES 180/m³`,
      meterPrevious: 142,
      meterCurrent: 158,
      meterUnits: 16,
      qty: 16,
      rate: 180,
      amount: 2880,
      incomeAccount: '4120 - Water Utility Reimbursement',
      costCenter: 'Emerald Heights - Operations'
    },
    {
      id: 'itm-service',
      itemCode: 'UTILITY-SERVICE',
      itemName: 'Estate Service Charge',
      description: '24/7 Security guard patrol, borehole water pump & compound hygiene',
      qty: 1,
      rate: 5000,
      amount: 5000,
      incomeAccount: '4130 - Estate Service Charge',
      costCenter: 'Emerald Heights - Operations'
    }
  ]);

  if (!isOpen) return null;

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    const chosen = allTenants.find((t) => t.id === tenantId);
    if (chosen) {
      const newItems: InvoiceItem[] = [
        {
          id: 'itm-rent',
          itemCode: 'RENT-RESIDENTIAL',
          itemName: `Residential Lease Rent (${chosen.unitNumber})`,
          description: `Apartment lease rent for ${chosen.unitNumber} - ${invoiceMonth}`,
          qty: 1,
          rate: chosen.rentAmount,
          amount: chosen.rentAmount,
          incomeAccount: '4110 - Rental Income - Emerald Heights',
          costCenter: 'Emerald Heights - Operations'
        }
      ];

      if (includeWaterBill) {
        newItems.push({
          id: 'itm-water',
          itemCode: 'UTILITY-WATER',
          itemName: 'Water Utility Consumption',
          description:
            waterBillMode === 'metered'
              ? `Meter #${meterNumber}: Prev ${prevMeterReading} m³ - Curr ${currMeterReading} m³ = ${unitsConsumed} m³ @ KES ${waterRatePerUnit}/m³`
              : `Fixed water supply charge for ${chosen.unitNumber}`,
          meterPrevious: waterBillMode === 'metered' ? prevMeterReading : undefined,
          meterCurrent: waterBillMode === 'metered' ? currMeterReading : undefined,
          meterUnits: waterBillMode === 'metered' ? unitsConsumed : undefined,
          qty: waterBillMode === 'metered' ? unitsConsumed : 1,
          rate: waterBillMode === 'metered' ? waterRatePerUnit : fixedWaterAmount,
          amount: calculatedWaterAmount,
          incomeAccount: '4120 - Water Utility Reimbursement',
          costCenter: 'Emerald Heights - Operations'
        });
      }

      newItems.push({
        id: 'itm-service',
        itemCode: 'UTILITY-SERVICE',
        itemName: 'Estate Service Charge',
        description: '24/7 Security, borehole pump & compound maintenance',
        qty: 1,
        rate: 5000,
        amount: 5000,
        incomeAccount: '4130 - Estate Service Charge',
        costCenter: 'Emerald Heights - Operations'
      });

      setItems(newItems);
    }
  };

  const handleApplyWaterBill = () => {
    const waterDesc =
      waterBillMode === 'metered'
        ? `Water Consumption [Meter #${meterNumber}: Prev ${prevMeterReading} m³ - Curr ${currMeterReading} m³ = ${unitsConsumed} m³ @ KES ${waterRatePerUnit}/m³]`
        : `Fixed monthly water charge for ${currentTenant.unitNumber}`;

    const waterRow: InvoiceItem = {
      id: 'itm-water',
      itemCode: 'UTILITY-WATER',
      itemName: 'Water Utility Consumption',
      description: waterDesc,
      meterPrevious: waterBillMode === 'metered' ? prevMeterReading : undefined,
      meterCurrent: waterBillMode === 'metered' ? currMeterReading : undefined,
      meterUnits: waterBillMode === 'metered' ? unitsConsumed : undefined,
      qty: waterBillMode === 'metered' ? unitsConsumed : 1,
      rate: waterBillMode === 'metered' ? waterRatePerUnit : fixedWaterAmount,
      amount: calculatedWaterAmount,
      incomeAccount: '4120 - Water Utility Reimbursement',
      costCenter: 'Emerald Heights - Operations'
    };

    setItems((prev) => {
      const filtered = prev.filter((i) => i.itemCode !== 'UTILITY-WATER');
      return [prev[0], waterRow, ...filtered.slice(1)];
    });
  };

  const addItemRow = () => {
    const newItem: InvoiceItem = {
      id: 'itm-' + Date.now(),
      itemCode: 'UTILITY-OTHER',
      itemName: 'Electricity Token / Penalty',
      description: 'Electricity sub-meter or late payment surcharge',
      qty: 1,
      rate: 2500,
      amount: 2500,
      incomeAccount: '4140 - Sundry Utility Reimbursement',
      costCenter: 'Emerald Heights - Operations'
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setItems((prev) =>
      prev.map((itm) => {
        if (itm.id === id) {
          const updated = { ...itm, [field]: val };
          if (field === 'qty' || field === 'rate') {
            updated.amount = Number(updated.qty || 0) * Number(updated.rate || 0);
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

  const netTotal = items.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const taxAmount = 0; // Residential Rent & Utilities are exempt in Kenya VAT Act
  const grandTotal = netTotal + taxAmount;
  const inWords = numberToKenyanShillings(grandTotal);

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
      remarks: remarks || `Monthly rent & metered water billing for ${invoiceMonth}`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[94vh] overflow-y-auto font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ERPNext DocType Title Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  New Sales Invoice
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Draft
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ERPNext Series: <strong className="font-mono text-slate-700 dark:text-slate-300">ACC-SINV-2026-####</strong>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* 1. Customer & Property Autofetch Block */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-750 space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>1. Customer & Property Info (Autofetch Enabled)</span>
              <span className="text-[11px] text-emerald-600 font-semibold">✓ Linked to ERPNext Customer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Select Tenant (Customer) *
                </label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => handleTenantSelect(e.target.value)}
                  className="w-full bg-white dark:bg-dark-900 border border-emerald-300 dark:border-emerald-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  {allTenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      👤 {t.name} — {t.unitNumber} ({t.propertyName}) • Rent: KES {t.rentAmount.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Billing Cycle
                </label>
                <input
                  type="text"
                  value={invoiceMonth}
                  onChange={(e) => setInvoiceMonth(e.target.value)}
                  className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-750 text-[11px] text-slate-600 dark:text-slate-400">
              <div>Estate: <strong className="text-slate-900 dark:text-white">{currentTenant.propertyName}</strong></div>
              <div>Assigned Unit: <strong className="text-brand-600 dark:text-brand-400 font-bold">{currentTenant.unitNumber}</strong></div>
              <div>Contact Phone: <strong className="font-mono text-slate-900 dark:text-white">{currentTenant.phone}</strong></div>
            </div>
          </div>

          {/* 2. DEDICATED WATER BILLING MODULE */}
          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-600 animate-bounce" />
                <span className="font-bold text-cyan-900 dark:text-cyan-200">
                  2. Water Utility Billing (Add to Rent Invoice)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-cyan-800 dark:text-cyan-300">
                  <input
                    type="radio"
                    name="waterMode"
                    checked={waterBillMode === 'metered'}
                    onChange={() => setWaterBillMode('metered')}
                    className="text-cyan-600"
                  />
                  <span>Metered Water Reading</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-cyan-800 dark:text-cyan-300">
                  <input
                    type="radio"
                    name="waterMode"
                    checked={waterBillMode === 'fixed'}
                    onChange={() => setWaterBillMode('fixed')}
                    className="text-cyan-600"
                  />
                  <span>Fixed Water Surcharge</span>
                </label>
              </div>
            </div>

            {waterBillMode === 'metered' ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Meter Number
                  </label>
                  <input
                    type="text"
                    value={meterNumber}
                    onChange={(e) => setMeterNumber(e.target.value)}
                    className="w-full bg-white dark:bg-dark-900 border border-cyan-300 dark:border-cyan-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Previous (m³)
                  </label>
                  <input
                    type="number"
                    value={prevMeterReading}
                    onChange={(e) => setPrevMeterReading(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-cyan-300 dark:border-cyan-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Current (m³)
                  </label>
                  <input
                    type="number"
                    value={currMeterReading}
                    onChange={(e) => setCurrMeterReading(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-cyan-300 dark:border-cyan-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Rate (KES/m³)
                  </label>
                  <input
                    type="number"
                    value={waterRatePerUnit}
                    onChange={(e) => setWaterRatePerUnit(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-cyan-300 dark:border-cyan-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-right"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <button
                    type="button"
                    onClick={handleApplyWaterBill}
                    className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1 transition"
                  >
                    <span>Apply {formatCurrency(calculatedWaterAmount)}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Fixed Water Amount (KES)
                  </label>
                  <input
                    type="number"
                    value={fixedWaterAmount}
                    onChange={(e) => setFixedWaterAmount(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-cyan-300 dark:border-cyan-700 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyWaterBill}
                  className="py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition"
                >
                  Apply Fixed Water Charge ({formatCurrency(fixedWaterAmount)})
                </button>
              </div>
            )}
          </div>

          {/* 3. ERPNext Standard Items Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">
                3. Invoice Line Items Table (ERPNext DocType Standard)
              </span>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Add Item Row</span>
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 w-10">#</th>
                    <th className="p-3">Item Code & Description</th>
                    <th className="p-3 w-20 text-center">Qty / m³</th>
                    <th className="p-3 w-28 text-right">Rate (KES)</th>
                    <th className="p-3 w-32 text-right">Amount (KES)</th>
                    <th className="p-3 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-dark-900">
                  {items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3 space-y-1">
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                          className="w-full font-bold text-slate-900 dark:text-white bg-transparent border-0 p-0 focus:ring-0 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Item Description & Notes"
                          value={item.description || ''}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full text-[11px] text-slate-500 bg-transparent border-0 p-0 focus:ring-0 italic"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                          className="w-full text-center font-bold bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                          className="w-full text-right font-mono font-bold bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs"
                        />
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. ERPNext Totals & In Words Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900 text-white">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Amount in Words (ERPNext Standard)
              </span>
              <p className="text-xs font-semibold text-emerald-300 leading-relaxed italic">
                "{inWords}"
              </p>
              <div className="pt-2 text-[10px] text-slate-400">
                GL Accounts: <strong>Debit Debtors / Credit 4110 Rental Income & 4120 Water</strong>
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Net Total:</span>
                <span className="font-mono text-white">{formatCurrency(netTotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>VAT (Exempt 0%):</span>
                <span className="font-mono text-white">KES 0.00</span>
              </div>
              <div className="flex justify-between text-base font-bold text-emerald-400 pt-1 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="font-mono text-xl">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
          >
            <FileText className="w-5 h-5" />
            <span>Submit & Issue ERPNext Sales Invoice ({formatCurrency(grandTotal)})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
