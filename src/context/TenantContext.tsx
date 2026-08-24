import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserAccount,
  Property,
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
  initialProperties,
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
  // Auth & Roles
  isAuthenticated: boolean;
  currentUser: UserAccount;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;

  // Multi-Property Management
  properties: Property[];
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  addProperty: (prop: Omit<Property, 'id'>) => void;

  // Core Data
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

  // ERPNext Accounting
  salesInvoices: SalesInvoice[];
  paymentEntries: PaymentEntry[];
  glEntries: GLEntry[];

  // STK Push Simulation Controller
  isStkModalOpen: boolean;
  setIsStkModalOpen: (open: boolean) => void;
  stkPaymentDetails: any | null;
  triggerMpesaStkPush: (data: {
    amount: number;
    phone: string;
    unitNumber: string;
    propertyName?: string;
    tenantName: string;
    type: PaymentRecord['type'];
    invoiceMonth: string;
  }) => void;
  confirmMpesaPayment: (confirmedDetails: any) => void;

  // Modals Controller
  isAddPropertyModalOpen: boolean;
  setIsAddPropertyModalOpen: (open: boolean) => void;
  isAddTenantModalOpen: boolean;
  setIsAddTenantModalOpen: (open: boolean) => void;
  isAddUnitModalOpen: boolean;
  setIsAddUnitModalOpen: (open: boolean) => void;
  isPayRentModalOpen: boolean;
  setIsPayRentModalOpen: (open: boolean) => void;
  isMaintenanceModalOpen: boolean;
  setIsMaintenanceModalOpen: (open: boolean) => void;
  isGatePassModalOpen: boolean;
  setIsGatePassModalOpen: (open: boolean) => void;
  isAnnouncementModalOpen: boolean;
  setIsAnnouncementModalOpen: (open: boolean) => void;
  preselectedUnitNumber: string | null;
  setPreselectedUnitNumber: (unitNumber: string | null) => void;
  activeReceipt: PaymentRecord | null;
  setActiveReceipt: (receipt: PaymentRecord | null) => void;

  // Operations
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  payRent: (paymentData: any) => Promise<any>;
  submitMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'status' | 'reportedDate'>) => void;
  updateTicketStatus: (ticketId: string, status: MaintenanceTicket['status'], note?: string) => void;
  assignTicketTechnician: (ticketId: string, technicianName: string, technicianPhone: string) => void;
  createGatePass: (visitorName: string, visitorPhone: string, unitNumber: string) => GatePass;
  broadcastAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  addTenant: (tenant: Omit<Tenant, 'id' | 'balanceDue' | 'paymentStatus'>) => void;
  sendPaymentReminder: (tenantId: string) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnitStatus: (unitId: string, status: Unit['status']) => void;
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
        propertyName: 'Emerald Heights Luxury Residences',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
      };
    } catch {
      return {
        id: 'usr-tenant-1',
        name: 'John Kamau',
        email: 'john.kamau@example.com',
        role: 'tenant',
        unitNumber: 'Unit 4B',
        propertyName: 'Emerald Heights Luxury Residences'
      };
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tenanthub_auth') !== 'false';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('tenanthub_role') as UserRole) || 'tenant';
  });

  // Multi-Property State
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_properties');
      return saved ? JSON.parse(saved) : initialProperties;
    } catch {
      return initialProperties;
    }
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');

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
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isPayRentModalOpen, setIsPayRentModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isGatePassModalOpen, setIsGatePassModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [preselectedUnitNumber, setPreselectedUnitNumber] = useState<string | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<PaymentRecord | null>(null);

  // STK Push State
  const [isStkModalOpen, setIsStkModalOpen] = useState(false);
  const [stkPaymentDetails, setStkPaymentDetails] = useState<any | null>(null);

  const activeTenant = allTenants[0];

  useEffect(() => {
    localStorage.setItem('tenanthub_properties', JSON.stringify(properties));
    localStorage.setItem('tenanthub_tenants', JSON.stringify(allTenants));
    localStorage.setItem('tenanthub_units', JSON.stringify(units));
    localStorage.setItem('tenanthub_payments', JSON.stringify(payments));
    localStorage.setItem('tenanthub_tickets', JSON.stringify(maintenanceTickets));
    localStorage.setItem('tenanthub_sinv', JSON.stringify(salesInvoices));
    localStorage.setItem('tenanthub_pe', JSON.stringify(paymentEntries));
    localStorage.setItem('tenanthub_gl', JSON.stringify(glEntries));
  }, [properties, allTenants, units, payments, maintenanceTickets, salesInvoices, paymentEntries, glEntries]);

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
        propertyName: 'Emerald Heights Luxury Residences',
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
      message: 'You have been logged out of the portal.'
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
      message: `Switched view to ${role === 'tenant' ? 'Resident Tenant' : 'Property Manager / Landlord'}.`
    });
  };

  // Add Property
  const addProperty = (propData: Omit<Property, 'id'>) => {
    const newProp: Property = {
      ...propData,
      id: 'prop-' + Date.now()
    };
    setProperties((prev) => [...prev, newProp]);

    addToast({
      type: 'success',
      title: 'Property Registered 🏢',
      message: `${newProp.name} (${newProp.location}) added to your portfolio.`
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

  // M-Pesa STK Push Trigger
  const triggerMpesaStkPush = (data: {
    amount: number;
    phone: string;
    unitNumber: string;
    propertyName?: string;
    tenantName: string;
    type: PaymentRecord['type'];
    invoiceMonth: string;
  }) => {
    setStkPaymentDetails(data);
    setIsStkModalOpen(true);
    setIsPayRentModalOpen(false);

    addToast({
      type: 'info',
      title: 'STK Push Dispatched 📲',
      message: `Prompt sent to ${data.phone}. Please authorize with your 4-digit PIN.`
    });
  };

  // M-Pesa STK Push Confirmation & Reconciliation
  const confirmMpesaPayment = (confirmedDetails: any) => {
    if (!stkPaymentDetails) return;

    const receiptNumber = `TH-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txRef = confirmedDetails.transactionRef || `QK${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      receiptNumber,
      propertyName: stkPaymentDetails.propertyName || 'Emerald Heights Luxury Residences',
      unitNumber: stkPaymentDetails.unitNumber,
      tenantName: stkPaymentDetails.tenantName,
      tenantPhone: stkPaymentDetails.phone,
      amount: stkPaymentDetails.amount,
      type: stkPaymentDetails.type,
      method: 'mpesa',
      transactionRef: txRef,
      invoiceMonth: stkPaymentDetails.invoiceMonth,
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setPayments((prev) => [newPayment, ...prev]);

    // 1. Create ERPNext Payment Entry
    const newPE: PaymentEntry = {
      id: 'pe-' + Date.now(),
      voucherNumber: `ACC-PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      partyName: stkPaymentDetails.tenantName,
      unitNumber: stkPaymentDetails.unitNumber,
      propertyName: stkPaymentDetails.propertyName || 'Emerald Heights Luxury Residences',
      paidAmount: stkPaymentDetails.amount,
      modeOfPayment: 'M-Pesa',
      paidToAccount: '1120 - Safaricom M-Pesa Till Account',
      referenceNo: txRef,
      postingDate: new Date().toISOString().split('T')[0],
      remarks: `${stkPaymentDetails.invoiceMonth} ${stkPaymentDetails.type.toUpperCase()} settlement for ${stkPaymentDetails.unitNumber}`
    };
    setPaymentEntries((prev) => [newPE, ...prev]);

    // 2. Post dual GL Entries
    const glDebit: GLEntry = {
      id: 'gl-' + Date.now() + '-dr',
      voucherType: 'Payment Entry',
      voucherNo: newPE.voucherNumber,
      account: '1120 - Safaricom M-Pesa Till Account',
      debit: stkPaymentDetails.amount,
      credit: 0,
      postingDate: new Date().toISOString().split('T')[0],
      remarks: `M-Pesa payment received Ref: ${txRef}`
    };

    const glCredit: GLEntry = {
      id: 'gl-' + Date.now() + '-cr',
      voucherType: 'Payment Entry',
      voucherNo: newPE.voucherNumber,
      account: `1310 - Debtors / Accounts Receivable (${stkPaymentDetails.tenantName})`,
      debit: 0,
      credit: stkPaymentDetails.amount,
      postingDate: new Date().toISOString().split('T')[0],
      remarks: `Settlement against ${stkPaymentDetails.unitNumber}`
    };
    setGlEntries((prev) => [glDebit, glCredit, ...prev]);

    // 3. Mark matching ERPNext Sales Invoice as Paid
    setSalesInvoices((prev) =>
      prev.map((inv) =>
        inv.unitNumber === stkPaymentDetails.unitNumber
          ? { ...inv, status: 'Paid', outstandingAmount: Math.max(0, inv.outstandingAmount - stkPaymentDetails.amount) }
          : inv
      )
    );

    // 4. Update tenant balance
    setAllTenants((prev) =>
      prev.map((t) => {
        if (t.unitNumber === stkPaymentDetails.unitNumber) {
          const newBal = Math.max(0, t.balanceDue - stkPaymentDetails.amount);
          return {
            ...t,
            balanceDue: newBal,
            paymentStatus: newBal === 0 ? 'paid' : t.paymentStatus
          };
        }
        return t;
      })
    );

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalCollectedThisMonth: prev.totalCollectedThisMonth + stkPaymentDetails.amount,
      totalPendingArrears: Math.max(0, prev.totalPendingArrears - stkPaymentDetails.amount)
    }));

    setIsStkModalOpen(false);
    setActiveReceipt(newPayment);

    addToast({
      type: 'success',
      title: 'M-Pesa Payment Reconciled 🧾',
      message: `${formatCurrency(stkPaymentDetails.amount)} received via M-Pesa. Receipt #${receiptNumber} generated.`
    });
  };

  const payRent = async (data: any) => {
    return triggerMpesaStkPush(data);
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
      title: 'Maintenance Issue Logged 🛠️',
      message: `Ticket #${ticketNo} logged. Property manager and technician have been notified.`
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
      message: `Notice "${newAnn.title}" broadcasted to residents.`
    });
  };

  // Tenant Operations (With Property Linking)
  const addTenant = (tenantData: Omit<Tenant, 'id' | 'balanceDue' | 'paymentStatus'>) => {
    const newTenant: Tenant = {
      ...tenantData,
      id: 't-' + Date.now(),
      balanceDue: 0,
      paymentStatus: 'paid'
    };

    setAllTenants((prev) => [newTenant, ...prev]);

    // Create automatic ERPNext Sales Invoice
    const newInvoice: SalesInvoice = {
      id: 'sinv-' + Date.now(),
      invoiceNumber: `ACC-SINV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newTenant.name,
      unitNumber: newTenant.unitNumber,
      propertyName: newTenant.propertyName,
      grandTotal: newTenant.rentAmount,
      outstandingAmount: 0,
      status: 'Paid',
      postingDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      incomeAccount: '4110 - Rental Income',
      costCenter: 'Operations'
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
                propertyId: newTenant.propertyId,
                propertyName: newTenant.propertyName,
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
          propertyId: newTenant.propertyId,
          propertyName: newTenant.propertyName,
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

    addToast({
      type: 'success',
      title: 'Tenant Registered in ERPNext',
      message: `${newTenant.name} registered to ${newTenant.propertyName} (${newTenant.unitNumber}).`
    });
  };

  const sendPaymentReminder = (tenantId: string) => {
    const t = allTenants.find((item) => item.id === tenantId);
    if (!t) return;

    addToast({
      type: 'info',
      title: 'Rent Reminder Dispatched 📱',
      message: `SMS reminder sent to ${t.name} (${t.phone}) for ${formatCurrency(t.balanceDue || t.rentAmount)}.`
    });
  };

  // Unit Operations (With Property Linking)
  const addUnit = (unitData: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...unitData,
      id: 'u-' + Date.now()
    };

    setUnits((prev) => [newUnit, ...prev]);

    addToast({
      type: 'success',
      title: 'Unit Added to Inventory',
      message: `${newUnit.unitNumber} (${newUnit.bedrooms} Bed) added to ${newUnit.propertyName}.`
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
        properties,
        selectedPropertyId,
        setSelectedPropertyId,
        addProperty,
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
        isStkModalOpen,
        setIsStkModalOpen,
        stkPaymentDetails,
        triggerMpesaStkPush,
        confirmMpesaPayment,
        isAddPropertyModalOpen,
        setIsAddPropertyModalOpen,
        isAddTenantModalOpen,
        setIsAddTenantModalOpen,
        isAddUnitModalOpen,
        setIsAddUnitModalOpen,
        isPayRentModalOpen,
        setIsPayRentModalOpen,
        isMaintenanceModalOpen,
        setIsMaintenanceModalOpen,
        isGatePassModalOpen,
        setIsGatePassModalOpen,
        isAnnouncementModalOpen,
        setIsAnnouncementModalOpen,
        preselectedUnitNumber,
        setPreselectedUnitNumber,
        activeReceipt,
        setActiveReceipt,
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
