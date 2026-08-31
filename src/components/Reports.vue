<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
    <!-- HEADER & BỘ LỌC NGÀY / THÁNG / NĂM -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 ring-1 ring-white/20">
          <BarChart3 class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Dashboard Doanh Thu & Lợi Nhuận
          </h1>
          <p class="text-slate-400 text-sm mt-1">
            Báo cáo tài chính tổng hợp với bộ lọc Ngày / Tháng / Năm / Toàn thời gian
          </p>
        </div>
      </div>

      <div class="relative z-10 flex items-center gap-3">
        <button
          @click="fetchDashboard"
          class="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700/60 shadow-md transition active:scale-95 cursor-pointer"
          title="Làm mới báo cáo"
        >
          <RefreshCw :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
        </button>
      </div>
    </div>

    <!-- CÁC NÚT CHỌN BỘ LỌC THỜI GIAN CÂN ĐỐI -->
    <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
      <div class="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
        <button
          @click="filterType = 'day'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
            filterType === 'day' ? 'bg-emerald-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
          ]"
        >
          Theo Ngày
        </button>
        <button
          @click="filterType = 'month'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
            filterType === 'month' ? 'bg-emerald-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
          ]"
        >
          Theo Tháng
        </button>
        <button
          @click="filterType = 'year'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
            filterType === 'year' ? 'bg-emerald-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
          ]"
        >
          Theo Năm
        </button>
        <button
          @click="filterType = 'all'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
            filterType === 'all' ? 'bg-emerald-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
          ]"
        >
          Toàn Thời Gian
        </button>
      </div>

      <!-- Ô chọn thời gian & Thao tác -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Chế độ Theo Ngày: 3 ô chọn Ngày, Tháng, Năm nhanh -->
        <div v-if="filterType === 'day'" class="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400">Chọn ngày:</span>
          <select
            v-model="selectedDay"
            class="bg-slate-950 border border-slate-700 text-emerald-400 text-xs px-2 py-1 rounded-lg outline-none cursor-pointer font-bold"
          >
            <option v-for="d in daysInMonth" :key="d" :value="d">Ngày {{ d }}</option>
          </select>
          <select
            v-model="selectedMonth"
            class="bg-slate-950 border border-slate-700 text-white text-xs px-2 py-1 rounded-lg outline-none cursor-pointer font-bold"
          >
            <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
          </select>
          <select
            v-model="selectedYear"
            class="bg-slate-950 border border-slate-700 text-white text-xs px-2.5 py-1 rounded-lg outline-none cursor-pointer font-bold"
          >
            <option v-for="y in [2024, 2025, 2026, 2027]" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- Chế độ Theo Tháng: 2 ô chọn Tháng, Năm -->
        <div v-if="filterType === 'month'" class="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400">Chọn tháng:</span>
          <select
            v-model="selectedMonth"
            class="bg-slate-950 border border-slate-700 text-emerald-400 text-xs px-2 py-1 rounded-lg outline-none cursor-pointer font-bold"
          >
            <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
          </select>
          <select
            v-model="selectedYear"
            class="bg-slate-950 border border-slate-700 text-white text-xs px-2.5 py-1 rounded-lg outline-none cursor-pointer font-bold"
          >
            <option v-for="y in [2024, 2025, 2026, 2027]" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- Chế độ Theo Năm: 1 ô chọn Năm -->
        <div v-if="filterType === 'year'" class="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span class="text-xs text-slate-400">Chọn năm:</span>
          <select
            v-model="selectedYear"
            class="bg-slate-950 border border-slate-700 text-emerald-400 text-xs px-3 py-1 rounded-lg outline-none cursor-pointer font-bold"
          >
            <option v-for="y in [2024, 2025, 2026, 2027]" :key="y" :value="y">Năm {{ y }}</option>
          </select>
        </div>

        <!-- Nút Đặt Lại Bộ Lọc -->
        <button
          @click="handleResetFilters"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-rose-200 border border-rose-500/30 flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 ml-1"
          title="Đặt lại bộ lọc về mặc định"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Đặt Lại</span>
        </button>

        <!-- Tìm kiếm nhanh theo mã đơn & tên khách -->
        <div class="relative w-44 sm:w-56 ml-1">
          <Search class="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm mã đơn, tên khách..." 
            class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>
    </div>

    <!-- 4 CARDS TỔNG KẾT BÁO CÁO -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Doanh Thu -->
      <div class="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-1">
        <div class="text-[11px] uppercase font-bold text-slate-400">Tổng Doanh Thu Bán</div>
        <div class="text-2xl lg:text-3xl font-black text-amber-400">
          {{ formatVND(totalRevenue) }}
        </div>
        <div class="text-[11px] text-slate-500">
          Tổng cộng <span class="text-white font-bold">{{ totalOrders }}</span> đơn hàng
        </div>
      </div>

      <!-- Tiền Vốn -->
      <div class="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-1">
        <div class="text-[11px] uppercase font-bold text-slate-400">Tổng Tiền Vốn Nhập NCC</div>
        <div class="text-2xl lg:text-3xl font-black text-slate-300">
          {{ formatVND(totalCost) }}
        </div>
        <div class="text-[11px] text-slate-500">
          Chi phí nhập các lô heo
        </div>
      </div>

      <!-- Tiền Xe -->
      <div class="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-1">
        <div class="text-[11px] uppercase font-bold text-cyan-400">Tổng Chi Phí Tiền Xe (Ship)</div>
        <div class="text-2xl lg:text-3xl font-black text-cyan-300">
          {{ formatVND(totalShipping) }}
        </div>
        <div class="text-[11px] text-slate-500">
          Chi phí vận chuyển & xe khách
        </div>
      </div>

      <!-- Lợi Nhuận Ròng -->
      <div class="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 p-6 rounded-3xl shadow-xl space-y-1">
        <div class="text-[11px] uppercase font-black text-emerald-400 flex items-center justify-between">
          <span class="flex items-center gap-1"><TrendingUp class="w-4 h-4" /> TỔNG LỢI NHUẬN RÒNG</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {{ profitMargin }}% Margin
          </span>
        </div>
        <div class="text-2xl lg:text-3xl font-black text-emerald-300">
          +{{ formatVND(totalProfit) }}
        </div>
        <div class="text-[11px] text-slate-400">
          Doanh thu - Vốn NCC - Tiền xe
        </div>
      </div>
    </div>

    <!-- BẢNG DANH SÁCH CHI TIẾT ĐƠN TRONG KỲ BÁO CÁO -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-black text-white flex items-center gap-2">
          <FileText class="w-5 h-5 text-emerald-400" />
          <span>Danh Sách Đơn Hàng Trong Kỳ Báo Cáo ({{ orders.length }})</span>
        </h2>
      </div>

      <div v-if="orders.length === 0" class="py-12 text-center text-slate-500 text-xs italic">
        Chưa có đơn hàng nào trong khoảng thời gian đã chọn.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950 text-slate-400 uppercase text-[11px] font-black border-b border-slate-800">
            <tr>
              <th class="px-4 py-3">Mã Đơn</th>
              <th class="px-4 py-3">Khách Hàng</th>
              <th class="px-4 py-3 text-right">Doanh Thu Bán</th>
              <th class="px-4 py-3 text-right">Tiền Vốn NCC</th>
              <th class="px-4 py-3 text-right">Tiền Xe</th>
              <th class="px-4 py-3 text-right">Lợi Nhuận Đơn</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-for="o in orders" :key="o.id" class="hover:bg-slate-800/40 transition">
              <td class="px-4 py-3 font-mono font-bold text-white">
                {{ o.orderCode || o.maDonHang || o.id }}
              </td>
              <td class="px-4 py-3 text-slate-200">
                {{ o.customerName || o.tenKhachHang }}
              </td>
              <td class="px-4 py-3 text-right font-black text-amber-400">
                {{ formatVND(o.totalSellingAmount || o.tongTienBan) }}
              </td>
              <td class="px-4 py-3 text-right text-slate-400">
                {{ formatVND(o.totalCostAmount || o.tongTienVon) }}
              </td>
              <td class="px-4 py-3 text-right text-cyan-400">
                {{ formatVND(o.shippingFee || o.chiPhiTienXeGiao) }}
              </td>
              <td class="px-4 py-3 text-right font-black text-emerald-400">
                +{{ formatVND(o.totalProfit || o.tongTienLoi) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  BarChart3, TrendingUp, RefreshCw, FileText, RotateCcw, Search
} from 'lucide-vue-next';
import { formatVND } from '../utils/formatters';
import { showToast } from '../utils/dialog';

const filterType = ref('month');
const searchQuery = ref('');
const now = new Date();
const selectedDay = ref(now.getDate());
const selectedMonth = ref(now.getMonth() + 1);
const selectedYear = ref(now.getFullYear());

const daysInMonth = computed(() => {
  return new Date(selectedYear.value, selectedMonth.value, 0).getDate();
});

const selectedDate = computed(() => {
  const d = Math.min(selectedDay.value, daysInMonth.value);
  return `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
});

const handleResetFilters = () => {
  filterType.value = 'month';
  searchQuery.value = '';
  const curr = new Date();
  selectedDay.value = curr.getDate();
  selectedMonth.value = curr.getMonth() + 1;
  selectedYear.value = curr.getFullYear();
  showToast('✅ Đã đặt lại bộ lọc báo cáo về tháng hiện tại!', 'info');
};

const dashboardData = ref(null);
const loading = ref(true);

const fetchDashboard = async () => {
  try {
    loading.value = true;
    let query = `filterType=${filterType.value}&loaiBoLoc=${filterType.value}`;
    if (filterType.value === 'day') query += `&date=${selectedDate.value}&ngay=${selectedDate.value}`;
    if (filterType.value === 'month') query += `&month=${selectedMonth.value}&thang=${selectedMonth.value}&year=${selectedYear.value}&nam=${selectedYear.value}`;
    if (filterType.value === 'year') query += `&year=${selectedYear.value}&nam=${selectedYear.value}`;

    const res = await fetch(`/api/reports/dashboard?${query}`).catch(() => null);
    if (res && res.ok) {
      dashboardData.value = await res.json();
    } else {
      dashboardData.value = null;
    }
  } catch (e) {
    console.error("Lỗi tải dashboard:", e);
    dashboardData.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboard();
});

watch([filterType, selectedDay, selectedMonth, selectedYear], () => {
  fetchDashboard();
});

const orders = computed(() => {
  const list = Array.isArray(dashboardData.value?.orders) 
    ? dashboardData.value.orders 
    : (Array.isArray(dashboardData.value?.danhSachDonHang) ? dashboardData.value.danhSachDonHang : []);
  if (!searchQuery.value) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(o => {
    const code = String(o.orderCode || o.maDonHang || o.id || '').toLowerCase();
    const name = String(o.customerName || o.tenKhachHang || '').toLowerCase();
    return code.includes(q) || name.includes(q);
  });
});

const totalRevenue = computed(() => {
  return Number(dashboardData.value?.totalRevenue || dashboardData.value?.tongDoanhThu || 0);
});

const totalCost = computed(() => {
  return Number(dashboardData.value?.totalCost || dashboardData.value?.tongTienVon || 0);
});

const totalShipping = computed(() => {
  return Number(dashboardData.value?.totalShipping || dashboardData.value?.tongChiPhiTienXe || 0);
});

const totalProfit = computed(() => {
  return Number(dashboardData.value?.totalProfit || dashboardData.value?.tongTienLoi || 0);
});

const totalOrders = computed(() => {
  return dashboardData.value?.totalOrders || dashboardData.value?.tongSoDonHang || orders.value.length;
});

const profitMargin = computed(() => {
  return totalRevenue.value > 0 ? ((totalProfit.value / totalRevenue.value) * 100).toFixed(1) : 0;
});
</script>
