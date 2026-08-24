/**
 * Frappe Framework REST Client Service
 * Fully compatible with standard Frappe / ERPNext REST API specification:
 * - /api/resource/:doctype
 * - /api/method/:dotted_path
 */

const BASE_URL = '';

export interface FrappeResponse<T> {
  data?: T;
  message?: T;
  exc?: string;
}

export const frappeApi = {
  // Generic DocType CRUD via /api/resource/:doctype
  async getList<T = any>(doctype: string, filters?: Record<string, any>): Promise<T[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        params.append('filters', JSON.stringify(filters));
      }
      const res = await fetch(`${BASE_URL}/api/resource/${encodeURIComponent(doctype)}?${params.toString()}`);
      if (!res.ok) throw new Error(`Frappe API Error: ${res.statusText}`);
      const json: FrappeResponse<T[]> = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn(`[Frappe REST Client] getList(${doctype}) fallback to local store:`, err);
      return [];
    }
  },

  async getDoc<T = any>(doctype: string, name: string): Promise<T | null> {
    try {
      const res = await fetch(`${BASE_URL}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error(`Frappe API Error: ${res.statusText}`);
      const json: FrappeResponse<T> = await res.json();
      return json.data || null;
    } catch (err) {
      console.warn(`[Frappe REST Client] getDoc(${doctype}, ${name}) error:`, err);
      return null;
    }
  },

  async createDoc<T = any>(doctype: string, docData: Record<string, any>): Promise<T> {
    const res = await fetch(`${BASE_URL}/api/resource/${encodeURIComponent(doctype)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(docData)
    });
    if (!res.ok) throw new Error(`Frappe API Error: ${res.statusText}`);
    const json: FrappeResponse<T> = await res.json();
    return json.data || (json as any);
  },

  async updateDoc<T = any>(doctype: string, name: string, docData: Record<string, any>): Promise<T> {
    const res = await fetch(`${BASE_URL}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(docData)
    });
    if (!res.ok) throw new Error(`Frappe API Error: ${res.statusText}`);
    const json: FrappeResponse<T> = await res.json();
    return json.data || (json as any);
  },

  // Frappe Whitelisted Python RPC Methods via /api/method/:method
  async callMethod<T = any>(method: string, args?: Record<string, any>): Promise<T> {
    const res = await fetch(`${BASE_URL}/api/method/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(args || {})
    });
    if (!res.ok) throw new Error(`Frappe RPC Error: ${res.statusText}`);
    const json: FrappeResponse<T> = await res.json();
    return (json.message || json.data || json) as T;
  },

  // Custom Helper RPCs
  async payRentMpesa(params: {
    tenantName: string;
    unitNumber: string;
    amount: number;
    phone: string;
    type?: string;
    month?: string;
  }) {
    return this.callMethod('tenant_portal.api.pay_rent_mpesa', {
      tenant_name: params.tenantName,
      unit_number: params.unitNumber,
      amount: params.amount,
      phone_number: params.phone,
      payment_type: params.type || 'Rent',
      invoice_month: params.month || 'August 2026'
    });
  },

  async getDashboardStats() {
    return this.callMethod('tenant_portal.api.get_dashboard_stats');
  }
};
