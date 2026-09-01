import React, { useState, useEffect } from 'react';
import { 
  FileText, Clock, User, Phone, MapPin, DollarSign, TrendingUp, 
  Trash2, Search, RefreshCw, CheckCircle2, AlertCircle, Building2, Truck, Eye
} from 'lucide-react';
import { formatVND, formatDateTime, formatDate } from '../utils/formatters';
import { api } from '../utils/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []));
    } catch (e) {
      console.error("Lỗi tải đơn hàng:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${id}? Số lượng heo sẽ được hoàn lại vào kho.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      alert("Lỗi hủy đơn: " + e.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    const code = String(o.id || o.orderCode || o.maDonHang || '').toLowerCase();
    const name = String(o.customerName || o.tenKhachHang || '').toLowerCase();
    const phone = String(o.customerPhone || o.soDienThoaiKhach || '');
    return code.includes(search.toLowerCase()) || name.includes(search.toLowerCase()) || phone.includes(search);
  });

  const totalRevenue = orders.reduce((s, o) => s + (Number(o.totalSellingAmount || o.tongTienBan) || 0), 0);
  const totalCost = orders.reduce((s, o) => s + (Number(o.totalCostAmount || o.tongTienVon) || 0), 0);
  const totalShipping = orders.reduce((s, o) => s + (Number(o.shippingFee || o.chiPhiTienXeGiao) || 0), 0);
  const totalProfit = orders.reduce((s, o) => s + (Number(o.totalProfit || o.tongTienLoi) || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/30 ring-1 ring-white/20">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                Quản Lý Đơn Hàng & Tiền Lời
              </h1>
              <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {orders.length} ĐƠN
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Xem chi tiết thời gian đặt, khách hàng, tổng tiền bán, tiền vốn, tiền xe và lợi nhuận ròng từng đơn
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, tên khách, SĐT..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
            />
          </div>
          <button 
            onClick={fetchOrders}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/60 shadow-md transition"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 CARDS TỔNG QUAN TÀI CHÍNH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="text-[11px] uppercase font-bold text-slate-400">Tổng Doanh Thu Bán</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatVND(totalRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tổng cộng {orders.length} đơn hàng</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="text-[11px] uppercase font-bold text-slate-400">Tổng Tiền Vốn Nhập NCC</div>
          <div className="text-2xl font-black text-slate-300 mt-1">
            {formatVND(totalCost)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Giá vốn theo từng lô hàng</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div className="text-[11px] uppercase font-bold text-cyan-400">Tổng Chi Phí Tiền Xe (Ship)</div>
          <div className="text-2xl font-black text-cyan-300 mt-1">
            {formatVND(totalShipping)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tiền xe ship giao tới khách</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 p-5 rounded-3xl shadow-xl">
          <div className="text-[11px] uppercase font-black text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> TỔNG TIỀN LỜI RÒNG
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-1">
            +{formatVND(totalProfit)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Tiền bán - Vốn NCC - Tiền xe</div>
        </div>
      </div>

      {/* DANH SÁCH CHI TIẾT ĐƠN HÀNG */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Danh Sách Đơn Hàng Mua Bán ({filteredOrders.length})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-black border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Mã Đơn & Thời Gian</th>
                <th className="px-4 py-4">Khách Hàng</th>
                <th className="px-4 py-4">Chi Tiết Món Heo</th>
                <th className="px-4 py-4 text-right">Tiền Bán</th>
                <th className="px-4 py-4 text-right">Tiền Vốn</th>
                <th className="px-4 py-4 text-right">Tiền Xe</th>
                <th className="px-4 py-4 text-right">Tiền Lời</th>
                <th className="px-4 py-4 text-center">Thanh Toán</th>
                <th className="px-4 py-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center text-slate-500 italic">
                    Chưa có đơn hàng nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const orderCode = order.orderCode || order.maDonHang || order.id;
                  const customer = order.customerName || order.tenKhachHang || 'Khách vãng lai';
                  const phone = order.customerPhone || order.soDienThoaiKhach;
                  const address = order.customerAddress || order.diaChiGiaoHang;
                  const sell = Number(order.totalSellingAmount || order.tongTienBan || 0);
                  const cost = Number(order.totalCostAmount || order.tongTienVon || 0);
                  const ship = Number(order.shippingFee || order.chiPhiTienXeGiao || 0);
                  const profit = Number(order.totalProfit || order.tongTienLoi || 0);
                  const items = order.items || order.danhSachChiTiet || [];
                  const paymentMethod = order.paymentMethod || order.phuongThucThanhToan;
                  const bank = order.taiKhoanNganHangNhan || order.bankName;

                  return (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-white text-xs">{orderCode}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {formatDateTime(order.createdAt || order.ngayDatHang)}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-white text-xs">{customer}</div>
                        {phone && <div className="text-[11px] text-slate-400 font-mono">{phone}</div>}
                        {address && <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{address}</div>}
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {items.map((item, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-bold text-slate-200">{item.productName || item.sanPhamHeo?.tenSanPham || 'Heo Sữa'}</span>
                              <span className="text-amber-400 font-black ml-1.5">
                                x{item.quantity || item.soLuong} {item.unit || item.donViTinh || 'Con'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right font-black text-amber-400 text-sm">
                        {formatVND(sell)}
                      </td>

                      <td className="px-4 py-4 text-right font-mono text-xs text-slate-400">
                        {formatVND(cost)}
                      </td>

                      <td className="px-4 py-4 text-right font-mono text-xs text-cyan-400">
                        {ship > 0 ? formatVND(ship) : '0 đ'}
                      </td>

                      <td className="px-4 py-4 text-right font-black text-emerald-400 text-sm">
                        +{formatVND(profit)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {paymentMethod === 'Bank' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            <Building2 className="w-3 h-3" />
                            {typeof bank === 'object' ? bank?.tenNganHang : (bank || 'Chuyển khoản')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            <DollarSign className="w-3 h-3 text-amber-400" />
                            Tiền mặt
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition"
                          title="Hủy đơn & hoàn kho"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
