<template>
  <div class="p-3 sm:p-5 lg:p-6 w-full max-w-[1700px] mx-auto space-y-5">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div class="relative z-10 flex items-center gap-3.5">
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/30 ring-1 ring-white/20 shrink-0">
          <FileText class="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Quản Lý Đơn Hàng & Tiền Lời
            </h1>
            <span class="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {{ orders.length }} ĐƠN
            </span>
          </div>
          <p class="text-slate-400 text-xs sm:text-sm mt-0.5">
            Xem chi tiết thời gian đặt, khách hàng, nhà cung cấp, chi tiết heo, đặc điểm, đơn giá từng con, tiền vốn, tiền xe, tiền lời và tài khoản thanh toán
          </p>
        </div>
      </div>

      <div class="relative z-10 flex items-center gap-2.5">
        <button 
          @click="fetchOrders"
          class="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700/60 shadow-md transition active:scale-95 cursor-pointer"
          title="Làm mới"
        >
          <RefreshCw :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
        </button>
      </div>
    </div>

    <!-- BỘ LỌC THỜI GIAN & TÌM KIẾM ĐỒNG BỘ DASHBOARD -->
    <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-lg">
      <div class="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0 flex-wrap">
        <button
          @click="filterType = 'day'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
            filterType === 'day' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
          ]"
        >
          Theo Ngày
        </button>
        <button
          @click="filterType = 'month'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
            filterType === 'month' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
          ]"
        >
          Theo Tháng
        </button>
        <button
          @click="filterType = 'year'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
            filterType === 'year' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
          ]"
        >
          Theo Năm
        </button>
        <button
          @click="filterType = 'rolling_2_years'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
            filterType === 'rolling_2_years' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
          ]"
        >
          🔄 2 Năm Luân Phiên
        </button>
        <button
          @click="filterType = 'all'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
            filterType === 'all' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
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
            class="bg-slate-950 border border-slate-700 text-amber-400 text-xs px-2 py-1 rounded-lg outline-none cursor-pointer font-bold"
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
            class="bg-slate-950 border border-slate-700 text-amber-400 text-xs px-2 py-1 rounded-lg outline-none cursor-pointer font-bold"
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
            class="bg-slate-950 border border-slate-700 text-amber-400 text-xs px-3 py-1 rounded-lg outline-none cursor-pointer font-bold"
          >
            <option v-for="y in [2024, 2025, 2026, 2027]" :key="y" :value="y">Năm {{ y }}</option>
          </select>
        </div>

        <!-- Nút Đặt Lại Bộ Lọc -->
        <button
          @click="handleResetFilters"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-rose-200 border border-rose-500/30 flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          title="Đặt lại bộ lọc về mặc định"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Đặt Lại</span>
        </button>

        <!-- Tìm kiếm nhanh -->
        <div class="relative w-48 sm:w-60">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            v-model="search"
            placeholder="Tìm mã đơn, tên khách, NCC, SĐT..."
            class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>
    </div>

    <!-- 4 CARDS TỔNG QUAN TÀI CHÍNH -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div class="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Tổng Doanh Thu Bán</div>
        <div class="text-xl sm:text-2xl font-black text-amber-400 mt-1 whitespace-nowrap">
          {{ formatVND(totalRevenue) }}
        </div>
        <div class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Tổng {{ filteredOrders.length }} đơn (kỳ này)</div>
      </div>

      <div class="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div class="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Tổng Tiền Vốn NCC</div>
        <div class="text-xl sm:text-2xl font-black text-slate-300 mt-1 whitespace-nowrap">
          {{ formatVND(totalCost) }}
        </div>
        <div class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Theo từng lô hàng</div>
      </div>

      <div class="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div class="text-[10px] sm:text-[11px] uppercase font-bold text-cyan-400">Tổng Tiền Xe Ship</div>
        <div class="text-xl sm:text-2xl font-black text-cyan-300 mt-1 whitespace-nowrap">
          {{ formatVND(totalShipping) }}
        </div>
        <div class="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Giao tới khách</div>
      </div>

      <div class="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div class="text-[10px] sm:text-[11px] uppercase font-black text-emerald-400 flex items-center gap-1">
          <TrendingUp class="w-3.5 h-3.5" /> TỔNG TIỀN LỜI RÒNG
        </div>
        <div class="text-xl sm:text-2xl font-black text-emerald-300 mt-1 whitespace-nowrap">
          +{{ formatVND(totalProfit) }}
        </div>
        <div class="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Bán - Vốn - Tiền xe</div>
      </div>
    </div>

    <!-- DANH SÁCH CHI TIẾT ĐƠN HÀNG (CÁC CỘT ĐẦY ĐỦ VÀ CHI TIẾT THEO YÊU CẦU) -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <h2 class="text-sm sm:text-base font-black text-white flex items-center gap-2">
          <FileText class="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span>Danh Sách Đơn Hàng Mua Bán ({{ filteredOrders.length }})</span>
        </h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950 text-slate-400 uppercase text-[10px] sm:text-[11px] font-black border-b border-slate-800">
            <tr>
              <th class="px-3 py-3.5 whitespace-nowrap">Mã Đơn & Thời Gian</th>
              <th class="px-2.5 py-3.5 whitespace-nowrap">Khách Hàng</th>
              <th class="px-2.5 py-3.5 whitespace-nowrap">NCC</th>
              <th class="px-2.5 py-3.5 whitespace-nowrap">Chi Tiết Heo</th>
              <th class="px-2.5 py-3.5 whitespace-nowrap">Đặc Điểm Heo</th>
              <th class="px-2.5 py-3.5 text-right whitespace-nowrap">Giá Từng Con</th>
              <th class="px-2 py-3.5 text-right whitespace-nowrap">Tiền Vốn</th>
              <th class="px-2 py-3.5 text-right whitespace-nowrap">Tiền Xe</th>
              <th class="px-2.5 py-3.5 text-right whitespace-nowrap">Tổng Thanh Toán</th>
              <th class="px-2.5 py-3.5 text-right whitespace-nowrap">Tiền Lời</th>
              <th class="px-2.5 py-3.5 text-center whitespace-nowrap">Thanh Toán (Ngân Hàng & STK)</th>
              <th class="px-2.5 py-3.5 text-center whitespace-nowrap">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-if="filteredOrders.length === 0">
              <td colSpan="12" class="px-4 py-12 text-center text-slate-500 italic">
                Chưa có đơn hàng nào được ghi nhận.
              </td>
            </tr>
            <tr 
              v-else
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-slate-800/40 transition"
            >
              <!-- 1. MÃ ĐƠN & THỜI GIAN -->
              <td class="px-3 py-3 whitespace-nowrap">
                <div class="font-mono font-bold text-white text-xs whitespace-nowrap">{{ order.orderCode || order.maDonHang || order.id }}</div>
                <div class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono whitespace-nowrap">
                  <Clock class="w-2.5 h-2.5 text-slate-500 shrink-0" />
                  <span>{{ formatDateTime(order.createdAt || order.ngayDatHang) }}</span>
                </div>
                <div v-if="(order.notes || order.ghiChu || '').includes('TRẢ HÀNG')" class="mt-0.5">
                  <span class="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap">
                    <RotateCcw class="w-2.5 h-2.5" />
                    Đã Có Đổi Trả
                  </span>
                </div>
              </td>

              <!-- 2. KHÁCH HÀNG -->
              <td class="px-2.5 py-3 whitespace-nowrap">
                <div class="font-bold text-white text-xs whitespace-nowrap">{{ order.customerName || order.tenKhachHang || 'Khách vãng lai' }}</div>
                <div v-if="order.customerPhone || order.soDienThoaiKhach" class="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                  {{ order.customerPhone || order.soDienThoaiKhach }}
                </div>
              </td>

              <!-- 3. NCC (NHÀ CUNG CẤP) -->
              <td class="px-2.5 py-3 whitespace-nowrap">
                <div class="space-y-1">
                  <div 
                    v-for="(item, idx) in (order.items || order.danhSachChiTiet || [])" 
                    :key="idx"
                    class="flex items-center gap-1"
                  >
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold whitespace-nowrap">
                      <Building2 class="w-2.5 h-2.5 shrink-0 text-cyan-400" />
                      {{ getItemSupplierName(item) }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- 4. CHI TIẾT HEO (TÊN + SIZE + SỐ LƯỢNG) -->
              <td class="px-2.5 py-3 whitespace-nowrap">
                <div class="space-y-1">
                  <div 
                    v-for="(item, idx) in (order.items || order.danhSachChiTiet || [])" 
                    :key="idx" 
                    class="text-xs whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span 
                      :class="[
                        'px-1.5 py-0.2 rounded text-[9px] font-bold border whitespace-nowrap',
                        getPreserveBadge(getItemPreserveType(item)).cardClass
                      ]"
                    >
                      {{ getPreserveBadge(getItemPreserveType(item)).icon }} {{ getPreserveBadge(getItemPreserveType(item)).label }}
                    </span>
                    <span class="font-medium text-slate-200">{{ getItemNameAndSize(item) }}</span>
                    <span class="text-amber-400 font-black whitespace-nowrap">
                      x{{ item.quantity || item.soLuong }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- 5. ĐẶC ĐIỂM HEO (ĐUÔI CỤT / ĐUÔI DÀI / RỪNG LAI / MÓNG CÁI) -->
              <td class="px-2.5 py-3 whitespace-nowrap">
                <div class="space-y-1">
                  <div 
                    v-for="(item, idx) in (order.items || order.danhSachChiTiet || [])" 
                    :key="idx"
                  >
                    <span 
                      :class="[
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap',
                        getPigFeatureBadge(getItemFeature(item)).cardClass
                      ]"
                    >
                      <span>{{ getPigFeatureBadge(getItemFeature(item)).icon }}</span>
                      <span>{{ getPigFeatureBadge(getItemFeature(item)).label }}</span>
                    </span>
                  </div>
                </div>
              </td>

              <!-- 6. CHI TIẾT GIÁ TỪNG CON -->
              <td class="px-2.5 py-3 text-right whitespace-nowrap">
                <div class="space-y-1">
                  <div 
                    v-for="(item, idx) in (order.items || order.danhSachChiTiet || [])" 
                    :key="idx"
                    class="text-xs font-bold text-amber-300 whitespace-nowrap"
                  >
                    {{ formatVND(item.giaBanThucTe || item.customPrice || item.price || 0) }}
                  </div>
                </div>
              </td>

              <!-- 7. TIỀN VỐN -->
              <td class="px-2 py-3 text-right font-mono text-xs text-slate-300 font-semibold whitespace-nowrap">
                {{ formatVND(order.totalCostAmount || order.tongTienVon) }}
              </td>

              <!-- 8. TIỀN XE -->
              <td class="px-2 py-3 text-right font-mono text-xs whitespace-nowrap">
                <div v-if="(order.shippingFee || order.chiPhiTienXeGiao) > 0" class="space-y-0.5">
                  <span 
                    v-if="(order.nguoiChiuTienXe || order.shippingPayer) === 'shop'"
                    class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold inline-block"
                  >
                    {{ formatVND(order.shippingFee || order.chiPhiTienXeGiao) }} (Freeship/Shop)
                  </span>
                  <span v-else class="text-cyan-400 font-semibold text-xs inline-block">
                    {{ formatVND(order.shippingFee || order.chiPhiTienXeGiao) }} <span class="text-[9px] text-slate-500 font-sans">(Khách trả)</span>
                  </span>
                </div>
                <span v-else class="text-slate-500 text-xs">0&nbsp;đ</span>
              </td>

              <!-- 9. TỔNG THANH TOÁN -->
              <td class="px-2.5 py-3 text-right whitespace-nowrap">
                <div class="font-black text-amber-400 text-xs sm:text-sm whitespace-nowrap">
                  {{ formatVND(getOrderTotalPayment(order)) }}
                </div>
                <div v-if="(order.shippingFee || order.chiPhiTienXeGiao) > 0" class="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                  <span v-if="(order.nguoiChiuTienXe || order.shippingPayer) === 'shop'" class="text-purple-300">(Shop chịu tiền xe)</span>
                  <span v-else>(Gồm xe: +{{ formatVND(order.shippingFee || order.chiPhiTienXeGiao) }})</span>
                </div>
              </td>

              <!-- 10. TIỀN LỜI -->
              <td class="px-2.5 py-3 text-right font-black text-emerald-400 text-xs sm:text-sm whitespace-nowrap">
                +{{ formatVND(order.totalProfit || order.tongTienLoi) }}
              </td>

              <!-- 11. THANH TOÁN (CHO NGÂN HÀNG NÀO, TÊN CHỦ TK VÀ SỐ TK) -->
              <td class="px-2.5 py-3 text-center whitespace-nowrap">
                <div v-if="(order.paymentMethod || order.phuongThucThanhToan) === 'Bank'" class="flex flex-col items-center">
                  <!-- Tên ngân hàng -->
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 whitespace-nowrap shadow-sm">
                    <Building2 class="w-3 h-3 shrink-0 text-cyan-400" />
                    <span>{{ getBankName(order) }}</span>
                  </span>
                  <!-- Tên chủ tài khoản -->
                  <span v-if="getBankAccountHolder(order)" class="text-[10px] text-white font-bold whitespace-nowrap mt-0.5">
                    {{ getBankAccountHolder(order) }}
                  </span>
                  <!-- Số tài khoản -->
                  <span v-if="getAccountNumber(order)" class="text-[10px] font-mono font-bold text-amber-400 whitespace-nowrap">
                    STK: {{ getAccountNumber(order) }}
                  </span>
                </div>
                <span 
                  v-else
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap"
                >
                  <DollarSign class="w-3 h-3 text-amber-400 shrink-0" />
                  Tiền mặt
                </span>
              </td>

              <!-- 12. THAO TÁC (TRẢ HÀNG & XÓA) -->
              <td class="px-2.5 py-3 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-1">
                  <button
                    @click="handleOpenReturnModal(order)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-[11px] font-bold transition cursor-pointer shadow-sm whitespace-nowrap"
                    title="Khách trả hàng & hoàn tiền, cộng lại kho và đối soát trừ tiền NCC"
                  >
                    <Undo2 class="w-3.5 h-3.5" />
                    <span>Trả Hàng</span>
                  </button>

                  <button
                    @click="handleDeleteOrder(order.id)"
                    class="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                    title="Hủy đơn & hoàn kho"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL: XỬ LÝ TRẢ HÀNG & GIẢM GIÁ BỒI THƯỜNG ĐỐI SOÁT NCC (CHI TIẾT RÕ RÀNG) -->
    <!-- ========================================================================= -->
    <div 
      v-if="showReturnModal && selectedOrder" 
      class="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center overscroll-contain animate-in fade-in duration-150"
    >
      <div 
        class="bg-slate-950 border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-950/40 p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto ring-1 ring-white/10"
        style="width: 100%; max-width: 740px; margin: auto;"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-rose-900/40 shrink-0">
              {{ returnForm.actionType === 'RETURN' ? '🔄' : '🏷️' }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  {{ selectedOrder.orderCode || selectedOrder.maDonHang || selectedOrder.id }}
                </span>
                <h2 class="text-base sm:text-lg font-black text-white tracking-tight">
                  {{ returnForm.actionType === 'RETURN' ? 'Trả Hàng Hoàn Tiền & Đối Soát NCC' : 'Giảm Giá / Bồi Thường Hàng Lỗi' }}
                </h2>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                Khách: <span class="text-white font-bold">{{ selectedOrder.customerName || selectedOrder.tenKhachHang }}</span> • 
                Thời gian: <span class="font-mono text-slate-300">{{ formatDateTime(selectedOrder.createdAt || selectedOrder.ngayDatHang) }}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="showReturnModal = false"
            class="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-xs border border-slate-800"
          >
            ✕
          </button>
        </div>

        <!-- 2 CHẾ ĐỘ XỬ LÝ (TABS) -->
        <div class="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            @click="returnForm.actionType = 'RETURN'"
            :class="[
              'py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer',
              returnForm.actionType === 'RETURN'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-rose-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            ]"
          >
            <RotateCcw class="w-4 h-4" />
            <span>1. Khách Trả Lại Heo (Nhập Kho)</span>
          </button>

          <button
            type="button"
            @click="returnForm.actionType = 'DISCOUNT'"
            :class="[
              'py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer',
              returnForm.actionType === 'DISCOUNT'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            ]"
          >
            <Tag class="w-4 h-4" />
            <span>2. Giảm Giá Bồi Thường (Khách Nhận)</span>
          </button>
        </div>

        <form @submit.prevent="handleSubmitReturn" class="space-y-4">
          <!-- 1. CHỌN MÓN HEO ĐƯỢC XỬ LÝ (CHI TIẾT TỪNG NCC) -->
          <div>
            <label class="block text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wider">
              1. Chọn Loại Heo Xử Lý (Kèm Thông Tin NCC Chi Tiết):
            </label>
            <select
              v-model="returnForm.itemId"
              @change="handleSelectItem"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white font-bold outline-none focus:border-amber-500 cursor-pointer"
            >
              <option 
                v-for="it in (selectedOrder.items || selectedOrder.danhSachChiTiet || [])" 
                :key="it.id" 
                :value="it.id"
              >
                [NCC: {{ getItemSupplierName(it) }}] — {{ getItemNameAndSize(it) }} [{{ getPigFeatureBadge(getItemFeature(it)).label }}] — Mua: {{ it.quantity || it.soLuong }} con — Bán: {{ formatVND(it.giaBanThucTe || it.customPrice || it.price) }} — Vốn: {{ formatVND(it.giaNhapVon || it.costPrice || 0) }}
              </option>
            </select>
          </div>

          <!-- ========================================================================= -->
          <!-- KHỐI 2A: NẾU CHỌN TRẢ HEO VỀ KHO -->
          <!-- ========================================================================= -->
          <div v-if="returnForm.actionType === 'RETURN'" class="grid grid-cols-1 sm:grid-cols-12 gap-3 animate-in fade-in duration-150">
            <div class="sm:col-span-4">
              <label class="block text-xs font-bold text-amber-400 mb-1.5">
                2. Số Lượng Trả (Con) *
              </label>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="returnForm.quantity = Math.max(1, returnForm.quantity - 1)"
                  class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-black text-base flex items-center justify-center cursor-pointer active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  :max="maxReturnQty"
                  required
                  v-model.number="returnForm.quantity"
                  class="w-full text-center bg-slate-900 border border-amber-500/60 rounded-xl py-2.5 text-base font-black text-amber-300 outline-none"
                />
                <button
                  type="button"
                  @click="returnForm.quantity = Math.min(maxReturnQty, returnForm.quantity + 1)"
                  class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-black text-base flex items-center justify-center cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>
              <span class="text-[10px] text-slate-400 block mt-1 text-center font-medium">Tối đa: {{ maxReturnQty }} con</span>
            </div>

            <div class="sm:col-span-8">
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                3. Lý Do Khách Trả Hàng *
              </label>
              <input
                type="text"
                required
                v-model="returnForm.reason"
                placeholder="VD: 1 con xấu quá khách trả về, đổi size..."
                class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500 font-medium"
              />
              <!-- Gợi ý lý do nhanh -->
              <div class="flex flex-wrap gap-1.5 mt-1.5">
                <button
                  type="button"
                  v-for="chip in quickReasons"
                  :key="chip"
                  @click="returnForm.reason = chip"
                  class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 text-[10px] border border-slate-800 cursor-pointer transition"
                >
                  {{ chip }}
                </button>
              </div>
            </div>
          </div>

          <!-- ========================================================================= -->
          <!-- KHỐI 2B: NẾU CHỌN GIẢM GIÁ / BỒI THƯỜNG (KHÁCH VẪN NHẬN HEO) -->
          <!-- ========================================================================= -->
          <div v-else class="bg-slate-900/90 p-4 rounded-2xl border border-cyan-500/30 space-y-3.5 animate-in fade-in duration-150">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <!-- Số tiền giảm -->
              <div class="sm:col-span-5">
                <label class="block text-xs font-bold text-cyan-400 mb-1.5">
                  2. Số Tiền Giảm Giá / Bồi Thường *
                </label>
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    :value="formatInputDisplay(returnForm.discountAmount)"
                    @input="handleDiscountAmountInput"
                    placeholder="VD: 100000"
                    class="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3 py-2 text-sm font-black text-cyan-300 outline-none focus:border-cyan-400"
                  />
                  <span class="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-2 rounded-xl border border-cyan-500/20 shrink-0">
                    VNĐ
                  </span>
                </div>
              </div>

              <!-- Lý do bồi thường -->
              <div class="sm:col-span-7">
                <label class="block text-xs font-bold text-slate-300 mb-1.5">
                  3. Lý Do Giảm Giá Bồi Thường *
                </label>
                <input
                  type="text"
                  required
                  v-model="returnForm.reason"
                  placeholder="VD: Heo hơi xước nhẹ bớt 100k cho khách..."
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>

            <!-- CHỌN AI CHỊU SỐ GIÁ GIẢM (NCC VS SHOP) -->
            <div class="pt-2 border-t border-slate-800/80 space-y-2">
              <label class="block text-xs font-black text-amber-400 uppercase tracking-wider">
                ⚖️ AI CHỊU SỐ TIỀN GIẢM GIÁ {{ formatVND(returnForm.discountAmount || 0) }} NÀY?
              </label>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <!-- Lựa chọn A: NCC chịu -->
                <button
                  type="button"
                  @click="returnForm.discountPayer = 'NCC'"
                  :class="[
                    'p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1',
                    returnForm.discountPayer === 'NCC'
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                      🏢 1. NCC {{ currentSupplierName }} Chịu
                    </span>
                    <span class="w-3 h-3 rounded-full border border-cyan-400 flex items-center justify-center">
                      <span v-if="returnForm.discountPayer === 'NCC'" class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                    </span>
                  </div>
                  <p class="text-[10px] text-slate-300 leading-relaxed">
                    Giảm nợ NCC {{ currentSupplierName }} <strong class="text-cyan-300">{{ formatVND(returnForm.discountAmount || 0) }}</strong>. Giá vốn đơn hàng giảm đi, <strong>Tiền lời của Shop giữ nguyên!</strong>
                  </p>
                </button>

                <!-- Lựa chọn B: Shop chịu -->
                <button
                  type="button"
                  @click="returnForm.discountPayer = 'SHOP'"
                  :class="[
                    'p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1',
                    returnForm.discountPayer === 'SHOP'
                      ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-rose-300 flex items-center gap-1.5">
                      🏪 2. Mình (Shop) Chịu Bồi Thường
                    </span>
                    <span class="w-3 h-3 rounded-full border border-rose-400 flex items-center justify-center">
                      <span v-if="returnForm.discountPayer === 'SHOP'" class="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                    </span>
                  </div>
                  <p class="text-[10px] text-slate-300 leading-relaxed">
                    NCC không bị trừ tiền. Số tiền {{ formatVND(returnForm.discountAmount || 0) }} sẽ <strong>trừ trực tiếp vào tiền lời</strong> của đơn hàng!
                  </p>
                </button>
              </div>
            </div>
          </div>

          <!-- 3. TỔNG HỢP TỰ ĐỘNG: HOÀN KHO - HOÀN TIỀN KHÁCH - ĐỐI SOÁT TRỪ TIỀN NCC -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
            <span class="text-[11px] font-black uppercase text-amber-400 tracking-wider block border-b border-slate-800 pb-2">
              📋 Tổng Hợp Xử Lý Tự Động Chi Tiết:
            </span>

            <!-- BƯỚC 1: KHO HÀNG -->
            <div class="flex items-start gap-2.5 text-xs">
              <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-white">Kho Bán Hàng:</span>
                  <span class="font-black text-emerald-400 text-sm">
                    {{ returnForm.actionType === 'RETURN' ? `+${returnForm.quantity} con` : '0 con (Khách giữ heo)' }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-400">
                  <template v-if="returnForm.actionType === 'RETURN'">
                    Số lượng heo trong kho của NCC <strong class="text-white">{{ currentSupplierName }}</strong> ({{ currentItemDetailText }}) sẽ tự động tăng thêm {{ returnForm.quantity }} con để tiếp tục bán.
                  </template>
                  <template v-else>
                    Khách vẫn nhận heo nên số lượng tồn kho của NCC {{ currentSupplierName }} được giữ nguyên, không cộng lại kho.
                  </template>
                </p>
              </div>
            </div>

            <!-- BƯỚC 2: HOÀN TIỀN CHO KHÁCH -->
            <div class="flex items-start gap-2.5 text-xs pt-2 border-t border-slate-800/80">
              <div class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-white">Hoàn Tiền Cho Khách Hàng:</span>
                  <span class="font-black text-amber-400 text-sm">
                    {{ formatVND(returnForm.actionType === 'RETURN' ? totalCustomerRefund : (returnForm.discountAmount || 0)) }}
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-1.5">
                  <label class="text-[10px] text-slate-400">Nguồn hoàn tiền:</label>
                  <select 
                    v-model="returnForm.refundMethod" 
                    class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white font-bold outline-none cursor-pointer"
                  >
                    <option value="Cash">💵 Tiền Mặt</option>
                    <option value="Bank">🏦 Chuyển Khoản Ngân Hàng</option>
                  </select>

                  <select 
                    v-if="returnForm.refundMethod === 'Bank' && bankAccounts.length > 0"
                    v-model="returnForm.bankAccountId"
                    class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-cyan-300 font-bold outline-none cursor-pointer"
                  >
                    <option v-for="b in bankAccounts" :key="b.id" :value="b.id">
                      {{ b.bankName || b.tenNganHang }} (STK: {{ b.accountNumber || b.soTaiKhoan }})
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- BƯỚC 3: ĐỐI SOÁT NCC HOẶC TRỪ LỜI -->
            <div class="flex items-start gap-2.5 text-xs pt-2 border-t border-slate-800/80">
              <div class="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </div>
              <div class="flex-1 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-white">Đối Soát NCC / Tác Động Tiền Lời:</span>
                  <span class="font-black text-rose-400 text-sm">
                    <template v-if="returnForm.actionType === 'RETURN'">
                      {{ returnForm.deductSupplier ? ('-' + formatVND(totalSupplierCostDeduction)) : '0 đ (Không trừ)' }}
                    </template>
                    <template v-else>
                      {{ returnForm.discountPayer === 'NCC' ? ('Giảm nợ NCC: ' + formatVND(returnForm.discountAmount || 0)) : ('Trừ tiền lời: -' + formatVND(returnForm.discountAmount || 0)) }}
                    </template>
                  </span>
                </div>

                <div class="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-300">
                      🏢 Nhà Cung Cấp: <strong class="text-white text-xs">{{ currentSupplierName }}</strong>
                    </span>
                    <label v-if="returnForm.actionType === 'RETURN'" class="flex items-center gap-1.5 text-cyan-300 font-bold cursor-pointer">
                      <input type="checkbox" v-model="returnForm.deductSupplier" class="rounded cursor-pointer" />
                      <span>Tự động trừ tiền NCC</span>
                    </label>
                    <span v-else class="text-[10px] font-bold" :class="returnForm.discountPayer === 'NCC' ? 'text-cyan-300' : 'text-purple-300'">
                      {{ returnForm.discountPayer === 'NCC' ? 'NCC chịu số giá giảm' : 'Shop chịu (Trừ tiền lời)' }}
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>Lô hàng: <strong class="text-amber-300">{{ currentItemDetailText }}</strong></span>
                    <span>•</span>
                    <span>Đơn giá vốn: <strong class="text-slate-200">{{ formatVND(currentUnitCost) }}/con</strong></span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer Actions -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              @click="showReturnModal = false"
              class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              :disabled="isSubmittingReturn"
              class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Undo2 class="w-4 h-4" />
              <span>{{ isSubmittingReturn ? 'Đang Xử Lý...' : (returnForm.actionType === 'RETURN' ? 'Xác Nhận Trả Hàng & Hoàn Tiền' : 'Xác Nhận Giảm Giá Bồi Thường') }}</span>
            </button>
          </div>
        </form>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  FileText, Clock, DollarSign, TrendingUp, 
  Trash2, Search, RefreshCw, Building2, Undo2, RotateCcw, Tag, Calendar
} from 'lucide-vue-next';
import { formatVND, formatDateTime, formatDate } from '../utils/formatters';
import { showConfirm, showToast } from '../utils/dialog';

