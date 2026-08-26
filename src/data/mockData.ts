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

// Multi-Property Portfolios (Residential & Commercial)
export const initialProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Emerald Heights Luxury Residences',
    location: 'Ngong Road, Nairobi',
    propertyCategory: 'residential',
    propertyType: 'Apartment Complex',
    totalUnits: 36,
    caretakerName: 'Dennis Ochieng',
    caretakerPhone: '+254 759 508 348',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'prop-2',
    name: 'The Mirage Commercial Plaza & Towers',
    location: 'Chiromo Road, Westlands, Nairobi',
    propertyCategory: 'commercial',
    propertyType: 'Commercial Plaza',
    totalUnits: 28,
    caretakerName: 'Alexander Kiprotich',
    caretakerPhone: '+254 722 778 899',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'prop-3',
    name: 'Sapphire Palms Executive Suites',
    location: 'Kilimani, Nairobi',
    propertyCategory: 'residential',
    propertyType: 'Executive Suites',
    totalUnits: 24,
    caretakerName: 'James Mwangi',
    caretakerPhone: '+254 722 111 222',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'prop-4',
    name: 'Syokimau Logistics & Industrial Park',
    location: 'Mombasa Road, Nairobi',
    propertyCategory: 'commercial',
    propertyType: 'Warehouse / Industrial',
    totalUnits: 12,
    caretakerName: 'Peter Kiprono',
    caretakerPhone: '+254 733 999 888',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop'
  }
];

export const initialUnits: Unit[] = [
  // Residential Units
  {
    id: 'u-1',
    unitNumber: 'Unit 4B',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitCategory: 'residential',
    spaceType: 'Apartment',
    floor: 4,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1150,
    rentAmount: 48000,
    depositAmount: 48000,
    status: 'occupied',
    currentTenantId: 't-1',
    currentTenantName: 'John Kamau',
    waterMeterNumber: 'WM-402',
    electricityMeterNumber: 'EM-402'
  },
  {
    id: 'u-2',
    unitNumber: 'Unit 2A',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitCategory: 'residential',
    spaceType: 'Apartment',
    floor: 2,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 680,
    rentAmount: 32000,
    depositAmount: 32000,
    status: 'occupied',
    currentTenantId: 't-2',
    currentTenantName: 'Sarah Hassan',
    waterMeterNumber: 'WM-201',
    electricityMeterNumber: 'EM-201'
  },
  {
    id: 'u-3',
    unitNumber: 'Unit 3C',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitCategory: 'residential',
    spaceType: 'Apartment',
    floor: 3,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1450,
    rentAmount: 65000,
    depositAmount: 65000,
    status: 'occupied',
    currentTenantId: 't-3',
    currentTenantName: 'David Omondi',
    waterMeterNumber: 'WM-303',
    electricityMeterNumber: 'EM-303'
  },
  {
    id: 'u-4',
    unitNumber: 'Unit 1A',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitCategory: 'residential',
    spaceType: 'Apartment',
    floor: 1,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 920,
    rentAmount: 38000,
    depositAmount: 38000,
    status: 'vacant',
    waterMeterNumber: 'WM-101',
    electricityMeterNumber: 'EM-101'
  },

  // Commercial Plaza Units (Office Suites & Retail Shops)
  {
    id: 'u-comm-1',
    unitNumber: 'Shop G-04',
    propertyId: 'prop-2',
    propertyName: 'The Mirage Commercial Plaza & Towers',
    unitCategory: 'commercial',
    spaceType: 'Retail Shop',
    floor: 0,
    squareFeet: 650,
    ratePerSqFt: 140,
    serviceCharge: 15000,
    vatApplicable: true,
    rentAmount: 91000,
    depositAmount: 182000,
    status: 'occupied',
    currentTenantId: 't-comm-1',
    currentTenantName: 'Amani Pharmacy & Diagnostics Ltd',
    businessName: 'Amani Pharmacy & Diagnostics Ltd',
    waterMeterNumber: 'MIR-W-G04',
    electricityMeterNumber: 'KPLC-MIR-G04'
  },
  {
    id: 'u-comm-2',
    unitNumber: 'Suite 501 (Office)',
    propertyId: 'prop-2',
    propertyName: 'The Mirage Commercial Plaza & Towers',
    unitCategory: 'commercial',
    spaceType: 'Office Suite',
    floor: 5,
    squareFeet: 1400,
    ratePerSqFt: 110,
    serviceCharge: 22000,
    vatApplicable: true,
    rentAmount: 154000,
    depositAmount: 308000,
    status: 'occupied',
    currentTenantId: 't-comm-2',
    currentTenantName: 'Apex Capital Legal Advisors LLP',
    businessName: 'Apex Capital Legal Advisors LLP',
    waterMeterNumber: 'MIR-W-501',
    electricityMeterNumber: 'KPLC-MIR-501'
  },
  {
    id: 'u-comm-3',
    unitNumber: 'Suite 502 (Office)',
    propertyId: 'prop-2',
    propertyName: 'The Mirage Commercial Plaza & Towers',
    unitCategory: 'commercial',
    spaceType: 'Office Suite',
    floor: 5,
    squareFeet: 1100,
    ratePerSqFt: 110,
    serviceCharge: 18000,
    vatApplicable: true,
    rentAmount: 121000,
    depositAmount: 242000,
    status: 'vacant',
    waterMeterNumber: 'MIR-W-502',
    electricityMeterNumber: 'KPLC-MIR-502'
  },
  {
    id: 'u-comm-4',
    unitNumber: 'Warehouse Bay 03',
    propertyId: 'prop-4',
    propertyName: 'Syokimau Logistics & Industrial Park',
    unitCategory: 'commercial',
    spaceType: 'Warehouse / Godown',
    floor: 1,
    squareFeet: 4500,
    ratePerSqFt: 45,
    serviceCharge: 35000,
    vatApplicable: true,
    rentAmount: 202500,
    depositAmount: 405000,
    status: 'vacant',
    waterMeterNumber: 'SYO-W-03',
    electricityMeterNumber: 'KPLC-3PHASE-03'
  }
];

