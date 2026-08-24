import frappe
from frappe.model.document import Document

class RentPayment(Document):
    pass

def after_payment_insert(doc, method):
    # Log payment audit
    pass
