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
  GLEntry,
  SystemUser,
  ExpenseEntry
} from '../types';

// Multi-Property Portfolios
export const initialProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Emerald Heights Luxury Residences',
    location: 'Ngong Road, Nairobi',
    propertyType: 'Apartment Complex',
    totalUnits: 36,
    caretakerName: 'Dennis Ochieng',
    caretakerPhone: '+254 759 508 348',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'prop-2',
    name: 'Sapphire Palms Executive Suites',
    location: 'Kilimani, Nairobi',
    propertyType: 'Executive Suites',
    totalUnits: 24,
    caretakerName: 'James Mwangi',
    caretakerPhone: '+254 722 111 222',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'prop-3',
    name: 'Oakwood Court Townhouses',
    location: 'Westlands, Nairobi',
    propertyType: 'Gated Community',
    totalUnits: 16,
    caretakerName: 'Peter Kiprono',
    caretakerPhone: '+254 733 999 888',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
  }
];

export const initialUnits: Unit[] = [
  {
    id: 'u-1',
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
    currentTenantId: 't-1',
    currentTenantName: 'John Kamau',
    waterMeterNumber: 'WM-402'
  },
  {
    id: 'u-2',
    unitNumber: 'Unit 2A',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    floor: 2,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 680,
    rentAmount: 32000,
    depositAmount: 32000,
    status: 'occupied',
    currentTenantId: 't-2',
    currentTenantName: 'Sarah Hassan',
    waterMeterNumber: 'WM-201'
  },
  {
    id: 'u-3',
    unitNumber: 'Unit 3C',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    floor: 3,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1450,
    rentAmount: 65000,
    depositAmount: 65000,
    status: 'occupied',
    currentTenantId: 't-3',
    currentTenantName: 'David Omondi',
    waterMeterNumber: 'WM-303'
  },
  {
    id: 'u-4',
    unitNumber: 'Unit 1A',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    floor: 1,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 920,
    rentAmount: 38000,
    depositAmount: 38000,
    status: 'vacant',
    waterMeterNumber: 'WM-101'
  },
  {
    id: 'u-5',
    unitNumber: 'Suite 101',
    propertyId: 'prop-2',
    propertyName: 'Sapphire Palms Executive Suites',
    floor: 1,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    rentAmount: 55000,
    depositAmount: 55000,
    status: 'occupied',
    currentTenantId: 't-4',
    currentTenantName: 'Grace Mutua',
    waterMeterNumber: 'SP-101'
  },
  {
    id: 'u-6',
    unitNumber: 'Suite 202',
    propertyId: 'prop-2',
    propertyName: 'Sapphire Palms Executive Suites',
    floor: 2,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 750,
    rentAmount: 42000,
    depositAmount: 42000,
    status: 'vacant',
    waterMeterNumber: 'SP-202'
  }
];

export const initialTenants: Tenant[] = [
  {
    id: 't-1',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    phone: '+254 712 345 678',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitId: 'u-1',
    unitNumber: 'Unit 4B',
    rentAmount: 48000,
    depositAmount: 48000,
    balanceDue: 0,
    paymentStatus: 'paid',
    leaseStart: '2026-01-01',
    leaseEnd: '2026-12-31',
    vehiclePlate: 'KDF 889Q',
    waterMeterNumber: 'WM-402',
    lastWaterReading: 158,
    emergencyContact: {
      name: 'Grace Wambui',
      phone: '+254 722 000 111',
      relationship: 'Spouse'
    },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 't-2',
    name: 'Sarah Hassan',
    email: 'sarah.hassan@example.com',
    phone: '+254 722 998 877',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitId: 'u-2',
    unitNumber: 'Unit 2A',
    rentAmount: 32000,
    depositAmount: 32000,
    balanceDue: 32000,
    paymentStatus: 'due',
    leaseStart: '2026-03-01',
    leaseEnd: '2027-02-28',
    waterMeterNumber: 'WM-201',
    emergencyContact: {
      name: 'Ahmed Hassan',
      phone: '+254 733 445 566',
      relationship: 'Brother'
    }
  },
  {
    id: 't-3',
    name: 'David Omondi',
    email: 'david.omondi@example.com',
    phone: '+254 733 112 233',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitId: 'u-3',
    unitNumber: 'Unit 3C',
    rentAmount: 65000,
    depositAmount: 65000,
    balanceDue: 65000,
    paymentStatus: 'overdue',
    leaseStart: '2025-09-01',
    leaseEnd: '2026-08-31',
    vehiclePlate: 'KDG 123M',
    waterMeterNumber: 'WM-303',
    emergencyContact: {
      name: 'Mercy Omondi',
      phone: '+254 711 223 344',
      relationship: 'Sister'
    }
  }
];

