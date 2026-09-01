// Utilities for formatting currency, dates, and numbers

export function formatVND(amount) {
  if (amount === undefined || amount === null || isNaN(amount) || amount === '') return '0\u00A0đ';
  const num = Math.round(Number(amount));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '\u00A0đ';
}

export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num) || num === '') return '0';
  const n = Math.round(Number(num));
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatDate(dateString) {
  if (!dateString) return '--/--/----';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return '--/--/---- --:--';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

// Calculate days remaining until expiry
export function getExpiryStatus(expiryDateStr) {
  if (!expiryDateStr) return { status: 'none', text: 'Chưa có HSD', days: 999 };
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDateStr);
  exp.setHours(0, 0, 0, 0);

  const diffTime = exp - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'expired',
      text: `ĐÃ HẾT HẠN (${Math.abs(diffDays)} ngày trước)`,
      days: diffDays,
      bg: 'bg-rose-950/80 text-rose-300 border-rose-600/50',
      badge: 'bg-rose-600 text-white'
    };
  } else if (diffDays <= 30) {
    return {
      status: 'critical',
      text: `Cận Date (còn ${diffDays} ngày)`,
      days: diffDays,
      bg: 'bg-amber-950/80 text-amber-300 border-amber-600/50',
      badge: 'bg-amber-500 text-slate-950 font-bold'
    };
  } else if (diffDays <= 90) {
    return {
      status: 'warning',
      text: `Còn ${diffDays} ngày`,
      days: diffDays,
      bg: 'bg-yellow-950/40 text-yellow-300 border-yellow-600/30',
      badge: 'bg-yellow-600 text-white'
    };
  } else {
    return {
      status: 'good',
      text: `Còn ${Math.floor(diffDays / 30)} tháng (${diffDays} ngày)`,
      days: diffDays,
      bg: 'bg-emerald-950/40 text-emerald-300 border-emerald-600/30',
      badge: 'bg-emerald-600 text-white'
    };
  }
}

/**
 * Format số tiền ngắn gọn cho mobile (1.5M, 2.3K, 1.2 tỷ)
 */
export function formatVNDCompact(value) {
  if (value === undefined || value === null || isNaN(value) || value === '') return '0₫';
  const num = Number(value);
  const absValue = Math.abs(num);
  
  if (absValue >= 1000000000) {
    return (num / 1000000000).toFixed(1) + ' tỷ';
  }
  if (absValue >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (absValue >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return formatNumber(num) + '₫';
}

/**
 * Truncate text với ellipsis cho mobile
 */
export function truncateText(text, maxLength = 20) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