const orders = ref([]);
const bankAccounts = ref([]);
const loading = ref(true);
const search = ref('');

// BỘ LỌC THỜI GIAN ĐỒNG BỘ DASHBOARD
const filterType = ref('month');
const now = new Date();
const selectedDay = ref(now.getDate());
const selectedMonth = ref(now.getMonth() + 1);
const selectedYear = ref(now.getFullYear());

const daysInMonth = computed(() => {
  return new Date(selectedYear.value, selectedMonth.value, 0).getDate();
});

const selectedDateStr = computed(() => {
  const d = Math.min(selectedDay.value, daysInMonth.value);
  return `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
});

const handleResetFilters = () => {
  filterType.value = 'month';
  search.value = '';
  const curr = new Date();
  selectedDay.value = curr.getDate();
  selectedMonth.value = curr.getMonth() + 1;
  selectedYear.value = curr.getFullYear();
  showToast('✅ Đã đặt lại bộ lọc về tháng hiện tại!', 'info');
};

const isDateInPeriod = (dateStr) => {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return true;

  if (filterType.value === 'day') {
    const target = selectedDateStr.value;
    const orderDateStr = d.toISOString().slice(0, 10);
    return orderDateStr === target;
  }
  if (filterType.value === 'month') {
    return d.getMonth() + 1 === Number(selectedMonth.value) && d.getFullYear() === Number(selectedYear.value);
  }
  if (filterType.value === 'year') {
    return d.getFullYear() === Number(selectedYear.value);
  }
  if (filterType.value === 'rolling_2_years') {
    const curr = new Date();
    const ago = new Date(curr.getFullYear() - 2, curr.getMonth(), curr.getDate());
    ago.setHours(0, 0, 0, 0);
    curr.setHours(23, 59, 59, 999);
    return d >= ago && d <= curr;
  }
  return true;
};

const showReturnModal = ref(false);
const selectedOrder = ref(null);
const isSubmittingReturn = ref(false);

const quickReasons = [
  '🐷 Heo xấu / không đạt mẫu',
  '📦 Khách đổi size khác',
  '⚠️ Khách lấy dư gửi trả lại',
  '🚚 Giao nhầm loại heo',
  '🏷️ Giảm giá 100k bồi thường khách'
];

const returnForm = ref({
  actionType: 'RETURN', // 'RETURN' hoặc 'DISCOUNT'
  itemId: null,
  quantity: 1,
  discountAmount: 100000,
  discountPayer: 'NCC', // 'NCC' hoặc 'SHOP'
  reason: 'Heo xấu không đạt mẫu trả về',
  refundMethod: 'Cash',
  bankAccountId: '',
  deductSupplier: true
});

const formatInputDisplay = (val) => {
  if (val === null || val === undefined || val === '') return '';
  const num = Number(val);
  if (isNaN(num)) return '';
  return num.toLocaleString('vi-VN');
};

const handleDiscountAmountInput = (e) => {
  const raw = e.target.value.replace(/\D/g, '');
  returnForm.value.discountAmount = raw ? Number(raw) : 0;
};

const getPreserveBadge = (type) => {
  switch (type) {
    case 'cold':
      return { label: 'Lạnh', icon: '❄️', cardClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
    case 'wrapped':
    case 'hot_wrapped':
      return { label: 'Cuộn Bọc', icon: '📦', cardClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    case 'hot':
    default:
      return { label: 'Nóng', icon: '🔥', cardClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
  }
};

const getPigFeatureBadge = (feature) => {
  switch (feature) {
    case 'duoi_dai':
      return { label: 'Đuôi Dài', icon: '🐖', cardClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    case 'rung_lai':
      return { label: 'Rừng Lai', icon: '🐗', cardClass: 'bg-amber-600/20 text-amber-300 border-amber-500/30' };
    case 'mong_cai':
      return { label: 'Móng Cái', icon: '🐽', cardClass: 'bg-pink-500/20 text-pink-300 border-pink-500/30' };
    case 'duoi_cut':
    default:
      return { label: 'Đuôi Cụt', icon: '🐷', cardClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
  }
};

const getItemSupplierName = (item) => {
  return item.sanPhamHeo?.nhaCungCap?.tenNhaCungCap || item.supplierName || item.sanPhamHeo?.supplier?.tenNhaCungCap || 'Trang Trại Ba Vì';
};

const getItemNameAndSize = (item) => {
  const size = item.sizeType || item.loaiSize || item.sanPhamHeo?.sizeType || item.sanPhamHeo?.loaiSize || '';
  if (size) return size;
  return item.productName || item.sanPhamHeo?.tenSanPham || 'Heo Sữa';
};

const getItemPreserveType = (item) => {
  return item.porkType || item.loaiHeo || item.sanPhamHeo?.porkType || item.sanPhamHeo?.loaiHeo || 'hot';
};

const getItemFeature = (item) => {
  return item.pigFeature || item.dacDiemHeo || item.sanPhamHeo?.pigFeature || item.sanPhamHeo?.dacDiemHeo || 'duoi_cut';
};

const selectedItem = computed(() => {
  if (!selectedOrder.value) return null;
  const list = selectedOrder.value.items || selectedOrder.value.danhSachChiTiet || [];
  return list.find(it => String(it.id) === String(returnForm.value.itemId)) || list[0] || null;
});

const maxReturnQty = computed(() => {
  if (!selectedItem.value) return 1;
  return Number(selectedItem.value.quantity || selectedItem.value.soLuong) || 1;
});

const currentUnitPrice = computed(() => {
  if (!selectedItem.value) return 0;
  return Number(selectedItem.value.giaBanThucTe || selectedItem.value.customPrice || selectedItem.value.price || 0);
});

const currentUnitCost = computed(() => {
  if (!selectedItem.value) return 0;
  return Number(selectedItem.value.giaNhapVon || selectedItem.value.costPrice || selectedItem.value.sanPhamHeo?.giaNhapVon || 0);
});

const currentSupplierName = computed(() => {
  if (!selectedItem.value) return 'NCC';
  return getItemSupplierName(selectedItem.value);
});

const currentItemDetailText = computed(() => {
  if (!selectedItem.value) return '';
  const nameSize = getItemNameAndSize(selectedItem.value);
  const feature = getPigFeatureBadge(getItemFeature(selectedItem.value)).label;
  return `${nameSize} (${feature})`;
});

const currentSupplierId = computed(() => {
  if (!selectedItem.value) return null;
  return selectedItem.value.sanPhamHeo?.nhaCungCap?.id || selectedItem.value.supplierId || null;
});

const totalCustomerRefund = computed(() => {
  return currentUnitPrice.value * (Number(returnForm.value.quantity) || 1);
});

const totalSupplierCostDeduction = computed(() => {
  return currentUnitCost.value * (Number(returnForm.value.quantity) || 1);
});

const getOrderTotalPayment = (order) => {
  const sell = Number(order.totalSellingAmount || order.tongTienBan) || 0;
  const ship = Number(order.shippingFee || order.chiPhiTienXeGiao) || 0;
  const payer = order.nguoiChiuTienXe || order.shippingPayer || 'buyer';
  if (payer === 'shop') {
    return sell; // Freeship: Khách chỉ trả tiền hàng
  }
  return sell + ship; // Khách chịu ship: Tiền hàng + tiền xe
};

const handleSelectItem = () => {
  returnForm.value.quantity = 1;
};

const handleOpenReturnModal = (order) => {
  selectedOrder.value = order;
  const list = order.items || order.danhSachChiTiet || [];
  returnForm.value = {
    actionType: 'RETURN',
    itemId: list.length > 0 ? list[0].id : null,
    quantity: 1,
    discountAmount: 100000,
    discountPayer: 'NCC',
    reason: 'Heo xấu không đạt mẫu trả về',
    refundMethod: 'Cash',
    bankAccountId: bankAccounts.value.length > 0 ? bankAccounts.value[0].id : '',
    deductSupplier: true
  };
  showReturnModal.value = true;
};

const handleSubmitReturn = async () => {
  if (!selectedOrder.value || !selectedItem.value) return;

  const isGiamGia = returnForm.value.actionType === 'DISCOUNT';
  const qty = Number(returnForm.value.quantity) || 1;

  if (!isGiamGia && (qty <= 0 || qty > maxReturnQty.value)) {
    showToast(`Số lượng trả không hợp lệ (tối đa ${maxReturnQty.value} con)!`, "warning");
    return;
  }

  if (isGiamGia && (!returnForm.value.discountAmount || Number(returnForm.value.discountAmount) <= 0)) {
    showToast("Vui lòng nhập số tiền giảm giá bồi thường hợp lệ!", "warning");
    return;
  }

  isSubmittingReturn.value = true;
  try {
    const payload = {
      chiTietDonHangId: selectedItem.value.id,
      sanPhamHeoId: selectedItem.value.sanPhamHeo?.id || selectedItem.value.productId,
      soLuongTra: isGiamGia ? 0 : qty,
      giaHoanTien: isGiamGia ? Number(returnForm.value.discountAmount) : currentUnitPrice.value,
      giaVonTruNcc: currentUnitCost.value,
      nhaCungCapId: currentSupplierId.value,
      truTienNcc: isGiamGia ? (returnForm.value.discountPayer === 'NCC') : returnForm.value.deductSupplier,
      loaiXuLy: isGiamGia ? 'GIAM_GIA' : 'TRA_HEO',
      nguoiChiuGiamGia: returnForm.value.discountPayer,
      soTienGiamGia: isGiamGia ? Number(returnForm.value.discountAmount) : 0,
      lyDo: returnForm.value.reason,
      nguonHoanTien: returnForm.value.refundMethod,
      taiKhoanNganHangId: returnForm.value.refundMethod === 'Bank' ? Number(returnForm.value.bankAccountId) : null
    };

    const res = await fetch(`/api/orders/${selectedOrder.value.id}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      if (isGiamGia) {
        showToast(`Đã ghi nhận bồi thường ${formatVND(returnForm.value.discountAmount)} cho khách hàng thành công!`, "success");
      } else {
        showToast(`Đã nhận trả ${qty} con thành công! Đã hoàn tiền cho khách và hoàn lại số lượng vào tồn kho.`, "success");
      }
      showReturnModal.value = false;
      fetchOrders();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast("Lỗi xử lý đổi trả: " + (err.message || 'Không thể hoàn tất thao tác'), "error");
    }
  } catch (err) {
    showToast("Lỗi kết nối máy chủ, vui lòng thử lại: " + err.message, "error");
  } finally {
    isSubmittingReturn.value = false;
  }
};

