<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
    <!-- HEADER ĐIỀU PHỐI DÒNG TIỀN -->
    <div class="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-800 border border-slate-800/80 p-5 sm:p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      
      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div class="flex items-center gap-4">
          <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-600/30 ring-1 ring-white/20 shrink-0">
            <Building2 class="w-7 h-7" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2.5">
              <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                Quản Lý Dòng Tiền & Số Dư Ngân Hàng
              </h1>
              <span class="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Cân Bằng Tiền Vào / Ra
              </span>
            </div>
            <p class="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Khách chuyển vào NCC thì NCC tăng tiền (+). Khi nhập hàng thì NCC bị trừ tiền (-), cho phép âm hoặc dương.
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- 2 TAB CHUYỂN ĐỔI CHÍNH -->
          <div class="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-lg">
            <button
              @click="activeTab = 'NCC'"
              :class="[
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer',
                activeTab === 'NCC'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              ]"
            >
              <Building2 class="w-4 h-4" />
              <span>1. Dòng Tiền & Số Dư NCC</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-black/30 font-mono">{{ supplierAccounts.length }}</span>
            </button>

            <button
              @click="activeTab = 'FAMILY'"
              :class="[
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer',
                activeTab === 'FAMILY'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              ]"
            >
              <TrendingUp class="w-4 h-4" />
              <span>2. Dòng Tiền Người Nhà (Lợi Nhuận)</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-black/30 font-mono">{{ familyAccounts.length }}</span>
            </button>
          </div>

          <!-- NÚT THÊM TÀI KHOẢN NGÂN HÀNG CHÍNH -->
          <button
            @click="handleOpenAddAccount"
            class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-cyan-600/30 transition transform active:scale-95 border border-cyan-400/30 cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            <span>Thêm Tài Khoản Ngân Hàng</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- PHẦN 1: DÒNG TIỀN & SỐ DƯ TÀI KHOẢN NHÀ CUNG CẤP (NCC) -->
    <!-- ========================================================================= -->
    <div v-if="activeTab === 'NCC'" class="space-y-6 animate-in fade-in duration-150">
      <!-- DASHBOARD TỔNG QUAN SỐ DƯ & CÔNG NỢ NCC -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase font-black text-rose-400 tracking-wider">TỔNG SỐ TIỀN ĐANG ÂM (NỢ NCC)</span>
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-rose-400 mt-2 tracking-tight">
            {{ totalSupplierDebt > 0 ? ('-' + formatVND(totalSupplierDebt)) : '0 đ' }}
          </div>
          <p class="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
            Tiền hàng nhập vượt quá số tiền khách chuyển vào NCC
          </p>
        </div>

        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase font-black text-emerald-400 tracking-wider">TỔNG SỐ TIỀN ĐANG DƯ (CỌC NCC)</span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 tracking-tight">
            +{{ formatVND(totalSupplierDeposit) }}
          </div>
          <p class="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
            Tiền khách đã chuyển hoặc tiền cọc đang dư tại các NCC
          </p>
        </div>

        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase font-black text-cyan-400 tracking-wider">TỔNG TIỀN VÀO TÀI KHOẢN NCC</span>
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-cyan-300 mt-2 tracking-tight">
            +{{ formatVND(totalCustomerPaidToSuppliers) }}
          </div>
          <p class="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
            Tổng cộng các lần khách chuyển trực tiếp vào STK NCC
          </p>
        </div>
      </div>

      <!-- THANH TIÊU ĐỀ & NÚT THÊM STK NCC TRÊN DANH SÁCH THẺ -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <Building2 class="w-5 h-5 text-cyan-400" />
          <h2 class="text-base font-black text-white uppercase tracking-wider">
            Tài Khoản Ngân Hàng Nhà Cung Cấp
          </h2>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
            {{ supplierAccounts.length }} STK
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <button
            @click="handleOpenAddSupplierAccount"
            class="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer border border-cyan-400/30"
          >
            <Plus class="w-4 h-4" />
            <span>Thêm STK Nhà Cung Cấp</span>
          </button>

          <button
            @click="handleOpenCustomerPaySupplier"
            :disabled="supplierAccounts.length === 0"
            class="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/30 shadow-md transition cursor-pointer disabled:opacity-50"
          >
            <ArrowDownLeft class="w-3.5 h-3.5 text-emerald-400" />
            <span>Khách Chuyển Vào STK NCC</span>
          </button>

          <button
            @click="handleOpenDepositSupplier"
            :disabled="supplierAccounts.length === 0"
            class="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold rounded-xl border border-cyan-500/30 shadow-md transition cursor-pointer disabled:opacity-50"
          >
            <DollarSign class="w-3.5 h-3.5 text-cyan-400" />
            <span>Chuyển Cọc Cho NCC</span>
          </button>
        </div>
      </div>

      <!-- DANH SÁCH THẺ NGÂN HÀNG NCC -->
      <div v-if="supplierAccounts.length === 0" class="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
          <Building2 class="w-6 h-6" />
        </div>
        <p class="text-slate-400 text-sm font-medium">Chưa có thông tin tài khoản ngân hàng của Nhà Cung Cấp nào.</p>
        <button
          @click="handleOpenAddSupplierAccount"
          class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Thêm STK Nhà Cung Cấp</span>
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="acc in supplierAccounts"
          :key="acc.id"
          class="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-5 shadow-xl relative flex flex-col justify-between space-y-4 transition-all"
        >
          <!-- HEADER THẺ -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Building2 class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h3 class="font-black text-white text-sm sm:text-base leading-snug">{{ acc.bankName || acc.tenNganHang }}</h3>
                </div>
                <p class="text-xs font-mono text-cyan-400 font-bold mt-0.5 tracking-wide">{{ acc.accountNumber || acc.soTaiKhoan }}</p>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="handleOpenEdit(acc)"
                class="p-1.5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 rounded-lg transition cursor-pointer"
                title="Sửa STK"
              >
                <Edit2 class="w-3.5 h-3.5" />
              </button>
              <button
                @click="handleDeleteAccount(acc.id, `${acc.bankName || acc.tenNganHang} - ${acc.accountNumber || acc.soTaiKhoan}`)"
                class="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                title="Xóa STK này"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- BADGE NHẬN BIẾT TÀI KHOẢN CỦA NCC NÀO (HIỂN / KIỆT / ...) -->
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-slate-950 border border-amber-500/30">
            <div class="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <span>🏭 Nhà Cung Cấp:</span>
              <span class="text-white text-sm font-black">{{ getSupplierNameForAccount(acc) }}</span>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              STK Đối Tác
            </span>
          </div>

          <!-- THÔNG TIN NCC VÀ SỐ DƯ TÀI KHOẢN NCC (ÂM HOẶC DƯƠNG) -->
          <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[10px] uppercase font-bold text-slate-500">Tên Chủ Tài Khoản:</span>
              <span class="font-black text-cyan-300 uppercase truncate max-w-[180px]">{{ acc.accountHolder || acc.chuTaiKhoan }}</span>
            </div>

            <!-- HIỂN THỊ SỐ DƯ TÀI KHOẢN NCC (ÂM / DƯƠNG) -->
            <div class="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
              <span class="text-[10px] uppercase font-bold text-slate-400">Số Dư Tại NCC:</span>
              <div class="text-right">
                <span :class="[
                  'text-base sm:text-lg font-black tracking-tight',
                  getSupplierBalance(acc) > 0 ? 'text-emerald-400' : (getSupplierBalance(acc) < 0 ? 'text-rose-400' : 'text-slate-300')
                ]">
                  {{ formatSupplierBalanceLabel(acc) }}
                </span>
                <span class="block text-[10px] font-semibold text-slate-500">
                  {{ getSupplierBalanceSubtext(acc) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SỔ GIAO DỊCH DÒNG TIỀN NCC -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div class="flex items-center gap-2">
            <CreditCard class="w-5 h-5 text-cyan-400" />
            <h2 class="text-base font-black text-white">Sổ Dòng Tiền & Cân Bằng Tài Khoản NCC</h2>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {{ filteredSupplierTxs.length }} giao dịch
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-500 font-mono hidden sm:inline">
              🛡️ Lưu trữ tối đa 2 năm (tự động dọn dẹp)
            </span>
            <button
              v-if="transactions.length > 0"
              @click="handleClearAllTransactions"
              class="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
              title="Dọn sạch toàn bộ các dòng tiền thử nghiệm"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Dọn Dữ Liệu Test</span>
            </button>
          </div>
        </div>

        <!-- BỘ LỌC ĐẦY ĐỦ CHO BẢNG DÒNG TIỀN -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
          <!-- 1. Tìm kiếm -->
          <div class="relative">
            <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              v-model="txSearch"
              placeholder="Tìm người chuyển, nội dung..."
              class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition"
            />
          </div>

          <!-- 2. Lọc Nhà Cung Cấp -->
          <div>
            <select
              v-model="selectedSupplierId"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer font-medium"
            >
              <option value="ALL">🏢 Tất cả Nhà Cung Cấp</option>
              <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                {{ sup.tenNhaCungCap || sup.name }}
              </option>
            </select>
          </div>

          <!-- 3. Lọc Loại Nghiệp Vụ -->
          <div>
            <select
              v-model="selectedTxType"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer font-medium"
            >
              <option value="ALL">📋 Tất cả loại nghiệp vụ</option>
              <option value="KHACH_TRA_NCC">📥 Khách chuyển vào NCC (+)</option>
              <option value="NHAP_HANG_HEO">🚛 Nhập chuyến xe heo (-)</option>
              <option value="CHINH_SUA_NHAP">✏️ Chỉnh sửa giá chuyến xe</option>
              <option value="XOA_SAN_PHAM_HOAN_TIEN">↩️ Hoàn tiền xóa SP (+)</option>
              <option value="TIEN_COC_NCC">💰 Gửi cọc NCC (+)</option>
            </select>
          </div>

          <!-- 4. Lọc Thời Gian -->
          <div>
            <select
              v-model="selectedTimeRange"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer font-medium"
            >
              <option value="ALL">⏳ Toàn bộ (2 năm qua)</option>
              <option value="TODAY">📅 Hôm nay</option>
              <option value="7DAYS">📅 7 ngày gần nhất</option>
              <option value="30DAYS">📅 30 ngày gần nhất</option>
              <option value="THIS_MONTH">📅 Tháng này</option>
              <option value="THIS_YEAR">📅 Năm nay</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-950 text-slate-400 uppercase text-[11px] font-black border-b border-slate-800">
              <tr>
                <th class="px-4 py-3.5">Thời Gian</th>
                <th class="px-4 py-3.5">STK Nhà Cung Cấp</th>
                <th class="px-4 py-3.5">Người Chuyển / Khách</th>
                <th class="px-4 py-3.5">Loại Nghiệp Vụ</th>
                <th class="px-4 py-3.5 text-right">Số Tiền (VNĐ)</th>
                <th class="px-5 py-3.5">Ghi Chú / Chi Tiết</th>
                <th class="px-3 py-3.5 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-medium">
              <tr v-if="filteredSupplierTxs.length === 0">
                <td colSpan="7" class="px-4 py-10 text-center text-slate-500 italic">
                  Chưa có giao dịch dòng tiền NCC nào được ghi nhận.
                </td>
              </tr>
              <tr 
                v-else
                v-for="(tx, idx) in filteredSupplierTxs"
                :key="tx.id || idx"
                class="hover:bg-slate-800/40 transition"
              >
                <td class="px-4 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                  {{ formatDateTime(tx.createdAt || tx.thoiGianGiaoDich || tx.ngayGiaoDich) }}
                </td>

                <td class="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                  {{ tx.bankAccountName || tx.taiKhoanNganHang?.tenNganHang || 'STK NCC' }}
                </td>

                <td class="px-4 py-3.5 whitespace-nowrap">
                  <span v-if="tx.loaiNghiepVu === 'KHACH_TRA_NCC' || tx.loaiGiaoDich === 'KHACH_TRA_NCC'" class="text-cyan-300 font-semibold">
                    {{ tx.tenKhachHang || tx.customerName || 'Khách chuyển' }}
                  </span>
                  <span v-else-if="tx.loaiNghiepVu === 'TIEN_COC_NCC' || tx.loaiGiaoDich === 'TIEN_COC_NCC'" class="text-amber-300 font-semibold">
                    {{ tx.tenKhachHang || 'Tôi (Tiền cọc)' }}
                  </span>
                  <span v-else class="text-slate-500 font-normal">
                    —
                  </span>
                </td>

                <td class="px-4 py-3.5 whitespace-nowrap">
                  <span 
                    v-if="tx.loaiNghiepVu === 'KHACH_TRA_NCC' || tx.loaiGiaoDich === 'KHACH_TRA_NCC'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  >
                    <ArrowDownLeft class="w-3.5 h-3.5 text-emerald-400" />
                    Khách chuyển vào NCC
                  </span>
                  <span 
                    v-else-if="tx.loaiNghiepVu === 'TIEN_COC_NCC' || tx.loaiGiaoDich === 'TIEN_COC_NCC'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                  >
                    <DollarSign class="w-3.5 h-3.5 text-amber-400" />
                    Tiền cọc / Trả trước
                  </span>
                  <span 
                    v-else-if="tx.loaiNghiepVu === 'NHAP_HANG_NCC' || tx.loaiNghiepVu === 'NHAP_CHUYEN_XE_HEO' || tx.loaiGiaoDich === 'TRU_TIEN_HANG_NCC' || tx.loaiGiaoDich === 'PHIEU_NHAP' || (tx.moTa && tx.moTa.includes('Nhập hàng từ NCC'))"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm"
                  >
                    <span>📦</span>
                    <span>Nhập chuyến heo</span>
                  </span>
                  <span 
                    v-else-if="tx.loaiNghiepVu === 'CHINH_SUA_NHAP' || tx.loaiGiaoDich === 'CHINH_SUA' || (tx.moTa && tx.moTa.includes('Cập nhật nhập hàng'))"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  >
                    <span>✏️</span>
                    <span>Nhập chuyến heo</span>
                  </span>
                  <span 
                    v-else-if="tx.loaiNghiepVu === 'XOA_SAN_PHAM_HOAN_TIEN' || tx.loaiGiaoDich === 'HOAN_TIEN'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm"
                  >
                    ↩️ Hoàn tiền xóa SP
                  </span>
                  <span 
                    v-else
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 shadow-sm"
                  >
                    Nhập chuyến heo
                  </span>
                </td>

                <td :class="['px-4 py-3.5 text-right font-black text-sm whitespace-nowrap', (tx.loaiDongTien === 'OUT' || tx.type === 'OUT' || Number(tx.soTien) < 0 || Number(tx.amount) < 0) ? 'text-rose-400' : 'text-emerald-400']">
                  {{ (tx.loaiDongTien === 'OUT' || tx.type === 'OUT' || Number(tx.soTien) < 0 || Number(tx.amount) < 0) ? '-' : '+' }}{{ formatVND(Math.abs(Number(tx.amount || tx.soTien) || 0)) }}
                </td>

                <td class="px-5 py-3.5 font-medium text-slate-100 text-xs sm:text-[13px] leading-relaxed">
                  {{ tx.reason || tx.moTa || tx.noiDung || 'Đã ghi nhận giao dịch dòng tiền' }}
                </td>

                <td class="px-3 py-3.5 text-center">
                  <button
                    @click="handleDeleteTransaction(tx.id)"
                    class="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                    title="Xóa dòng giao dịch này"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- PHẦN 2: DÒNG TIỀN NGƯỜI NHÀ (BẢNG LỢI NHUẬN HÀNG THÁNG) -->
    <!-- ========================================================================= -->
    <div v-else class="space-y-6 animate-in fade-in duration-150">
      <!-- DASHBOARD TỔNG QUAN LỢI NHUẬN HÀNG THÁNG -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- BỘ LỌC THÁNG VÀ TỔNG LỢI NHUẬN THÁNG -->
        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase font-black text-emerald-400 tracking-wider">LỢI NHUẬN THÁNG NÀY</span>
            <input
              type="month"
              v-model="selectedMonth"
              class="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white outline-none cursor-pointer font-bold"
            />
          </div>
          <div class="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {{ formatVND(monthlyProfit) }}
          </div>
          <p class="text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            Tiền lời khách chuyển vào TK Ba/Mẹ trong tháng {{ formatMonthLabel(selectedMonth) }}
          </p>
        </div>

        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase font-black text-teal-400 tracking-wider">TỔNG LỢI NHUẬN TÍCH LŨY</span>
            <TrendingUp class="w-4 h-4 text-teal-400" />
          </div>
          <div class="text-2xl sm:text-3xl font-black text-teal-300 mt-2 tracking-tight">
            {{ formatVND(totalFamilyProfitAllTime) }}
          </div>
          <p class="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
            Tổng cộng toàn bộ tiền lời đã vào tài khoản người nhà
          </p>
        </div>

        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase font-black text-cyan-400 tracking-wider">SỐ GIAO DỊCH TIỀN LỜI</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-bold">Tháng {{ formatMonthLabel(selectedMonth) }}</span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            {{ filteredMonthlyFamilyTxs.length }} <span class="text-sm font-bold text-slate-400">lần chuyển</span>
          </div>
          <p class="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
            Số lượt khách chuyển tiền chênh lệch lợi nhuận
          </p>
        </div>
      </div>

      <!-- HEADER DANH SÁCH STK NGƯỜI NHÀ & NÚT THAO TÁC -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <TrendingUp class="w-5 h-5 text-emerald-400" />
          <h2 class="text-base font-black text-white uppercase tracking-wider">
            Tài Khoản Người Nhà (Ba / Mẹ / Gia Đình)
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- NÚT GHI NHẬN LỢI NHUẬN KHÁCH CHUYỂN -->
          <button
            @click="handleOpenAddProfit"
            :disabled="familyAccounts.length === 0"
            class="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition cursor-pointer border border-emerald-400/30"
          >
            <Plus class="w-4 h-4" />
            <span>Ghi Nhận Lợi Nhuận Khách Chuyển</span>
          </button>

          <!-- NÚT THÊM STK NGƯỜI NHÀ -->
          <button
            @click="handleOpenAddFamilyAccount"
            class="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            <span>Thêm STK Người Nhà</span>
          </button>
        </div>
      </div>

      <!-- DANH SÁCH THẺ NGÂN HÀNG NGƯỜI NHÀ -->
      <div v-if="familyAccounts.length === 0" class="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
          <Building2 class="w-6 h-6" />
        </div>
        <p class="text-slate-400 text-sm font-medium">Chưa có tài khoản ngân hàng Người Nhà nào (Ba/Mẹ).</p>
        <button
          @click="handleOpenAddFamilyAccount"
          class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Thêm STK Người Nhà Đầu Tiên</span>
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="acc in familyAccounts"
          :key="acc.id"
          class="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 shadow-xl relative flex flex-col justify-between space-y-4 transition-all"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                <Building2 class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h3 class="font-black text-white text-sm sm:text-base leading-snug">{{ acc.bankName || acc.tenNganHang }}</h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                    {{ acc.tenNguoiNha || acc.familyMemberName || 'Người Nhà' }}
                  </span>
                </div>
                <p class="text-xs font-mono text-cyan-400 font-bold mt-0.5 tracking-wide">{{ acc.accountNumber || acc.soTaiKhoan }}</p>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="handleOpenEdit(acc)"
                class="p-1.5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 rounded-lg transition cursor-pointer"
                title="Sửa STK"
              >
                <Edit2 class="w-3.5 h-3.5" />
              </button>
              <button
                @click="handleDeleteAccount(acc.id, `${acc.bankName || acc.tenNganHang} - ${acc.accountNumber || acc.soTaiKhoan}`)"
                class="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                title="Xóa STK này"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[10px] uppercase font-bold text-slate-500">Chủ Tài Khoản</span>
              <span class="font-black text-white uppercase">{{ acc.accountHolder || acc.chuTaiKhoan }}</span>
            </div>

            <div class="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
              <span class="text-[10px] uppercase font-bold text-slate-400">Số Dư Tích Lũy:</span>
              <span class="text-base sm:text-lg font-black text-emerald-400 tracking-tight">
                {{ formatVND(acc.balance || acc.soDuHienTai) }}
              </span>
            </div>
          </div>

          <p v-if="acc.notes || acc.ghiChu" class="text-[11px] text-slate-500 italic truncate">
            "{{ acc.notes || acc.ghiChu }}"
          </p>
        </div>
      </div>

      <!-- BẢNG SỔ LỢI NHUẬN HÀNG THÁNG -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div class="flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-emerald-400" />
            <h2 class="text-base font-black text-white">
              Bảng Lợi Nhuận Khách Chuyển Vào TK Người Nhà (Tháng {{ formatMonthLabel(selectedMonth) }})
            </h2>
          </div>

          <div class="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            Tổng Tháng: {{ formatVND(monthlyProfit) }}
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-950 text-slate-400 uppercase text-[11px] font-black border-b border-slate-800">
              <tr>
                <th class="px-4 py-3.5">Thời Gian</th>
                <th class="px-4 py-3.5">Khách Hàng Chuyển</th>
                <th class="px-4 py-3.5">TK Người Nhà Nhận</th>
                <th class="px-4 py-3.5 text-right">Tiền Lời (VNĐ)</th>
                <th class="px-5 py-3.5">Nội Dung Đơn Hàng / Ghi Chú</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-medium">
              <tr v-if="filteredMonthlyFamilyTxs.length === 0">
                <td colSpan="5" class="px-4 py-10 text-center text-slate-500 italic">
                  Chưa có khoản lợi nhuận nào được ghi nhận trong tháng {{ formatMonthLabel(selectedMonth) }}.
                </td>
              </tr>
              <tr 
                v-else
                v-for="(tx, idx) in filteredMonthlyFamilyTxs"
                :key="tx.id || idx"
                class="hover:bg-slate-800/40 transition"
              >
                <td class="px-4 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                  {{ formatDateTime(tx.createdAt || tx.thoiGianGiaoDich || tx.ngayGiaoDich) }}
                </td>

                <td class="px-4 py-3.5 text-cyan-300 font-bold whitespace-nowrap">
                  {{ tx.tenKhachHang || tx.customerName || 'Khách lẻ' }}
                </td>

                <td class="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                  {{ tx.bankAccountName || tx.taiKhoanNganHang?.tenNganHang || 'TK Ba/Mẹ' }} ({{ tx.taiKhoanNganHang?.tenNguoiNha || 'Người nhà' }})
                </td>

                <td class="px-4 py-3.5 text-right font-black text-sm text-emerald-400 whitespace-nowrap">
                  +{{ formatVND(tx.amount || tx.soTien) }}
                </td>

                <td class="px-5 py-3.5 text-slate-300">
                  {{ tx.reason || tx.moTa || tx.noiDung || 'Lợi nhuận đơn hàng' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 1: GHI NHẬN KHÁCH CHUYỂN VÀO STK NCC (+) -->
    <!-- ========================================================================= -->
    <div 
      v-if="showCustomerPayModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4" @click.stop>
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ArrowDownLeft class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-black text-white">Khách Chuyển Vào STK NCC (+)</h3>
              <p class="text-xs text-slate-400">Tiền vào STK NCC sẽ tự động cộng (+) vào số dư tài khoản của NCC đó</p>
            </div>
          </div>
          <button @click="showCustomerPayModal = false" class="text-slate-400 hover:text-white text-xs p-1.5 rounded-lg bg-slate-950 border border-slate-800">
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSaveCustomerPay" class="space-y-3.5">
          <!-- CHỌN STK NHÀ CUNG CẤP THỤ HƯỞNG -->
          <div>
            <label class="block text-xs font-bold text-cyan-300 mb-1">Chọn STK Nhà Cung Cấp Nhận Tiền *</label>
            <select
              v-model="customerPayForm.bankAccountId"
              required
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-cyan-500 font-semibold"
            >
              <option v-for="a in supplierAccounts" :key="a.id" :value="a.id">
                {{ a.bankName || a.tenNganHang }} — STK: {{ a.accountNumber || a.soTaiKhoan }} ({{ a.accountHolder || a.chuTaiKhoan }})
              </option>
            </select>
          </div>

          <!-- TÊN KHÁCH HÀNG CHUYỂN -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Tên Khách Hàng Chuyển Tiền *</label>
            <input
              type="text"
              required
              v-model="customerPayForm.customerName"
              placeholder="VD: Anh Minh Quán Nướng, Chị Lan..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
            />
          </div>

          <!-- SỐ TIỀN KHÁCH CHUYỂN -->
          <div>
            <label class="block text-xs font-bold text-emerald-400 mb-1">Số Tiền Khách Chuyển Vào NCC (VNĐ) *</label>
            <div class="relative">
              <input
                type="text"
                required
                :value="formatInputDisplay(customerPayForm.amount)"
                @input="handleCurrencyInput($event, customerPayForm, 'amount')"
                placeholder="4.000.000"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-black text-emerald-400 outline-none focus:border-emerald-500"
              />
              <span class="absolute right-3 top-2 text-xs text-slate-500 font-bold">đ</span>
            </div>
            <span class="text-[10px] text-slate-400 mt-1 block italic">
              * Số tiền này sẽ được CỘNG (+) vào số dư tài khoản của NCC này.
            </span>
          </div>

          <!-- GHI CHÚ / NỘI DUNG -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Nội Dung / Đơn Hàng Liên Quan</label>
            <input
              type="text"
              v-model="customerPayForm.reason"
              placeholder="VD: Khách chuyển tiền 4 con heo 5kg ngày 29/08..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="showCustomerPayModal = false"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/20 cursor-pointer"
            >
              Ghi Nhận & Tăng Tiền NCC (+)
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 2: GỬI CỌC / TRẢ TRƯỚC CHO NCC (+) -->
    <!-- ========================================================================= -->
    <div 
      v-if="showDepositModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4" @click.stop>
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-black text-white">Gửi Tiền Cọc / Trả Trước Cho NCC (+)</h3>
              <p class="text-xs text-slate-400">Ghi nhận khoản tiền gửi trước vào số dư NCC trước khi nhập heo</p>
            </div>
          </div>
          <button @click="showDepositModal = false" class="text-slate-400 hover:text-white text-xs p-1.5 rounded-lg bg-slate-950 border border-slate-800">
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSaveDeposit" class="space-y-3.5">
          <!-- CHỌN STK NHÀ CUNG CẤP -->
          <div>
            <label class="block text-xs font-bold text-amber-300 mb-1">Chọn Nhà Cung Cấp Nhận Cọc *</label>
            <select
              v-model="depositForm.bankAccountId"
              required
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-amber-500 font-semibold"
            >
              <option v-for="a in supplierAccounts" :key="a.id" :value="a.id">
                {{ a.bankName || a.tenNganHang }} — STK: {{ a.accountNumber || a.soTaiKhoan }} ({{ a.accountHolder || a.chuTaiKhoan }})
              </option>
            </select>
          </div>

          <!-- SỐ TIỀN CỌC -->
          <div>
            <label class="block text-xs font-bold text-amber-400 mb-1">Số Tiền Chuyển Cọc / Trả Trước (VNĐ) *</label>
            <div class="relative">
              <input
                type="text"
                required
                :value="formatInputDisplay(depositForm.amount)"
                @input="handleCurrencyInput($event, depositForm, 'amount')"
                placeholder="1.000.000"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-black text-amber-400 outline-none focus:border-amber-500"
              />
              <span class="absolute right-3 top-2 text-xs text-slate-500 font-bold">đ</span>
            </div>
          </div>

          <!-- GHI CHÚ -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Ghi Chú Tiền Cọc</label>
            <input
              type="text"
              v-model="depositForm.reason"
              placeholder="VD: Cọc chuyến heo sữa ngày mai..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="showDepositModal = false"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Ghi Nhận Tiền Cọc (+)
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 3: GHI NHẬN LỢI NHUẬN KHÁCH CHUYỂN VÀO TK NGƯỜI NHÀ -->
    <!-- ========================================================================= -->
    <div 
      v-if="showProfitModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4" @click.stop>
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-black text-white">Ghi Nhận Lợi Nhuận Khách Chuyển (Người Nhà)</h3>
              <p class="text-xs text-slate-400">Tiền lời bán heo chuyển vào tài khoản Ba / Mẹ</p>
            </div>
          </div>
          <button @click="showProfitModal = false" class="text-slate-400 hover:text-white text-xs p-1.5 rounded-lg bg-slate-950 border border-slate-800">
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSaveProfit" class="space-y-3.5">
          <!-- CHỌN STK NGƯỜI NHÀ -->
          <div>
            <label class="block text-xs font-bold text-emerald-300 mb-1">Tài Khoản Người Nhà Nhận Tiền Lời *</label>
            <select
              v-model="profitForm.bankAccountId"
              required
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-emerald-500 font-semibold"
            >
              <option v-for="a in familyAccounts" :key="a.id" :value="a.id">
                {{ a.bankName || a.tenNganHang }} (STK: {{ a.accountNumber || a.soTaiKhoan }}) — {{ a.tenNguoiNha || 'Người nhà' }} ({{ a.accountHolder || a.chuTaiKhoan }})
              </option>
            </select>
          </div>

          <!-- TÊN KHÁCH HÀNG CHUYỂN -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Khách Hàng Chuyển Tiền Lời *</label>
            <input
              type="text"
              required
              v-model="profitForm.customerName"
              placeholder="VD: Quán nhậu Bình Dân, A Hùng..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          <!-- SỐ TIỀN LỢI NHUẬN -->
          <div>
            <label class="block text-xs font-bold text-emerald-400 mb-1">Số Tiền Lợi Nhuận / Tiền Lời (VNĐ) *</label>
            <div class="relative">
              <input
                type="text"
                required
                :value="formatInputDisplay(profitForm.amount)"
                @input="handleCurrencyInput($event, profitForm, 'amount')"
                placeholder="2.500.000"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-black text-emerald-400 outline-none focus:border-emerald-500"
              />
              <span class="absolute right-3 top-2 text-xs text-slate-500 font-bold">đ</span>
            </div>
          </div>

          <!-- GHI CHÚ / THÁNG HẠCH TOÁN -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Tháng Hạch Toán *</label>
              <input
                type="month"
                required
                v-model="profitForm.monthYear"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none font-bold"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Nội Dung Đơn Hàng</label>
              <input
                type="text"
                v-model="profitForm.reason"
                placeholder="VD: Lời đơn 10 con heo sữa..."
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="showProfitModal = false"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              Lưu Vào Bảng Lợi Nhuận
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL 4: THÊM / SỬA TÀI KHOẢN NGÂN HÀNG (NCC HOẶC NGƯỜI NHÀ) -->
    <!-- ========================================================================= -->
    <div 
      v-if="showAccountModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4" @click.stop>
        <h3 class="text-base font-black text-white border-b border-slate-800 pb-3">
          {{ editingAccount ? 'Chỉnh Sửa Tài Khoản Ngân Hàng' : (accountForm.accountType === 'NCC' ? 'Thêm STK Nhà Cung Cấp Mới' : 'Thêm STK Người Nhà (Ba/Mẹ)') }}
        </h3>

        <form @submit.prevent="handleSaveAccount" class="space-y-3">
          <!-- LOẠI TÀI KHOẢN -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Loại Tài Khoản *</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="accountForm.accountType = 'NCC'"
                :class="[
                  'py-2 rounded-xl text-xs font-bold transition cursor-pointer',
                  accountForm.accountType === 'NCC' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
                ]"
              >
                🏭 STK Nhà Cung Cấp
              </button>
              <button
                type="button"
                @click="accountForm.accountType = 'NGUOI_NHA'"
                :class="[
                  'py-2 rounded-xl text-xs font-bold transition cursor-pointer',
                  accountForm.accountType === 'NGUOI_NHA' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
                ]"
              >
                👨‍👩‍👧 STK Người Nhà
              </button>
            </div>
          </div>

          <!-- NẾU LÀ NCC: CHỌN NCC LIÊN KẾT -->
          <div v-if="accountForm.accountType === 'NCC'">
            <label class="block text-xs font-bold text-cyan-300 mb-1">Nhà Cung Cấp Liên Kết</label>
            <select
              v-model="accountForm.supplierId"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              <option value="">-- Chọn Nhà Cung Cấp (Nếu có) --</option>
              <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                {{ sup.tenNhaCungCap || sup.name }}
              </option>
            </select>
          </div>

          <!-- NẾU LÀ NGƯỜI NHÀ: NHẬP VAI TRÒ (BA / MẸ) -->
          <div v-if="accountForm.accountType === 'NGUOI_NHA'">
            <label class="block text-xs font-bold text-emerald-300 mb-1">Tên Người Thụ Hưởng (Ba / Mẹ / Gia Đình) *</label>
            <input
              type="text"
              required
              v-model="accountForm.familyMemberName"
              placeholder="VD: Ba, Mẹ, Vợ..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <!-- CHỌN NGÂN HÀNG -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Chọn Ngân Hàng</label>
            <select
              v-model="accountForm.bankCode"
              @change="handleBankSelect"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              <option v-for="b in popularBanks" :key="b.code" :value="b.code">{{ b.name }}</option>
            </select>
          </div>

          <!-- SỐ TÀI KHOẢN -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Số Tài Khoản (STK) *</label>
            <input
              type="text"
              required
              v-model="accountForm.accountNumber"
              placeholder="0988..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
            />
          </div>

          <!-- TÊN CHỦ TÀI KHOẢN -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Tên Chủ Tài Khoản *</label>
            <input
              type="text"
              required
              v-model="accountForm.accountHolder"
              placeholder="NGUYEN VAN A"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase outline-none"
            />
          </div>

          <!-- GHI CHÚ -->
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Ghi Chú</label>
            <input
              type="text"
              v-model="accountForm.notes"
              placeholder="Ghi chú về tài khoản này..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="showAccountModal = false"
              class="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-cyan-600/20"
            >
              Lưu Tài Khoản
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
  Building2, Plus, Edit2, Trash2, ArrowDownLeft, 
  DollarSign, CreditCard, TrendingUp, Search
} from 'lucide-vue-next';
import { formatVND, formatDateTime } from '../utils/formatters';
import { showConfirm, showToast } from '../utils/dialog';

const activeTab = ref('NCC'); // 'NCC' hoặc 'FAMILY'
const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // '2026-08'
const selectedSupplierId = ref('ALL');
const selectedTxType = ref('ALL');
const selectedTimeRange = ref('ALL');
const txSearch = ref('');

const popularBanks = [
  { code: 'MB', name: 'MB BANK (Quân Đội)' },
  { code: 'VCB', name: 'VIETCOMBANK' },
  { code: 'TCB', name: 'TECHCOMBANK' },
  { code: 'BIDV', name: 'BIDV' },
  { code: 'CTG', name: 'VIETINBANK' },
  { code: 'ACB', name: 'ACB' },
  { code: 'VPB', name: 'VPBANK' },
  { code: 'TPB', name: 'TPBANK' },
  { code: 'STB', name: 'SACOMBANK' },
  { code: 'HDB', name: 'HDBANK' }
];

const accounts = ref([]);
const suppliers = ref([]);
const transactions = ref([]);
const loading = ref(true);

const showAccountModal = ref(false);
const showCustomerPayModal = ref(false);
const showDepositModal = ref(false);
const showProfitModal = ref(false);
const editingAccount = ref(null);

const accountForm = ref({
  accountType: 'NCC',
  supplierId: '',
  familyMemberName: 'Ba',
  bankName: 'MB BANK (Quân Đội)',
  bankCode: 'MB',
  accountNumber: '',
  accountHolder: '',
  notes: ''
});

const customerPayForm = ref({
  bankAccountId: '',
  customerName: '',
  amount: '',
  reason: ''
});

const depositForm = ref({
  bankAccountId: '',
  amount: '',
  reason: 'Tiền cọc trước khi nhập chuyến heo'
});

const profitForm = ref({
  bankAccountId: '',
  customerName: '',
  amount: '',
  monthYear: new Date().toISOString().slice(0, 7),
  reason: 'Lợi nhuận đơn hàng bán heo'
});

const fetchData = async () => {
  try {
    loading.value = true;
    const [accRes, supRes, txRes] = await Promise.all([
      fetch('/api/bank-accounts').catch(() => null),
      fetch('/api/suppliers').catch(() => null),
      fetch('/api/bank-transactions').catch(() => null)
    ]);
    const accData = accRes && accRes.ok ? await accRes.json() : [];
    const supData = supRes && supRes.ok ? await supRes.json() : [];
    const txData = txRes && txRes.ok ? await txRes.json() : [];

    accounts.value = Array.isArray(accData) ? accData : (accData?.data && Array.isArray(accData.data) ? accData.data : []);
    suppliers.value = Array.isArray(supData) ? supData : (supData?.data && Array.isArray(supData.data) ? supData.data : []);
    transactions.value = Array.isArray(txData) ? txData : (txData?.data && Array.isArray(txData.data) ? txData.data : []);
  } catch (e) {
    console.error("Lỗi tải dữ liệu ngân hàng:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
  window.addEventListener('pig-suppliers-updated', () => fetchData());
  window.addEventListener('pig-banks-updated', () => fetchData());
  window.addEventListener('pig-purchases-updated', () => fetchData());
  window.addEventListener('pig-orders-updated', () => fetchData());
});

// Tách tài khoản NCC & Người Nhà
const supplierAccounts = computed(() => {
  return accounts.value.filter(a => (a.loaiTaiKhoan || a.accountType || 'NCC') === 'NCC');
});

const familyAccounts = computed(() => {
  return accounts.value.filter(a => (a.loaiTaiKhoan || a.accountType) === 'NGUOI_NHA');
});

const getSupplierNameForAccount = (acc) => {
  const supId = acc.nhaCungCapId || acc.supplierId;
  if (!supId) {
    return acc.accountHolder || acc.chuTaiKhoan || 'Chưa gán NCC';
  }
  const sup = suppliers.value.find(s => String(s.id) === String(supId));
  return sup ? (sup.tenNhaCungCap || sup.name) : (acc.accountHolder || acc.chuTaiKhoan || `NCC #${supId}`);
};

// Lấy số dư tài khoản của NCC (+ = Dư tiền/cọc, - = Âm tiền/nợ NCC)
const getSupplierBalance = (acc) => {
  if (acc.soDuHienTai !== undefined && acc.soDuHienTai !== null && Number(acc.soDuHienTai) !== 0) {
    return Number(acc.soDuHienTai);
  }
  const sup = suppliers.value.find(s => s.id === acc.nhaCungCapId || s.id === acc.supplierId);
  if (sup) {
    return Number(sup.congNoPhaiTra || sup.debtToPay || sup.debt || 0);
  }
  return Number(acc.soDuHienTai || acc.balance || 0);
};

const formatSupplierBalanceLabel = (acc) => {
  const bal = getSupplierBalance(acc);
  if (bal > 0) return `+${formatVND(bal)}`;
  if (bal < 0) return `-${formatVND(Math.abs(bal))}`;
  return '0 đ';
};

const getSupplierBalanceSubtext = (acc) => {
  const bal = getSupplierBalance(acc);
  if (bal > 0) return '(Dư tiền trong TK NCC / Tiền cọc)';
  if (bal < 0) return '(Âm tiền / Đang nợ NCC)';
  return '(Cân bằng / Đã đủ)';
};

// Tổng số tiền đang âm (nợ NCC)
const totalSupplierDebt = computed(() => {
  return supplierAccounts.value.reduce((sum, a) => {
    const bal = getSupplierBalance(a);
    return sum + (bal < 0 ? Math.abs(bal) : 0);
  }, 0);
});

// Tổng số tiền đang dương (dư cọc tại NCC)
const totalSupplierDeposit = computed(() => {
  return supplierAccounts.value.reduce((sum, a) => {
    const bal = getSupplierBalance(a);
    return sum + (bal > 0 ? bal : 0);
  }, 0);
});

const totalCustomerPaidToSuppliers = computed(() => {
  return transactions.value
    .filter(t => (t.loaiDoiTuong || t.targetType || 'NCC') === 'NCC' && (t.loaiNghiepVu === 'KHACH_TRA_NCC' || t.loaiGiaoDich === 'KHACH_TRA_NCC'))
    .reduce((sum, t) => sum + (Number(t.amount || t.soTien) || 0), 0);
});

const filteredSupplierTxs = computed(() => {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const thisMonthStr = now.toISOString().slice(0, 7);
  const thisYearStr = String(now.getFullYear());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return transactions.value.filter(t => {
    const isNCC = (t.loaiDoiTuong || t.targetType || 'NCC') === 'NCC';
    if (!isNCC) return false;

    // Filter by NCC
    if (selectedSupplierId.value !== 'ALL') {
      if (String(t.nhaCungCapId || t.supplierId) !== String(selectedSupplierId.value)) {
        return false;
      }
    }

    // Filter by Tx Type
    if (selectedTxType.value !== 'ALL') {
      const type = t.loaiNghiepVu || t.loaiGiaoDich;
      if (type !== selectedTxType.value) {
        return false;
      }
    }

    // Filter by Time
    const txDateStr = t.createdAt || t.thoiGianGiaoDich || t.ngayGiaoDich || '';
    if (selectedTimeRange.value === 'TODAY') {
      if (!txDateStr.startsWith(todayStr)) return false;
    } else if (selectedTimeRange.value === 'THIS_MONTH') {
      if (!txDateStr.startsWith(thisMonthStr)) return false;
    } else if (selectedTimeRange.value === 'THIS_YEAR') {
      if (!txDateStr.startsWith(thisYearStr)) return false;
    } else if (selectedTimeRange.value === '7DAYS') {
      const d = new Date(txDateStr);
      if (isNaN(d.getTime()) || d < sevenDaysAgo) return false;
    } else if (selectedTimeRange.value === '30DAYS') {
      const d = new Date(txDateStr);
      if (isNaN(d.getTime()) || d < thirtyDaysAgo) return false;
    }

    // Search keyword
    if (txSearch.value.trim()) {
      const q = txSearch.value.toLowerCase();
      const customer = (t.tenKhachHang || t.customerName || '').toLowerCase();
      const bank = (t.bankAccountName || t.taiKhoanNganHang?.tenNganHang || '').toLowerCase();
      const note = (t.moTa || t.description || t.ghiChu || '').toLowerCase();
      const matches = customer.includes(q) || bank.includes(q) || note.includes(q);
      if (!matches) return false;
    }

    return true;
  });
});

// Dòng tiền Người Nhà (Lợi nhuận)
const monthlyProfit = computed(() => {
  return transactions.value
    .filter(t => {
      const isFamily = (t.loaiDoiTuong || t.targetType) === 'NGUOI_NHA';
      const m = t.thangNam || t.monthYear || (t.createdAt ? t.createdAt.slice(0, 7) : '') || (t.ngayGiaoDich ? t.ngayGiaoDich.slice(0, 7) : '');
      return isFamily && m === selectedMonth.value;
    })
    .reduce((sum, t) => sum + (Number(t.amount || t.soTien) || 0), 0);
});

const totalFamilyProfitAllTime = computed(() => {
  return transactions.value
    .filter(t => (t.loaiDoiTuong || t.targetType) === 'NGUOI_NHA')
    .reduce((sum, t) => sum + (Number(t.amount || t.soTien) || 0), 0);
});

const filteredMonthlyFamilyTxs = computed(() => {
  return transactions.value.filter(t => {
    const isFamily = (t.loaiDoiTuong || t.targetType) === 'NGUOI_NHA';
    if (!isFamily) return false;
    const m = t.thangNam || t.monthYear || (t.createdAt ? t.createdAt.slice(0, 7) : '') || (t.ngayGiaoDich ? t.ngayGiaoDich.slice(0, 7) : '');
    return m === selectedMonth.value;
  });
});

// Formatters & Input handlers
const formatMonthLabel = (m) => {
  if (!m) return '';
  const parts = m.split('-');
  if (parts.length === 2) return `${parts[1]}/${parts[0]}`;
  return m;
};

const formatInputDisplay = (val) => {
  if (val === null || val === undefined || val === '') return '';
  const num = Number(val);
  if (isNaN(num)) return '';
  return num.toLocaleString('vi-VN');
};

const handleCurrencyInput = (event, target, field) => {
  const raw = event.target.value.replace(/\D/g, '');
  if (!raw) {
    target[field] = '';
    event.target.value = '';
    return;
  }
  const num = parseInt(raw, 10);
  target[field] = num;
  event.target.value = num.toLocaleString('vi-VN');
};

const handleBankSelect = () => {
  const b = vietnameseBanks.find(x => x.name === accountForm.value.bankName);
  if (b) {
    accountForm.value.bankCode = b.code;
  }
};

// Open Modals
const handleOpenAddAccount = () => {
  if (activeTab.value === 'FAMILY') {
    handleOpenAddFamilyAccount();
  } else {
    handleOpenAddSupplierAccount();
  }
};

const handleOpenAddSupplierAccount = async () => {
  editingAccount.value = null;
  try {
    const res = await fetch('/api/suppliers');
    if (res.ok) {
      const data = await res.json();
      suppliers.value = Array.isArray(data) ? data : (data?.data || []);
    }
  } catch (e) {}

  accountForm.value = {
    accountType: 'NCC',
    supplierId: suppliers.value[0]?.id || '',
    familyMemberName: '',
    bankName: 'MB BANK (Quân Đội)',
    bankCode: 'MB',
    accountNumber: '',
    accountHolder: '',
    notes: ''
  };
  showAccountModal.value = true;
};

const handleOpenAddFamilyAccount = () => {
  editingAccount.value = null;
  accountForm.value = {
    accountType: 'NGUOI_NHA',
    supplierId: '',
    familyMemberName: 'Ba',
    bankName: 'VIETCOMBANK',
    bankCode: 'VCB',
    accountNumber: '',
    accountHolder: '',
    notes: 'Tài khoản nhận tiền lời hàng tháng'
  };
  showAccountModal.value = true;
};

const handleOpenEdit = async (acc) => {
  editingAccount.value = acc;
  try {
    const res = await fetch('/api/suppliers');
    if (res.ok) {
      const data = await res.json();
      suppliers.value = Array.isArray(data) ? data : (data?.data || []);
    }
  } catch (e) {}

  accountForm.value = {
    accountType: acc.loaiTaiKhoan || acc.accountType || 'NCC',
    supplierId: acc.nhaCungCapId || acc.supplierId || '',
    familyMemberName: acc.tenNguoiNha || acc.familyMemberName || '',
    bankName: acc.bankName || acc.tenNganHang,
    bankCode: acc.bankCode || acc.maNganHang || 'MB',
    accountNumber: acc.accountNumber || acc.soTaiKhoan,
    accountHolder: acc.accountHolder || acc.chuTaiKhoan,
    notes: acc.notes || acc.ghiChu || ''
  };
  showAccountModal.value = true;
};

const handleOpenCustomerPaySupplier = () => {
  customerPayForm.value = {
    bankAccountId: supplierAccounts.value[0]?.id || '',
    customerName: '',
    amount: '',
    reason: 'Khách thanh toán trực tiếp vào STK NCC'
  };
  showCustomerPayModal.value = true;
};

const handleQuickCustomerPay = (acc) => {
  customerPayForm.value = {
    bankAccountId: acc.id,
    customerName: '',
    amount: '',
    reason: `Khách chuyển vào STK ${acc.bankName || acc.tenNganHang} (${acc.accountHolder || acc.chuTaiKhoan})`
  };
  showCustomerPayModal.value = true;
};

const handleOpenDeposit = () => {
  depositForm.value = {
    bankAccountId: supplierAccounts.value[0]?.id || '',
    amount: '',
    reason: 'Tiền cọc trước khi nhập chuyến heo'
  };
  showDepositModal.value = true;
};

const handleQuickDeposit = (acc) => {
  depositForm.value = {
    bankAccountId: acc.id,
    amount: '',
    reason: `Nộp tiền cọc vào STK ${acc.bankName || acc.tenNganHang} (${acc.accountHolder || acc.chuTaiKhoan})`
  };
  showDepositModal.value = true;
};

const handleOpenAddProfit = () => {
  profitForm.value = {
    bankAccountId: familyAccounts.value[0]?.id || '',
    customerName: '',
    amount: '',
    monthYear: selectedMonth.value || new Date().toISOString().slice(0, 7),
    reason: 'Lợi nhuận đơn hàng bán heo'
  };
  showProfitModal.value = true;
};

// Save handlers
const handleSaveAccount = async () => {
  if (!accountForm.value.accountNumber.trim()) {
    showToast("Vui lòng nhập số tài khoản ngân hàng!", "warning");
    return;
  }
  if (!accountForm.value.accountHolder.trim()) {
    showToast("Vui lòng nhập tên chủ tài khoản!", "warning");
    return;
  }

  const payload = {
    accountType: accountForm.value.accountType,
    loaiTaiKhoan: accountForm.value.accountType,
    supplierId: accountForm.value.accountType === 'NCC' ? Number(accountForm.value.supplierId) : null,
    nhaCungCapId: accountForm.value.accountType === 'NCC' ? Number(accountForm.value.supplierId) : null,
    familyMemberName: accountForm.value.accountType === 'NGUOI_NHA' ? accountForm.value.familyMemberName : null,
    tenNguoiNha: accountForm.value.accountType === 'NGUOI_NHA' ? accountForm.value.familyMemberName : null,
    bankName: accountForm.value.bankName,
    tenNganHang: accountForm.value.bankName,
    bankCode: accountForm.value.bankCode,
    maNganHang: accountForm.value.bankCode,
    accountNumber: accountForm.value.accountNumber.trim(),
    soTaiKhoan: accountForm.value.accountNumber.trim(),
    accountHolder: accountForm.value.accountHolder.trim().toUpperCase(),
    chuTaiKhoan: accountForm.value.accountHolder.trim().toUpperCase(),
    notes: accountForm.value.notes,
    ghiChu: accountForm.value.notes
  };

  try {
    const url = editingAccount.value ? `/api/bank-accounts/${editingAccount.value.id}` : '/api/bank-accounts';
    const method = editingAccount.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast(editingAccount.value ? "Cập nhật tài khoản ngân hàng thành công!" : "Thêm mới tài khoản ngân hàng thành công!", "success");
      showAccountModal.value = false;
      fetchData();
      window.dispatchEvent(new CustomEvent('pig-banks-updated'));
    } else {
      const err = await res.json().catch(() => ({}));
      showToast("Lỗi lưu tài khoản: " + (err.message || 'Không thể hoàn tất thao tác'), "error");
    }
  } catch (err) {
    showToast("Lỗi kết nối máy chủ, vui lòng thử lại: " + err.message, "error");
  }
};

const handleDeleteAccount = async (id, name) => {
  const confirmed = await showConfirm({
    title: 'Xác Nhận Xóa Tài Khoản',
    message: `Bạn có chắc chắn muốn xóa tài khoản ngân hàng "${name}"?`,
    confirmText: 'Xóa Tài Khoản',
    cancelText: 'Hủy Bỏ',
    type: 'danger'
  });

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/bank-accounts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast("Đã xóa tài khoản ngân hàng thành công!", "success");
      fetchData();
      window.dispatchEvent(new CustomEvent('pig-banks-updated'));
    } else {
      const err = await res.json().catch(() => ({}));
      const rawMsg = err.message || '';
      let friendlyMsg = "Không thể xóa tài khoản này vì đã có dữ liệu sản phẩm hoặc phiếu nhập liên kết. Bạn có thể bấm nút Sửa để chỉnh sửa thông tin!";
      if (rawMsg && !rawMsg.includes("could not execute statement") && !rawMsg.includes("FOREIGN KEY") && !rawMsg.includes("REFERENCE constraint")) {
        friendlyMsg = rawMsg;
      }
      showToast(friendlyMsg, "warning");
    }
  } catch (e) {
    showToast("Không thể kết nối máy chủ, vui lòng thử lại sau!", "error");
  }
};

