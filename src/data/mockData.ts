import {
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

export const initialProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Emerald Heights Luxury Residences',
    location: 'Ngong Road, Nairobi',
    propertyType: 'Apartment Complex',
    totalUnits: 24,
    caretakerName: 'John Mwangi',
    caretakerPhone: '+254 759 508 348',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'prop-2',
    name: 'Sapphire Palms Executive Suites',
    location: 'Kilimani, Nairobi',
    propertyType: 'Executive Suites',
    totalUnits: 16,
    caretakerName: 'Dennis Ochieng',
    caretakerPhone: '+254 722 000 119',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'prop-3',
    name: 'Oakwood Court Townhouses',
    location: 'Westlands, Nairobi',
    propertyType: 'Gated Community',
    totalUnits: 12,
    caretakerName: 'Erick Karanja',
    caretakerPhone: '+254 711 222 333',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop'
  }
];

export const initialUnits: Unit[] = [
  {
    id: 'u-1a',
    unitNumber: 'Unit 1A',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
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
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
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
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
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
    id: 'u-3c',
    unitNumber: 'Unit 3C',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    floor: 3,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 1600,
    rentAmount: 65000,
    depositAmount: 65000,
    status: 'vacant'
  },
  {
    id: 'u-4b',
    unitNumber: 'Unit 4B',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
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
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    floor: 5,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 1850,
    rentAmount: 85000,
    depositAmount: 85000,
    status: 'maintenance'
  },
  // Sapphire Palms Units
  {
    id: 'u-sp-101',
    unitNumber: 'Suite 101',
    propertyId: 'prop-2',
    propertyName: 'Sapphire Palms Executive Suites',
    floor: 1,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 850,
    rentAmount: 55000,
    depositAmount: 55000,
    status: 'vacant'
  },
  {
    id: 'u-sp-202',
    unitNumber: 'Suite 202',
    propertyId: 'prop-2',
    propertyName: 'Sapphire Palms Executive Suites',
    floor: 2,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1300,
    rentAmount: 75000,
    depositAmount: 75000,
    status: 'vacant'
  },
  // Oakwood Court Units
  {
    id: 'u-ow-01',
    unitNumber: 'Villa 01',
    propertyId: 'prop-3',
    propertyName: 'Oakwood Court Townhouses',
    floor: 1,
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 2800,
    rentAmount: 140000,
    depositAmount: 140000,
    status: 'vacant'
  }
];

export const initialTenants: Tenant[] = [
  {
    id: 't-101',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    phone: '+254 712 345 678',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitId: 'u-4b',
    unitNumber: 'Unit 4B',
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
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitId: 'u-2a',
    unitNumber: 'Unit 2A',
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
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitId: 'u-1c',
    unitNumber: 'Unit 1C',
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
    propertyName: 'Emerald Heights Luxury Residences',
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
    propertyName: 'Emerald Heights Luxury Residences',
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
  }
];

export const initialMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'tk-101',
    ticketNumber: 'MT-2026-042',
    propertyName: 'Emerald Heights Luxury Residences',
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
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Routine Water Tank Cleaning & Pressure Testing',
    content: 'Nairobi Water supply to overhead tanks will undergo annual disinfection on Saturday, Aug 29 from 9:00 AM to 2:00 PM.',
    category: 'utility',
    date: '2026-08-22',
    author: 'Estate Management',
    isUrgent: true,
    propertyName: 'Emerald Heights Luxury Residences'
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
    title: 'Resident Bylaws & Estate House Rules',
    category: 'house_rules',
    unitNumber: 'Unit 4B',
    fileSize: '450 KB (PDF)',
    uploadedDate: '2025-11-01'
  }
];

export const initialStats: PropertyStats = {
  totalUnits: 52,
  occupiedUnits: 46,
  occupancyRate: 88.5,
  totalCollectedThisMonth: 1980000,
  totalPendingArrears: 124000,
  activeMaintenanceTickets: 3
};

export const initialSalesInvoices: SalesInvoice[] = [
  {
    id: 'sinv-001',
    invoiceNumber: 'ACC-SINV-2026-0801',
    customerName: 'John Kamau',
    unitNumber: 'Unit 4B',
    propertyName: 'Emerald Heights Luxury Residences',
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
    propertyName: 'Emerald Heights Luxury Residences',
    grandTotal: 48000,
    outstandingAmount: 48000,
    status: 'Unpaid',
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
    propertyName: 'Emerald Heights Luxury Residences',
    paidAmount: 48000,
    modeOfPayment: 'M-Pesa',
    paidToAccount: '1120 - Safaricom M-Pesa Till Account',
    referenceNo: 'QKD8921KL9',
    postingDate: '2026-08-04',
    remarks: 'August 2026 Rent Settlement for Unit 4B'
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
  }
];
