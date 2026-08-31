<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-violet-600/20 ring-1 ring-white/20">
          <Ruler class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight">Quản Lý Size &amp; Thống Kê Bán Chạy</h1>
          <p class="text-slate-400 text-xs sm:text-sm mt-1">
            Xếp hạng các size heo bán chạy nhất, theo dõi tổng số con bán theo từng size và doanh thu (Lưu trữ 2 năm luân phiên).
          </p>
        </div>
      </div>
      <div class="relative z-10 flex items-center gap-3">
        <button 
          @click="handleOpenAdd" 
          class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-violet-600/20 transition active:scale-95 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Thêm Size Mới</span>
        </button>
        <button 
          @click="fetchData" 
          class="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700/60 shadow-md transition active:scale-95 cursor-pointer"
          title="Tải lại dữ liệu"
        >
          <RefreshCw :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
        </button>
      </div>
    </div>

    <!-- THANH CÔNG CỤ ĐỒNG BỘ DASHBOARD -->
    <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
      <!-- Hàng 1: Phân Loại Kiểu Bán (Trái) & Chế Độ Lọc Thời Gian (Phải) -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <!-- Phân loại kiểu bán -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800/90 shrink-0">
          <button 
            @click="sizeTab = 'ALL'" 
            :class="[
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer', 
              sizeTab === 'ALL' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
            ]"
          >
            Tất Cả Size ({{ sizesWithStats.length }})
          </button>
          <button 
            @click="sizeTab = 'per_range'" 
            :class="[
              'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer', 
              sizeTab === 'per_range' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black' : 'text-slate-400 hover:text-white'
            ]"
          >
            <ArrowLeftRight class="w-3.5 h-3.5 text-amber-400" />
            <span>Theo Khoảng Size</span>
          </button>
          <button 
            @click="sizeTab = 'per_kg'" 
            :class="[
              'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer', 
              sizeTab === 'per_kg' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black' : 'text-slate-400 hover:text-white'
            ]"
          >
            <Scale class="w-3.5 h-3.5 text-emerald-400" />
            <span>Theo Kg</span>
          </button>
        </div>

        <!-- Các Nút Chọn Chế Độ Thời Gian (Đồng bộ Dashboard) -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0 flex-wrap">
          <button
            @click="periodMode = 'day'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
              periodMode === 'day' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            ]"
          >
            Theo Ngày
          </button>
          <button
            @click="periodMode = 'month'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
              periodMode === 'month' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            ]"
          >
            Theo Tháng
          </button>
          <button
            @click="periodMode = 'year'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
              periodMode === 'year' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            ]"
          >
            Theo Năm
          </button>
          <button
            @click="periodMode = 'ROLLING_2_YEARS'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
              periodMode === 'ROLLING_2_YEARS' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            ]"
          >
            🔄 2 Năm Luân Phiên
          </button>
          <button
            @click="periodMode = 'ALL_TIME'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
              periodMode === 'ALL_TIME' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            ]"
          >
            Toàn Thời Gian
          </button>
        </div>
      </div>

      <!-- Hàng 2: Ô Chọn Ngày/Tháng/Năm, Nút Đặt Lại, Chế Độ Xem & Tìm Kiếm -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80">
        <!-- Vùng chọn ngày/tháng/năm -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Chế độ Theo Ngày -->
          <div v-if="periodMode === 'day'" class="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
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

          <!-- Chế độ Theo Tháng -->
          <div v-if="periodMode === 'month'" class="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
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

          <!-- Chế độ Theo Năm -->
          <div v-if="periodMode === 'year'" class="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span class="text-xs text-slate-400">Chọn năm:</span>
            <select
              v-model="selectedYear"
              class="bg-slate-950 border border-slate-700 text-amber-400 text-xs px-3 py-1 rounded-lg outline-none cursor-pointer font-bold"
            >
              <option v-for="y in [2024, 2025, 2026, 2027]" :key="y" :value="y">Năm {{ y }}</option>
            </select>
          </div>

          <!-- Nhãn 2 Năm Luân Phiên -->
          <div v-if="periodMode === 'ROLLING_2_YEARS'" class="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <span>📅 Đang thống kê:</span>
            <strong class="text-amber-300">{{ periodDescriptionText }}</strong>
          </div>

          <!-- Nhãn Toàn Thời Gian -->
          <div v-if="periodMode === 'ALL_TIME'" class="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <span>📅 Đang thống kê:</span>
            <strong class="text-emerald-400">Toàn bộ thời gian (Tất cả đơn)</strong>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <!-- Nút Đặt Lại Bộ Lọc -->
          <button
            @click="handleResetFilters"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-rose-200 border border-rose-500/30 flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
            title="Đặt lại bộ lọc về mặc định"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Đặt Lại</span>
          </button>

          <!-- Toggle View Mode: Cards vs Table -->
          <div class="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
            <button 
              @click="viewMode = 'cards'" 
              :class="['p-1.5 rounded-lg text-xs transition cursor-pointer', viewMode === 'cards' ? 'bg-slate-800 text-amber-300' : 'text-slate-500 hover:text-slate-300']"
              title="Dạng thẻ xếp hạng"
            >
              <LayoutGrid class="w-4 h-4" />
            </button>
            <button 
              @click="viewMode = 'table'" 
              :class="['p-1.5 rounded-lg text-xs transition cursor-pointer', viewMode === 'table' ? 'bg-slate-800 text-amber-300' : 'text-slate-500 hover:text-slate-300']"
              title="Dạng bảng dữ liệu"
            >
              <Table class="w-4 h-4" />
            </button>
          </div>

          <!-- Tìm kiếm nhanh -->
          <div class="relative w-full sm:w-56">
            <Search class="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm size (VD: 3-3.9kg)..." 
              class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- STATS BANNER (CHỈ HIỂN THỊ SỐ CON BÁN & DOANH THU) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Card 1: Top 1 Size Bán Chạy Nhất -->
      <div class="relative bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 p-5 rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between">
        <div class="absolute -right-4 -top-4 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>🏆</span>
              <span>Size Heo Bán Chạy Nhất</span>
            </span>
            <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
              TOP 1 BEST SELLER
            </span>
          </div>
          <div v-if="topSize" class="space-y-1">
            <h3 class="text-xl font-black text-white leading-tight">
              {{ topSize.name }}
            </h3>
            <p class="text-xs text-amber-300 font-bold">
              {{ topSize.displayRange }}
            </p>
          </div>
          <div v-else class="text-xs text-slate-400 italic py-2">
            Chưa có số liệu bán heo trong khoảng thời gian này.
          </div>
        </div>

        <div v-if="topSize" class="pt-3 mt-2 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-center">
          <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span class="text-[10px] text-slate-400 block">Số con bán</span>
            <strong class="text-emerald-400 text-base font-black">{{ topSize.soldPigs }} con</strong>
          </div>
          <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span class="text-[10px] text-slate-400 block">Tổng doanh thu</span>
            <strong class="text-white text-sm font-bold block truncate">{{ formatVND(topSize.revenue) }}</strong>
          </div>
        </div>
      </div>

      <!-- Card 2: Tổng Số Con Heo & Tổng Doanh Thu Tất Cả Size -->
      <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Lượng Bán &amp; Doanh Thu Kỳ Này</span>
          <div class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
            <Package class="w-4 h-4" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <span class="text-[10px] text-slate-500 font-bold uppercase">Tổng số con bán ra:</span>
            <div class="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {{ periodTotalSummary.totalPigs }} <span class="text-xs text-slate-400 font-normal">con</span>
            </div>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] text-slate-500 font-bold uppercase">Tổng doanh thu:</span>
            <div class="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {{ formatVND(periodTotalSummary.totalRevenue) }}
            </div>
          </div>
        </div>
        <p class="text-[11px] text-slate-500 italic pt-2 border-t border-slate-800">
          💡 Kỳ thống kê: {{ periodDescriptionText }}
        </p>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="py-20 flex flex-col items-center justify-center space-y-3">
      <div class="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
      <p class="text-slate-400 text-sm">Đang tải và tổng hợp số lượng con bán theo size...</p>
    </div>

    <!-- EMPTY -->
    <div v-else-if="filteredSizes.length === 0" class="py-20 text-center bg-slate-950/60 border border-slate-800 rounded-3xl">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 flex items-center justify-center"><Ruler class="w-7 h-7 text-slate-600" /></div>
      <h3 class="text-base font-bold text-white mb-1">Chưa có cấu hình size nào</h3>
      <p class="text-slate-400 text-xs">Bấm "Thêm Size Mới" để tạo khoảng size bán hàng</p>
    </div>

    <!-- DANH SÁCH SIZE & THỐNG KÊ (DẠNG THẺ HOẶC BẢNG) -->
    <div v-else>
      <!-- 1. Dạng Thẻ Xếp Hạng (Card Grid) -->
      <div v-if="viewMode === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          v-for="(s, idx) in filteredSizes" 
          :key="s.id || idx"
          :class="[
            'bg-slate-900/90 border rounded-3xl p-5 shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden space-y-4',
            idx === 0 && s.soldPigs > 0 ? 'border-amber-500/50 shadow-amber-950/20' : 'border-slate-800 hover:border-violet-500/40'
          ]"
        >
          <!-- glow accent -->
          <div class="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none -mr-8 -mt-8 bg-amber-500"></div>

          <!-- TOP: Rank Badge + Type + Actions -->
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <div :class="[
                  'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm border',
                  idx === 0 && s.soldPigs > 0 ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30' : 
                  (idx === 1 && s.soldPigs > 0 ? 'bg-slate-300 text-slate-950 border-white' : 
                  (idx === 2 && s.soldPigs > 0 ? 'bg-amber-700 text-amber-100 border-amber-600' : 'bg-slate-950 text-slate-400 border-slate-800'))
                ]">
                  <span>#{{ idx + 1 }}</span>
                </div>
                <div>
                  <h3 class="font-black text-white text-base leading-tight group-hover:text-amber-400 transition">
                    {{ s.name }}
                  </h3>
                  <span class="text-xs font-bold text-amber-400 font-mono">
                    {{ s.displayRange }}
                  </span>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                <button @click="handleEdit(s)" class="p-1.5 rounded-xl bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer" title="Chỉnh sửa">
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button @click="handleDelete(s)" class="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer" title="Xóa">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Thống kê số lượng bán trong kỳ -->
            <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-400">Số con bán được (kỳ này):</span>
                <strong :class="s.soldPigs > 0 ? 'text-emerald-400 text-sm font-black' : 'text-slate-500 font-bold'">
                  {{ s.soldPigs }} con
                </strong>
              </div>

              <!-- Progress bar tỷ lệ bán chạy -->
              <div class="space-y-1">
                <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    class="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                    :style="{ width: `${s.sharePercent}%` }"
                  ></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>Chiếm {{ s.sharePercent }}% lượng bán</span>
                  <span>{{ s.orderCount }} đơn hàng</span>
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60">
                <span class="text-slate-400">Doanh thu bán:</span>
                <strong class="text-white font-bold">{{ formatVND(s.revenue) }}</strong>
              </div>
            </div>
          </div>

          <!-- Nút Xem Lịch Sử Đơn Bán Của Size Này -->
          <button
            @click="handleViewSizeOrders(s)"
            class="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <FileText class="w-3.5 h-3.5 text-amber-400" />
            <span>Xem Đơn Hàng Của Size Này ({{ s.orderCount }} đơn)</span>
          </button>
        </div>
      </div>

      <!-- 2. Dạng Bảng Chi Tiết (Data Table) -->
      <div v-else class="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="px-4 py-3.5">Hạng</th>
                <th class="px-4 py-3.5">Quy Cách &amp; Size</th>
                <th class="px-4 py-3.5">Kiểu Bán</th>
                <th class="px-4 py-3.5">Số Con Bán Ra</th>
                <th class="px-4 py-3.5">Tỷ Trọng (%)</th>
                <th class="px-4 py-3.5">Doanh Thu</th>
                <th class="px-4 py-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80">
              <tr v-for="(s, idx) in filteredSizes" :key="s.id || idx" class="hover:bg-slate-800/50 transition">
                <td class="px-4 py-3 font-bold">
                  <span :class="[
                    'px-2 py-0.5 rounded-lg text-[10px] font-black',
                    idx === 0 && s.soldPigs > 0 ? 'bg-amber-500 text-slate-950' : (idx === 1 && s.soldPigs > 0 ? 'bg-slate-300 text-slate-950' : (idx === 2 && s.soldPigs > 0 ? 'bg-amber-700 text-white' : 'text-slate-400'))
                  ]">
                    #{{ idx + 1 }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <strong class="text-white block font-bold text-sm">{{ s.name }}</strong>
                  <span class="text-xs text-amber-400 font-bold font-mono">{{ s.displayRange }}</span>
                </td>
                <td class="px-4 py-3">
                  <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold border', s.saleType === 'per_range' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30']">
                    {{ s.saleType === 'per_range' ? 'Theo Khoảng Size' : 'Theo Kg' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-emerald-400 font-black text-sm">{{ s.soldPigs }} con</td>
                <td class="px-4 py-3 text-slate-300 font-bold">{{ s.sharePercent }}%</td>
                <td class="px-4 py-3 font-bold text-white">{{ formatVND(s.revenue) }}</td>
                <td class="px-4 py-3 text-right">
                  <button @click="handleViewSizeOrders(s)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg font-bold text-[11px] mr-2 cursor-pointer">
                    Đơn Hàng
                  </button>
                  <button @click="handleEdit(s)" class="p-1 text-slate-400 hover:text-white mr-1 cursor-pointer">
                    <Edit2 class="w-3.5 h-3.5 inline" />
                  </button>
                  <button @click="handleDelete(s)" class="p-1 text-slate-400 hover:text-rose-400 cursor-pointer">
                    <Trash2 class="w-3.5 h-3.5 inline" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- PHẦN 2: BẢNG CHI TIẾT NHẬT KÝ BÁN HEO THEO CÂN NẶNG (KG) -->
    <!-- ========================================================================= -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Scale class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-white flex items-center gap-2 flex-wrap">
              <span>Bảng Chi Tiết Bán Heo Theo Cân Nặng (Kg)</span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {{ kgSalesList.length }} LƯỢT BÁN
              </span>
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              Nhật ký từng con heo bán theo số kg cụ thể trong kỳ: <strong class="text-amber-300">{{ periodDescriptionText }}</strong>
            </p>
          </div>
        </div>

        <!-- Tóm tắt số liệu nhanh bán theo kg -->
        <div class="flex items-center gap-2 sm:gap-3 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 shrink-0">
          <div class="px-3 text-center border-r border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Số Con Bán</span>
            <span class="text-sm sm:text-base font-black text-white">{{ kgSalesStats.totalHeads }} con</span>
          </div>
          <div class="px-3 text-center border-r border-slate-800">
            <span class="text-[10px] uppercase font-bold text-emerald-400 block">Tổng Cân Nặng</span>
            <span class="text-sm sm:text-base font-black text-emerald-400">⚖️ {{ Number(kgSalesStats.totalKg).toLocaleString('vi-VN') }} kg</span>
          </div>
          <div class="px-3 text-center">
            <span class="text-[10px] uppercase font-bold text-amber-400 block">Doanh Thu Bán Kg</span>
            <span class="text-sm sm:text-base font-black text-amber-400">{{ formatVND(kgSalesStats.totalRevenue) }}</span>
          </div>
        </div>
      </div>

      <!-- Bảng danh sách chi tiết bán theo kg -->
      <div v-if="kgSalesList.length === 0" class="py-12 text-center text-slate-500 text-xs italic bg-slate-950/40 rounded-2xl border border-slate-800/60">
        Chưa có đơn hàng nào bán heo theo kg trong khoảng thời gian đã chọn.
      </div>

      <div v-else class="overflow-x-auto rounded-2xl border border-slate-800/80">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950 text-slate-400 uppercase text-[10px] sm:text-[11px] font-black border-b border-slate-800">
            <tr>
              <th class="px-4 py-3.5 whitespace-nowrap">Thời Gian & Mã Đơn</th>
              <th class="px-3 py-3.5 whitespace-nowrap">Khách Hàng</th>
              <th class="px-3 py-3.5 whitespace-nowrap">Quy Cách Sản Phẩm</th>
              <th class="px-3 py-3.5 text-center whitespace-nowrap">Số Con</th>
              <th class="px-4 py-3.5 text-center whitespace-nowrap">Cân Nặng Thực Tế</th>
              <th class="px-4 py-3.5 text-right whitespace-nowrap">Đơn Giá Bán / Kg</th>
              <th class="px-4 py-3.5 text-right whitespace-nowrap">Thành Tiền</th>
              <th class="px-4 py-3.5 whitespace-nowrap">Ghi Chú</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-slate-950/30 font-medium">
            <tr v-for="item in kgSalesList" :key="item.id" class="hover:bg-slate-800/40 transition">
              <td class="px-4 py-3.5 whitespace-nowrap">
                <div class="font-mono font-bold text-white text-xs">{{ item.orderCode }}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">📅 {{ formatDate(item.date) }}</div>
              </td>

              <td class="px-3 py-3.5 whitespace-nowrap">
                <div class="font-bold text-white">{{ item.customerName }}</div>
                <div v-if="item.customerPhone" class="text-[10px] text-slate-400 font-mono">{{ item.customerPhone }}</div>
              </td>

              <td class="px-3 py-3.5 whitespace-nowrap">
                <div class="font-bold text-slate-200 flex items-center gap-1.5">
                  <span>🐷</span>
                  <span>{{ item.productName }}</span>
                </div>
              </td>

              <td class="px-3 py-3.5 text-center whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-black text-xs">
                  {{ item.soCon }} con
                </span>
              </td>

              <td class="px-4 py-3.5 text-center whitespace-nowrap">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30 shadow-sm">
                  ⚖️ {{ Number(item.soKg).toLocaleString('vi-VN') }} kg
                </span>
              </td>

              <td class="px-4 py-3.5 text-right font-medium text-slate-300 whitespace-nowrap">
                {{ formatVND(item.donGia) }}<span class="text-[10px] text-emerald-400 font-bold">/kg</span>
              </td>

              <td class="px-4 py-3.5 text-right font-black text-amber-400 text-sm whitespace-nowrap">
                {{ formatVND(item.thanhTien) }}
              </td>

              <td class="px-4 py-3.5 text-slate-400 text-xs max-w-xs truncate">
                {{ item.notes || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL XEM LỊCH SỬ CÁC ĐƠN HÀNG CỦA SIZE NÀY -->
    <!-- ========================================================================= -->
    <div 
      v-if="showSizeOrdersModal && selectedSizeHistory" 
      class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150 overflow-y-auto"
    >
      <div 
        class="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 w-full max-w-3xl space-y-4 ring-1 ring-white/10 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Lịch Sử Đơn Bán Theo Size
              </span>
              <h2 class="text-base sm:text-lg font-bold text-white">
                {{ selectedSizeHistory.name }} ({{ selectedSizeHistory.displayRange }})
              </h2>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              Danh sách các đơn hàng đã bán size này (Kỳ: {{ periodDescriptionText }})
            </p>
          </div>
          <button 
            @click="showSizeOrdersModal = false" 
            class="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <!-- Thống kê tóm tắt nhanh -->
        <div class="grid grid-cols-2 gap-3 text-center bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div>
            <span class="text-[10px] text-slate-400 block">Tổng số đơn bán</span>
            <strong class="text-amber-400 text-sm font-black">{{ sizeOrdersList.length }} đơn</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">Tổng số con bán được</span>
            <strong class="text-emerald-400 text-sm font-black">{{ selectedSizeHistory.soldPigs }} con</strong>
          </div>
        </div>

        <!-- Danh sách chi tiết các đơn -->
        <div v-if="sizeOrdersList.length === 0" class="py-12 text-center text-slate-500 text-xs italic">
          Không có đơn hàng nào bán size này trong khoảng thời gian đã chọn.
        </div>

        <div v-else class="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          <div 
            v-for="(item, idx) in sizeOrdersList" 
            :key="item.id || idx" 
            class="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3.5 space-y-2 hover:border-slate-700 transition"
          >
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="font-black text-white">{{ item.code }}</span>
                <span class="text-[10px] text-slate-400">• {{ formatDate(item.date) }}</span>
                <span class="text-xs text-amber-300 font-bold">• Khách: {{ item.customerName }}</span>
              </div>
              <div class="text-right">
                <span class="font-black text-amber-400 text-sm">{{ formatVND(item.totalAmount) }}</span>
              </div>
            </div>

            <!-- Chi tiết số con & đơn giá -->
            <div class="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <span>Số lượng size này: <strong class="text-emerald-400 font-bold">{{ item.itemPigs }} con</strong></span>
              <span v-if="item.itemPrice" class="text-slate-400">Giá bán: <strong class="text-white">{{ formatVND(item.itemPrice) }}/con</strong></span>
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-end border-t border-slate-800">
          <button 
            type="button" 
            @click="showSizeOrdersModal = false" 
            class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer border border-slate-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL THÊM / SỬA CẤU HÌNH SIZE (KHOÁ SỬA KG KHI ĐÃ TẠO) -->
    <!-- ========================================================================= -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg ring-1 ring-white/10 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex items-center justify-between p-6 pb-4 border-b border-slate-800 sticky top-0 bg-slate-950 z-10">
          <div>
            <h2 class="text-base font-bold text-white">{{ editingItem ? 'Chỉnh Sửa Size' : 'Thêm Size Mới' }}</h2>
            <p class="text-[11px] text-slate-400 mt-0.5">
              {{ editingItem ? 'Đã khóa số kg để bảo toàn số liệu tồn kho & đơn hàng' : 'Cấu hình khoảng size mới cho sản phẩm' }}
            </p>
          </div>
          <button @click="showModal = false" class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition cursor-pointer text-xs">✕</button>
        </div>

        <form @submit.prevent="handleSave" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-white mb-1">Tên quy cách <span class="text-rose-500">*</span></label>
            <input type="text" required v-model="form.name" placeholder="VD: Heo Sữa, Heo Quay, Heo Lớn..." class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Mô tả (tùy chọn)</label>
            <input type="text" v-model="form.description" placeholder="Ghi chú thêm về loại size này..." class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 transition" />
          </div>

          <div>
            <label class="block text-xs font-bold text-white mb-2">Kiểu tính giá bán <span class="text-rose-500">*</span></label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                type="button" 
                @click="form.saleType = 'per_range'"
                :class="['p-3 rounded-2xl border-2 text-center transition cursor-pointer', form.saleType === 'per_range' ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700']"
              >
                <ArrowLeftRight class="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <div class="text-xs font-bold leading-tight">Theo Khoảng Size (kg)</div>
                <div class="text-[10px] text-slate-500 mt-0.5">VD: 3 - 3.9kg, 5 - 5.9kg</div>
              </button>
              
              <button 
                type="button" 
                @click="form.saleType = 'per_kg'"
                :class="['p-3 rounded-2xl border-2 text-center transition cursor-pointer', form.saleType === 'per_kg' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700']"
              >
                <Scale class="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <div class="text-xs font-bold leading-tight">Theo Cân Nặng (kg)</div>
                <div class="text-[10px] text-slate-500 mt-0.5">VD: 90.000đ/kg</div>
              </button>
            </div>
          </div>

          <!-- 1. CẤU HÌNH THEO KHOẢNG SIZE (1 KHOẢNG DUY NHẤT - KHÓA SỬA KG NẾU LÀ EDIT) -->
          <div v-if="form.saleType === 'per_range'" class="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div class="text-xs font-bold text-amber-400 flex items-center gap-2">
                <ArrowLeftRight class="w-3.5 h-3.5" />
                <span>Khoảng Cân Nặng (Khoảng Size)</span>
              </div>
              <span v-if="editingItem" class="text-[10px] text-rose-400 font-bold flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                🔒 Đã khóa số kg
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] text-slate-400 mb-1 font-bold">Từ (kg)</label>
                <input 
                  type="number" 
                  :disabled="!!editingItem"
                  v-model="form.minKg" 
                  min="0" 
                  step="0.1" 
                  placeholder="3.0" 
                  :class="[
                    'w-full border rounded-xl px-3 py-2 text-xs outline-none transition font-bold',
                    editingItem ? 'bg-slate-900/50 border-slate-800 text-slate-400 cursor-not-allowed' : 'bg-slate-900 border-slate-800 text-white focus:border-amber-500'
                  ]" 
                />
              </div>
              <div>
                <label class="block text-[10px] text-slate-400 mb-1 font-bold">Đến (kg)</label>
                <input 
                  type="number" 
                  :disabled="!!editingItem"
                  v-model="form.maxKg" 
                  min="0" 
                  step="0.1" 
                  placeholder="3.9" 
                  :class="[
                    'w-full border rounded-xl px-3 py-2 text-xs outline-none transition font-bold',
                    editingItem ? 'bg-slate-900/50 border-slate-800 text-slate-400 cursor-not-allowed' : 'bg-slate-900 border-slate-800 text-white focus:border-amber-500'
                  ]" 
                />
              </div>
            </div>
            
            <p v-if="editingItem" class="text-[10px] text-slate-500 italic">
              * Để tránh sai lệch dữ liệu kho và đơn hàng cũ, không thể sửa khoảng kg của size đã tồn tại. Nếu muốn đổi số kg hãy xóa và tạo size mới.
            </p>
            <p v-else class="text-[10px] text-slate-500">
              * Khoảng size này sẽ tự động xuất hiện khi nhập kho và tạo đơn bán hàng.
            </p>
          </div>

          <!-- 2. CẤU HÌNH THEO KG -->
          <div v-if="form.saleType === 'per_kg'" class="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
            <div class="text-xs font-bold text-emerald-400 flex items-center gap-2"><Scale class="w-3.5 h-3.5" /> Bán Theo Cân Nặng Thực Tế</div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Đơn giá / kg mặc định (đ) <span class="text-rose-500">*</span></label>
              <input type="number" required v-model="form.pricePerKg" min="0" step="1000" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 transition" />
            </div>
            <div v-if="form.pricePerKg" class="text-xs text-slate-400">
              → Ví dụ: Con <span class="text-white font-bold">20kg</span> × {{ formatVND(form.pricePerKg) }}/kg = <span class="text-emerald-400 font-bold">{{ formatVND(form.pricePerKg * 20) }}</span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" @click="showModal = false" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition cursor-pointer">Hủy</button>
            <button type="submit" :disabled="saving" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/20 transition active:scale-95 cursor-pointer disabled:opacity-60">
              {{ saving ? 'Đang lưu...' : (editingItem ? 'Cập Nhật' : 'Lưu Mới') }}
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
  Ruler, Plus, RefreshCw, Edit2, Trash2, ArrowLeftRight, Scale, 
  Search, LayoutGrid, Table, FileText, Package, RotateCcw 
} from 'lucide-vue-next';
import { formatVND, formatDate } from '../utils/formatters';
import { showConfirm, showToast } from '../utils/dialog';

