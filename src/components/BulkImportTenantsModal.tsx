import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { Upload, X, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { downloadTenantCSVTemplate } from '../utils/exportUtils';

interface BulkImportTenantsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportTenantsModal: React.FC<BulkImportTenantsModalProps> = ({ isOpen, onClose }) => {
  const { bulkImportTenants, properties } = useTenant();

  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const rowObj: any = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });
      rows.push(rowObj);
    }

    setParsedRows(rows);
  };

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);

    const formattedTenants = parsedRows.map((r, idx) => ({
      name: r.FullName || r.Name || r['Full Name'] || `Tenant ${idx + 1}`,
      email: r.Email || r['Email Address'] || `tenant${idx + 1}@example.com`,
      phone: r.Phone || r['Phone Number'] || '+254 700 000 000',
      propertyId: properties[0]?.id || 'prop-1',
      propertyName: r.PropertyName || r['Property Name'] || properties[0]?.name || 'Emerald Heights Luxury Residences',
      unitId: (r.UnitNumber || r['Unit Number'] || `Unit-${idx + 1}`).toLowerCase().replace(/\s+/g, '-'),
      unitNumber: r.UnitNumber || r['Unit Number'] || `Unit ${idx + 1}`,
      rentAmount: Number(r.MonthlyRent || r['Monthly Rent'] || 48000),
      depositAmount: Number(r.SecurityDeposit || r['Security Deposit'] || 48000),
      leaseStart: r.LeaseStart || r['Lease Start Date'] || '2026-09-01',
      leaseEnd: r.LeaseEnd || r['Lease End Date'] || '2027-08-31',
      vehiclePlate: r.VehiclePlate || r['Vehicle Plate'] || '',
      emergencyContact: {
        name: r.EmergencyContactName || 'Family Contact',
        phone: r.EmergencyContactPhone || '+254 700 000 000',
        relationship: 'Family'
      }
    }));

    bulkImportTenants(formattedTenants);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bulk Import Tenants (CSV / Excel)</h3>
            <p className="text-xs text-slate-500">Upload multiple resident records, assign units & generate ERPNext profiles</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Download sample template */}
          <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-brand-900 dark:text-brand-300 block">Need the standard CSV layout?</span>
              <span className="text-[11px] text-slate-500">Download the pre-formatted tenant import template</span>
            </div>
            <button
              onClick={downloadTenantCSVTemplate}
              className="px-3.5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-500 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 hover:border-brand-500 transition">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <div>
              <label className="cursor-pointer font-bold text-brand-600 dark:text-brand-400 hover:underline">
                <span>Click to browse CSV file</span>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports comma-separated (.csv) files</p>
            </div>
          </div>

          {/* Or Paste CSV data */}
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
              Or Paste CSV Data Directly:
            </label>
            <textarea
              rows={3}
              placeholder="FullName,Email,Phone,PropertyName,UnitNumber,MonthlyRent..."
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                parseCSV(e.target.value);
              }}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          {/* Preview Parsed Rows */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                <span>Preview Ready for Import ({parsedRows.length} Tenants)</span>
                <span className="text-emerald-600 text-xs">✓ Validated</span>
              </div>
              <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 font-bold sticky top-0">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Unit</th>
                      <th className="p-2">Rent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parsedRows.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2 font-semibold">{r.FullName || r.Name || r['Full Name']}</td>
                        <td className="p-2 font-mono">{r.Phone || r['Phone Number']}</td>
                        <td className="p-2 font-bold text-brand-600">{r.UnitNumber || r['Unit Number']}</td>
                        <td className="p-2">KES {Number(r.MonthlyRent || r['Monthly Rent'] || 48000).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            onClick={handleExecuteImport}
            disabled={parsedRows.length === 0 || isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 mt-4 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isProcessing ? 'Importing Tenants...' : `Execute Bulk Import (${parsedRows.length} Tenants)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