export const initialSystemUsers: SystemUser[] = [
  {
    id: 'usr-1',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    password: 'password123',
    phone: '+254 712 345 678',
    role: 'tenant',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitNumber: 'Unit 4B',
    status: 'Active',
    lastLogin: '2026-08-24 14:45:00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    permissions: {
      properties: false,
      units: false,
      tenants: false,
      accounting: false,
      reports: false,
      users: false,
      maintenance: true,
      gatePass: true,
      documents: true
    }
  },
  {
    id: 'usr-2',
    name: 'Faith Chebet (Estate Director)',
    email: 'admin@emeraldheights.co.ke',
    password: 'admin123',
    phone: '+254 759 508 348',
    role: 'manager',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    status: 'Active',
    lastLogin: '2026-08-24 15:10:00',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    permissions: {
      properties: true,
      units: true,
      tenants: true,
      accounting: true,
      reports: true,
      users: true,
      maintenance: true,
      gatePass: true,
      documents: true
    }
  },
  {
    id: 'usr-3',
    name: 'Patrick Musyoka (Head Accountant)',
    email: 'accounts@emeraldheights.co.ke',
    password: 'accounts123',
    phone: '+254 722 888 999',
    role: 'accountant',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    status: 'Active',
    lastLogin: '2026-08-24 10:15:00',
    permissions: {
      properties: false,
      units: true,
      tenants: true,
      accounting: true,
      reports: true,
      users: false,
      maintenance: false,
      gatePass: false,
      documents: true
    }
  },
  {
    id: 'usr-4',
    name: 'Dennis Ochieng (Caretaker)',
    email: 'dennis.caretaker@emeraldheights.co.ke',
    password: 'caretaker123',
    phone: '+254 722 000 119',
    role: 'caretaker',
    propertyId: 'prop-2',
    propertyName: 'Sapphire Palms Executive Suites',
    status: 'Active',
    lastLogin: '2026-08-23 16:30:00',
    permissions: {
      properties: false,
      units: true,
      tenants: false,
      accounting: false,
      reports: false,
      users: false,
      maintenance: true,
      gatePass: true,
      documents: false
    }
  }
];

export const initialSalesInvoices: SalesInvoice[] = [
  {
    id: 'sinv-001',
    invoiceNumber: 'ACC-SINV-2026-0089',
    companyName: 'EMERALD HEIGHTS PROPERTY MANAGEMENT LTD',
    companyPin: 'P051982734Z',
    customerName: 'John Kamau',
    unitNumber: 'Unit 4B',
    propertyName: 'Emerald Heights Luxury Residences',
    grandTotal: 55880,
    outstandingAmount: 0,
    status: 'Paid',
    postingDate: '2026-08-01',
    dueDate: '2026-08-05',
    incomeAccount: '4110 - Rental Income - Emerald Heights',
    costCenter: 'Emerald Heights - Operations',
    inWords: 'Fifty-Five Thousand Eight Hundred Eighty Kenyan Shillings Only',
    items: [
      {
        id: 'itm-1',
        itemCode: 'RENT-RESIDENTIAL',
        itemName: 'Monthly Residential Apartment Lease Rent',
        description: 'Apartment rent for Unit 4B - August 2026',
        qty: 1,
        rate: 48000,
        amount: 48000
      },
      {
        id: 'itm-2',
        itemCode: 'UTILITY-WATER',
        itemName: 'Water Consumption Utility',
        description: 'Meter #WM-402: Prev 142 m³ - Curr 158 m³ = 16 m³ @ KES 180',
        meterPrevious: 142,
        meterCurrent: 158,
        meterUnits: 16,
        qty: 16,
        rate: 180,
        amount: 2880
      },
      {
        id: 'itm-3',
        itemCode: 'UTILITY-SERVICE',
        itemName: 'Estate Service Charge',
        description: '24/7 Security guard patrol & cleaning',
        qty: 1,
        rate: 5000,
        amount: 5000
      }
    ],
    remarks: 'August 2026 Rent & Water settlement'
  },
  {
    id: 'sinv-002',
    invoiceNumber: 'ACC-SINV-2026-0090',
    companyName: 'EMERALD HEIGHTS PROPERTY MANAGEMENT LTD',
    companyPin: 'P051982734Z',
    customerName: 'Sarah Hassan',
    unitNumber: 'Unit 2A',
    propertyName: 'Emerald Heights Luxury Residences',
    grandTotal: 32000,
    outstandingAmount: 32000,
    status: 'Unpaid',
    postingDate: '2026-08-01',
    dueDate: '2026-08-05',
    incomeAccount: '4110 - Rental Income - Emerald Heights',
    costCenter: 'Emerald Heights - Operations',
    inWords: 'Thirty-Two Thousand Kenyan Shillings Only'
  }
];

