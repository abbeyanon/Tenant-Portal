import {
  Tenant,
  Unit,
  PaymentRecord,
  MaintenanceTicket,
  Announcement,
  GatePass,
  PropertyDocument,
  PropertyStats
} from '../types';

export const initialUnits: Unit[] = [
  {
    id: 'u-1a',
    unitNumber: 'Unit 1A',
    propertyName: 'Emerald Heights Residences',
    floor: 1,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 720,
    rentAmount: 38000,
    depositAmount: 38000,
    status: 'vacant'
  },
  {
    id: 'u-1b',
    unitNumber: 'Unit 1B',
    propertyName: 'Emerald Heights Residences',
    floor: 1,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 720,
    rentAmount: 38000,
    depositAmount: 38000,
    status: 'vacant'
  },
  {
    id: 'u-1c',
    unitNumber: 'Unit 1C',
    propertyName: 'Emerald Heights Residences',
    floor: 1,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 750,
    rentAmount: 38000,
    depositAmount: 38000,
    status: 'occupied',
    currentTenantId: 't-103',
    currentTenantName: 'David Omondi'
  },
  {
    id: 'u-2a',
    unitNumber: 'Unit 2A',
    propertyName: 'Emerald Heights Residences',
    floor: 2,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1150,
    rentAmount: 48000,
    depositAmount: 48000,
    status: 'occupied',
    currentTenantId: 't-102',
    currentTenantName: 'Sarah Mutua'
  },
  {
    id: 'u-2b',
    unitNumber: 'Unit 2B',
    propertyName: 'Emerald Heights Residences',
    floor: 2,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1150,
    rentAmount: 48000,
    depositAmount: 48000,
    status: 'vacant'
  },
  {
    id: 'u-3a',
    unitNumber: 'Unit 3A',
    propertyName: 'Emerald Heights Residences',
    floor: 3,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    rentAmount: 50000,
    depositAmount: 50000,
    status: 'vacant'
  },
  {
    id: 'u-3c',
    unitNumber: 'Unit 3C',
    propertyName: 'Emerald Heights Residences',
    floor: 3,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 1600,
    rentAmount: 65000,
    depositAmount: 65000,
    status: 'vacant'
  },
  {
    id: 'u-4a',
    unitNumber: 'Unit 4A',
    propertyName: 'Emerald Heights Residences',
    floor: 4,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1150,
    rentAmount: 48000,
    depositAmount: 48000,
    status: 'vacant'
  },
  {
    id: 'u-4b',
    unitNumber: 'Unit 4B',
    propertyName: 'Emerald Heights Residences',
    floor: 4,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1150,
    rentAmount: 48000,
    depositAmount: 48000,
    status: 'occupied',
    currentTenantId: 't-101',
    currentTenantName: 'John Kamau'
  },
  {
    id: 'u-5a',
    unitNumber: 'Unit 5A (Penthouse)',
    propertyName: 'Emerald Heights Residences',
    floor: 5,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 1850,
    rentAmount: 85000,
    depositAmount: 85000,
    status: 'maintenance'
  }
];

export const initialTenants: Tenant[] = [
  {
    id: 't-101',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    phone: '+254 712 345 678',
    unitId: 'u-4b',
    unitNumber: 'Unit 4B',
    propertyName: 'Emerald Heights Luxury Residences',
    rentAmount: 48000,
    depositAmount: 48000,
    balanceDue: 0,
    paymentStatus: 'paid',
    leaseStart: '2025-11-01',
    leaseEnd: '2026-10-31',
    emergencyContact: {
      name: 'Grace Wambui (Spouse)',
      phone: '+254 722 112 233',
      relationship: 'Spouse'
    },
    vehiclePlate: 'KDK 892M',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 't-102',
    name: 'Sarah Mutua',
    email: 'sarah.mutua@example.com',
    phone: '+254 723 456 789',
    unitId: 'u-2a',
    unitNumber: 'Unit 2A',
    propertyName: 'Emerald Heights Luxury Residences',
    rentAmount: 48000,
    depositAmount: 48000,
    balanceDue: 48000,
    paymentStatus: 'due',
    leaseStart: '2025-08-15',
    leaseEnd: '2026-08-14',
    emergencyContact: {
      name: 'Daniel Mutua (Brother)',
      phone: '+254 733 998 877',
      relationship: 'Brother'
    },
    vehiclePlate: 'KDF 412X',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 't-103',
    name: 'David Omondi',
    email: 'david.omondi@example.com',
    phone: '+254 734 567 890',
    unitId: 'u-1c',
    unitNumber: 'Unit 1C',
    propertyName: 'Emerald Heights Luxury Residences',
    rentAmount: 38000,
    depositAmount: 38000,
    balanceDue: 76000,
    paymentStatus: 'overdue',
    leaseStart: '2025-06-01',
    leaseEnd: '2026-05-31',
    emergencyContact: {
      name: 'Mary Achieng',
      phone: '+254 711 556 677',
      relationship: 'Sister'
    },
    vehiclePlate: 'KCL 190P',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-001',
    receiptNumber: 'TH-REC-2026-0812',
    unitNumber: 'Unit 4B',
    tenantName: 'John Kamau',
    tenantPhone: '+254 712 345 678',
    amount: 48000,
    type: 'rent',
    method: 'mpesa',
    transactionRef: 'QKD8921KL9',
    invoiceMonth: 'August 2026',
    status: 'completed',
    date: '2026-08-04 10:24:15'
  },
  {
    id: 'pay-002',
    receiptNumber: 'TH-REC-2026-0813',
    unitNumber: 'Unit 4B',
    tenantName: 'John Kamau',
    tenantPhone: '+254 712 345 678',
    amount: 3200,
    type: 'water',
    method: 'mpesa',
    transactionRef: 'QKX4410LM2',
    invoiceMonth: 'August 2026',
    status: 'completed',
    date: '2026-08-05 14:10:00'
  },
  {
    id: 'pay-003',
    receiptNumber: 'TH-REC-2026-0701',
    unitNumber: 'Unit 2A',
    tenantName: 'Sarah Mutua',
    tenantPhone: '+254 723 456 789',
    amount: 48000,
    type: 'rent',
    method: 'card',
    transactionRef: 'CRD_991204128',
    invoiceMonth: 'July 2026',
    status: 'completed',
    date: '2026-07-03 09:30:12'
  }
];

