import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import {
  User,
  Lock,
  Bell,
  ShieldCheck,
  Save,
  KeyRound,
  Smartphone,
  Mail,
  Car
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { activeTenant, addToast } = useTenant();

  const [name, setName] = useState(activeTenant.name);
  const [email, setEmail] = useState(activeTenant.email);
  const [phone, setPhone] = useState(activeTenant.phone);
  const [vehiclePlate, setVehiclePlate] = useState(activeTenant.vehiclePlate || 'KDK 892M');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [emailReceipts, setEmailReceipts] = useState(true);
  const [smsRentReminders, setSmsRentReminders] = useState(true);
  const [pushMaintenanceUpdates, setPushMaintenanceUpdates] = useState(true);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your resident contact information and vehicle plate have been saved.'
    });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    addToast({
      type: 'success',
      title: 'Password Changed',
      message: 'Security credentials updated successfully.'
    });
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-6 space-y-10">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Account & Preferences</span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Resident Profile & Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your personal profile, vehicle registration for basement parking, security passwords, and notification channels.
          </p>
        </div>

        {/* 1. Profile Information */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resident Profile</h2>
              <p className="text-xs text-slate-500">Contact details and emergency information</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Phone Number (M-Pesa)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Vehicle License Plate (Parking Permit)</label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* 2. Security & Password */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security & Password</h2>
              <p className="text-xs text-slate-500">Update login credentials and two-factor authentication</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Two-Factor SMS Verification</span>
                <span className="text-slate-500">Require an SMS OTP when logging into your tenant portal</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="w-4 h-4 text-brand-600"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* 3. Notification Preferences */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Channels</h2>
              <p className="text-xs text-slate-500">Control automated alerts and rent receipts</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-850 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Email Rent Receipts (PDF)</span>
                <span className="text-slate-500">Receive instant electronic PDF receipts immediately upon payment</span>
              </div>
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="w-4 h-4 text-brand-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-850 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">SMS Due Date Reminders</span>
                <span className="text-slate-500">Get gentle SMS reminders on the 1st and 4th of every month</span>
              </div>
              <input
                type="checkbox"
                checked={smsRentReminders}
                onChange={(e) => setSmsRentReminders(e.target.checked)}
                className="w-4 h-4 text-brand-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-850 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Maintenance Progress Updates</span>
                <span className="text-slate-500">Get notified whenever a technician accepts or completes a repair ticket</span>
              </div>
              <input
                type="checkbox"
                checked={pushMaintenanceUpdates}
                onChange={(e) => setPushMaintenanceUpdates(e.target.checked)}
                className="w-4 h-4 text-brand-600"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
