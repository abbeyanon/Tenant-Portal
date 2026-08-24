import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { UserPlus, X, Shield, Mail, Phone, Building2, Lock, CheckSquare, Square } from 'lucide-react';
import { SystemUser, UserRole, UserPermissions } from '../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultPermissionsByRole: Record<UserRole, UserPermissions> = {
  admin: {
    properties: true,
    units: true,
    tenants: true,
    accounting: true,
    reports: true,
    users: true,
    maintenance: true,
    gatePass: true,
    documents: true
  },
  manager: {
    properties: true,
    units: true,
    tenants: true,
    accounting: true,
    reports: true,
    users: true,
    maintenance: true,
    gatePass: true,
    documents: true
  },
  landlord: {
    properties: true,
    units: true,
    tenants: true,
    accounting: true,
    reports: true,
    users: true,
    maintenance: true,
    gatePass: true,
    documents: true
  },
  accountant: {
    properties: false,
    units: true,
    tenants: true,
    accounting: true,
    reports: true,
    users: false,
    maintenance: false,
    gatePass: false,
    documents: true
  },
  caretaker: {
    properties: false,
    units: true,
    tenants: false,
    accounting: false,
    reports: false,
    users: false,
    maintenance: true,
    gatePass: true,
    documents: false
  },
  tenant: {
    properties: false,
    units: false,
    tenants: false,
    accounting: false,
    reports: false,
    users: false,
    maintenance: true,
    gatePass: true,
    documents: true
  }
};

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { properties, addUser } = useTenant();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+254 7');
  const [role, setRole] = useState<UserRole>('tenant');
  const [propertyName, setPropertyName] = useState(properties[0]?.name || 'Emerald Heights Luxury Residences');
  const [unitNumber, setUnitNumber] = useState('Unit 1A');
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissionsByRole.tenant);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setPermissions(defaultPermissionsByRole[newRole]);
  };

  const handleTogglePermission = (key: keyof UserPermissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllPermissions = () => {
    setPermissions({
      properties: true,
      units: true,
      tenants: true,
      accounting: true,
      reports: true,
      users: true,
      maintenance: true,
      gatePass: true,
      documents: true
    });
  };

  const handleDeselectAllPermissions = () => {
    setPermissions({
      properties: false,
      units: false,
      tenants: false,
      accounting: false,
      reports: false,
      users: false,
      maintenance: false,
      gatePass: false,
      documents: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addUser({
      name,
      email,
      password: password || 'password123',
      phone,
      role,
      propertyName,
      unitNumber: role === 'tenant' ? unitNumber : undefined,
      status: 'Active',
      permissions
    });

    onClose();
    setName('');
    setEmail('');
    setPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add System User & Assign Roles</h3>
            <p className="text-xs text-slate-500">Configure credentials and ERPNext module permissions matrix</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dennis Ochieng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Email Address (Login Username) *</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Initial Password *</label>
              <input
                type="text"
                required
                placeholder="password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Assigned Role Profile *</label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-semibold"
              >
                <option value="tenant">Resident Tenant (Personal Home Only)</option>
                <option value="admin">System Administrator (Full Access)</option>
                <option value="manager">Property Manager</option>
                <option value="accountant">Accounts Manager / Finance</option>
                <option value="caretaker">Caretaker / Security Desk</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Assigned Property</label>
              <select
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {role === 'tenant' && (
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Assigned Unit Number (Strict Scope)</label>
              <input
                type="text"
                placeholder="e.g. Unit 3A"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          )}

          {/* ERPNext Permissions Matrix */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-brand-600" />
                <span>ERPNext Module Permissions Matrix</span>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllPermissions}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-dark-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-300"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllPermissions}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-dark-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-300"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
              {[
                { key: 'properties', label: 'Property Portfolio' },
                { key: 'units', label: 'Units Inventory' },
                { key: 'tenants', label: 'Tenants Directory' },
                { key: 'accounting', label: 'ERPNext Accounts & Billing' },
                { key: 'reports', label: 'Financial Reports & P&L' },
                { key: 'users', label: 'User Access & Roles' },
                { key: 'maintenance', label: 'Maintenance Dispatch' },
                { key: 'gatePass', label: 'Visitor Pass System' },
                { key: 'documents', label: 'Lease Documents' }
              ].map((perm) => {
                const isChecked = permissions[perm.key as keyof UserPermissions];
                return (
                  <label
                    key={perm.key}
                    onClick={() => handleTogglePermission(perm.key as keyof UserPermissions)}
                    className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-300 dark:border-brand-700 text-brand-900 dark:text-brand-200 font-bold'
                        : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
                    />
                    <span className="truncate">{perm.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 mt-2 transition"
          >
            Create User Account & Apply Permissions
          </button>
        </form>
      </div>
    </div>
  );
};
