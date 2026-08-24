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

// --- REST API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TenantHub Platform API', timestamp: new Date().toISOString() });
});

// GET /api/tenants
app.get('/api/tenants', (req, res) => {
  const db = getDb();
  res.json(db.tenants || []);
});

// POST /api/payments (M-Pesa STK push & Card rent payment)
app.post('/api/payments', (req, res) => {
  const db = getDb();
  const { unitNumber, tenantName, amount, method, invoiceMonth } = req.body;
  const receiptNumber = `TH-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const txRef = method === 'mpesa' ? `QK${Math.random().toString(36).substring(2, 8).toUpperCase()}` : `CRD_${Date.now()}`;

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

// GET /api/maintenance
app.get('/api/maintenance', (req, res) => {
  const db = getDb();
  res.json(db.maintenanceTickets || []);
});

// POST /api/maintenance
app.post('/api/maintenance', (req, res) => {
  const db = getDb();
  const ticketNo = `MT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const newTicket = {
    ...req.body,
    id: 'tk-' + Date.now(),
    ticketNumber: ticketNo,
    status: 'reported',
    reportedDate: new Date().toISOString().split('T')[0],
    notes: ['Ticket logged by resident tenant.']
  };

  db.maintenanceTickets = [newTicket, ...(db.maintenanceTickets || [])];
  saveDb(db);

  res.status(201).json(newTicket);
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
      res.status(404).json({ error: 'API route not found' });
    }
  });
}

app.listen(PORT, () => {
  console.log(`\n🏠 TenantHub Full-Stack Application is running on:`);
  console.log(`   ➜  http://localhost:${PORT}/ (Unified Frontend & Backend)\n`);
});
