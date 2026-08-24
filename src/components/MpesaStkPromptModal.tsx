import React, { useState, useEffect } from 'react';
import { Smartphone, Lock, CheckCircle2, AlertCircle, X, ShieldCheck, ArrowRight } from 'lucide-react';

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
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'prompt' | 'processing' | 'confirmed'>('prompt');
  const [countdown, setCountdown] = useState(25);
  const [txRef, setTxRef] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setStep('prompt');
      setCountdown(25);
      const generatedRef = 'QK' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setTxRef(generatedRef);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (isOpen && step === 'prompt' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, step, countdown]);

  if (!isOpen || !paymentDetails) return null;

  const handleAuthorizePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) return;

    setStep('processing');
    setTimeout(() => {
      setStep('confirmed');
      setTimeout(() => {
        onSuccess({
          transactionRef: txRef,
          amount: paymentDetails.amount,
          unitNumber: paymentDetails.unitNumber,
          phone: paymentDetails.phone
        });
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-white space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Handset SIM STK Dialog */}
        {step === 'prompt' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Smartphone className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">
                  Safaricom M-Pesa STK
                </h3>
                <p className="text-[11px] text-slate-400">Prompt sent to {paymentDetails.phone}</p>
              </div>
            </div>

            {/* Simulated Phone Screen Alert Box */}
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 space-y-3 font-mono text-xs text-emerald-200 shadow-inner">
              <div className="flex justify-between items-center text-[10px] text-emerald-400/80 border-b border-emerald-500/20 pb-1.5">
                <span>SIM TOOLKIT</span>
                <span>00:{countdown < 10 ? `0${countdown}` : countdown}s</span>
              </div>
              <p className="leading-relaxed">
                Do you want to pay <strong>KES {paymentDetails.amount.toLocaleString()}</strong> to{' '}
                <strong>{paymentDetails.propertyName || 'EMERALD HEIGHTS PROPERTY'}</strong> for{' '}
                <strong>{paymentDetails.unitNumber} ({paymentDetails.type.toUpperCase()})</strong>?
              </p>
              <div className="text-[11px] text-emerald-300">Enter M-Pesa PIN:</div>
            </div>

            <form onSubmit={handleAuthorizePin} className="space-y-4">
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  maxLength={4}
                  required
                  autoFocus
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-800 border-2 border-emerald-500/60 rounded-xl pl-10 pr-4 py-2.5 text-center text-lg font-mono tracking-widest text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pin.length < 4}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
                >
                  <span>Authorize PIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <p className="text-[10px] text-center text-slate-500">
              💡 Tip: Enter any 4-digit PIN (e.g. 1234) to authorize live simulation.
            </p>
          </div>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            <div>
              <h4 className="font-bold text-base text-white">Communicating with Safaricom...</h4>
              <p className="text-xs text-slate-400 mt-1">Verifying PIN & deducting KES {paymentDetails.amount.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Confirmed SMS State */}
        {step === 'confirmed' && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-bold text-lg text-emerald-400">Payment Confirmed!</h4>
              <p className="text-xs text-slate-300">Transaction Ref: <strong className="text-white font-mono">{txRef}</strong></p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 text-left font-mono text-[11px] text-slate-300 leading-relaxed space-y-1">
              <div className="text-[10px] font-bold text-emerald-400">📩 SAFARICOM M-PESA SMS</div>
              <p>
                {txRef} Confirmed. Ksh{paymentDetails.amount.toLocaleString()}.00 sent to{' '}
                {paymentDetails.propertyName || 'EMERALD HEIGHTS'} for {paymentDetails.unitNumber} on{' '}
                {new Date().toLocaleDateString()}. Balance: 0.00.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