export const initialPaymentEntries: PaymentEntry[] = [
  {
    id: 'pe-001',
    voucherNumber: 'ACC-PAY-2026-0091',
    partyName: 'John Kamau',
    unitNumber: 'Unit 4B',
    propertyName: 'Emerald Heights Luxury Residences',
    paidAmount: 55880,
    modeOfPayment: 'M-Pesa',
    paidToAccount: '1120 - Safaricom M-Pesa Till Account',
    referenceNo: 'QK8921KL9',
    postingDate: '2026-08-03',
    remarks: 'M-Pesa settlement for Unit 4B Rent & Water'
  }
];

export const initialGLEntries: GLEntry[] = [
  {
    id: 'gl-001',
    voucherType: 'Payment Entry',
    voucherNo: 'ACC-PAY-2026-0091',
    account: '1120 - Safaricom M-Pesa Till Account',
    debit: 55880,
    credit: 0,
    postingDate: '2026-08-03',
    remarks: 'M-Pesa collection Ref: QK8921KL9'
  },
  {
    id: 'gl-002',
    voucherType: 'Payment Entry',
    voucherNo: 'ACC-PAY-2026-0091',
    account: '1310 - Debtors / Accounts Receivable (John Kamau)',
    debit: 0,
    credit: 55880,
    postingDate: '2026-08-03',
    remarks: 'Debtor settlement against Unit 4B'
  }
];

export const initialExpenses: ExpenseEntry[] = [
  {
    id: 'exp-001',
    voucherNo: 'ACC-EXP-2026-0041',
    category: 'Security Services',
    propertyName: 'Emerald Heights Luxury Residences',
    amount: 85000,
    paidTo: 'G4S Secure Kenya Ltd',
    expenseAccount: '5110 - Security Guard Patrol Services',
    postingDate: '2026-08-01',
    remarks: 'Monthly 24/7 Security guard deployment'
  },
  {
    id: 'exp-002',
    voucherNo: 'ACC-EXP-2026-0042',
    category: 'Utilities (Water/Power)',
    propertyName: 'Emerald Heights Luxury Residences',
    amount: 34500,
    paidTo: 'Kenya Power & Lighting Co (KPLC)',
    expenseAccount: '5120 - Borehole & Common Area Power',
    postingDate: '2026-08-05',
    remarks: 'Common area lighting & main pump power'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-001',
    receiptNumber: 'TH-REC-2026-0891',
    propertyName: 'Emerald Heights Luxury Residences',
    unitNumber: 'Unit 4B',
    tenantName: 'John Kamau',
    tenantPhone: '+254 712 345 678',
    amount: 55880,
    type: 'rent',
    method: 'mpesa',
    transactionRef: 'QK8921KL9',
    invoiceMonth: 'August 2026',
    status: 'completed',
    date: '2026-08-03 10:14:22'
  }
];

export const initialMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'mt-001',
    ticketNumber: 'MT-2026-089',
    propertyName: 'Emerald Heights Luxury Residences',
    unitNumber: 'Unit 4B',
    tenantName: 'John Kamau',
    tenantPhone: '+254 712 345 678',
    category: 'plumbing',
    title: 'Kitchen Sink Drainage Leak',
    description: 'The pipe under the kitchen sink has a slight drip onto the cabinet baseboard.',
    priority: 'medium',
    status: 'assigned',
    assignedTechnician: 'Samuel Mutua (Plumbing Specialist)',
    technicianPhone: '+254 722 555 111',
    reportedDate: '2026-08-24',
    notes: ['Technician scheduled for visit at 3:00 PM']
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Water Tank Preventative Cleaning',
    content: 'Routine cleaning of the main rooftop water reservoirs will take place this Thursday from 9 AM to 1 PM.',
    category: 'utility',
    date: '2026-08-23',
    author: 'Management Office',
    isUrgent: false
  }
];

export const initialGatePasses: GatePass[] = [
  {
    id: 'gp-1',
    passCode: 'GP-8492',
    visitorName: 'Jane Wambui',
    visitorPhone: '+254 722 111 333',
    unitNumber: 'Unit 4B',
    validDate: '2026-08-24',
    status: 'active',
    createdDate: '11:30 AM'
  }
];

export const initialDocuments: PropertyDocument[] = [
  {
    id: 'doc-1',
    title: 'Tenancy Lease Agreement - Unit 4B.pdf',
    category: 'lease',
    unitNumber: 'Unit 4B',
    fileSize: '2.4 MB',
    uploadedDate: '2026-01-01'
  }
];

export const initialStats: PropertyStats = {
  totalUnits: 76,
  occupiedUnits: 58,
  occupancyRate: 76,
  totalCollectedThisMonth: 1845000,
  totalPendingArrears: 97000,
  activeMaintenanceTickets: 3
};
