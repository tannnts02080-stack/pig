import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  DollarSign, 
  CreditCard, 
  Phone, 
  MapPin, 
  Edit3, 
  Trash2, 
  QrCode, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  X,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { formatVND, formatNumber, formatDateTime } from '../utils/formatters';
import { getVietQRUrl } from '../utils/vietqr';
import { api } from '../utils/api';

export default function Customers({ 
  customers = [], 
  debtTransactions = [], 
  settings = {}, 
  onRefresh,
  autoOpenCreate = false
}) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'history'
  const [search, setSearch] = useState('');
  const [filterDebtOnly, setFilterDebtOnly] = useState(false);

  // Add/Edit Customer Modal
  const [showModal, setShowModal] = useState(autoOpenCreate);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Đại lý sỉ',
    phone: '',
    address: '',
    maxDebt: 20000000,
    notes: ''
  });

  // Repay Debt Modal (Thu nợ)
  const [repayCustomer, setRepayCustomer] = useState(null);
  const [repayAmount, setRepayAmount] = useState(0);
  const [repayMethod, setRepayMethod] = useState('VietQR');
  const [repayNote, setRepayNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Metrics
  const stats = useMemo(() => {
    let totalDebt = 0;
    let customersWithDebt = 0;
    customers.forEach(c => {
      const debt = Number(c.debt) || 0;
      totalDebt += debt;
      if (debt > 0) customersWithDebt++;
    });
    return { totalDebt, customersWithDebt };
  }, [customers]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const s = search.toLowerCase();
      const matchSearch = !search || 
        c.name.toLowerCase().includes(s) || 
        (c.phone && c.phone.includes(s)) ||
        (c.address && c.address.toLowerCase().includes(s));
      const matchDebt = !filterDebtOnly || (c.debt && c.debt > 0);
      return matchSearch && matchDebt;
    });
  }, [customers, search, filterDebtOnly]);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      type: 'Đại lý sỉ',
      phone: '',
      address: '',
      maxDebt: 20000000,
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name || '',
      type: c.type || 'Đại lý sỉ',
      phone: c.phone || '',
      address: c.address || '',
      maxDebt: c.maxDebt || 20000000,
      notes: c.notes || ''
    });
    setShowModal(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.updateCustomer(editingCustomer.id, formData);
      } else {
        await api.createCustomer(formData);
      }
      setShowModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Lỗi lưu khách hàng: ' + err.message);
    }
  };

  const handleDeleteCustomer = async (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${name}" không?`)) {
      try {
        await api.deleteCustomer(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert('Lỗi xóa khách hàng: ' + err.message);
      }
    }
  };

  // Open Repay Modal
  const handleOpenRepay = (c) => {
    setRepayCustomer(c);
    setRepayAmount(c.debt || 0);
    setRepayMethod('VietQR');
    setRepayNote(`Thu nợ khách hàng ${c.name}`);
  };

  // Submit Repay
  const handleSubmitRepay = async (e) => {
    e.preventDefault();
    if (!repayCustomer) return;
    try {
      setIsSubmitting(true);
      await api.repayDebt(repayCustomer.id, {
        amount: Number(repayAmount),
        paymentMethod: repayMethod,
        note: repayNote
      });
      setRepayCustomer(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Lỗi thu nợ: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Repay VietQR Url
  const repayVietQrUrl = useMemo(() => {
    if (!repayCustomer) return '';
    return getVietQRUrl({
      bankBin: settings.bankBin,
      bankAccount: settings.bankAccount,
      amount: repayAmount,
      memo: `TRA NO ${repayCustomer.id}`,
      accountName: settings.bankHolder
    });
  }, [repayCustomer, repayAmount, settings]);

  return (
    <div className="p-3 sm:p-6 space-y-4 max-w-7xl mx-auto pb-24 lg:pb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" />
            Khách Hàng & Quản Lý Sổ Nợ
          </h2>
          <p className="text-xs text-slate-400">
            Theo dõi khách sỉ, đại lý quán ăn, hạn mức nợ và gạch nợ từng lần qua VietQR / Tiền mặt
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'list' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Danh Sách Khách ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'history' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lịch Sử Sổ Nợ ({debtTransactions.length})
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white rounded-xl text-xs font-bold shadow-glow transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm Khách Hàng</span>
          </button>
        </div>
      </div>

      {/* Debt Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-rose-500 flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-300 font-medium">Tổng Công Nợ Cần Thu</span>
            <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1">
              {formatVND(stats.totalDebt)}
            </div>
            <span className="text-[11px] text-slate-400">Từ {stats.customersWithDebt} khách hàng đang nợ</span>
          </div>
          <CreditCard className="w-8 h-8 text-rose-500/40" />
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-sky-500 flex items-center justify-between">
          <div>
            <span className="text-xs text-sky-300 font-medium">Tổng Khách Hàng / Đại Lý</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {customers.length} <span className="text-xs text-slate-400 font-semibold">khách</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              {customers.length - stats.customersWithDebt} khách không có nợ
            </span>
          </div>
          <Users className="w-8 h-8 text-sky-500/40" />
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-300 font-medium">Phương Thức Thu Nợ</span>
            <div className="text-sm font-bold text-white mt-1">
              Tự Động Sinh VietQR
            </div>
            <span className="text-[11px] text-slate-400">Khách quét mã chuyển tiền gạch nợ tức thì</span>
          </div>
          <QrCode className="w-8 h-8 text-emerald-500/40" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      {activeTab === 'list' && (
        <div className="p-3 bg-slate-900/80 border border-sky-900/40 rounded-2xl flex flex-wrap gap-2 items-center justify-between">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên khách hàng, số điện thoại, địa chỉ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterDebtOnly(!filterDebtOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterDebtOnly ? 'bg-rose-600 text-white shadow-glow' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Chỉ hiện khách đang nợ ({stats.customersWithDebt})
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: CUSTOMERS LIST                                    */}
      {/* ======================================================== */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCustomers.map((c) => {
            const hasDebt = (c.debt || 0) > 0;
            const isOverLimit = (c.debt || 0) > (c.maxDebt || 20000000);

            return (
              <div 
                key={c.id} 
                className={`glass-card p-4 rounded-2xl flex flex-col justify-between relative ${
                  hasDebt ? 'border-rose-900/50' : 'border-sky-900/30'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                        {c.type || 'Khách sỉ'}
                      </span>
                      <h3 className="font-bold text-white text-base mt-1.5">{c.name}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomer(c.id, c.name)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mt-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-sky-400" />
                      <span>{c.phone || 'Chưa có SĐT'}</span>
                    </div>
                    {c.address && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="truncate">{c.address}</span>
                      </div>
                    )}
                    {c.notes && (
                      <div className="text-[11px] text-slate-400 italic bg-slate-900/80 p-1.5 rounded-lg mt-1">
                        {c.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Debt Box & Action */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Số dư công nợ:</span>
                      <div className={`text-base font-black ${hasDebt ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {formatVND(c.debt || 0)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Hạn mức nợ:</span>
                      <span className="text-xs font-semibold text-slate-300">{formatVND(c.maxDebt || 20000000)}</span>
                    </div>
                  </div>

                  {hasDebt && (
                    <button
                      onClick={() => handleOpenRepay(c)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-glow"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Thu Nợ (Tạo VietQR / Tiền Mặt)</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DEBT TRANSACTIONS HISTORY                         */}
      {/* ======================================================== */}
      {activeTab === 'history' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-sky-900/40">
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />
              Lịch Sử Biến Động Công Nợ
            </h3>
            <span className="text-xs text-slate-400">{debtTransactions.length} giao dịch gần nhất</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Thời gian</th>
                  <th className="p-3">Khách hàng</th>
                  <th className="p-3">Loại giao dịch</th>
                  <th className="p-3 text-right">Số tiền</th>
                  <th className="p-3">Ghi chú & Mã đơn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {debtTransactions.map((tx) => {
                  const isAddDebt = tx.type === 'ADD_DEBT';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {formatDateTime(tx.createdAt)}
                      </td>
                      <td className="p-3 font-bold text-white">
                        {tx.customerName}
                      </td>
                      <td className="p-3">
                        {isAddDebt ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-800/40">
                            <ArrowUpRight className="w-3 h-3 text-rose-400" />
                            Ghi nợ đơn hàng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800/40">
                            <ArrowDownRight className="w-3 h-3 text-emerald-400" />
                            Khách trả nợ ({tx.paymentMethod || 'VietQR'})
                          </span>
                        )}
                      </td>
                      <td className={`p-3 text-right font-black ${isAddDebt ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isAddDebt ? '+' : '-'}{formatVND(tx.amount)}
                      </td>
                      <td className="p-3 text-slate-300">
                        {tx.note || 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT CUSTOMER MODAL                                */}
      {/* ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-sky-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                {editingCustomer ? 'Chỉnh Sửa Thông Tin Khách Hàng' : 'Thêm Khách Hàng / Đại Lý Mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tên khách hàng / Quán ăn: *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Quán Nướng BBQ 68, Chị Lan Mối Chợ..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phân loại:</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  >
                    <option value="Đại lý sỉ">Đại lý sỉ</option>
                    <option value="Quán ăn / Nhà hàng">Quán ăn / Nhà hàng</option>
                    <option value="Khách lẻ">Khách lẻ</option>
                    <option value="Mối chợ đầu mối">Mối chợ đầu mối</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    placeholder="09xx..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Địa chỉ giao hàng:</label>
                <input
                  type="text"
                  placeholder="Địa chỉ quán hoặc sạp chợ..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Hạn mức nợ tối đa (đ):</label>
                <input
                  type="number"
                  value={formData.maxDebt}
                  onChange={(e) => setFormData({ ...formData, maxDebt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-bold text-sky-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Ghi chú:</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về thói quen lấy hàng hoặc hạn thanh toán..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-glow"
                >
                  Lưu Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REPAY DEBT MODAL (THU NỢ KHÁCH HÀNG)                      */}
      {/* ======================================================== */}
      {repayCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-emerald-600 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Thu Tiền Nợ: {repayCustomer.name}
              </h3>
              <button onClick={() => setRepayCustomer(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRepay} className="p-5 space-y-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400">Tổng nợ hiện tại:</span>
                  <div className="text-lg font-black text-rose-400">{formatVND(repayCustomer.debt)}</div>
                </div>
                <span className="text-xs text-slate-400">{repayCustomer.phone}</span>
              </div>

              {/* Repay Method */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Hình thức thu nợ:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRepayMethod('VietQR')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      repayMethod === 'VietQR' ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    Chuyển Khoản VietQR
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepayMethod('Cash')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      repayMethod === 'Cash' ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Thu Tiền Mặt
                  </button>
                </div>
              </div>

              {/* VietQR View */}
              {repayMethod === 'VietQR' && repayAmount > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/60 text-center">
                  <img src={repayVietQrUrl} alt="VietQR" className="w-40 h-40 mx-auto rounded-lg bg-white p-1" />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Quét mã để chuyển <span className="font-bold text-white">{formatVND(repayAmount)}</span> vào tài khoản {settings.bankName}
                  </p>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Số tiền khách trả (đ): *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  max={repayCustomer.debt}
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-black text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Ghi chú giao dịch:</label>
                <input
                  type="text"
                  value={repayNote}
                  onChange={(e) => setRepayNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRepayCustomer(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-glow"
                >
                  {isSubmitting ? 'ĐANG LƯU...' : 'XÁC NHẬN ĐÃ THU TIỀN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