const fetchOrders = async () => {
  try {
    loading.value = true;
    const [ordersRes, banksRes] = await Promise.all([
      fetch('/api/orders').catch(() => null),
      fetch('/api/bank-accounts').catch(() => null)
    ]);

    if (ordersRes && ordersRes.ok) {
      const data = await ordersRes.json();
      orders.value = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
    } else {
      orders.value = [];
    }

    if (banksRes && banksRes.ok) {
      const bData = await banksRes.json();
      bankAccounts.value = Array.isArray(bData) ? bData : [];
    }
  } catch (e) {
    console.error("Lỗi tải đơn hàng:", e);
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});

const handleDeleteOrder = async (id) => {
  const confirmed = await showConfirm({
    title: 'Xác Nhận Hủy Đơn Hàng',
    message: `Bạn có chắc chắn muốn hủy đơn hàng #${id}? Số lượng heo đã bán sẽ được tự động hoàn lại vào kho.`,
    confirmText: 'Hủy Đơn Hàng',
    cancelText: 'Giữ Lại',
    type: 'danger'
  });

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast("Đã hủy đơn hàng và hoàn lại số lượng vào tồn kho thành công!", "success");
      fetchOrders();
    } else {
      showToast("Không thể hủy đơn hàng này, vui lòng kiểm tra lại!", "error");
    }
  } catch (e) {
    showToast("Lỗi khi hủy đơn hàng: " + e.message, "error");
  }
};

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    // 1. Kiểm tra ngày đặt
    const orderDate = o.createdAt || o.ngayDatHang || o.ngayTao || o.date;
    if (!isDateInPeriod(orderDate)) return false;

    // 2. Tìm kiếm từ khóa
    const code = String(o.id || o.orderCode || o.maDonHang || '').toLowerCase();
    const name = String(o.customerName || o.tenKhachHang || '').toLowerCase();
    const phone = String(o.customerPhone || o.soDienThoaiKhach || '');
    return code.includes(search.value.toLowerCase()) || name.includes(search.value.toLowerCase()) || phone.includes(search.value);
  });
});

