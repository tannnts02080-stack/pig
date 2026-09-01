import React, { useState, useEffect } from 'react';
import { 
  Flame, Snowflake, ShoppingCart, Truck, CreditCard, DollarSign, 
  Search, CheckCircle2, User, Phone, MapPin, Building2, AlertCircle,
  Tag, Package, Calendar, Sparkles, TrendingUp, RefreshCw, QrCode, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatVND, formatNumber, formatDate, formatVNDCompact } from '../utils/formatters';
import { generateVietQRUrl } from '../utils/vietqr';
import { useDeviceType } from '../hooks/useDeviceType';
import { apiFetch } from '../config/api';

export default function POS() {
  const { isMobile, isTablet } = useDeviceType();
  const [products, setProducts] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'hot', 'cold'
  const [filterSize, setFilterSize] = useState('ALL');

  // Modal mua hàng cho ô sản phẩm
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Form đặt hàng
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    customPrice: '', // Giá bán tùy chỉnh (nếu có bớt/tăng cho khách)
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    shippingFee: 0, // Chi phí tiền xe ship giao hàng
    otherExpenses: 0,
    paymentMethod: 'Cash', // 'Cash' hoặc 'Bank'
    bankAccountId: '',
    paidAmount: '',
    notes: ''
  });

  const [orderSuccess, setOrderSuccess] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, bankRes] = await Promise.all([
        apiFetch('/api/products').catch(() => null),
        apiFetch('/api/bank-accounts').catch(() => null)
      ]);
      
      if (prodRes && prodRes.ok) {
        const prods = await prodRes.json();
        setProducts(Array.isArray(prods) ? prods : (prods?.data && Array.isArray(prods.data) ? prods.data : []));
      } else {
        setProducts([]);
      }

      if (bankRes && bankRes.ok) {
        const banks = await bankRes.json();
        const safeBanks = Array.isArray(banks) ? banks : (banks?.data && Array.isArray(banks.data) ? banks.data : []);
        setBankAccounts(safeBanks);
      } else {
        setBankAccounts([]);
      }
    } catch (e) {
      console.error("Lỗi tải dữ liệu cửa hàng:", e);
      setProducts([]);
      setBankAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenOrderModal = (product) => {
    setSelectedProduct(product);
    const sellPrice = product.sellingPrice || product.giaBanRa || 0;
    setOrderForm({
      quantity: 1,
      customPrice: sellPrice,
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      shippingFee: 0,
      otherExpenses: 0,
      paymentMethod: 'Cash',
      bankAccountId: bankAccounts.length > 0 ? bankAccounts[0].id : '',
      paidAmount: sellPrice,
      notes: ''
    });
    setOrderModalOpen(true);
  };

  // Tính toán trực quan trong modal đặt hàng
  const currentSellingPrice = Number(orderForm.customPrice) || (selectedProduct ? (selectedProduct.sellingPrice || selectedProduct.giaBanRa || 0) : 0);
  const currentCostPrice = selectedProduct ? (Number(selectedProduct.costPrice || selectedProduct.giaNhapVon) || 0) : 0;
  const currentQty = Number(orderForm.quantity) || 1;
  const totalSelling = currentSellingPrice * currentQty;
  const totalCost = currentCostPrice * currentQty;
  const totalShipping = Number(orderForm.shippingFee) || 0;
  const totalOther = Number(orderForm.otherExpenses) || 0;

  // CÔNG THỨC LỢI NHUẬN: Tiền Lời = Tiền Bán - Tiền Nhập Theo Lô NCC - Chi Phí Tiền Xe
  const totalProfit = totalSelling - totalCost - totalShipping - totalOther;

  // Tìm tài khoản ngân hàng được chọn
  const selectedBank = bankAccounts.find(b => String(b.id) === String(orderForm.bankAccountId)) || bankAccounts[0];

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (currentQty <= 0) {
      alert("Số lượng con mua phải lớn hơn 0!");
      return;
    }

    const currentStock = selectedProduct.headCount !== undefined ? selectedProduct.headCount : (selectedProduct.soLuongCon || 0);
    if (currentQty > currentStock) {
      if (!window.confirm(`⚠️ Số lượng con trong kho chỉ còn ${currentStock} con. Bạn vẫn muốn tiếp tục bán?`)) {
        return;
      }
    }

    const payload = {
      customerName: orderForm.customerName || "Khách Mua Tại Cửa Hàng",
      tenKhachHang: orderForm.customerName || "Khách Mua Tại Cửa Hàng",
      customerPhone: orderForm.customerPhone || "",
      soDienThoai: orderForm.customerPhone || "",
      customerAddress: orderForm.customerAddress || "",
      diaChiGiaoHang: orderForm.customerAddress || "",
      items: [
        {
          productId: selectedProduct.id,
          sanPhamId: selectedProduct.id,
          productName: selectedProduct.name || selectedProduct.tenSanPham,
          porkType: selectedProduct.porkType || selectedProduct.loaiHeo,
          sizeType: selectedProduct.sizeType || selectedProduct.loaiSize,
          unit: 'Con',
          quantity: currentQty,
          soLuong: currentQty,
          costPrice: currentCostPrice,
          sellingPrice: selectedProduct.sellingPrice || selectedProduct.giaBanRa,
          customPrice: currentSellingPrice,
          giaBanTuyChinh: currentSellingPrice,
          itemProfit: (currentSellingPrice - currentCostPrice) * currentQty,
          total: totalSelling
        }
      ],
      shippingFee: totalShipping,
      chiPhiTienXe: totalShipping,
      otherExpenses: totalOther,
      chiPhiKhac: totalOther,
      paymentMethod: orderForm.paymentMethod,
      phuongThucThanhToan: orderForm.paymentMethod,
      bankAccountId: orderForm.paymentMethod === 'Bank' ? Number(orderForm.bankAccountId) : null,
      taiKhoanNganHangId: orderForm.paymentMethod === 'Bank' ? Number(orderForm.bankAccountId) : null,
      paidAmount: orderForm.paidAmount !== '' ? Number(orderForm.paidAmount) : totalSelling,
      soTienThanhToan: orderForm.paidAmount !== '' ? Number(orderForm.paidAmount) : totalSelling,
      notes: orderForm.notes || ""
    };

    try {
      const res = await apiFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const orderData = await res.json();
        setOrderSuccess(orderData);
        setOrderModalOpen(false);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert("Lỗi tạo đơn hàng: " + (err.message || 'Không thể xuất đơn'));
      }
    } catch (e) {
      alert("Lỗi kết nối máy chủ: " + e.message);
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

    return matchesSearch && matchesType && matchesSize;
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20 lg:pb-8">
      {/* HEADER BANNER - Mobile Optimized */}
      <div className="flex flex-col gap-3 sm:gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-10 sm:-mr-20 -mt-10 sm:-mt-20"></div>
        
        <div className="relative z-10 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/30 ring-1 ring-white/20 shrink-0">
              <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  {isMobile ? 'Cửa Hàng Bán Heo' : 'Cửa Hàng Ô Sản Phẩm Bán Heo'}
                </h1>
                <span className="text-[10px] sm:text-[11px] font-black uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  SẴN SÀNG BÁN
                </span>
              </div>
              {!isMobile && (
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Bán heo sữa tươi sống & heo cấp đông nguyên con, tính tiền lời ngay khi chốt đơn
                </p>
              )}
            </div>
          </div>

          <button
            onClick={fetchData}
            className="relative z-10 p-2.5 sm:p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-300 rounded-xl sm:rounded-2xl border border-slate-700/60 shadow-md transition-all active:scale-95 shrink-0"
            title="Làm mới sản phẩm"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
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
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex-1">
            <button
              onClick={() => setFilterType('ALL')}
              className={`flex-1 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                filterType === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 active:text-slate-200'
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setFilterType('hot')}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                filterType === 'hot' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 active:text-rose-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden xs:inline">Hàng </span>Nóng
            </button>
            <button
              onClick={() => setFilterType('cold')}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                filterType === 'cold' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 active:text-cyan-400'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">Hàng </span>Lạnh
            </button>
          </div>

          {allSizes.length > 0 && (
            <select
              value={filterSize}
              onChange={e => setFilterSize(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 sm:py-2 text-xs font-semibold text-slate-300 outline-none focus:border-amber-500 sm:min-w-[140px]"
            >
              <option value="ALL">Mọi Size Heo</option>
              {allSizes.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* PRODUCT CARDS GRID - Responsive */}
      {loading ? (
        <div className="py-12 sm:py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Đang tải danh sách ô heo...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-12 sm:py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl sm:text-3xl">
            🐖
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-1">Không tìm thấy ô heo phù hợp</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-4">
            Vui lòng thử tìm kiếm với từ khóa khác hoặc chuyển sang tab Quản Lý Sản Phẩm để tạo thêm ô heo mới.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map(product => {
            const isHot = (product.porkType || product.loaiHeo) === 'hot';
            const costPrice = Number(product.costPrice || product.giaNhapVon || 0);
            const sellPrice = Number(product.sellingPrice || product.giaBanRa || 0);
            const supplierName = product.supplier?.tenNhaCungCap || product.nhaCungCap?.tenNhaCungCap || 'Trang Trại Ba Vì';
            const stockHeads = product.headCount !== undefined ? product.headCount : (product.soLuongCon || 0);
            const isOutOfStock = stockHeads <= 0;

            return (
              <div
                key={product.id}
                className="group relative bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 active:border-amber-500/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Section - Mobile Optimized */}
                <div className="relative h-36 sm:h-48 w-full bg-slate-950 overflow-hidden">
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
                      <span className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-rose-500/90 text-white text-[10px] sm:text-[11px] font-black uppercase shadow-lg backdrop-blur-md">
                        <Flame className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                        {isMobile ? 'Nóng' : 'Hàng Nóng'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-cyan-500/90 text-white text-[10px] sm:text-[11px] font-black uppercase shadow-lg backdrop-blur-md">
                        <Snowflake className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                        {isMobile ? 'Lạnh' : 'Hàng Lạnh'}
                      </span>
                    )}

                    <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-950/80 text-amber-300 text-[10px] sm:text-[11px] font-black border border-amber-400/30 backdrop-blur-md">
                      {product.sizeType || product.loaiSize || 'Heo chuẩn'}
                    </span>
                  </div>

                  {/* Stock count - Mobile Optimized */}
                  <div className="absolute bottom-2 sm:bottom-2.5 right-2 sm:right-3">
                    <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black shadow-md border ${
                      !isOutOfStock 
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' 
                        : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                    }`}>
                      {isMobile ? `${stockHeads}` : `Còn: ${stockHeads} con`}
                    </span>
                  </div>
                </div>

                {/* Body Details - Mobile Optimized */}
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-black text-white text-sm sm:text-base leading-snug group-hover:text-amber-400 transition-colors line-clamp-1">
                      {product.name || product.tenSanPham}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 sm:gap-1.5 line-clamp-1">
                      <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-500 shrink-0" />
                      <span className="font-medium text-slate-300 truncate">{isMobile ? supplierName.substring(0, 15) + '...' : supplierName}</span>
                    </p>
                    {product.importDetails && !isMobile && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-1">
                        "{product.importDetails}"
                      </p>
                    )}
                  </div>

                  {/* Giá Bán - Mobile Optimized */}
                  <div className="bg-slate-950/90 border border-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl space-y-1.5 sm:space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Giá Bán:
                      </span>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                          {isMobile ? formatVNDCompact(sellPrice) : formatVND(sellPrice)}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 block">/ 1 con</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 sm:pt-1.5 border-t border-slate-800/80">
                      <span className="text-[9px] sm:text-[10px] font-medium text-slate-500">Giá nhập vốn:</span>
                      <span className="text-xs font-semibold text-slate-400">
                        {isMobile ? formatVNDCompact(costPrice) : formatVND(costPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Nút Mua Hàng - Touch Optimized */}
                  <button
                    onClick={() => handleOpenOrderModal(product)}
                    className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 active:from-amber-400 active:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40 transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-white/20"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isMobile ? 'Mua Ngay' : 'Mua Hàng Ô Này'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL MUA HÀNG CHO Ô SẢN PHẨM - Mobile Optimized */}
      {orderModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`bg-slate-900 border border-slate-800 w-full shadow-2xl space-y-4 sm:space-y-5 overflow-y-auto ${
            isMobile 
              ? 'rounded-t-3xl max-h-[92vh] p-4 pb-6' 
              : 'rounded-3xl max-w-xl p-6 max-h-[90vh]'
          }`}>
            {/* Header - Mobile Optimized */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 sm:pb-4 sticky top-0 bg-slate-900 z-10">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shrink-0">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-white line-clamp-1">
                    {isMobile ? 'Tạo Đơn Bán' : `Tạo Đơn Bán: ${selectedProduct.name || selectedProduct.tenSanPham}`}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {selectedProduct.sizeType || selectedProduct.loaiSize} • NCC: {selectedProduct.supplier?.tenNhaCungCap || 'NCC A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white active:text-white rounded-xl hover:bg-slate-800 active:bg-slate-800 transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3 sm:space-y-4">
              {/* Chọn số lượng & Giá bán - Mobile Optimized */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 bg-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-300 mb-1">
                    Số Lượng (Con) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={orderForm.quantity}
                    onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 text-base font-black text-amber-400 outline-none focus:border-amber-500"
                  />
                  <span className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 block">
                    Kho: {selectedProduct.headCount !== undefined ? selectedProduct.headCount : (selectedProduct.soLuongCon || 0)} con
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-300 mb-1">
                    Giá Bán / Con
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={orderForm.customPrice}
                    onChange={e => setOrderForm({ ...orderForm, customPrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2 sm:py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-amber-500"
                  />
                  <span className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 block truncate">
                    Gốc: {isMobile ? formatVNDCompact(selectedProduct.sellingPrice || selectedProduct.giaBanRa) : formatVND(selectedProduct.sellingPrice || selectedProduct.giaBanRa)}
                  </span>
                </div>
              </div>

              {/* Thông tin khách hàng - Mobile Optimized */}
              <div className="space-y-2 sm:space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-300 mb-1">Tên Khách Hàng</label>
                    <input
                      type="text"
                      value={orderForm.customerName}
                      onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })}
                      placeholder={isMobile ? "VD: Anh Tuấn" : "VD: Anh Tuấn / Khách Quán A"}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-300 mb-1">Số Điện Thoại</label>
                    <input
                      type="tel"
                      value={orderForm.customerPhone}
                      onChange={e => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                      placeholder="09..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-300 mb-1">Địa Chỉ Giao Hàng</label>
                  <input
                    type="text"
                    value={orderForm.customerAddress}
                    onChange={e => setOrderForm({ ...orderForm, customerAddress: e.target.value })}
                    placeholder={isMobile ? "Địa chỉ..." : "Địa chỉ giao xe hoặc tận nơi..."}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Chi phí & Thanh toán - Mobile Optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-cyan-400 mb-1 sm:mb-1.5 flex items-center gap-1">
                    <Truck className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    <span>Chi Phí Xe Ship</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1000"
                      value={orderForm.shippingFee}
                      onChange={e => setOrderForm({ ...orderForm, shippingFee: e.target.value })}
                      placeholder="0"
                      className="w-full bg-slate-900 border border-cyan-500/40 rounded-lg sm:rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-cyan-300 outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">đ</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-300 mb-1 sm:mb-1.5">
                    Thanh Toán
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderForm({ ...orderForm, paymentMethod: 'Cash' })}
                      className={`py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition active:scale-95 ${
                        orderForm.paymentMethod === 'Cash' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      💵 Tiền Mặt
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderForm({ ...orderForm, paymentMethod: 'Bank' })}
                      className={`py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition active:scale-95 ${
                        orderForm.paymentMethod === 'Bank' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      🏦 CK
                    </button>
                  </div>
                </div>

                {/* Chọn tài khoản ngân hàng - Mobile Optimized */}
                {orderForm.paymentMethod === 'Bank' && (
                  <div className="col-span-1 sm:col-span-2 space-y-2 sm:space-y-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-300 mb-1">
                        Chuyển Khoản Vào TK:
                      </label>
                      <select
                        value={orderForm.bankAccountId}
                        onChange={e => setOrderForm({ ...orderForm, bankAccountId: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg sm:rounded-xl px-3 py-2 text-xs text-white outline-none"
                      >
                        {bankAccounts.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.bankName} - {b.accountNumber} ({b.accountHolder})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* QR CODE VietQR - Mobile Optimized */}
                    {selectedBank && (
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-slate-900 p-3 sm:p-3.5 rounded-xl border border-slate-800">
                        <img
                          src={generateVietQRUrl({
                            bankId: selectedBank.bankCode || selectedBank.bankName,
                            accountNo: selectedBank.accountNumber,
                            template: 'compact',
                            amount: totalSelling,
                            description: `HEO ${orderForm.customerName || 'KHACH'}`
                          })}
                          alt="VietQR"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white p-1 shrink-0"
                        />
                        <div className="text-xs space-y-1 text-center sm:text-left flex-1">
                          <div className="font-bold text-white text-xs sm:text-sm">{selectedBank.bankName}</div>
                          <div className="text-slate-400 text-[10px] sm:text-xs">
                            STK: <span className="text-slate-200 font-semibold">{selectedBank.accountNumber}</span>
                          </div>
                          <div className="text-slate-400 text-[10px] sm:text-xs">
                            CTK: <span className="text-slate-200 uppercase font-semibold">{selectedBank.accountHolder}</span>
                          </div>
                          <div className="text-amber-400 font-bold text-xs sm:text-sm">{isMobile ? formatVNDCompact(totalSelling) : formatVND(totalSelling)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BẢNG TÍNH LỢI NHUẬN - Mobile Optimized */}
              <div className="bg-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
                  <span>Tổng tiền bán ({currentQty} con):</span>
                  <span className="font-bold text-white">{isMobile ? formatVNDCompact(totalSelling) : formatVND(totalSelling)}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
                  <span>Tiền vốn nhập NCC:</span>
                  <span>- {isMobile ? formatVNDCompact(totalCost) : formatVND(totalCost)}</span>
                </div>
                {totalShipping > 0 && (
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-cyan-400">
                    <span>Tiền xe ship:</span>
                    <span>- {isMobile ? formatVNDCompact(totalShipping) : formatVND(totalShipping)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-400">Lợi Nhuận:</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-400">
                    +{isMobile ? formatVNDCompact(totalProfit) : formatVND(totalProfit)}
                  </span>
                </div>
              </div>

              {/* Modal Buttons - Mobile Optimized */}
              <div className="flex items-center justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-300 text-xs font-bold transition active:scale-95"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 active:from-amber-400 active:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition active:scale-95"
                >
                  {isMobile ? 'Xuất Đơn' : 'Xác Nhận & Xuất Đơn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
                  </div>
                )}
              </div>

              {/* BẢNG TÍNH LỢI NHUẬN TRỰC QUAN */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Tổng tiền bán ({currentQty} con):</span>
                  <span className="font-bold text-white">{formatVND(totalSelling)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Tiền vốn nhập NCC:</span>
                  <span>- {formatVND(totalCost)}</span>
                </div>
                {totalShipping > 0 && (
                  <div className="flex items-center justify-between text-xs text-cyan-400">
                    <span>Tiền xe ship:</span>
                    <span>- {formatVND(totalShipping)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs font-black uppercase text-emerald-400">Tiền Lời Đơn Này (Lợi Nhuận):</span>
                  <span className="text-xl font-black text-emerald-400">+{formatVND(totalProfit)}</span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition"
                >
                  Xác Nhận & Xuất Đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP THÀNH CÔNG - Mobile Optimized */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 text-center space-y-3 sm:space-y-4 shadow-2xl">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl sm:text-3xl">
              ✓
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">Đã Tạo Đơn Hàng Thành Công!</h3>
            <p className="text-[10px] sm:text-xs text-slate-400">
              Mã đơn: <span className="font-mono text-amber-400 font-bold">{orderSuccess.orderCode || orderSuccess.maDonHang || orderSuccess.id}</span>
            </p>
            <div className="bg-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 text-left space-y-1.5 sm:space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Khách hàng:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{orderSuccess.customerName || orderSuccess.tenKhachHang}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tổng tiền bán:</span>
                <span className="font-bold text-amber-400">
                  {isMobile 
                    ? formatVNDCompact(orderSuccess.totalSellingAmount || orderSuccess.tongTienBan) 
                    : formatVND(orderSuccess.totalSellingAmount || orderSuccess.tongTienBan)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tiền lời ròng:</span>
                <span className="font-bold text-emerald-400">
                  +{isMobile 
                    ? formatVNDCompact(orderSuccess.totalProfit || orderSuccess.tongTienLoi) 
                    : formatVND(orderSuccess.totalProfit || orderSuccess.tongTienLoi)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-white font-bold text-xs rounded-xl transition active:scale-95"
            >
              {isMobile ? 'Đóng' : 'Đóng & Tiếp Tục Bán Hàng'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
