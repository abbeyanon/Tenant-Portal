import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { KeyRound, X, Copy, Check, ExternalLink, Mail, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';
import { SystemUser } from '../types';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SystemUser | null;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose, user }) => {
  const { addToast, updateUserPassword } = useTenant();
  const [copied, setCopied] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const resetToken = `tok_${user.id}_${Date.now().toString(36)}`;
  const resetUrl = `${window.location.origin}/login?reset_token=${resetToken}&email=${encodeURIComponent(user.email)}`;
  const otpCode = Math.floor(100000 + Math.random() * 900000);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Password reset link copied to clipboard.'
    });
  };

  const handleExecuteReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setIsResetting(true);
    setTimeout(() => {
      updateUserPassword(user.id, newPassword);
      setIsResetting(false);
      setResetSuccess(true);
      addToast({
        type: 'success',
        title: 'Password Updated 🔐',
        message: `Password for ${user.email} has been updated to "${newPassword}".`
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6 text-xs">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Password Reset Center</h3>
            <p className="text-xs text-slate-500">Deliver link & instant password override for {user.name}</p>
          </div>
        </div>

        {resetSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Password Reset Complete</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              The password for <strong>{user.email}</strong> has been updated. The user can now log in immediately with the new password.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <>
            {/* Delivery Channels Simulation Preview */}
            <div className="space-y-3">
              <span className="font-bold text-slate-900 dark:text-white block">
                1. Delivery Simulation (SMS & Email Link)
              </span>

              {/* Email Delivery Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-600" />
                    <span>Email to: {user.email}</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">Sent</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-dark-900 font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all">
                  {resetUrl}
                </div>
              </div>

              {/* SMS Delivery Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                    <span>SMS to: {user.phone || '+254 712 345 678'}</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">Delivered</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                  "Hi {user.name}, your TenantHub password reset OTP is <strong className="text-purple-600 font-mono">{otpCode}</strong> or click {resetUrl.substring(0, 45)}..."
                </p>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 font-bold flex items-center justify-center gap-2 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Direct Reset URL'}</span>
              </button>
            </div>

            {/* Admin Direct Password Override */}
            <form onSubmit={handleExecuteReset} className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <span className="font-bold text-slate-900 dark:text-white block">
                2. Or Set New Password Directly (Admin Override)
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  New Password for {user.name} *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isResetting ? 'Updating...' : 'Set & Save New Password'}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
