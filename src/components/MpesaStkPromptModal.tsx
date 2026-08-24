import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle2, AlertCircle, X, ShieldCheck, RefreshCw, Radio, Check } from 'lucide-react';

interface MpesaStkPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receipt: any) => void;
  paymentDetails: {
    amount: number;
    phone: string;
    unitNumber: string;
    propertyName?: string;
    tenantName: string;
    type: string;
    invoiceMonth: string;
  } | null;
}

export const MpesaStkPromptModal: React.FC<MpesaStkPromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  paymentDetails
}) => {
  const [status, setStatus] = useState<'awaiting_phone' | 'processing' | 'confirmed' | 'failed'>('awaiting_phone');
  const [countdown, setCountdown] = useState(30);
  const [txRef, setTxRef] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus('awaiting_phone');
      setCountdown(30);
      const generatedRef = 'QK' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setTxRef(generatedRef);
    }
  }, [isOpen]);

  // Live countdown timer while waiting for tenant to enter PIN on their phone
  useEffect(() => {
    let timer: any;
    if (isOpen && status === 'awaiting_phone' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            // Auto complete if time expires to simulate Daraja callback
            handleConfirmPayment();
            return 0;
          }
          // After 6 seconds, automatically transition to confirmed (simulating user entering PIN on phone)
          if (c === 24) {
            handleConfirmPayment();
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, status, countdown]);

  if (!isOpen || !paymentDetails) return null;

  const handleConfirmPayment = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('confirmed');
      setTimeout(() => {
        onSuccess({
          transactionRef: txRef,
          amount: paymentDetails.amount,
          unitNumber: paymentDetails.unitNumber,
          phone: paymentDetails.phone
        });
      }, 1200);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6 text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. AWAITING MOBILE PHONE AUTHORIZATION */}
        {status === 'awaiting_phone' && (
          <div className="space-y-6 text-center">
            {/* Animated Safaricom Pulse Icon */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 relative">
                <Smartphone className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                <span>STK Prompt Sent to Phone</span>
              </div>
              <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
                Check Your Mobile Phone
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Prompt sent to <strong className="text-slate-900 dark:text-white font-mono font-bold">{paymentDetails.phone}</strong>
              </p>
            </div>

            {/* Handset Instructions Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  1
                </span>
                <span>An M-Pesa pop-up has appeared on your phone handset.</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Enter your <strong>M-Pesa PIN on your phone</strong> to authorize payment of <strong>KES {paymentDetails.amount.toLocaleString()}</strong>.</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  3
                </span>
                <span>This portal will automatically update once Safaricom completes the transaction.</span>
              </div>
            </div>

            {/* Status Indicator & Countdown */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span className="font-semibold text-emerald-600">Awaiting phone response...</span>
              </div>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">00:{countdown < 10 ? `0${countdown}` : countdown}s</span>
            </div>

            <button
              type="button"
              onClick={handleConfirmPayment}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-750 text-slate-600 dark:text-slate-300 text-xs font-bold transition"
            >
              Simulate Instant Callback from Safaricom &rarr;
            </button>
          </div>
        )}

        {/* 2. PROCESSING STATE */}
        {status === 'processing' && (
          <div className="py-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
            <div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                Verifying Safaricom M-Pesa Callback...
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Reconciling payment for {paymentDetails.unitNumber} against ERPNext Accounts Receivable.
              </p>
            </div>
          </div>
        )}

        {/* 3. CONFIRMED STATE */}
        {status === 'confirmed' && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-display font-extrabold text-emerald-600">
                Payment Authorized & Confirmed!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Receipt Reference: <strong className="font-mono text-slate-900 dark:text-white font-bold">{txRef}</strong>
              </p>
            </div>

            {/* Safaricom SMS Notification Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-left font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5 leading-relaxed">
              <div className="flex justify-between items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                <span>📩 SAFARICOM M-PESA SMS</span>
                <span>JUST NOW</span>
              </div>
              <p>
                {txRef} Confirmed. Ksh {paymentDetails.amount.toLocaleString()}.00 sent to{' '}
                {paymentDetails.propertyName || 'EMERALD HEIGHTS PROPERTY'} for {paymentDetails.unitNumber} on{' '}
                {new Date().toLocaleDateString()}. Balance: KES 0.00.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
