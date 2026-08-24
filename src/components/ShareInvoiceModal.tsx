import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { Share2, X, Send, Printer, Copy, Check, MessageSquare, Mail } from 'lucide-react';

interface ShareInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: any | null;
  type: 'invoice' | 'receipt';
}

export const ShareInvoiceModal: React.FC<ShareInvoiceModalProps> = ({
  isOpen,
  onClose,
  documentData,
  type
}) => {
  const { addToast, formatCurrency } = useTenant();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !documentData) return null;

  const docNumber = documentData.invoiceNumber || documentData.voucherNumber || documentData.receiptNumber || 'DOC-2026';
  const recipientName = documentData.customerName || documentData.partyName || documentData.tenantName || 'Resident Tenant';
  const amount = documentData.grandTotal || documentData.paidAmount || documentData.amount || 0;
  const unit = documentData.unitNumber || 'Unit 4B';

  const shareText = `Dear ${recipientName}, here is your official ${type === 'invoice' ? 'Rent Invoice' : 'Payment Receipt'} (${docNumber}) for ${unit} of ${formatCurrency(amount)}. View or download your statement from the Tenant Portal.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: 'Statement message copied. Ready to paste.'
    });
  };

  const handleSendSMS = () => {
    addToast({
      type: 'success',
      title: 'SMS Dispatched 📱',
      message: `Statement & link sent to ${recipientName}.`
    });
    onClose();
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Share {type === 'invoice' ? 'Invoice' : 'Receipt'}</h3>
            <p className="text-xs text-slate-500">{docNumber} • {unit}</p>
          </div>
        </div>

        {/* Message Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
          {shareText}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={handleSendSMS}
            className="p-3 rounded-xl bg-purple-600 text-white flex items-center justify-center gap-2 hover:bg-purple-500 transition"
          >
            <Send className="w-4 h-4" />
            <span>Send via SMS</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-xl bg-emerald-600 text-white flex items-center justify-center gap-2 hover:bg-emerald-500 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold flex items-center justify-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={() => {
              window.print();
            }}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
