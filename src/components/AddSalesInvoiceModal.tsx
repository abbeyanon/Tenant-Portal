import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  FileText,
  X,
  PlusCircle,
  Trash2,
  Droplets,
  Zap,
  Calculator,
  CheckCircle2,
  Building2,
  DollarSign,
  Briefcase
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
  const [remarks, setRemarks] = useState('Monthly lease rent, metered water & electricity utility billing');

  // Water Meter Billing States
  const [includeWaterBill, setIncludeWaterBill] = useState(true);
  const [waterBillMode, setWaterBillMode] = useState<'metered' | 'fixed'>('metered');
  const [waterMeterNumber, setWaterMeterNumber] = useState('WM-402');
  const [prevWaterReading, setPrevWaterReading] = useState<number>(142);
  const [currWaterReading, setCurrWaterReading] = useState<number>(158);
  const [waterRatePerUnit, setWaterRatePerUnit] = useState<number>(180);
  const [fixedWaterAmount, setFixedWaterAmount] = useState<number>(3200);

  // Electricity Meter Billing States
  const [includeElectricityBill, setIncludeElectricityBill] = useState(true);
  const [electricityBillMode, setElectricityBillMode] = useState<'metered' | 'fixed'>('metered');
  const [electricityMeterNumber, setElectricityMeterNumber] = useState('EM-402');
  const [prevElectricityReading, setPrevElectricityReading] = useState<number>(325);
  const [currElectricityReading, setCurrElectricityReading] = useState<number>(410);
  const [electricityRatePerKwh, setElectricityRatePerKwh] = useState<number>(28.5);
  const [fixedElectricityAmount, setFixedElectricityAmount] = useState<number>(3500);

  // Commercial VAT State
  const [includeVat, setIncludeVat] = useState(false);

  const currentTenant = allTenants.find((t) => t.id === selectedTenantId) || allTenants[0];

  const waterUnitsConsumed = Math.max(0, currWaterReading - prevWaterReading);
  const calculatedWaterAmount = waterBillMode === 'metered' ? waterUnitsConsumed * waterRatePerUnit : fixedWaterAmount;

  const electricityKwhConsumed = Math.max(0, currElectricityReading - prevElectricityReading);
  const calculatedElectricityAmount =
    electricityBillMode === 'metered' ? electricityKwhConsumed * electricityRatePerKwh : fixedElectricityAmount;

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
      description: `Meter #WM-402: Prev 142 m³ - Curr 158 m³ = 16 m³ @ KES 180/m³`,
      meterType: 'water',
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
      id: 'itm-electricity',
      itemCode: 'UTILITY-ELECTRICITY',
      itemName: 'Electricity Power Consumption (KPLC Sub-Meter)',
      description: `Sub-Meter #EM-402: Prev 325 kWh - Curr 410 kWh = 85 kWh @ KES 28.50/kWh`,
      meterType: 'electricity',
      meterPrevious: 325,
      meterCurrent: 410,
      meterUnits: 85,
      qty: 85,
      rate: 28.5,
      amount: 2422.5,
      incomeAccount: '4140 - Electricity Utility Reimbursement',
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
      const isCommercial = chosen.unitCategory === 'commercial' || chosen.tenantType === 'corporate';
      setIncludeVat(isCommercial);

      const newItems: InvoiceItem[] = [
        {
          id: 'itm-rent',
          itemCode: isCommercial ? 'RENT-COMMERCIAL' : 'RENT-RESIDENTIAL',
          itemName: isCommercial
            ? `Commercial Lease Rent (${chosen.unitNumber} - ${chosen.companyName || chosen.name})`
            : `Residential Lease Rent (${chosen.unitNumber})`,
          description: `${isCommercial ? 'Commercial Space' : 'Apartment'} lease rent for ${chosen.unitNumber} - ${invoiceMonth}`,
          qty: 1,
          rate: chosen.rentAmount,
          amount: chosen.rentAmount,
          incomeAccount: isCommercial ? '4210 - Commercial Lease Revenue' : '4110 - Rental Income - Emerald Heights',
          costCenter: 'Operations & Property Management'
        }
      ];

      if (includeWaterBill) {
        newItems.push({
          id: 'itm-water',
          itemCode: 'UTILITY-WATER',
          itemName: 'Water Utility Consumption',
          description:
            waterBillMode === 'metered'
              ? `Meter #${chosen.waterMeterNumber || waterMeterNumber}: Prev ${prevWaterReading} m³ - Curr ${currWaterReading} m³ = ${waterUnitsConsumed} m³ @ KES ${waterRatePerUnit}/m³`
              : `Fixed water supply charge for ${chosen.unitNumber}`,
          meterType: 'water',
          meterPrevious: waterBillMode === 'metered' ? prevWaterReading : undefined,
          meterCurrent: waterBillMode === 'metered' ? currWaterReading : undefined,
          meterUnits: waterBillMode === 'metered' ? waterUnitsConsumed : undefined,
          qty: waterBillMode === 'metered' ? waterUnitsConsumed : 1,
          rate: waterBillMode === 'metered' ? waterRatePerUnit : fixedWaterAmount,
          amount: calculatedWaterAmount,
          incomeAccount: '4120 - Water Utility Reimbursement',
          costCenter: 'Operations'
        });
      }

      if (includeElectricityBill) {
        newItems.push({
          id: 'itm-electricity',
          itemCode: 'UTILITY-ELECTRICITY',
          itemName: 'Electricity Power Consumption (KPLC Sub-Meter)',
          description:
            electricityBillMode === 'metered'
              ? `Sub-Meter #${chosen.electricityMeterNumber || electricityMeterNumber}: Prev ${prevElectricityReading} kWh - Curr ${currElectricityReading} kWh = ${electricityKwhConsumed} kWh @ KES ${electricityRatePerKwh}/kWh`
              : `Fixed electricity power allocation for ${chosen.unitNumber}`,
          meterType: 'electricity',
          meterPrevious: electricityBillMode === 'metered' ? prevElectricityReading : undefined,
          meterCurrent: electricityBillMode === 'metered' ? currElectricityReading : undefined,
          meterUnits: electricityBillMode === 'metered' ? electricityKwhConsumed : undefined,
          qty: electricityBillMode === 'metered' ? electricityKwhConsumed : 1,
          rate: electricityBillMode === 'metered' ? electricityRatePerKwh : fixedElectricityAmount,
          amount: calculatedElectricityAmount,
          incomeAccount: '4140 - Electricity Utility Reimbursement',
          costCenter: 'Operations'
        });
      }

      newItems.push({
        id: 'itm-service',
        itemCode: isCommercial ? 'UTILITY-SERVICE-CAM' : 'UTILITY-SERVICE',
        itemName: isCommercial ? 'Common Area Maintenance (CAM) & Security' : 'Estate Service Charge',
        description: isCommercial ? 'Commercial generator backup, lift maintenance & security' : '24/7 Security, borehole pump & hygiene',
        qty: 1,
        rate: isCommercial ? 15000 : 5000,
        amount: isCommercial ? 15000 : 5000,
        incomeAccount: '4130 - Estate Service Charge',
        costCenter: 'Operations'
      });

      setItems(newItems);
    }
  };

  const handleApplyWaterBill = () => {
    const waterDesc =
      waterBillMode === 'metered'
        ? `Water Consumption [Meter #${waterMeterNumber}: Prev ${prevWaterReading} m³ - Curr ${currWaterReading} m³ = ${waterUnitsConsumed} m³ @ KES ${waterRatePerUnit}/m³]`
        : `Fixed monthly water charge for ${currentTenant.unitNumber}`;

    const waterRow: InvoiceItem = {
      id: 'itm-water',
      itemCode: 'UTILITY-WATER',
      itemName: 'Water Utility Consumption',
      description: waterDesc,
      meterType: 'water',
      meterPrevious: waterBillMode === 'metered' ? prevWaterReading : undefined,
      meterCurrent: waterBillMode === 'metered' ? currWaterReading : undefined,
      meterUnits: waterBillMode === 'metered' ? waterUnitsConsumed : undefined,
      qty: waterBillMode === 'metered' ? waterUnitsConsumed : 1,
      rate: waterBillMode === 'metered' ? waterRatePerUnit : fixedWaterAmount,
      amount: calculatedWaterAmount,
      incomeAccount: '4120 - Water Utility Reimbursement',
      costCenter: 'Operations'
    };

    setItems((prev) => {
      const filtered = prev.filter((i) => i.itemCode !== 'UTILITY-WATER');
      return [prev[0], waterRow, ...filtered.slice(1)];
    });
  };

  const handleApplyElectricityBill = () => {
    const elecDesc =
      electricityBillMode === 'metered'
        ? `Electricity Power [Sub-Meter #${electricityMeterNumber}: Prev ${prevElectricityReading} kWh - Curr ${currElectricityReading} kWh = ${electricityKwhConsumed} kWh @ KES ${electricityRatePerKwh}/kWh]`
        : `Fixed electricity power allocation for ${currentTenant.unitNumber}`;

    const elecRow: InvoiceItem = {
      id: 'itm-electricity',
      itemCode: 'UTILITY-ELECTRICITY',
      itemName: 'Electricity Power Consumption (KPLC Sub-Meter)',
      description: elecDesc,
      meterType: 'electricity',
      meterPrevious: electricityBillMode === 'metered' ? prevElectricityReading : undefined,
      meterCurrent: electricityBillMode === 'metered' ? currElectricityReading : undefined,
      meterUnits: electricityBillMode === 'metered' ? electricityKwhConsumed : undefined,
      qty: electricityBillMode === 'metered' ? electricityKwhConsumed : 1,
      rate: electricityBillMode === 'metered' ? electricityRatePerKwh : fixedElectricityAmount,
      amount: calculatedElectricityAmount,
      incomeAccount: '4140 - Electricity Utility Reimbursement',
      costCenter: 'Operations'
    };

    setItems((prev) => {
      const filtered = prev.filter((i) => i.itemCode !== 'UTILITY-ELECTRICITY');
      return [...filtered, elecRow];
    });
  };

  const addItemRow = () => {
    const newItem: InvoiceItem = {
      id: 'itm-' + Date.now(),
      itemCode: 'UTILITY-OTHER',
      itemName: 'Parking Bay / Penalty Surcharge',
      description: 'Reserved parking or late payment administration fee',
      qty: 1,
      rate: 3000,
      amount: 3000,
      incomeAccount: '4150 - Sundry Revenue',
      costCenter: 'Operations'
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
  const taxAmount = includeVat ? Math.round(netTotal * 0.16) : 0;
  const grandTotal = netTotal + taxAmount;
  const inWords = numberToKenyanShillings(grandTotal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || grandTotal <= 0) return;

    createSalesInvoice({
      customerName: currentTenant.companyName ? `${currentTenant.companyName} (${currentTenant.name})` : currentTenant.name,
      customerType: currentTenant.tenantType || 'individual',
      customerPin: currentTenant.companyPin,
      tenantPhone: currentTenant.phone,
      unitNumber: currentTenant.unitNumber,
      unitCategory: currentTenant.unitCategory || 'residential',
      propertyId: currentTenant.propertyId,
      propertyName: currentTenant.propertyName,
      netTotal,
      taxAmount,
      grandTotal,
      dueDate,
      items,
      remarks: remarks || `Monthly billing for ${invoiceMonth} (${currentTenant.propertyName})`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[94vh] overflow-y-auto font-sans">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  New Sales Invoice (ERPNext DocType)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Draft
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Residential & Commercial Tax Invoice with Water & Electricity Power Utility Billing
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* 1. Customer & Property Autofetch Block */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-750 space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>1. Customer & Property Selection</span>
              <span className="text-[11px] text-emerald-600 font-semibold">✓ Autofetch Enabled</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Select Tenant (Residential or Commercial Client) *
                </label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => handleTenantSelect(e.target.value)}
                  className="w-full bg-white dark:bg-dark-900 border border-emerald-300 dark:border-emerald-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  {allTenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.unitCategory === 'commercial' ? '🏢 [COMMERCIAL]' : '🏠 [RESIDENTIAL]'} {t.companyName || t.name} — {t.unitNumber} ({t.propertyName}) • Rent: KES {t.rentAmount.toLocaleString()}
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
              <div>Asset: <strong className="text-slate-900 dark:text-white">{currentTenant.propertyName}</strong></div>
              <div>Space / Unit: <strong className="text-brand-600 dark:text-brand-400 font-bold">{currentTenant.unitNumber}</strong></div>
              <div>Tenant Type: <strong className="uppercase font-bold text-slate-900 dark:text-white">{currentTenant.unitCategory || 'Residential'}</strong></div>
            </div>
          </div>

          {/* 2. DEDICATED WATER UTILITY MODULE */}
          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <span className="font-bold text-cyan-900 dark:text-cyan-200">
                  2. Water Utility Billing (Add to Invoice)
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
                  <span>Metered Water Reading (m³)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-cyan-800 dark:text-cyan-300">
                  <input
                    type="radio"
                    name="waterMode"
                    checked={waterBillMode === 'fixed'}
                    onChange={() => setWaterBillMode('fixed')}
                    className="text-cyan-600"
                  />
                  <span>Fixed Water Charge</span>
                </label>
              </div>
            </div>

            {waterBillMode === 'metered' ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Water Meter No.
                  </label>
                  <input
                    type="text"
                    value={waterMeterNumber}
                    onChange={(e) => setWaterMeterNumber(e.target.value)}
                    className="w-full bg-white dark:bg-dark-900 border border-cyan-300 dark:border-cyan-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Prev (m³)
                  </label>
                  <input
                    type="number"
                    value={prevWaterReading}
                    onChange={(e) => setPrevWaterReading(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-cyan-300 dark:border-cyan-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Curr (m³)
                  </label>
                  <input
                    type="number"
                    value={currWaterReading}
                    onChange={(e) => setCurrWaterReading(Number(e.target.value))}
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
                    Fixed Monthly Water Charge (KES)
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

          {/* 3. DEDICATED ELECTRICITY POWER UTILITY MODULE */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  3. Electricity Power Utility Billing (KPLC Sub-Meter / Power Allocation)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-amber-800 dark:text-amber-300">
                  <input
                    type="radio"
                    name="elecMode"
                    checked={electricityBillMode === 'metered'}
                    onChange={() => setElectricityBillMode('metered')}
                    className="text-amber-600"
                  />
                  <span>Metered Power Reading (kWh)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-amber-800 dark:text-amber-300">
                  <input
                    type="radio"
                    name="elecMode"
                    checked={electricityBillMode === 'fixed'}
                    onChange={() => setElectricityBillMode('fixed')}
                    className="text-amber-600"
                  />
                  <span>Fixed Electricity Surcharge</span>
                </label>
              </div>
            </div>

            {electricityBillMode === 'metered' ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Power Meter No.
                  </label>
                  <input
                    type="text"
                    value={electricityMeterNumber}
                    onChange={(e) => setElectricityMeterNumber(e.target.value)}
                    className="w-full bg-white dark:bg-dark-900 border border-amber-300 dark:border-amber-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Prev (kWh)
                  </label>
                  <input
                    type="number"
                    value={prevElectricityReading}
                    onChange={(e) => setPrevElectricityReading(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-amber-300 dark:border-amber-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Curr (kWh)
                  </label>
                  <input
                    type="number"
                    value={currElectricityReading}
                    onChange={(e) => setCurrElectricityReading(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-amber-300 dark:border-amber-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Rate (KES/kWh)
                  </label>
                  <input
                    type="number"
                    value={electricityRatePerKwh}
                    onChange={(e) => setElectricityRatePerKwh(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-amber-300 dark:border-amber-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-right"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <button
                    type="button"
                    onClick={handleApplyElectricityBill}
                    className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1 transition"
                  >
                    <span>Apply {formatCurrency(calculatedElectricityAmount)}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Fixed Electricity Amount (KES)
                  </label>
                  <input
                    type="number"
                    value={fixedElectricityAmount}
                    onChange={(e) => setFixedElectricityAmount(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-amber-300 dark:border-amber-700 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyElectricityBill}
                  className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
                >
                  Apply Fixed Power Charge ({formatCurrency(fixedElectricityAmount)})
                </button>
              </div>
            )}
          </div>

          {/* 4. ERPNext Standard Items Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">
                4. ERPNext Standard Line Items Table
              </span>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Add Line Item</span>
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 w-10">#</th>
                    <th className="p-3">Item Code & Description</th>
                    <th className="p-3 w-24 text-center">Qty / Units</th>
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

          {/* 5. ERPNext Totals & In Words Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900 text-white">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Amount in Words (ERPNext Standard)
              </span>
              <p className="text-xs font-semibold text-emerald-300 leading-relaxed italic">
                "{inWords}"
              </p>
              <div className="pt-2 text-[10px] text-slate-400">
                GL Accounts: <strong>Debit Debtors / Credit Revenue Accounts (4110 / 4120 / 4140)</strong>
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Net Total:</span>
                <span className="font-mono text-white">{formatCurrency(netTotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 items-center">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeVat}
                    onChange={(e) => setIncludeVat(e.target.checked)}
                    className="rounded text-purple-600 w-3 h-3"
                  />
                  <span>16% VAT (Commercial):</span>
                </label>
                <span className="font-mono text-white">{formatCurrency(taxAmount)}</span>
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
