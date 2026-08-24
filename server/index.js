import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

const initialSeedData = {
  tenants: [
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
      emergencyContact: { name: 'Grace Wambui', phone: '+254 722 112 233', relationship: 'Spouse' },
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
      emergencyContact: { name: 'Daniel Mutua', phone: '+254 733 998 877', relationship: 'Brother' },
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
      emergencyContact: { name: 'Mary Achieng', phone: '+254 711 556 677', relationship: 'Sister' },
      vehiclePlate: 'KCL 190P',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
    }
  ],
  units: [
    { id: 'u-1a', unitNumber: 'Unit 1A', propertyName: 'Emerald Heights Residences', floor: 1, bedrooms: 1, bathrooms: 1, squareFeet: 720, rentAmount: 38000, depositAmount: 38000, status: 'vacant' },
    { id: 'u-1b', unitNumber: 'Unit 1B', propertyName: 'Emerald Heights Residences', floor: 1, bedrooms: 1, bathrooms: 1, squareFeet: 720, rentAmount: 38000, depositAmount: 38000, status: 'vacant' },
    { id: 'u-1c', unitNumber: 'Unit 1C', propertyName: 'Emerald Heights Residences', floor: 1, bedrooms: 1, bathrooms: 1, squareFeet: 750, rentAmount: 38000, depositAmount: 38000, status: 'occupied', currentTenantId: 't-103', currentTenantName: 'David Omondi' },
    { id: 'u-2a', unitNumber: 'Unit 2A', propertyName: 'Emerald Heights Residences', floor: 2, bedrooms: 2, bathrooms: 2, squareFeet: 1150, rentAmount: 48000, depositAmount: 48000, status: 'occupied', currentTenantId: 't-102', currentTenantName: 'Sarah Mutua' },
    { id: 'u-2b', unitNumber: 'Unit 2B', propertyName: 'Emerald Heights Residences', floor: 2, bedrooms: 2, bathrooms: 2, squareFeet: 1150, rentAmount: 48000, depositAmount: 48000, status: 'vacant' },
    { id: 'u-3c', unitNumber: 'Unit 3C', propertyName: 'Emerald Heights Residences', floor: 3, bedrooms: 3, bathrooms: 3, squareFeet: 1600, rentAmount: 65000, depositAmount: 65000, status: 'vacant' },
    { id: 'u-4b', unitNumber: 'Unit 4B', propertyName: 'Emerald Heights Residences', floor: 4, bedrooms: 2, bathrooms: 2, squareFeet: 1150, rentAmount: 48000, depositAmount: 48000, status: 'occupied', currentTenantId: 't-101', currentTenantName: 'John Kamau' },
    { id: 'u-5a', unitNumber: 'Unit 5A (Penthouse)', propertyName: 'Emerald Heights Residences', floor: 5, bedrooms: 3, bathrooms: 3, squareFeet: 1850, rentAmount: 85000, depositAmount: 85000, status: 'maintenance' }
  ],
  payments: [
    { id: 'pay-001', receiptNumber: 'TH-REC-2026-0812', unitNumber: 'Unit 4B', tenantName: 'John Kamau', tenantPhone: '+254 712 345 678', amount: 48000, type: 'rent', method: 'mpesa', transactionRef: 'QKD8921KL9', invoiceMonth: 'August 2026', status: 'completed', date: '2026-08-04 10:24:15' }
  ],
  maintenanceTickets: [
    { id: 'tk-101', ticketNumber: 'MT-2026-042', unitNumber: 'Unit 4B', tenantName: 'John Kamau', tenantPhone: '+254 712 345 678', category: 'plumbing', title: 'Master Bathroom Tap Leaking', description: 'Mixer tap dripping in ensuite.', priority: 'medium', status: 'in_progress', assignedTechnician: 'Peter Mwangi', technicianPhone: '+254 722 445 566', reportedDate: '2026-08-20' }
  ],
  announcements: [
    { id: 'ann-1', title: 'Routine Water Tank Cleaning', content: 'Water supply to tanks will undergo maintenance on Saturday, Aug 29.', category: 'utility', date: '2026-08-22', author: 'Estate Management', isUrgent: true }
  ],
  gatePasses: [
    { id: 'gp-1', passCode: 'GP-8924', visitorName: 'Brian Mutiso (Delivery)', visitorPhone: '+254 711 223 344', unitNumber: 'Unit 4B', validDate: '2026-08-24', status: 'active', createdDate: '08:30 AM' }
  ]
};

const initializeDb = () => {
  if (!fs.existsSync(DB_FILE) || fs.readFileSync(DB_FILE, 'utf8').trim() === '{}' || fs.readFileSync(DB_FILE, 'utf8').trim() === '{"tenants":[],"units":[],"payments":[],"maintenanceTickets":[],"announcements":[],"gatePasses":[]}') {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedData, null, 2));
  }
};

initializeDb();

const getDb = () => {
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (!data.tenants || data.tenants.length === 0) return initialSeedData;
    return data;
  } catch (err) {
    return initialSeedData;
  }
};

const saveDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// =========================================================================
// FRAPPE FRAMEWORK REST API PROTOCOL IMPLEMENTATION
// =========================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    framework: 'Frappe Framework REST API Bridge',
    app: 'tenant_portal',
    timestamp: new Date().toISOString()
  });
});

