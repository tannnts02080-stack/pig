import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  PackagePlus, 
  DollarSign, 
  Calendar, 
  FileText, 
  Phone, 
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  Building2,
  MapPin,
  UserCheck
} from 'lucide-react';
import { formatVND, formatNumber, formatDateTime } from '../utils/formatters';
import { api } from '../utils/api';

export default function Purchases({ 
  purchases = [], 
  suppliers = [], 
  products = [], 
  onRefresh 
}) {
  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' | 'orders'
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Supplier Add/Edit Modal
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    phone: '',
    address: '',
    contactPerson: '',
    debtToPay: 0,
    notes: ''
  });

  // Purchase Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [lotNumber, setLotNumber] = useState(`LOT-HEO-${new Date().toISOString().slice(0,7).replace('-','')}`);
  const [purchaseItems, setPurchaseItems] = useState([
    { productId: products[0]?.id || '', productName: products[0]?.name || '', headCount: 10, weightKg: 50, costPrice: 200000, total: 2000000 }
  ]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = useMemo(() => {
    return purchaseItems.reduce((sum, item) => sum + (Number(item.headCount || item.quantityKg || 1) * Number(item.costPrice)), 0);
  }, [purchaseItems]);

  const totalSupplierDebt = useMemo(() => {
    return suppliers.reduce((sum, s) => sum + (Number(s.debtToPay) || 0), 0);
  }, [suppliers]);

  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierForm({
      name: '',
      phone: '',
      address: '',
      contactPerson: '',
      debtToPay: 0,
      notes: ''
    });
    setShowSupplierModal(true);
  };

  const handleOpenEditSupplier = (sup) => {
    setEditingSupplier(sup);
    setSupplierForm({
      name: sup.name || '',
      phone: sup.phone || '',
      address: sup.address || '',
      contactPerson: sup.contactPerson || '',
      debtToPay: sup.debtToPay || 0,
      notes: sup.notes || ''
    });
    setShowSupplierModal(true);
  };

  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await api.updateSupplier(editingSupplier.id, supplierForm);
      } else {
        await api.createSupplier(supplierForm);
      }
      setShowSupplierModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Lỗi lưu nhà cung cấp: ' + err.message);
    }
  };

  const handleDeleteSupplier = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa Nhà Cung Cấp "${name}" không?`)) {
      try {
        await api.deleteSupplier(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert('Lỗi xóa nhà cung cấp: ' + err.message);
      }
    }
  };

  const handleAddItemRow = () => {
    const defaultProd = products[0] || {};
    setPurchaseItems([
      ...purchaseItems,
      {
        productId: defaultProd.id || '',
        productName: defaultProd.name || '',
        headCount: 5,
        weightKg: 25,
        costPrice: defaultProd.costPrice || 200000,
        total: 5 * (defaultProd.costPrice || 200000)
      }
    ]);
  };

  const handleUpdateItemRow = (idx, field, value) => {
    const updated = [...purchaseItems];
    const item = updated[idx];
    
    if (field === 'productId') {
      const prod = products.find(p => p.id === value);
      item.productId = value;
      item.productName = prod ? prod.name : '';
      item.costPrice = prod ? (prod.costPrice || 200000) : 0;
      item.total = Number(item.headCount || item.quantityKg || 1) * item.costPrice;
    } else {
      item[field] = value;
      item.total = Number(item.headCount || item.quantityKg || 1) * Number(item.costPrice);
    }

    setPurchaseItems(updated);
  };

  const handleRemoveItemRow = (idx) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== idx));
  };

  const handleSubmitPurchase = async (e) => {
    e.preventDefault();
    if (purchaseItems.length === 0) return alert('Vui lòng thêm ít nhất 1 loại heo nhập');
    
    try {
      setIsSubmitting(true);
      const sup = suppliers.find(s => s.id === selectedSupplierId);

      await api.createPurchase({
        supplierId: selectedSupplierId || null,
        supplierName: sup ? sup.name : 'Nhà cung cấp tự do',
        lotNumber,
        items: purchaseItems,
        totalAmount,
        paidAmount: Number(paidAmount) || 0,
        note
      });

      setShowCreateModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Lỗi tạo phiếu nhập: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 max-w-7xl mx-auto pb-24 lg:pb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-sky-400" />
            Nhà Cung Cấp & Nhập Heo Đầu Vào
          </h2>
          <p className="text-xs text-slate-400">
            Quản lý danh sách đối tác cung cấp heo (Thêm - Sửa - Xóa) và tạo phiếu nhập heo tăng số lượng con trong kho
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'suppliers' ? 'bg-sky-500 text-white shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Nhà Cung Cấp ({suppliers.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'orders' ? 'bg-sky-500 text-white shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lịch Sử Nhập Hàng ({purchases.length})
            </button>
          </div>

          <button
            onClick={() => {
              setPaidAmount(0);
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white rounded-xl text-xs font-bold shadow-glow transition"
          >
            <PackagePlus className="w-4 h-4" />
            <span>+ Tạo Phiếu Nhập Heo</span>
          </button>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-sky-500">
          <span className="text-xs text-sky-300 font-bold">Tổng Số Nhà Cung Cấp</span>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">
            {suppliers.length} <span className="text-xs text-slate-400 font-semibold">đối tác nguồn heo</span>
          </div>
          <span className="text-[11px] text-slate-400">Trang trại Ba Vì, CP, Đồng Nai...</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-rose-500">
          <span className="text-xs text-rose-300 font-bold">Tổng Nợ Phải Trả NCC</span>
          <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1">
            {formatVND(totalSupplierDebt)}
          </div>
          <span className="text-[11px] text-slate-400">Công nợ các đợt nhập heo</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500">
          <span className="text-xs text-emerald-300 font-bold">Tổng Đợt Nhập Hàng</span>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">
            {purchases.length} <span className="text-xs text-slate-400 font-semibold">phiếu nhập kho</span>
          </div>
          <span className="text-[11px] text-emerald-400">Tự động cộng số CON vào kho</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SUPPLIERS CRUD (THÊM, XÓA, SỬA ĐẦY ĐỦ)           */}
      {/* ======================================================== */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-2xl border border-sky-900/40">
            <span className="text-xs font-bold text-slate-300">Danh sách Nhà Cung Cấp / Trang trại nguồn heo:</span>
            <button
              onClick={handleOpenAddSupplier}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-glow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Nhà Cung Cấp Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {suppliers.map((s) => (
              <div 
                key={s.id} 
                className="glass-card p-4 rounded-2xl border border-sky-900/30 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-black text-xs">
                        NCC
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm leading-snug">{s.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Mã: {s.id}</span>
                      </div>
                    </div>

                    {/* Action buttons (SỬA & XÓA) */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditSupplier(s)}
                        title="Chỉnh sửa thông tin NCC"
                        className="p-1.5 rounded-lg bg-slate-800 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(s.id, s.name)}
                        title="Xóa NCC"
                        className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mt-3 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Liên hệ: <span className="text-slate-200 font-semibold">{s.contactPerson || 'Chưa cập nhật'}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SĐT: <span className="text-slate-200 font-semibold">{s.phone || 'Chưa có SĐT'}</span></span>
                    </div>
                    {s.address && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span className="truncate">{s.address}</span>
                      </div>
                    )}
                    {s.notes && (
                      <div className="text-[11px] text-slate-400 italic bg-slate-900/80 p-2 rounded-lg mt-1 border border-slate-800">
                        {s.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Công nợ còn phải trả:</span>
                  <span className="font-black text-rose-400 text-sm">{formatVND(s.debtToPay || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PURCHASES ORDERS LIST                             */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-sky-900/40">
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              Lịch Sử Các Đợt Nhập Heo
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Mã phiếu & Ngày nhập</th>
                  <th className="p-3">Nhà Cung Cấp</th>
                  <th className="p-3">Số Lô (Lot)</th>
                  <th className="p-3">Heo / Mặt hàng nhập</th>
                  <th className="p-3 text-right">Tổng tiền vốn</th>
                  <th className="p-3 text-right">Đã trả</th>
                  <th className="p-3 text-right">Ghi nợ NCC</th>
                  <th className="p-3">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {purchases.map((pur) => (
                  <tr key={pur.id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-white">#{pur.id}</div>
                      <div className="text-[10px] text-slate-400">{formatDateTime(pur.createdAt)}</div>
                    </td>
                    <td className="p-3 font-semibold text-sky-300">
                      {pur.supplierName}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-300">
                      {pur.lotNumber || 'N/A'}
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5">
                        {pur.items.map((item, idx) => (
                          <div key={idx} className="text-slate-300">
                            • {item.productName}: <span className="font-black text-emerald-400">{item.headCount ? `${item.headCount} CON` : `${item.quantityKg} kg`}</span> (Vốn: {formatNumber(item.costPrice)}đ)
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right font-black text-white">
                      {formatVND(pur.totalAmount)}
                    </td>
                    <td className="p-3 text-right font-semibold text-emerald-400">
                      {formatVND(pur.paidAmount)}
                    </td>
                    <td className="p-3 text-right font-bold text-rose-400">
                      {pur.debtAmount > 0 ? formatVND(pur.debtAmount) : '0 đ'}
                    </td>
                    <td className="p-3 text-slate-400 italic">
                      {pur.note || '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT SUPPLIER MODAL                                */}
      {/* ======================================================== */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-sky-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                {editingSupplier ? 'Chỉnh Sửa Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp Mới'}
              </h3>
              <button onClick={() => setShowSupplierModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tên Nhà Cung Cấp / Trang Trại: *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trang Trại Heo Ba Vì (Nhà Cung Cấp A)..."
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Người liên hệ:</label>
                  <input
                    type="text"
                    placeholder="VD: Anh Hùng..."
                    value={supplierForm.contactPerson}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    placeholder="09xx..."
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Địa chỉ trang trại / kho:</label>
                <input
                  type="text"
                  placeholder="Địa chỉ..."
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nợ đầu kỳ phải trả NCC (đ):</label>
                <input
                  type="number"
                  value={supplierForm.debtToPay}
                  onChange={(e) => setSupplierForm({ ...supplierForm, debtToPay: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-bold text-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Ghi chú về nguồn heo:</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về nguồn hàng heo sữa, giá cả..."
                  value={supplierForm.notes}
                  onChange={(e) => setSupplierForm({ ...supplierForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowSupplierModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-glow">
                  {editingSupplier ? 'Lưu Thay Đổi' : 'Thêm Nhà Cung Cấp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE PURCHASE MODAL (TẠO PHIẾU NHẬP HEO)              */}
      {/* ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-sky-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-sky-400" />
                Tạo Phiếu Nhập Heo Đầu Vào
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPurchase} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Nhà Cung Cấp nguồn nhập: *</label>
                  <select
                    required
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-bold"
                  >
                    <option value="">-- Chọn Nhà Cung Cấp --</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Số Lô (Lot Number):</label>
                  <input
                    type="text"
                    required
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-sky-300">Danh sách heo nhập kho:</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-sky-400 hover:text-sky-300 font-bold"
                  >
                    + Thêm dòng
                  </button>
                </div>

                <div className="space-y-2">
                  {purchaseItems.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <select
                        value={item.productId}
                        onChange={(e) => handleUpdateItemRow(idx, 'productId', e.target.value)}
                        className="flex-2 min-w-[160px] px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                      >
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="Số CON"
                          value={item.headCount}
                          onChange={(e) => handleUpdateItemRow(idx, 'headCount', e.target.value)}
                          className="w-20 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-black text-center text-emerald-400"
                        />
                        <span className="text-xs text-slate-400">CON</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="Giá vốn"
                          value={item.costPrice}
                          onChange={(e) => handleUpdateItemRow(idx, 'costPrice', e.target.value)}
                          className="w-24 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-bold text-right"
                        />
                        <span className="text-xs text-slate-400">đ/con</span>
                      </div>

                      <span className="text-xs font-bold text-emerald-400 min-w-[90px] text-right">
                        {formatVND(item.total)}
                      </span>

                      {purchaseItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment details */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Tổng tiền vốn nhập:</span>
                  <span className="text-base font-black text-white">{formatVND(totalAmount)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Đã trả NCC (đ):</label>
                    <input
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-bold text-emerald-400"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Ghi nợ NCC:</span>
                    <div className="text-sm font-bold text-rose-400 pt-1">
                      {formatVND(Math.max(0, totalAmount - Number(paidAmount || 0)))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Ghi chú đợt nhập:</label>
                <input
                  type="text"
                  placeholder="VD: Heo sữa đợt 1 từ trại Ba Vì, chất lượng tốt..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl">Hủy</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-glow">
                  {isSubmitting ? 'Đang lưu...' : 'Xác Nhận Nhập Heo'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
