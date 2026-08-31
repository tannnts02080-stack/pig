import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Calendar, Filter, 
  RefreshCw, FileText, ArrowUpRight, ArrowDownRight, Truck, Package, Percent
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { formatVND, formatDate } from '../utils/formatters';

export default function Reports() {
  const [filterType, setFilterType] = useState('month'); // 'day', 'month', 'year', 'all'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      let query = `filterType=${filterType}&loaiBoLoc=${filterType}`;
      if (filterType === 'day') query += `&date=${selectedDate}&ngay=${selectedDate}`;
      if (filterType === 'month') query += `&month=${selectedMonth}&thang=${selectedMonth}&year=${selectedYear}&nam=${selectedYear}`;
      if (filterType === 'year') query += `&year=${selectedYear}&nam=${selectedYear}`;

      const res = await fetch(`/api/reports/dashboard?${query}`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setDashboardData(data);
      } else {
        setDashboardData(null);
      }
    } catch (e) {
      console.error("Lỗi tải dashboard:", e);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filterType, selectedDate, selectedMonth, selectedYear]);

  // Chuẩn bị dữ liệu cho biểu đồ
  const orders = Array.isArray(dashboardData?.orders) 
    ? dashboardData.orders 
    : (Array.isArray(dashboardData?.danhSachDonHang) ? dashboardData.danhSachDonHang : []);

  const chartData = orders.map((o, idx) => ({
    name: String(o.orderCode || o.maDonHang || o.id || idx + 1).slice(-6),
    doanhThu: Number(o.totalSellingAmount || o.tongTienBan) || 0,
    tienVon: Number(o.totalCostAmount || o.tongTienVon) || 0,
    tienXe: Number(o.shippingFee || o.chiPhiTienXeGiao) || 0,
    loiNhuan: Number(o.totalProfit || o.tongTienLoi) || 0
  }));

  const totalRevenue = Number(dashboardData?.totalRevenue || dashboardData?.tongDoanhThu || 0);
  const totalCost = Number(dashboardData?.totalCost || dashboardData?.tongTienVon || 0);
  const totalShipping = Number(dashboardData?.totalShipping || dashboardData?.tongChiPhiTienXe || 0);
  const totalProfit = Number(dashboardData?.totalProfit || dashboardData?.tongTienLoi || 0);
  const totalOrders = dashboardData?.totalOrders || dashboardData?.tongSoDonHang || orders.length;

  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER & BỘ LỌC NGÀY / THÁNG / NĂM */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 ring-1 ring-white/20">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Dashboard Doanh Thu & Lợi Nhuận
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Báo cáo tài chính tổng hợp với bộ lọc Ngày / Tháng / Năm / Toàn thời gian
            </p>
          </div>
        </div>

        {/* CÁC NÚT CHỌN BỘ LỌC */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterType('day')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'day' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Theo Ngày
            </button>
            <button
              onClick={() => setFilterType('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'month' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Theo Tháng
            </button>
            <button
              onClick={() => setFilterType('year')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'year' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Theo Năm
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Toàn Thời Gian
            </button>
          </div>

          {/* Ô CHỌN THỜI GIAN THEO FILTER */}
          {filterType === 'day' && (
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-xl outline-none"
            />
          )}

          {filterType === 'month' && (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-xl outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-xl outline-none"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}

          {filterType === 'year' && (
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-xl outline-none"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>
          )}

          <button
            onClick={fetchDashboard}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition"
            title="Làm mới báo cáo"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 CARDS TỔNG KẾT BÁO CÁO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Doanh Thu */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-1">
          <div className="text-[11px] uppercase font-bold text-slate-400">Tổng Doanh Thu Bán</div>
          <div className="text-2xl lg:text-3xl font-black text-amber-400">
            {formatVND(totalRevenue)}
          </div>
          <div className="text-[11px] text-slate-500">
            Tổng cộng <span className="text-white font-bold">{totalOrders}</span> đơn hàng
          </div>
        </div>

        {/* Tiền Vốn */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-1">
          <div className="text-[11px] uppercase font-bold text-slate-400">Tổng Tiền Vốn Nhập NCC</div>
          <div className="text-2xl lg:text-3xl font-black text-slate-300">
            {formatVND(totalCost)}
          </div>
          <div className="text-[11px] text-slate-500">
            Chi phí nhập các lô heo
          </div>
        </div>

        {/* Tiền Xe */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-1">
          <div className="text-[11px] uppercase font-bold text-cyan-400">Tổng Chi Phí Tiền Xe (Ship)</div>
          <div className="text-2xl lg:text-3xl font-black text-cyan-300">
            {formatVND(totalShipping)}
          </div>
          <div className="text-[11px] text-slate-500">
            Chi phí vận chuyển & xe khách
          </div>
        </div>

        {/* Lợi Nhuận Ròng */}
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 p-6 rounded-3xl shadow-xl space-y-1">
          <div className="text-[11px] uppercase font-black text-emerald-400 flex items-center justify-between">
            <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> TỔNG LỢI NHUẬN RÒNG</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {profitMargin}% Margin
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-emerald-300">
            +{formatVND(totalProfit)}
          </div>
          <div className="text-[11px] text-slate-400">
            Doanh thu - Vốn NCC - Tiền xe
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ TRỰC QUAN */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Biểu Đồ Doanh Thu & Lợi Nhuận</h2>
            <p className="text-xs text-slate-400">So sánh Doanh thu, Tiền vốn và Lợi nhuận qua các đơn hàng</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Doanh thu
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-600 inline-block"></span> Tiền vốn
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Lợi nhuận
            </span>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs italic">
            Chưa có dữ liệu đơn hàng trong khoảng thời gian đã chọn.
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  formatter={(value) => [formatVND(value), '']}
                />
                <Bar dataKey="doanhThu" fill="#f59e0b" name="Doanh thu" radius={[6, 6, 0, 0]} />
                <Bar dataKey="tienVon" fill="#64748b" name="Tiền vốn" radius={[6, 6, 0, 0]} />
                <Bar dataKey="loiNhuan" fill="#10b981" name="Lợi nhuận" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
