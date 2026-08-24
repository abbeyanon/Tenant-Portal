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
  Download,
  Edit,
  Trash2
} from 'lucide-react';
import { Unit } from '../types';
import { exportToCSV } from '../utils/exportUtils';
import { EditUnitModal } from '../components/EditUnitModal';

export const UnitsPage: React.FC = () => {
  const {
    properties,
    units,
    allTenants,
    formatCurrency,
    addUnit,
    updateUnitStatus,
    deleteUnit,
    setIsAddUnitModalOpen,
    setIsAddTenantModalOpen,
    setPreselectedUnitNumber,
    selectedPropertyId,
    setSelectedPropertyId
  } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vacant' | 'occupied' | 'maintenance'>('all');
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  const filteredUnits = units.filter((u) => {
    const matchesProperty = selectedPropertyId === 'all' || u.propertyId === selectedPropertyId;
    const matchesSearch =
      u.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.currentTenantName && u.currentTenantName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesProperty && matchesSearch && matchesStatus;
  });

  const vacantCount = filteredUnits.filter((u) => u.status === 'vacant').length;
  const occupiedCount = filteredUnits.filter((u) => u.status === 'occupied').length;
  const maintenanceCount = filteredUnits.filter((u) => u.status === 'maintenance').length;

  const handleExportUnits = () => {
    const data = filteredUnits.map((u) => ({
      UnitNumber: u.unitNumber,
      Property: u.propertyName,
      Floor: u.floor,
      Bedrooms: u.bedrooms,
      Bathrooms: u.bathrooms,
      SquareFeet: u.squareFeet,
      MonthlyRent: u.rentAmount,
      SecurityDeposit: u.depositAmount,
      Status: u.status.toUpperCase(),
      Tenant: u.currentTenantName || 'Vacant'
    }));
    exportToCSV('units_inventory.csv', data);
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
              Manage apartment inventory, track vacant ready-to-lease units, update rental pricing, and assign incoming tenants across all properties.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleExportUnits}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddUnitModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Unit</span>
            </button>
          </div>
        </div>

        {/* Property Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter Property:</span>
          <button
            onClick={() => setSelectedPropertyId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedPropertyId === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            All Estates ({units.length} Units)
          </button>
          {properties.map((p) => {
            const count = units.filter((u) => u.propertyId === p.id).length;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPropertyId(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedPropertyId === p.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                🏢 {p.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Executive Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white block">
              {filteredUnits.length} Units
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Total Units</span>
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

        {/* Search and Status Filters Bar */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search unit number, estate, tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
            {[
              { id: 'all', label: `All (${filteredUnits.length})` },
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
                    <span>Assign Tenant</span>
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
                  onClick={() => setEditingUnit(u)}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold"
                  title="Edit Unit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => deleteUnit(u.id)}
                  className="px-3 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold"
                  title="Delete Unit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Unit Modal */}
      <EditUnitModal
        isOpen={Boolean(editingUnit)}
        onClose={() => setEditingUnit(null)}
        unit={editingUnit}
      />
    </div>
  );
};
