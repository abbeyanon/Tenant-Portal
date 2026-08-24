import frappe
from frappe import _
import datetime

def create_erpnext_customer(tenant_doc):
    """
    Creates or links an ERPNext Customer document for the tenant.
    Module: ERPNext Accounts / Selling
    """
    existing_customer = frappe.db.get_value("Customer", {"customer_name": tenant_doc.tenant_name}, "name")
    if existing_customer:
        return existing_customer

    customer = frappe.get_doc({
        "doctype": "Customer",
        "customer_name": tenant_doc.tenant_name,
        "customer_type": "Individual",
        "customer_group": "Tenant",
        "territory": "Kenya",
        "mobile_no": tenant_doc.phone,
        "email_id": tenant_doc.email
    })
    customer.insert(ignore_permissions=True)
    return customer.name

def create_erpnext_sales_invoice(tenant_doc, amount, item_code="RENT-RESIDENTIAL", invoice_month="August 2026"):
    """
    Creates an ERPNext Sales Invoice for monthly rent / utilities billing.
    Module: ERPNext Accounts
    GL Posting:
        Debit: Debtors Account (Accounts Receivable)
        Credit: Rental Income Account (Income)
    """
    customer_name = create_erpnext_customer(tenant_doc)
    
    sinv = frappe.get_doc({
        "doctype": "Sales Invoice",
        "customer": customer_name,
        "posting_date": frappe.utils.today(),
        "due_date": frappe.utils.add_days(frappe.utils.today(), 5),
        "cost_center": "Emerald Heights - Operations",
        "remarks": f"Monthly Rent Invoice for {tenant_doc.unit_number} - {invoice_month}",
        "items": [
            {
                "item_code": item_code,
                "item_name": f"Residential Rent - {tenant_doc.unit_number}",
                "description": f"Apartment lease rental for {invoice_month}",
                "qty": 1,
                "rate": float(amount),
                "income_account": "Rental Income - EH",
                "cost_center": "Emerald Heights - Operations"
            }
        ]
    })
    sinv.insert(ignore_permissions=True)
    sinv.submit()
    return sinv.name

def create_erpnext_payment_entry(payment_doc):
    """
    Creates an ERPNext Payment Entry upon successful M-Pesa / Card receipt.
    Module: ERPNext Accounts
    GL Posting:
        Debit: Safaricom M-Pesa Collection Account / Bank Account (Asset)
        Credit: Debtors Account / Accounts Receivable (Asset Reduction)
    """
    pe = frappe.get_doc({
        "doctype": "Payment Entry",
        "payment_type": "Receive",
        "party_type": "Customer",
        "party": payment_doc.tenant_name,
        "paid_amount": float(payment_doc.amount),
        "received_amount": float(payment_doc.amount),
        "mode_of_payment": payment_doc.payment_method or "M-Pesa",
        "paid_to": "M-Pesa Till Account - KCB Bank",
        "reference_no": payment_doc.transaction_reference or payment_doc.receipt_number,
        "reference_date": frappe.utils.today(),
        "remarks": f"Rent Payment for {payment_doc.unit_number} via {payment_doc.payment_method}"
    })
    pe.insert(ignore_permissions=True)
    pe.submit()
    return pe.name

@frappe.whitelist(allow_guest=True)
def get_accounting_ledger():
    """Returns ERPNext Sales Invoices, Payment Entries, and GL summary."""
    sales_invoices = frappe.get_all("Sales Invoice", fields=["name", "customer", "grand_total", "outstanding_amount", "status", "posting_date"], limit=20)
    payment_entries = frappe.get_all("Payment Entry", fields=["name", "party", "paid_amount", "mode_of_payment", "reference_no", "posting_date"], limit=20)
    
    return {
        "sales_invoices": sales_invoices,
        "payment_entries": payment_entries
    }
