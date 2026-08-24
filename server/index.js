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

const initializeDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      tenants: [],
      units: [],
      payments: [],
      maintenanceTickets: [],
      announcements: [],
      gatePasses: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
};

initializeDb();

const getDb = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    return {};
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
