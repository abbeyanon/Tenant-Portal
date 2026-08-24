import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const {
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
    shareDocType
  } = useTenant();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hide Header and Topbar when on Login Page */}
      {!isLoginPage && <Header />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/accounting" element={<AccountingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/gate-pass" element={<GatePassPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      {/* Hide Footer when on Login Page */}
      {!isLoginPage && <Footer />}

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
      <ToastContainer />
    </div>
  );
};
