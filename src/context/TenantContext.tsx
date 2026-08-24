import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserAccount,
  SystemUser,
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
  GLEntry,
  ExpenseEntry
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
  initialGLEntries,
  initialSystemUsers,
  initialExpenses
} from '../data/mockData';
import { numberToKenyanShillings } from '../utils/numberToWords';

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

  // System User Management (Admin)
  users: SystemUser[];
  addUser: (user: Omit<SystemUser, 'id'>) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteUser: (userId: string) => void;
  sendPasswordResetLink: (userId: string) => void;

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

  // ERPNext Accounting Module
  salesInvoices: SalesInvoice[];
  paymentEntries: PaymentEntry[];
  glEntries: GLEntry[];
  expenses: ExpenseEntry[];
  createSalesInvoice: (invoiceData: any) => void;
  createPaymentEntry: (peData: Omit<PaymentEntry, 'id' | 'voucherNumber' | 'postingDate'>) => void;
  deleteSalesInvoice: (id: string) => void;
  deletePaymentEntry: (id: string) => void;
  addExpense: (exp: Omit<ExpenseEntry, 'id' | 'voucherNo' | 'postingDate'>) => void;

  // ERPNext Invoice Viewer
  viewingInvoice: SalesInvoice | null;
  setViewingInvoice: (invoice: SalesInvoice | null) => void;

  // Tenant Editing & Deleting
  updateTenant: (tenantId: string, updatedData: Partial<Tenant>) => void;
  deleteTenant: (tenantId: string) => void;
  bulkImportTenants: (importedTenants: Omit<Tenant, 'id' | 'balanceDue' | 'paymentStatus'>[]) => void;

  // Unit Operations
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnitStatus: (unitId: string, status: Unit['status']) => void;
  deleteUnit: (unitId: string) => void;

  // STK Push Simulation Controller
  isStkModalOpen: boolean;
  setIsStkModalOpen: (open: boolean) => void;
  stkPaymentDetails: any | null;
  triggerMpesaStkPush: (data: any) => void;
  confirmMpesaPayment: (confirmedDetails: any) => void;

  // Modals Controller
  isAddPropertyModalOpen: boolean;
  setIsAddPropertyModalOpen: (open: boolean) => void;
  isAddTenantModalOpen: boolean;
  setIsAddTenantModalOpen: (open: boolean) => void;
  isAddUnitModalOpen: boolean;
  setIsAddUnitModalOpen: (open: boolean) => void;
  isAddSalesInvoiceModalOpen: boolean;
  setIsAddSalesInvoiceModalOpen: (open: boolean) => void;
  isAddPaymentEntryModalOpen: boolean;
  setIsAddPaymentEntryModalOpen: (open: boolean) => void;
  isAddUserModalOpen: boolean;
  setIsAddUserModalOpen: (open: boolean) => void;
  isBulkImportModalOpen: boolean;
  setIsBulkImportModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareDocData: any | null;
  shareDocType: 'invoice' | 'receipt';
  openShareModal: (doc: any, type: 'invoice' | 'receipt') => void;

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

  // Properties & Users
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_properties');
      return saved ? JSON.parse(saved) : initialProperties;
    } catch {
      return initialProperties;
    }
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_users');
      return saved ? JSON.parse(saved) : initialSystemUsers;
    } catch {
      return initialSystemUsers;
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

  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => {
    try {
      const saved = localStorage.getItem('tenanthub_expenses');
      return saved ? JSON.parse(saved) : initialExpenses;
    } catch {
      return initialExpenses;
    }
  });

  const [viewingInvoice, setViewingInvoice] = useState<SalesInvoice | null>(null);

  const [documents] = useState<PropertyDocument[]>(initialDocuments);
  const [stats, setStats] = useState<PropertyStats>(initialStats);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modals state
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isAddSalesInvoiceModalOpen, setIsAddSalesInvoiceModalOpen] = useState(false);
  const [isAddPaymentEntryModalOpen, setIsAddPaymentEntryModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareDocData, setShareDocData] = useState<any | null>(null);
  const [shareDocType, setShareDocType] = useState<'invoice' | 'receipt'>('invoice');

  const [isPayRentModalOpen, setIsPayRentModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isGatePassModalOpen, setIsGatePassModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [preselectedUnitNumber, setPreselectedUnitNumber] = useState<string | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<PaymentRecord | null>(null);

  // STK Push State
  const [isStkModalOpen, setIsStkModalOpen] = useState(false);
  const [stkPaymentDetails, setStkPaymentDetails] = useState<any | null>(null);

  const activeTenant = allTenants[0] || initialTenants[0];

  useEffect(() => {
    localStorage.setItem('tenanthub_properties', JSON.stringify(properties));
    localStorage.setItem('tenanthub_users', JSON.stringify(users));
    localStorage.setItem('tenanthub_tenants', JSON.stringify(allTenants));
    localStorage.setItem('tenanthub_units', JSON.stringify(units));
    localStorage.setItem('tenanthub_payments', JSON.stringify(payments));
    localStorage.setItem('tenanthub_tickets', JSON.stringify(maintenanceTickets));
    localStorage.setItem('tenanthub_sinv', JSON.stringify(salesInvoices));
    localStorage.setItem('tenanthub_pe', JSON.stringify(paymentEntries));
    localStorage.setItem('tenanthub_gl', JSON.stringify(glEntries));
    localStorage.setItem('tenanthub_expenses', JSON.stringify(expenses));
  }, [properties, users, allTenants, units, payments, maintenanceTickets, salesInvoices, paymentEntries, glEntries, expenses]);

  // Auth Methods
  const login = async (email: string, password?: string): Promise<boolean> => {
    if (email.includes('admin') || email.includes('manager')) {
      const managerUser: UserAccount = {
        id: 'usr-manager-1',
        name: 'Faith Chebet (Estate Director)',
        email,
        role: 'manager',
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

  // User Management
  const addUser = (userData: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: 'usr-' + Date.now(),
      lastLogin: 'Never'
    };
    setUsers((prev) => [...prev, newUser]);
    addToast({
      type: 'success',
      title: 'User Account Created 👤',
      message: `User ${newUser.name} registered as ${newUser.role.toUpperCase()}. Invitation link dispatched.`
    });
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    addToast({
      type: 'info',
      title: 'User Role Updated',
      message: `Permissions updated to ${newRole}.`
    });
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast({
      type: 'info',
      title: 'User Account Removed',
      message: 'User removed from access directory.'
    });
  };

  const sendPasswordResetLink = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    addToast({
      type: 'success',
      title: 'Password Reset Link Dispatched 📩',
      message: `Secure reset link generated and sent to ${targetUser.email}.`
    });
  };

  const addProperty = (propData: Omit<Property, 'id'>) => {
    const newProp: Property = {
      ...propData,
      id: 'prop-' + Date.now()
    };
    setProperties((prev) => [...prev, newProp]);

    addToast({
      type: 'success',
      title: 'Property Registered 🏢',
      message: `${newProp.name} (${newProp.location}) added to portfolio.`
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

  // =========================================================================
  // ERPNext SALES INVOICE CREATION
  // =========================================================================
  const createSalesInvoice = (invoiceData: any) => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const invoiceNumber = `ACC-SINV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const inWords = invoiceData.inWords || numberToKenyanShillings(invoiceData.grandTotal);

    const newInvoice: SalesInvoice = {
      companyName: 'EMERALD HEIGHTS PROPERTY MANAGEMENT LTD',
      companyPin: 'P051982734Z',
      companyAddress: 'P.O. Box 48291 - 00100, Ngong Road, Nairobi',
      ...invoiceData,
      id: 'sinv-' + Date.now(),
      invoiceNumber,
      status: 'Unpaid',
      postingDate: formattedDate,
      netTotal: invoiceData.grandTotal,
      taxAmount: 0,
      outstandingAmount: invoiceData.grandTotal,
      inWords,
      incomeAccount: '4110 - Rental Income - Emerald Heights',
      costCenter: 'Emerald Heights - Operations'
    };

    setSalesInvoices((prev) => [newInvoice, ...prev]);

    // Dual GL entries
    const glDebit: GLEntry = {
      id: 'gl-' + Date.now() + '-dr',
      voucherType: 'Sales Invoice',
      voucherNo: invoiceNumber,
      account: `1310 - Debtors / Accounts Receivable (${newInvoice.customerName})`,
      debit: newInvoice.grandTotal,
      credit: 0,
      postingDate: formattedDate,
      remarks: `Sales Invoice billing (Rent & Water) for ${newInvoice.unitNumber}`
    };

    const glCredit: GLEntry = {
      id: 'gl-' + Date.now() + '-cr',
      voucherType: 'Sales Invoice',
      voucherNo: invoiceNumber,
      account: '4110 - Rental Income - Emerald Heights',
      debit: 0,
      credit: newInvoice.grandTotal,
      postingDate: formattedDate,
      remarks: `Rental & Water Revenue recognized: ${newInvoice.remarks || invoiceNumber}`
    };

    setGlEntries((prev) => [glDebit, glCredit, ...prev]);

    // Update tenant balance due
    setAllTenants((prev) =>
      prev.map((t) =>
        t.unitNumber === newInvoice.unitNumber
          ? {
              ...t,
              balanceDue: t.balanceDue + newInvoice.grandTotal,
              paymentStatus: 'due'
            }
          : t
      )
    );

    addToast({
      type: 'success',
      title: 'ERPNext Sales Invoice Issued 🧾',
      message: `Invoice #${invoiceNumber} for ${formatCurrency(newInvoice.grandTotal)} (Rent + Water) posted to ledger.`
    });
  };

  const deleteSalesInvoice = (id: string) => {
    setSalesInvoices((prev) => prev.filter((i) => i.id !== id));
    addToast({
      type: 'info',
      title: 'Sales Invoice Cancelled',
      message: 'Invoice removed from active billing ledger.'
    });
  };

  // =========================================================================
  // ERPNext PAYMENT ENTRY CREATION
  // =========================================================================
  const createPaymentEntry = (
    peData: Omit<PaymentEntry, 'id' | 'voucherNumber' | 'postingDate'>
  ) => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const voucherNumber = `ACC-PAY-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPE: PaymentEntry = {
      ...peData,
      id: 'pe-' + Date.now(),
      voucherNumber,
      postingDate: formattedDate
    };

    setPaymentEntries((prev) => [newPE, ...prev]);

    // Dual GL Entries
    const glDebit: GLEntry = {
      id: 'gl-' + Date.now() + '-dr',
      voucherType: 'Payment Entry',
      voucherNo: voucherNumber,
      account: newPE.paidToAccount,
      debit: newPE.paidAmount,
      credit: 0,
      postingDate: formattedDate,
      remarks: `Payment received Ref: ${newPE.referenceNo}`
    };

    const glCredit: GLEntry = {
      id: 'gl-' + Date.now() + '-cr',
      voucherType: 'Payment Entry',
      voucherNo: voucherNumber,
      account: `1310 - Debtors / Accounts Receivable (${newPE.partyName})`,
      debit: 0,
      credit: newPE.paidAmount,
      postingDate: formattedDate,
      remarks: `Debtor settlement against ${newPE.unitNumber}`
    };

    setGlEntries((prev) => [glDebit, glCredit, ...prev]);

    // Mark matching Sales Invoice as Paid or reduce outstanding amount
    setSalesInvoices((prev) =>
      prev.map((inv) =>
        inv.unitNumber === newPE.unitNumber
          ? {
              ...inv,
              status: inv.outstandingAmount <= newPE.paidAmount ? 'Paid' : inv.status,
              outstandingAmount: Math.max(0, inv.outstandingAmount - newPE.paidAmount)
            }
          : inv
      )
    );

    // Update Tenant balance due
    setAllTenants((prev) =>
      prev.map((t) => {
        if (t.unitNumber === newPE.unitNumber) {
          const newBal = Math.max(0, t.balanceDue - newPE.paidAmount);
          return {
            ...t,
            balanceDue: newBal,
            paymentStatus: newBal === 0 ? 'paid' : t.paymentStatus
          };
        }
        return t;
      })
    );

    addToast({
      type: 'success',
      title: 'Payment Entry Reconciled 💰',
      message: `Voucher #${voucherNumber} (${formatCurrency(newPE.paidAmount)}) posted to ${newPE.paidToAccount}.`
    });
  };

  const deletePaymentEntry = (id: string) => {
    setPaymentEntries((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'info',
      title: 'Payment Entry Voided',
      message: 'Payment voucher cancelled.'
    });
  };

  // Expenses
  const addExpense = (expData: Omit<ExpenseEntry, 'id' | 'voucherNo' | 'postingDate'>) => {
    const voucherNo = `ACC-EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newExp: ExpenseEntry = {
      ...expData,
      id: 'exp-' + Date.now(),
      voucherNo,
      postingDate: new Date().toISOString().split('T')[0]
    };
    setExpenses((prev) => [newExp, ...prev]);

    const glDebit: GLEntry = {
      id: 'gl-' + Date.now() + '-dr',
      voucherType: 'Expense Entry',
      voucherNo,
      account: newExp.expenseAccount,
      debit: newExp.amount,
      credit: 0,
      postingDate: newExp.postingDate,
      remarks: newExp.remarks
    };
    const glCredit: GLEntry = {
      id: 'gl-' + Date.now() + '-cr',
      voucherType: 'Expense Entry',
      voucherNo,
      account: '1110 - KCB Operating Bank Account',
      debit: 0,
      credit: newExp.amount,
      postingDate: newExp.postingDate,
      remarks: `Disbursement to ${newExp.paidTo}`
    };
    setGlEntries((prev) => [glDebit, glCredit, ...prev]);

    addToast({
      type: 'success',
      title: 'Operational Expense Logged 🧾',
      message: `${formatCurrency(newExp.amount)} recorded for ${newExp.category}.`
    });
  };

  // Tenant Editing & Deleting
  const updateTenant = (tenantId: string, updatedData: Partial<Tenant>) => {
    setAllTenants((prev) =>
      prev.map((t) => (t.id === tenantId ? { ...t, ...updatedData } : t))
    );
    addToast({
      type: 'success',
      title: 'Tenant Profile Updated',
      message: 'Tenant records updated successfully.'
    });
  };

  const deleteTenant = (tenantId: string) => {
    const target = allTenants.find((t) => t.id === tenantId);
    if (target) {
      setUnits((prev) =>
        prev.map((u) =>
          u.unitNumber === target.unitNumber
            ? { ...u, status: 'vacant', currentTenantId: undefined, currentTenantName: undefined }
            : u
        )
      );
    }
    setAllTenants((prev) => prev.filter((t) => t.id !== tenantId));
    addToast({
      type: 'info',
      title: 'Tenant Removed',
      message: `${target?.name || 'Tenant'} removed and unit marked as Vacant.`
    });
  };

  const bulkImportTenants = (importedTenants: Omit<Tenant, 'id' | 'balanceDue' | 'paymentStatus'>[]) => {
    const newTenants: Tenant[] = importedTenants.map((t, idx) => ({
      ...t,
      id: 't-imp-' + Date.now() + idx,
      balanceDue: 0,
      paymentStatus: 'paid'
    }));

    setAllTenants((prev) => [...newTenants, ...prev]);

    newTenants.forEach((nt) => {
      setUnits((prev) => {
        const match = prev.find((u) => u.unitNumber === nt.unitNumber);
        if (match) {
          return prev.map((u) =>
            u.unitNumber === nt.unitNumber
              ? { ...u, status: 'occupied', currentTenantId: nt.id, currentTenantName: nt.name }
              : u
          );
        } else {
          return [
            {
              id: 'u-' + Date.now() + Math.random(),
              unitNumber: nt.unitNumber,
              propertyId: nt.propertyId,
              propertyName: nt.propertyName,
              floor: 1,
              bedrooms: 2,
              bathrooms: 2,
              squareFeet: 1100,
              rentAmount: nt.rentAmount,
              depositAmount: nt.depositAmount,
              status: 'occupied',
              currentTenantId: nt.id,
              currentTenantName: nt.name
            },
            ...prev
          ];
        }
      });
    });

    addToast({
      type: 'success',
      title: 'Bulk Import Complete! 🚀',
      message: `Successfully imported ${newTenants.length} tenants into ERPNext directory.`
    });
  };

  // Unit Operations
  const addUnit = (unitData: Omit<Unit, 'id'>) => {
    const newUnit: Unit = { ...unitData, id: 'u-' + Date.now() };
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

  const deleteUnit = (unitId: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== unitId));
    addToast({
      type: 'info',
      title: 'Unit Removed',
      message: 'Unit deleted from estate inventory.'
    });
  };

  const openShareModal = (doc: any, type: 'invoice' | 'receipt') => {
    setShareDocData(doc);
    setShareDocType(type);
    setIsShareModalOpen(true);
  };

  // M-Pesa STK Push
  const triggerMpesaStkPush = (data: any) => {
    setStkPaymentDetails(data);
    setIsStkModalOpen(true);
    setIsPayRentModalOpen(false);
  };

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

    // Matching ERPNext Payment Entry
    createPaymentEntry({
      partyName: stkPaymentDetails.tenantName,
      tenantPhone: stkPaymentDetails.phone,
      unitNumber: stkPaymentDetails.unitNumber,
      propertyName: stkPaymentDetails.propertyName || 'Emerald Heights Luxury Residences',
      paidAmount: stkPaymentDetails.amount,
      modeOfPayment: 'M-Pesa',
      paidToAccount: '1120 - Safaricom M-Pesa Till Account',
      referenceNo: txRef,
      remarks: `${stkPaymentDetails.invoiceMonth} ${stkPaymentDetails.type.toUpperCase()} settlement for ${stkPaymentDetails.unitNumber}`
    });

    setIsStkModalOpen(false);
    setActiveReceipt(newPayment);
  };

  const payRent = async (data: any) => triggerMpesaStkPush(data);

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
    addToast({
      type: 'success',
      title: 'Issue Logged 🛠️',
      message: `Ticket #${ticketNo} logged. Property manager notified.`
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
      title: 'Gate Pass Active! 🎟️',
      message: `Passcode ${passCode} generated.`
    });
    return newPass;
  };

  const broadcastAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...data,
      id: 'ann-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addToast({
      type: 'success',
      title: 'Notice Broadcasted 📢',
      message: `Notice "${newAnn.title}" sent.`
    });
  };

  const addTenant = (tenantData: Omit<Tenant, 'id' | 'balanceDue' | 'paymentStatus'>) => {
    bulkImportTenants([tenantData]);
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
        users,
        addUser,
        updateUserRole,
        deleteUser,
        sendPasswordResetLink,
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
        expenses,
        createSalesInvoice,
        createPaymentEntry,
        deleteSalesInvoice,
        deletePaymentEntry,
        addExpense,
        viewingInvoice,
        setViewingInvoice,
        updateTenant,
        deleteTenant,
        bulkImportTenants,
        addUnit,
        updateUnitStatus,
        deleteUnit,
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
        openShareModal,
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