// Frappe DocType Resource Endpoint: GET /api/resource/:doctype
app.get('/api/resource/:doctype', (req, res) => {
  const db = getDb();
  const dt = decodeURIComponent(req.params.doctype).toLowerCase().replace(/\s+/g, '');

  if (dt === 'tenant') {
    return res.json({ data: db.tenants || [] });
  } else if (dt === 'propertyunit' || dt === 'unit') {
    return res.json({ data: db.units || [] });
  } else if (dt === 'rentpayment' || dt === 'payment') {
    return res.json({ data: db.payments || [] });
  } else if (dt === 'maintenanceticket' || dt === 'maintenance') {
    return res.json({ data: db.maintenanceTickets || [] });
  } else if (dt === 'gatepass') {
    return res.json({ data: db.gatePasses || [] });
  }

  res.json({ data: [] });
});

// Frappe DocType Resource Endpoint: POST /api/resource/:doctype
app.post('/api/resource/:doctype', (req, res) => {
  const db = getDb();
  const dt = decodeURIComponent(req.params.doctype).toLowerCase().replace(/\s+/g, '');
  const doc = req.body;

  if (dt === 'tenant') {
    const newTenant = { ...doc, id: 't-' + Date.now() };
    db.tenants = [newTenant, ...(db.tenants || [])];
    saveDb(db);
    return res.status(201).json({ data: newTenant });
  } else if (dt === 'propertyunit' || dt === 'unit') {
    const newUnit = { ...doc, id: 'u-' + Date.now() };
    db.units = [newUnit, ...(db.units || [])];
    saveDb(db);
    return res.status(201).json({ data: newUnit });
  }

  res.status(201).json({ data: doc });
});

// Frappe Whitelisted RPC Endpoint: POST /api/method/tenant_portal.api.pay_rent_mpesa
app.post('/api/method/tenant_portal.api.pay_rent_mpesa', (req, res) => {
  const db = getDb();
  const { tenant_name, unit_number, amount, phone_number, payment_type, invoice_month } = req.body;

  const receiptNumber = `TH-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const txRef = `QK${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const newPayment = {
    id: 'pay-' + Date.now(),
    receiptNumber,
    unitNumber: unit_number,
    tenantName: tenant_name,
    tenantPhone: phone_number,
    amount: Number(amount),
    type: (payment_type || 'rent').toLowerCase(),
    method: 'mpesa',
    transactionRef: txRef,
    invoiceMonth: invoice_month || 'August 2026',
    status: 'completed',
    date: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  db.payments = [newPayment, ...(db.payments || [])];
  saveDb(db);

  res.json({
    message: {
      success: true,
      receipt_number: receiptNumber,
      transaction_reference: txRef,
      amount: Number(amount),
      unit_number,
      payment: newPayment
    }
  });
});

// Frappe Whitelisted RPC Endpoint: POST /api/method/tenant_portal.api.get_dashboard_stats
app.post('/api/method/tenant_portal.api.get_dashboard_stats', (req, res) => {
  const db = getDb();
  const totalUnits = (db.units && db.units.length) || 24;
  const occupiedUnits = (db.tenants && db.tenants.length) || 22;
  const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);

  res.json({
    message: {
      total_units: totalUnits,
      occupied_units: occupiedUnits,
      occupancy_rate: occupancyRate,
      total_collected: 1152000,
      total_arrears: 96000,
      active_maintenance_tickets: (db.maintenanceTickets && db.maintenanceTickets.length) || 3
    }
  });
});

// Legacy backward compatible endpoints
app.get('/api/tenants', (req, res) => res.json(getDb().tenants || []));
app.get('/api/maintenance', (req, res) => res.json(getDb().maintenanceTickets || []));
app.post('/api/payments', (req, res) => {
  const db = getDb();
  const receiptNumber = `TH-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const txRef = `QK${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const newPayment = {
    ...req.body,
    id: 'pay-' + Date.now(),
    receiptNumber,
    transactionRef: txRef,
    status: 'completed',
    date: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  db.payments = [newPayment, ...(db.payments || [])];
  saveDb(db);
  res.status(201).json({ success: true, payment: newPayment, receiptNumber });
});

// Favicon routes
const publicPath = path.join(__dirname, '../public');
const distPath = path.join(__dirname, '../dist');

app.get('/favicon.ico', (req, res) => {
  const icoPath = path.join(publicPath, 'favicon.ico');
  const svgPath = path.join(publicPath, 'favicon.svg');
  if (fs.existsSync(icoPath)) {
    res.sendFile(icoPath);
  } else if (fs.existsSync(svgPath)) {
    res.type('image/svg+xml').sendFile(svgPath);
  } else {
    res.status(204).end();
  }
});

app.get('/favicon.svg', (req, res) => {
  const svgPath = path.join(publicPath, 'favicon.svg');
  if (fs.existsSync(svgPath)) {
    res.type('image/svg+xml').sendFile(svgPath);
  } else {
    res.status(204).end();
  }
});

// Serve compiled Frontend static assets
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback for client-side routes
  app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'Frappe API route not found' });
    }
  });
}

app.listen(PORT, () => {
  console.log(`\n🏢 TenantHub (Frappe Framework Backend Bridge) is active on:`);
  console.log(`   ➜  http://localhost:${PORT}/ (Frappe REST API + React SPA)\n`);
});
