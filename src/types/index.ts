export type UserRole = 'tenant' | 'landlord' | 'manager';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  unitNumber: string;
  propertyName: string;
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
  avatar?: string;
}

export interface Unit {
  id: string;
  unitNumber: string;
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
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
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
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
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