const sizes = ref([]);
const orders = ref([]);
const loading = ref(true);

const viewMode = ref('cards'); // 'cards' | 'table'
const sizeTab = ref('ALL'); // 'ALL' | 'per_range' | 'per_kg'
const searchQuery = ref('');

// BỘ LỌC THỜI GIAN ĐỒNG BỘ DASHBOARD
const periodMode = ref('month'); // 'day' | 'month' | 'year' | 'ROLLING_2_YEARS' | 'ALL_TIME'

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

const showModal = ref(false);
const editingItem = ref(null);
const saving = ref(false);

// MODAL XEM CHI TIẾT CÁC ĐƠN HÀNG CỦA SIZE
const showSizeOrdersModal = ref(false);
const selectedSizeHistory = ref(null);

const defaultForm = () => ({
  name: 'Heo sữa',
  description: '',
  saleType: 'per_range',
  pricePerKg: 0,
  minKg: 3.0,
  maxKg: 3.9
});
const form = ref(defaultForm());

const currentYear = computed(() => new Date().getFullYear());

const currentMonthLabel = computed(() => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
});

const lastMonthLabel = computed(() => {
  const d = new Date();
  const lm = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  return `${String(lm.getMonth() + 1).padStart(2, '0')}/${lm.getFullYear()}`;
});

