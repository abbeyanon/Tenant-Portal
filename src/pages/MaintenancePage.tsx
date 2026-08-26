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
  DollarSign,
  BarChart3,
  ListFilter,
  PieChart,
  Activity
} from 'lucide-react';
import { MaintenanceTicket } from '../types';
import { MaintenanceCharts } from '../components/charts/MaintenanceCharts';

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
  const [viewTab, setViewTab] = useState<'charts' | 'tickets'>('charts');

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
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>{currentRole === 'tenant' ? 'Resident Repair Requests & Analytics' : 'Estate Maintenance Dispatch & Graphical Analytics'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentRole === 'tenant' ? 'Report & Track Repairs' : 'Maintenance Operations & Work Orders'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {currentRole === 'tenant'
                ? 'Log maintenance tickets for plumbing, electrical, or structural repairs, track technician dispatch, and view resolution statistics.'
                : 'Review incoming repair requests from residents, view graphical funnel pipelines, monitor resolution velocity, and dispatch technicians.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsMaintenanceModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Log New Maintenance Ticket</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs: Visual Analytics Charts vs Work Orders Roster */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
          <button
            onClick={() => setViewTab('charts')}
            className={`pb-3.5 transition border-b-2 flex items-center gap-2 ${
              viewTab === 'charts'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Graphical Analytics & Funnel Breakdown</span>
          </button>
          <button
            onClick={() => setViewTab('tickets')}
            className={`pb-3.5 transition border-b-2 flex items-center gap-2 ${
              viewTab === 'tickets'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Work Orders & Dispatch Roster ({displayedTickets.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* GRAPHICAL REPRESENTATIONS & RESOLUTION FUNNEL COMPONENT */}
        {/* ========================================================================= */}
        <MaintenanceCharts
          tickets={currentRole === 'tenant' ? displayedTickets : maintenanceTickets}
          isTenantView={currentRole === 'tenant'}
        />

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
            {currentRole !== 'tenant' && (
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Properties</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}

            <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'reported', label: 'Reported' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'resolved', label: 'Resolved' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
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

        {/* Tickets Feed */}
        <div className="space-y-4">
          {displayedTickets.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Clear! No Pending Repair Requests</h3>
              <p className="text-xs text-slate-500">There are no maintenance tickets matching your filters.</p>
            </div>
          ) : (
            displayedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-amber-500 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                        {ticket.ticketNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400">
                        {ticket.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ticket.priority === 'emergency'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                            : ticket.priority === 'high'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {ticket.priority} Priority
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                      {ticket.description}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase self-start ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                        : ticket.status === 'in_progress' || ticket.status === 'assigned'
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Audit Trail: Who Raised, When, What Time, Unit */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Raised By (Resident):</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span>{ticket.tenantName}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 block">{ticket.tenantPhone || '+254 712 345 678'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Space / Unit & Estate:</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400 block mt-0.5">
                      {ticket.unitNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate block">{ticket.propertyName || 'Emerald Heights'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Timestamp (Logged At):</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ticket.reportedDate || '2026-08-26 14:35:09 EAT'}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Technician:</span>
                    {ticket.assignedTechnician ? (
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{ticket.assignedTechnician}</span>
                        <span className="font-mono text-[11px] text-brand-600">{ticket.technicianPhone}</span>
                      </div>
                    ) : (
                      <span className="text-amber-600 font-semibold block mt-0.5">Not yet assigned</span>
                    )}
                  </div>
                </div>

                {/* Manager Action Center */}
                {currentRole !== 'tenant' && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTicketAction(activeTicketAction === ticket.id ? null : ticket.id)}
                        className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition"
                      >
                        {activeTicketAction === ticket.id ? 'Close Action Panel' : '⚡ Action & Dispatch'}
                      </button>

                      {ticket.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(ticket.id, 'resolved')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Expanded Action Panel for Dispatch */}
                {activeTicketAction === ticket.id && (
                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-4 text-xs animate-in fade-in">
                    <h4 className="font-bold text-amber-900 dark:text-amber-200">
                      Technician Dispatch & Work Order Action Center
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Technician:</label>
                        <select
                          value={techName}
                          onChange={(e) => setTechName(e.target.value)}
                          className="w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-900 dark:text-white"
                        >
                          <option value="Samuel Mutua (Plumbing Specialist)">Samuel Mutua - Plumber (+254 722 555 111)</option>
                          <option value="David Mwangi (Certified Electrician)">David Mwangi - Electrician (+254 733 444 222)</option>
                          <option value="Joseph Omondi (HVAC & Carpentry)">Joseph Omondi - Handyman (+254 711 999 888)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Internal Note / Instructions:</label>
                        <input
                          type="text"
                          placeholder="e.g. Bring spare 1/2-inch copper pipe fittings"
                          value={actionNote}
                          onChange={(e) => setActionNote(e.target.value)}
                          className="w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleAssign(ticket.id)}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition"
                      >
                        Dispatch Technician & Set In Progress
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
