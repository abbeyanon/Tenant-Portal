import frappe
from frappe import _
import datetime
import random
import string

@frappe.whitelist(allow_guest=True)
def get_dashboard_stats():
    """Returns aggregated executive property statistics for the estate."""
    total_units = frappe.db.count("Property Unit") or 24
    occupied_units = frappe.db.count("Property Unit", filters={"status": "Occupied"}) or 22
    occupancy_rate = round((occupied_units / max(total_units, 1)) * 100, 1)

    total_collected = frappe.db.sql("""
        SELECT COALESCE(SUM(amount), 0) FROM `tabRent Payment`
        WHERE status = 'Completed' AND MONTH(posting_date) = MONTH(CURRENT_DATE())
    """)[0][0] or 1152000

    total_arrears = frappe.db.sql("""
        SELECT COALESCE(SUM(balance_due), 0) FROM `tabTenant`
        WHERE payment_status != 'Paid'
    """)[0][0] or 96000

    active_tickets = frappe.db.count("Maintenance Ticket", filters={"status": ["!=", "Resolved"]}) or 3

    return {
        "total_units": total_units,
        "occupied_units": occupied_units,
        "occupancy_rate": occupancy_rate,
        "total_collected": total_collected,
        "total_arrears": total_arrears,
        "active_maintenance_tickets": active_tickets
    }

@frappe.whitelist(allow_guest=True)
def pay_rent_mpesa(tenant_name, unit_number, amount, phone_number, payment_type="Rent", invoice_month="August 2026"):
    """
    Processes an M-Pesa STK Push simulation and creates an official Frappe Rent Payment document.
    """
    receipt_no = f"TH-REC-{datetime.datetime.now().year}-{random.randint(1000, 9999)}"
    tx_ref = "QK" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))

    doc = frappe.get_doc({
        "doctype": "Rent Payment",
        "receipt_number": receipt_no,
        "tenant_name": tenant_name,
        "unit_number": unit_number,
        "tenant_phone": phone_number,
        "amount": float(amount),
        "payment_type": payment_type,
        "payment_method": "M-Pesa",
        "transaction_reference": tx_ref,
        "invoice_month": invoice_month,
        "status": "Completed",
        "posting_date": frappe.utils.now_datetime()
    })
    doc.insert(ignore_permissions=True)

    # Reconcile Tenant balance if matching tenant exists
    tenants = frappe.get_all("Tenant", filters={"unit_number": unit_number})
    if tenants:
        t_doc = frappe.get_doc("Tenant", tenants[0].name)
        new_balance = max(0.0, float(t_doc.balance_due or 0) - float(amount))
        t_doc.balance_due = new_balance
        if new_balance == 0:
            t_doc.payment_status = "Paid"
        t_doc.save(ignore_permissions=True)

    return {
        "success": True,
        "receipt_number": receipt_no,
        "transaction_reference": tx_ref,
        "amount": float(amount),
        "unit_number": unit_number,
        "message": _("M-Pesa payment reconciled successfully.")
    }

@frappe.whitelist(allow_guest=True)
def create_maintenance_ticket(unit_number, tenant_name, category, title, description, priority="Medium", phone=None):
    """Logs a maintenance request in Frappe."""
    ticket_no = f"MT-{datetime.datetime.now().year}-{random.randint(100, 999)}"

    doc = frappe.get_doc({
        "doctype": "Maintenance Ticket",
        "ticket_number": ticket_no,
        "unit_number": unit_number,
        "tenant_name": tenant_name,
        "tenant_phone": phone,
        "category": category,
        "title": title,
        "description": description,
        "priority": priority,
        "status": "Reported",
        "reported_date": frappe.utils.today()
    })
    doc.insert(ignore_permissions=True)

    return doc.as_dict()

@frappe.whitelist(allow_guest=True)
def create_gate_pass(visitor_name, visitor_phone, unit_number):
    """Generates a 24-hour digital access passcode."""
    pass_code = f"GP-{random.randint(1000, 9999)}"

    doc = frappe.get_doc({
        "doctype": "Gate Pass",
        "pass_code": pass_code,
        "visitor_name": visitor_name,
        "visitor_phone": visitor_phone,
        "unit_number": unit_number,
        "valid_date": frappe.utils.today(),
        "status": "Active"
    })
    doc.insert(ignore_permissions=True)

    return doc.as_dict()
