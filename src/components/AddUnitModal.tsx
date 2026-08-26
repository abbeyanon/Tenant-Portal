import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { Building2, X, PlusCircle, Home, Briefcase, Zap, Droplets, Percent } from 'lucide-react';
import { Unit } from '../types';

export const AddUnitModal: React.FC = () => {
  const { isAddUnitModalOpen, setIsAddUnitModalOpen, properties, addUnit } = useTenant();

  const [propertyId, setPropertyId] = useState(properties[0]?.id || 'prop-1');
  const [unitCategory, setUnitCategory] = useState<Unit['unitCategory']>('residential');
  const [spaceType, setSpaceType] = useState<Unit['spaceType']>('Apartment');
  const [unitNumber, setUnitNumber] = useState('');
  const [floor, setFloor] = useState<number>(1);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [squareFeet, setSquareFeet] = useState<number>(1150);
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(120);
  const [serviceCharge, setServiceCharge] = useState<number>(15000);
  const [vatApplicable, setVatApplicable] = useState<boolean>(false);
  const [rentAmount, setRentAmount] = useState<number>(48000);
  const [depositAmount, setDepositAmount] = useState<number>(48000);
  const [status, setStatus] = useState<Unit['status']>('vacant');
  const [waterMeterNumber, setWaterMeterNumber] = useState('');
  const [electricityMeterNumber, setElectricityMeterNumber] = useState('');

  const selectedProp = properties.find((p) => p.id === propertyId) || properties[0];

  useEffect(() => {
    if (selectedProp) {
      if (selectedProp.propertyCategory === 'commercial') {
        setUnitCategory('commercial');
        setSpaceType('Office Suite');
        setVatApplicable(true);
      } else {
        setUnitCategory('residential');
        setSpaceType('Apartment');
        setVatApplicable(false);
      }
    }
  }, [propertyId]);

  // Auto calculate commercial rent from sq ft and rate
  useEffect(() => {
    if (unitCategory === 'commercial' && squareFeet && ratePerSqFt) {
      const calculated = squareFeet * ratePerSqFt;
      setRentAmount(calculated);
      setDepositAmount(calculated * 2);
    }
  }, [unitCategory, squareFeet, ratePerSqFt]);

  if (!isAddUnitModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber) return;

    addUnit({
      unitNumber,
      propertyId: selectedProp?.id || 'prop-1',
      propertyName: selectedProp?.name || 'Emerald Heights Luxury Residences',
      unitCategory,
      spaceType,
      floor,
      bedrooms: unitCategory === 'residential' ? bedrooms : undefined,
      bathrooms: unitCategory === 'residential' ? bathrooms : undefined,
      squareFeet,
      ratePerSqFt: unitCategory === 'commercial' ? ratePerSqFt : undefined,
      serviceCharge: unitCategory === 'commercial' ? serviceCharge : undefined,
      vatApplicable: unitCategory === 'commercial' ? vatApplicable : false,
      rentAmount,
      depositAmount,
      status,
      waterMeterNumber: waterMeterNumber || `WM-${unitNumber.replace(/\D/g, '') || '101'}`,
      electricityMeterNumber: electricityMeterNumber || `KPLC-${unitNumber.replace(/\s+/g, '-')}`
    });

    setIsAddUnitModalOpen(false);
    setUnitNumber('');
    setFloor(1);
    setBedrooms(2);
    setBathrooms(2);
    setSquareFeet(1150);
    setWaterMeterNumber('');
    setElectricityMeterNumber('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsAddUnitModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Leasable Unit / Commercial Space</h3>
            <p className="text-xs text-slate-500">Configure residential apartments or commercial retail shops & offices</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Link to Property */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
              Link to Property / Commercial Building *
            </label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  🏢 {p.name} ({p.propertyType || p.propertyCategory?.toUpperCase()}) - {p.location}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Category Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setUnitCategory('residential');
                setSpaceType('Apartment');
              }}
              className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                unitCategory === 'residential'
                  ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-600 text-brand-700 dark:text-brand-300'
                  : 'bg-slate-50 dark:bg-dark-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Residential Unit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUnitCategory('commercial');
                setSpaceType('Office Suite');
                setVatApplicable(true);
              }}
              className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                unitCategory === 'commercial'
                  ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-600 text-purple-700 dark:text-purple-300'
                  : 'bg-slate-50 dark:bg-dark-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Commercial Space</span>
            </button>
          </div>

          {/* Unit Number & Space Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                {unitCategory === 'commercial' ? 'Shop / Suite / Bay Number *' : 'Unit / Apartment Number *'}
              </label>
              <input
                type="text"
                required
                placeholder={unitCategory === 'commercial' ? "e.g. Shop G-04, Suite 501" : "e.g. Unit 4B, Apt 102"}
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Space Type</label>
              <select
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold"
              >
                {unitCategory === 'commercial' ? (
                  <>
                    <option value="Office Suite">Office Suite</option>
                    <option value="Retail Shop">Retail Shop</option>
                    <option value="Kiosk">Commercial Kiosk / Stall</option>
                    <option value="Warehouse / Godown">Warehouse / Storage Godown</option>
                    <option value="Restaurant / Food Court">Restaurant / Food Court Space</option>
                    <option value="Showroom">Automotive / Retail Showroom</option>
                    <option value="Banking Hall">Banking Hall / Agency</option>
                  </>
                ) : (
                  <>
                    <option value="Apartment">Residential Apartment</option>
                    <option value="Studio">Studio Apartment</option>
                    <option value="Executive Suite">Executive Penthouse Suite</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Area & Rates */}
          {unitCategory === 'commercial' ? (
            <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-3">
              <span className="font-bold text-purple-900 dark:text-purple-200 block text-[11px]">
                🏢 Commercial Area & Rate Calculation
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">Area (Sq Ft)</label>
                  <input
                    type="number"
                    value={squareFeet}
                    onChange={(e) => setSquareFeet(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">Rate / Sq Ft (KES)</label>
                  <input
                    type="number"
                    value={ratePerSqFt}
                    onChange={(e) => setRatePerSqFt(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-600 dark:text-slate-400">Monthly CAM (KES)</label>
                  <input
                    type="number"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(Number(e.target.value))}
                    className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={vatApplicable}
                    onChange={(e) => setVatApplicable(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                  />
                  <span>Apply KRA Standard VAT (16% on Commercial Lease)</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2.5 text-xs font-semibold"
                >
                  <option value={1}>1 Bed</option>
                  <option value={2}>2 Bed</option>
                  <option value={3}>3 Bed</option>
                  <option value={4}>4 Bed</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Sq Feet</label>
                <input
                  type="number"
                  value={squareFeet}
                  onChange={(e) => setSquareFeet(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold"
                />
              </div>
            </div>
          )}

          {/* Rent & Deposit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Monthly Base Rent (KES) *</label>
              <input
                type="number"
                required
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Security Deposit (KES) *</label>
              <input
                type="number"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Utility Meter Numbers (Water & Electricity) */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>Water Meter No.</span>
              </label>
              <input
                type="text"
                placeholder="e.g. WM-402 or MIR-W-501"
                value={waterMeterNumber}
                onChange={(e) => setWaterMeterNumber(e.target.value)}
                className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Electricity Meter / KPLC</span>
              </label>
              <input
                type="text"
                placeholder="e.g. KPLC-3PHASE-01"
                value={electricityMeterNumber}
                onChange={(e) => setElectricityMeterNumber(e.target.value)}
                className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Unit Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase"
            >
              <option value="vacant">Vacant (Ready to Lease)</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 mt-2"
          >
            Save & Add {unitCategory === 'commercial' ? 'Commercial Space' : 'Residential Unit'} to {selectedProp?.name || 'Property'}
          </button>
        </form>
      </div>
    </div>
  );
};
