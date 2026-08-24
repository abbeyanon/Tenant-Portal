import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  Building2,
  PlusCircle,
  Search,
  Filter,
  UserPlus,
  Home,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  DollarSign,
  Maximize2,
  Bed,
  Bath,
  Layers
} from 'lucide-react';
import { Unit } from '../types';

export const UnitsPage: React.FC = () => {
  const {
    units,
    allTenants,
    formatCurrency,
    addUnit,
    updateUnitStatus,
    setIsAddUnitModalOpen,
    setIsAddTenantModalOpen,
    setPreselectedUnitNumber
  } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vacant' | 'occupied' | 'maintenance'>('all');

  // Inline unit form state
  const [showInlineUnitForm, setShowInlineUnitForm] = useState(false);
  const [newUnitNumber, setNewUnitNumber] = useState('');
  const [newFloor, setNewFloor] = useState<number>(1);
  const [newBedrooms, setNewBedrooms] = useState<number>(2);
  const [newBathrooms, setNewBathrooms] = useState<number>(2);
  const [newSquareFeet, setNewSquareFeet] = useState<number>(1150);
  const [newRentAmount, setNewRentAmount] = useState<number>(48000);
  const [newDepositAmount, setNewDepositAmount] = useState<number>(48000);
  const [newStatus, setNewStatus] = useState<Unit['status']>('vacant');

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.currentTenantName && u.currentTenantName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const vacantCount = units.filter((u) => u.status === 'vacant').length;
  const occupiedCount = units.filter((u) => u.status === 'occupied').length;
  const maintenanceCount = units.filter((u) => u.status === 'maintenance').length;

  const handleInlineUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitNumber) return;

    addUnit({
      unitNumber: newUnitNumber,
      propertyName: 'Emerald Heights Residences',
      floor: newFloor,
      bedrooms: newBedrooms,
      bathrooms: newBathrooms,
      squareFeet: newSquareFeet,
      rentAmount: newRentAmount,
      depositAmount: newDepositAmount,
      status: newStatus
    });

    setNewUnitNumber('');
    setShowInlineUnitForm(false);
  };

  const handleAssignTenantToUnit = (unit: Unit) => {
    setPreselectedUnitNumber(unit.unitNumber);
    setIsAddTenantModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Estate Inventory & Unit Management</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Apartment Units Roster
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Manage apartment inventory, track vacant ready-to-lease units, update rental pricing, and assign incoming tenants.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowInlineUnitForm(!showInlineUnitForm)}
              className="px-5 py-3.5 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-800 font-bold text-xs shadow-sm flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>{showInlineUnitForm ? 'Hide Quick Form' : 'Quick Add Unit'}</span>
            </button>

            <button
              onClick={() => setIsAddUnitModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <Building2 className="w-4 h-4" />
              <span>+ Add Unit (Modal)</span>
            </button>
          </div>
        </div>

        {/* Executive Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white block">
              {units.length} Units
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Total Estate Units</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-emerald-600 block">
              {occupiedCount}
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Occupied Units</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-blue-600 dark:text-blue-400 block">
              {vacantCount}
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Vacant (Ready to Lease)</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-amber-500 block">
              {maintenanceCount}
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Under Maintenance</span>
          </div>
        </div>

        {/* Quick Inline Add Unit Form */}
        {showInlineUnitForm && (
          <div className="bg-white dark:bg-dark-900 border-2 border-blue-400 dark:border-blue-600 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Register New Apartment Unit</h3>
                  <p className="text-xs text-slate-500">Add an apartment to the building inventory</p>
                </div>
              </div>
              <button
                onClick={() => setShowInlineUnitForm(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Close Form ✕
              </button>
            </div>

            <form onSubmit={handleInlineUnitSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Unit Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 6B"
                    value={newUnitNumber}
                    onChange={(e) => setNewUnitNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Floor Level</label>
                  <input
                    type="number"
                    value={newFloor}
                    onChange={(e) => setNewFloor(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Bedrooms</label>
                  <select
                    value={newBedrooms}
                    onChange={(e) => setNewBedrooms(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs"
                  >
                    <option value={1}>1 Bedroom</option>
                    <option value={2}>2 Bedrooms</option>
                    <option value={3}>3 Bedrooms</option>
                    <option value={4}>4 Bedrooms</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs uppercase font-bold"
                  >
                    <option value="vacant">Vacant</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Monthly Rent (KES) *</label>
                  <input
                    type="number"
                    required
                    value={newRentAmount}
                    onChange={(e) => setNewRentAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Deposit Amount (KES) *</label>
                  <input
                    type="number"
                    required
                    value={newDepositAmount}
                    onChange={(e) => setNewDepositAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Approx Sq Feet</label>
                  <input
                    type="number"
                    value={newSquareFeet}
                    onChange={(e) => setNewSquareFeet(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInlineUnitForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20"
                >
                  Save & Register Unit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by unit number (e.g. Unit 3C), tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
            {[
              { id: 'all', label: `All (${units.length})` },
              { id: 'vacant', label: `Vacant (${vacantCount})` },
              { id: 'occupied', label: `Occupied (${occupiedCount})` },
              { id: 'maintenance', label: `Maintenance (${maintenanceCount})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  filterStatus === f.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Units Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((u) => (
            <div
              key={u.id}
              className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-blue-500 transition flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Unit Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-display font-extrabold text-slate-900 dark:text-white block">
                      {u.unitNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Floor {u.floor} • {u.propertyName}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    u.status === 'vacant'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                      : u.status === 'occupied'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                  }`}>
                    {u.status}
                  </span>
                </div>

                {/* Specs Pill List */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Bedrooms</span>
                    <span className="font-bold text-slate-900 dark:text-white">{u.bedrooms} Bed</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Bathrooms</span>
                    <span className="font-bold text-slate-900 dark:text-white">{u.bathrooms} Bath</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Size</span>
                    <span className="font-bold text-slate-900 dark:text-white">{u.squareFeet} sq ft</span>
                  </div>
                </div>

                {/* Financial Rates */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Rent:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(u.rentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Security Deposit:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(u.depositAmount)}</span>
                  </div>

                  {u.currentTenantName && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-750 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Current Tenant:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{u.currentTenantName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                {u.status === 'vacant' ? (
                  <button
                    onClick={() => handleAssignTenantToUnit(u)}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign Tenant to {u.unitNumber}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateUnitStatus(u.id, u.status === 'occupied' ? 'vacant' : 'occupied')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs"
                  >
                    Set as {u.status === 'occupied' ? 'Vacant' : 'Occupied'}
                  </button>
                )}

                <button
                  onClick={() => updateUnitStatus(u.id, u.status === 'maintenance' ? 'vacant' : 'maintenance')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition ${
                    u.status === 'maintenance'
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-slate-50 dark:bg-dark-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                  title="Toggle maintenance status"
                >
                  {u.status === 'maintenance' ? 'Exit Maint.' : 'Maint.'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
