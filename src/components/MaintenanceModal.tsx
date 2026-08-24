import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  Wrench,
  X,
  Upload,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MaintenanceTicket } from '../types';

export const MaintenanceModal: React.FC = () => {
  const { isMaintenanceModalOpen, setIsMaintenanceModalOpen, activeTenant, submitMaintenanceTicket } = useTenant();

  const [category, setCategory] = useState<MaintenanceTicket['category']>('plumbing');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isMaintenanceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    submitMaintenanceTicket({
      unitNumber: activeTenant.unitNumber,
      tenantName: activeTenant.name,
      tenantPhone: activeTenant.phone,
      category,
      priority,
      title,
      description
    });

    setIsMaintenanceModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={() => setIsMaintenanceModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Report Maintenance Issue</h3>
            <p className="text-xs text-slate-500">{activeTenant.propertyName} • {activeTenant.unitNumber}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Issue Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white capitalize focus:outline-none"
            >
              <option value="plumbing">Plumbing & Leaks</option>
              <option value="electrical">Electrical & Lighting</option>
              <option value="carpentry">Carpentry & Doors/Locks</option>
              <option value="appliance">Appliance / Water Heater</option>
              <option value="hvac">AC / Ventilation</option>
              <option value="security">Intercom / Security</option>
              <option value="painting">Painting & Wall Finishes</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Priority Level *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white capitalize focus:outline-none"
            >
              <option value="emergency">Emergency (Severe Leak / No Power)</option>
              <option value="high">High Priority (Within 24 Hours)</option>
              <option value="medium">Standard (2 - 3 Days)</option>
              <option value="low">Low Priority / Routine</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Issue Summary *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kitchen sink drain draining slowly"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe where the issue is located and convenient times for technician entry..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/20"
          >
            Dispatch Maintenance Ticket
          </button>
        </form>
      </div>
    </div>
  );
};