export const initialMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'tk-101',
    ticketNumber: 'MT-2026-042',
    unitNumber: 'Unit 4B',
    tenantName: 'John Kamau',
    tenantPhone: '+254 712 345 678',
    category: 'plumbing',
    title: 'Master Bathroom Mixer Tap Dripping Water',
    description: 'The hot water mixer tap in the ensuite bathroom is leaking slowly under the vanity cabinet.',
    priority: 'medium',
    status: 'in_progress',
    assignedTechnician: 'Peter Mwangi (Lead Plumber)',
    technicianPhone: '+254 722 445 566',
    reportedDate: '2026-08-20',
    notes: ['Technician inspected seals on Aug 21. Replacement ceramic cartridge ordered.']
  },
  {
    id: 'tk-102',
    ticketNumber: 'MT-2026-044',
    unitNumber: 'Unit 2A',
    tenantName: 'Sarah Mutua',
    tenantPhone: '+254 723 456 789',
    category: 'electrical',
    title: 'Kitchen Circuit Breaker Tripping on Microwave Use',
    description: 'Whenever both the microwave and kettle are on, the 20A kitchen breaker trips.',
    priority: 'high',
    status: 'assigned',
    assignedTechnician: 'Dennis Ochieng (Electrician)',
    technicianPhone: '+254 733 112 244',
    reportedDate: '2026-08-22',
    notes: ['Scheduled electrical load audit for Monday morning.']
  },
  {
    id: 'tk-103',
    ticketNumber: 'MT-2026-039',
    unitNumber: 'Unit 1C',
    tenantName: 'David Omondi',
    tenantPhone: '+254 734 567 890',
    category: 'carpentry',
    title: 'Balcony Sliding Door Track Jammed',
    description: 'Sliding aluminum door roller wheel popped off track.',
    priority: 'low',
    status: 'resolved',
    assignedTechnician: 'Erick Karanja (Technician)',
    technicianPhone: '+254 700 889 900',
    reportedDate: '2026-08-10',
    resolvedDate: '2026-08-12',
    cost: 2500,
    notes: ['Replaced nylon rollers and lubricated track. Tenant signed sign-off form.']
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Routine Water Tank Cleaning & Pressure Testing',
    content: 'Nairobi Water supply to overhead tanks will undergo annual disinfection on Saturday, Aug 29 from 9:00 AM to 2:00 PM. Please store adequate drinking water.',
    category: 'utility',
    date: '2026-08-22',
    author: 'Estate Management',
    isUrgent: true
  },
  {
    id: 'ann-2',
    title: 'Solar Backup Inverter Upgrades Completed',
    content: 'All corridor lights, security perimeter fences, and borehole pumps are now wired to the 30kVA solar hybrid system ensuring 100% uptime during national grid power blackouts.',
    category: 'maintenance',
    date: '2026-08-18',
    author: 'Caretaker Office',
    isUrgent: false
  },
  {
    id: 'ann-3',
    title: 'Garbage Collection Schedule Reminder',
    content: 'Refuse collection occurs every Tuesday and Friday morning at 7:30 AM. Kindly place securely tied bin bags in the ground-floor refuse chutes.',
    category: 'general',
    date: '2026-08-15',
    author: 'Property Manager',
    isUrgent: false
  }
];

export const initialGatePasses: GatePass[] = [
  {
    id: 'gp-1',
    passCode: 'GP-8924',
    visitorName: 'Brian Mutiso (Delivery)',
    visitorPhone: '+254 711 223 344',
    unitNumber: 'Unit 4B',
    validDate: '2026-08-24',
    status: 'active',
    createdDate: '2026-08-24 08:30'
  }
];