export const initialTenants: Tenant[] = [
  {
    id: 't-1',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    phone: '+254 712 345 678',
    tenantType: 'individual',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitId: 'u-1',
    unitNumber: 'Unit 4B',
    unitCategory: 'residential',
    rentAmount: 48000,
    depositAmount: 48000,
    balanceDue: 0,
    paymentStatus: 'paid',
    leaseStart: '2026-01-01',
    leaseEnd: '2026-12-31',
    vehiclePlate: 'KDF 889Q',
    waterMeterNumber: 'WM-402',
    lastWaterReading: 158,
    electricityMeterNumber: 'EM-402',
    lastElectricityReading: 410,
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
    tenantType: 'individual',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitId: 'u-2',
    unitNumber: 'Unit 2A',
    unitCategory: 'residential',
    rentAmount: 32000,
    depositAmount: 32000,
    balanceDue: 32000,
    paymentStatus: 'due',
    leaseStart: '2026-03-01',
    leaseEnd: '2027-02-28',
    waterMeterNumber: 'WM-201',
    electricityMeterNumber: 'EM-201',
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
    tenantType: 'individual',
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    unitId: 'u-3',
    unitNumber: 'Unit 3C',
    unitCategory: 'residential',
    rentAmount: 65000,
    depositAmount: 65000,
    balanceDue: 65000,
    paymentStatus: 'overdue',
    leaseStart: '2025-09-01',
    leaseEnd: '2026-08-31',
    vehiclePlate: 'KDG 123M',
    waterMeterNumber: 'WM-303',
    electricityMeterNumber: 'EM-303',
    emergencyContact: {
      name: 'Mercy Omondi',
      phone: '+254 711 223 344',
      relationship: 'Sister'
    }
  },
  {
    id: 't-comm-1',
    name: 'Dr. Kennedy Mwangi',
    companyName: 'Amani Pharmacy & Diagnostics Ltd',
    companyPin: 'P051289471X',
    tenantType: 'corporate',
    email: 'info@amanipharmacy.co.ke',
    phone: '+254 722 334 455',
    propertyId: 'prop-2',
    propertyName: 'The Mirage Commercial Plaza & Towers',
    unitId: 'u-comm-1',
    unitNumber: 'Shop G-04',
    unitCategory: 'commercial',
    rentAmount: 91000,
    depositAmount: 182000,
    balanceDue: 0,
    paymentStatus: 'paid',
    leaseStart: '2025-05-01',
    leaseEnd: '2028-04-30',
    waterMeterNumber: 'MIR-W-G04',
    lastWaterReading: 88,
    electricityMeterNumber: 'KPLC-MIR-G04',
    lastElectricityReading: 1240,
    emergencyContact: {
      name: 'Operations Desk',
      phone: '+254 722 000 999',
      relationship: 'Head Office'
    }
  },
  {
    id: 't-comm-2',
    name: 'Adv. Brenda Chepngeno',
    companyName: 'Apex Capital Legal Advisors LLP',
    companyPin: 'P051892341M',
    tenantType: 'corporate',
    email: 'finance@apexlegal.co.ke',
    phone: '+254 711 889 900',
    propertyId: 'prop-2',
    propertyName: 'The Mirage Commercial Plaza & Towers',
    unitId: 'u-comm-2',
    unitNumber: 'Suite 501 (Office)',
    unitCategory: 'commercial',
    rentAmount: 154000,
    depositAmount: 308000,
    balanceDue: 154000,
    paymentStatus: 'due',
    leaseStart: '2025-01-01',
    leaseEnd: '2027-12-31',
    waterMeterNumber: 'MIR-W-501',
    lastWaterReading: 110,
    electricityMeterNumber: 'KPLC-MIR-501',
    lastElectricityReading: 2180,
    emergencyContact: {
      name: 'Managing Partner',
      phone: '+254 720 123 456',
      relationship: 'Corporate Contact'
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
    lastLogin: '2026-08-26 08:30:00',
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
    lastLogin: '2026-08-26 10:15:00',
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
    lastLogin: '2026-08-26 09:45:00',
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
    propertyId: 'prop-1',
    propertyName: 'Emerald Heights Luxury Residences',
    status: 'Active',
    lastLogin: '2026-08-25 16:30:00',
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
    unitCategory: 'residential',
    grandTotal: 58302,
    outstandingAmount: 0,
    status: 'Paid',
    postingDate: '2026-08-01',
    dueDate: '2026-08-05',
    incomeAccount: '4110 - Rental Income - Emerald Heights',
    costCenter: 'Emerald Heights - Operations',
    inWords: 'Fifty-Eight Thousand Three Hundred Two Kenyan Shillings Only',
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
        meterType: 'water',
        meterPrevious: 142,
        meterCurrent: 158,
        meterUnits: 16,
        qty: 16,
        rate: 180,
        amount: 2880
      },
      {
        id: 'itm-3',
        itemCode: 'UTILITY-ELECTRICITY',
        itemName: 'Electricity Power Utility',
        description: 'Sub-Meter #EM-402: Prev 325 kWh - Curr 410 kWh = 85 kWh @ KES 28.50',
        meterType: 'electricity',
        meterPrevious: 325,
        meterCurrent: 410,
        meterUnits: 85,
        qty: 85,
        rate: 28.5,
        amount: 2422.5
      },
      {
        id: 'itm-4',
        itemCode: 'UTILITY-SERVICE',
        itemName: 'Estate Service Charge',
        description: '24/7 Security guard patrol & cleaning',
        qty: 1,
        rate: 5000,
        amount: 5000
      }
    ],
    remarks: 'August 2026 Rent, Water & Electricity settlement'
  },
  {
    id: 'sinv-comm-001',
    invoiceNumber: 'ACC-SINV-2026-0092',
    companyName: 'THE MIRAGE COMMERCIAL PROPERTY TRUST',
    companyPin: 'P051982734Z',
    customerName: 'Amani Pharmacy & Diagnostics Ltd',
    customerType: 'corporate',
    customerPin: 'P051289471X',
    unitNumber: 'Shop G-04',
    propertyName: 'The Mirage Commercial Plaza & Towers',
    unitCategory: 'commercial',
    grandTotal: 122840,
    outstandingAmount: 0,
    status: 'Paid',
    postingDate: '2026-08-01',
    dueDate: '2026-08-05',
    incomeAccount: '4210 - Commercial Lease Revenue',
    costCenter: 'The Mirage - Ground Commercial Floor',
    inWords: 'One Hundred Twenty-Two Thousand Eight Hundred Forty Kenyan Shillings Only',
    items: [
      {
        id: 'itm-c1',
        itemCode: 'RENT-COMMERCIAL',
        itemName: 'Commercial Retail Shop Lease (650 sq ft @ KES 140/sq ft)',
        description: 'Shop G-04 Retail space - August 2026',
        qty: 650,
        rate: 140,
        amount: 91000
      },
      {
        id: 'itm-c2',
        itemCode: 'UTILITY-SERVICE-CAM',
        itemName: 'Common Area Maintenance (CAM) & Security',
        description: 'Commercial service charge, lift & standby generator maintenance',
        qty: 1,
        rate: 15000,
        amount: 15000
      },
      {
        id: 'itm-c3',
        itemCode: 'UTILITY-ELECTRICITY',
        itemName: '3-Phase Commercial Electricity (KPLC Sub-Meter)',
        description: 'Meter #KPLC-MIR-G04: Prev 820 kWh - Curr 1240 kWh = 420 kWh @ KES 29.00',
        meterType: 'electricity',
        meterPrevious: 820,
        meterCurrent: 1240,
        meterUnits: 420,
        qty: 420,
        rate: 29.0,
        amount: 12180
      },
      {
        id: 'itm-c4',
        itemCode: 'UTILITY-WATER',
        itemName: 'Commercial Metered Water',
        description: 'Meter #MIR-W-G04: Prev 64 m³ - Curr 88 m³ = 24 m³ @ KES 194.16',
        meterType: 'water',
        meterPrevious: 64,
        meterCurrent: 88,
        meterUnits: 24,
        qty: 24,
        rate: 194.1666,
        amount: 4660
      }
    ],
    remarks: 'August 2026 Commercial Lease + 3-Phase Power & Water'
  }
];

