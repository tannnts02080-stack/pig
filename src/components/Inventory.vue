<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
    <!-- HEADER BAR -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div class="relative z-10 flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-600/30 ring-1 ring-white/20">
          <Package class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Quản Lý Kho Heo & Nhập Hàng
          </h1>
          <p class="text-slate-400 text-sm mt-1">
            Theo dõi số lượng con tồn kho, nhập hàng theo chuyến xe khách, phân bổ tiền xe & tổng kết tiền nhập cuối ngày
          </p>
        </div>
      </div>

      <div class="relative z-10 flex flex-wrap items-center gap-3">
        <button
          @click="fetchData"
          class="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700/60 shadow-md transition active:scale-95 cursor-pointer"
          title="Làm mới"
        >
          <RefreshCw :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
        </button>

        <button
          @click="showImportModal = true"
          class="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-cyan-600/30 transition transform active:scale-95 border border-cyan-400/30 cursor-pointer"
        >
          <Truck class="w-5 h-5" />
          <span>Nhập Chuyến Xe Heo Mới</span>
        </button>
      </div>
    </div>

    <!-- 4 STATS CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1: Tổng tồn con -->
      <div class="bg-slate-900/90 border border-slate-800/80 p-4 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tổng Heo Trong Kho</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-3xl font-black text-white">{{ formatNumber(totalStockCon) }}</span>
            <span class="text-sm font-bold text-slate-400">con</span>
          </div>
          <span class="text-xs font-medium text-slate-400 mt-1 block">Tất cả các size & nhà cung cấp</span>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-300">
          <Package class="w-5 h-5 text-amber-400" />
        </div>
      </div>

      <!-- Card 2: Đuôi Cụt & Đuôi Dài -->
      <div class="bg-slate-900/90 border border-slate-800/80 p-4 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <span>🐷 Đuôi Cụt & Dài</span>
          </div>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-3xl font-black text-emerald-400">{{ formatNumber(totalDuoiCon) }}</span>
            <span class="text-sm font-bold text-slate-400">con</span>
          </div>
          <div class="text-xs font-semibold text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
            <span>Đuôi cụt: <strong class="text-emerald-400 font-black text-xs">{{ totalDuoiCutCon }}</strong></span>
            <span class="text-slate-600">•</span>
            <span>Đuôi dài: <strong class="text-emerald-300 font-black text-xs">{{ totalDuoiDaiCon }}</strong></span>
          </div>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-emerald-950/50 border border-emerald-800/50 flex items-center justify-center text-emerald-400 text-xl">
          🐷
        </div>
      </div>

      <!-- Card 3: Rừng Lai & Móng Cái -->
      <div class="bg-slate-900/90 border border-slate-800/80 p-4 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <span>🐗 Rừng Lai & Móng Cái</span>
          </div>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-3xl font-black text-amber-400">{{ formatNumber(totalRungMongCon) }}</span>
            <span class="text-sm font-bold text-slate-400">con</span>
          </div>
          <div class="text-xs font-semibold text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
            <span>Rừng lai: <strong class="text-amber-400 font-black text-xs">{{ totalRungLaiCon }}</strong></span>
            <span class="text-slate-600">•</span>
            <span>Móng cái: <strong class="text-amber-300 font-black text-xs">{{ totalMongCaiCon }}</strong></span>
          </div>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-amber-950/50 border border-amber-800/50 flex items-center justify-center text-amber-400 text-xl">
          🐗
        </div>
      </div>

      <!-- Card 4: Tồn Hàng Nóng & Lạnh -->
      <div class="bg-slate-900/90 border border-slate-800/80 p-4 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            <span>❄️ Hàng Nóng / Lạnh</span>
          </div>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-3xl font-black text-cyan-400">{{ formatNumber(totalHotColdCon) }}</span>
            <span class="text-sm font-bold text-slate-400">con</span>
          </div>
          <div class="text-xs font-semibold text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
            <span>Nóng: <strong class="text-cyan-400 font-black text-xs">{{ totalHotCon }}</strong></span>
            <span class="text-slate-600">•</span>
            <span>Lạnh: <strong class="text-cyan-300 font-black text-xs">{{ totalColdCon }}</strong></span>
          </div>
        </div>
        <div class="w-11 h-11 rounded-2xl bg-cyan-950/50 border border-cyan-800/50 flex items-center justify-center text-cyan-400 text-xl">
          ❄️
        </div>
      </div>
    </div>

    <!-- TABS NAVIGATION -->
    <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
      <div class="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-3xl border border-slate-800 shadow-inner">
        <button
          @click="subTab = 'stock'"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer',
            subTab === 'stock'
              ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-md'
              : 'text-slate-400 hover:text-white'
          ]"
        >
          <Package class="w-4 h-4" />
          <span>Danh Mục Tồn Kho Theo Con ({{ products.length }})</span>
        </button>

        <button
          @click="subTab = 'purchases'"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer',
            subTab === 'purchases'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-md'
              : 'text-slate-400 hover:text-white'
          ]"
        >
          <Truck class="w-4 h-4" />
          <span>Phiếu Nhập Chuyến Xe & Tổng Kết Ngày</span>
        </button>
      </div>

      <div v-if="subTab === 'stock'" class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            v-model="search"
            placeholder="Tìm ô heo tồn kho..."
            class="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
          />
        </div>
        <!-- Lọc Cách Bảo Quản -->
        <select
          v-model="filterPreserve"
          class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer font-semibold"
        >
          <option value="ALL">Mọi cách bảo quản</option>
          <option value="hot">🔥 Hàng Nóng</option>
          <option value="cold">❄️ Hàng Lạnh</option>
          <option value="wrapped">📦 Cuộn Bọc</option>
        </select>
        <!-- Lọc Đặc Điểm Heo -->
        <select
          v-model="filterFeature"
          class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer font-semibold"
        >
          <option value="ALL">Mọi đặc điểm heo</option>
          <option value="duoi_cut">🐷 Đuôi Cụt</option>
          <option value="duoi_dai">🐖 Đuôi Dài</option>
          <option value="rung_lai">🐗 Rừng Lai</option>
          <option value="mong_cai">🐽 Móng Cái</option>
        </select>
      </div>
    </div>

    <!-- TAB 1: BẢNG TỒN KHO THEO CON -->
    <div v-if="subTab === 'stock'" class="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-950/80 border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
              <th class="py-4 px-5">Sản Phẩm Heo</th>
              <th class="py-4 px-4 whitespace-nowrap">Bảo Quản & Đặc Điểm</th>
              <th class="py-4 px-4">Nhà Cung Cấp</th>
              <th class="py-4 px-4 text-center">Tồn Kho (Con)</th>
              <th class="py-4 px-4 text-right">Giá Nhập Vốn</th>
              <th class="py-4 px-5">Ngày & Chi Tiết Nhập</th>
              <th class="py-4 px-4 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 text-xs">
            <tr v-if="filteredProducts.length === 0">
              <td colSpan="7" class="text-center py-12 text-slate-500">
                Không có sản phẩm heo nào trong danh mục
              </td>
            </tr>
            <tr 
              v-else 
              v-for="p in filteredProducts" 
              :key="p.id" 
              class="hover:bg-slate-800/40 transition"
            >
              <td class="py-4 px-5">
                <div class="flex items-center gap-3">
                  <img
                    :src="getProductDisplayImage(p)"
                    alt=""
                    class="w-12 h-12 rounded-xl object-cover border border-slate-700/60 shadow-md shrink-0 cursor-pointer hover:opacity-80 transition"
                    @click="handleOpenEditProduct(p)"
                    @error="handleImgError"
                  />
                  <div>
                    <div class="font-bold text-white text-sm hover:text-amber-400 transition flex items-center gap-1.5 flex-wrap">
                      <span>{{ p.name || p.tenSanPham }}</span>
                      <span 
                        v-if="(p.donViTinh === 'Kg' || p.unit === 'Kg' || p.saleType === 'per_kg' || (p.name && p.name.toLowerCase().includes('theo kg')) || (p.sizeType && p.sizeType.toLowerCase().includes('theo kg'))) && Number(p.soKgTonKho || p.weightKg || p.trongLuongMoiCon) > 0"
                        class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-black border border-emerald-500/30 inline-flex items-center gap-1 shadow-sm"
                      >
                        ⚖️ {{ Number(p.soKgTonKho || p.weightKg || p.trongLuongMoiCon || 0).toLocaleString('vi-VN') }} kg
                      </span>
                    </div>
                    <div class="text-[11px] text-amber-300 font-semibold mt-0.5">
                      {{ p.sizeType || p.loaiSize || 'Heo chuẩn' }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="py-4 px-4 whitespace-nowrap">
                <div class="flex flex-col gap-1 items-start">
                  <!-- Badge 1: Cách Bảo Quản -->
                  <span 
                    :class="[
                      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border',
                      getPreserveBadge(p.porkType || p.loaiHeo).class
                    ]"
                  >
                    <span>{{ getPreserveBadge(p.porkType || p.loaiHeo).icon }}</span>
                    <span>{{ getPreserveBadge(p.porkType || p.loaiHeo).label }}</span>
                  </span>

                  <!-- Badge 2: Đặc Điểm Heo -->
                  <span 
                    :class="[
                      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black border',
                      getPigFeatureBadge(p.pigFeature || p.dacDiemHeo || 'duoi_cut').class
                    ]"
                  >
                    <span>{{ getPigFeatureBadge(p.pigFeature || p.dacDiemHeo || 'duoi_cut').icon }}</span>
                    <span>{{ getPigFeatureBadge(p.pigFeature || p.dacDiemHeo || 'duoi_cut').label }}</span>
                  </span>
                </div>
              </td>

              <td class="py-4 px-4 text-slate-300 font-medium">
                {{ p.supplier?.tenNhaCungCap || p.nhaCungCap?.tenNhaCungCap || 'Trang Trại Ba Vì' }}
              </td>

              <td class="py-4 px-4 text-center">
                <div class="inline-flex flex-col items-center gap-1">
                  <div class="inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl">
                    <span :class="[
                      'text-base font-black',
                      (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)) > 0 ? 'text-emerald-400' : 'text-rose-500'
                    ]">
                      {{ p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0) }}
                    </span>
                    <span class="text-[10px] font-bold text-slate-400">con</span>
                  </div>
                  <span 
                    v-if="(p.donViTinh === 'Kg' || p.unit === 'Kg' || p.saleType === 'per_kg' || (p.name && p.name.toLowerCase().includes('theo kg')) || (p.sizeType && p.sizeType.toLowerCase().includes('theo kg'))) && Number(p.soKgTonKho || p.weightKg || p.trongLuongMoiCon) > 0"
                    class="text-[11px] font-black text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30"
                  >
                    ⚖️ {{ Number(p.soKgTonKho || p.weightKg || p.trongLuongMoiCon || 0).toLocaleString('vi-VN') }} kg
                  </span>
                </div>
              </td>

              <td class="py-4 px-4 text-right font-medium text-slate-400 whitespace-nowrap">
                <div class="font-bold text-slate-200">
                  {{ formatVND(p.costPrice || p.giaNhapVon) }}<span v-if="p.donViTinh === 'Kg' || p.unit === 'Kg' || p.saleType === 'per_kg' || (p.name && p.name.toLowerCase().includes('theo kg'))" class="text-[10px] text-emerald-400 font-bold">/kg</span>
                </div>
                <div v-if="(p.donViTinh === 'Kg' || p.unit === 'Kg' || p.saleType === 'per_kg' || (p.name && p.name.toLowerCase().includes('theo kg'))) && Number(p.soKgTonKho || p.weightKg || p.trongLuongMoiCon) > 0" class="text-[11px] text-amber-400 font-bold mt-0.5">
                  Thành tiền: {{ formatVND((Number(p.soKgTonKho || p.weightKg || p.trongLuongMoiCon || 0)) * (Number(p.costPrice || p.giaNhapVon) || 0)) }}
                </div>
              </td>

              <td class="py-4 px-5">
                <div class="text-slate-300 font-semibold text-[11px]">
                  {{ formatDate(p.importDate || p.ngayNhap) }}
                </div>
                <div class="text-slate-500 text-[11px] italic max-w-xs truncate">
                  {{ p.importDetails || p.chiTietNhap || 'Không có ghi chú' }}
                </div>
              </td>

              <td class="py-4 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    @click="handleOpenEditProduct(p)"
                    class="p-2 rounded-xl bg-slate-950 hover:bg-amber-600 text-slate-300 hover:text-white border border-slate-800 transition active:scale-95 cursor-pointer shadow-sm"
                    title="Chỉnh sửa sản phẩm"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="handleDeleteProduct(p)"
                    class="p-2 rounded-xl bg-slate-950 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-800 transition active:scale-95 cursor-pointer shadow-sm"
                    title="Xóa sản phẩm"
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

    <!-- TAB 2: LỊCH SỬ PHIẾU NHẬP XE & TỔNG KẾT HÀNG HÓA -->
    <div v-if="subTab === 'purchases'" class="space-y-6 animate-in fade-in duration-150">
      <!-- HEADER TỔNG KẾT ĐỘNG THEO BỘ LỌC -->
      <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs uppercase font-black text-amber-400 tracking-wider">Tổng Kết Lịch Sử Nhập Hàng</span>
            <span class="text-xs px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-bold border border-amber-500/30">
              {{ formatPurchaseTimeRangeLabel }}
            </span>
          </div>
          <p class="text-slate-400 text-xs max-w-xl leading-relaxed">
            Tổng hợp toàn bộ chuyến xe khách chở heo về kho, phân bổ tiền xe & quản lý chi tiết từng lô hàng nhập (Lưu trữ 2 năm).
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 sm:gap-4 bg-slate-950/80 p-3 sm:p-4 rounded-2xl border border-slate-800">
          <div class="text-center px-2.5 sm:px-3 border-r border-slate-800">
            <div class="text-[10px] uppercase font-bold text-slate-500">Số Chuyến</div>
            <div class="text-lg sm:text-xl font-black text-white">{{ purchaseStats.totalTrips }}</div>
          </div>
          <div class="text-center px-2.5 sm:px-3 border-r border-slate-800">
            <div class="text-[10px] uppercase font-bold text-slate-500">Tổng Số Con</div>
            <div class="text-lg sm:text-xl font-black text-emerald-400">{{ purchaseStats.totalHeads }} con</div>
          </div>
          <div class="text-center px-2.5 sm:px-3 border-r border-slate-800">
            <div class="text-[10px] uppercase font-bold text-slate-500">Tiền Heo</div>
            <div class="text-xs sm:text-sm font-bold text-slate-300">{{ formatVND(purchaseStats.totalProductCost) }}</div>
          </div>
          <div class="text-center px-2.5 sm:px-3 border-r border-slate-800">
            <div class="text-[10px] uppercase font-bold text-cyan-400">Tiền Xe Khách</div>
            <div class="text-xs sm:text-sm font-bold text-cyan-300">+{{ formatVND(purchaseStats.totalShippingFee) }}</div>
          </div>
          <div class="text-center pl-2">
            <div class="text-[10px] uppercase font-bold text-amber-400">Tổng Tiền Nhập</div>
            <div class="text-lg sm:text-xl font-black text-amber-400">{{ formatVND(purchaseStats.totalCost) }}</div>
          </div>
        </div>
      </div>

      <!-- THANH BỘ LỌC LỊCH SỬ NHẬP XE -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div class="flex items-center gap-2">
            <Truck class="w-5 h-5 text-cyan-400" />
            <h3 class="text-base font-black text-white">Lịch Sử Các Chuyến Xe Nhập Kho</h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {{ filteredPurchases.length }} chuyến xe
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-500 font-mono hidden sm:inline">
              🛡️ Dữ liệu lưu 2 năm (tự động dọn dẹp)
            </span>
            <button
              @click="handleOpenAddImport"
              class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 cursor-pointer"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Nhập Chuyến Mới</span>
            </button>
          </div>
        </div>

        <!-- BỘ LỌC ĐA NĂNG -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
          <!-- 1. Tìm kiếm -->
          <div class="relative lg:col-span-1">
            <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              v-model="purchaseSearch"
              placeholder="Tìm mã PUR, NCC..."
              class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition"
            />
          </div>

          <!-- 2. Lọc Thời Gian -->
          <div>
            <select
              v-model="purchaseTimeRange"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer font-medium"
            >
              <option value="ALL">⏳ Toàn bộ lịch sử (2 năm)</option>
              <option value="TODAY">📅 Hôm nay</option>
              <option value="7DAYS">📅 7 ngày gần nhất</option>
              <option value="30DAYS">📅 30 ngày gần nhất</option>
              <option value="THIS_MONTH">📅 Tháng này</option>
              <option value="THIS_YEAR">📅 Năm nay</option>
              <option value="CUSTOM_DATE">📆 Chọn ngày cụ thể</option>
            </select>
          </div>

          <!-- 2.1 Chọn ngày cụ thể (nếu chọn CUSTOM_DATE) -->
          <div v-if="purchaseTimeRange === 'CUSTOM_DATE'">
            <input
              type="date"
              v-model="purchaseCustomDate"
              class="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-300 outline-none font-bold cursor-pointer"
            />
          </div>

          <!-- 3. Lọc Nhà Cung Cấp -->
          <div>
            <select
              v-model="purchaseSupplierId"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer font-medium"
            >
              <option value="ALL">🏢 Tất cả Nhà Cung Cấp</option>
              <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                {{ sup.tenNhaCungCap || sup.name }}
              </option>
            </select>
          </div>

          <!-- 4. Lọc Cách Bảo Quản -->
          <div>
            <select
              v-model="purchasePreserve"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer font-medium"
            >
              <option value="ALL">🔥 Mọi cách bảo quản</option>
              <option value="hot">🔥 Hàng Nóng (Tươi)</option>
              <option value="cold">❄️ Hàng Lạnh (Cấp Đông)</option>
              <option value="wrapped">📦 Nóng Cuộn Bọc</option>
            </select>
          </div>

          <!-- 5. Lọc Đặc Điểm Heo -->
          <div>
            <select
              v-model="purchaseFeature"
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer font-medium"
            >
              <option value="ALL">🐷 Mọi giống đặc điểm</option>
              <option value="duoi_cut">🐷 Đuôi Cụt</option>
              <option value="duoi_dai">🐖 Đuôi Dài</option>
              <option value="rung_lai">🐗 Rừng Lai</option>
              <option value="mong_cai">🐽 Móng Cái</option>
            </select>
          </div>
        </div>

        <!-- DANH SÁCH THẺ CÁC CHUYẾN XE -->
        <div v-if="filteredPurchases.length === 0" class="text-center py-14 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Truck class="w-6 h-6" />
          </div>
          <p class="text-slate-400 text-xs font-medium">Không tìm thấy chuyến xe nào theo bộ lọc này.</p>
          <button
            @click="handleOpenAddImport"
            class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Nhập Chuyến Xe Heo Mới</span>
          </button>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="(pn, idx) in filteredPurchases" 
            :key="pn.id || idx" 
            class="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl space-y-3 transition shadow-md"
          >
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-mono text-xs font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  {{ pn.maPhieuNhap || `PN-${pn.id}` }}
                </span>
                <span class="text-xs font-bold text-white">
                  🏢 {{ pn.nhaCungCap?.tenNhaCungCap || 'NCC' }}
                </span>
                <span class="text-xs text-slate-400 font-medium">
                  • 📅 {{ formatDate(pn.ngayNhapKho || pn.importDate) }}
                </span>

                <!-- Huy hiệu Bảo quản & Giống heo -->
                <span 
                  :class="[
                    'px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1',
                    getPreserveBadge(pn.loaiHeo || pn.porkType).class
                  ]"
                >
                  <span>{{ getPreserveBadge(pn.loaiHeo || pn.porkType).icon }}</span>
                  <span>{{ getPreserveBadge(pn.loaiHeo || pn.porkType).label }}</span>
                </span>

                <span 
                  :class="[
                    'px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1',
                    getPigFeatureBadge(pn.dacDiemHeo || pn.pigFeature).class
                  ]"
                >
                  <span>{{ getPigFeatureBadge(pn.dacDiemHeo || pn.pigFeature).icon }}</span>
                  <span>{{ getPigFeatureBadge(pn.dacDiemHeo || pn.pigFeature).label }}</span>
                </span>
              </div>

              <div class="flex items-center gap-3">
                <div class="text-right">
                  <span class="text-[10px] uppercase font-bold text-slate-500 block">Tổng Chuyến Xe:</span>
                  <span class="text-base sm:text-lg font-black text-amber-400">
                    {{ formatVND(pn.tongTienNhap || pn.totalCost) }}
                  </span>
                </div>

                <button
                  @click="handleOpenEditPurchase(pn)"
                  class="p-2 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 border border-slate-800 transition cursor-pointer"
                  title="Chỉnh sửa chuyến xe này (toàn bộ các size)"
                >
                  <Edit2 class="w-4 h-4" />
                </button>

                <button
                  @click="handleDeletePurchase(pn)"
                  class="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
                  title="Xóa chuyến xe này"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Bảng con chi tiết các size heo trong chuyến -->
            <div v-if="pn.danhSachChiTiet && pn.danhSachChiTiet.length > 0" class="overflow-x-auto bg-slate-900/60 rounded-xl border border-slate-800/80 p-2.5">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="text-[10px] uppercase text-slate-500 font-bold border-b border-slate-800/80">
                    <th class="pb-1.5 pl-2">Loại Size</th>
                    <th class="pb-1.5 text-center">Số Con</th>
                    <th class="pb-1.5 text-right">Đơn Giá Nhập</th>
                    <th class="pb-1.5 pr-2 text-right">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/40 font-medium">
                  <tr v-for="it in pn.danhSachChiTiet" :key="it.id">
                    <td class="py-2 pl-2 font-bold text-slate-200">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span>🐷 {{ it.loaiSize || it.sizeType || 'Heo chuẩn' }}</span>
                        <span 
                          v-if="it.donViTinh === 'Kg' || it.unit === 'Kg' || Number(it.soKg) > 0"
                          class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30"
                        >
                          ⚖️ {{ Number(it.soKg || it.weightKg || 0).toLocaleString('vi-VN') }} kg
                        </span>
                      </div>
                    </td>
                    <td class="py-2 text-center text-emerald-400 font-bold">
                      <span v-if="it.donViTinh === 'Kg' || it.unit === 'Kg' || Number(it.soKg) > 0">
                        {{ it.soLuongCon || it.headCount || 1 }} con <span class="text-[11px] text-slate-400 font-normal">({{ Number(it.soKg || it.weightKg || 0).toLocaleString('vi-VN') }} kg)</span>
                      </span>
                      <span v-else>
                        {{ it.soLuongCon || it.headCount || 0 }} con
                      </span>
                    </td>
                    <td class="py-2 text-right text-slate-300 font-medium">
                      {{ formatVND(it.giaNhapVon || it.costPrice) }}<span v-if="it.donViTinh === 'Kg' || it.unit === 'Kg'" class="text-[10px] text-emerald-400 font-bold">/kg</span>
                    </td>
                    <td class="py-2 pr-2 text-right text-amber-400 font-bold">
                      {{ formatVND(it.thanhTienHang || (Number(it.soKg) > 0 ? (Number(it.soKg) * Number(it.giaNhapVon)) : ((it.soLuongCon || 0) * (it.giaNhapVon || 0)))) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tóm tắt chi phí phân bổ chuyến xe -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
              <div>
                <span class="text-slate-500">Tiền hàng heo: </span>
                <span class="font-bold text-slate-200">{{ formatVND(pn.tienHangHeo || pn.totalProductCost) }}</span>
              </div>
              <div>
                <span class="text-slate-500">Tiền xe khách: </span>
                <span class="font-bold text-cyan-400">
                  +{{ formatVND(pn.chiPhiTienXe || pn.shippingFee) }}
                </span>
                <span class="text-[10px] text-slate-500 ml-1">
                  ({{ pn.nguoiChiuTienXe === 'supplier' ? 'NCC chịu' : 'Mình chịu' }})
                </span>
              </div>
              <div>
                <span class="text-slate-500">Ghi chú: </span>
                <span class="text-slate-300 italic">{{ pn.ghiChu || pn.notes || 'Không ghi chú' }}</span>
              </div>
            </div>
            <!-- Ảnh thực tế chuyến xe (nếu có) -->
            <div v-if="getPurchaseImages(pn).length > 0" class="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="openPurchaseGallery(pn)"
                  class="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Camera class="w-3.5 h-3.5" />
                  <span>📸 Xem {{ getPurchaseImages(pn).length }} ảnh thực tế chuyến xe</span>
                </button>
                <span class="text-[11px] text-slate-400">Ảnh heo mới về, heo xấu đối chiếu</span>
              </div>
              <div class="flex items-center gap-1.5 overflow-x-auto py-0.5">
                <img
                  v-for="(pImg, pIdx) in getPurchaseImages(pn).slice(0, 5)"
                  :key="pIdx"
                  :src="pImg"
                  @click="openPurchaseGallery(pn, pIdx)"
                  class="w-9 h-9 rounded-lg object-cover border border-slate-700 cursor-pointer hover:scale-105 transition shrink-0"
                />
                <span v-if="getPurchaseImages(pn).length > 5" class="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 rounded bg-slate-800">
                  +{{ getPurchaseImages(pn).length - 5 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL NHẬP CHUYẾN XE HEO MỚI -->
    <div 
      v-if="showImportModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        class="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
              <Truck class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-lg font-black text-white">Lập Phiếu Nhập Chuyến Xe Heo Mới</h2>
              <p class="text-xs text-slate-400">Nhập theo từng size heo, tiền xe khách & tự động cộng tồn kho</p>
            </div>
          </div>
          <button
            type="button"
            @click="handleCloseImportModal"
            class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSaveImport" class="space-y-5">
          <!-- THÔNG TIN CHUYẾN XE & ĐẶC ĐIỂM -->
          <div class="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 class="w-4 h-4 text-cyan-400" />
                  <span>Nhà Cung Cấp / Trang Trại <span class="text-rose-500">*</span></span>
                </label>
                <select
                  v-model="importForm.supplierId"
                  class="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer font-bold transition"
                >
                  <option value="" disabled>-- Chọn Nhà Cung Cấp / Trang Trại --</option>
                  <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                    🏢 {{ sup.tenNhaCungCap || sup.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <span>📅</span>
                  <span>Ngày Nhập Chuyến Xe <span class="text-rose-500">*</span></span>
                </label>
                <input
                  type="date"
                  v-model="importForm.importDate"
                  class="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold cursor-pointer transition"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-800/80">
              <div>
                <label class="block text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                  <span>🔥</span>
                  <span>Cách Bảo Quản <span class="text-rose-500">*</span></span>
                </label>
                <select
                  v-model="importForm.porkType"
                  class="w-full bg-slate-900 border border-amber-500/40 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold cursor-pointer transition"
                >
                  <option value="hot">🔥 Hàng Nóng (Tươi Sống)</option>
                  <option value="cold">❄️ Hàng Lạnh (Cấp Đông)</option>
                  <option value="wrapped">📦 Hàng Nóng Cuộn Bọc</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-rose-300 mb-1.5 flex items-center gap-1.5">
                  <span>🐷</span>
                  <span>Đặc Điểm Giống Heo <span class="text-rose-500">*</span></span>
                </label>
                <select
                  v-model="importForm.pigFeature"
                  class="w-full bg-slate-900 border border-rose-500/40 focus:border-rose-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold cursor-pointer transition"
                >
                  <option value="duoi_cut">🐷 Đuôi Cụt</option>
                  <option value="duoi_dai">🐖 Đuôi Dài</option>
                  <option value="rung_lai">🐗 Rừng Lai</option>
                  <option value="mong_cai">🐽 Móng Cái</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Các size heo trong chuyến xe -->
          <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="text-xs font-black uppercase text-amber-400">Các Size Heo Trong Chuyến Xe</span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="handleAddItemRow('per_size')"
                  class="px-3 py-1.5 bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                >
                  + Thêm Dòng Size
                </button>
                <button
                  type="button"
                  @click="handleAddItemRow('per_kg')"
                  class="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 shadow-sm"
                >
                  + Thêm Dòng Nhập Theo Kg
                </button>
              </div>
            </div>

            <div class="space-y-2.5">
              <div 
                v-for="(item, idx) in importForm.items" 
                :key="idx" 
                :class="[
                  'p-3 rounded-xl border transition',
                  item.entryType === 'per_kg' || item.unit === 'Kg'
                    ? 'bg-emerald-950/20 border-emerald-500/30 space-y-2'
                    : 'bg-slate-900/90 border-slate-800'
                ]"
              >
                <!-- DÒNG NHẬP THEO KG (TỪNG CON RIÊNG BIỆT) -->
                <div v-if="item.entryType === 'per_kg' || item.unit === 'Kg'" class="space-y-2">
                  <div class="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                    <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                      <Scale class="w-3 h-3 text-emerald-400" />
                      <span>HEO BÁN THEO KG (TỪNG CON RIÊNG BIỆT)</span>
                    </span>
                    <span class="text-[10px] text-slate-400 font-medium">Mỗi con có số kg & đơn giá riêng</span>
                  </div>

                  <div class="flex flex-wrap items-center gap-2">
                    <div class="flex-1 min-w-[140px]">
                      <label class="block text-[10px] text-slate-400 mb-1">Tên / Phân Loại Heo</label>
                      <input
                        type="text"
                        v-model="item.sizeType"
                        placeholder="VD: Heo lớn, Heo thịt..."
                        class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div class="w-24">
                      <label class="block text-[10px] text-slate-400 mb-1">Số Con</label>
                      <input
                        type="number"
                        min="1"
                        v-model.number="item.headCount"
                        class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-black text-white outline-none"
                      />
                    </div>

                    <div class="w-28">
                      <label class="block text-[10px] text-emerald-400 font-bold mb-1">Số Kg Con Này</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="VD: 18.5"
                        v-model.number="item.weightKg"
                        class="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-2 py-1.5 text-xs font-black text-emerald-400 outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div class="w-32">
                      <label class="block text-[10px] text-slate-400 mb-1">Giá Nhập / Kg (đ)</label>
                      <input
                        type="text"
                        inputmode="numeric"
                        :value="formatNumber(item.costPrice)"
                        @input="handleCurrencyInput($event, item, 'costPrice')"
                        placeholder="80.000"
                        class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-200 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div class="w-32 text-right">
                      <label class="block text-[10px] text-slate-400 mb-1">Thành Tiền Con</label>
                      <div class="text-xs font-bold text-amber-400 py-1.5">
                        {{ formatVND((Number(item.weightKg) || 0) * (Number(item.costPrice) || 0)) }}
                      </div>
                    </div>

                    <button
                      v-if="importForm.items.length > 1"
                      type="button"
                      @click="handleRemoveItemRow(idx)"
                      class="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition mt-4 cursor-pointer"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- DÒNG NHẬP THEO SIZE THÔNG THƯỜNG -->
                <div v-else class="flex flex-wrap items-center gap-2">
                  <div class="flex-1 min-w-[140px]">
                    <label class="block text-[10px] text-slate-400 mb-1">Chọn Ô Heo / Size</label>
                    <select
                      v-model="item.sizeType"
                      @change="handleSizeSelect(item)"
                      class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="" disabled>{{ availableSizeOptions.length === 0 ? '-- Chưa có cấu hình size trong Quản lý Size --' : '-- Chọn Ô Heo / Size --' }}</option>
                      <option v-for="fs in availableSizeOptions" :key="fs.name" :value="fs.name">
                        {{ fs.name }}
                      </option>
                    </select>
                  </div>

                  <div class="w-24">
                    <label class="block text-[10px] text-slate-400 mb-1">Số Con</label>
                    <input
                      type="number"
                      min="1"
                      v-model.number="item.headCount"
                      class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-black text-emerald-400 outline-none"
                    />
                  </div>

                  <div class="w-32">
                    <label class="block text-[10px] text-slate-400 mb-1">Giá Nhập/Con</label>
                    <input
                      type="text"
                      inputmode="numeric"
                      :value="formatNumber(item.costPrice)"
                      @input="handleCurrencyInput($event, item, 'costPrice')"
                      class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-200 outline-none"
                    />
                  </div>

                  <div class="w-28 text-right">
                    <label class="block text-[10px] text-slate-400 mb-1">Thành Tiền</label>
                    <div class="text-xs font-bold text-amber-400 py-1.5">
                      {{ formatVND((Number(item.headCount) || 0) * (Number(item.costPrice) || 0)) }}
                    </div>
                  </div>

                  <button
                    v-if="importForm.items.length > 1"
                    type="button"
                    @click="handleRemoveItemRow(idx)"
                    class="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition mt-4 cursor-pointer"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tiền xe khách, tiền bãi & Thanh toán -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <label class="block text-xs font-bold text-cyan-400 mb-1.5 flex items-center gap-1">
                <Truck class="w-3.5 h-3.5" />
                <span>Tiền Xe Khách Chở Tới</span>
              </label>
              <div class="relative">
                <input
                  type="text"
                  inputmode="numeric"
                  :value="formatNumber(importForm.shippingFee)"
                  @input="handleCurrencyInput($event, importForm, 'shippingFee')"
                  placeholder="500.000"
                  class="w-full bg-slate-900 border border-cyan-500/40 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-cyan-300 outline-none"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">đ</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1">
                <span>🅿️ Tiền Bến Bãi / Bốc Xếp</span>
              </label>
              <div class="relative">
                <input
                  type="text"
                  inputmode="numeric"
                  :value="formatNumber(importForm.parkingFee)"
                  @input="handleCurrencyInput($event, importForm, 'parkingFee')"
                  placeholder="10.000"
                  class="w-full bg-slate-900 border border-amber-500/40 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-amber-300 outline-none"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">đ</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                Hình Thức Thanh Toán
              </label>
              <div class="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  @click="importForm.paymentMethod = 'Cash'"
                  :class="[
                    'py-2 rounded-xl text-xs font-bold transition cursor-pointer',
                    importForm.paymentMethod === 'Cash' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  ]"
                >
                  💵 Tiền Mặt
                </button>
                <button
                  type="button"
                  @click="importForm.paymentMethod = 'Bank'"
                  :class="[
                    'py-2 rounded-xl text-xs font-bold transition cursor-pointer',
                    importForm.paymentMethod === 'Bank' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  ]"
                >
                  🏦 Chuyển Khoản
                </button>
              </div>
            </div>

            <!-- BUTTON CHỌN MÌNH CHỊU HOẶC NCC CHỊU TIỀN XE & BÃI -->
            <div class="col-span-1 sm:col-span-3 pt-2.5 border-t border-slate-800/80">
              <label class="block text-xs font-black text-amber-300 mb-2 flex items-center gap-1.5">
                <Truck class="w-4 h-4 text-cyan-400" />
                <span>Chi Phí Tiền Xe & Bến Bãi Phát Sinh Do Ai Chịu:</span>
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  @click="importForm.shippingPayer = 'buyer'"
                  :class="[
                    'p-3 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer border',
                    importForm.shippingPayer === 'buyer'
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500 shadow-lg shadow-blue-600/20 ring-1 ring-blue-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-base">👤</span>
                    <div class="text-left">
                      <div class="font-black text-white text-xs">Mình Chịu (Mặc định)</div>
                      <div class="text-[10px] text-slate-400 font-normal">Cộng tiền xe vào giá vốn heo</div>
                    </div>
                  </div>
                  <span v-if="importForm.shippingPayer === 'buyer'" class="text-xs text-blue-400">✓ Đang chọn</span>
                </button>

                <button
                  type="button"
                  @click="importForm.shippingPayer = 'supplier'"
                  :class="[
                    'p-3 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer border',
                    importForm.shippingPayer === 'supplier'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-base">🏭</span>
                    <div class="text-left">
                      <div class="font-black text-amber-400 text-xs">NCC Chịu (Bao Tiền Xe)</div>
                      <div class="text-[10px] text-slate-300 font-normal">Trừ tiền vào TK NCC & Giữ nguyên giá vốn</div>
                    </div>
                  </div>
                  <span v-if="importForm.shippingPayer === 'supplier'" class="text-xs text-amber-400">✓ Đang chọn</span>
                </button>
              </div>
            </div>

            <div v-if="importForm.paymentMethod === 'Bank'" class="col-span-1 sm:col-span-3">
              <label class="block text-xs font-bold text-slate-300 mb-1">
                Trừ Tiền Từ Tài Khoản Ngân Hàng Nào:
              </label>
              <select
                v-model="importForm.bankAccountId"
                class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer font-medium"
              >
                <option v-for="b in supplierBankAccounts" :key="b.id" :value="b.id">
                  [🏭 NCC: {{ getSupplierNameForBank(b) }}] {{ b.bankName || b.tenNganHang }} - {{ b.accountNumber || b.soTaiKhoan }} ({{ b.accountHolder || b.chuTaiKhoan }}) - Dư: {{ formatVND(b.balance || b.soDuHienTai) }}
                </option>
              </select>
            </div>
          </div>

          <!-- BẢNG TỔNG KẾT & TÍNH GIÁ VỐN THỰC TẾ / CON -->
          <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2.5">
            <div class="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span class="text-slate-400">Tổng tiền hàng mua NCC:</span>
              <span class="font-bold text-white">{{ formatVND(totalProductCost) }}</span>
            </div>

            <div class="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span class="text-cyan-400">
                Tiền xe ({{ formatVND(importForm.shippingFee) }}) + Tiền bãi ({{ formatVND(importForm.parkingFee) }}):
              </span>
              <div class="text-right">
                <span :class="['font-bold', importForm.shippingPayer === 'supplier' ? 'text-rose-400' : 'text-cyan-300']">
                  {{ importForm.shippingPayer === 'supplier' ? `-${formatVND((Number(importForm.shippingFee) || 0) + (Number(importForm.parkingFee) || 0))}` : `+${formatVND((Number(importForm.shippingFee) || 0) + (Number(importForm.parkingFee) || 0))}` }}
                </span>
                <span :class="['block text-[10px] font-bold', importForm.shippingPayer === 'supplier' ? 'text-amber-400' : 'text-blue-400']">
                  ({{ importForm.shippingPayer === 'supplier' ? 'NCC Chịu - Trừ tiền xe vào tiền hàng NCC' : 'Mình Chịu - Cộng tiền xe vào vốn heo' }})
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-1">
              <div>
                <span class="text-xs text-slate-400 uppercase font-bold block">Tổng Chi Phí Chuyến Xe:</span>
                <span class="text-[10px] text-amber-300 font-medium">
                  Tổng {{ totalHeadCountInTrip }} con • 
                  <strong class="text-white">
                    {{ importForm.shippingPayer === 'supplier' ? `Giảm ${formatVND(Math.abs(extraCostPerHead))}/con (trừ tiền xe)` : `+${formatVND(extraCostPerHead)}/con (tiền xe)` }}
                  </strong>
                </span>
              </div>
              <div class="text-right">
                <div class="text-xl font-black text-amber-400">
                  {{ formatVND(totalTripCost) }}
                </div>
                <div class="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 mt-1 inline-block">
                  Giá vốn heo: ~{{ formatVND(unitCostAllocated) }}/con
                </div>
              </div>
            </div>

            <!-- CHÚ THÍCH TRỪ TIỀN VÀO TÀI KHOẢN NCC -->
            <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 space-y-0.5">
              <div class="font-bold flex items-center gap-1">
                <span>{{ importForm.shippingPayer === 'supplier' ? '🏭 NCC Chịu Tiền Xe:' : '👤 Mình Chịu Tiền Xe:' }}</span>
              </div>
              <div class="text-slate-300">
                {{ importForm.shippingPayer === 'supplier' 
                  ? `Nợ NCC / Tiền trả NCC: ${formatVND(totalTripCost)} (Tiền hàng ${formatVND(totalProductCost)} trừ ${formatVND((Number(importForm.shippingFee) || 0) + (Number(importForm.parkingFee) || 0))} tiền xe). Giá vốn heo: ~${formatVND(unitCostAllocated)}/con.`
                  : `Nợ NCC: ${formatVND(totalProductCost)}. Tổng chi phí chuyến xe gồm tiền xe: ${formatVND(totalTripCost)}. Giá vốn heo: ~${formatVND(unitCostAllocated)}/con.` }}
              </div>
            </div>
          </div>

          <!-- ẢNH THỰC TẾ CHUYẾN XE (HEO MỚI VỀ, HEO XẤU, HEO LỖI) -->
          <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <Camera class="w-4 h-4 text-cyan-400" />
                <span>Ảnh Thực Tế Chuyến Xe (Hàng mới về, heo xấu/lỗi để đối chiếu)</span>
              </label>
              <span class="text-[10px] text-slate-400 font-bold">
                {{ importForm.images?.length || 0 }} ảnh thực tế
              </span>
            </div>

            <div class="space-y-2.5">
              <div class="flex flex-wrap items-center gap-2">
                <label class="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 shadow-sm">
                  <Upload class="w-4 h-4" />
                  <span>+ Chụp / Chọn Ảnh Heo Thực Tế</span>
                  <input type="file" multiple accept="image/*" class="hidden" @change="handleUploadImportImages" />
                </label>
                <span class="text-[11px] text-slate-500">Chụp ảnh heo thực tế, heo sẹo, gãy đuôi để làm chứng cứ lưu trữ với nhà xe & trại</span>
              </div>

              <!-- Thumbnails Preview Grid -->
              <div v-if="importForm.images && importForm.images.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                <div v-for="(img, imgIdx) in importForm.images" :key="imgIdx" class="relative group rounded-xl overflow-hidden aspect-square border border-slate-800 bg-slate-900">
                  <img :src="img" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    @click="importForm.images.splice(imgIdx, 1)"
                    class="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600/90 text-white flex items-center justify-center text-xs hover:bg-rose-500 shadow-md transition cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    ✕
                  </button>
                  <span class="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-amber-300">
                    #{{ imgIdx + 1 }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Ghi Chú Chuyến Xe</label>
            <input
              type="text"
              v-model="importForm.notes"
              placeholder="VD: Xe khách chuyến 5h sáng, có 10 con 5kg, tiền xe 500k, bãi 10k..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              @click="handleCloseImportModal"
              class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition cursor-pointer"
            >
              Xác Nhận Nhập Chuyến Xe
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL CHỈNH SỬA THÔNG TIN NHẬP HÀNG -->
    <div 
      v-if="showEditModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        class="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <!-- Tiêu đề Modal -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
              <Edit2 class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-base font-black text-white">Chỉnh Sửa Thông Tin Nhập Hàng Heo</h3>
              <p class="text-xs text-slate-400">Cập nhật kích cỡ, số con, giá nhập, tiền xe bãi & tự động cân đối lại tài khoản NCC</p>
            </div>
          </div>
          <button
            @click="showEditModal = false"
            class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSaveEditProduct" class="space-y-5">
          <!-- THÔNG TIN CHUYẾN XE & ĐẶC ĐIỂM -->
          <div class="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 class="w-4 h-4 text-amber-400" />
                  <span>Nhà Cung Cấp / Trang Trại <span class="text-rose-500">*</span></span>
                </label>
                <select
                  v-model="editForm.supplierId"
                  class="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer font-bold transition"
                >
                  <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                    🏢 {{ sup.tenNhaCungCap || sup.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <span>📅</span>
                  <span>Ngày Nhập Chuyến Xe <span class="text-rose-500">*</span></span>
                </label>
                <input
                  type="date"
                  v-model="editForm.importDate"
                  class="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold cursor-pointer transition"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-800/80">
              <div>
                <label class="block text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                  <span>🔥</span>
                  <span>Cách Bảo Quản <span class="text-rose-500">*</span></span>
                </label>
                <select
                  v-model="editForm.porkType"
                  class="w-full bg-slate-900 border border-amber-500/40 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold cursor-pointer transition"
                >
                  <option value="hot">🔥 Hàng Nóng (Tươi Sống)</option>
                  <option value="cold">❄️ Hàng Lạnh (Cấp Đông)</option>
                  <option value="wrapped">📦 Hàng Nóng Cuộn Bọc</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-rose-300 mb-1.5 flex items-center gap-1.5">
                  <span>🐷</span>
                  <span>Đặc Điểm Giống Heo <span class="text-rose-500">*</span></span>
                </label>
                <select
                  v-model="editForm.pigFeature"
                  class="w-full bg-slate-900 border border-rose-500/40 focus:border-rose-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold cursor-pointer transition"
                >
                  <option value="duoi_cut">🐷 Đuôi Cụt</option>
                  <option value="duoi_dai">🐖 Đuôi Dài</option>
                  <option value="rung_lai">🐗 Rừng Lai</option>
                  <option value="mong_cai">🐽 Móng Cái</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Các size heo trong chuyến xe -->
          <div class="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="text-xs font-black uppercase text-amber-400">Các Size Heo Trong Chuyến Xe</span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="handleAddEditItemRow('per_size')"
                  class="px-3 py-1.5 bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                >
                  + Thêm Dòng Size
                </button>
                <button
                  type="button"
                  @click="handleAddEditItemRow('per_kg')"
                  class="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 shadow-sm"
                >
                  + Thêm Dòng Nhập Theo Kg
                </button>
              </div>
            </div>

            <div class="space-y-2.5">
              <div 
                v-for="(item, idx) in editForm.items" 
                :key="idx" 
                :class="[
                  'p-3 rounded-xl border transition',
                  item.entryType === 'per_kg' || item.unit === 'Kg'
                    ? 'bg-emerald-950/20 border-emerald-500/30 space-y-2'
                    : 'bg-slate-900/90 border-slate-800'
                ]"
              >
                <!-- DÒNG NHẬP THEO KG TRONG MODAL EDIT -->
                <div v-if="item.entryType === 'per_kg' || item.unit === 'Kg'" class="space-y-2">
                  <div class="flex items-center justify-between pb-1 border-b border-emerald-500/20">
                    <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
                      <Scale class="w-3 h-3 text-emerald-400" />
                      <span>HEO BÁN THEO KG (TỪNG CON RIÊNG BIỆT)</span>
                    </span>
                    <span class="text-[10px] text-slate-400 font-medium">Mỗi con có số kg & đơn giá riêng</span>
                  </div>

                  <div class="flex flex-wrap items-center gap-2">
                    <div class="flex-1 min-w-[140px]">
                      <label class="block text-[10px] text-slate-400 mb-1">Tên / Phân Loại Heo</label>
                      <input
                        type="text"
                        v-model="item.sizeType"
                        placeholder="VD: Heo lớn, Heo thịt..."
                        class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div class="w-24">
                      <label class="block text-[10px] text-slate-400 mb-1">Số Con</label>
                      <input
                        type="number"
                        min="1"
                        v-model.number="item.headCount"
                        class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-black text-white outline-none"
                      />
                    </div>

                    <div class="w-28">
                      <label class="block text-[10px] text-emerald-400 font-bold mb-1">Số Kg Con Này</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="VD: 18.5"
                        v-model.number="item.weightKg"
                        class="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-2 py-1.5 text-xs font-black text-emerald-400 outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div class="w-32">
                      <label class="block text-[10px] text-slate-400 mb-1">Giá Nhập / Kg (đ)</label>
                      <input
                        type="text"
                        inputmode="numeric"
                        :value="formatNumber(item.costPrice)"
                        @input="handleCurrencyInput($event, item, 'costPrice')"
                        placeholder="80.000"
                        class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-200 outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div class="w-32 text-right">
                      <label class="block text-[10px] text-slate-400 mb-1">Thành Tiền Con</label>
                      <div class="text-xs font-bold text-amber-400 py-1.5">
                        {{ formatVND((Number(item.weightKg) || 0) * (Number(item.costPrice) || 0)) }}
                      </div>
                    </div>

                    <button
                      v-if="editForm.items.length > 1"
                      type="button"
                      @click="handleRemoveEditItemRow(idx)"
                      class="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition mt-4 cursor-pointer"
                      title="Xóa dòng này"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- DÒNG NHẬP THEO SIZE THÔNG THƯỜNG -->
                <div v-else class="flex flex-wrap items-center gap-2">
                  <div class="flex-1 min-w-[140px]">
                    <label class="block text-[10px] text-slate-400 mb-1">Chọn Ô Heo / Size</label>
                    <select
                      v-model="item.sizeType"
                      @change="handleSizeSelect(item)"
                      class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="" disabled>{{ availableSizeOptions.length === 0 ? '-- Chưa có cấu hình size trong Quản lý Size --' : '-- Chọn Ô Heo / Size --' }}</option>
                      <option v-for="fs in availableSizeOptions" :key="fs.name" :value="fs.name">
                        {{ fs.name }}
                      </option>
                    </select>
                  </div>

                  <div class="w-24">
                    <label class="block text-[10px] text-slate-400 mb-1">Số Con</label>
                    <input
                      type="number"
                      min="1"
                      v-model.number="item.headCount"
                      class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-black text-emerald-400 outline-none"
                    />
                  </div>

                  <div class="w-32">
                    <label class="block text-[10px] text-slate-400 mb-1">Giá Nhập/Con</label>
                    <input
                      type="text"
                      inputmode="numeric"
                      :value="formatNumber(item.costPrice)"
                      @input="handleCurrencyInput($event, item, 'costPrice')"
                      class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-200 outline-none"
                    />
                  </div>

                  <div class="w-28 text-right">
                    <label class="block text-[10px] text-slate-400 mb-1">Thành Tiền</label>
                    <div class="text-xs font-bold text-amber-400 py-1.5">
                      {{ formatVND((Number(item.headCount) || 0) * (Number(item.costPrice) || 0)) }}
                    </div>
                  </div>

                  <button
                    v-if="editForm.items.length > 1"
                    type="button"
                    @click="handleRemoveEditItemRow(idx)"
                    class="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition mt-4 cursor-pointer"
                    title="Xóa dòng size này"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tiền xe khách, tiền bãi & Thanh toán -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <label class="block text-xs font-bold text-cyan-400 mb-1.5 flex items-center gap-1">
                <Truck class="w-3.5 h-3.5" />
                <span>Tiền Xe Khách Chở Tới</span>
              </label>
              <div class="relative">
                <input
                  type="text"
                  inputmode="numeric"
                  :value="formatNumber(editForm.shippingFee)"
                  @input="handleCurrencyInput($event, editForm, 'shippingFee')"
                  placeholder="500.000"
                  class="w-full bg-slate-900 border border-cyan-500/40 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-cyan-300 outline-none"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">đ</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1">
                <span>🅿️ Tiền Bến Bãi / Bốc Xếp</span>
              </label>
              <div class="relative">
                <input
                  type="text"
                  inputmode="numeric"
                  :value="formatNumber(editForm.parkingFee)"
                  @input="handleCurrencyInput($event, editForm, 'parkingFee')"
                  placeholder="10.000"
                  class="w-full bg-slate-900 border border-amber-500/40 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-amber-300 outline-none"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">đ</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                Hình Thức Thanh Toán
              </label>
              <div class="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  @click="editForm.paymentMethod = 'Cash'"
                  :class="[
                    'py-2 rounded-xl text-xs font-bold transition cursor-pointer',
                    editForm.paymentMethod === 'Cash' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  ]"
                >
                  💵 Tiền Mặt
                </button>
                <button
                  type="button"
                  @click="editForm.paymentMethod = 'Bank'"
                  :class="[
                    'py-2 rounded-xl text-xs font-bold transition cursor-pointer',
                    editForm.paymentMethod === 'Bank' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  ]"
                >
                  🏦 Chuyển Khoản
                </button>
              </div>
            </div>

            <!-- BUTTON CHỌN MÌNH CHỊU HOẶC NCC CHỊU TIỀN XE & BÃI -->
            <div class="col-span-1 sm:col-span-3 pt-2.5 border-t border-slate-800/80">
              <label class="block text-xs font-black text-amber-300 mb-2 flex items-center gap-1.5">
                <Truck class="w-4 h-4 text-cyan-400" />
                <span>Chi Phí Tiền Xe & Bến Bãi Phát Sinh Do Ai Chịu:</span>
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  @click="editForm.shippingPayer = 'buyer'"
                  :class="[
                    'p-3 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer border',
                    editForm.shippingPayer === 'buyer'
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500 shadow-lg shadow-blue-600/20 ring-1 ring-blue-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-base">👤</span>
                    <div class="text-left">
                      <div class="font-black text-white text-xs">Mình Chịu (Mặc định)</div>
                      <div class="text-[10px] text-slate-400 font-normal">Cộng tiền xe vào giá vốn heo</div>
                    </div>
                  </div>
                  <span v-if="editForm.shippingPayer === 'buyer'" class="text-xs text-blue-400">✓ Đang chọn</span>
                </button>

                <button
                  type="button"
                  @click="editForm.shippingPayer = 'supplier'"
                  :class="[
                    'p-3 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer border',
                    editForm.shippingPayer === 'supplier'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-base">🏭</span>
                    <div class="text-left">
                      <div class="font-black text-amber-400 text-xs">NCC Chịu (Bao Tiền Xe)</div>
                      <div class="text-[10px] text-slate-300 font-normal">Trừ tiền vào TK NCC & Giữ nguyên giá vốn</div>
                    </div>
                  </div>
                  <span v-if="editForm.shippingPayer === 'supplier'" class="text-xs text-amber-400">✓ Đang chọn</span>
                </button>
              </div>
            </div>

            <div v-if="editForm.paymentMethod === 'Bank'" class="col-span-1 sm:col-span-3">
              <label class="block text-xs font-bold text-slate-300 mb-1">
                Trừ Tiền Từ Tài Khoản Ngân Hàng Nào:
              </label>
              <select
                v-model="editForm.bankAccountId"
                class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer font-medium"
              >
                <option v-for="b in supplierBankAccounts" :key="b.id" :value="b.id">
                  [🏭 NCC: {{ getSupplierNameForBank(b) }}] {{ b.bankName || b.tenNganHang }} - {{ b.accountNumber || b.soTaiKhoan }} ({{ b.accountHolder || b.chuTaiKhoan }}) - Dư: {{ formatVND(b.balance || b.soDuHienTai) }}
                </option>
              </select>
            </div>
          </div>

          <!-- BẢNG TỔNG KẾT & TÍNH GIÁ VỐN THỰC TẾ / CON -->
          <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2.5">
            <div class="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span class="text-slate-400">Tổng tiền hàng mua NCC:</span>
              <span class="font-bold text-white">{{ formatVND(editTotalProductCost) }}</span>
            </div>

            <div class="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span class="text-cyan-400">
                Tiền xe ({{ formatVND(editForm.shippingFee) }}) + Tiền bãi ({{ formatVND(editForm.parkingFee) }}):
              </span>
              <div class="text-right">
                <span :class="['font-bold', editForm.shippingPayer === 'supplier' ? 'text-rose-400' : 'text-cyan-300']">
                  {{ editForm.shippingPayer === 'supplier' ? `-${formatVND((Number(editForm.shippingFee) || 0) + (Number(editForm.parkingFee) || 0))}` : `+${formatVND((Number(editForm.shippingFee) || 0) + (Number(editForm.parkingFee) || 0))}` }}
                </span>
                <span :class="['block text-[10px] font-bold', editForm.shippingPayer === 'supplier' ? 'text-amber-400' : 'text-blue-400']">
                  ({{ editForm.shippingPayer === 'supplier' ? 'NCC Chịu - Trừ tiền xe vào tiền hàng NCC' : 'Mình Chịu - Cộng tiền xe vào vốn heo' }})
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-1">
              <div>
                <span class="text-xs text-slate-400 uppercase font-bold block">Tổng Chi Phí Chuyến Xe:</span>
                <span class="text-[10px] text-amber-300 font-medium">
                  Tổng {{ editTotalHeadCountInTrip }} con • 
                  <strong class="text-white">
                    {{ editForm.shippingPayer === 'supplier' ? `Giảm ${formatVND(Math.abs(editExtraCostPerHead))}/con (trừ tiền xe)` : `+${formatVND(editExtraCostPerHead)}/con (tiền xe)` }}
                  </strong>
                </span>
              </div>
              <div class="text-right">
                <div class="text-xl font-black text-amber-400">
                  {{ formatVND(editTotalTripCost) }}
                </div>
                <div class="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 mt-1 inline-block">
                  Giá vốn heo: ~{{ formatVND(editUnitCostAllocated) }}/con
                </div>
              </div>
            </div>

            <!-- CHÚ THÍCH CÂN ĐỐI TÀI KHOẢN NCC -->
            <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 space-y-0.5">
              <div class="font-bold flex items-center gap-1">
                <span>{{ editForm.shippingPayer === 'supplier' ? '🏭 NCC Chịu Tiền Xe:' : '👤 Mình Chịu Tiền Xe:' }}</span>
              </div>
              <div class="text-slate-300">
                {{ editForm.shippingPayer === 'supplier' 
                  ? `Nợ NCC / Tiền trả NCC: ${formatVND(editTotalTripCost)} (Tiền hàng ${formatVND(editTotalProductCost)} trừ ${formatVND((Number(editForm.shippingFee) || 0) + (Number(editForm.parkingFee) || 0))} tiền xe). Giá vốn heo: ~${formatVND(editUnitCostAllocated)}/con.` 
                  : `Nợ NCC: ${formatVND(editTotalProductCost)}. Tổng chi phí chuyến xe gồm tiền xe: ${formatVND(editTotalTripCost)}. Giá vốn heo: ~${formatVND(editUnitCostAllocated)}/con.` }}
              </div>
            </div>
          </div>
          <!-- ẢNH THỰC TẾ CHUYẾN XE (HEO MỚI VỀ, HEO XẤU, HEO LỖI) -->
          <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <Camera class="w-4 h-4 text-cyan-400" />
                <span>Ảnh Thực Tế Chuyến Xe (Hàng mới về, heo xấu/lỗi để đối chiếu)</span>
              </label>
              <span class="text-[10px] text-slate-400 font-bold">
                {{ editForm.images?.length || 0 }} ảnh thực tế
              </span>
            </div>

            <div class="space-y-2.5">
              <div class="flex flex-wrap items-center gap-2">
                <label class="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 shadow-sm">
                  <Upload class="w-4 h-4" />
                  <span>+ Chụp / Chọn Thêm Ảnh Heo Thực Tế</span>
                  <input type="file" multiple accept="image/*" class="hidden" @change="handleUploadEditImages" />
                </label>
                <span class="text-[11px] text-slate-500">Lưu trữ hình ảnh heo lỗi, tật, đối chiếu với trại và nhà xe</span>
              </div>

              <!-- Thumbnails Preview Grid -->
              <div v-if="editForm.images && editForm.images.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                <div v-for="(img, imgIdx) in editForm.images" :key="imgIdx" class="relative group rounded-xl overflow-hidden aspect-square border border-slate-800 bg-slate-900">
                  <img :src="img" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    @click="editForm.images.splice(imgIdx, 1)"
                    class="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600/90 text-white flex items-center justify-center text-xs hover:bg-rose-500 shadow-md transition cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    ✕
                  </button>
                  <span class="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-amber-300">
                    #{{ imgIdx + 1 }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Ghi Chú Chuyến Xe</label>
            <input
              type="text"
              v-model="editForm.notes"
              placeholder="VD: Cập nhật chuyến 5h sáng..."
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition cursor-pointer"
            >
              Cập Nhật Sản Phẩm & Cân Đối NCC
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- ========================================== -->
    <!-- MODAL LIGHTBOX XEM ẢNH THỰC TẾ CHUYẾN XE -->
    <!-- ========================================== -->
    <div 
      v-if="showPurchaseGalleryModal" 
      class="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
      @click.self="closePurchaseGallery"
    >
      <div class="w-full max-w-4xl flex items-center justify-between py-2 text-white border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg font-black text-cyan-400">📸 {{ activePurchase?.maPhieuNhap || 'Ảnh Thực Tế Chuyến Xe' }}</span>
          <span class="px-2 py-0.5 rounded bg-white/10 text-xs text-slate-300">
            {{ purchaseGalleryIndex + 1 }} / {{ purchaseGalleryImages.length }}
          </span>
        </div>
        <button
          @click="closePurchaseGallery"
          class="p-2 px-3.5 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition text-xs font-black cursor-pointer"
        >
          ✕ Đóng
        </button>
      </div>

      <div class="relative w-full max-w-4xl flex items-center justify-center h-[65vh] bg-black/40 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <img 
          :src="purchaseGalleryImages[purchaseGalleryIndex]" 
          class="max-w-full max-h-full object-contain select-none"
        />

        <button
          v-if="purchaseGalleryImages.length > 1"
          @click="prevPurchaseGalleryImage"
          class="absolute left-4 w-12 h-12 rounded-full bg-black/70 hover:bg-cyan-600 text-white flex items-center justify-center text-2xl font-black transition border border-white/20 cursor-pointer shadow-lg active:scale-90"
        >
          ‹
        </button>
        <button
          v-if="purchaseGalleryImages.length > 1"
          @click="nextPurchaseGalleryImage"
          class="absolute right-4 w-12 h-12 rounded-full bg-black/70 hover:bg-cyan-600 text-white flex items-center justify-center text-2xl font-black transition border border-white/20 cursor-pointer shadow-lg active:scale-90"
        >
          ›
        </button>
      </div>

      <div v-if="purchaseGalleryImages.length > 1" class="w-full max-w-4xl flex items-center gap-2 overflow-x-auto py-3 justify-center">
        <div 
          v-for="(img, idx) in purchaseGalleryImages" 
          :key="idx"
          @click="purchaseGalleryIndex = idx"
          :class="[
            'w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition shrink-0',
            purchaseGalleryIndex === idx ? 'border-cyan-400 scale-105 ring-2 ring-cyan-400/50' : 'border-white/20 opacity-60 hover:opacity-100'
          ]"
        >
          <img :src="img" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  Package, Plus, Trash2, Truck, Flame, Snowflake, 
  Search, RefreshCw, Building2, Edit2, Scale, Upload, Camera
} from 'lucide-vue-next';
import { formatVND, formatNumber, formatDate } from '../utils/formatters';
import { showConfirm, showAlert, showToast } from '../utils/dialog';

