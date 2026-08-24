import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  User,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Building2,
  Send,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { MaintenanceTicket } from '../types';

export const MaintenancePage: React.FC = () => {
  const {
    currentRole,
    activeTenant,
    maintenanceTickets,
    setIsMaintenanceModalOpen,
    updateTicketStatus,
    assignTicketTechnician,
    properties,
    addToast
  } = useTenant();

  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTicketAction, setActiveTicketAction] = useState<string | null>(null);
  const [techName, setTechName] = useState('Samuel Mutua (Plumbing Specialist)');
  const [techPhone, setTechPhone] = useState('+254 722 555 111');
  const [actionNote, setActionNote] = useState('');

  // If user is resident tenant, filter to their tickets; if manager, show all tickets
  const displayedTickets = maintenanceTickets.filter((t) => {
    const matchesTenant = currentRole === 'tenant' ? t.unitNumber === activeTenant.unitNumber : true;
    const matchesProperty = selectedProperty === 'all' || t.propertyName === selectedProperty;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTenant && matchesProperty && matchesStatus && matchesSearch;
  });

  const reportedCount = maintenanceTickets.filter((t) => t.status === 'reported').length;
  const inProgressCount = maintenanceTickets.filter((t) => t.status === 'assigned' || t.status === 'in_progress').length;
  const resolvedCount = maintenanceTickets.filter((t) => t.status === 'resolved').length;

  const handleAssign = (ticketId: string) => {
    if (!techName) return;
    assignTicketTechnician(ticketId, techName, techPhone);
    setActiveTicketAction(null);
  };

  const handleStatusChange = (ticketId: string, status: MaintenanceTicket['status']) => {
    updateTicketStatus(ticketId, status, actionNote || undefined);
    setActionNote('');
    setActiveTicketAction(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>{currentRole === 'tenant' ? 'Resident Repair Requests' : 'Estate Maintenance Dispatch'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentRole === 'tenant' ? 'Report & Track Repairs' : 'Maintenance Dispatch & Work Orders'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {currentRole === 'tenant'
                ? 'Log maintenance tickets for plumbing, electrical, or structural repairs and track technician dispatch.'
                : 'Review incoming repair requests from residents, view who raised them with timestamps, and assign technicians.'}
            </p>
          </div>

          <button
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 flex items-center gap-2 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Log New Maintenance Ticket</span>
          </button>
        </div>

        {/* Executive Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Newly Reported</span>
            <span className="text-3xl font-display font-extrabold text-amber-500 block">
              {reportedCount}
            </span>
            <span className="text-xs text-slate-400">Awaiting technician assignment</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">In Progress / Assigned</span>
            <span className="text-3xl font-display font-extrabold text-blue-600 block">
              {inProgressCount}
            </span>
            <span className="text-xs text-slate-400">Technician on site</span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Resolved Tickets</span>
            <span className="text-3xl font-display font-extrabold text-emerald-600 block">
              {resolvedCount}
            </span>
            <span className="text-xs text-slate-400">Completed repairs</span>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search ticket #, issue title, tenant, unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
            {[
              { id: 'all', label: `All (${maintenanceTickets.length})` },
              { id: 'reported', label: `Reported (${reportedCount})` },
              { id: 'assigned', label: 'Assigned' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'resolved', label: `Resolved (${resolvedCount})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  statusFilter === f.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {ticket.ticketNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ticket.priority === 'emergency'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                        : ticket.priority === 'high'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-dark-800 dark:text-slate-300'
                    }`}>
                      {ticket.priority} Priority
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    ticket.status === 'resolved'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                      : ticket.status === 'reported'
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                      : 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                {/* WHO RAISED IT & EXACT TIMESTAMP AUDIT BLOCK */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Raised By Tenant:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{ticket.tenantName} ({ticket.unitNumber})</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Tenant Phone:</span>
                    <span className="font-mono text-brand-600 font-bold">{ticket.tenantPhone || '+254 712 345 678'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Property / Estate:</span>
                    <span className="text-slate-900 dark:text-white">{ticket.propertyName || 'Emerald Heights Luxury Residences'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-750">
                    <span className="font-semibold">Date & Time Logged:</span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{ticket.reportedDate} (14:35:09 EAT)</span>
                  </div>
                </div>

                {/* Assigned Technician Status */}
                {ticket.assignedTechnician && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-blue-500 font-bold uppercase block">Assigned Technician</span>
                      <strong className="font-bold">{ticket.assignedTechnician}</strong>
                    </div>
                    <span className="font-mono font-semibold">{ticket.technicianPhone}</span>
                  </div>
                )}
              </div>

              {/* ADMIN ACTION CONTROLS */}
              {currentRole !== 'tenant' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {activeTicketAction === ticket.id ? (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                      <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                        <span>Dispatch & Action Work Order</span>
                        <button onClick={() => setActiveTicketAction(null)} className="text-slate-400 hover:text-slate-600">
                          Cancel
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Technician</label>
                        <select
                          value={techName}
                          onChange={(e) => {
                            setTechName(e.target.value);
                            if (e.target.value.includes('Samuel')) setTechPhone('+254 722 555 111');
                            else if (e.target.value.includes('David')) setTechPhone('+254 733 888 222');
                            else setTechPhone('+254 711 000 333');
                          }}
                          className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-bold"
                        >
                          <option value="Samuel Mutua (Plumbing Specialist)">Samuel Mutua (Plumbing Specialist)</option>
                          <option value="David Mwangi (Certified Electrician)">David Mwangi (Certified Electrician)</option>
                          <option value="Joseph Omondi (General Handyman)">Joseph Omondi (General Handyman)</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAssign(ticket.id)}
                          className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500"
                        >
                          Assign Technician
                        </button>
                        <button
                          onClick={() => handleStatusChange(ticket.id, 'in_progress')}
                          className="px-3 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-500"
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => handleStatusChange(ticket.id, 'resolved')}
                          className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTicketAction(ticket.id)}
                        className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Action Ticket & Assign</span>
                      </button>

                      {ticket.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(ticket.id, 'resolved')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
