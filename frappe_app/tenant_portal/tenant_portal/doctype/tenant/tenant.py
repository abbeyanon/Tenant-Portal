import frappe
from frappe.model.document import Document

class Tenant(Document):
    def validate(self):
        if not self.tenant_name:
            frappe.throw("Tenant Name is required")
        if not self.unit_number:
            frappe.throw("Assigned Unit is required")

def on_tenant_update(doc, method):
    # When a tenant is assigned to a unit, mark the Property Unit as Occupied
    if doc.unit_number:
        units = frappe.get_all("Property Unit", filters={"unit_number": doc.unit_number})
        if units:
            unit_doc = frappe.get_doc("Property Unit", units[0].name)
            unit_doc.status = "Occupied"
            unit_doc.current_tenant = doc.tenant_name
            unit_doc.save(ignore_permissions=True)

def on_tenant_trash(doc, method):
    # When a tenant moves out, free up the unit
    if doc.unit_number:
        units = frappe.get_all("Property Unit", filters={"unit_number": doc.unit_number})
        if units:
            unit_doc = frappe.get_doc("Property Unit", units[0].name)
            unit_doc.status = "Vacant"
            unit_doc.current_tenant = None
            unit_doc.save(ignore_permissions=True)