export const initialDocuments: PropertyDocument[] = [
  {
    id: 'doc-1',
    title: 'Residential Tenancy Agreement (Unit 4B)',
    category: 'lease',
    unitNumber: 'Unit 4B',
    fileSize: '1.4 MB (Signed PDF)',
    uploadedDate: '2025-11-01'
  },
  {
    id: 'doc-2',
    title: 'Emerald Heights Resident Bylaws & Estate Rules',
    category: 'house_rules',
    unitNumber: 'Unit 4B',
    fileSize: '450 KB (PDF)',
    uploadedDate: '2025-11-01'
  },
  {
    id: 'doc-3',
    title: 'Move-in Fixture Inspection & Inventory Checklist',
    category: 'condition_report',
    unitNumber: 'Unit 4B',
    fileSize: '820 KB (PDF)',
    uploadedDate: '2025-11-02'
  }
];

export const initialStats: PropertyStats = {
  totalUnits: 24,
  occupiedUnits: 22,
  occupancyRate: 91.7,
  totalCollectedThisMonth: 1152000,
  totalPendingArrears: 96000,
  activeMaintenanceTickets: 3
};

// ERPNext Accounting Seed Records
export const initialSalesInvoices: SalesInvoice[] = [
  {
    id: 'sinv-001',
    invoiceNumber: 'ACC-SINV-2026-0801',
    customerName: 'John Kamau',
    unitNumber: 'Unit 4B',
    grandTotal: 48000,
    outstandingAmount: 0,
    status: 'Paid',
    postingDate: '2026-08-01',
    dueDate: '2026-08-05',
    incomeAccount: '4110 - Rental Income - Emerald Heights',
    costCenter: 'Emerald Heights - Operations'
  },
  {
    id: 'sinv-002',
    invoiceNumber: 'ACC-SINV-2026-0802',
    customerName: 'Sarah Mutua',
    unitNumber: 'Unit 2A',
    grandTotal: 48000,
    outstandingAmount: 48000,
    status: 'Unpaid',
    postingDate: '2026-08-01',
    dueDate: '2026-08-05',
    incomeAccount: '4110 - Rental Income - Emerald Heights',
    costCenter: 'Emerald Heights - Operations'
  },
  {
    id: 'sinv-003',
    invoiceNumber: 'ACC-SINV-2026-0803',
    customerName: 'David Omondi',
    unitNumber: 'Unit 1C',
    grandTotal: 38000,
    outstandingAmount: 76000,
    status: 'Overdue',
    postingDate: '2026-08-01',
    dueDate: '2026-08-05',
    incomeAccount: '4110 - Rental Income - Emerald Heights',
    costCenter: 'Emerald Heights - Operations'
  }
];

export const initialPaymentEntries: PaymentEntry[] = [
  {
    id: 'pe-001',
    voucherNumber: 'ACC-PAY-2026-0089',
    partyName: 'John Kamau',
    unitNumber: 'Unit 4B',
    paidAmount: 48000,
    modeOfPayment: 'M-Pesa',
    paidToAccount: '1120 - Safaricom M-Pesa Till Account',
    referenceNo: 'QKD8921KL9',
    postingDate: '2026-08-04',
    remarks: 'August 2026 Rent Settlement for Unit 4B'
  },
  {
    id: 'pe-002',
    voucherNumber: 'ACC-PAY-2026-0090',
    partyName: 'John Kamau',
    unitNumber: 'Unit 4B',
    paidAmount: 3200,
    modeOfPayment: 'M-Pesa',
    paidToAccount: '1120 - Safaricom M-Pesa Till Account',
    referenceNo: 'QKX4410LM2',
    postingDate: '2026-08-05',
    remarks: 'Water Utility meter settlement for Unit 4B'
  }
];

export const initialGLEntries: GLEntry[] = [
  {
    id: 'gl-001',
    voucherType: 'Sales Invoice',
    voucherNo: 'ACC-SINV-2026-0801',
    account: '1310 - Debtors / Accounts Receivable (John Kamau)',
    debit: 48000,
    credit: 0,
    postingDate: '2026-08-01',
    remarks: 'Rent Invoice for Unit 4B'
  },
  {
    id: 'gl-002',
    voucherType: 'Sales Invoice',
    voucherNo: 'ACC-SINV-2026-0801',
    account: '4110 - Rental Income - Emerald Heights',
    debit: 0,
    credit: 48000,
    postingDate: '2026-08-01',
    remarks: 'Rental Income recognized for August 2026'
  },
  {
    id: 'gl-003',
    voucherType: 'Payment Entry',
    voucherNo: 'ACC-PAY-2026-0089',
    account: '1120 - Safaricom M-Pesa Till Account',
    debit: 48000,
    credit: 0,
    postingDate: '2026-08-04',
    remarks: 'M-Pesa rent receipt QKD8921KL9'
  },
  {
    id: 'gl-004',
    voucherType: 'Payment Entry',
    voucherNo: 'ACC-PAY-2026-0089',
    account: '1310 - Debtors / Accounts Receivable (John Kamau)',
    debit: 0,
    credit: 48000,
    postingDate: '2026-08-04',
    remarks: 'Debtor settlement against ACC-SINV-2026-0801'
  }
];
