import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { ToastContainer } from './components/ToastContainer';

import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { UnitsPage } from './pages/UnitsPage';
import { TenantsPage } from './pages/TenantsPage';
import { AccountingPage } from './pages/AccountingPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { GatePassPage } from './pages/GatePassPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const { isStkModalOpen, setIsStkModalOpen, stkPaymentDetails, confirmMpesaPayment } = useTenant();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/accounting" element={<AccountingPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/gate-pass" element={<GatePassPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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
      <ToastContainer />
    </div>
  );
};
