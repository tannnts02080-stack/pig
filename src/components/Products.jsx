import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Search, RefreshCw, Flame, Snowflake, 
  DollarSign, Building2, Tag, Layers, CheckCircle2, AlertCircle, 
  Image, Sparkles, Filter, SlidersHorizontal, Package, X
} from 'lucide-react';
import { formatVND, formatNumber, formatVNDCompact } from '../utils/formatters';
import { useDeviceType } from '../hooks/useDeviceType';
import { apiFetch } from '../config/api';

// Danh sách ảnh mẫu heo sữa sống / đông lạnh nguyên con chất lượng cao
const SAMPLE_IMAGES = [
  { label: 'Heo sữa tươi sạch (Trắng hồng)', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' },
  { label: 'Heo sữa cấp đông nguyên con', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80' },
  { label: 'Heo sữa tuyển chọn', url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80' }
];

export default function Products() {
  const { isMobile } = useDeviceType();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'hot', 'cold'
  const [filterSize, setFilterSize] = useState('ALL');
  const [filterSupplier, setFilterSupplier] = useState('ALL');

  // Modal Thêm / Sửa sản phẩm
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    porkType: 'hot', // 'hot' = Hàng Nóng (Tươi), 'cold' = Hàng Lạnh (Cấp Đông)
    sizeType: 'Heo 5Kg',
    unit: 'Con',
    costPrice: 800000,
    sellingPrice: 1200000,
    supplierId: '',
    importDate: new Date().toISOString().slice(0, 10),
    importDetails: 'Heo sữa nguyên con tuyển chọn, thịt mềm da đẹp',
    notes: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, supRes] = await Promise.all([
        apiFetch('/api/products').catch(() => null),
        apiFetch('/api/suppliers').catch(() => null)
      ]);

      const prods = prodRes && prodRes.ok ? await prodRes.json() : [];
      const sups = supRes && supRes.ok ? await supRes.json() : [];

      const safeProds = Array.isArray(prods) ? prods : (prods?.data && Array.isArray(prods.data) ? prods.data : []);
      const safeSups = Array.isArray(sups) ? sups : (sups?.data && Array.isArray(sups.data) ? sups.data : []);

      setProducts(safeProds);
      setSuppliers(safeSups);

      if (safeSups.length > 0 && !form.supplierId) {
        setForm(prev => ({ ...prev, supplierId: safeSups[0].id }));
      }
    } catch (e) {
      console.error("Lỗi tải danh mục sản phẩm:", e);
      setProducts([]);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      porkType: 'hot',
      sizeType: 'Heo 5Kg',
      unit: 'Con',
      costPrice: 800000,
      sellingPrice: 1200000,
      supplierId: suppliers.length > 0 ? suppliers[0].id : '',
      importDate: new Date().toISOString().slice(0, 10),
      importDetails: 'Lô heo sữa tươi nguyên con sáng sớm',
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name || p.tenSanPham || '',
      image: p.image || p.imageUrl || p.hinhAnh || '',
      porkType: p.porkType || p.loaiHeo || 'hot',
      sizeType: p.sizeType || p.loaiSize || 'Heo 5Kg',
      unit: 'Con',
      costPrice: p.costPrice || p.giaNhapVon || 0,
      sellingPrice: p.sellingPrice || p.giaBanRa || 0,
      supplierId: p.supplier?.id || p.nhaCungCap?.id || (suppliers[0]?.id || ''),
      importDate: p.importDate || p.ngayNhap || new Date().toISOString().slice(0, 10),
      importDetails: p.importDetails || p.chiTietNhap || '',
      notes: p.notes || p.ghiChu || ''
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên ô sản phẩm heo!");
      return;
    }

    const payload = {
      name: form.name,
      tenSanPham: form.name,
      productCode: editingProduct ? (editingProduct.productCode || editingProduct.maSanPham) : `HEO-${Date.now().toString().slice(-4)}`,
      maSanPham: editingProduct ? (editingProduct.productCode || editingProduct.maSanPham) : `HEO-${Date.now().toString().slice(-4)}`,
      image: form.image,
      imageUrl: form.image,
      hinhAnh: form.image,
      porkType: form.porkType,
      loaiHeo: form.porkType,
      sizeType: form.sizeType,
      loaiSize: form.sizeType,
      unit: 'Con',
      donViTinh: 'Con',
      costPrice: Number(form.costPrice) || 0,
      giaNhapVon: Number(form.costPrice) || 0,
      sellingPrice: Number(form.sellingPrice) || 0,
      giaBanRa: Number(form.sellingPrice) || 0,
      supplierId: form.supplierId ? Number(form.supplierId) : null,
      importDate: form.importDate,
      ngayNhap: form.importDate,
      importDetails: form.importDetails,
      chiTietNhap: form.importDetails,
      notes: form.notes,
      ghiChu: form.notes
    };

    try {
      if (editingProduct) {
        const res = await apiFetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setShowModal(false);
          fetchData();
        } else {
          const err = await res.json().catch(() => ({}));
          alert("Lỗi cập nhật sản phẩm: " + (err.message || 'Không thể lưu'));
        }
      } else {
        const res = await apiFetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setShowModal(false);
          fetchData();
        } else {
          const err = await res.json().catch(() => ({}));
          alert("Lỗi thêm mới sản phẩm: " + (err.message || 'Không thể lưu'));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ backend: " + err.message);
    }
  };

  const handleDeleteProduct = async (p) => {
    const id = p.id;
    const name = p.name || p.tenSanPham;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ô sản phẩm "${name}" khỏi danh mục bán hàng?`)) {
      return;
    }
    try {
      const res = await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert("Không thể xóa sản phẩm này (có thể đã có đơn hàng hoặc phiếu nhập liên kết)");
      }
    } catch (e) {
      alert("Lỗi xóa: " + e.message);
    }
  };

  // Danh sách size có trong dữ liệu
  const allSizes = Array.from(new Set(products.map(p => p.sizeType || p.loaiSize).filter(Boolean)));

  // Lọc sản phẩm
  const filteredProducts = products.filter(p => {
    const name = (p.name || p.tenSanPham || '').toLowerCase();
    const size = (p.sizeType || p.loaiSize || '').toLowerCase();
    const supName = (p.supplier?.tenNhaCungCap || p.nhaCungCap?.tenNhaCungCap || '').toLowerCase();
    const type = p.porkType || p.loaiHeo;

    const matchesSearch = name.includes(search.toLowerCase()) || size.includes(search.toLowerCase()) || supName.includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || type === filterType;
    const matchesSize = filterSize === 'ALL' || (p.sizeType || p.loaiSize) === filterSize;
    const matchesSup = filterSupplier === 'ALL' || String(p.supplier?.id || p.nhaCungCap?.id) === String(filterSupplier);

    return matchesSearch && matchesType && matchesSize && matchesSup;
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20 lg:pb-8">
      {/* HEADER BAR - Mobile Optimized */}
      <div className="flex flex-col gap-3 sm:gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -mr-10 sm:-mr-20 -mt-10 sm:-mt-20"></div>
        <div className="relative z-10 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/30 ring-1 ring-white/20 shrink-0">
              <Tag className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  {isMobile ? 'Quản Lý Sản Phẩm' : 'Quản Lý Sản Phẩm & Phân Loại'}
                </h1>
                <span className="text-[10px] sm:text-[11px] font-black uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap">
                  {products.length} Ô HEO
                </span>
              </div>
              {!isMobile && (
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Thiết lập danh mục ô bán hàng, phân loại Hàng Nóng / Hàng Lạnh, Size heo, Giá bán (Số to) & Giá vốn (Số nhỏ)
                </p>
              )}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={fetchData}
              className="p-2.5 sm:p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-300 rounded-xl sm:rounded-2xl border border-slate-700/60 shadow-md transition-all active:scale-95"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 active:from-rose-500 active:to-amber-500 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-rose-600/30 transition-all transform active:scale-95 border border-rose-400/30"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{isMobile ? 'Thêm' : 'Thêm Ô Heo Mới'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR - Mobile Optimized */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-md space-y-3">
        {/* Search */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isMobile ? "Tìm tên, size..." : "Tìm theo tên heo, size, nhà cung cấp..."}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
          />
        </div>

        {/* Filter Buttons - Mobile Stacked */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {/* Filter by Pork Type */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex-1">
            <button
              onClick={() => setFilterType('ALL')}
              className={`flex-1 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                filterType === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 active:text-slate-200'
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setFilterType('hot')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                filterType === 'hot' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 active:text-rose-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden xs:inline">Hàng </span>Nóng
            </button>
            <button
              onClick={() => setFilterType('cold')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                filterType === 'cold' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 active:text-cyan-400'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">Hàng </span>Lạnh
            </button>
          </div>

          {/* Filter dropdowns */}
          <div className="flex gap-2">
            {/* Filter by Size */}
            {allSizes.length > 0 && (
              <select
                value={filterSize}
                onChange={e => setFilterSize(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-300 outline-none focus:border-rose-500"
              >
                <option value="ALL">Mọi Size</option>
                {allSizes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}

            {/* Filter by Supplier */}
            {suppliers.length > 0 && !isMobile && (
              <select
                value={filterSupplier}
                onChange={e => setFilterSupplier(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-rose-500"
              >
                <option value="ALL">Mọi NCC</option>
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.tenNhaCungCap || sup.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT GRID LIST - Mobile Optimized */}
      {loading ? (
        <div className="py-12 sm:py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Đang tải danh mục ô heo...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-12 sm:py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl sm:text-3xl">
            🐖
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-1">Chưa có ô heo nào phù hợp</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-4">
            Hãy thêm mới ô heo đầu tiên hoặc thay đổi bộ lọc tìm kiếm ở thanh công cụ phía trên.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-500 text-white text-xs font-bold rounded-xl active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            Thêm Ô Heo Ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map(product => {
            const isHot = (product.porkType || product.loaiHeo) === 'hot';
            const costPrice = Number(product.costPrice || product.giaNhapVon || 0);
            const sellPrice = Number(product.sellingPrice || product.giaBanRa || 0);
            const profitPerUnit = sellPrice - costPrice;
            const supplierName = product.supplier?.tenNhaCungCap || product.nhaCungCap?.tenNhaCungCap || 'Chưa gán NCC';
            const stockHeads = product.headCount !== undefined ? product.headCount : (product.soLuongCon || 0);

            return (
              <div
                key={product.id}
                className="group relative bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 active:border-rose-500/60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-rose-950/20 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badges - Mobile Optimized */}
                <div className="relative h-36 sm:h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={product.image || product.imageUrl || product.hinhAnh || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'}
                    alt={product.name || product.tenSanPham}
                    className="w-full h-full object-cover group-hover:scale-105 group-active:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40"></div>

                  {/* Badges - Mobile Optimized */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1 sm:gap-1.5">
                    {isHot ? (
                      <span className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-rose-500/90 text-white text-[10px] sm:text-[11px] font-black uppercase shadow-lg backdrop-blur-md">
                        <Flame className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                        {isMobile ? 'Nóng' : 'Hàng Nóng'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-cyan-500/90 text-white text-[10px] sm:text-[11px] font-black uppercase shadow-lg backdrop-blur-md">
                        <Snowflake className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                        {isMobile ? 'Lạnh' : 'Hàng Lạnh'}
                      </span>
                    )}

                    <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-950/80 text-amber-300 text-[10px] sm:text-[11px] font-black border border-amber-400/30 backdrop-blur-md">
                      {product.sizeType || product.loaiSize || 'Heo chuẩn'}
                    </span>
                  </div>

                  {/* Actions (Edit / Delete) - Mobile Optimized */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 sm:gap-1.5 opacity-90 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-900/80 hover:bg-amber-600 active:bg-amber-600 text-slate-300 hover:text-white active:text-white border border-slate-700/60 shadow-lg backdrop-blur-md transition-all active:scale-90"
                      title="Chỉnh sửa ô heo"
                    >
                      <Edit2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-900/80 hover:bg-rose-600 active:bg-rose-600 text-slate-300 hover:text-white active:text-white border border-slate-700/60 shadow-lg backdrop-blur-md transition-all active:scale-90"
                      title="Xóa ô heo"
                    >
                      <Trash2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    </button>
                  </div>

                  {/* Stock Count - Mobile Optimized */}
                  <div className="absolute bottom-2 sm:bottom-2.5 right-2 sm:right-3">
                    <span className={`px-2 sm:px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-black shadow-md border ${
                      stockHeads > 0 
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' 
                        : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                    }`}>
                      {isMobile ? `${stockHeads}` : `Kho: ${stockHeads} con`}
                    </span>
                  </div>
                </div>

                {/* Content Details - Mobile Optimized */}
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="font-black text-white text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {product.name || product.tenSanPham}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-1 flex items-center gap-1 sm:gap-1.5 line-clamp-1">
                      <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{isMobile ? supplierName.substring(0, 12) + (supplierName.length > 12 ? '...' : '') : supplierName}</span>
                    </p>
                    {product.importDetails && !isMobile && (
                      <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">
                        "{product.importDetails}"
                      </p>
                    )}
                  </div>

                  {/* Price Box - Mobile Optimized */}
                  <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Giá Bán:</span>
                      <span className="text-lg sm:text-xl font-black text-amber-400 tracking-tight">
                        {isMobile ? formatVNDCompact(sellPrice) : formatVND(sellPrice)}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-500">Giá Nhập:</span>
                      <span className="text-xs font-semibold text-slate-400">
                        {isMobile ? formatVNDCompact(costPrice) : formatVND(costPrice)}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-[9px] sm:text-[10px] text-emerald-400 font-bold">
                      <span>Lợi nhuận/con:</span>
                      <span>+{isMobile ? formatVNDCompact(profitPerUnit) : formatVND(profitPerUnit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL THÊM / SỬA Ô SẢN PHẨM - Mobile Optimized */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`bg-slate-900 border border-slate-800 w-full shadow-2xl space-y-4 sm:space-y-5 overflow-y-auto ${
            isMobile 
              ? 'rounded-t-3xl max-h-[92vh] p-4 pb-6' 
              : 'rounded-3xl max-w-xl p-6 max-h-[90vh]'
          }`}>
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4 sticky top-0 bg-slate-900 z-10">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shrink-0">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-white line-clamp-1">
                    {editingProduct ? (isMobile ? 'Chỉnh Sửa Ô Heo' : 'Chỉnh Sửa Ô Heo Bán Hàng') : (isMobile ? 'Thêm Ô Heo Mới' : 'Thêm Ô Heo Mới Vào Cửa Hàng')}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                    {isMobile ? 'Thiết lập giá & phân loại' : 'Thiết lập giá bán số to, giá vốn số nhỏ và phân loại heo'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-white active:text-white rounded-xl hover:bg-slate-800 active:bg-slate-800 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Tên Ô Heo */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Tên Ô Heo Bán Hàng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Heo Sữa Cấp Đông Size 4Kg, Heo Sữa Tươi Nóng 5Kg..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-rose-500"
                />
              </div>

              {/* Phân loại & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Phân Loại Hàng
                  </label>
                  <select
                    value={form.porkType}
                    onChange={e => setForm({ ...form, porkType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-rose-500"
                  >
                    <option value="hot">🔥 Hàng Nóng (Tươi Sống)</option>
                    <option value="cold">❄️ Hàng Lạnh (Cấp Đông)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Size Heo (Con)
                  </label>
                  <select
                    value={form.sizeType}
                    onChange={e => setForm({ ...form, sizeType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-rose-500"
                  >
                    <option value="Heo 3Kg">Heo 3Kg</option>
                    <option value="Heo 4Kg">Heo 4Kg</option>
                    <option value="Heo 5Kg">Heo 5Kg</option>
                    <option value="Heo 6Kg">Heo 6Kg</option>
                    <option value="Heo 7Kg">Heo 7Kg</option>
                    <option value="Heo 8Kg">Heo 8Kg</option>
                    <option value="Heo 9-10Kg">Heo 9 - 10Kg</option>
                  </select>
                </div>
              </div>

              {/* Giá Bán (Số To) & Giá Nhập Vốn (Số Nhỏ) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-rose-400 mb-1.5 flex items-center gap-1">
                    <span>Giá Bán Ra (Số To)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={form.sellingPrice}
                      onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
                      placeholder="1200000"
                      className="w-full bg-slate-900 border border-rose-500/40 rounded-xl pl-4 pr-12 py-2.5 text-base font-black text-amber-400 outline-none focus:border-rose-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      đ/con
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Format: {formatVND(form.sellingPrice)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                    <span>Giá Nhập Vốn (Số Nhỏ)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={form.costPrice}
                      onChange={e => setForm({ ...form, costPrice: e.target.value })}
                      placeholder="800000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-rose-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      đ/con
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Format: {formatVND(form.costPrice)}
                  </p>
                </div>
              </div>

              {/* Nhà Cung Cấp */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nhà Cung Cấp / Trang Trại Nhập
                </label>
                <select
                  value={form.supplierId}
                  onChange={e => setForm({ ...form, supplierId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-rose-500"
                >
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>
                      {sup.tenNhaCungCap || sup.name} - {sup.soDienThoai || sup.phone || 'SĐT: N/A'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chi tiết nhập / Ghi chú */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Chi Tiết Nhập / Đặc Điểm Lô Hàng
                </label>
                <textarea
                  rows="2"
                  value={form.importDetails}
                  onChange={e => setForm({ ...form, importDetails: e.target.value })}
                  placeholder="VD: Heo sữa Ba Vì da trắng sạch, đóng thùng xốp hút chân không..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none focus:border-rose-500"
                ></textarea>
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Hình Ảnh Heo Đại Diện
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-rose-500 mb-2"
                />
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SAMPLE_IMAGES.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setForm({ ...form, image: img.url })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition ${
                        form.image === img.url ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition"
                >
                  {editingProduct ? 'Cập Nhật Ô Heo' : 'Lưu Ô Heo Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