const defaultPigImage = 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&auto=format&fit=crop&q=80';

const products = ref([]);
const sizes = ref([]);
const suppliers = ref([]);
const bankAccounts = ref([]);
const loading = ref(false);

const subTab = ref('stock');
const showImportModal = ref(false);
const search = ref('');
const filterPreserve = ref('ALL');
const filterFeature = ref('ALL');

const dailyDate = ref(new Date().toISOString().slice(0, 10));
const dailySummary = ref(null);
const allPurchases = ref([]);

// Bộ lọc lịch sử phiếu nhập xe
const purchaseSearch = ref('');
const purchaseTimeRange = ref('ALL');
const purchaseCustomDate = ref(new Date().toISOString().slice(0, 10));
const purchaseSupplierId = ref('ALL');
const purchasePreserve = ref('ALL');
const purchaseFeature = ref('ALL');

// LIGHTBOX XEM ẢNH THỰC TẾ CHUYẾN XE
const showPurchaseGalleryModal = ref(false);
const activePurchase = ref(null);
const purchaseGalleryImages = ref([]);
const purchaseGalleryIndex = ref(0);

const getPurchaseImages = (pn) => {
  if (!pn) return [];
  if (pn.images) {
    try {
      const parsed = typeof pn.images === 'string' ? JSON.parse(pn.images) : pn.images;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  if (pn.hinhAnhChuyenXe) {
    try {
      const parsed = typeof pn.hinhAnhChuyenXe === 'string' ? JSON.parse(pn.hinhAnhChuyenXe) : pn.hinhAnhChuyenXe;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  return [];
};

const openPurchaseGallery = (pn, initialIdx = 0) => {
  const imgs = getPurchaseImages(pn);
  if (imgs.length === 0) return;
  activePurchase.value = pn;
  purchaseGalleryImages.value = imgs;
  purchaseGalleryIndex.value = initialIdx;
  showPurchaseGalleryModal.value = true;
};

const closePurchaseGallery = () => {
  showPurchaseGalleryModal.value = false;
  activePurchase.value = null;
};

const nextPurchaseGalleryImage = () => {
  if (purchaseGalleryImages.value.length <= 1) return;
  purchaseGalleryIndex.value = (purchaseGalleryIndex.value + 1) % purchaseGalleryImages.value.length;
};

const prevPurchaseGalleryImage = () => {
  if (purchaseGalleryImages.value.length <= 1) return;
  purchaseGalleryIndex.value = (purchaseGalleryIndex.value - 1 + purchaseGalleryImages.value.length) % purchaseGalleryImages.value.length;
};

const handleUploadImportImages = (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  files.forEach(file => {
    if (file.size > 8 * 1024 * 1024) {
      showToast(`Ảnh ${file.name} vượt quá 8MB!`, 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!importForm.value.images) importForm.value.images = [];
      importForm.value.images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const handleUploadEditImages = (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  files.forEach(file => {
    if (file.size > 8 * 1024 * 1024) {
      showToast(`Ảnh ${file.name} vượt quá 8MB!`, 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!editForm.value.images) editForm.value.images = [];
      editForm.value.images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const resetImportForm = () => {
  importForm.value = {
    supplierId: '',
    importDate: new Date().toISOString().slice(0, 10),
    porkType: 'hot',
    pigFeature: 'duoi_cut',
    shippingFee: 0,
    parkingFee: 0,
    shippingPayer: 'buyer', // 'buyer' (Mình chịu) hoặc 'supplier' (NCC chịu)
    paymentMethod: 'Cash',
    bankAccountId: '',
    notes: '',
    images: [],
    items: [
      {
        entryType: 'per_size',
        unit: 'Con',
        productId: '',
        sizeType: '',
        weightKg: 0,
        headCount: null,
        costPrice: null
      }
    ]
  };
};

const handleOpenAddImport = async () => {
  await fetchData();
  resetImportForm();
  showImportModal.value = true;
};

const handleCloseImportModal = () => {
  resetImportForm();
  showImportModal.value = false;
};

watch(showImportModal, (val) => {
  if (!val) {
    resetImportForm();
  }
});

const importForm = ref({
  supplierId: '',
  importDate: new Date().toISOString().slice(0, 10),
  porkType: 'hot',
  pigFeature: 'duoi_cut',
  shippingFee: 0,
  parkingFee: 0,
  shippingPayer: 'buyer',
  paymentMethod: 'Cash',
  bankAccountId: '',
  notes: '',
  images: [],
  items: [
    {
      entryType: 'per_size',
      unit: 'Con',
      productId: '',
      sizeType: '',
      weightKg: 0,
      headCount: null,
      costPrice: null
    }
  ]
});

const fetchData = async (isSilent = false) => {
  try {
    if (!isSilent && products.value.length === 0 && suppliers.value.length === 0) {
      loading.value = true;
    }
    const [prodRes, sizeRes, supRes, bankRes, purRes, dailyRes] = await Promise.all([
      fetch('/api/products').catch(() => null),
      fetch('/api/sizes').catch(() => null),
      fetch('/api/suppliers').catch(() => null),
      fetch('/api/bank-accounts').catch(() => null),
      fetch('/api/purchases').catch(() => null),
      fetch(`/api/reports/daily-import?date=${dailyDate.value}`).catch(() => null)
    ]);

    const prods = prodRes && prodRes.ok ? await prodRes.json() : [];
    const sups = supRes && supRes.ok ? await supRes.json() : [];
    const banks = bankRes && bankRes.ok ? await bankRes.json() : [];
    const purs = purRes && purRes.ok ? await purRes.json() : [];
    const daily = dailyRes && dailyRes.ok ? await dailyRes.json() : {};

    products.value = Array.isArray(prods) ? prods : (prods?.data && Array.isArray(prods.data) ? prods.data : []);
    
    let sizesArr = [];
    if (sizeRes && sizeRes.ok) {
      const sJson = await sizeRes.json();
      const apiList = Array.isArray(sJson) ? sJson : (sJson?.data && Array.isArray(sJson.data) ? sJson.data : []);
      if (apiList.length > 0) {
        sizesArr = apiList;
      }
    }
    if (sizesArr.length === 0) {
      const storedSizes = localStorage.getItem('pig_size_configs');
      if (storedSizes) {
        try {
          const parsed = JSON.parse(storedSizes);
          if (Array.isArray(parsed) && parsed.length > 0) {
            sizesArr = parsed;
          }
        } catch (e) {}
      }
    }
    sizes.value = sizesArr;

    suppliers.value = Array.isArray(sups) ? sups : (sups?.data && Array.isArray(sups.data) ? sups.data : []);
    bankAccounts.value = Array.isArray(banks) ? banks : (banks?.data && Array.isArray(banks.data) ? banks.data : []);
    allPurchases.value = Array.isArray(purs) ? purs : (purs?.data && Array.isArray(purs.data) ? purs.data : []);
    dailySummary.value = daily || {};
  } catch (e) {
    console.error("Lỗi tải dữ liệu kho:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
  window.addEventListener('pig-suppliers-updated', () => fetchData(true));
  window.addEventListener('pig-banks-updated', () => fetchData(true));
  window.addEventListener('pig-sizes-updated', () => fetchData(true));
  window.addEventListener('pig-products-updated', () => fetchData(true));
  window.addEventListener('pig-purchases-updated', () => fetchData(true));
  window.addEventListener('pig-orders-updated', () => fetchData(true));
});

watch(dailyDate, () => {
  fetchData();
});

const handleImgError = (e) => {
  e.target.src = defaultPigImage;
};

const getProductDisplayImage = (p) => {
  if (!p) return defaultPigImage;
  if (p.image) return p.image;
  if (p.imageUrl) return p.imageUrl;
  if (p.hinhAnh) return p.hinhAnh;
  if (p.danhSachHinhAnh) {
    try {
      const arr = JSON.parse(p.danhSachHinhAnh);
      if (Array.isArray(arr) && arr.length > 0 && arr[0]) return arr[0];
    } catch (e) {}
  }
  // Check if there are shipment photos for this product or its supplier
  if (allPurchases.value && allPurchases.value.length > 0) {
    const matchingPurchase = allPurchases.value.find(pur => {
      const items = pur.danhSachChiTiet || pur.items || [];
      const hasItem = items.some(it => (it.sanPhamHeo?.id === p.id) || (it.loaiSize === p.sizeType || it.loaiSize === p.loaiSize));
      const supId = p.supplierId || (p.nhaCungCap && p.nhaCungCap.id);
      const purSupId = pur.supplierId || (pur.nhaCungCap && pur.nhaCungCap.id);
      const matchSup = supId && purSupId && supId === purSupId;
      return (hasItem || matchSup) && (pur.hinhAnhChuyenXe || pur.images);
    });
    if (matchingPurchase) {
      const purImgs = getPurchaseImages(matchingPurchase);
      if (purImgs && purImgs.length > 0) return purImgs[0];
    }
  }
  return defaultPigImage;
};

const handleCurrencyInput = (e, targetObj, key) => {
  const raw = e.target.value.replace(/\D/g, '');
  const num = Number(raw) || 0;
  targetObj[key] = num;
  e.target.value = formatNumber(num);
};

const supplierBankAccounts = computed(() => {
  return bankAccounts.value.filter(b => (b.loaiTaiKhoan || b.accountType || 'NCC') === 'NCC');
});

const getSupplierNameForBank = (b) => {
  const supId = b.nhaCungCapId || b.supplierId;
  if (!supId) {
    return b.accountHolder || b.chuTaiKhoan || 'Chưa gán NCC';
  }
  const sup = suppliers.value.find(s => String(s.id) === String(supId));
  return sup ? (sup.tenNhaCungCap || sup.name) : (b.accountHolder || b.chuTaiKhoan || `NCC #${supId}`);
};

watch(() => importForm.value.supplierId, (newSupId) => {
  if (newSupId && supplierBankAccounts.value.length > 0) {
    const matched = supplierBankAccounts.value.find(b => (b.nhaCungCapId || b.supplierId) == newSupId);
    if (matched) {
      importForm.value.bankAccountId = matched.id;
    }
  }
});

const flattenedSizes = computed(() => {
  const result = [];
  sizes.value.forEach(s => {
    const min = s.minKg !== undefined ? s.minKg : (s.rangeTiers?.[0]?.minKg);
    const max = s.maxKg !== undefined ? s.maxKg : (s.rangeTiers?.[0]?.maxKg);

    if (s.saleType === 'per_range' || (!s.saleType && (min !== undefined || max !== undefined))) {
      if (min !== undefined && max !== undefined) {
        result.push({
          id: String(s.id),
          originalId: s.id,
          name: `${s.name} (${min} - ${max}kg)`,
          saleType: s.saleType || 'per_range',
          pricePerUnit: s.pricePerUnit || s.pricePerKg || 0,
        });
      } else if (s.rangeTiers && s.rangeTiers.length > 0) {
        s.rangeTiers.forEach((tier, index) => {
          result.push({
            id: `${s.id}_tier_${index}`,
            originalId: s.id,
            name: `${s.name} (${tier.minKg} - ${tier.maxKg}kg)`,
            saleType: s.saleType || 'per_range',
            pricePerUnit: tier.price || 0,
          });
        });
      } else {
        result.push({
          id: String(s.id),
          originalId: s.id,
          name: s.name,
          saleType: s.saleType || 'per_range',
          pricePerUnit: s.pricePerUnit || s.pricePerKg || 0,
        });
      }
    } else {
      result.push({
        id: String(s.id),
        originalId: s.id,
        name: s.name,
        saleType: s.saleType || 'per_unit',
        pricePerUnit: s.pricePerUnit || s.pricePerKg || 0,
      });
    }
  });
  return result;
});

const availableSizeOptions = computed(() => {
  // Chỉ lấy đúng danh sách size thực tế đang cấu hình trong Quản Lý Size
  return flattenedSizes.value;
});

const findSizeOptionByName = (name) => {
  if (!name) return null;
  const clean = name.replace(/–/g, '-').trim().toLowerCase();
  return availableSizeOptions.value.find(s => 
    (s.name || '').replace(/–/g, '-').trim().toLowerCase() === clean
  ) || null;
};

const handleSizeSelect = (item) => {
  const opt = findSizeOptionByName(item.sizeType);
  if (opt) {
    item.sizeType = opt.name;
    item.productId = opt.id;
    if (!item.costPrice || item.costPrice === 0) {
      item.costPrice = opt.pricePerUnit || 0;
    }
  }
};

const handleAddItemRow = (type = 'per_size') => {
  if (type === 'per_kg') {
    importForm.value.items.push({
      entryType: 'per_kg',
      unit: 'Kg',
      productId: '',
      sizeType: 'Heo bán theo kg',
      weightKg: 20.0,
      headCount: 1,
      costPrice: null
    });
  } else {
    importForm.value.items.push({
      entryType: 'per_size',
      unit: 'Con',
      productId: '',
      sizeType: '',
      weightKg: 0,
      headCount: null,
      costPrice: null
    });
  }
};

const handleRemoveItemRow = (index) => {
  if (importForm.value.items.length === 1) return;
  importForm.value.items.splice(index, 1);
};

const totalHeadCountInTrip = computed(() => {
  return importForm.value.items.reduce((sum, it) => sum + (Number(it.headCount) || 1), 0);
});

const totalProductCost = computed(() => {
  return importForm.value.items.reduce((sum, it) => {
    if (it.entryType === 'per_kg' || it.unit === 'Kg') {
      return sum + ((Number(it.weightKg) || 0) * (Number(it.costPrice) || 0));
    }
    return sum + ((Number(it.headCount) || 0) * (Number(it.costPrice) || 0));
  }, 0);
});

const totalTripCost = computed(() => {
  const extra = (Number(importForm.value.shippingFee) || 0) + (Number(importForm.value.parkingFee) || 0);
  if (importForm.value.shippingPayer === 'supplier') {
    return Math.max(0, totalProductCost.value - extra);
  }
  return totalProductCost.value + extra;
});

const extraCostPerHead = computed(() => {
  if (totalHeadCountInTrip.value <= 0) return 0;
  const extraFees = (Number(importForm.value.shippingFee) || 0) + (Number(importForm.value.parkingFee) || 0);
  const perHead = Math.round(extraFees / totalHeadCountInTrip.value);
  if (importForm.value.shippingPayer === 'supplier') {
    return -perHead;
  }
  return perHead;
});

const unitCostAllocated = computed(() => {
  if (totalHeadCountInTrip.value <= 0) return 0;
  return Math.round(totalTripCost.value / totalHeadCountInTrip.value);
});

const getPreserveBadge = (type) => {
  switch (type) {
    case 'cold':
      return { label: 'Hàng Lạnh', icon: '❄️', class: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
    case 'wrapped':
    case 'hot_wrapped':
      return { label: 'Nóng Cuộn Bọc', icon: '📦', class: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
    case 'hot':
    default:
      return { label: 'Hàng Nóng', icon: '🔥', class: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
  }
};

const getPigFeatureBadge = (feature) => {
  switch (feature) {
    case 'duoi_dai':
      return { label: 'Đuôi Dài', icon: '🐖', class: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
    case 'rung_lai':
      return { label: 'Rừng Lai', icon: '🐗', class: 'bg-amber-600/15 text-amber-300 border-amber-500/30' };
    case 'mong_cai':
      return { label: 'Móng Cái', icon: '🐽', class: 'bg-pink-500/15 text-pink-300 border-pink-500/30' };
    case 'duoi_cut':
    default:
      return { label: 'Đuôi Cụt', icon: '🐷', class: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
  }
};

const getPorkBadge = (type) => {
  // Legacy / fallback helper
  if (['duoi_cut', 'duoi_dai', 'rung_lai', 'mong_cai'].includes(type)) {
    return getPigFeatureBadge(type);
  }
  return getPreserveBadge(type);
};

const totalStockCon = computed(() => {
  return products.value.reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);
});

const totalDuoiCutCon = computed(() => {
  return products.value.filter(p => (p.pigFeature || p.dacDiemHeo || 'duoi_cut') === 'duoi_cut').reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);
});

const totalDuoiDaiCon = computed(() => {
  return products.value.filter(p => (p.pigFeature || p.dacDiemHeo) === 'duoi_dai').reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);
});

const totalDuoiCon = computed(() => {
  return totalDuoiCutCon.value + totalDuoiDaiCon.value;
});

const totalRungLaiCon = computed(() => {
  return products.value.filter(p => (p.pigFeature || p.dacDiemHeo) === 'rung_lai').reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);
});

const totalMongCaiCon = computed(() => {
  return products.value.filter(p => (p.pigFeature || p.dacDiemHeo) === 'mong_cai').reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);
});

const totalRungMongCon = computed(() => {
  return totalRungLaiCon.value + totalMongCaiCon.value;
});

const totalHotCon = computed(() => {
  return products.value.filter(p => (p.porkType || p.loaiHeo || 'hot') === 'hot').reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);
});

const totalColdCon = computed(() => {
  return products.value.filter(p => (p.porkType || p.loaiHeo) === 'cold').reduce((s, p) => s + (p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)), 0);
});

const totalHotColdCon = computed(() => {
  return totalHotCon.value + totalColdCon.value;
});

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const name = (p.name || p.tenSanPham || '').toLowerCase();
    const size = (p.sizeType || p.loaiSize || '').toLowerCase();
    const supName = (p.supplier?.tenNhaCungCap || p.nhaCungCap?.tenNhaCungCap || '').toLowerCase();
    const preserveType = p.porkType || p.loaiHeo || 'hot';
    const featureType = p.pigFeature || p.dacDiemHeo || 'duoi_cut';

    const matchSearch = name.includes(search.value.toLowerCase()) || size.includes(search.value.toLowerCase()) || supName.includes(search.value.toLowerCase());
    const matchPreserve = filterPreserve.value === 'ALL' || preserveType === filterPreserve.value || (filterPreserve.value === 'wrapped' && (preserveType === 'wrapped' || preserveType === 'hot_wrapped'));
    const matchFeature = filterFeature.value === 'ALL' || featureType === filterFeature.value;

    return matchSearch && matchPreserve && matchFeature;
  });
});

const handleSaveImport = async () => {
  if (!importForm.value.supplierId) {
    showToast("Vui lòng chọn Nhà Cung Cấp trước khi lập phiếu!", "warning");
    return;
  }

  const payload = {
    supplierId: Number(importForm.value.supplierId),
    importDate: importForm.value.importDate,
    porkType: importForm.value.porkType,
    loaiHeo: importForm.value.porkType,
    pigFeature: importForm.value.pigFeature,
    dacDiemHeo: importForm.value.pigFeature,
    shippingFee: Number(importForm.value.shippingFee) || 0,
    chiPhiTienXe: Number(importForm.value.shippingFee) || 0,
    parkingFee: Number(importForm.value.parkingFee) || 0,
    chiPhiTienBai: Number(importForm.value.parkingFee) || 0,
    shippingPayer: importForm.value.shippingPayer,
    nguoiChiuTienXe: importForm.value.shippingPayer,
    totalProductCost: totalProductCost.value,
    paymentMethod: importForm.value.paymentMethod,
    bankAccountId: importForm.value.bankAccountId ? Number(importForm.value.bankAccountId) : null,
    taiKhoanNganHangId: importForm.value.bankAccountId ? Number(importForm.value.bankAccountId) : null,
    paidAmount: totalTripCost.value,
    notes: importForm.value.notes,
    ghiChu: importForm.value.notes,
    hinhAnhChuyenXe: JSON.stringify(importForm.value.images || []),
    images: JSON.stringify(importForm.value.images || []),
    items: importForm.value.items.map(it => {
      const actualId = String(it.productId).split('_')[0];
      const isKg = it.entryType === 'per_kg' || it.unit === 'Kg';
      return {
        productId: actualId && actualId !== 'undefined' ? Number(actualId) : null,
        sizeType: it.sizeType || (isKg ? `Heo lớn (${it.weightKg || 0}kg)` : 'Heo size'),
        unit: isKg ? 'Kg' : 'Con',
        donViTinh: isKg ? 'Kg' : 'Con',
        headCount: Number(it.headCount) || 1,
        soLuongCon: Number(it.headCount) || 1,
        soKg: isKg ? (Number(it.weightKg) || 0) : 0,
        weightKg: isKg ? (Number(it.weightKg) || 0) : 0,
        costPrice: Number(it.costPrice) || 0,
        giaNhap: Number(it.costPrice) || 0,
        giaNhapVon: Number(it.costPrice) || 0,
        totalCost: isKg 
          ? (Number(it.weightKg) || 0) * (Number(it.costPrice) || 0)
          : (Number(it.headCount) || 0) * (Number(it.costPrice) || 0)
      };
    })
  };

  try {
    const res = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast("Lập phiếu nhập chuyến xe thành công! Số lượng heo đã được cộng vào tồn kho.", "success");
      resetImportForm();
      showImportModal.value = false;
      fetchData(true);
      window.dispatchEvent(new CustomEvent('pig-purchases-updated'));
      window.dispatchEvent(new CustomEvent('pig-products-updated'));
      window.dispatchEvent(new CustomEvent('pig-banks-updated'));
      window.dispatchEvent(new CustomEvent('pig-suppliers-updated'));
    } else {
      const err = await res.json().catch(() => ({}));
      showToast("Lỗi khi lưu phiếu nhập: " + (err.message || 'Không thể hoàn tất thao tác'), "error");
    }
  } catch (e) {
    showToast("Lỗi kết nối máy chủ, vui lòng thử lại: " + e.message, "error");
  }
};

const showEditModal = ref(false);
const editingProduct = ref(null);
const editForm = ref({
  id: null,
  supplierId: '',
  importDate: new Date().toISOString().slice(0, 10),
  porkType: 'hot',
  pigFeature: 'duoi_cut',
  shippingFee: 500000,
  parkingFee: 10000,
  paymentMethod: 'Bank',
  bankAccountId: '',
  shippingPayer: 'supplier', // 'buyer' | 'supplier'
  notes: 'Chỉnh sửa chuyến xe heo',
  items: [
    {
      id: null,
      entryType: 'per_size',
      unit: 'Con',
      productId: '',
      sizeType: 'Heo sữa (3 – 3.9kg)',
      weightKg: 0,
      headCount: 10,
      costPrice: 200000
    }
  ]
});

watch(() => editForm.value.supplierId, (newSupId) => {
  if (newSupId && supplierBankAccounts.value.length > 0) {
    const matched = supplierBankAccounts.value.find(b => (b.nhaCungCapId || b.supplierId) == newSupId);
    if (matched) {
      editForm.value.bankAccountId = matched.id;
    }
  }
});

const handleAddEditItemRow = (type = 'per_size') => {
  if (type === 'per_kg') {
    editForm.value.items.push({
      id: null,
      entryType: 'per_kg',
      unit: 'Kg',
      productId: '',
      sizeType: 'Heo bán theo kg',
      weightKg: 20.0,
      headCount: 1,
      costPrice: null
    });
  } else {
    editForm.value.items.push({
      id: null,
      entryType: 'per_size',
      unit: 'Con',
      productId: '',
      sizeType: '',
      weightKg: 0,
      headCount: null,
      costPrice: null
    });
  }
};

const handleRemoveEditItemRow = (idx) => {
  if (editForm.value.items.length <= 1) return;
  editForm.value.items.splice(idx, 1);
};

const editTotalHeadCountInTrip = computed(() => {
  return editForm.value.items.reduce((sum, it) => sum + (Number(it.headCount) || 1), 0);
});

const editTotalProductCost = computed(() => {
  return editForm.value.items.reduce((sum, it) => {
    if (it.entryType === 'per_kg' || it.unit === 'Kg') {
      return sum + ((Number(it.weightKg) || 0) * (Number(it.costPrice) || 0));
    }
    return sum + ((Number(it.headCount) || 0) * (Number(it.costPrice) || 0));
  }, 0);
});

const editTotalTripCost = computed(() => {
  const extra = (Number(editForm.value.shippingFee) || 0) + (Number(editForm.value.parkingFee) || 0);
  if (editForm.value.shippingPayer === 'supplier') {
    return Math.max(0, editTotalProductCost.value - extra);
  }
  return editTotalProductCost.value + extra;
});

const editExtraCostPerHead = computed(() => {
  const count = editTotalHeadCountInTrip.value;
  if (count <= 0) return 0;
  const extraFees = (Number(editForm.value.shippingFee) || 0) + (Number(editForm.value.parkingFee) || 0);
  const perHead = Math.round(extraFees / count);
  if (editForm.value.shippingPayer === 'supplier') {
    return -perHead;
  }
  return perHead;
});

const editUnitCostAllocated = computed(() => {
  const count = editTotalHeadCountInTrip.value;
  if (count <= 0) return 0;
  return Math.round(editTotalTripCost.value / count);
});

const handleOpenEditPurchase = (pn) => {
  const supId = pn.nhaCungCap?.id || pn.supplierId || (suppliers.value[0]?.id || '');
  
  let items = [];
  if (pn.danhSachChiTiet && pn.danhSachChiTiet.length > 0) {
    items = pn.danhSachChiTiet.map(it => {
      const rawName = it.loaiSize || it.sizeType || (it.sanPhamHeo?.loaiSize || it.sanPhamHeo?.tenSanPham || '');
      const opt = findSizeOptionByName(rawName);
      const chosenName = opt ? opt.name : (rawName || 'Heo sữa');
      const isKg = (it.donViTinh && it.donViTinh.toLowerCase().includes('kg')) || (Number(it.soKg) > 0);
      return {
        id: it.id,
        entryType: isKg ? 'per_kg' : 'per_size',
        unit: isKg ? 'Kg' : 'Con',
        productId: opt ? opt.id : '',
        sizeType: chosenName,
        weightKg: Number(it.soKg || it.weightKg || 0),
        headCount: it.soLuongCon !== undefined ? it.soLuongCon : (it.headCount || 1),
        costPrice: it.giaNhapVon !== undefined ? it.giaNhapVon : (it.costPrice || 0)
      };
    });
  } else {
    const defaultOpt = availableSizeOptions.value[0];
    items = [
      {
        id: null,
        entryType: 'per_size',
        unit: 'Con',
        productId: defaultOpt?.id || '',
        sizeType: defaultOpt?.name || 'Heo sữa (3 - 3.9kg)',
        weightKg: 0,
        headCount: pn.headCount || 10,
        costPrice: pn.costPrice || 200000
      }
    ];
  }

  editForm.value = {
    id: pn.id,
    supplierId: supId,
    importDate: pn.ngayNhapKho || pn.importDate || new Date().toISOString().slice(0, 10),
    porkType: pn.loaiHeo || pn.porkType || 'hot',
    pigFeature: pn.dacDiemHeo || pn.pigFeature || 'duoi_cut',
    shippingFee: Number(pn.chiPhiTienXe !== undefined ? pn.chiPhiTienXe : pn.shippingFee) || 0,
    parkingFee: Number(pn.chiPhiTienBai !== undefined ? pn.chiPhiTienBai : pn.parkingFee) || 0,
    paymentMethod: pn.taiKhoanNganHangTra ? 'Bank' : 'Cash',
    bankAccountId: pn.taiKhoanNganHangTra?.id || supplierBankAccounts.value[0]?.id || bankAccounts.value[0]?.id || '',
    shippingPayer: pn.nguoiChiuTienXe || pn.shippingPayer || 'supplier',
    notes: pn.ghiChu || pn.notes || 'Chỉnh sửa chuyến xe heo',
    images: getPurchaseImages(pn),
    items: items
  };

  showEditModal.value = true;
};

const handleOpenEditProduct = (p) => {
  editingProduct.value = p;
  // Tìm chuyến xe tương ứng trong lịch sử nhập
  const foundTrip = allPurchases.value.find(pn => {
    const items = pn.danhSachChiTiet || pn.items || [];
    return items.some(it => (it.sanPhamHeo?.id === p.id) || (it.loaiSize === p.sizeType || it.loaiSize === p.loaiSize));
  });

  if (foundTrip) {
    handleOpenEditPurchase(foundTrip);
  } else {
    const matchSize = flattenedSizes.value.find(s => s.name === (p.sizeType || p.loaiSize));
    handleOpenEditPurchase({
      id: null,
      nhaCungCap: p.supplier || p.nhaCungCap,
      ngayNhapKho: p.importDate || p.ngayNhap,
      loaiHeo: p.porkType || p.loaiHeo,
      dacDiemHeo: p.pigFeature || p.dacDiemHeo,
      chiPhiTienXe: 0,
      chiPhiTienBai: 0,
      nguoiChiuTienXe: 'buyer',
      ghiChu: p.importDetails || p.chiTietNhap,
      danhSachChiTiet: [
        {
          id: p.id,
          sanPhamHeo: p,
          loaiSize: p.sizeType || p.loaiSize,
          soLuongCon: p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0),
          giaNhapVon: p.costPrice || p.giaNhapVon || 0
        }
      ]
    });
  }
};

const handleSaveEditProduct = async () => {
  if (!editForm.value.supplierId) {
    showToast("Vui lòng chọn Nhà Cung Cấp!", "warning");
    return;
  }

  if (!editForm.value.items || editForm.value.items.length === 0) {
    showToast("Vui lòng nhập ít nhất 1 dòng size heo hoặc heo theo kg trong chuyến!", "warning");
    return;
  }

  const payload = {
    supplierId: Number(editForm.value.supplierId),
    nhaCungCapId: Number(editForm.value.supplierId),
    importDate: editForm.value.importDate,
    ngayNhapKho: editForm.value.importDate,
    porkType: editForm.value.porkType,
    loaiHeo: editForm.value.porkType,
    pigFeature: editForm.value.pigFeature,
    dacDiemHeo: editForm.value.pigFeature,
    shippingFee: Number(editForm.value.shippingFee) || 0,
    chiPhiTienXe: Number(editForm.value.shippingFee) || 0,
    parkingFee: Number(editForm.value.parkingFee) || 0,
    chiPhiTienBai: Number(editForm.value.parkingFee) || 0,
    shippingPayer: editForm.value.shippingPayer,
    nguoiChiuTienXe: editForm.value.shippingPayer,
    bankAccountId: editForm.value.paymentMethod === 'Bank' ? Number(editForm.value.bankAccountId) : null,
    taiKhoanNganHangId: editForm.value.paymentMethod === 'Bank' ? Number(editForm.value.bankAccountId) : null,
    notes: editForm.value.notes,
    ghiChu: editForm.value.notes,
    hinhAnhChuyenXe: JSON.stringify(editForm.value.images || []),
    images: JSON.stringify(editForm.value.images || []),
    items: editForm.value.items.map(it => {
      const matchSize = flattenedSizes.value.find(s => String(s.id) === String(it.productId));
      const sName = matchSize ? matchSize.name : (it.sizeType || 'Heo size');
      const isKg = it.entryType === 'per_kg' || it.unit === 'Kg';
      return {
        productId: it.productId ? Number(it.productId) : null,
        sanPhamId: it.productId ? Number(it.productId) : null,
        sizeType: sName,
        loaiSize: sName,
        unit: isKg ? 'Kg' : 'Con',
        donViTinh: isKg ? 'Kg' : 'Con',
        headCount: Number(it.headCount) || 1,
        soLuongCon: Number(it.headCount) || 1,
        soKg: isKg ? (Number(it.weightKg) || 0) : 0,
        weightKg: isKg ? (Number(it.weightKg) || 0) : 0,
        costPrice: Number(it.costPrice) || 0,
        giaNhapVon: Number(it.costPrice) || 0,
        totalCost: isKg 
          ? (Number(it.weightKg) || 0) * (Number(it.costPrice) || 0)
          : (Number(it.headCount) || 0) * (Number(it.costPrice) || 0)
      };
    })
  };

  try {
    const isEditingTrip = !!editForm.value.id;
    const url = isEditingTrip ? `/api/purchases/${editForm.value.id}` : '/api/purchases';
    const method = isEditingTrip ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast("Cập nhật thông tin chuyến xe thành công! Tồn kho đã được đồng bộ chuẩn xác.", "success");
      showEditModal.value = false;
      fetchData(true);
      window.dispatchEvent(new CustomEvent('pig-purchases-updated'));
      window.dispatchEvent(new CustomEvent('pig-products-updated'));
      window.dispatchEvent(new CustomEvent('pig-banks-updated'));
      window.dispatchEvent(new CustomEvent('pig-suppliers-updated'));
    } else {
      const err = await res.json().catch(() => ({}));
      showToast("Lỗi cập nhật chuyến xe: " + (err.message || 'Không thể lưu'), "error");
    }
  } catch (e) {
    showToast("Lỗi kết nối máy chủ, vui lòng thử lại: " + e.message, "error");
  }
};

const handleDeleteProduct = async (p) => {
  const id = p.id;
  const name = p.name || p.tenSanPham;
  const count = p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0);
  const cost = p.costPrice || p.giaNhapVon || 0;
  const totalRefund = count * cost;

  const confirmed = await showConfirm(
    "Xác Nhận Xóa Sản Phẩm Khỏi Kho",
    `Bạn có chắc chắn muốn xóa "${name}" (${count} con)?\nSố tiền nhập tương ứng (${formatVND(totalRefund)}) sẽ được tự động HOÀN LẠI VÀO TÀI KHOẢN NCC!`
  );

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast(`✅ Đã xóa sản phẩm và hoàn lại ${formatVND(totalRefund)} vào tài khoản NCC!`, "success");
      fetchData();
    } else {
      showToast("Không thể xóa sản phẩm này", "error");
    }
  } catch (e) {
    showToast("Lỗi xóa: " + e.message, "error");
  }
};

const formatPurchaseTimeRangeLabel = computed(() => {
  switch (purchaseTimeRange.value) {
    case 'TODAY': return `Hôm Nay (${formatDate(new Date().toISOString().slice(0, 10))})`;
    case '7DAYS': return '7 Ngày Gần Nhất';
    case '30DAYS': return '30 Ngày Gần Nhất';
    case 'THIS_MONTH': return 'Tháng Này';
    case 'THIS_YEAR': return 'Năm Nay';
    case 'CUSTOM_DATE': return `Ngày ${formatDate(purchaseCustomDate.value)}`;
    case 'ALL':
    default:
      return 'Toàn Bộ Lịch Sử (2 Năm)';
  }
});

const filteredPurchases = computed(() => {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const thisMonthStr = now.toISOString().slice(0, 7);
  const thisYearStr = String(now.getFullYear());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return allPurchases.value.filter(pn => {
    // NCC
    if (purchaseSupplierId.value !== 'ALL') {
      const supId = pn.nhaCungCap?.id || pn.supplierId;
      if (String(supId) !== String(purchaseSupplierId.value)) return false;
    }

    // Preservation
    const pType = pn.loaiHeo || pn.porkType || 'hot';
    if (purchasePreserve.value !== 'ALL') {
      if (purchasePreserve.value === 'wrapped') {
        if (pType !== 'wrapped' && pType !== 'hot_wrapped') return false;
      } else if (pType !== purchasePreserve.value) {
        return false;
      }
    }

    // Feature
    const pFeature = pn.dacDiemHeo || pn.pigFeature || 'duoi_cut';
    if (purchaseFeature.value !== 'ALL' && pFeature !== purchaseFeature.value) {
      return false;
    }

    // Time
    const dStr = pn.ngayNhapKho || pn.importDate || '';
    if (purchaseTimeRange.value === 'TODAY') {
      if (!dStr.startsWith(todayStr)) return false;
    } else if (purchaseTimeRange.value === 'THIS_MONTH') {
      if (!dStr.startsWith(thisMonthStr)) return false;
    } else if (purchaseTimeRange.value === 'THIS_YEAR') {
      if (!dStr.startsWith(thisYearStr)) return false;
    } else if (purchaseTimeRange.value === '7DAYS') {
      const d = new Date(dStr);
      if (isNaN(d.getTime()) || d < sevenDaysAgo) return false;
    } else if (purchaseTimeRange.value === '30DAYS') {
      const d = new Date(dStr);
      if (isNaN(d.getTime()) || d < thirtyDaysAgo) return false;
    } else if (purchaseTimeRange.value === 'CUSTOM_DATE') {
      if (dStr !== purchaseCustomDate.value) return false;
    }

    // Keyword Search
    if (purchaseSearch.value.trim()) {
      const q = purchaseSearch.value.toLowerCase();
      const code = (pn.maPhieuNhap || `PN-${pn.id}`).toLowerCase();
      const sup = (pn.nhaCungCap?.tenNhaCungCap || '').toLowerCase();
      const notes = (pn.ghiChu || pn.notes || '').toLowerCase();
      const items = pn.danhSachChiTiet || pn.items || [];
      const itemNames = items.map(it => (it.loaiSize || it.sizeType || '').toLowerCase()).join(' ');
      const match = code.includes(q) || sup.includes(q) || notes.includes(q) || itemNames.includes(q);
      if (!match) return false;
    }

    return true;
  });
});

const purchaseStats = computed(() => {
  const list = filteredPurchases.value;
  const totalTrips = list.length;
  let totalHeads = 0;
  let totalProductCost = 0;
  let totalShippingFee = 0;
  let totalCost = 0;

  list.forEach(pn => {
    const items = pn.danhSachChiTiet || pn.items || [];
    const heads = items.reduce((s, it) => s + (Number(it.soLuongCon) || Number(it.headCount) || 0), 0);
    totalHeads += heads;
    totalProductCost += Number(pn.tienHangHeo || pn.totalProductCost) || 0;
    totalShippingFee += Number(pn.chiPhiTienXe || pn.shippingFee) || 0;
    totalCost += Number(pn.tongTienNhap || pn.totalCost) || 0;
  });

  return {
    totalTrips,
    totalHeads,
    totalProductCost,
    totalShippingFee,
    totalCost
  };
});

const handleDeletePurchase = async (pn) => {
  const code = pn.maPhieuNhap || `PN-${pn.id}`;
  const ok = await showConfirm(
    `Xóa chuyến xe nhập [${code}]?`,
    `Hành động này sẽ xóa phiếu nhập và hoàn lại số dư ngân hàng/công nợ NCC (nếu có). Bạn có chắc chắn muốn xóa?`
  );
  if (!ok) return;

  try {
    const res = await fetch(`/api/purchases/${pn.id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast(`✅ Đã xóa chuyến xe [${code}] thành công!`, "success");
      fetchData(true);
      window.dispatchEvent(new CustomEvent('pig-purchases-updated'));
      window.dispatchEvent(new CustomEvent('pig-products-updated'));
      window.dispatchEvent(new CustomEvent('pig-banks-updated'));
      window.dispatchEvent(new CustomEvent('pig-suppliers-updated'));
    } else {
      const err = await res.json().catch(() => ({}));
      showToast("Lỗi xóa chuyến xe: " + (err.message || 'Không thể xóa'), "error");
    }
  } catch (e) {
    showToast("Lỗi kết nối máy chủ: " + e.message, "error");
  }
};
</script>
