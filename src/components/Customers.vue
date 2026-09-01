<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

    <!-- HEADER & TỔNG QUAN -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20 ring-1 ring-white/20">
          <Users class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight">Nhà Cung Cấp & Khách Hàng</h1>
          <p class="text-slate-400 text-xs sm:text-sm mt-1">
            Xếp hạng nhà cung cấp nhập nhiều nhất, khách hàng VIP mua nhiều nhất, theo dõi doanh thu & tiền lời (Bộ lọc 2 năm luân phiên).
          </p>
        </div>
      </div>
      <div class="relative z-10 flex items-center gap-3">
        <button
          @click="handleOpenAdd"
          class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-rose-600/20 transition active:scale-95 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>{{ activeTab === 'suppliers' ? 'Thêm Nhà Cung Cấp' : 'Thêm Khách Hàng' }}</span>
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

    <!-- TABS CHUYỂN ĐỔI & BỘ LỌC THỜI GIAN ĐỒNG BỘ DASHBOARD -->
    <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
      <!-- Hàng 1: Tabs Switch (Trái) & Chế Độ Lọc Thời Gian (Phải) -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <!-- Tabs Switch -->
        <div class="flex items-center gap-2">
          <button 
            @click="activeTab = 'suppliers'" 
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer', 
              activeTab === 'suppliers' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            ]"
          >
            <Building2 class="w-4 h-4" />
            <span>Nhà Cung Cấp ({{ suppliersWithStats.length }})</span>
          </button>
          <button 
            @click="activeTab = 'customers'" 
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer', 
              activeTab === 'customers' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            ]"
          >
            <Users class="w-4 h-4" />
            <span>Khách Hàng VIP ({{ customersWithStats.length }})</span>
          </button>
        </div>

        <!-- Các Nút Chọn Chế Độ Thời Gian -->
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
            <span>📅 Đang lọc:</span>
            <strong class="text-amber-300">{{ periodDescriptionText }}</strong>
          </div>

          <!-- Nhãn Toàn Thời Gian -->
          <div v-if="periodMode === 'ALL_TIME'" class="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <span>📅 Đang lọc:</span>
            <strong class="text-emerald-400">Toàn bộ thời gian (Tất cả giao dịch)</strong>
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
              placeholder="Tìm theo tên, SĐT..." 
              class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="py-20 flex flex-col items-center justify-center space-y-3">
      <div class="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
      <p class="text-slate-400 text-sm">Đang tải và tổng hợp dữ liệu thống kê...</p>
    </div>

    <div v-else class="space-y-6">

      <!-- ========================================================================= -->
      <!-- 1. PHẦN NHÀ CUNG CẤP (SUPPLIERS) -->
      <!-- ========================================================================= -->
      <div v-if="activeTab === 'suppliers'" class="space-y-6">
        <!-- STATS BANNER: TOP NHÀ CUNG CẤP & TỔNG QUAN NHẬP HÀNG -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Card 1: Top 1 NCC Nhập Nhiều Nhất -->
          <div class="relative bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 p-5 rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between">
            <div class="absolute -right-4 -top-4 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>🏆</span>
                  <span>Nhà Cung Cấp Nhập Nhiều Nhất</span>
                </span>
                <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                  TOP 1
                </span>
              </div>
              <div v-if="topSupplier" class="space-y-1">
                <h3 class="text-xl font-black text-white leading-tight">
                  {{ topSupplier.name }}
                </h3>
                <p class="text-xs text-slate-400">
                  SĐT: <span class="text-slate-200 font-bold">{{ topSupplier.phone || 'Chưa cập nhật' }}</span>
                </p>
              </div>
              <div v-else class="text-xs text-slate-400 italic py-2">
                Chưa có dữ liệu nhập hàng trong kỳ này.
              </div>
            </div>

            <div v-if="topSupplier" class="pt-3 mt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
              <div class="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <span class="text-[10px] text-slate-400 block">Số lần nhập</span>
                <strong class="text-amber-400 text-sm font-black">{{ topSupplier.importCount }} lần</strong>
              </div>
              <div class="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <span class="text-[10px] text-slate-400 block">Số con nhập</span>
                <strong class="text-emerald-400 text-sm font-black">{{ topSupplier.totalPigs }} con</strong>
              </div>
              <div class="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <span class="text-[10px] text-slate-400 block">Tổng tiền</span>
                <strong class="text-white text-xs font-bold whitespace-nowrap">{{ formatVND(topSupplier.totalAmount) }}</strong>
              </div>
            </div>
          </div>

          <!-- Card 2: Tổng Số Lần & Con Heo Nhập Trong Kỳ -->
          <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Lượng Nhập Kỳ Này</span>
              <div class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                <Package class="w-4 h-4" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-0.5">
                <span class="text-[10px] text-slate-500 font-bold uppercase">Tổng phiếu nhập:</span>
                <div class="text-2xl font-black text-white tracking-tight">
                  {{ supplierPeriodSummary.totalBills }} <span class="text-xs text-slate-400 font-normal">lần</span>
                </div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[10px] text-slate-500 font-bold uppercase">Tổng số con heo:</span>
                <div class="text-2xl font-black text-emerald-400 tracking-tight">
                  {{ supplierPeriodSummary.totalPigs }} <span class="text-xs text-slate-400 font-normal">con</span>
                </div>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 italic pt-2 border-t border-slate-800">
              💡 Kỳ lọc: {{ periodDescriptionText }}
            </p>
          </div>

          <!-- Card 3: Tổng Giá Trị Nhập & Công Nợ Còn Nợ NCC -->
          <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tài Chính Nhập Hàng</span>
              <div class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400">
                <DollarSign class="w-4 h-4" />
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-baseline justify-between">
                <span class="text-xs text-slate-400">Tổng tiền hàng nhập:</span>
                <span class="text-lg font-black text-amber-400">{{ formatVND(supplierPeriodSummary.totalAmount) }}</span>
              </div>
              <div class="flex items-baseline justify-between pt-1 border-t border-slate-800">
                <span class="text-xs text-slate-400">Tổng nợ còn thiếu toàn bộ NCC:</span>
                <span class="text-base font-black text-rose-400">{{ formatVND(supplierPeriodSummary.totalDebt) }}</span>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 italic pt-1">
              Đồng bộ trực tiếp với số dư tài khoản ngân hàng NCC.
            </p>
          </div>
        </div>

        <!-- DANH SÁCH NHÀ CUNG CẤP (DẠNG THẺ XẾP HẠNG HOẶC BẢNG) -->
        <div v-if="filteredSuppliers.length === 0" class="py-16 text-center bg-slate-950/60 border border-slate-800 rounded-3xl">
          <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-900 flex items-center justify-center text-2xl">🏭</div>
          <h3 class="text-base font-bold text-white mb-1">Không tìm thấy nhà cung cấp nào</h3>
          <p class="text-slate-400 text-xs">Hãy thêm mới hoặc thay đổi bộ lọc tìm kiếm.</p>
        </div>

        <!-- 1.1 Dạng Thẻ Xếp Hạng (Card Grid) -->
        <div v-else-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div 
            v-for="(sup, idx) in filteredSuppliers" 
            :key="sup.id" 
            :class="[
              'relative bg-slate-900/90 border rounded-3xl p-5 shadow-xl space-y-4 transition-all group flex flex-col justify-between',
              idx === 0 ? 'border-amber-500/50 shadow-amber-950/20' : 'border-slate-800 hover:border-amber-500/40'
            ]"
          >
            <!-- Card Header: Rank & Info -->
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm border',
                    idx === 0 ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30' : 
                    (idx === 1 ? 'bg-slate-300 text-slate-950 border-white' : 
                    (idx === 2 ? 'bg-amber-700 text-amber-100 border-amber-600' : 'bg-slate-950 text-slate-400 border-slate-800'))
                  ]">
                    <span>#{{ idx + 1 }}</span>
                  </div>
                  <div>
                    <h3 class="font-black text-white text-sm sm:text-base leading-tight group-hover:text-amber-400 transition">
                      {{ sup.name }}
                    </h3>
                    <span class="text-[10px] font-mono text-slate-400">{{ sup.code || ('SUP-' + sup.id) }}</span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  <button @click="handleOpenEdit(sup, 'supplier')" class="p-1.5 rounded-xl bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer" title="Chỉnh sửa">
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button @click="handleDelete(sup, 'supplier')" class="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer" title="Xóa">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Thống kê nhập trong kỳ chọn -->
              <div class="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 space-y-2">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-slate-400">Số lần nhập (kỳ này):</span>
                  <strong class="text-amber-400 font-bold">{{ sup.importCount }} lần</strong>
                </div>
                <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                  <span class="text-slate-400">Số con heo đã nhập:</span>
                  <strong class="text-emerald-400 font-bold">{{ sup.totalPigs }} con</strong>
                </div>
                <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                  <span class="text-slate-400">Tổng tiền hàng:</span>
                  <strong class="text-white font-bold">{{ formatVND(sup.totalAmount) }}</strong>
                </div>
              </div>

              <!-- Liên hệ & Công nợ -->
              <div class="space-y-1.5 text-xs text-slate-300 pt-1">
                <div class="flex items-center gap-2">
                  <Phone class="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{{ sup.phone || 'Chưa có SĐT' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <MapPin class="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span class="line-clamp-1">{{ sup.address || 'Chưa có địa chỉ' }}</span>
                </div>
                
                <!-- Nợ còn thiếu của riêng NCC này -->
                <div class="flex items-center justify-between pt-1 text-[11px] border-t border-slate-800/80">
                  <span class="text-slate-400">Nợ còn thiếu NCC này:</span>
                  <span :class="['font-bold', sup.debt > 0 ? 'text-rose-400' : 'text-slate-400']">
                    {{ sup.debt > 0 ? formatVND(sup.debt) : '0 đ (Đã hết nợ)' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Nút Xem Lịch Sử Nhập Hàng -->
            <button
              @click="handleViewHistory(sup, 'supplier')"
              class="w-full mt-3 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <FileText class="w-3.5 h-3.5 text-amber-400" />
              <span>Xem Lịch Sử Nhập Hàng ({{ sup.importCount }} phiếu)</span>
            </button>
          </div>
        </div>

        <!-- 1.2 Dạng Bảng Chi Tiết (Data Table) -->
        <div v-else class="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th class="px-4 py-3.5">Hạng</th>
                  <th class="px-4 py-3.5">Nhà Cung Cấp</th>
                  <th class="px-4 py-3.5">Số Lần Nhập</th>
                  <th class="px-4 py-3.5">Số Con Nhập</th>
                  <th class="px-4 py-3.5">Tổng Tiền Hàng</th>
                  <th class="px-4 py-3.5">Công Nợ NCC Này</th>
                  <th class="px-4 py-3.5">Liên Hệ</th>
                  <th class="px-4 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/80">
                <tr v-for="(sup, idx) in filteredSuppliers" :key="sup.id" class="hover:bg-slate-800/50 transition">
                  <td class="px-4 py-3 font-bold">
                    <span :class="[
                      'px-2 py-0.5 rounded-lg text-[10px] font-black',
                      idx === 0 ? 'bg-amber-500 text-slate-950' : (idx === 1 ? 'bg-slate-300 text-slate-950' : (idx === 2 ? 'bg-amber-700 text-white' : 'text-slate-400'))
                    ]">
                      #{{ idx + 1 }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <strong class="text-white block font-bold">{{ sup.name }}</strong>
                    <span class="text-[10px] text-slate-500">{{ sup.code }}</span>
                  </td>
                  <td class="px-4 py-3 text-amber-400 font-bold">{{ sup.importCount }} lần</td>
                  <td class="px-4 py-3 text-emerald-400 font-bold">{{ sup.totalPigs }} con</td>
                  <td class="px-4 py-3 font-bold text-white">{{ formatVND(sup.totalAmount) }}</td>
                  <td class="px-4 py-3 text-rose-400 font-bold">{{ formatVND(sup.debt) }}</td>
                  <td class="px-4 py-3 text-[11px] text-slate-400">
                    <div>{{ sup.phone || '-' }}</div>
                    <div class="text-[10px] truncate max-w-xs">{{ sup.address || '-' }}</div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button @click="handleViewHistory(sup, 'supplier')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg font-bold text-[11px] mr-2 cursor-pointer">
                      Lịch Sử
                    </button>
                    <button @click="handleOpenEdit(sup, 'supplier')" class="p-1 text-slate-400 hover:text-white mr-1 cursor-pointer">
                      <Edit2 class="w-3.5 h-3.5 inline" />
                    </button>
                    <button @click="handleDelete(sup, 'supplier')" class="p-1 text-slate-400 hover:text-rose-400 cursor-pointer">
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
      <!-- 2. PHẦN KHÁCH HÀNG (CUSTOMERS - MUA NHIỀU NHẤT, DOANH THU & TIỀN LỜI) -->
      <!-- ========================================================================= -->
      <div v-else class="space-y-6">
        <!-- STATS BANNER: TOP KHÁCH HÀNG VIP & TỔNG TIỀN LỜI -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Card 1: Top 1 Khách Hàng Mua Nhiều Nhất -->
          <div class="relative bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950 border border-cyan-500/40 p-5 rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between">
            <div class="absolute -right-4 -top-4 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <span>👑</span>
                  <span>Khách Hàng Mua Nhiều Nhất</span>
                </span>
                <span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-500/30">
                  TOP 1 VIP
                </span>
              </div>
              <div v-if="topCustomer" class="space-y-1">
                <h3 class="text-xl font-black text-white leading-tight">
                  {{ topCustomer.name }}
                </h3>
                <p class="text-xs text-slate-400">
                  SĐT: <span class="text-slate-200 font-bold">{{ topCustomer.phone || 'Chưa cập nhật' }}</span>
                </p>
              </div>
              <div v-else class="text-xs text-slate-400 italic py-2">
                Chưa có dữ liệu bán hàng trong kỳ này.
              </div>
            </div>

            <div v-if="topCustomer" class="pt-3 mt-2 border-t border-slate-800/80 grid grid-cols-4 gap-1.5 text-center">
              <div class="bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
                <span class="text-[9px] text-slate-400 block">Số lần mua</span>
                <strong class="text-cyan-400 text-xs font-black">{{ topCustomer.orderCount }} đơn</strong>
              </div>
              <div class="bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
                <span class="text-[9px] text-slate-400 block">Số con mua</span>
                <strong class="text-emerald-400 text-xs font-black">{{ topCustomer.totalPigs }} con</strong>
              </div>
              <div class="bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
                <span class="text-[9px] text-slate-400 block">Tiền mua</span>
                <strong class="text-white text-[10px] font-bold block truncate">{{ formatVND(topCustomer.totalRevenue) }}</strong>
              </div>
              <div class="bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 bg-emerald-500/10 border-emerald-500/30">
                <span class="text-[9px] text-emerald-400 block font-bold">Tiền lời</span>
                <strong class="text-emerald-300 text-[10px] font-black block truncate">+{{ formatVND(topCustomer.totalProfit) }}</strong>
              </div>
            </div>
          </div>

          <!-- Card 2: Tổng Số Đơn & Số Con Heo Bán Ra -->
          <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Bán Hàng Kỳ Này</span>
              <div class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                <ShoppingCart class="w-4 h-4" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-0.5">
                <span class="text-[10px] text-slate-500 font-bold uppercase">Tổng số đơn hàng:</span>
                <div class="text-2xl font-black text-white tracking-tight">
                  {{ customerPeriodSummary.totalOrders }} <span class="text-xs text-slate-400 font-normal">đơn</span>
                </div>
              </div>
              <div class="space-y-0.5">
                <span class="text-[10px] text-slate-500 font-bold uppercase">Tổng heo khách mua:</span>
                <div class="text-2xl font-black text-emerald-400 tracking-tight">
                  {{ customerPeriodSummary.totalPigs }} <span class="text-xs text-slate-400 font-normal">con</span>
                </div>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 italic pt-2 border-t border-slate-800">
              💡 Kỳ lọc: {{ periodDescriptionText }}
            </p>
          </div>

          <!-- Card 3: Tổng Doanh Thu & Tổng Tiền Lời Thu Được -->
          <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hiệu Quả Lợi Nhuận Khách Hàng</span>
              <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp class="w-4 h-4" />
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-baseline justify-between">
                <span class="text-xs text-slate-400">Tổng tiền bán (Doanh thu):</span>
                <span class="text-lg font-black text-white">{{ formatVND(customerPeriodSummary.totalRevenue) }}</span>
              </div>
              <div class="flex items-baseline justify-between pt-1 border-t border-slate-800">
                <span class="text-xs font-bold text-emerald-400">Tổng Tiền Lời Thu Được:</span>
                <span class="text-lg font-black text-emerald-400">+{{ formatVND(customerPeriodSummary.totalProfit) }}</span>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 italic pt-1">
              Được tính toán chính xác sau khi trừ vốn heo và chi phí xe.
            </p>
          </div>
        </div>

        <!-- DANH SÁCH KHÁCH HÀNG (DẠNG THẺ XẾP HẠNG HOẶC BẢNG) -->
        <div v-if="filteredCustomers.length === 0" class="py-16 text-center bg-slate-950/60 border border-slate-800 rounded-3xl">
          <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-900 flex items-center justify-center text-2xl">👥</div>
          <h3 class="text-base font-bold text-white mb-1">Không tìm thấy khách hàng nào</h3>
          <p class="text-slate-400 text-xs">Khách hàng sẽ tự động thêm khi tạo đơn hàng, hoặc thêm thủ công.</p>
        </div>

        <!-- 2.1 Dạng Thẻ Xếp Hạng (Card Grid) -->
        <div v-else-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div 
            v-for="(cust, idx) in filteredCustomers" 
            :key="cust.id" 
            :class="[
              'relative bg-slate-900/90 border rounded-3xl p-5 shadow-xl space-y-4 transition-all group flex flex-col justify-between',
              idx === 0 ? 'border-cyan-500/50 shadow-cyan-950/20' : 'border-slate-800 hover:border-cyan-500/40'
            ]"
          >
            <!-- Card Header: Rank & Info -->
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm border',
                    idx === 0 ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/30' : 
                    (idx === 1 ? 'bg-slate-300 text-slate-950 border-white' : 
                    (idx === 2 ? 'bg-amber-700 text-amber-100 border-amber-600' : 'bg-slate-950 text-slate-400 border-slate-800'))
                  ]">
                    <span>#{{ idx + 1 }}</span>
                  </div>
                  <div>
                    <h3 class="font-black text-white text-sm sm:text-base leading-tight group-hover:text-cyan-400 transition">
                      {{ cust.name }}
                    </h3>
                    <span class="text-[10px] font-mono text-slate-400">{{ cust.code || ('KH-' + cust.id) }}</span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  <button @click="handleOpenEdit(cust, 'customer')" class="p-1.5 rounded-xl bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer" title="Chỉnh sửa">
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button @click="handleDelete(cust, 'customer')" class="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer" title="Xóa">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Thống kê mua hàng trong kỳ chọn -->
              <div class="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-slate-400">Số lần mua hàng:</span>
                  <strong class="text-cyan-400 font-bold">{{ cust.orderCount }} đơn</strong>
                </div>
                <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                  <span class="text-slate-400">Số con heo đã mua:</span>
                  <strong class="text-emerald-400 font-bold">{{ cust.totalPigs }} con</strong>
                </div>
                <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                  <span class="text-slate-400">Tổng tiền heo đã mua:</span>
                  <strong class="text-white font-bold">{{ formatVND(cust.totalRevenue) }}</strong>
                </div>
                <div class="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/80 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                  <span class="text-emerald-400 font-bold">Tổng Tiền Lời:</span>
                  <strong class="text-emerald-300 font-black text-xs">+{{ formatVND(cust.totalProfit) }}</strong>
                </div>
              </div>

              <!-- Liên hệ & Công nợ -->
              <div class="space-y-1 text-xs text-slate-300 pt-1">
                <div class="flex items-center gap-2">
                  <Phone class="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{{ cust.phone || 'Chưa có SĐT' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <MapPin class="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span class="line-clamp-1">{{ cust.address || 'Chưa có địa chỉ' }}</span>
                </div>
                <div v-if="cust.debt > 0" class="flex items-center justify-between pt-1 text-[11px] border-t border-slate-800/80">
                  <span class="text-slate-400">Khách còn nợ:</span>
                  <span class="font-bold text-rose-400">{{ formatVND(cust.debt) }}</span>
                </div>
              </div>
            </div>

            <!-- Nút Xem Lịch Sử Mua Hàng -->
            <button
              @click="handleViewHistory(cust, 'customer')"
              class="w-full mt-3 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <FileText class="w-3.5 h-3.5 text-cyan-400" />
              <span>Xem Lịch Sử Mua Hàng ({{ cust.orderCount }} đơn)</span>
            </button>
          </div>
        </div>

        <!-- 2.2 Dạng Bảng Chi Tiết (Data Table) -->
        <div v-else class="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th class="px-4 py-3.5">Hạng</th>
                  <th class="px-4 py-3.5">Khách Hàng</th>
                  <th class="px-4 py-3.5">Số Lần Mua</th>
                  <th class="px-4 py-3.5">Số Con Mua</th>
                  <th class="px-4 py-3.5">Tổng Tiền Heo (Doanh Thu)</th>
                  <th class="px-4 py-3.5">Tổng Tiền Lời</th>
                  <th class="px-4 py-3.5">Công Nợ</th>
                  <th class="px-4 py-3.5">Liên Hệ</th>
                  <th class="px-4 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/80">
                <tr v-for="(cust, idx) in filteredCustomers" :key="cust.id" class="hover:bg-slate-800/50 transition">
                  <td class="px-4 py-3 font-bold">
                    <span :class="[
                      'px-2 py-0.5 rounded-lg text-[10px] font-black',
                      idx === 0 ? 'bg-cyan-500 text-slate-950' : (idx === 1 ? 'bg-slate-300 text-slate-950' : (idx === 2 ? 'bg-amber-700 text-white' : 'text-slate-400'))
                    ]">
                      #{{ idx + 1 }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <strong class="text-white block font-bold">{{ cust.name }}</strong>
                    <span class="text-[10px] text-slate-500">{{ cust.code }}</span>
                  </td>
                  <td class="px-4 py-3 text-cyan-400 font-bold">{{ cust.orderCount }} đơn</td>
                  <td class="px-4 py-3 text-emerald-400 font-bold">{{ cust.totalPigs }} con</td>
                  <td class="px-4 py-3 font-bold text-white">{{ formatVND(cust.totalRevenue) }}</td>
                  <td class="px-4 py-3 text-emerald-400 font-black">+{{ formatVND(cust.totalProfit) }}</td>
                  <td class="px-4 py-3 text-rose-400 font-bold">{{ formatVND(cust.debt) }}</td>
                  <td class="px-4 py-3 text-[11px] text-slate-400">
                    <div>{{ cust.phone || '-' }}</div>
                    <div class="text-[10px] truncate max-w-xs">{{ cust.address || '-' }}</div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button @click="handleViewHistory(cust, 'customer')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg font-bold text-[11px] mr-2 cursor-pointer">
                      Lịch Sử
                    </button>
                    <button @click="handleOpenEdit(cust, 'customer')" class="p-1 text-slate-400 hover:text-white mr-1 cursor-pointer">
                      <Edit2 class="w-3.5 h-3.5 inline" />
                    </button>
                    <button @click="handleDelete(cust, 'customer')" class="p-1 text-slate-400 hover:text-rose-400 cursor-pointer">
                      <Trash2 class="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- ========================================================================= -->
    <!-- MODAL XEM LỊCH SỬ NHẬP HÀNG / MUA HÀNG CHI TIẾT (LƯU TRỮ 2 NĂM) -->
    <!-- ========================================================================= -->
    <div 
      v-if="showHistoryModal && selectedHistoryItem" 
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
                {{ historyType === 'supplier' ? 'Lịch Sử Nhập Hàng NCC' : 'Lịch Sử Mua Hàng Khách Hàng' }}
              </span>
              <h2 class="text-base sm:text-lg font-bold text-white">
                {{ selectedHistoryItem.name }}
              </h2>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              {{ historyType === 'supplier' ? 'Danh sách toàn bộ các phiếu nhập kho đã thực hiện' : 'Danh sách toàn bộ các đơn hàng đã mua và lợi nhuận mang lại' }} (Kỳ: {{ periodDescriptionText }})
            </p>
          </div>
          <button 
            @click="showHistoryModal = false" 
            class="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <!-- Thống kê tóm tắt nhanh -->
        <div class="grid grid-cols-3 gap-3 text-center bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div>
            <span class="text-[10px] text-slate-400 block">{{ historyType === 'supplier' ? 'Tổng số phiếu' : 'Tổng số đơn' }}</span>
            <strong class="text-amber-400 text-sm font-black">{{ historyList.length }} {{ historyType === 'supplier' ? 'phiếu' : 'đơn' }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">Tổng số con</span>
            <strong class="text-emerald-400 text-sm font-black">{{ historySummary.pigs }} con</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">{{ historyType === 'supplier' ? 'Tổng tiền nhập' : 'Tổng tiền lời' }}</span>
            <strong :class="historyType === 'supplier' ? 'text-white text-sm font-black' : 'text-emerald-400 text-sm font-black'">
              {{ historyType === 'supplier' ? formatVND(historySummary.amount) : ('+' + formatVND(historySummary.profit)) }}
            </strong>
          </div>
        </div>

        <!-- Danh sách chi tiết các phiếu / đơn -->
        <div v-if="historyList.length === 0" class="py-12 text-center text-slate-500 text-xs italic">
          Không có giao dịch nào trong khoảng thời gian này.
        </div>

        <div v-else class="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          <div 
            v-for="(item, idx) in historyList" 
            :key="item.id || idx" 
            class="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3.5 space-y-2 hover:border-slate-700 transition"
          >
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="font-black text-white">{{ item.code }}</span>
                <span class="text-[10px] text-slate-400">• {{ formatDate(item.date) }}</span>
              </div>
              <div class="text-right">
                <span class="font-black text-amber-400 text-sm">{{ formatVND(item.totalAmount) }}</span>
              </div>
            </div>

            <!-- Chi tiết các loại heo / con -->
            <div class="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div class="space-x-2">
                <span>Số lượng: <strong class="text-emerald-400">{{ item.pigs }} con</strong></span>
                <span v-if="item.details" class="text-slate-400">({{ item.details }})</span>
              </div>
              <div v-if="historyType === 'customer'" class="text-right">
                <span class="text-slate-400">Tiền lời đơn: </span>
                <strong class="text-emerald-400">+{{ formatVND(item.profit) }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-end border-t border-slate-800">
          <button 
            type="button" 
            @click="showHistoryModal = false" 
            class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer border border-slate-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL THÊM / SỬA NHÀ CUNG CẤP & KHÁCH HÀNG -->
    <!-- ========================================================================= -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 w-full max-w-md ring-1 ring-white/10" @click.stop>
        <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white">
              {{ editingItem ? (modalType === 'supplier' ? 'Sửa Nhà Cung Cấp' : 'Sửa Khách Hàng') : (modalType === 'supplier' ? 'Thêm Nhà Cung Cấp Mới' : 'Thêm Khách Hàng Mới') }}
            </h2>
            <p class="text-[11px] text-slate-400 mt-0.5">Nhập thông tin liên lạc bên dưới</p>
          </div>
          <button @click="showModal = false" class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition cursor-pointer text-xs">✕</button>
        </div>
        <form @submit.prevent="handleSave" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-white mb-1">{{ modalType === 'supplier' ? 'Tên nhà cung cấp' : 'Tên khách hàng' }} <span class="text-rose-500">*</span></label>
            <input type="text" required v-model="form.name" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Số điện thoại</label>
            <input type="text" v-model="form.phone" placeholder="VD: 0901.234.567" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Địa chỉ</label>
            <input type="text" v-model="form.address" placeholder="VD: Hà Nội, TP.HCM..." class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition" />
          </div>
          <div v-if="modalType === 'supplier'">
            <label class="block text-xs font-bold text-slate-300 mb-1">Người liên hệ</label>
            <input type="text" v-model="form.contactPerson" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Ghi chú</label>
            <textarea rows="2" v-model="form.note" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition resize-none"></textarea>
          </div>
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" @click="showModal = false" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition cursor-pointer">Hủy</button>
            <button type="submit" :disabled="saving" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition active:scale-95 cursor-pointer disabled:opacity-60">
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
  Users, Building2, Phone, MapPin, RefreshCw, Plus, Edit2, Trash2, 
  Search, Calendar, LayoutGrid, Table, FileText, Package, DollarSign, 
  ShoppingCart, TrendingUp, RotateCcw 
} from 'lucide-vue-next';
import { formatVND, formatDate } from '../utils/formatters';
import { showConfirm, showToast } from '../utils/dialog';

const activeTab = ref('suppliers');
const viewMode = ref('cards'); // 'cards' | 'table'
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

const suppliers = ref([]);
const customers = ref([]);
const purchases = ref([]);
const orders = ref([]);
const bankAccounts = ref([]);
const loading = ref(false);

const showModal = ref(false);
const modalType = ref('supplier');
const editingItem = ref(null);
const saving = ref(false);
const form = ref({ name: '', phone: '', address: '', contactPerson: '', note: '' });

// HISTORY MODAL STATE
const showHistoryModal = ref(false);
const historyType = ref('supplier'); // 'supplier' | 'customer'
const selectedHistoryItem = ref(null);

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
    const dateOnlyStr = d.toISOString().slice(0, 10);
    return dateOnlyStr === target;
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

// HÀM LẤY SỐ DƯ NỢ NCC CHUẨN XÁC ĐỒNG BỘ 100% VỚI MODULE NGÂN HÀNG
const getSupplierActualDebt = (sup) => {
  const supId = sup.id;
  const supName = (sup.tenNhaCungCap || sup.name || '').trim().toLowerCase();

  // Tìm STK ngân hàng NCC liên kết
  const acc = bankAccounts.value.find(a => {
    const isNCC = (a.loaiTaiKhoan || a.accountType || 'NCC') === 'NCC';
    if (!isNCC) return false;
    const matchId = (a.nhaCungCapId || a.supplierId) === supId;
    const holder = (a.accountHolder || a.chuTaiKhoan || '').trim().toLowerCase();
    const matchName = holder === supName || holder.includes(supName) || supName.includes(holder);
    return matchId || matchName;
  });

  if (acc) {
    const bal = Number(acc.soDuHienTai !== undefined && acc.soDuHienTai !== null ? acc.soDuHienTai : (acc.balance || 0));
    if (bal < 0) return Math.abs(bal);
    if (bal > 0) return 0; // Đang dư tiền cọc
  }

  return Number(sup.congNoPhaiTra || sup.debt || 0) || 0;
};

// TỔNG HỢP SỐ LIỆU NHÀ CUNG CẤP KÈM XẾP HẠNG
const suppliersWithStats = computed(() => {
  return suppliers.value.map(sup => {
    const supId = sup.id;
    const supName = (sup.tenNhaCungCap || sup.name || '').trim().toLowerCase();

    // Lọc các phiếu nhập của NCC này
    const supPurchases = purchases.value.filter(p => {
      const matchId = (p.nhaCungCap?.id || p.supplier?.id || p.nhaCungCapId) === supId;
      const matchName = (p.nhaCungCap?.tenNhaCungCap || p.supplier?.tenNhaCungCap || '').trim().toLowerCase() === supName;
      const isMatch = matchId || (supName && matchName);
      return isMatch && isDateInPeriod(p.ngayNhapKho || p.ngayTao || p.importDate);
    });

    let importCount = supPurchases.length;
    let totalPigs = 0;
    let totalAmount = 0;

    supPurchases.forEach(p => {
      totalAmount += Number(p.tienHangHeo || p.tongTienNhap || 0) || 0;

      // Đếm số con từ chi tiết phiếu nhập
      const items = p.chiTietPhieuNhaps || p.items || p.chiTiets || [];
      if (Array.isArray(items) && items.length > 0) {
        items.forEach(it => {
          totalPigs += Number(it.soLuongCon || it.quantity || 0) || 0;
        });
      } else if (p.soLuongCon) {
        totalPigs += Number(p.soLuongCon) || 0;
      }
    });

    const actualDebt = getSupplierActualDebt(sup);

    return {
      id: sup.id,
      name: sup.tenNhaCungCap || sup.name,
      code: sup.maNhaCungCap || ('SUP-' + sup.id),
      phone: sup.soDienThoai || sup.phone || '',
      address: sup.diaChi || sup.address || '',
      contactPerson: sup.nguoiLienHe || sup.contactPerson || '',
      note: sup.ghiChu || sup.note || '',
      debt: actualDebt,
      importCount,
      totalPigs,
      totalAmount,
      purchases: supPurchases
    };
  }).sort((a, b) => {
    // Sắp xếp ưu tiên: Số lần nhập > Số con nhập > Tổng tiền
    if (b.importCount !== a.importCount) return b.importCount - a.importCount;
    if (b.totalPigs !== a.totalPigs) return b.totalPigs - a.totalPigs;
    return b.totalAmount - a.totalAmount;
  });
});

const filteredSuppliers = computed(() => {
  if (!searchQuery.value.trim()) return suppliersWithStats.value;
  const q = searchQuery.value.toLowerCase();
  return suppliersWithStats.value.filter(s => 
    s.name.toLowerCase().includes(q) || 
    s.phone.includes(q) || 
    s.code.toLowerCase().includes(q)
  );
});

const topSupplier = computed(() => {
  return suppliersWithStats.value.length > 0 && suppliersWithStats.value[0].importCount > 0 
    ? suppliersWithStats.value[0] 
    : null;
});

const supplierPeriodSummary = computed(() => {
  let totalBills = 0;
  let totalPigs = 0;
  let totalAmount = 0;
  let totalDebt = 0;

  suppliersWithStats.value.forEach(s => {
    totalBills += s.importCount;
    totalPigs += s.totalPigs;
    totalAmount += s.totalAmount;
    totalDebt += s.debt;
  });

  return { totalBills, totalPigs, totalAmount, totalDebt };
});

// TỔNG HỢP SỐ LIỆU KHÁCH HÀNG KÈM XẾP HẠNG
const customersWithStats = computed(() => {
  return customers.value.map(cust => {
    const custId = cust.id;
    const custName = (cust.tenKhachHang || cust.name || '').trim().toLowerCase();
    const custPhone = (cust.soDienThoai || cust.phone || '').trim();

    // Lọc các đơn hàng của khách hàng này
    const custOrders = orders.value.filter(o => {
      const matchId = (o.khachHang?.id || o.customer?.id || o.khachHangId) === custId;
      const matchName = (o.tenKhachHang || o.khachHang?.tenKhachHang || '').trim().toLowerCase() === custName;
      const matchPhone = custPhone && (o.soDienThoai || o.khachHang?.soDienThoai || '').trim() === custPhone;
      const isMatch = matchId || (custName && matchName) || matchPhone;
      return isMatch && isDateInPeriod(o.ngayTao || o.orderDate || o.createdAt);
    });

    let orderCount = custOrders.length;
    let totalPigs = 0;
    let totalRevenue = 0;
    let totalProfit = 0;

    custOrders.forEach(o => {
      totalRevenue += Number(o.tongTien || o.totalAmount || 0) || 0;
      totalProfit += Number(o.tongTienLoi || o.profit || 0) || 0;

      // Đếm số con từ chi tiết đơn hàng
      const items = o.chiTietDonHangs || o.items || [];
      if (Array.isArray(items) && items.length > 0) {
        items.forEach(it => {
          totalPigs += Number(it.soLuong || it.quantity || 0) || 0;
        });
      } else if (o.soLuongCon) {
        totalPigs += Number(o.soLuongCon) || 0;
      }
    });

    return {
      id: cust.id,
      name: cust.tenKhachHang || cust.name,
      code: cust.maKhachHang || ('KH-' + cust.id),
      phone: cust.soDienThoai || cust.phone || '',
      address: cust.diaChi || cust.address || '',
      note: cust.ghiChu || cust.note || '',
      debt: Number(cust.congNoHienTai || cust.debt || 0) || 0,
      orderCount,
      totalPigs,
      totalRevenue,
      totalProfit,
      orders: custOrders
    };
  }).sort((a, b) => {
    // Sắp xếp ưu tiên: Số lần mua > Số con mua > Tổng tiền lời > Doanh thu
    if (b.orderCount !== a.orderCount) return b.orderCount - a.orderCount;
    if (b.totalPigs !== a.totalPigs) return b.totalPigs - a.totalPigs;
    if (b.totalProfit !== a.totalProfit) return b.totalProfit - a.totalProfit;
    return b.totalRevenue - a.totalRevenue;
  });
});

const filteredCustomers = computed(() => {
  if (!searchQuery.value.trim()) return customersWithStats.value;
  const q = searchQuery.value.toLowerCase();
  return customersWithStats.value.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.phone.includes(q) || 
    c.code.toLowerCase().includes(q)
  );
});