const handleResetFilters = () => {
  sizeTab.value = 'ALL';
  periodMode.value = 'month';
  searchQuery.value = '';
  const curr = new Date();
  selectedDay.value = curr.getDate();
  selectedMonth.value = curr.getMonth() + 1;
  selectedYear.value = curr.getFullYear();
  showToast('✅ Đã đặt lại bộ lọc về tháng hiện tại!', 'info');
};

const periodDescriptionText = computed(() => {
  if (periodMode.value === 'ROLLING_2_YEARS') {
    const curr = new Date();
    const ago = new Date(curr.getFullYear() - 2, curr.getMonth(), curr.getDate());
    return `2 năm luân phiên (${formatDate(ago.toISOString().slice(0, 10))} -> ${formatDate(curr.toISOString().slice(0, 10))})`;
  }
  return 'Toàn bộ thời gian';
});

// HÀM KIỂM TRA NGÀY CÓ THUỘC KỲ CHỌN HAY KHÔNG
const isDateInPeriod = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;

  if (periodMode.value === 'day') {
    const target = selectedDateStr.value;
    const orderDateStr = d.toISOString().slice(0, 10);
    return orderDateStr === target;
  }

  if (periodMode.value === 'month') {
    return (d.getMonth() + 1) === Number(selectedMonth.value) && d.getFullYear() === Number(selectedYear.value);
  }

  if (periodMode.value === 'year') {
    return d.getFullYear() === Number(selectedYear.value);
  }

  if (periodMode.value === 'ROLLING_2_YEARS') {
    const nowTime = new Date();
    const rollingStart = new Date(nowTime.getFullYear() - 2, nowTime.getMonth(), nowTime.getDate());
    return d >= rollingStart && d <= nowTime;
  }

  return true;
};

