app_name = "tenant_portal"
app_title = "Tenant Portal & Property Management"
app_publisher = "Abbey Anon"
app_description = "Frappe app for resident tenants, property managers, online rent payments, and maintenance tickets"
app_email = "mbitheabigail20@gmail.com"
app_license = "mit"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/tenant_portal/css/tenant_portal.css"
# app_include_js = "/assets/tenant_portal/js/tenant_portal.js"

# DocType Events
# ---------------
# Hook on document methods and events

doc_events = {
    "Tenant": {
        "on_update": "tenant_portal.tenant_portal.doctype.tenant.tenant.on_tenant_update",
        "on_trash": "tenant_portal.tenant_portal.doctype.tenant.tenant.on_tenant_trash"
    },
    "Rent Payment": {
        "after_insert": "tenant_portal.tenant_portal.doctype.rent_payment.rent_payment.after_payment_insert"
    },
    "Maintenance Ticket": {
        "on_update": "tenant_portal.tenant_portal.doctype.maintenance_ticket.maintenance_ticket.on_ticket_update"
    }
}