const topCustomer = computed(() => {
  return customersWithStats.value.length > 0 && customersWithStats.value[0].orderCount > 0 
    ? customersWithStats.value[0] 
    : null;
});

const customerPeriodSummary = computed(() => {
  let totalOrders = 0;
  let totalPigs = 0;
  let totalRevenue = 0;
  let totalProfit = 0;

  customersWithStats.value.forEach(c => {
    totalOrders += c.orderCount;
    totalPigs += c.totalPigs;
    totalRevenue += c.totalRevenue;
    totalProfit += c.totalProfit;
  });

  return { totalOrders, totalPigs, totalRevenue, totalProfit };
});

// XỬ LÝ XEM LỊCH SỬ CHI TIẾT
const handleViewHistory = (item, type) => {
  selectedHistoryItem.value = item;
  historyType.value = type;
  showHistoryModal.value = true;
};

const historyList = computed(() => {
  if (!selectedHistoryItem.value) return [];
  if (historyType.value === 'supplier') {
    return (selectedHistoryItem.value.purchases || []).map(p => {
      let pigs = 0;
      const items = p.chiTietPhieuNhaps || p.items || [];
      const detailsArr = [];
      if (Array.isArray(items) && items.length > 0) {
        items.forEach(it => {
          const qty = Number(it.soLuongCon || it.quantity || 0) || 0;
          pigs += qty;
          if (it.loaiSize) detailsArr.push(`${it.loaiSize}: ${qty}c`);
        });
      } else if (p.soLuongCon) {
        pigs = Number(p.soLuongCon) || 0;
      }
      return {
        id: p.id,
        code: p.maPhieuNhap || ('PNK-' + p.id),
        date: p.ngayNhapKho || p.ngayTao || p.importDate,
        totalAmount: Number(p.tienHangHeo || p.tongTienNhap || 0) || 0,
        pigs,
        details: detailsArr.join(', ')
      };
    });
  } else {
    return (selectedHistoryItem.value.orders || []).map(o => {
      let pigs = 0;
      const items = o.chiTietDonHangs || o.items || [];
      const detailsArr = [];
      if (Array.isArray(items) && items.length > 0) {
        items.forEach(it => {
          const qty = Number(it.soLuong || it.quantity || 0) || 0;
          pigs += qty;
          if (it.loaiSize) detailsArr.push(`${it.loaiSize}: ${qty}c`);
        });
      } else if (o.soLuongCon) {
        pigs = Number(o.soLuongCon) || 0;
      }
      return {
        id: o.id,
        code: o.maDonHang || ('DH-' + o.id),
        date: o.ngayTao || o.orderDate || o.createdAt,
        totalAmount: Number(o.tongTien || o.totalAmount || 0) || 0,
        profit: Number(o.tongTienLoi || o.profit || 0) || 0,
        pigs,
        details: detailsArr.join(', ')
      };
    });
  }
});

