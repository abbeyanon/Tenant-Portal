import React from 'react';
import { useTenant } from '../context/TenantContext';
import { FileText, Download, ShieldCheck, Eye } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { documents, activeTenant } = useTenant();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 py-12 transition-colors">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Lease & Compliance</span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Tenancy Agreements & Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Access signed residential lease agreements, move-in inventory reports, and building bylaws.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-brand-500 transition flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{doc.title}</h3>
                  <span className="text-xs text-slate-500">{doc.fileSize} • Uploaded on {doc.uploadedDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-brand-500 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