const handleSaveCustomerPay = async () => {
  const amt = Number(customerPayForm.value.amount);
  if (!amt || amt <= 0) {
    showToast("Vui lòng nhập số tiền thanh toán hợp lệ!", "warning");
    return;
  }
  if (!customerPayForm.value.bankAccountId) {
    showToast("Vui lòng chọn tài khoản ngân hàng Nhà Cung Cấp!", "warning");
    return;
  }

  const acc = supplierAccounts.value.find(x => x.id === customerPayForm.value.bankAccountId);
  const nccId = acc?.nhaCungCapId || acc?.supplierId || null;

  const payload = {
    bankAccountId: customerPayForm.value.bankAccountId,
    type: 'IN',
    amount: amt,
    loaiDoiTuong: 'NCC',
    loaiNghiepVu: 'KHACH_TRA_NCC',
    nhaCungCapId: nccId,
    tenKhachHang: customerPayForm.value.customerName,
    reason: `Khách [${customerPayForm.value.customerName}] chuyển trực tiếp cho NCC - ${customerPayForm.value.reason || 'Tăng số dư NCC'}`
  };

  try {
    const res = await fetch('/api/bank-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast(`✅ Đã ghi nhận khách chuyển +${formatVND(amt)} vào STK NCC thành công!`, "success");
      showCustomerPayModal.value = false;
      fetchData();
    } else {
      showToast("Lỗi khi ghi nhận giao dịch!", "error");
    }
  } catch (e) {
    showToast("Lỗi: " + e.message, "error");
  }
};

