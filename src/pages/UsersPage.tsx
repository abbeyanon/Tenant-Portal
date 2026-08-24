import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  Trash2,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  Send,
  Building2,
  Download
} from 'lucide-react';
import { SystemUser, UserRole } from '../types';
import { exportToCSV } from '../utils/exportUtils';

export const UsersPage: React.FC = () => {
  const {
    users,
    properties,
    setIsAddUserModalOpen,
    updateUserRole,
    deleteUser,
    sendPasswordResetLink,
    addToast
  } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.propertyName && u.propertyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleExportUsers = () => {
    const exportData = users.map((u) => ({
      Name: u.name,
      Email: u.email,
      Phone: u.phone || '',
      Role: u.role.toUpperCase(),
      Property: u.propertyName || '',
      Unit: u.unitNumber || '',
      Status: u.status,
      LastLogin: u.lastLogin || ''
    }));
    exportToCSV('system_users_directory.csv', exportData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>User Access & Role Management</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              System Users & Permissions
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Add user accounts, assign roles (Tenant, Manager, Accountant, Caretaker, Admin), and dispatch password reset links.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportUsers}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 flex items-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add New User</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search user name, email, property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0">Role Filter:</span>
            {[
              { id: 'all', label: `All (${users.length})` },
              { id: 'tenant', label: 'Tenants' },
              { id: 'manager', label: 'Managers' },
              { id: 'accountant', label: 'Accountants' },
              { id: 'caretaker', label: 'Caretakers' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterRole(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  filterRole === f.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Assigned Role</th>
                  <th className="pb-3">Estate / Unit</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Last Active</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-dark-850/50 transition">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 font-mono text-slate-500">{u.phone || '—'}</td>

                    <td className="py-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className="bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold uppercase text-brand-600 dark:text-brand-400"
                      >
                        <option value="tenant">Tenant</option>
                        <option value="manager">Manager</option>
                        <option value="accountant">Accountant</option>
                        <option value="caretaker">Caretaker</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-4">
                      <span className="font-semibold text-slate-900 dark:text-white block truncate max-w-xs">{u.propertyName || 'All Estates'}</span>
                      {u.unitNumber && <span className="text-[10px] text-purple-600 font-bold">{u.unitNumber}</span>}
                    </td>

                    <td className="py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                        {u.status}
                      </span>
                    </td>

                    <td className="py-4 text-slate-400 text-[11px]">{u.lastLogin || 'Never'}</td>

                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => sendPasswordResetLink(u.id)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center gap-1 hover:bg-purple-100"
                          title="Dispatch Password Reset Email/SMS"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Reset Password</span>
                        </button>

                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
