import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTenant } from './context/TenantContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PayRentModal } from './components/PayRentModal';
import { MpesaStkPromptModal } from './components/MpesaStkPromptModal';
import { MaintenanceModal } from './components/MaintenanceModal';
import { GatePassModal } from './components/GatePassModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { AddTenantModal } from './components/AddTenantModal';
import { AddUnitModal } from './components/AddUnitModal';
import { AddSalesInvoiceModal } from './components/AddSalesInvoiceModal';
import { AddPaymentEntryModal } from './components/AddPaymentEntryModal';
import { AddUserModal } from './components/AddUserModal';
import { BulkImportTenantsModal } from './components/BulkImportTenantsModal';
import { ShareInvoiceModal } from './components/ShareInvoiceModal';
import { ERPNextInvoiceViewModal } from './components/ERPNextInvoiceViewModal';
import { ToastContainer } from './components/ToastContainer';

import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { UnitsPage } from './pages/UnitsPage';
import { TenantsPage } from './pages/TenantsPage';
import { AccountingPage } from './pages/AccountingPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { GatePassPage } from './pages/GatePassPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const {
    isAuthenticated,
    currentUser,
    isStkModalOpen,
    setIsStkModalOpen,
    stkPaymentDetails,
    confirmMpesaPayment,
    isAddSalesInvoiceModalOpen,
    setIsAddSalesInvoiceModalOpen,
    isAddPaymentEntryModalOpen,
    setIsAddPaymentEntryModalOpen,
    isAddUserModalOpen,
    setIsAddUserModalOpen,
    isBulkImportModalOpen,
    setIsBulkImportModalOpen,
    isShareModalOpen,
    setIsShareModalOpen,
    shareDocData,
    shareDocType,
    viewingInvoice,
    setViewingInvoice
  } = useTenant();

  // If user is NOT authenticated, strictly display the login page across all paths
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer />
      </div>
    );
  }

  const isTenantRole = currentUser.role === 'tenant';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/gate-pass" element={<GatePassPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Protected Administrative Modules (Restricted from Tenants) */}
          <Route
            path="/properties"
            element={isTenantRole ? <Navigate to="/" replace /> : <PropertiesPage />}
          />
          <Route
            path="/units"
            element={isTenantRole ? <Navigate to="/" replace /> : <UnitsPage />}
          />
          <Route
            path="/tenants"
            element={isTenantRole ? <Navigate to="/" replace /> : <TenantsPage />}
          />
          <Route
            path="/accounting"
            element={isTenantRole ? <Navigate to="/" replace /> : <AccountingPage />}
          />
          <Route
            path="/reports"
            element={isTenantRole ? <Navigate to="/" replace /> : <ReportsPage />}
          />
          <Route
            path="/users"
            element={isTenantRole ? <Navigate to="/" replace /> : <UsersPage />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Interactive Modals */}
      <PayRentModal />
      <MpesaStkPromptModal
        isOpen={isStkModalOpen}
        onClose={() => setIsStkModalOpen(false)}
        onSuccess={(receipt) => confirmMpesaPayment(receipt)}
        paymentDetails={stkPaymentDetails}
      />
      <MaintenanceModal />
      <GatePassModal />
      <AddPropertyModal />
      <AddTenantModal />
      <AddUnitModal />
      <AddSalesInvoiceModal
        isOpen={isAddSalesInvoiceModalOpen}
        onClose={() => setIsAddSalesInvoiceModalOpen(false)}
      />
      <AddPaymentEntryModal
        isOpen={isAddPaymentEntryModalOpen}
        onClose={() => setIsAddPaymentEntryModalOpen(false)}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
      <BulkImportTenantsModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
      />
      <ShareInvoiceModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        documentData={shareDocData}
        type={shareDocType}
      />
      <ERPNextInvoiceViewModal
        isOpen={Boolean(viewingInvoice)}
        onClose={() => setViewingInvoice(null)}
        invoice={viewingInvoice}
      />
      <ToastContainer />
    </div>
  );
};