const handleSaveDeposit = async () => {
  const amt = Number(depositForm.value.amount);
  if (!amt || amt <= 0) {
    showToast("Vui lòng nhập số tiền cọc hợp lệ!", "warning");
    return;
  }
  if (!depositForm.value.bankAccountId) {
    showToast("Vui lòng chọn tài khoản ngân hàng Nhà Cung Cấp!", "warning");
    return;
  }

  const acc = supplierAccounts.value.find(x => x.id === depositForm.value.bankAccountId);
  const nccId = acc?.nhaCungCapId || acc?.supplierId || null;

  const payload = {
    bankAccountId: depositForm.value.bankAccountId,
    type: 'IN',
    amount: amt,
    loaiDoiTuong: 'NCC',
    loaiNghiepVu: 'TIEN_COC_NCC',
    nhaCungCapId: nccId,
    reason: `Tiền cọc / Trả trước cho NCC - ${depositForm.value.reason || ''}`
  };

  try {
    const res = await fetch('/api/bank-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast(`✅ Đã ghi nhận gửi cọc +${formatVND(amt)} vào tài khoản NCC thành công!`, "success");
      showDepositModal.value = false;
      fetchData();
    } else {
      showToast("Lỗi khi lưu tiền cọc!", "error");
    }
  } catch (e) {
    showToast("Lỗi: " + e.message, "error");
  }
};

