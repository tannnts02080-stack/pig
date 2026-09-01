/**
 * API Configuration
 * Đổi API_BASE_URL khi deploy hoặc chạy trên mobile
 */

// Detect environment
const isDevelopment = import.meta.env.DEV;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// API Base URL
export const API_BASE_URL = isDevelopment && isLocalhost
  ? '/api' // Development: dùng proxy
  : 'http://172.21.154.88:8080/api'; // Production/Mobile: dùng IP thực

/**
 * Tạo API URL đầy đủ
 */
export function getApiUrl(endpoint) {
  // Nếu endpoint đã có http:// thì return luôn
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // Bỏ slash đầu nếu có
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Nếu đã có /api thì bỏ đi
  const finalEndpoint = cleanEndpoint.startsWith('api/') 
    ? cleanEndpoint.slice(4) 
    : cleanEndpoint;
  
  return `${API_BASE_URL}/${finalEndpoint}`;
}

/**
 * Fetch wrapper với API base URL
 */
export async function apiFetch(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  return fetch(url, options);
}

console.log('🔗 API Base URL:', API_BASE_URL);
