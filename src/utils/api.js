// Frontend API client wrapper

const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Lỗi kết nối máy chủ (${res.status})` }));
      throw new Error(err.error || 'Đã có lỗi xảy ra');
    }

    return await res.json();
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
}

export const api = {
  // System info
  getSystemInfo: () => fetchJSON('/system-info'),

  // Products & Pigs (Kho heo)
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJSON(`/products${query ? `?${query}` : ''}`);
  },
  createProduct: (data) => fetchJSON('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => fetchJSON(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => fetchJSON(`/products/${id}`, { method: 'DELETE' }),
  adjustStock: (id, data) => fetchJSON(`/products/${id}/adjust-stock`, { method: 'POST', body: JSON.stringify(data) }),

  // Orders
  getOrders: () => fetchJSON('/orders'),
  createOrder: (data) => fetchJSON('/orders', { method: 'POST', body: JSON.stringify(data) }),
  deleteOrder: (id) => fetchJSON(`/orders/${id}`, { method: 'DELETE' }),

  // Customers & Debts
  getCustomers: () => fetchJSON('/customers'),
  createCustomer: (data) => fetchJSON('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => fetchJSON(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id) => fetchJSON(`/customers/${id}`, { method: 'DELETE' }),
  repayDebt: (id, data) => fetchJSON(`/customers/${id}/repay`, { method: 'POST', body: JSON.stringify(data) }),
  getDebtTransactions: () => fetchJSON('/debt-transactions'),

  // Suppliers (Nhà Cung Cấp - Thêm, Xóa, Sửa đầy đủ)
  getSuppliers: () => fetchJSON('/suppliers'),
  createSupplier: (data) => fetchJSON('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  updateSupplier: (id, data) => fetchJSON(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSupplier: (id) => fetchJSON(`/suppliers/${id}`, { method: 'DELETE' }),
  getPurchases: () => fetchJSON('/purchases'),
  createPurchase: (data) => fetchJSON('/purchases', { method: 'POST', body: JSON.stringify(data) }),

  // Reports
  getDashboardReports: () => fetchJSON('/reports/dashboard'),

  // Settings & Backup
  getSettings: () => fetchJSON('/settings'),
  updateSettings: (data) => fetchJSON('/settings', { method: 'POST', body: JSON.stringify(data) }),
  restoreBackup: (data) => fetchJSON('/backup/restore', { method: 'POST', body: JSON.stringify(data) }),
};