export const initialPaymentEntries: PaymentEntry[] = [
  {
    id: 'pe-001',
    voucherNumber: 'ACC-PAY-2026-0091',
    partyName: 'John Kamau',
    unitNumber: 'Unit 4B',
    propertyName: 'Emerald Heights Luxury Residences',
    paidAmount: 58302,
    modeOfPayment: 'M-Pesa',
    paidToAccount: '1120 - Safaricom M-Pesa Till Account',
    referenceNo: 'QK8921KL9',
    postingDate: '2026-08-03',
    remarks: 'M-Pesa settlement for Unit 4B Rent, Water & Electricity'
  },
  {
    id: 'pe-comm-001',
    voucherNumber: 'ACC-PAY-2026-0094',
    partyName: 'Amani Pharmacy & Diagnostics Ltd',
    unitNumber: 'Shop G-04',
    propertyName: 'The Mirage Commercial Plaza & Towers',
    paidAmount: 122840,
    modeOfPayment: 'Bank Transfer',
    paidToAccount: '1110 - KCB Operating Bank Account',
    referenceNo: 'FT2608129038',
    postingDate: '2026-08-02',
    remarks: 'Direct RTGS settlement for Shop G-04 Rent, CAM, Power & Water'
  }
];

export const initialGLEntries: GLEntry[] = [
  {
    id: 'gl-001',
    voucherType: 'Payment Entry',
    voucherNo: 'ACC-PAY-2026-0091',
    account: '1120 - Safaricom M-Pesa Till Account',
    debit: 58302,
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
    credit: 58302,
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
    amount: 58302,
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
  },
  {
    id: 'mt-002',
    ticketNumber: 'MT-2026-090',
    propertyName: 'The Mirage Commercial Plaza & Towers',
    unitNumber: 'Suite 501 (Office)',
    tenantName: 'Adv. Brenda Chepngeno',
    tenantPhone: '+254 711 889 900',
    category: 'electrical',
    title: 'HVAC Airflow Circuit Tripping',
    description: 'Server room dedicated AC unit circuit breaker tripped during peak afternoon hours.',
    priority: 'high',
    status: 'in_progress',
    assignedTechnician: 'David Mwangi (Commercial Electrician)',
    technicianPhone: '+254 722 444 333',
    reportedDate: '2026-08-25',
    notes: ['Technician inspecting 3-phase sub-distribution board']
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Commercial Standby Generator Load Test',
    content: 'The 250kVA standby backup generator at The Mirage Commercial Plaza will undergo scheduled load testing this Sunday from 7:00 AM to 9:00 AM.',
    category: 'utility',
    date: '2026-08-25',
    author: 'Commercial Facilities Desk',
    isUrgent: false
  },
  {
    id: 'ann-2',
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
    validDate: '2026-08-26',
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
  totalUnits: 100,
  occupiedUnits: 78,
  occupancyRate: 78,
  totalCollectedThisMonth: 2345000,
  totalPendingArrears: 186000,
  activeMaintenanceTickets: 4
};
