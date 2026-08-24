# 🏘️ TenantHub — Modern Resident & Property Management Platform

> **"Smart Living, Seamless Estate & Property Operations."**  
> An all-in-one, responsive, secure full-stack platform built for **apartment tenants**, **landlords**, and **property managers** to manage rent collections, maintenance requests, digital gate passes, and tenancy compliance.

---

## 🚀 Core Features & Capabilities

### 1. 👤 Resident Tenant Portal
* **My Unit Overview**: View current lease details, monthly rent (`KES 48,000`), due dates, security deposit held in escrow, and active tenancy agreement.
* **Rent & Utility Payments (M-Pesa STK Push)**:
  - Pay monthly rent, water bills, prepaid electricity tokens, and service charges.
  - Native Safaricom M-Pesa STK Push prompt simulation with instant PIN confirmation and unique transaction reference codes (`QK892...`).
  - Credit/Debit Card and Bank Transfer options.
* **Electronic Rent Receipts**: Instant official receipts (`TH-REC-2026-XXXX`) with 1-click printable / PDF format.
* **Maintenance Request Center**:
  - Report plumbing, electrical, carpentry, HVAC, and appliance issues with priority flags (`Emergency`, `High`, `Medium`, `Low`).
  - Real-time status progression (`Reported` → `Assigned` → `In Progress` → `Resolved`).
  - Direct contact information for assigned certified technicians.
* **Visitor Digital Gate Pass**: Generate instant 24-hour passcodes (`GP-8924`) for visitors, Uber/Bolt deliveries, and contractors.
* **Tenancy Documents**: Instant download of signed residential agreements, estate bylaws, and move-in condition reports.
* **Settings & Profile**: Manage vehicle registration plates for basement parking access, 2FA SMS verification, and automated rent reminder preferences.

---

### 2. 🏢 Property Manager / Landlord Workspace
* **Executive Metrics Dashboard**:
  - Total Units Capacity (24)
  - Live Occupancy Rate (92%)
  - Total Rent Collected This Month (`KES 1,152,000`)
  - Pending Arrears (`KES 96,000`)
  - Active Maintenance Tickets (3)
* **Tenant Roster & Arrears Tracker**: Real-time payment tracking (`Paid`, `Due`, `Overdue`) and 1-click SMS / WhatsApp automated payment reminders.
* **Maintenance Dispatch Board**: Assign repair tickets to lead plumbers, electricians, or technicians, and update status upon repair sign-off.
* **Tenant Onboarding**: Register new tenants, allocate vacant units, set monthly rent amounts, and activate tenancy leases.
* **Building Notice Broadcasts**: Send estate-wide announcements for water tank cleanings, power maintenance, and security updates.

---

### 3. 🎨 UI / UX & Multi-Theme Engine
* **High-Contrast Dark & Crisp Light Mode**: Persistent theme switcher for optimal day and night viewing.
* **Role Switcher**: Instant 1-click top-bar switcher between **Resident Tenant** and **Property Manager** workspaces.
* **Estate Caretaker Hotline**: Quick contact banner with direct telephone helpline (`+254 759 508 348`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend API**: Node.js, Express, RESTful endpoints, JSON Database
- **Routing**: React Router DOM
- **Deployment**: Unified Express static serving + Hot-reloading Vite dev environment

---

## ⚡ Quick Start & Running Locally

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run in Production (Unified App on Port 5000)
```bash
npm start
```
Visit **`http://localhost:5000/`** in your browser.

### 3. Run in Development Mode
```bash
npm run dev
```
- Frontend: `http://localhost:5174/`
- Backend API: `http://localhost:5000/`

---

## 📄 REST API Endpoints

- `GET /api/health` — Platform health check
- `GET /api/tenants` — Retrieve tenant roster
- `POST /api/payments` — Process M-Pesa / Card rent payments and issue electronic receipts
- `GET /api/maintenance` — List maintenance tickets
- `POST /api/maintenance` — Submit a new maintenance issue