const handleSaveProfit = async () => {
  const amt = Number(profitForm.value.amount);
  if (!amt || amt <= 0) {
    showToast("Vui lòng nhập số tiền lời hợp lệ!", "warning");
    return;
  }
  if (!profitForm.value.bankAccountId) {
    showToast("Vui lòng chọn tài khoản ngân hàng Người Nhà để ghi nhận tiền lời!", "warning");
    return;
  }

  const acc = familyAccounts.value.find(x => x.id === profitForm.value.bankAccountId);

  const payload = {
    bankAccountId: profitForm.value.bankAccountId,
    type: 'IN',
    amount: amt,
    loaiDoiTuong: 'NGUOI_NHA',
    loaiNghiepVu: 'LOI_NHUAN_NGUOI_NHA',
    tenKhachHang: profitForm.value.customerName,
    thangNam: profitForm.value.monthYear,
    reason: `Lợi nhuận từ [${profitForm.value.customerName}] - ${profitForm.value.reason || 'Tiền lời bán heo'}`
  };

  try {
    const res = await fetch('/api/bank-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast(`✅ Đã ghi nhận +${formatVND(amt)} tiền lời vào bảng lợi nhuận tháng ${formatMonthLabel(profitForm.value.monthYear)}!`, "success");
      showProfitModal.value = false;
      fetchData();
    } else {
      showToast("Lỗi khi lưu lợi nhuận!", "error");
    }
  } catch (e) {
    showToast("Lỗi: " + e.message, "error");
  }
};