// HÀM EXTRACT KHOẢNG SIZE CHÍNH XÁC (VÍ DỤ: "3-3.9", "5-5.9")
const extractSizeRangeStrict = (str) => {
  if (!str) return '';
  const match = str.match(/(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)/);
  if (match) {
    const min = parseFloat(match[1].replace(',', '.'));
    const max = parseFloat(match[2].replace(',', '.'));
    return `${min}-${max}`;
  }
  return str.toLowerCase().trim();
};

// TỔNG HỢP SỐ LIỆU TỪNG SIZE KÈM XẾP HẠNG (CHÍNH XÁC 100%)
const sizesWithStats = computed(() => {
  const periodOrders = orders.value.filter(o => isDateInPeriod(o.ngayTao || o.orderDate || o.createdAt));

  let grandTotalPigs = 0;

  const statsList = sizes.value.map(s => {
    let displayRange = '';
    let targetRangeKey = '';

    if (s.saleType === 'per_range') {
      const min = s.minKg !== undefined ? s.minKg : (s.rangeTiers?.[0]?.minKg || 0);
      const max = s.maxKg !== undefined ? s.maxKg : (s.rangeTiers?.[0]?.maxKg || 0);
      displayRange = `${min} – ${max} kg`;
      targetRangeKey = `${min}-${max}`;
    } else if (s.saleType === 'per_kg') {
      displayRange = s.pricePerKg ? `${formatVND(s.pricePerKg)}/kg` : 'Bán theo kg';
      targetRangeKey = 'kg';
    } else {
      displayRange = s.name;
    }

    let soldPigs = 0;
    let revenue = 0;
    const matchingOrders = [];

    periodOrders.forEach(o => {
      let orderHadThisSize = false;
      let orderItemPigs = 0;
      let orderItemRevenue = 0;

      const items = o.chiTietDonHangs || o.items || [];
      if (Array.isArray(items) && items.length > 0) {
        items.forEach(it => {
          const itemRangeKey = extractSizeRangeStrict(it.loaiSize || it.sizeName || '');
          const isMatch = s.saleType === 'per_kg'
            ? (itemRangeKey.includes('kg') || (it.loaiSize && it.loaiSize.toLowerCase().includes('kg')))
            : (targetRangeKey && itemRangeKey === targetRangeKey);

          if (isMatch) {
            const q = Number(it.soLuong || it.quantity || 0) || 0;
            const amt = Number(it.thanhTien || it.totalAmount || 0) || 0;

            soldPigs += q;
            revenue += amt;

            orderHadThisSize = true;
            orderItemPigs += q;
            orderItemRevenue += amt;
          }
        });
      } else {
        const oRangeKey = extractSizeRangeStrict(o.loaiSize || '');
        const isMatch = s.saleType === 'per_kg'
          ? (oRangeKey.includes('kg') || (o.loaiSize && o.loaiSize.toLowerCase().includes('kg')))
          : (targetRangeKey && oRangeKey === targetRangeKey);

        if (isMatch) {
          const q = Number(o.soLuongCon || 0) || 0;
          const amt = Number(o.tongTien || 0) || 0;

          soldPigs += q;
          revenue += amt;

          orderHadThisSize = true;
          orderItemPigs += q;
          orderItemRevenue += amt;
        }
      }

      if (orderHadThisSize) {
        matchingOrders.push({
          id: o.id,
          code: o.maDonHang || ('DH-' + o.id),
          date: o.ngayTao || o.orderDate || o.createdAt,
          customerName: o.tenKhachHang || o.khachHang?.tenKhachHang || 'Khách vãng lai',
          totalAmount: Number(o.tongTien || 0),
          itemPigs: orderItemPigs,
          itemPrice: orderItemPigs > 0 ? (orderItemRevenue / orderItemPigs) : 0
        });
      }
    });

    grandTotalPigs += soldPigs;

    return {
      ...s,
      displayRange,
      soldPigs,
      revenue,
      orderCount: matchingOrders.length,
      orders: matchingOrders
    };
  });

  return statsList.map(s => ({
    ...s,
    sharePercent: grandTotalPigs > 0 ? Math.round((s.soldPigs / grandTotalPigs) * 100) : 0
  })).sort((a, b) => {
    if (b.soldPigs !== a.soldPigs) return b.soldPigs - a.soldPigs;
    return b.revenue - a.revenue;
  });
});

