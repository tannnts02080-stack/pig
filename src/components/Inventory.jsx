import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Edit2, Trash2, Truck, Flame, Snowflake, 
  Calendar, DollarSign, Building2, Search, RefreshCw, AlertCircle, 
  Layers, CheckCircle2, Clock, FileText, ArrowRight, ShieldCheck
} from 'lucide-react';
import { formatVND, formatNumber, formatDate } from '../utils/formatters';
import { api } from '../utils/api';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab con trong kho: 'stock' (Bảng tồn kho) | 'purchases' (Lịch sử nhập & Tổng kết ngày)
  const [subTab, setSubTab] = useState('stock');

  // Modal Nhập Hàng Chuyến Xe
  const [showImportModal, setShowImportModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Thống kê cuối ngày
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().slice(0, 10));
  const [dailySummary, setDailySummary] = useState(null);

  // Form Nhập Chuyến Xe Heo Mới
  const [importForm, setImportForm] = useState({
    supplierId: '',
    importDate: new Date().toISOString().slice(0, 10),
    porkType: 'hot', // 'hot' hoặc 'cold'
    shippingFee: 150000, // Chi phí tiền xe khách chở tới
    paidAmount: '',
    paymentMethod: 'Cash', // 'Cash' hoặc 'Bank'
    bankAccountId: '',
    notes: 'Nhập chuyến xe khách sáng sớm',
    items: [
      {
        productId: '',
        sizeType: 'Heo 5Kg',
        headCount: 10,
        costPrice: 800000
      }
    ]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, sups, banks, daily] = await Promise.all([
        api.getProducts().catch(() => []),
        api.getSuppliers().catch(() => []),
        api.getBankAccounts().catch(() => []),
        api.getDailyImport(dailyDate).catch(() => {})
      ]);

      const safeProds = Array.isArray(prods) ? prods : (prods?.data && Array.isArray(prods.data) ? prods.data : []);
      const safeSups = Array.isArray(sups) ? sups : (sups?.data && Array.isArray(sups.data) ? sups.data : []);
      const safeBanks = Array.isArray(banks) ? banks : (banks?.data && Array.isArray(banks.data) ? banks.data : []);

      setProducts(safeProds);
      setSuppliers(safeSups);
      setBankAccounts(safeBanks);
      setDailySummary(daily || {});

      if (safeSups.length > 0 && !importForm.supplierId) {
        setImportForm(prev => ({
          ...prev,
          supplierId: safeSups[0].id,
          bankAccountId: safeBanks[0]?.id || '',
          items: [{ 
            productId: safeProds[0]?.id || '',
            sizeType: safeProds[0]?.sizeType || safeProds[0]?.loaiSize || 'Heo 5Kg',
            headCount: 10,
            costPrice: safeProds[0]?.costPrice || safeProds[0]?.giaNhapVon || 800000
          }]
        }));
      }
    } catch (e) {
      console.error("Lỗi tải dữ liệu kho:", e);
      setProducts([]);
      setSuppliers([]);
      setBankAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dailyDate]);

  // Thêm dòng size khi nhập hàng
  const handleAddItemRow = () => {
    const firstP = products[0];
    setImportForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: firstP?.id || '',
          sizeType: firstP?.sizeType || firstP?.loaiSize || 'Heo 5Kg',
          headCount: 5,
          costPrice: firstP?.costPrice || firstP?.giaNhapVon || 800000
        }
      ]
    }));
  };

  const handleRemoveItemRow = (index) => {
    if (importForm.items.length === 1) return;
    setImportForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setImportForm(prev => {
      const updated = [...prev.items];
      updated[index][field] = value;
      if (field === 'productId') {
        const p = products.find(prod => String(prod.id) === String(value));
        if (p) {
          updated[index].sizeType = p.sizeType || p.loaiSize || '';
          updated[index].costPrice = p.costPrice || p.giaNhapVon || 0;
        }
      }
      return { ...prev, items: updated };
    });
  };

  // Tính tổng tiền heo và tổng tiền cả chuyến xe
  const totalProductCost = importForm.items.reduce((sum, it) => {
    const qty = Number(it.headCount) || 0;
    const cost = Number(it.costPrice) || 0;
    return sum + (qty * cost);
  }, 0);

  const totalTripCost = totalProductCost + (Number(importForm.shippingFee) || 0);

  // Submit Phiếu Nhập Xe Khách
  const handleSaveImport = async (e) => {
    e.preventDefault();
    if (!importForm.supplierId) {
      alert("Vui lòng chọn Nhà cung cấp!");
      return;
    }

    const payload = {
      supplierId: Number(importForm.supplierId),
      importDate: importForm.importDate,
      porkType: importForm.porkType,
      shippingFee: Number(importForm.shippingFee) || 0,
      totalProductCost: totalProductCost,
      totalCost: totalTripCost,
      paymentMethod: importForm.paymentMethod,
      bankAccountId: importForm.paymentMethod === 'Bank' ? Number(importForm.bankAccountId) : null,
      paidAmount: importForm.paidAmount !== '' ? Number(importForm.paidAmount) : totalTripCost,
      notes: importForm.notes,
      items: importForm.items.map(it => ({
        productId: it.productId ? Number(it.productId) : null,
        sizeType: it.sizeType,
        unit: 'Con',
        headCount: Number(it.headCount) || 0,
        soLuongCon: Number(it.headCount) || 0,
        costPrice: Number(it.costPrice) || 0,
        giaNhap: Number(it.costPrice) || 0,
        totalCost: (Number(it.headCount) || 0) * (Number(it.costPrice) || 0)
      }))
    };

    try {
      await api.createPurchase(payload);
      alert("✅ Đã tạo phiếu nhập chuyến xe thành công! Kho đã được cộng thêm số lượng con.");
      setShowImportModal(false);
      fetchData();
    } catch (e) {
      alert("Lỗi kết nối máy chủ: " + e.message);
    }
  };

  // Cập nhật nhanh số lượng con tồn kho
  const handleQuickUpdateStock = async (product, newCount) => {
    const count = parseInt(newCount);
    if (isNaN(count) || count < 0) return;

    try {
      await api.updateProduct(product.id, {
        ...product,
        headCount: count,
        soLuongCon: count
      });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, headCount: count, soLuongCon: count } : p));
    } catch (e) {
      console.error(e);
    }
  };

  // Tính toán tồn kho tổng
  const totalStockCon = products.reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);
  const totalHotCon = products.filter(p => (p.porkType || p.loaiHeo) === 'hot').reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);
  const totalColdCon = products.filter(p => (p.porkType || p.loaiHeo) === 'cold').reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);

  // Lọc sản phẩm hiển thị trong kho
  const filteredProducts = products.filter(p => {
    const name = (p.name || p.tenSanPham || '').toLowerCase();
    const size = (p.sizeType || p.loaiSize || '').toLowerCase();
    const supName = (p.supplier?.tenNhaCungCap || p.nhaCungCap?.tenNhaCungCap || '').toLowerCase();
    const type = p.porkType || p.loaiHeo;

    const matchSearch = name.includes(search.toLowerCase()) || size.includes(search.toLowerCase()) || supName.includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-600/30 ring-1 ring-white/20">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Quản Lý Kho Heo & Nhập Hàng
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Theo dõi số lượng con tồn kho, nhập hàng theo chuyến xe khách, phân bổ tiền xe & tổng kết tiền nhập cuối ngày
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={fetchData}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700/60 shadow-md transition-all active:scale-95"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-cyan-600/30 transition-all transform active:scale-95 border border-cyan-400/30"
          >
            <Truck className="w-5 h-5" />
            <span>Nhập Chuyến Xe Heo Mới</span>
          </button>
        </div>
      </div>

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Tổng tồn con */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tổng Heo Trong Kho</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">{formatNumber(totalStockCon)}</span>
              <span className="text-sm font-bold text-slate-400">con</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Tất cả các size & nhà cung cấp</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-300">
            <Package className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* Card 2: Tồn Hàng Nóng */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-400">
              <Flame className="w-3.5 h-3.5" />
              <span>Tồn Hàng Nóng (Tươi)</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-rose-400">{formatNumber(totalHotCon)}</span>
              <span className="text-sm font-bold text-slate-400">con</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Heo tươi mổ trong ngày</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-950/50 border border-rose-800/50 flex items-center justify-center text-rose-400">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Tồn Hàng Lạnh */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              <Snowflake className="w-3.5 h-3.5" />
              <span>Tồn Hàng Lạnh (Đông)</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-cyan-400">{formatNumber(totalColdCon)}</span>
              <span className="text-sm font-bold text-slate-400">con</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Kho cấp đông chuẩn sạch</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
            <Snowflake className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Tổng tiền nhập trong ngày */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Tổng Tiền Nhập Hôm Nay</span>
              <input
                type="date"
                value={dailyDate}
                onChange={e => setDailyDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-[10px] text-slate-300 outline-none"
              />
            </div>
            <div className="text-2xl font-black text-amber-300 mt-1">
              {formatVND(dailySummary?.tongTienNhapTrongNgay || dailySummary?.totalCost || 0)}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
              <span>Tiền heo: {formatVND(dailySummary?.tongTienHangHeo || dailySummary?.totalProductCost || 0)}</span>
              <span>•</span>
              <span className="text-cyan-400">Tiền xe: {formatVND(dailySummary?.tongTienXeKhach || dailySummary?.totalShippingFee || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('stock')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              subTab === 'stock'
                ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Danh Mục Tồn Kho Theo Con ({products.length})</span>
          </button>

          <button
            onClick={() => setSubTab('purchases')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              subTab === 'purchases'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Phiếu Nhập Chuyến Xe & Tổng Kết Ngày</span>
          </button>
        </div>

        {subTab === 'stock' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm ô heo tồn kho..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
            >
              <option value="ALL">Tất cả loại</option>
              <option value="hot">Hàng Nóng</option>
              <option value="cold">Hàng Lạnh</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: BẢNG TỒN KHO THEO SỐ LƯỢNG CON */}
      {subTab === 'stock' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-5">Sản Phẩm Heo</th>
                  <th className="py-4 px-4">Phân Loại</th>
                  <th className="py-4 px-4">Nhà Cung Cấp</th>
                  <th className="py-4 px-4 text-center">Tồn Kho (Con)</th>
                  <th className="py-4 px-4 text-right">Giá Nhập Vốn (Nhỏ)</th>
                  <th className="py-4 px-4 text-right">Giá Bán Ra (To)</th>
                  <th className="py-4 px-5">Ngày & Chi Tiết Nhập</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-500">
                      Không có sản phẩm heo nào trong danh mục
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(p => {
                    const isHot = (p.porkType || p.loaiHeo) === 'hot';
                    const stock = p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0);
                    const supName = p.supplier?.tenNhaCungCap || p.nhaCungCap?.tenNhaCungCap || 'Trang Trại Ba Vì';

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || p.imageUrl || p.hinhAnh || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300'}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-slate-700/60 shadow-md shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white text-sm hover:text-amber-400 transition">
                                {p.name || p.tenSanPham}
                              </div>
                              <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                                {p.sizeType || p.loaiSize || 'Heo chuẩn'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {isHot ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                              <Flame className="w-3 h-3 text-rose-400" />
                              Hàng Nóng
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                              <Snowflake className="w-3 h-3 text-cyan-400" />
                              Hàng Lạnh
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-slate-300 font-medium">
                          {supName}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl">
                            <span className={`text-base font-black ${stock > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                              {stock}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">con</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right font-medium text-slate-400">
                          {formatVND(p.costPrice || p.giaNhapVon)}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <span className="text-base font-black text-amber-400">
                            {formatVND(p.sellingPrice || p.giaBanRa)}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          <div className="text-slate-300 font-semibold text-[11px]">
                            {formatDate(p.importDate || p.ngayNhap)}
                          </div>
                          <div className="text-slate-500 text-[11px] italic max-w-xs truncate">
                            {p.importDetails || p.chiTietNhap || 'Không có ghi chú'}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LỊCH SỬ PHIẾU NHẬP CHUYẾN XE & TỔNG KẾT NGÀY */}
      {subTab === 'purchases' && (
        <div className="space-y-6">
          {/* Tổng kết ngày Box */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black text-amber-400 tracking-wider">Tổng Kết Nhập Hàng Trong Ngày</span>
                <span className="text-xs px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-bold border border-amber-500/30">
                  {formatDate(dailyDate)}
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Tổng hợp chi phí tiền nhập heo, chi phí tiền xe khách và số con đã nhập vào kho
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="text-center px-3 border-r border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500">Số Chuyến Xe</div>
                <div className="text-xl font-black text-white">{dailySummary?.soChuyenXe || dailySummary?.totalShipments || 0}</div>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500">Tổng Số Con</div>
                <div className="text-xl font-black text-emerald-400">{dailySummary?.tongSoCon || dailySummary?.totalHeads || 0} con</div>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500">Tiền Heo</div>
                <div className="text-sm font-bold text-slate-300">{formatVND(dailySummary?.tongTienHangHeo || dailySummary?.totalProductCost || 0)}</div>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <div className="text-[10px] uppercase font-bold text-cyan-400">Tiền Xe Khách</div>
                <div className="text-sm font-bold text-cyan-300">{formatVND(dailySummary?.tongTienXeKhach || dailySummary?.totalShippingFee || 0)}</div>
              </div>
              <div className="text-center pl-2">
                <div className="text-[10px] uppercase font-bold text-amber-400">Tổng Tiền Nhập Ngày</div>
                <div className="text-xl font-black text-amber-400">{formatVND(dailySummary?.tongTienNhapTrongNgay || dailySummary?.totalCost || 0)}</div>
              </div>
            </div>
          </div>

          {/* Danh sách phiếu nhập */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-cyan-400" />
              <span>Danh Sách Chuyến Xe Đã Nhập Ngày {formatDate(dailyDate)}</span>
            </h3>

            {(!dailySummary?.danhSachPhieuNhap || dailySummary.danhSachPhieuNhap.length === 0) ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Chưa có chuyến xe nào nhập trong ngày {formatDate(dailyDate)}. Hãy bấm nút "Nhập Chuyến Xe Heo Mới" ở trên.
              </div>
            ) : (
              <div className="space-y-4">
                {dailySummary.danhSachPhieuNhap.map((pn, idx) => (
                  <div key={pn.id || idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{pn.maPhieuNhap || `PN-${pn.id}`}</span>
                        <span className="text-xs text-slate-300 font-bold">• {pn.nhaCungCap?.tenNhaCungCap || 'NCC A'}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-lg">
                          {pn.loaiHeo === 'hot' ? '🔥 Hàng Nóng' : '❄️ Hàng Lạnh'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 mr-2">Tổng chuyến xe:</span>
                        <span className="text-base font-black text-amber-400">{formatVND(pn.tongTienNhap || pn.totalCost)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Tiền hàng heo: </span>
                        <span className="font-bold text-slate-200">{formatVND(pn.tienHangHeo || pn.totalProductCost)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Tiền xe khách chở tới: </span>
                        <span className="font-bold text-cyan-400">+{formatVND(pn.chiPhiTienXe || pn.shippingFee)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Ghi chú: </span>
                        <span className="text-slate-300 italic">{pn.ghiChu || pn.notes || 'Không'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL NHẬP CHUYẾN XE HEO MỚI */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Lập Phiếu Nhập Chuyến Xe Heo Mới</h2>
                  <p className="text-xs text-slate-400">Nhập theo từng size heo, tiền xe khách & tự động cộng tồn kho</p>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveImport} className="space-y-4">
              {/* NCC, Ngày nhập, Loại heo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nhà Cung Cấp / Trang Trại <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={importForm.supplierId}
                    onChange={e => setImportForm({ ...importForm, supplierId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    {suppliers.map(sup => (
                      <option key={sup.id} value={sup.id}>{sup.tenNhaCungCap || sup.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Ngày Nhập Xe
                  </label>
                  <input
                    type="date"
                    value={importForm.importDate}
                    onChange={e => setImportForm({ ...importForm, importDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Phân Loại Hàng
                  </label>
                  <select
                    value={importForm.porkType}
                    onChange={e => setImportForm({ ...importForm, porkType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 font-semibold"
                  >
                    <option value="hot">🔥 Hàng Nóng (Tươi)</option>
                    <option value="cold">❄️ Hàng Lạnh (Cấp Đông)</option>
                  </select>
                </div>
              </div>

              {/* Danh sách các size heo trong chuyến xe */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-400">Các Size Heo Trong Chuyến Xe</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1 px-3 py-1 bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg text-xs font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm Dòng Size
                  </button>
                </div>

                <div className="space-y-2.5">
                  {importForm.items.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                      <div className="flex-1 min-w-[140px]">
                        <label className="block text-[10px] text-slate-400 mb-1">Chọn Ô Heo / Size</label>
                        <select
                          value={item.productId}
                          onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name || p.tenSanPham} - ({p.sizeType || p.loaiSize})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-24">
                        <label className="block text-[10px] text-slate-400 mb-1">Số Con</label>
                        <input
                          type="number"
                          min="1"
                          value={item.headCount}
                          onChange={e => handleItemChange(idx, 'headCount', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-black text-emerald-400 outline-none"
                        />
                      </div>

                      <div className="w-32">
                        <label className="block text-[10px] text-slate-400 mb-1">Giá Nhập/Con</label>
                        <input
                          type="number"
                          step="1000"
                          value={item.costPrice}
                          onChange={e => handleItemChange(idx, 'costPrice', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-200 outline-none"
                        />
                      </div>

                      <div className="w-28 text-right">
                        <label className="block text-[10px] text-slate-400 mb-1">Thành Tiền</label>
                        <div className="text-xs font-bold text-amber-400 py-1.5">
                          {formatVND((Number(item.headCount) || 0) * (Number(item.costPrice) || 0))}
                        </div>
                      </div>

                      {importForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition mt-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chi phí tiền xe khách & Thanh toán */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-cyan-400 mb-1.5 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Chi Phí Tiền Xe Khách / Ship Chở Tới</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1000"
                      value={importForm.shippingFee}
                      onChange={e => setImportForm({ ...importForm, shippingFee: e.target.value })}
                      placeholder="150000"
                      className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl pl-3 pr-8 py-2 text-sm font-bold text-cyan-300 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">đ</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Hình Thức Trả Tiền Nhập
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setImportForm({ ...importForm, paymentMethod: 'Cash' })}
                      className={`py-2 rounded-xl text-xs font-bold transition ${
                        importForm.paymentMethod === 'Cash' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      💵 Tiền Mặt
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportForm({ ...importForm, paymentMethod: 'Bank' })}
                      className={`py-2 rounded-xl text-xs font-bold transition ${
                        importForm.paymentMethod === 'Bank' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      🏦 Chuyển Khoản
                    </button>
                  </div>
                </div>

                {importForm.paymentMethod === 'Bank' && (
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Trừ Tiền Từ Tài Khoản Ngân Hàng Nào:
                    </label>
                    <select
                      value={importForm.bankAccountId}
                      onChange={e => setImportForm({ ...importForm, bankAccountId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      {bankAccounts.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.bankName} - {b.accountNumber} ({b.accountHolder}) - Dư: {formatVND(b.balance || b.soDuHienTai)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Tổng kết tiền chuyến xe */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">Tổng Tiền Cả Chuyến Xe:</span>
                  <span className="text-xs text-slate-500">Gồm tiền heo + tiền xe khách</span>
                </div>
                <div className="text-2xl font-black text-amber-400">
                  {formatVND(totalTripCost)}
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ghi Chú Chuyến Xe</label>
                <input
                  type="text"
                  value={importForm.notes}
                  onChange={e => setImportForm({ ...importForm, notes: e.target.value })}
                  placeholder="VD: Xe khách chuyến 5h sáng, heo da đẹp..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition"
                >
                  Xác Nhận Nhập Chuyến Xe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
