export type UserRole = 'tenant' | 'landlord' | 'manager' | 'accountant' | 'caretaker' | 'admin';

export interface UserPermissions {
  properties: boolean;
  units: boolean;
  tenants: boolean;
  accounting: boolean;
  reports: boolean;
  maintenance: boolean;
  users: boolean;
  gatePass: boolean;
  documents: boolean;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  propertyType: 'Apartment Complex' | 'Executive Suites' | 'Commercial' | 'Gated Community';
  totalUnits: number;
  caretakerName: string;
  caretakerPhone: string;
  image?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  propertyId?: string;
  propertyName?: string;
  unitNumber?: string;
  status: 'Active' | 'Inactive' | 'Pending Reset';
  lastLogin?: string;
  avatar?: string;
  permissions: UserPermissions;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unitNumber?: string;
  propertyId?: string;
  propertyName?: string;
  avatar?: string;
  token?: string;
  permissions?: UserPermissions;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitNumber: string;
  rentAmount: number;
  depositAmount: number;
  balanceDue: number;
  paymentStatus: 'paid' | 'due' | 'overdue';
  leaseStart: string;
  leaseEnd: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  vehiclePlate?: string;
  waterMeterNumber?: string;
  lastWaterReading?: number;
  avatar?: string;
}

export interface Unit {
  id: string;
  unitNumber: string;
  propertyId: string;
  propertyName: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  rentAmount: number;
  depositAmount: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  currentTenantId?: string;
  currentTenantName?: string;
  waterMeterNumber?: string;
}

export interface InvoiceItem {
  id: string;
  itemCode: string;
  itemName: string;
  description?: string;
  meterPrevious?: number;
  meterCurrent?: number;
  meterUnits?: number;
  rate: number;
  qty: number;
  amount: number;
  incomeAccount?: string;
  costCenter?: string;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  companyName: string;
  companyPin?: string;
  companyAddress?: string;
  customerName: string;
  customerAddress?: string;
  tenantPhone?: string;
  unitNumber: string;
  propertyId?: string;
  propertyName: string;
  items: InvoiceItem[];
  netTotal: number;
  taxAmount: number;
  grandTotal: number;
  outstandingAmount: number;
  inWords?: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  postingDate: string;
  postingTime?: string;
  dueDate: string;
  incomeAccount: string;
  costCenter: string;
  paymentTerms?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branch: string;
    paybillNumber: string;
    accountReference: string;
  };
  remarks?: string;
}

export interface PaymentEntry {
  id: string;
  voucherNumber: string;
  partyName: string;
  tenantPhone?: string;
  unitNumber: string;
  propertyName?: string;
  paidAmount: number;
  modeOfPayment: 'M-Pesa' | 'Card' | 'Bank Transfer' | 'Cheque' | 'Cash';
  paidToAccount: string;
  referenceNo: string;
  postingDate: string;
  postingTime?: string;
  remarks: string;
}

export interface GLEntry {
  id: string;
  voucherType: 'Sales Invoice' | 'Payment Entry' | 'Expense Entry';
  voucherNo: string;
  account: string;
  debit: number;
  credit: number;
  postingDate: string;
  remarks: string;
}

export interface ExpenseEntry {
  id: string;
  voucherNo: string;
  category: 'Utilities (Water/Power)' | 'Security Services' | 'Repairs & Maintenance' | 'Estate Cleaning' | 'Management Fees';
  propertyName: string;
  amount: number;
  paidTo: string;
  expenseAccount: string;
  postingDate: string;
  remarks: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  propertyId?: string;
  propertyName?: string;
  unitNumber: string;
  tenantName: string;
  tenantPhone: string;
  amount: number;
  type: 'rent' | 'water' | 'electricity' | 'service_charge' | 'deposit';
  method: 'mpesa' | 'card' | 'bank_transfer';
  transactionRef: string;
  invoiceMonth: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  mpesaPhone?: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  propertyId?: string;
  propertyName?: string;
  unitNumber: string;
  tenantName: string;
  tenantPhone: string;
  category: 'plumbing' | 'electrical' | 'carpentry' | 'appliance' | 'hvac' | 'security' | 'painting';
  title: string;
  description: string;
  priority: 'emergency' | 'high' | 'medium' | 'low';
  status: 'reported' | 'assigned' | 'in_progress' | 'resolved';
  assignedTechnician?: string;
  technicianPhone?: string;
  reportedDate: string;
  resolvedDate?: string;
  cost?: number;
  notes?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'utility' | 'maintenance' | 'general' | 'emergency';
  date: string;
  author: string;
  isUrgent: boolean;
  propertyName?: string;
}

export interface GatePass {
  id: string;
  passCode: string;
  visitorName: string;
  visitorPhone: string;
  unitNumber: string;
  validDate: string;
  status: 'active' | 'used' | 'expired';
  createdDate: string;
}

export interface PropertyDocument {
  id: string;
  title: string;
  category: 'lease' | 'house_rules' | 'condition_report' | 'insurance';
  unitNumber: string;
  fileSize: string;
  uploadedDate: string;
}

export interface PropertyStats {
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  totalCollectedThisMonth: number;
  totalPendingArrears: number;
  activeMaintenanceTickets: number;
}