const filteredSizes = computed(() => {
  let list = sizesWithStats.value;
  if (sizeTab.value !== 'ALL') {
    list = list.filter(s => s.saleType === sizeTab.value);
  }
  if (!searchQuery.value.trim()) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(s => 
    s.name.toLowerCase().includes(q) || 
    s.displayRange.toLowerCase().includes(q)
  );
});

const topSize = computed(() => {
  return sizesWithStats.value.length > 0 && sizesWithStats.value[0].soldPigs > 0 
    ? sizesWithStats.value[0] 
    : null;
});

const periodTotalSummary = computed(() => {
  let totalPigs = 0;
  let totalRevenue = 0;

  sizesWithStats.value.forEach(s => {
    totalPigs += s.soldPigs;
    totalRevenue += s.revenue;
  });

  return { totalPigs, totalRevenue };
});

// XỬ LÝ XEM CHI TIẾT ĐƠN HÀNG CỦA SIZE
const handleViewSizeOrders = (sizeItem) => {
  selectedSizeHistory.value = sizeItem;
  showSizeOrdersModal.value = true;
};

const sizeOrdersList = computed(() => {
  return selectedSizeHistory.value?.orders || [];
});

// DANH SÁCH CHI TIẾT CÁC ĐƠN BÁN HEO THEO CÂN NẶNG (KG) TRONG KỲ
const kgSalesList = computed(() => {
  const periodOrders = orders.value.filter(o => isDateInPeriod(o.ngayTao || o.orderDate || o.createdAt || o.ngayDatHang));
  const list = [];

  periodOrders.forEach(o => {
    const items = o.chiTietDonHangs || o.items || o.danhSachChiTiet || [];
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((it, idx) => {
        const isKg = it.donViTinh === 'Kg' || it.unit === 'Kg' || it.saleType === 'per_kg' || 
                     (it.loaiSize && it.loaiSize.toLowerCase().includes('kg')) ||
                     (it.tenSanPham && it.tenSanPham.toLowerCase().includes('theo kg')) ||
                     (it.productName && it.productName.toLowerCase().includes('theo kg')) ||
                     Number(it.soKg || it.weightKg) > 0;
        
        if (isKg) {
          const soKg = Number(it.soKg || it.weightKg || it.soKgBan || 0);
          const donGia = Number(it.donGia || it.price || it.giaBan || 0);
          const soLuong = Number(it.soLuong || it.quantity || 1);
          const thanhTien = Number(it.thanhTien || it.totalAmount || (soKg > 0 ? soKg * donGia : soLuong * donGia));

          list.push({
            id: `${o.id || o.maDonHang}-${idx}`,
            orderId: o.id,
            orderCode: o.maDonHang || o.orderCode || (`DH-${o.id}`),
            date: o.ngayTao || o.orderDate || o.createdAt || o.ngayDatHang,
            customerName: o.tenKhachHang || o.customerName || o.khachHang?.tenKhachHang || 'Khách vãng lai',
            customerPhone: o.soDienThoaiKhach || o.customerPhone,
            productName: it.tenSanPham || it.productName || it.loaiSize || 'Heo bán theo kg',
            sizeName: it.loaiSize || it.sizeName || 'Bán theo kg',
            soCon: soLuong,
            soKg: soKg,
            donGia: donGia,
            thanhTien: thanhTien,
            notes: o.ghiChu || o.notes || ''
          });
        }
      });
    } else {
      const isKg = o.donViTinh === 'Kg' || o.unit === 'Kg' || 
                   (o.loaiSize && o.loaiSize.toLowerCase().includes('kg')) ||
                   (o.tenSanPham && o.tenSanPham.toLowerCase().includes('theo kg')) ||
                   Number(o.soKg) > 0;
      if (isKg) {
        const soKg = Number(o.soKg || o.weightKg || 0);
        const donGia = Number(o.donGia || o.giaBan || 0);
        const soLuong = Number(o.soLuongCon || o.quantity || 1);
        const thanhTien = Number(o.tongTien || o.totalAmount || (soKg > 0 ? soKg * donGia : soLuong * donGia));

        list.push({
          id: o.id,
          orderId: o.id,
          orderCode: o.maDonHang || o.orderCode || (`DH-${o.id}`),
          date: o.ngayTao || o.orderDate || o.createdAt || o.ngayDatHang,
          customerName: o.tenKhachHang || o.customerName || 'Khách vãng lai',
          customerPhone: o.soDienThoaiKhach || o.customerPhone,
          productName: o.tenSanPham || o.loaiSize || 'Heo bán theo kg',
          sizeName: o.loaiSize || 'Bán theo kg',
          soCon: soLuong,
          soKg: soKg,
          donGia: donGia,
          thanhTien: thanhTien,
          notes: o.ghiChu || o.notes || ''
        });
      }
    }
  });

  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// TỔNG KẾT NHANH BÁN THEO KG TRONG KỲ
const kgSalesStats = computed(() => {
  let totalHeads = 0;
  let totalKg = 0;
  let totalRevenue = 0;

  kgSalesList.value.forEach(item => {
    totalHeads += (item.soCon || 1);
    totalKg += (item.soKg || 0);
    totalRevenue += (item.thanhTien || 0);
  });

  return { totalHeads, totalKg, totalRevenue };
});

const STORAGE_KEY = 'pig_size_configs';

// FETCH DỮ LIỆU SIZES & ĐƠN HÀNG
const fetchData = async () => {
  loading.value = true;
  try {
    const [sizesRes, ordersRes] = await Promise.all([
      fetch('/api/sizes').catch(() => null),
      fetch('/api/orders').catch(() => null)
    ]);

    if (sizesRes && sizesRes.ok) {
      const data = await sizesRes.json();
      const rawList = Array.isArray(data) ? data : (data?.data || []);
      sizes.value = rawList.map(s => {
        const minKg = s.minKg !== undefined ? s.minKg : (s.rangeTiers?.[0]?.minKg ?? 3.0);
        const maxKg = s.maxKg !== undefined ? s.maxKg : (s.rangeTiers?.[0]?.maxKg ?? 3.9);
        return {
          ...s,
          minKg,
          maxKg
        };
      });
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      sizes.value = stored ? JSON.parse(stored) : [
        { id: 1, name: 'Heo sữa', saleType: 'per_range', minKg: 3.0, maxKg: 3.9 },
        { id: 2, name: 'Heo sữa', saleType: 'per_range', minKg: 5.0, maxKg: 5.9 }
      ];
    }

    if (ordersRes && ordersRes.ok) {
      const odata = await ordersRes.json();
      orders.value = Array.isArray(odata) ? odata : (odata?.data || []);
    }
  } catch (e) {
    console.error('Lỗi tải dữ liệu:', e);
  } finally {
    loading.value = false;
  }
};

const saveLocal = (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
onMounted(() => fetchData());

const handleOpenAdd = () => { 
  editingItem.value = null; 
  form.value = defaultForm(); 
  showModal.value = true; 
};

const handleEdit = (s) => {
  editingItem.value = s;
  form.value = {
    name: s.name, 
    description: s.description || '', 
    saleType: s.saleType || 'per_range',
    pricePerKg: s.pricePerKg || 0,
    minKg: s.minKg !== undefined ? s.minKg : (s.rangeTiers?.[0]?.minKg || 3.0),
    maxKg: s.maxKg !== undefined ? s.maxKg : (s.rangeTiers?.[0]?.maxKg || 3.9)
  };
  showModal.value = true;
};

const handleSave = async () => {
  if (!form.value.name.trim()) { 
    showToast('Vui lòng nhập đầy đủ tên quy cách size heo!', 'warning'); 
    return; 
  }
  saving.value = true;
  const min = Number(form.value.minKg) || 0;
  const max = Number(form.value.maxKg) || 0;

  const payload = {
    id: editingItem.value?.id || Date.now(),
    name: form.value.name.trim(), 
    description: form.value.description,
    saleType: form.value.saleType,
    pricePerKg: Number(form.value.pricePerKg) || 0,
    minKg: min,
    maxKg: max,
    rangeTiers: form.value.saleType === 'per_range'
      ? [{ minKg: min, maxKg: max, price: 0 }]
      : []
  };
  try {
    const url = editingItem.value ? `/api/sizes/${editingItem.value.id}` : '/api/sizes';
    const res = await fetch(url, { 
      method: editingItem.value ? 'PUT' : 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    }).catch(() => null);
    
    if (res && res.ok) { 
      await fetchData(); 
    } else {
      let list = [...sizes.value];
      if (editingItem.value) { 
        list = list.map(x => x.id === editingItem.value.id ? payload : x); 
      } else { 
        list.push(payload); 
      }
      sizes.value = list;
    }
    saveLocal(sizes.value);
    window.dispatchEvent(new CustomEvent('pig-sizes-updated'));
    showToast(editingItem.value ? 'Cập nhật cấu hình size thành công!' : 'Thêm mới cấu hình size thành công!', 'success');
    showModal.value = false;
  } catch (e) { 
    showToast('Lỗi lưu cấu hình size, vui lòng thử lại: ' + e.message, 'error'); 
  } finally { 
    saving.value = false; 
  }
};

const handleDelete = async (s) => {
  const confirmed = await showConfirm({
    title: 'Xóa Cấu Hình Size',
    message: `Bạn có chắc muốn xóa cấu hình "${s.name}"?`,
    confirmText: 'Xác Nhận Xóa', 
    cancelText: 'Hủy Bỏ', 
    type: 'danger'
  });
  if (!confirmed) return;
  try {
    const res = await fetch(`/api/sizes/${s.id}`, { method: 'DELETE' }).catch(() => null);
    if (res && res.ok) { 
      await fetchData(); 
    } else { 
      const list = sizes.value.filter(x => x.id !== s.id); 
      sizes.value = list; 
    }
    saveLocal(sizes.value);
    window.dispatchEvent(new CustomEvent('pig-sizes-updated'));
    showToast('Đã xóa cấu hình size thành công!', 'success');
  } catch (e) { 
    showToast('Lỗi khi xóa cấu hình size: ' + e.message, 'error'); 
  }
};
</script>