const totalRevenue = computed(() => {
  return filteredOrders.value.reduce((s, o) => s + (Number(o.totalSellingAmount || o.tongTienBan) || 0), 0);
});

const totalCost = computed(() => {
  return filteredOrders.value.reduce((s, o) => s + (Number(o.totalCostAmount || o.tongTienVon) || 0), 0);
});

const totalShipping = computed(() => {
  return filteredOrders.value.reduce((s, o) => s + (Number(o.shippingFee || o.chiPhiTienXeGiao) || 0), 0);
});

const totalProfit = computed(() => {
  return filteredOrders.value.reduce((s, o) => s + (Number(o.totalProfit || o.tongTienLoi) || 0), 0);
});

const getBankName = (order) => {
  const tk = order.taiKhoanNganHangNhan || order.bankAccount;
  if (typeof tk === 'object' && tk !== null) {
    return tk.tenNganHang || tk.bankName || 'Ngân hàng';
  }
  return order.bankName || 'Chuyển khoản';
};

const getBankAccountHolder = (order) => {
  const tk = order.taiKhoanNganHangNhan || order.bankAccount;
  if (typeof tk === 'object' && tk !== null) {
    if (tk.tenNguoiNha) return `(${tk.tenNguoiNha}) ${tk.chuTaiKhoan || ''}`;
    return tk.chuTaiKhoan || tk.accountHolder || '';
  }
  return '';
};

const getAccountNumber = (order) => {
  const tk = order.taiKhoanNganHangNhan || order.bankAccount;
  if (typeof tk === 'object' && tk !== null) {
    return tk.soTaiKhoan || tk.accountNumber || '';
  }
  return '';
};
</script>
