<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

    <!-- VIEW 1: DANH SÁCH Ô SẢN PHẨM HEO (GỘP HÀNG CHUẨN ĐẸP) -->
    <div v-if="currentView === 'store'" class="space-y-6">
      <!-- TOP TOOLBAR: FILTER, SEARCH & GIỎ HÀNG -->
      <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="relative flex-1 min-w-[220px]">
          <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            v-model="search"
            placeholder="Tìm theo tên heo, size, nhà cung cấp..."
            class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
          />
        </div>

        <!-- Filter by Preservation (Cách bảo quản) -->
        <div class="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            @click="filterPreserve = 'ALL'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              filterPreserve === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            Tất Cả
          </button>
          <button
            @click="filterPreserve = 'hot'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              filterPreserve === 'hot' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-rose-400'
            ]"
          >
            <Flame class="w-3.5 h-3.5 text-rose-500" />
            Hàng Nóng
          </button>
          <button
            @click="filterPreserve = 'cold'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              filterPreserve === 'cold' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-cyan-400'
            ]"
          >
            <Snowflake class="w-3.5 h-3.5 text-cyan-400" />
            Hàng Lạnh
          </button>
          <button
            @click="filterPreserve = 'wrapped'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              filterPreserve === 'wrapped' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-amber-400'
            ]"
          >
            <Package class="w-3.5 h-3.5 text-amber-400" />
            Cuộn Bọc
          </button>
        </div>

        <!-- Filter by Feature (Đặc điểm heo) -->
        <div class="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            @click="filterFeature = 'ALL'"
            :class="[
              'px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              filterFeature === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            Mọi Đặc Điểm
          </button>
          <button
            @click="filterFeature = 'duoi_cut'"
            :class="[
              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              filterFeature === 'duoi_cut' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-emerald-400'
            ]"
          >
            <span>🐷</span>
            Đuôi Cụt
          </button>
          <button
            @click="filterFeature = 'duoi_dai'"
            :class="[
              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              filterFeature === 'duoi_dai' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-indigo-400'
            ]"
          >
            <span>🐖</span>
            Đuôi Dài
          </button>
          <button
            @click="filterFeature = 'rung_lai'"
            :class="[
              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              filterFeature === 'rung_lai' ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-amber-400'
            ]"
          >
            <span>🐗</span>
            Rừng Lai
          </button>
          <button
            @click="filterFeature = 'mong_cai'"
            :class="[
              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              filterFeature === 'mong_cai' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'text-slate-400 hover:text-pink-400'
            ]"
          >
            <span>🐽</span>
            Móng Cái
          </button>
        </div>

        <!-- Size Filter & Giỏ Hàng Nút Bấm -->
        <div class="flex items-center gap-2">
          <select
            v-if="allSizes.length > 0"
            v-model="filterSize"
            class="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">Mọi Size Heo</option>
            <option v-for="s in allSizes" :key="s" :value="s">{{ s }}</option>
          </select>

          <!-- NÚT MỞ GIỎ HÀNG CHÍNH -->
          <button
            @click="currentView = 'cart'"
            class="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-900/30 transition transform active:scale-95 cursor-pointer border border-white/10"
          >
            <ShoppingCart class="w-4 h-4" />
            <span>Giỏ Hàng</span>
            <span v-if="cartTotalItems > 0" class="px-2 py-0.5 rounded-full bg-white text-slate-950 font-black text-[10px]">
              {{ cartTotalQuantity }} con
            </span>
          </button>

          <button
            @click="fetchData"
            class="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 shadow-sm transition active:scale-95 cursor-pointer"
            title="Làm mới sản phẩm"
          >
            <RefreshCw :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
          </button>
        </div>
      </div>

      <!-- PRODUCT CARDS GRID (GỘP HÀNG ĐỒNG BỘ THEO NHÓM KHO) -->
      <div v-if="loading" class="py-20 flex flex-col items-center justify-center space-y-3">
        <div class="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p class="text-slate-400 text-sm font-medium">Đang tải danh sách ô heo...</p>
      </div>

      <div v-else-if="displayCards.length === 0" class="py-16 text-center bg-slate-950/60 border border-slate-800 rounded-3xl p-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl">
          📦
        </div>
        <h3 class="text-lg font-bold text-white mb-1">Không tìm thấy ô heo phù hợp</h3>
        <p class="text-slate-400 text-xs max-w-md mx-auto mb-4">
          Vui lòng thử tìm kiếm với từ khóa khác hoặc chuyển sang tab Quản Lý Sản Phẩm để kê giá bán lên kệ.
        </p>
      </div>

      <!-- DANH SÁCH THẺ SẢN PHẨM TẠI CỬA HÀNG (ĐỒNG BỘ GỘP / TÁCH TỪ QUẢN LÝ SẢN PHẨM) -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="card in displayCards"
          :key="card.groupId ? card.groupId : ('single_' + card.id)"
          :class="[
            'group relative bg-slate-950/80 border rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between',
            card.isMerged ? 'border-cyan-500/50 hover:border-cyan-400 hover:shadow-cyan-950/20' : 'border-slate-800/90 hover:border-amber-500/60 hover:shadow-amber-950/20'
          ]"
        >
          <!-- Product Image Section -->
          <div class="relative h-48 w-full bg-slate-900 overflow-hidden group/img">
            <img
              :src="getCardCurrentImage(card)"
              :alt="card.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              @error="handleImgError"
              @click.stop="openGallery(card)"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none"></div>

            <!-- Nút lướt ảnh trái / phải khi có nhiều ảnh đẹp -->
            <div v-if="getCardImages(card).length > 1" class="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-20">
              <button
                type="button"
                @click.stop="prevCardImage(card)"
                class="w-7 h-7 rounded-full bg-black/75 hover:bg-amber-600 text-white flex items-center justify-center text-sm font-black shadow-lg backdrop-blur-md pointer-events-auto transition active:scale-90 border border-white/20 cursor-pointer"
                title="Ảnh trước"
              >
                ‹
              </button>
              <button
                type="button"
                @click.stop="nextCardImage(card)"
                class="w-7 h-7 rounded-full bg-black/75 hover:bg-amber-600 text-white flex items-center justify-center text-sm font-black shadow-lg backdrop-blur-md pointer-events-auto transition active:scale-90 border border-white/20 cursor-pointer"
                title="Ảnh tiếp theo"
              >
                ›
              </button>
            </div>

            <!-- Chấm chỉ số ảnh (Dots) -->
            <div v-if="getCardImages(card).length > 1" class="absolute bottom-2.5 left-3 z-20 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
              <span
                v-for="(_, dotIdx) in getCardImages(card)"
                :key="dotIdx"
                :class="[
                  'rounded-full transition-all',
                  (cardImageIndexes[card.id] || 0) === dotIdx ? 'bg-amber-400 w-3 h-1.5' : 'bg-white/40 w-1.5 h-1.5'
                ]"
              ></span>
              <span class="text-[9px] font-bold text-amber-300 ml-0.5">
                {{ (cardImageIndexes[card.id] || 0) + 1 }}/{{ getCardImages(card).length }}
              </span>
            </div>

            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <!-- Badge 1: Cách Bảo Quản -->
              <span 
                :class="[
                  'flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase shadow-lg tracking-wider whitespace-nowrap border',
                  getPreserveBadge(card.porkType).cardClass
                ]"
              >
                <span>{{ getPreserveBadge(card.porkType).icon }}</span>
                <span>{{ getPreserveBadge(card.porkType).label }}</span>
              </span>

              <!-- Badge 2: Đặc Điểm Heo -->
              <span 
                :class="[
                  'flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase shadow-lg tracking-wider whitespace-nowrap border',
                  getPigFeatureBadge(card.pigFeature).cardClass
                ]"
              >
                <span>{{ getPigFeatureBadge(card.pigFeature).icon }}</span>
                <span>{{ getPigFeatureBadge(card.pigFeature).label }}</span>
              </span>

              <!-- Badge 3: Size -->
              <span class="px-2.5 py-1 rounded-md bg-slate-950/90 text-amber-400 text-[10px] font-bold border border-amber-400/30 whitespace-nowrap">
                {{ card.sizeType }}
              </span>
            </div>

            <!-- Stock count tag & Merged Badge -->
            <div class="absolute bottom-2.5 right-3 flex items-center gap-1.5">
              <span 
                v-if="card.isMerged" 
                class="px-2 py-0.5 rounded-md bg-cyan-500/90 text-slate-950 text-[10px] font-black uppercase shadow-md border border-cyan-300"
              >
                🔗 Gộp {{ card.suppliers.length }} lô
              </span>
              <span :class="[
                'px-2.5 py-1 rounded-lg text-xs font-black shadow-md border backdrop-blur-md',
                card.totalHeads > 0 
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
              ]">
                Còn: {{ card.totalHeads }} con
              </span>
            </div>
          </div>

          <!-- Body Details -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-1.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="font-extrabold text-white text-base leading-snug group-hover:text-amber-400 transition-colors line-clamp-1">
                    {{ card.name }}
                  </h3>
                  <!-- Nhà Cung Cấp hiển thị rõ ràng nếu là ô tách riêng -->
                  <div v-if="!card.isMerged" class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 class="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span class="font-bold text-slate-200">NCC: {{ card.supplierName }}</span>
                  </div>
                </div>
              </div>

              <!-- Nếu là ô gộp: Nguồn NCC gộp rõ ràng (Hiển: 10c • Kiệt: 15c) -->
              <div v-if="card.isMerged" class="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-cyan-500/30 space-y-1">
                <span class="text-[10px] text-cyan-400 uppercase font-black tracking-wider block">
                  Nguồn Hàng Đã Gộp:
                </span>
                <div class="flex flex-wrap gap-1.5 font-medium text-slate-300">
                  <span v-for="(sup, sIdx) in card.suppliers" :key="sIdx" class="inline-flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                    <span class="font-bold text-white">{{ sup.name }}:</span>
                    <span class="text-emerald-400 font-bold">{{ sup.count }}c</span>
                    <span class="text-[10px] text-slate-400">({{ formatVND(sup.cost) }})</span>
                  </span>
                </div>
              </div>

              <p v-if="card.importDetails" class="text-[11px] text-slate-500 italic line-clamp-1">
                "{{ card.importDetails }}"
              </p>
            </div>

            <!-- Giá Bán & Giá Vốn NCC -->
            <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div class="flex items-baseline justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Giá Bán:
                </span>
                <div class="text-right">
                  <span class="text-2xl font-extrabold text-amber-400 tracking-tight">
                    {{ formatVND(card.sellingPrice) }}
                  </span>
                  <span class="text-[10px] text-slate-500 block font-medium">/ 1 con</span>
                </div>
              </div>

              <div class="flex items-baseline justify-between pt-1.5 border-t border-slate-800/80 text-[11px]">
                <span class="text-[10px] font-medium text-slate-500">Giá vốn NCC:</span>
                <span class="font-semibold text-slate-400">
                  <template v-if="card.minCost === card.maxCost">
                    {{ formatVND(card.minCost) }}
                  </template>
                  <template v-else>
                    {{ formatVND(card.minCost) }} ~ {{ formatVND(card.maxCost) }}
                  </template>
                </span>
              </div>

              <div :class="['flex items-baseline justify-between text-[10px] font-bold pt-0.5', getGrossProfitInfo({ sellingPrice: card.sellingPrice, costPrice: card.avgCost }).colorClass]">
                <span>Lợi nhuận gộp/con:</span>
                <span>{{ getGrossProfitInfo({ sellingPrice: card.sellingPrice, costPrice: card.avgCost }).text }}</span>
              </div>
            </div>

            <!-- NÚT MUA HÀNG (MỞ POPUP CHỌN SỐ LƯỢNG TỪNG NCC HOẶC THÊM GIỎ) -->
            <button
              @click="handleOpenSupplierPicker(card)"
              :disabled="card.totalHeads <= 0"
              class="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40 transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
            >
              <ShoppingCart class="w-4 h-4" />
              <span>{{ card.totalHeads > 0 ? 'Chọn Mua & Thêm Giỏ' : 'Hết Hàng' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- VIEW 2: TRANG GIỎ HÀNG & THANH TOÁN ĐA MÓN (MULTI-ITEM CART CHECKOUT) -->
    <!-- ========================================================================= -->
    <div v-else-if="currentView === 'cart'" class="space-y-5 animate-in fade-in duration-300">
      <!-- HEADER GIỎ HÀNG -->
      <div class="flex items-center justify-between pb-1 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
        <button
          @click="currentView = 'store'"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl border border-slate-800 text-xs font-bold transition shadow-md cursor-pointer"
        >
          <ArrowLeft class="w-4 h-4 text-amber-400" />
          <span>Tiếp tục chọn thêm heo khác</span>
        </button>

        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-400 hidden sm:inline">
            Giỏ hàng của khách ({{ cartTotalQuantity }} con heo)
          </span>
          <button
            v-if="cart.length > 0"
            @click="handleClearCart"
            class="px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Xóa Sạch Giỏ</span>
          </button>
        </div>
      </div>

      <!-- NẾU GIỎ HÀNG TRỐNG -->
      <div v-if="cart.length === 0" class="py-20 text-center bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-4">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-slate-900 flex items-center justify-center text-4xl shadow-inner border border-slate-800">
          🛒
        </div>
        <h3 class="text-xl font-black text-white">Giỏ Hàng Đang Trống</h3>
        <p class="text-slate-400 text-xs max-w-sm mx-auto">
          Quý khách chưa thêm loại heo nào vào giỏ. Hãy bấm quay lại để chọn mua heo theo từng nhà cung cấp.
        </p>
        <button
          @click="currentView = 'store'"
          class="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition cursor-pointer"
        >
          Quay Lại Cửa Hàng Chọn Heo
        </button>
      </div>

      <!-- NẾU GIỎ HÀNG CÓ MÓN -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- CỘT TRÁI (7 COLS): DANH SÁCH CÁC MÓN HEO TRONG GIỎ HÀNG -->
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <ShoppingCart class="w-4 h-4 text-amber-400" />
                <span>Danh Sách Heo Đã Chọn ({{ cart.length }} món - {{ cartTotalQuantity }} con)</span>
              </h3>
              <button
                @click="currentView = 'store'"
                class="text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                + Thêm Món Khác
              </button>
            </div>

            <!-- DANH SÁCH ITEM TRONG GIỎ -->
            <div class="divide-y divide-slate-800/80 space-y-3">
              <div 
                v-for="(item, idx) in cart" 
                :key="item.cartId"
                class="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <!-- Info -->
                <div class="flex items-start gap-3 flex-1">
                  <img
                    :src="item.image || defaultPigImage"
                    alt=""
                    class="w-16 h-16 rounded-xl object-cover border border-slate-800 shadow shrink-0"
                    @error="handleImgError"
                  />
                  <div class="space-y-1">
                    <div class="font-extrabold text-white text-sm">{{ item.name }}</div>
                    <div class="flex flex-wrap items-center gap-1.5 text-xs">
                      <span class="text-amber-400 font-bold">{{ item.sizeType }}</span>
                      <span class="text-slate-500">•</span>
                      <span class="text-cyan-300 font-bold">🏢 NCC: {{ item.supplierName }}</span>
                    </div>
                    <div class="text-[11px] text-slate-400 font-medium">
                      Đơn giá bán: <strong class="text-amber-400">{{ formatVND(item.customPrice || item.sellingPrice) }}</strong> • Vốn NCC: <span class="text-slate-400">{{ formatVND(item.costPrice) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Controls (+/- & Thành tiền) -->
                <div class="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <!-- Stepper -->
                  <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
                    <button
                      type="button"
                      @click="decreaseCartItem(item)"
                      class="w-7 h-7 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 font-black text-xs flex items-center justify-center transition cursor-pointer active:scale-95"
                    >
                      -
                    </button>
                    <span class="w-8 text-center text-amber-300 font-black text-sm">
                      {{ item.quantity }}
                    </span>
                    <button
                      type="button"
                      @click="increaseCartItem(item)"
                      class="w-7 h-7 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 font-black text-xs flex items-center justify-center transition cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>

                  <!-- Subtotal for item -->
                  <div class="text-right min-w-[100px]">
                    <div class="font-black text-amber-400 text-sm">
                      {{ formatVND((item.customPrice || item.sellingPrice) * item.quantity) }}
                    </div>
                    <div class="text-[10px] text-emerald-400 font-bold">
                      Lời: +{{ formatVND(((item.customPrice || item.sellingPrice) - item.costPrice) * item.quantity) }}
                    </div>
                  </div>

                  <!-- Remove item -->
                  <button
                    @click="removeCartItem(item.cartId)"
                    class="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    title="Xóa món này khỏi giỏ"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- BẢNG TÍNH LỢI NHUẬN RÒNG TOÀN BỘ GIỎ HÀNG -->
          <div class="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h4 class="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp class="w-4 h-4 text-emerald-400" />
              <span>Bảng Tính Lợi Nhuận Toàn Bộ Đơn Hàng</span>
            </h4>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between text-slate-300">
                <span>Tổng tiền bán ({{ cartTotalQuantity }} con):</span>
                <span class="font-bold text-white">{{ formatVND(cartTotalSelling) }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Tổng tiền vốn các lô NCC:</span>
                <span>- {{ formatVND(cartTotalCost) }}</span>
              </div>
              <div v-if="orderForm.shippingFee > 0" class="flex justify-between text-cyan-400">
                <span>Tiền xe ship giao:</span>
                <span>- {{ formatVND(orderForm.shippingFee) }}</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-slate-800">
                <span class="text-xs font-extrabold text-emerald-400 uppercase">TỔNG TIỀN LỜI RÒNG:</span>
                <span class="text-lg font-black text-emerald-400">+{{ formatVND(cartTotalProfit) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CỘT PHẢI (5 COLS): THÔNG TIN GIAO HÀNG & THANH TOÁN -->
        <div class="lg:col-span-5 space-y-5">
          <div class="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div class="border-b border-slate-800/80 pb-3">
              <h3 class="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <MapPin class="w-4 h-4 text-rose-500" />
                <span>THÔNG TIN GIAO HÀNG & KHÁCH</span>
              </h3>
            </div>

            <!-- Chọn nhanh khách quen -->
            <div v-if="customers.length > 0" class="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <label class="block text-[11px] font-bold text-amber-400 mb-1">
                ⭐ Chọn nhanh khách quen:
              </label>
              <select
                @change="handleSelectSavedCustomer"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 outline-none cursor-pointer focus:border-amber-500"
              >
                <option value="">-- Bấm để chọn tự động điền Tên, SĐT, Địa chỉ --</option>
                <option v-for="c in customers" :key="c.id" :value="c.id">
                  {{ c.tenKhachHang || c.name }} ({{ c.soDienThoai || c.phone }})
                </option>
              </select>
            </div>

            <!-- Form Khách -->
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">
                  Họ tên người nhận <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  v-model="orderForm.customerName"
                  placeholder="VD: Anh Minh - Ba Vì"
                  class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">
                  Số điện thoại <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  v-model="orderForm.customerPhone"
                  placeholder="0988123456"
                  maxlength="11"
                  class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">
                  Địa chỉ giao hàng <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  v-model="orderForm.customerAddress"
                  placeholder="Số nhà, tên đường hoặc bến xe..."
                  class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <!-- Tiền xe & Người chịu ship -->
              <div class="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-cyan-400 flex items-center gap-1">
                    <Truck class="w-3.5 h-3.5" />
                    <span>Phí Vận Chuyển / Tiền Xe Ship Giao:</span>
                  </label>
                </div>
                
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    :value="formatInputDisplay(orderForm.shippingFee)"
                    @input="handleOrderShippingInput"
                    placeholder="0"
                    class="w-full bg-slate-950 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-cyan-300 outline-none focus:border-cyan-400"
                  />
                  <span class="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1.5 rounded-xl border border-cyan-500/20 shrink-0">
                    VNĐ
                  </span>
                </div>

                <!-- 2 TÙY CHỌN: KHÁCH CHỊU SHIP VS SHOP CHỊU SHIP (FREESHIP) -->
                <div v-if="orderForm.shippingFee > 0" class="pt-1.5 border-t border-slate-800/80 space-y-1.5">
                  <span class="text-[11px] font-bold text-slate-400 block">Ai chịu tiền xe này?</span>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      @click="orderForm.shippingPayer = 'buyer'"
                      :class="[
                        'py-2 px-2.5 rounded-xl border text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-left',
                        orderForm.shippingPayer === 'buyer'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-900/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      ]"
                    >
                      <span class="w-2 h-2 rounded-full" :class="orderForm.shippingPayer === 'buyer' ? 'bg-cyan-400' : 'bg-slate-600'"></span>
                      <span>Khách chịu ship (+tiền xe)</span>
                    </button>

                    <button
                      type="button"
                      @click="orderForm.shippingPayer = 'shop'"
                      :class="[
                        'py-2 px-2.5 rounded-xl border text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-left',
                        orderForm.shippingPayer === 'shop'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md shadow-purple-900/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      ]"
                    >
                      <span class="w-2 h-2 rounded-full" :class="orderForm.shippingPayer === 'shop' ? 'bg-purple-400' : 'bg-slate-600'"></span>
                      <span>Mình chịu (Freeship/Trừ lời)</span>
                    </button>
                  </div>

                  <p v-if="orderForm.shippingPayer === 'shop'" class="text-[10px] text-purple-300 italic">
                    💡 Freeship cho khách: Tổng thanh toán của khách không cộng tiền xe. Tiền xe {{ formatVND(orderForm.shippingFee) }} sẽ được trừ trực tiếp vào tiền lời của đơn hàng.
                  </p>
                  <p v-else class="text-[10px] text-cyan-300 italic">
                    💡 Khách thanh toán tiền xe: Tổng tiền khách trả = Tiền heo + Tiền xe. Tiền lời của bạn giữ nguyên.
                  </p>
                </div>
              </div>
            </div>

            <!-- PHƯƠNG THỨC THANH TOÁN -->
            <div class="space-y-2.5 pt-2 border-t border-slate-800">
              <label class="block text-xs font-extrabold uppercase text-white">
                PHƯƠNG THỨC THANH TOÁN
              </label>

              <div class="grid grid-cols-2 gap-2">
                <label 
                  @click="orderForm.paymentMethod = 'Cash'"
                  :class="[
                    'flex items-center gap-2 p-2.5 rounded-xl border transition cursor-pointer text-xs',
                    orderForm.paymentMethod === 'Cash' 
                      ? 'bg-amber-500/15 border-amber-500 text-white font-bold' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  ]"
                >
                  <input type="radio" name="payment" value="Cash" :checked="orderForm.paymentMethod === 'Cash'" class="accent-amber-500" />
                  <span>💵 Tiền mặt</span>
                </label>

                <label 
                  @click="orderForm.paymentMethod = 'Bank'"
                  :class="[
                    'flex items-center gap-2 p-2.5 rounded-xl border transition cursor-pointer text-xs',
                    orderForm.paymentMethod === 'Bank' 
                      ? 'bg-cyan-500/15 border-cyan-500 text-white font-bold' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  ]"
                >
                  <input type="radio" name="payment" value="Bank" :checked="orderForm.paymentMethod === 'Bank'" class="accent-cyan-500" />
                  <span>🏦 Chuyển khoản</span>
                </label>
              </div>

              <!-- VIETQR -->
              <div v-if="orderForm.paymentMethod === 'Bank'" class="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5 animate-in fade-in duration-200">
                <select
                  v-model="orderForm.bankAccountId"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option v-for="b in bankAccounts" :key="b.id" :value="b.id">
                    {{ b.bankName || b.tenNganHang }} - {{ b.accountNumber || b.soTaiKhoan }} ({{ b.accountHolder || b.chuTaiKhoan }})
                  </option>
                </select>

                <div v-if="selectedBank" class="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <img
                    :src="vietQRUrl"
                    alt="VietQR"
                    class="w-20 h-20 rounded-lg bg-white p-1 shrink-0 shadow"
                  />
                  <div class="text-[11px] space-y-0.5">
                    <div class="font-bold text-white">{{ selectedBank.bankName || selectedBank.tenNganHang }}</div>
                    <div class="text-cyan-400 font-mono font-bold">{{ selectedBank.accountNumber || selectedBank.soTaiKhoan }}</div>
                    <div class="text-slate-400 font-semibold">{{ selectedBank.accountHolder || selectedBank.chuTaiKhoan }}</div>
                    <div class="text-amber-400 font-extrabold text-xs pt-0.5">Số tiền: {{ formatVND(cartTotalPayment) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TỔNG TIỀN & XÁC NHẬN ĐẶT HÀNG -->
            <div class="pt-3 border-t border-slate-800 space-y-2.5">
              <div class="space-y-1 text-xs">
                <div class="flex justify-between text-slate-400">
                  <span>Tiền heo ({{ cartTotalQuantity }} con):</span>
                  <span class="font-bold text-slate-200">{{ formatVND(cartTotalSelling) }}</span>
                </div>
                <div class="flex justify-between text-slate-400">
                  <span>Tiền xe:</span>
                  <span class="font-bold text-cyan-300">{{ orderForm.shippingFee > 0 ? ('+' + formatVND(orderForm.shippingFee)) : 'Miễn phí' }}</span>
                </div>
                <div class="flex justify-between items-baseline pt-1.5 border-t border-slate-800">
                  <span class="text-xs font-extrabold text-white uppercase">TỔNG THANH TOÁN:</span>
                  <span class="text-2xl font-black text-amber-400">{{ formatVND(cartTotalPayment) }}</span>
                </div>
              </div>

              <!-- BIG CTA BUTTON: ĐẶT HÀNG -->
              <button
                type="button"
                @click="handlePlaceOrder"
                :disabled="isSubmittingOrder || cart.length === 0"
                class="w-full py-4 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 transition-all transform active:scale-98 flex items-center justify-center gap-2 border border-white/15 cursor-pointer mt-2 disabled:opacity-50"
              >
                <CheckCircle2 class="w-5 h-5" />
                <span>{{ isSubmittingOrder ? 'ĐANG XỬ LÝ...' : `XÁC NHẬN XUẤT ĐƠN (${cartTotalQuantity} CON)` }}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL: CHỌN SỐ LƯỢNG HEO THEO TỪNG NHÀ CUNG CẤP TRƯỚC KHI THÊM GIỎ -->
    <!-- ========================================================================= -->
    <div 
      v-if="showSupplierPicker && activeGroup" 
      class="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center overscroll-contain animate-in fade-in duration-150"
    >
      <div 
        class="bg-slate-950 border-2 border-amber-500/60 rounded-3xl shadow-2xl shadow-amber-950/40 p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto ring-1 ring-white/10"
        style="width: 100%; max-width: 620px; margin: auto;"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div class="flex items-center gap-3">
            <img
              :src="activeGroup.image || defaultPigImage"
              alt=""
              class="w-14 h-14 rounded-2xl object-cover border border-slate-800 shadow shrink-0"
              @error="handleImgError"
            />
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {{ activeGroup.sizeType }}
                </span>
                <h2 class="text-base sm:text-lg font-black text-white tracking-tight">
                  {{ activeGroup.name }}
                </h2>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Đơn giá bán: <strong class="text-amber-400">{{ formatVND(activeGroup.sellingPrice) }}/con</strong></span>
                <span>•</span>
                <span class="text-emerald-400 font-bold">Còn tổng: {{ activeGroup.totalHeads }} con</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="showSupplierPicker = false"
            class="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-xs border border-slate-800"
          >
            ✕
          </button>
        </div>

        <!-- BẢNG CHỌN SỐ LƯỢNG TỪNG NHÀ CUNG CẤP -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold uppercase text-amber-400 tracking-wider">
              Chọn Số Lượng Heo Mua Theo Từng Nhà Cung Cấp:
            </label>
            <span class="text-[11px] text-slate-400">
              Có {{ activeGroup.items.length }} lô hàng
            </span>
          </div>

          <div class="space-y-2.5">
            <div 
              v-for="item in activeGroup.items" 
              :key="item.id"
              class="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl transition"
            >
              <!-- Info NCC & Vốn -->
              <div class="space-y-0.5">
                <div class="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                  <span>🏢 Nhà Cung Cấp: <strong class="text-cyan-300">{{ item.supplier?.tenNhaCungCap || item.nhaCungCap?.tenNhaCungCap || 'NCC' }}</strong></span>
                </div>
                <div class="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Giá vốn nhập: <strong class="text-slate-300">{{ formatVND(item.costPrice || item.giaNhapVon) }}</strong></span>
                  <span>•</span>
                  <span>Còn trong kho: <strong class="text-emerald-400">{{ (item.headCount !== undefined ? item.headCount : (item.soLuongCon || 0)) }} con</strong></span>
                </div>
              </div>

              <!-- Stepper Chọn Số Lượng -->
              <div class="flex items-center gap-2 shrink-0">
                <div class="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
                  <button
                    type="button"
                    @click="supplierPickCounts[item.id] = Math.max(0, (supplierPickCounts[item.id] || 0) - 1)"
                    class="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-black text-sm flex items-center justify-center transition cursor-pointer active:scale-95"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    :max="(item.headCount !== undefined ? item.headCount : (item.soLuongCon || 0))"
                    v-model.number="supplierPickCounts[item.id]"
                    class="w-12 text-center bg-slate-950 text-amber-300 font-black text-sm outline-none border-0 ring-0 py-1"
                  />
                  <button
                    type="button"
                    @click="handleIncreaseSupplierPick(item)"
                    class="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-black text-sm flex items-center justify-center transition cursor-pointer active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TỔNG KẾT MỤC ĐANG CHỌN -->
          <div class="bg-gradient-to-r from-slate-900 to-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-300 font-medium">
              Đang chọn: <strong class="text-amber-400 font-black text-sm">{{ totalPickedCountInModal }} con</strong>
            </span>
            <span class="text-slate-300 font-medium">
              Tạm tính: <strong class="text-amber-400 font-black text-sm">{{ formatVND(totalPickedCountInModal * activeGroup.sellingPrice) }}</strong>
            </span>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            @click="handleAddToCart(false)"
            :disabled="totalPickedCountInModal <= 0"
            class="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart class="w-4 h-4" />
            <span>Thêm Vào Giỏ Hàng</span>
          </button>

          <button
            type="button"
            @click="handleAddToCart(true)"
            :disabled="totalPickedCountInModal <= 0"
            class="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/25 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Mua Ngay & Đến Giỏ</span>
          </button>
        </div>
      </div>
    </div>

    <!-- POPUP THÀNH CÔNG SAU KHI ĐẶT -->
    <div 
      v-if="orderSuccess" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div class="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 text-center space-y-4 shadow-2xl">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>
        <h3 class="text-xl font-extrabold text-white">Đã Đặt Hàng Thành Công!</h3>
        <p class="text-xs text-slate-400">
          Mã đơn hàng: <span class="font-mono text-amber-400 font-bold">{{ orderSuccess.orderCode || orderSuccess.maDonHang || orderSuccess.id || 'ORD-SUCCESS' }}</span>
        </p>
        <div class="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Khách hàng:</span>
            <span class="font-bold text-white">{{ orderSuccess.customerName || orderSuccess.tenKhachHang || orderForm.customerName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Tổng tiền thanh toán:</span>
            <span class="font-bold text-amber-400">{{ formatVND(cartTotalPayment) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Tổng tiền lời ròng:</span>
            <span class="font-bold text-emerald-400">+{{ formatVND(cartTotalProfit) }}</span>
          </div>
        </div>

        <button
          @click="orderSuccess = null; currentView = 'store'; cart = []"
          class="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition cursor-pointer"
        >
          Quay Lại Cửa Hàng
        </button>
      </div>
    </div>

    <!-- POPUP THÔNG BÁO / LỖI IN-APP (KHÔNG DÙNG BROWSER ALERT) -->
    <div 
      v-if="customAlert.show" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div class="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-xl">
          <AlertCircle class="w-6 h-6" />
        </div>
        <h4 class="text-base font-extrabold text-white">{{ customAlert.title }}</h4>
        <p class="text-xs text-slate-300">{{ customAlert.message }}</p>
        <button
          @click="customAlert.show = false"
          class="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
        >
          Đồng Ý
        </button>
      </div>
    </div>
    <!-- ========================================== -->
    <!-- MODAL LIGHTBOX XEM ẢNH ĐẸP BÁN HÀNG TẠI POS -->
    <!-- ========================================== -->
    <div 
      v-if="showGalleryModal" 
      class="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
      @click.self="closeGallery"
    >
      <div class="w-full max-w-4xl flex items-center justify-between py-2 text-white border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg font-black text-amber-400">📸 {{ activeGalleryProduct?.name || 'Ảnh Bán Hàng' }}</span>
          <span class="px-2 py-0.5 rounded bg-white/10 text-xs text-slate-300">
            {{ galleryIndex + 1 }} / {{ galleryImages.length }}
          </span>
        </div>
        <button
          @click="closeGallery"
          class="p-2 px-3.5 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition text-xs font-black cursor-pointer"
        >
          ✕ Đóng
        </button>
      </div>

      <div class="relative w-full max-w-4xl flex items-center justify-center h-[65vh] bg-black/40 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <img 
          :src="galleryImages[galleryIndex]" 
          class="max-w-full max-h-full object-contain select-none"
        />

        <button
          v-if="galleryImages.length > 1"
          @click="prevGalleryImage"
          class="absolute left-4 w-12 h-12 rounded-full bg-black/70 hover:bg-amber-600 text-white flex items-center justify-center text-2xl font-black transition border border-white/20 cursor-pointer shadow-lg active:scale-90"
        >
          ‹
        </button>
        <button
          v-if="galleryImages.length > 1"
          @click="nextGalleryImage"
          class="absolute right-4 w-12 h-12 rounded-full bg-black/70 hover:bg-amber-600 text-white flex items-center justify-center text-2xl font-black transition border border-white/20 cursor-pointer shadow-lg active:scale-90"
        >
          ›
        </button>
      </div>

      <div v-if="galleryImages.length > 1" class="w-full max-w-4xl flex items-center gap-2 overflow-x-auto py-3 justify-center">
        <div 
          v-for="(img, idx) in galleryImages" 
          :key="idx"
          @click="galleryIndex = idx"
          :class="[
            'w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition shrink-0',
            galleryIndex === idx ? 'border-amber-400 scale-105 ring-2 ring-amber-400/50' : 'border-white/20 opacity-60 hover:opacity-100'
          ]"
        >
          <img :src="img" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  Flame, Snowflake, ShoppingCart, Truck, CreditCard, DollarSign, 
  Search, CheckCircle2, User, Phone, MapPin, Building2, AlertCircle,
  Tag, Package, Calendar, Sparkles, TrendingUp, RefreshCw, ArrowLeft, Trash2
} from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import { formatVND, formatNumber, formatDate } from '../utils/formatters';
import { generateVietQRUrl } from '../utils/vietqr';
import { showToast } from '../utils/dialog';

const defaultPigImage = 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&auto=format&fit=crop&q=80';

const products = ref([]);
const bankAccounts = ref([]);
const customers = ref([]);
const loading = ref(false);

const search = ref('');
const filterPreserve = ref('ALL');
const filterFeature = ref('ALL');
const filterSize = ref('ALL');

const currentView = ref('store'); // 'store' hoặc 'cart'
const orderSuccess = ref(null);
const isSubmittingOrder = ref(false);

// GIỎ HÀNG (MULTI-ITEM CART)
const cart = ref([]);

// GALLERY LIGHTBOX & MULTI-IMAGE CAROUSEL STATE
const cardImageIndexes = ref({});
const showGalleryModal = ref(false);
const activeGalleryProduct = ref(null);
const galleryImages = ref([]);
const galleryIndex = ref(0);

const getCardImages = (card) => {
  if (!card) return [defaultPigImage];
  if (card.imageList && Array.isArray(card.imageList) && card.imageList.length > 0) {
    return card.imageList;
  }
  if (card.danhSachHinhAnh) {
    try {
      const parsed = JSON.parse(card.danhSachHinhAnh);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  if (card.images) {
    try {
      const parsed = JSON.parse(card.images);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  if (card.image || card.imageUrl || card.hinhAnh) {
    return [card.image || card.imageUrl || card.hinhAnh];
  }
  return [defaultPigImage];
};

const getCardCurrentImage = (card) => {
  const imgs = getCardImages(card);
  const idx = cardImageIndexes.value[card.id] || 0;
  return imgs[idx % imgs.length];
};

const nextCardImage = (card) => {
  const imgs = getCardImages(card);
  if (imgs.length <= 1) return;
  const current = cardImageIndexes.value[card.id] || 0;
  cardImageIndexes.value[card.id] = (current + 1) % imgs.length;
};

const prevCardImage = (card) => {
  const imgs = getCardImages(card);
  if (imgs.length <= 1) return;
  const current = cardImageIndexes.value[card.id] || 0;
  cardImageIndexes.value[card.id] = (current - 1 + imgs.length) % imgs.length;
};

const openGallery = (card) => {
  activeGalleryProduct.value = card;
  galleryImages.value = getCardImages(card);
  galleryIndex.value = cardImageIndexes.value[card.id] || 0;
  showGalleryModal.value = true;
};

const closeGallery = () => {
  showGalleryModal.value = false;
  activeGalleryProduct.value = null;
};

const nextGalleryImage = () => {
  if (galleryImages.value.length <= 1) return;
  galleryIndex.value = (galleryIndex.value + 1) % galleryImages.value.length;
};

const prevGalleryImage = () => {
  if (galleryImages.value.length <= 1) return;
  galleryIndex.value = (galleryIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
};

// MODAL CHỌN NHÀ CUNG CẤP
const showSupplierPicker = ref(false);
const activeGroup = ref(null);
const supplierPickCounts = ref({});

const orderForm = ref({
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  shippingFee: 0,
  shippingPayer: 'buyer', // 'buyer' (Khách chịu) hoặc 'shop' (Shop chịu / Freeship)
  otherExpenses: 0,
  paymentMethod: 'Cash',
  bankAccountId: '',
  notes: ''
});

const handleSelectSavedCustomer = (e) => {
  const custId = e.target.value;
  if (!custId) return;
  const cust = customers.value.find(c => String(c.id) === String(custId));
  if (cust) {
    orderForm.value.customerName = cust.tenKhachHang || cust.name || '';
    orderForm.value.customerPhone = cust.soDienThoai || cust.phone || '';
    orderForm.value.customerAddress = cust.diaChi || cust.address || '';
  }
};

const formatInputDisplay = (val) => {
  if (val === null || val === undefined || val === '') return '';
  const num = Number(val);
  if (isNaN(num)) return '';
  return num.toLocaleString('vi-VN');
};

const handleOrderShippingInput = (e) => {
  const raw = e.target.value.replace(/\D/g, '');
  orderForm.value.shippingFee = raw ? Number(raw) : 0;
};

const fetchData = async (isSilent = false) => {
  try {
    if (!isSilent && products.value.length === 0) {
      loading.value = true;
    }
    const [prodRes, bankRes, custRes] = await Promise.all([
      fetch('/api/products').catch(() => null),
      fetch('/api/bank-accounts').catch(() => null),
      fetch('/api/customers').catch(() => null)
    ]);
    
    if (prodRes && prodRes.ok) {
      const prods = await prodRes.json();
      products.value = Array.isArray(prods) ? prods : (prods?.data && Array.isArray(prods.data) ? prods.data : []);
    } else {
      products.value = [];
    }

    if (bankRes && bankRes.ok) {
      const banks = await bankRes.json();
      bankAccounts.value = Array.isArray(banks) ? banks : (banks?.data && Array.isArray(banks.data) ? banks.data : []);
      if (bankAccounts.value.length > 0 && !orderForm.value.bankAccountId) {
        orderForm.value.bankAccountId = bankAccounts.value[0].id;
      }
    } else {
      bankAccounts.value = [];
    }

    if (custRes && custRes.ok) {
      const custs = await custRes.json();
      customers.value = Array.isArray(custs) ? custs : (custs?.data && Array.isArray(custs.data) ? custs.data : []);
    } else {
      customers.value = [];
    }
  } catch (e) {
    console.error("Lỗi tải dữ liệu:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const getPreserveBadge = (type) => {
  switch (type) {
    case 'cold':
      return { 
        label: 'Hàng Lạnh', 
        icon: '❄️', 
        cardClass: 'bg-cyan-600 text-white border-cyan-400/40'
      };
    case 'wrapped':
    case 'hot_wrapped':
      return { 
        label: 'Nóng Cuộn Bọc', 
        icon: '📦', 
        cardClass: 'bg-amber-600 text-white border-amber-400/40'
      };
    case 'hot':
    default:
      return { 
        label: 'Hàng Nóng', 
        icon: '🔥', 
        cardClass: 'bg-rose-600 text-white border-rose-400/40'
      };
  }
};

const getPigFeatureBadge = (feature) => {
  switch (feature) {
    case 'duoi_dai':
      return { 
        label: 'Đuôi Dài', 
        icon: '🐖', 
        cardClass: 'bg-indigo-600/90 text-white border-indigo-400/40'
      };
    case 'rung_lai':
      return { 
        label: 'Rừng Lai', 
        icon: '🐗', 
        cardClass: 'bg-amber-700/90 text-white border-amber-500/40'
      };
    case 'mong_cai':
      return { 
        label: 'Móng Cái', 
        icon: '🐽', 
        cardClass: 'bg-pink-600/90 text-white border-pink-400/40'
      };
    case 'duoi_cut':
    default:
      return { 
        label: 'Đuôi Cụt', 
        icon: '🐷', 
        cardClass: 'bg-emerald-600/90 text-white border-emerald-400/40'
      };
  }
};

const getGrossProfitInfo = (p) => {
  const sell = Number(p.sellingPrice || p.giaBanRa) || 0;
  const cost = Number(p.costPrice || p.giaNhapVon) || 0;
  
  if (sell <= 0) {
    return {
      text: '0 đ',
      colorClass: 'text-slate-400'
    };
  }
  
  const diff = sell - cost;
  if (diff > 0) {
    return {
      text: `+${formatVND(diff)}`,
      colorClass: 'text-emerald-400'
    };
  } else if (diff === 0) {
    return {
      text: '0 đ',
      colorClass: 'text-slate-300'
    };
  } else {
    return {
      text: `-${formatVND(Math.abs(diff))}`,
      colorClass: 'text-rose-400'
    };
  }
};

const handleImgError = (e) => {
  e.target.src = defaultPigImage;
};

const allSizes = computed(() => {
  return Array.from(new Set(products.value.map(p => p.sizeType || p.loaiSize).filter(Boolean)));
});

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    // Chỉ hiển thị các sản phẩm đã được cài đặt giá bán > 0 bên Quản Lý Sản Phẩm
    const sellPrice = Number(p.sellingPrice || p.giaBanRa) || 0;
    if (sellPrice <= 0) return false;

    const name = (p.name || p.tenSanPham || '').toLowerCase();
    const size = (p.sizeType || p.loaiSize || '').toLowerCase();
    const supName = (p.supplier?.tenNhaCungCap || p.nhaCungCap?.tenNhaCungCap || '').toLowerCase();
    const preserveType = p.porkType || p.loaiHeo || 'hot';
    const featureType = p.pigFeature || p.dacDiemHeo || 'duoi_cut';

    const matchesSearch = name.includes(search.value.toLowerCase()) || size.includes(search.value.toLowerCase()) || supName.includes(search.value.toLowerCase());
    const matchesPreserve = filterPreserve.value === 'ALL' || preserveType === filterPreserve.value || (filterPreserve.value === 'wrapped' && (preserveType === 'wrapped' || preserveType === 'hot_wrapped'));
    const matchesFeature = filterFeature.value === 'ALL' || featureType === filterFeature.value;
    const matchesSize = filterSize.value === 'ALL' || (p.sizeType || p.loaiSize) === filterSize.value;

    return matchesSearch && matchesPreserve && matchesFeature && matchesSize;
  });
});

// LOGIC HIỂN THỊ CÁC THẺ THEO NHÓM GỘP THỰC TẾ (NẾU NHÓM ĐÃ GỘP THÌ GỘP, CÒN LẠI TÁCH RIÊNG ĐỂ BÁN GIÁ RIÊNG)
const displayCards = computed(() => {
  const result = [];
  const processedGroupIds = new Set();

  for (const p of filteredProducts.value) {
    const groupId = p.nhomGopId || p.groupId;
    
    // Nếu sản phẩm thuộc về một nhóm gộp (nhomGopId có giá trị)
    if (groupId) {
      if (processedGroupIds.has(groupId)) continue;
      processedGroupIds.add(groupId);

      // Tìm tất cả sản phẩm trong nhóm gộp này
      const groupItems = filteredProducts.value.filter(item => (item.nhomGopId || item.groupId) === groupId);
      
      if (groupItems.length > 1) {
        // Nhóm thực sự có từ 2 sản phẩm trở lên -> Hiển thị dạng thẻ GỘP
        const first = groupItems[0];
        let totalHeads = 0;
        let totalCostSum = 0;
        let minCost = Infinity;
        let maxCost = -Infinity;
        const suppliers = [];

        groupItems.forEach(item => {
          const heads = Number(item.headCount !== undefined ? item.headCount : (item.soLuongCon || 0)) || 0;
          const cost = Number(item.costPrice || item.giaNhapVon || 0) || 0;
          const supName = item.supplier?.tenNhaCungCap || item.nhaCungCap?.tenNhaCungCap || 'NCC';
          
          totalHeads += heads;
          totalCostSum += (cost * heads);
          if (cost < minCost) minCost = cost;
          if (cost > maxCost) maxCost = cost;

          const existingSup = suppliers.find(s => s.name === supName && s.cost === cost);
          if (existingSup) {
            existingSup.count += heads;
          } else {
            suppliers.push({
              id: item.supplier?.id || item.nhaCungCap?.id,
              name: supName,
              count: heads,
              cost,
              productId: item.id
            });
          }
        });

        const avgCost = totalHeads > 0 ? Math.round(totalCostSum / totalHeads) : (minCost !== Infinity ? minCost : 0);

        result.push({
          isMerged: true,
          groupId: groupId,
          id: first.id,
          name: first.name || first.tenSanPham,
          image: groupItems.find(it => it.image || it.imageUrl || it.hinhAnh)?.image || first.image || defaultPigImage,
          porkType: first.porkType || first.loaiHeo || 'hot',
          pigFeature: first.pigFeature || first.dacDiemHeo || 'duoi_cut',
          sizeType: first.sizeType || first.loaiSize || '',
          sellingPrice: Number(first.sellingPrice || first.giaBanRa || 0),
          importDetails: first.importDetails || first.chiTietNhap || '',
          totalHeads,
          minCost: minCost === Infinity ? 0 : minCost,
          maxCost: maxCost === -Infinity ? 0 : maxCost,
          avgCost,
          suppliers,
          items: groupItems
        });
        continue;
      }
    }

    // Nếu là sản phẩm đơn lẻ (chưa gộp hoặc nhóm chỉ có 1 sản phẩm)
    const heads = Number(p.headCount !== undefined ? p.headCount : (p.soLuongCon || 0)) || 0;
    const cost = Number(p.costPrice || p.giaNhapVon || 0) || 0;
    const supName = p.supplier?.tenNhaCungCap || p.nhaCungCap?.tenNhaCungCap || 'NCC';

    result.push({
      isMerged: false,
      groupId: null,
      id: p.id,
      name: p.name || p.tenSanPham,
      image: p.image || p.imageUrl || p.hinhAnh || defaultPigImage,
      porkType: p.porkType || p.loaiHeo || 'hot',
      pigFeature: p.pigFeature || p.dacDiemHeo || 'duoi_cut',
      sizeType: p.sizeType || p.loaiSize || '',
      sellingPrice: Number(p.sellingPrice || p.giaBanRa || 0),
      importDetails: p.importDetails || p.chiTietNhap || '',
      totalHeads: heads,
      minCost: cost,
      maxCost: cost,
      avgCost: cost,
      supplierName: supName,
      supplierId: p.supplier?.id || p.nhaCungCap?.id,
      suppliers: [{
        id: p.supplier?.id || p.nhaCungCap?.id,
        name: supName,
        count: heads,
        cost,
        productId: p.id
      }],
      items: [p]
    });
  }

  return result;
});

// THAO TÁC CHỌN NCC & THÊM VÀO GIỎ HÀNG
const handleOpenSupplierPicker = (group) => {
  activeGroup.value = group;
  supplierPickCounts.value = {};
  
  // Mặc định chọn 1 con ở nhà cung cấp đầu tiên có hàng
  let hasSetFirst = false;
  for (const item of group.items) {
    const stock = Number(item.headCount !== undefined ? item.headCount : (item.soLuongCon || 0)) || 0;
    if (stock > 0 && !hasSetFirst) {
      supplierPickCounts.value[item.id] = 1;
      hasSetFirst = true;
    } else {
      supplierPickCounts.value[item.id] = 0;
    }
  }
  showSupplierPicker.value = true;
};

const handleIncreaseSupplierPick = (item) => {
  const stock = Number(item.headCount !== undefined ? item.headCount : (item.soLuongCon || 0)) || 0;
  const current = supplierPickCounts.value[item.id] || 0;
  if (current >= stock) {
    showAlert(`Lô của nhà cung cấp này chỉ còn ${stock} con trong kho!`, "Hết Tồn Kho NCC");
    return;
  }
  supplierPickCounts.value[item.id] = current + 1;
};

const totalPickedCountInModal = computed(() => {
  if (!activeGroup.value) return 0;
  return Object.values(supplierPickCounts.value).reduce((sum, c) => sum + (Number(c) || 0), 0);
});

const handleAddToCart = (goToCheckout = false) => {
  if (!activeGroup.value) return;

  let addedCount = 0;
  for (const item of activeGroup.value.items) {
    const qty = Number(supplierPickCounts.value[item.id]) || 0;
    if (qty > 0) {
      const supName = item.supplier?.tenNhaCungCap || item.nhaCungCap?.tenNhaCungCap || 'NCC';
      const existingCartItem = cart.value.find(c => c.productId === item.id);
      
      const stock = Number(item.headCount !== undefined ? item.headCount : (item.soLuongCon || 0)) || 0;

      if (existingCartItem) {
        existingCartItem.quantity = Math.min(stock, existingCartItem.quantity + qty);
      } else {
        cart.value.push({
          cartId: `${item.id}_${Date.now()}_${Math.random()}`,
          productId: item.id,
          name: item.name || item.tenSanPham || activeGroup.value.name,
          porkType: item.porkType || item.loaiHeo || activeGroup.value.porkType,
          pigFeature: item.pigFeature || item.dacDiemHeo || activeGroup.value.pigFeature,
          sizeType: item.sizeType || item.loaiSize || activeGroup.value.sizeType,
          supplierName: supName,
          costPrice: Number(item.costPrice || item.giaNhapVon) || 0,
          sellingPrice: Number(activeGroup.value.sellingPrice || item.sellingPrice || item.giaBanRa) || 0,
          customPrice: Number(activeGroup.value.sellingPrice || item.sellingPrice || item.giaBanRa) || 0,
          quantity: qty,
          maxStock: stock,
          image: item.image || item.imageUrl || item.hinhAnh || activeGroup.value.image
        });
      }
      addedCount += qty;
    }
  }

  if (addedCount > 0) {
    showToast(`Đã thêm ${addedCount} con heo vào giỏ hàng thành công!`, "success");
    showSupplierPicker.value = false;
    if (goToCheckout) {
      currentView.value = 'cart';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};

const increaseCartItem = (cartItem) => {
  if (cartItem.quantity >= cartItem.maxStock) {
    showAlert(`Lô của ${cartItem.supplierName} chỉ còn tối đa ${cartItem.maxStock} con trong kho!`, "Đạt Tối Đa Tồn Kho");
    return;
  }
  cartItem.quantity++;
};

const decreaseCartItem = (cartItem) => {
  if (cartItem.quantity > 1) {
    cartItem.quantity--;
  } else {
    removeCartItem(cartItem.cartId);
  }
};

const removeCartItem = (cartId) => {
  cart.value = cart.value.filter(c => c.cartId !== cartId);
};

const handleClearCart = () => {
  cart.value = [];
  showToast("Đã dọn sạch toàn bộ giỏ hàng!", "info");
};

// CART COMPUTATIONS
const cartTotalItems = computed(() => cart.value.length);
const cartTotalQuantity = computed(() => cart.value.reduce((s, c) => s + c.quantity, 0));

const cartTotalSelling = computed(() => {
  return cart.value.reduce((sum, item) => {
    const price = item.customPrice !== null && item.customPrice !== undefined ? Number(item.customPrice) : Number(item.sellingPrice || 0);
    return sum + (price * item.quantity);
  }, 0);
});

const cartTotalDiscount = computed(() => {
  return cart.value.reduce((sum, item) => {
    const originalPrice = Number(item.sellingPrice || 0);
    const customPrice = item.customPrice !== null && item.customPrice !== undefined ? Number(item.customPrice) : originalPrice;
    const diff = originalPrice - customPrice;
    return sum + (diff > 0 ? diff * item.quantity : 0);
  }, 0);
});

const cartTotalPayment = computed(() => {
  let total = cartTotalSelling.value;
  if (orderForm.value.shippingPayer === 'buyer') {
    total += (Number(orderForm.value.shippingFee) || 0);
  }
  return total;
});

const availableBankOptions = computed(() => {
  return bankAccounts.value.map(acc => {
    const nccName = acc.nhaCungCap?.tenNhaCungCap || 'NCC';
    const label = acc.loaiTaiKhoan === 'NCC' 
      ? `STK ${acc.tenNganHang} - ${acc.soTaiKhoan} (${nccName})`
      : `STK ${acc.tenNganHang} - ${acc.soTaiKhoan} (Người Nhà: ${acc.tenChuTaiKhoan})`;
    return {
      id: acc.id,
      label,
      bankName: acc.tenNganHang,
      accountNo: acc.soTaiKhoan,
      accountName: acc.tenChuTaiKhoan,
      type: acc.loaiTaiKhoan
    };
  });
});

const selectedBank = computed(() => {
  return bankAccounts.value.find(b => String(b.id) === String(orderForm.value.bankAccountId)) || bankAccounts.value[0];
});

const vietQRUrl = computed(() => {
  if (!selectedBank.value) return '';
  return generateVietQRUrl({
    bankId: selectedBank.value.bankCode || selectedBank.value.maNganHang || selectedBank.value.bankName,
    accountNo: selectedBank.value.accountNumber || selectedBank.value.soTaiKhoan,
    template: 'compact',
    amount: cartTotalPayment.value,
    description: `HEO ${orderForm.value.customerName || 'KHACH'}`
  });
});

const customAlert = ref({ show: false, message: '', title: 'Thông Báo' });
const showAlert = (message, title = 'Thông Báo') => {
  customAlert.value = { show: true, message, title };
};

// ĐẶT HÀNG TOÀN BỘ GIỎ HÀNG (MULTI-ITEM POS CHECKOUT)
const handlePlaceOrder = async () => {
  if (cart.value.length === 0) {
    showAlert("Giỏ hàng đang trống! Vui lòng chọn ít nhất 1 con heo để xuất đơn.", "Giỏ Hàng Trống");
    return;
  }
  if (!orderForm.value.customerName || !orderForm.value.customerName.trim()) {
    showAlert("Vui lòng nhập họ và tên người nhận hàng!", "Thiếu Thông Tin");
    return;
  }
  const cleanPhone = (orderForm.value.customerPhone || '').trim().replace(/[\s.-]/g, '');
  if (!cleanPhone) {
    showAlert("Vui lòng nhập số điện thoại người nhận!", "Thiếu Thông Tin");
    return;
  }
  if (!/^0\d{9}$/.test(cleanPhone)) {
    showAlert("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số và bắt đầu bằng số 0 (Ví dụ: 0332182667 hoặc 0988123456).", "Lỗi Số Điện Thoại");
    return;
  }
  if (!orderForm.value.customerAddress || !orderForm.value.customerAddress.trim()) {
    showAlert("Vui lòng nhập địa chỉ giao hàng chi tiết!", "Thiếu Thông Tin");
    return;
  }

  isSubmittingOrder.value = true;

  const payload = {
    customerName: orderForm.value.customerName.trim(),
    tenKhachHang: orderForm.value.customerName.trim(),
    customerPhone: orderForm.value.customerPhone.trim(),
    soDienThoai: orderForm.value.customerPhone.trim(),
    customerAddress: orderForm.value.customerAddress.trim(),
    diaChiGiaoHang: orderForm.value.customerAddress.trim(),
    items: cart.value.map(c => ({
      productId: c.productId,
      sanPhamId: c.productId,
      soLuong: c.quantity,
      quantity: c.quantity,
      customPrice: c.customPrice || c.sellingPrice,
      giaBanTuyChinh: c.customPrice || c.sellingPrice
    })),
    danhSachMon: cart.value.map(c => ({
      productId: c.productId,
      sanPhamId: c.productId,
      soLuong: c.quantity,
      quantity: c.quantity,
      customPrice: c.customPrice || c.sellingPrice,
      giaBanTuyChinh: c.customPrice || c.sellingPrice
    })),
    shippingFee: Number(orderForm.value.shippingFee) || 0,
    chiPhiTienXe: Number(orderForm.value.shippingFee) || 0,
    shippingPayer: orderForm.value.shippingPayer || 'buyer',
    nguoiChiuTienXe: orderForm.value.shippingPayer || 'buyer',
    paymentMethod: orderForm.value.paymentMethod,
    phuongThucThanhToan: orderForm.value.paymentMethod,
    bankAccountId: orderForm.value.paymentMethod === 'Bank' ? Number(orderForm.value.bankAccountId) : null,
    taiKhoanNganHangId: orderForm.value.paymentMethod === 'Bank' ? Number(orderForm.value.bankAccountId) : null,
    paidAmount: cartTotalPayment.value,
    soTienThanhToan: cartTotalPayment.value,
    notes: orderForm.value.notes || ""
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const orderData = await res.json();
      orderSuccess.value = orderData?.data || orderData;
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      fetchData();
    } else {
      const err = await res.json().catch(() => ({}));
      showAlert(err.message || 'Không thể xuất đơn hàng vào hệ thống', 'Lỗi Tạo Đơn');
    }
  } catch (e) {
    showAlert("Lỗi kết nối máy chủ: " + e.message, "Lỗi Kết Nối");
  } finally {
    isSubmittingOrder.value = false;
  }
};
</script>