const handleClearAllTransactions = async () => {
  const confirmed = await showConfirm({
    title: 'Xóa Sạch Lịch Sử Dòng Tiền Test',
    message: 'Bạn có chắc chắn muốn dọn sạch toàn bộ các dòng tiền thử nghiệm này? Hành động này không thể hoàn tác.',
    confirmText: 'Xác Nhận Xóa Hết',
    cancelText: 'Hủy Bỏ',
    type: 'danger'
  });
  if (!confirmed) return;

  try {
    const res = await fetch('/api/bank-transactions', { method: 'DELETE' });
    if (res.ok) {
      showToast('Đã dọn sạch toàn bộ dữ liệu dòng tiền thử nghiệm thành công!', 'success');
      fetchData();
      window.dispatchEvent(new CustomEvent('pig-banks-updated'));
      window.dispatchEvent(new CustomEvent('pig-suppliers-updated'));
    } else {
      showToast('Lỗi khi xóa dữ liệu dòng tiền', 'error');
    }
  } catch (e) {
    showToast('Lỗi kết nối máy chủ, vui lòng thử lại: ' + e.message, 'error');
  }
};

const handleDeleteTransaction = async (id) => {
  if (!id) return;
  const confirmed = await showConfirm({
    title: 'Xóa Giao Dịch Dòng Tiền',
    message: 'Bạn có chắc chắn muốn xóa dòng giao dịch này? Số dư tài khoản sẽ tự động được cập nhật lại.',
    confirmText: 'Xóa Giao Dịch',
    cancelText: 'Hủy Bỏ',
    type: 'danger'
  });
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/bank-transactions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Đã xóa giao dịch dòng tiền thành công!', 'success');
      fetchData();
      window.dispatchEvent(new CustomEvent('pig-banks-updated'));
      window.dispatchEvent(new CustomEvent('pig-suppliers-updated'));
    } else {
      showToast('Lỗi khi xóa giao dịch dòng tiền', 'error');
    }
  } catch (e) {
    showToast('Lỗi kết nối máy chủ, vui lòng thử lại: ' + e.message, 'error');
  }
};
</script>
