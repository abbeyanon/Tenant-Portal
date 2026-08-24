import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserAccount,
  Tenant,
  Unit,
  PaymentRecord,
  MaintenanceTicket,
  Announcement,
  GatePass,
  PropertyDocument,
  PropertyStats,
  SalesInvoice,
  PaymentEntry,
  GLEntry
} from '../types';
import {
  initialTenants,
  initialUnits,
  initialPayments,
  initialMaintenanceTickets,
  initialAnnouncements,
  initialGatePasses,
  initialDocuments,
  initialStats,
  initialSalesInvoices,
  initialPaymentEntries,
  initialGLEntries
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface TenantContextType {
  // Auth
  isAuthenticated: boolean;
  currentUser: UserAccount;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;

  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  activeTenant: Tenant;
  allTenants: Tenant[];
  units: Unit[];
  payments: PaymentRecord[];
  maintenanceTickets: MaintenanceTicket[];
  announcements: Announcement[];
  gatePasses: GatePass[];
  documents: PropertyDocument[];
  stats: PropertyStats;
  toasts: Toast[];

  // ERPNext Accounting Module
  salesInvoices: SalesInvoice[];
  paymentEntries: PaymentEntry[];
  glEntries: GLEntry[];

  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Payment operations (Creates ERPNext Payment Entry & GL Entry)
  payRent: (paymentData: {
    unitNumber: string;
    tenantName: string;
    tenantPhone: string;
    amount: number;
    type: PaymentRecord['type'];
    method: 'mpesa' | 'card' | 'bank_transfer';
    invoiceMonth: string;
    mpesaNumber?: string;
  }) => Promise<{ success: boolean; payment: PaymentRecord; receiptNumber: string }>;

  // Maintenance operations
  submitMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'status' | 'reportedDate'>) => void;
  updateTicketStatus: (ticketId: string, status: MaintenanceTicket['status'], note?: string) => void;
  assignTicketTechnician: (ticketId: string, technicianName: string, technicianPhone: string) => void;

  // Gate passes
  createGatePass: (visitorName: string, visitorPhone: string, unitNumber: string) => GatePass;

  // Announcements
  broadcastAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;

  // Tenant operations
  addTenant: (tenant: Omit<Tenant, 'id' | 'balanceDue' | 'paymentStatus'>) => void;
  sendPaymentReminder: (tenantId: string) => void;

  // Unit operations
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnitStatus: (unitId: string, status: Unit['status']) => void;

  // Modals controller state
  isPayRentModalOpen: boolean;
  setIsPayRentModalOpen: (open: boolean) => void;
  isMaintenanceModalOpen: boolean;
  setIsMaintenanceModalOpen: (open: boolean) => void;
  isGatePassModalOpen: boolean;
  setIsGatePassModalOpen: (open: boolean) => void;
  isAnnouncementModalOpen: boolean;
  setIsAnnouncementModalOpen: (open: boolean) => void;
  isAddTenantModalOpen: boolean;
  setIsAddTenantModalOpen: (open: boolean) => void;
  isAddUnitModalOpen: boolean;
  setIsAddUnitModalOpen: (open: boolean) => void;
  preselectedUnitNumber: string | null;
  setPreselectedUnitNumber: (unitNumber: string | null) => void;
  activeReceipt: PaymentRecord | null;
  setActiveReceipt: (receipt: PaymentRecord | null) => void;

  formatCurrency: (amount: number) => string;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr-tenant-1',
        name: 'John Kamau',
        email: 'john.kamau@example.com',
        role: 'tenant',
        unitNumber: 'Unit 4B',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
      };
    } catch {
      return {
        id: 'usr-tenant-1',
        name: 'John Kamau',
        email: 'john.kamau@example.com',
        role: 'tenant',
        unitNumber: 'Unit 4B'
      };
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tenanthub_auth') !== 'false';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('tenanthub_role') as UserRole) || 'tenant';
  });

  const [allTenants, setAllTenants] = useState<Tenant[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_tenants');
      return saved ? JSON.parse(saved) : initialTenants;
    } catch {
      return initialTenants;
    }
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_units');
      return saved ? JSON.parse(saved) : initialUnits;
    } catch {
      return initialUnits;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_payments');
      return saved ? JSON.parse(saved) : initialPayments;
    } catch {
      return initialPayments;
    }
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_tickets');
      return saved ? JSON.parse(saved) : initialMaintenanceTickets;
    } catch {
      return initialMaintenanceTickets;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_announcements');
      return saved ? JSON.parse(saved) : initialAnnouncements;
    } catch {
      return initialAnnouncements;
    }
  });

  const [gatePasses, setGatePasses] = useState<GatePass[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_gatepasses');
      return saved ? JSON.parse(saved) : initialGatePasses;
    } catch {
      return initialGatePasses;
    }
  });

  // ERPNext Accounting State
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_sinv');
      return saved ? JSON.parse(saved) : initialSalesInvoices;
    } catch {
      return initialSalesInvoices;
    }
  });

  const [paymentEntries, setPaymentEntries] = useState<PaymentEntry[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_pe');
      return saved ? JSON.parse(saved) : initialPaymentEntries;
    } catch {
      return initialPaymentEntries;
    }
  });

  const [glEntries, setGlEntries] = useState<GLEntry[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_gl');
      return saved ? JSON.parse(saved) : initialGLEntries;
    } catch {
      return initialGLEntries;
    }
  });

  const [documents] = useState<PropertyDocument[]>(initialDocuments);
  const [stats, setStats] = useState<PropertyStats>(initialStats);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals state
  const [isPayRentModalOpen, setIsPayRentModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isGatePassModalOpen, setIsGatePassModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [preselectedUnitNumber, setPreselectedUnitNumber] = useState<string | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<PaymentRecord | null>(null);

  const activeTenant = allTenants[0];

  useEffect(() => {
    localStorage.setItem('tenanthub_user', JSON.stringify(currentUser));
    localStorage.setItem('tenanthub_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('tenanthub_role', currentRole);
  }, [currentUser, isAuthenticated, currentRole]);

  useEffect(() => {
    localStorage.setItem('tenanthub_tenants', JSON.stringify(allTenants));
    localStorage.setItem('tenanthub_units', JSON.stringify(units));
    localStorage.setItem('tenanthub_payments', JSON.stringify(payments));
    localStorage.setItem('tenanthub_tickets', JSON.stringify(maintenanceTickets));
    localStorage.setItem('tenanthub_sinv', JSON.stringify(salesInvoices));
    localStorage.setItem('tenanthub_pe', JSON.stringify(paymentEntries));
    localStorage.setItem('tenanthub_gl', JSON.stringify(glEntries));
  }, [allTenants, units, payments, maintenanceTickets, salesInvoices, paymentEntries, glEntries]);

  // Auth Methods
  const login = async (email: string, password?: string): Promise<boolean> => {
    if (email.includes('admin') || email.includes('manager')) {
      const managerUser: UserAccount = {
        id: 'usr-manager-1',
        name: 'Faith Chebet (Estate Director)',
        email,
        role: 'landlord',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
      };
      setCurrentUser(managerUser);
      setCurrentRole('landlord');
    } else {
      const tenantUser: UserAccount = {
        id: 'usr-tenant-1',
        name: 'John Kamau',
        email,
        role: 'tenant',
        unitNumber: 'Unit 4B',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
      };
      setCurrentUser(tenantUser);
      setCurrentRole('tenant');
    }

    setIsAuthenticated(true);
    addToast({
      type: 'success',
      title: 'Authentication Successful',
      message: `Signed in as ${email}. Connected to Frappe & ERPNext session.`
    });
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out of the tenant portal.'
    });
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name: role === 'tenant' ? 'John Kamau' : 'Faith Chebet (Estate Director)'
    }));
    addToast({
      type: 'info',
      title: 'Workspace Switched',
      message: `Now viewing workspace as ${role === 'tenant' ? 'Resident Tenant' : 'Property Manager / Landlord'}.`
    });
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  // Payment Processing Simulation (With ERPNext Accounts Integration)
  const payRent = async (data: {
    unitNumber: string;
    tenantName: string;
    tenantPhone: string;
    amount: number;
    type: PaymentRecord['type'];
    method: 'mpesa' | 'card' | 'bank_transfer';
    invoiceMonth: string;
    mpesaNumber?: string;
  }) => {
    const receiptNumber = `TH-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txRef = data.method === 'mpesa'
      ? `QK${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      : `CRD_${Date.now()}`;

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      receiptNumber,
      unitNumber: data.unitNumber,
      tenantName: data.tenantName,
      tenantPhone: data.tenantPhone,
      amount: data.amount,
      type: data.type,
      method: data.method,
      transactionRef: txRef,
      invoiceMonth: data.invoiceMonth,
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setPayments((prev) => [newPayment, ...prev]);

    // 1. Create ERPNext Payment Entry
    const newPE: PaymentEntry = {
      id: 'pe-' + Date.now(),
      voucherNumber: `ACC-PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      partyName: data.tenantName,
      unitNumber: data.unitNumber,
      paidAmount: data.amount,
      modeOfPayment: data.method === 'mpesa' ? 'M-Pesa' : data.method === 'card' ? 'Card' : 'Bank Transfer',
      paidToAccount: '1120 - Safaricom M-Pesa Till Account',
      referenceNo: txRef,
      postingDate: new Date().toISOString().split('T')[0],
      remarks: `${data.invoiceMonth} ${data.type.toUpperCase()} settlement for ${data.unitNumber}`
    };
    setPaymentEntries((prev) => [newPE, ...prev]);

    // 2. Post dual General Ledger (GL) Entries in ERPNext Accounts
    const glDebit: GLEntry = {
      id: 'gl-' + Date.now() + '-dr',
      voucherType: 'Payment Entry',
      voucherNo: newPE.voucherNumber,
      account: '1120 - Safaricom M-Pesa Till Account',
      debit: data.amount,
      credit: 0,
      postingDate: new Date().toISOString().split('T')[0],
      remarks: `M-Pesa payment received Ref: ${txRef}`
    };

    const glCredit: GLEntry = {
      id: 'gl-' + Date.now() + '-cr',
      voucherType: 'Payment Entry',
      voucherNo: newPE.voucherNumber,
      account: `1310 - Debtors / Accounts Receivable (${data.tenantName})`,
      debit: 0,
      credit: data.amount,
      postingDate: new Date().toISOString().split('T')[0],
      remarks: `Accounts Receivable settlement against ${data.unitNumber}`
    };
    setGlEntries((prev) => [glDebit, glCredit, ...prev]);

    // 3. Mark corresponding ERPNext Sales Invoice as Paid
    setSalesInvoices((prev) =>
      prev.map((inv) =>
        inv.unitNumber === data.unitNumber
          ? { ...inv, status: 'Paid', outstandingAmount: Math.max(0, inv.outstandingAmount - data.amount) }
          : inv
      )
    );

    // 4. Update tenant balance
    setAllTenants((prev) =>
      prev.map((t) => {
        if (t.unitNumber === data.unitNumber) {
          const newBal = Math.max(0, t.balanceDue - data.amount);
          return {
            ...t,
            balanceDue: newBal,
            paymentStatus: newBal === 0 ? 'paid' : t.paymentStatus
          };
        }
        return t;
      })
    );

    // Update property stats
    setStats((prev) => ({
      ...prev,
      totalCollectedThisMonth: prev.totalCollectedThisMonth + data.amount,
      totalPendingArrears: Math.max(0, prev.totalPendingArrears - data.amount)
    }));

    addToast({
      type: 'success',
      title: 'Payment Reconciled in ERPNext 🧾',
      message: `${formatCurrency(data.amount)} posted to ERPNext Accounts. Receipt #${receiptNumber} generated.`
    });

    return { success: true, payment: newPayment, receiptNumber };
  };

  // Maintenance Management
  const submitMaintenanceTicket = (
    ticketData: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'status' | 'reportedDate'>
  ) => {
    const ticketNo = `MT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: 'tk-' + Date.now(),
      ticketNumber: ticketNo,
      status: 'reported',
      reportedDate: new Date().toISOString().split('T')[0],
      notes: ['Ticket logged in Frappe system.']
    };

    setMaintenanceTickets((prev) => [newTicket, ...prev]);

    setStats((prev) => ({
      ...prev,
      activeMaintenanceTickets: prev.activeMaintenanceTickets + 1
    }));

    addToast({
      type: 'success',
      title: 'Maintenance Request Logged',
      message: `Ticket #${ticketNo} created in Frappe. Property manager has been notified.`
    });
  };

  const updateTicketStatus = (ticketId: string, status: MaintenanceTicket['status'], note?: string) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedNotes = note ? [...(t.notes || []), note] : t.notes;
          return {
            ...t,
            status,
            notes: updatedNotes,
            resolvedDate: status === 'resolved' ? new Date().toISOString().split('T')[0] : t.resolvedDate
          };
        }
        return t;
      })
    );

    if (status === 'resolved') {
      setStats((prev) => ({
        ...prev,
        activeMaintenanceTickets: Math.max(0, prev.activeMaintenanceTickets - 1)
      }));
    }

    addToast({
      type: 'info',
      title: 'Ticket Status Updated',
      message: `Ticket marked as ${status.replace('_', ' ')}.`
    });
  };

  const assignTicketTechnician = (ticketId: string, technicianName: string, technicianPhone: string) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              assignedTechnician: technicianName,
              technicianPhone,
              status: 'assigned',
              notes: [...(t.notes || []), `Assigned to ${technicianName} (${technicianPhone})`]
            }
          : t
      )
    );

    addToast({
      type: 'success',
      title: 'Technician Assigned',
      message: `${technicianName} assigned to repair ticket.`
    });
  };

  // Gate Passes
  const createGatePass = (visitorName: string, visitorPhone: string, unitNumber: string): GatePass => {
    const passCode = `GP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPass: GatePass = {
      id: 'gp-' + Date.now(),
      passCode,
      visitorName,
      visitorPhone,
      unitNumber,
      validDate: new Date().toISOString().split('T')[0],
      status: 'active',
      createdDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGatePasses((prev) => [newPass, ...prev]);

    addToast({
      type: 'success',
      title: 'Digital Gate Pass Generated! 🎟️',
      message: `Passcode ${passCode} is active for ${visitorName}.`
    });

    return newPass;
  };

  // Announcements
  const broadcastAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...data,
      id: 'ann-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    addToast({
      type: 'success',
      title: 'Announcement Broadcasted 📢',
      message: `Notice "${newAnn.title}" sent to all resident tenants.`
    });
  };

  // Tenant Operations (With ERPNext Customer & Sales Invoice Generation)
  const addTenant = (tenantData: Omit<Tenant, 'id' | 'balanceDue' | 'paymentStatus'>) => {
    const newTenant: Tenant = {
      ...tenantData,
      id: 't-' + Date.now(),
      balanceDue: 0,
      paymentStatus: 'paid'
    };

    setAllTenants((prev) => [newTenant, ...prev]);

    // Create automatic ERPNext Sales Invoice for the new tenant
    const newInvoice: SalesInvoice = {
      id: 'sinv-' + Date.now(),
      invoiceNumber: `ACC-SINV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newTenant.name,
      unitNumber: newTenant.unitNumber,
      grandTotal: newTenant.rentAmount,
      outstandingAmount: 0,
      status: 'Paid',
      postingDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      incomeAccount: '4110 - Rental Income - Emerald Heights',
      costCenter: 'Emerald Heights - Operations'
    };
    setSalesInvoices((prev) => [newInvoice, ...prev]);

    // Check if unit already exists, otherwise create it
    setUnits((prev) => {
      const existing = prev.find((u) => u.unitNumber === tenantData.unitNumber);
      if (existing) {
        return prev.map((u) =>
          u.unitNumber === tenantData.unitNumber
            ? {
                ...u,
                status: 'occupied',
                currentTenantId: newTenant.id,
                currentTenantName: newTenant.name,
                rentAmount: tenantData.rentAmount || u.rentAmount,
                depositAmount: tenantData.depositAmount || u.depositAmount
              }
            : u
        );
      } else {
        const newUnit: Unit = {
          id: 'u-' + Date.now(),
          unitNumber: tenantData.unitNumber,
          propertyName: tenantData.propertyName || 'Emerald Heights Residences',
          floor: 1,
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1100,
          rentAmount: tenantData.rentAmount,
          depositAmount: tenantData.depositAmount,
          status: 'occupied',
          currentTenantId: newTenant.id,
          currentTenantName: newTenant.name
        };
        return [newUnit, ...prev];
      }
    });

    // Update stats
    setStats((prev) => {
      const occupied = prev.occupiedUnits + 1;
      return {
        ...prev,
        occupiedUnits: occupied,
        occupancyRate: Math.round((occupied / Math.max(occupied, prev.totalUnits)) * 100)
      };
    });

    addToast({
      type: 'success',
      title: 'Tenant Registered in ERPNext',
      message: `${newTenant.name} registered and Customer & Sales Invoice created in ERPNext Accounts.`
    });
  };

  const sendPaymentReminder = (tenantId: string) => {
    const t = allTenants.find((item) => item.id === tenantId);
    if (!t) return;

    addToast({
      type: 'info',
      title: 'Rent Reminder Dispatched 📱',
      message: `SMS & In-App reminder sent to ${t.name} (${t.phone}) for ${formatCurrency(t.balanceDue || t.rentAmount)}.`
    });
  };

  // Unit Operations
  const addUnit = (unitData: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...unitData,
      id: 'u-' + Date.now()
    };

    setUnits((prev) => [newUnit, ...prev]);

    setStats((prev) => {
      const total = prev.totalUnits + 1;
      const occupied = unitData.status === 'occupied' ? prev.occupiedUnits + 1 : prev.occupiedUnits;
      return {
        ...prev,
        totalUnits: total,
        occupiedUnits: occupied,
        occupancyRate: Math.round((occupied / total) * 100)
      };
    });

    addToast({
      type: 'success',
      title: 'Unit Added to Inventory',
      message: `${newUnit.unitNumber} (${newUnit.bedrooms} Bed) added to estate inventory.`
    });
  };

  const updateUnitStatus = (unitId: string, status: Unit['status']) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              status,
              currentTenantId: status === 'vacant' ? undefined : u.currentTenantId,
              currentTenantName: status === 'vacant' ? undefined : u.currentTenantName
            }
          : u
      )
    );

    addToast({
      type: 'info',
      title: 'Unit Status Updated',
      message: `Unit status set to ${status}.`
    });
  };

  return (
    <TenantContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        currentRole,
        switchRole,
        activeTenant,
        allTenants,
        units,
        payments,
        maintenanceTickets,
        announcements,
        gatePasses,
        documents,
        stats,
        toasts,
        salesInvoices,
        paymentEntries,
        glEntries,
        addToast,
        removeToast,
        payRent,
        submitMaintenanceTicket,
        updateTicketStatus,
        assignTicketTechnician,
        createGatePass,
        broadcastAnnouncement,
        addTenant,
        sendPaymentReminder,
        addUnit,
        updateUnitStatus,
        isPayRentModalOpen,
        setIsPayRentModalOpen,
        isMaintenanceModalOpen,
        setIsMaintenanceModalOpen,
        isGatePassModalOpen,
        setIsGatePassModalOpen,
        isAnnouncementModalOpen,
        setIsAnnouncementModalOpen,
        isAddTenantModalOpen,
        setIsAddTenantModalOpen,
        isAddUnitModalOpen,
        setIsAddUnitModalOpen,
        preselectedUnitNumber,
        setPreselectedUnitNumber,
        activeReceipt,
        setActiveReceipt,
        formatCurrency
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
