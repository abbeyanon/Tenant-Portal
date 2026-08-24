import frappe
from frappe.model.document import Document

class MaintenanceTicket(Document):
    pass

def on_ticket_update(doc, method):
    pass
