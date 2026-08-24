import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import {
  Building2,
  PlusCircle,
  MapPin,
  Phone,
  Users,
  Home,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { Property } from '../types';

export const PropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    properties,
    units,
    allTenants,
    setIsAddPropertyModalOpen,
    setIsAddUnitModalOpen,
    setIsAddTenantModalOpen,
    setSelectedPropertyId
  } = useTenant();

  const totalPortfolioUnits = properties.reduce((acc, p) => acc + p.totalUnits, 0);

  const handleViewUnits = (propId: string) => {
    setSelectedPropertyId(propId);
    navigate('/units');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Multi-Property Portfolio Management</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Real Estate Properties & Estates
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Manage multiple apartment buildings, executive suites, and gated communities under a single unified dashboard.
            </p>
          </div>

          <button
            onClick={() => setIsAddPropertyModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 flex items-center gap-2 transition transform hover:-translate-y-0.5 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Property</span>
          </button>
        </div>

        {/* Executive Portfolio Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-brand-600 dark:text-brand-400 block">
              {properties.length} Estates
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Active Properties Managed</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white block">
              {units.length} Units
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Total Inventory Units</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-3xl font-display font-extrabold text-emerald-600 block">
              {allTenants.length} Active Tenants
            </span>
            <span className="text-xs text-slate-500 font-semibold mt-1 block">Registered Residents</span>
          </div>
        </div>

        {/* Properties Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => {
            const propUnits = units.filter((u) => u.propertyId === prop.id || u.propertyName === prop.name);
            const occupied = propUnits.filter((u) => u.status === 'occupied').length;
            const vacant = propUnits.filter((u) => u.status === 'vacant').length;

            return (
              <div
                key={prop.id}
                className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Property Image Header */}
                  <div className="h-48 relative overflow-hidden bg-slate-800">
                    <img
                      src={prop.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop'}
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                      {prop.propertyType}
                    </span>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h2 className="font-display font-bold text-lg leading-snug">{prop.name}</h2>
                      <div className="flex items-center gap-1 text-xs text-slate-300 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                        <span>{prop.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-6 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Units Configured</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                          {propUnits.length > 0 ? propUnits.length : prop.totalUnits} Units
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                        <span className="text-[10px] text-emerald-600 block uppercase font-semibold">Occupancy</span>
                        <span className="text-base font-bold text-emerald-600">
                          {occupied} Occupied ({vacant} Vacant)
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Caretaker / Hotline:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{prop.caretakerName}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span>Phone:</span>
                        <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{prop.caretakerPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsAddUnitModalOpen(true)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 hover:bg-blue-100 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Unit</span>
                    </button>
                    <button
                      onClick={() => setIsAddTenantModalOpen(true)}
                      className="flex-1 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Tenant</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleViewUnits(prop.id)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                  >
                    <span>View Units Roster</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