const historySummary = computed(() => {
  let pigs = 0;
  let amount = 0;
  let profit = 0;
  historyList.value.forEach(it => {
    pigs += it.pigs;
    amount += it.totalAmount;
    if (it.profit) profit += it.profit;
  });
  return { pigs, amount, profit };
});

// FETCH DỮ LIỆU TOÀN DIỆN (NCC, KHÁCH HÀNG, PHIẾU NHẬP, ĐƠN HÀNG, TÀI KHOẢN NGÂN HÀNG)
const fetchData = async (isSilent = false) => {
  try {
    if (!isSilent && suppliers.value.length === 0 && customers.value.length === 0) {
      loading.value = true;
    }
    const [supRes, custRes, purchRes, ordRes, bankRes] = await Promise.all([
      fetch('/api/suppliers').catch(() => null),
      fetch('/api/customers').catch(() => null),
      fetch('/api/purchases').catch(() => null),
      fetch('/api/orders').catch(() => null),
      fetch('/api/bank-accounts').catch(() => null)
    ]);

    const sups = supRes && supRes.ok ? await supRes.json() : [];
    const custs = custRes && custRes.ok ? await custRes.json() : [];
    const purchs = purchRes && purchRes.ok ? await purchRes.json() : [];
    const ords = ordRes && ordRes.ok ? await ordRes.json() : [];
    const banks = bankRes && bankRes.ok ? await bankRes.json() : [];

    suppliers.value = Array.isArray(sups) ? sups : (sups?.data && Array.isArray(sups.data) ? sups.data : []);
    customers.value = Array.isArray(custs) ? custs : (custs?.data && Array.isArray(custs.data) ? custs.data : []);
    purchases.value = Array.isArray(purchs) ? purchs : (purchs?.data && Array.isArray(purchs.data) ? purchs.data : []);
    orders.value = Array.isArray(ords) ? ords : (ords?.data && Array.isArray(ords.data) ? ords.data : []);
    bankAccounts.value = Array.isArray(banks) ? banks : (banks?.data && Array.isArray(banks.data) ? banks.data : []);
  } catch (e) {
    console.error('Lỗi tải dữ liệu:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchData());

const handleOpenAdd = () => {
  editingItem.value = null;
  modalType.value = activeTab.value === 'suppliers' ? 'supplier' : 'customer';
  form.value = { name: '', phone: '', address: '', contactPerson: '', note: '' };
  showModal.value = true;
};

const handleOpenEdit = (item, type) => {
  editingItem.value = item;
  modalType.value = type;
  form.value = {
    name: item.name || '',
    phone: item.phone || '',
    address: item.address || '',
    contactPerson: item.contactPerson || '',
    note: item.note || ''
  };
  showModal.value = true;
};

const handleSave = async () => {
  const isSupplier = modalType.value === 'supplier';
  if (!form.value.name.trim()) {
    showToast(isSupplier ? 'Vui lòng nhập tên Nhà Cung Cấp!' : 'Vui lòng nhập họ tên Khách Hàng!', 'warning');
    return;
  }
  saving.value = true;
  const endpoint = isSupplier ? '/api/suppliers' : '/api/customers';
  const payload = isSupplier
    ? { 
        tenNhaCungCap: form.value.name, 
        soDienThoai: form.value.phone, 
        diaChi: form.value.address, 
        nguoiLienHe: form.value.contactPerson, 
        ghiChu: form.value.note, 
        maNhaCungCap: editingItem.value?.code || ('SUP-' + Date.now().toString().slice(-4)) 
      }
    : { 
        tenKhachHang: form.value.name, 
        soDienThoai: form.value.phone, 
        diaChi: form.value.address, 
        ghiChu: form.value.note,
        maKhachHang: editingItem.value?.code || ('KH-' + Date.now().toString().slice(-4))
      };
  try {
    const url = editingItem.value ? (endpoint + '/' + editingItem.value.id) : endpoint;
    const method = editingItem.value ? 'PUT' : 'POST';
    const res = await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    });
    if (res.ok) {
      showToast(editingItem.value ? 'Cập nhật thông tin thành công!' : 'Đã thêm mới thành công!', 'success');
      showModal.value = false;
      fetchData();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast('Lỗi lưu thông tin: ' + (err.message || 'Không thể lưu'), 'error');
    }
  } catch (e) {
    showToast('Lỗi kết nối máy chủ, vui lòng thử lại: ' + e.message, 'error');
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (item, type) => {
  const isSupplier = type === 'supplier';
  const name = item.name;
  const confirmed = await showConfirm({
    title: 'Xác Nhận Xóa ' + (isSupplier ? 'Nhà Cung Cấp' : 'Khách Hàng'),
    message: 'Bạn có chắc chắn muốn xóa "' + name + '"? Mọi liên kết sẽ được dọn dẹp sạch sẽ.',
    confirmText: 'Xác Nhận Xóa',
    cancelText: 'Hủy Bỏ',
    type: 'danger'
  });
  if (!confirmed) return;
  const endpoint = isSupplier ? '/api/suppliers' : '/api/customers';
  try {
    const res = await fetch(endpoint + '/' + item.id, { method: 'DELETE' });
    if (res.ok) {
      showToast('Đã xóa ' + (isSupplier ? 'Nhà Cung Cấp' : 'Khách Hàng') + ' thành công!', 'success');
      fetchData();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast('Lỗi xóa: ' + (err.message || 'Không thể xóa đối tượng này'), 'error');
    }
  } catch (e) {
    showToast('Lỗi kết nối máy chủ, vui lòng thử lại: ' + e.message, 'error');
  }
};
</script>
