<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

    <!-- ========================================== -->
    <!-- HEADER BAR (ĐỒNG BỘ 100% VỚI CỬA HÀNG) -->
    <!-- ========================================== -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/80 border border-slate-800/80 p-5 sm:p-6 rounded-3xl shadow-xl backdrop-blur-md">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/20 border border-white/10 shrink-0">
          <Tag class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Quản Lý Sản Phẩm & Bảng Giá
            </h1>
            <span class="text-[11px] font-bold uppercase px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {{ products.length }} Sản Phẩm
            </span>
          </div>
          <p class="text-slate-400 text-xs sm:text-sm mt-1">
            Khai báo danh mục sản phẩm, phân loại Hàng Nóng / Lạnh, Size heo, tải ảnh & bảng giá chuẩn VNĐ
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- NÚT MỞ BẢNG BÁO GIÁ GỬI KHÁCH -->
        <button
          @click="showQuoteModal = true"
          class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-teal-900/30 transition transform active:scale-95 border border-emerald-400/30 cursor-pointer"
          title="Xem và chụp bảng báo giá các loại heo còn hàng gửi khách"
        >
          <Camera class="w-4 h-4" />
          <span>Báo Giá Gửi Khách</span>
        </button>

        <button
          @click="fetchData"
          class="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 shadow-sm transition active:scale-95 cursor-pointer"
          title="Làm mới dữ liệu"
        >
          <RefreshCw :class="['w-4 h-4', loading ? 'animate-spin' : '']" />
        </button>

        <button
          @click="handleOpenAdd"
          class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-rose-600/20 transition transform active:scale-95 border border-white/10 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Thêm Sản Phẩm</span>
        </button>
      </div>
    </div>

    <!-- FILTER & SEARCH TOOLBAR (ĐỒNG BỘ 100% VỚI CỬA HÀNG) -->
    <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
      <div class="relative flex-1 min-w-[240px]">
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

      <!-- Size Filter -->
      <select
        v-if="allSizes.length > 0"
        v-model="filterSize"
        class="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-amber-500 cursor-pointer"
      >
        <option value="ALL">Mọi Size Heo</option>
        <option v-for="s in allSizes" :key="s" :value="s">{{ s }}</option>
      </select>

      <!-- Supplier Filter -->
      <select
        v-if="suppliers.length > 0"
        v-model="filterSupplier"
        class="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-amber-500 cursor-pointer"
      >
        <option value="ALL">Mọi Nhà Cung Cấp</option>
        <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
          {{ sup.tenNhaCungCap || sup.name }}
        </option>
      </select>
    </div>

    <!-- HƯỚNG DẪN KÉO THẢ GỘP HÀNG & TÁCH LÔ TRỰC QUAN -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 p-3.5 sm:p-4 rounded-2xl border border-amber-500/30 shadow-lg">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg shrink-0 border border-amber-500/30">
          💡
        </div>
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-white">
            Gộp Hàng Linh Hoạt: Kéo Đè Ô Này Vào Ô Kia Hoặc Bấm Tách Lô Riêng Biệt
          </h4>
          <p class="text-[11px] text-slate-400 mt-0.5">
            Mỗi NCC có thể bán giá riêng. Muốn gộp chung giá chỉ cần <strong>Kéo đè ô heo thả vào ô kia</strong> (cùng Size & Giống). Muốn bán riêng chỉ cần bấm <strong>✂️ Tách Lô</strong>.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0 text-xs text-slate-400">
        <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-amber-300">
          Tổng: {{ displayCards.length }} ô trên kệ
        </span>
      </div>
    </div>

    <!-- PRODUCT GRID LIST -->
    <div v-if="loading" class="py-20 flex flex-col items-center justify-center space-y-3">
      <div class="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
      <p class="text-slate-400 text-sm font-medium">Đang tải danh mục sản phẩm...</p>
    </div>

    <div v-else-if="displayCards.length === 0" class="py-16 text-center bg-slate-950/60 border border-slate-800 rounded-3xl p-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl">
        📦
      </div>
      <h3 class="text-lg font-bold text-white mb-1">Chưa có sản phẩm nào phù hợp</h3>
      <p class="text-slate-400 text-xs max-w-md mx-auto mb-4">
        Hãy bấm nút Thêm Sản Phẩm để tạo sản phẩm mới hoặc điều chỉnh bộ lọc.
      </p>
      <button
        @click="handleOpenAdd"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
      >
        <Plus class="w-4 h-4" />
        Thêm Sản Phẩm Ngay
      </button>
    </div>

    <!-- GIAO DIỆN CÁC Ô SẢN PHẨM (HỖ TRỢ DRAG & DROP KÉO THẢ GỘP Ô & NÚT TÁCH LÔ TRỰC TIẾP) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="card in displayCards"
        :key="card.groupId ? card.groupId : ('single_' + card.id)"
        draggable="true"
        @dragstart="onDragStart(card, $event)"
        @dragend="onDragEnd"
        @dragover="onDragOver(card, $event)"
        @dragleave="onDragLeave(card, $event)"
        @drop="onDrop(card, $event)"
        :class="[
          'group relative bg-slate-950/90 border rounded-3xl overflow-hidden shadow-xl transition-all duration-200 flex flex-col justify-between select-none cursor-grab active:cursor-grabbing',
          dragOverCardId === card.id
            ? 'ring-4 ring-amber-400 border-amber-400 scale-[1.02] shadow-2xl shadow-amber-500/40 bg-amber-500/10 z-20'
            : (card.isMerged ? 'border-cyan-500/60 shadow-cyan-950/20' : 'border-slate-800/90 hover:border-amber-500/70'),
          draggedCard && draggedCard.id === card.id ? 'opacity-60 ring-2 ring-amber-400/50 scale-[0.98]' : ''
        ]"
      >
        <!-- Overlay khi đang kéo đè lên -->
        <div 
          v-if="dragOverCardId === card.id"
          class="absolute inset-0 bg-amber-500/20 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-amber-400 rounded-3xl pointer-events-none animate-in fade-in duration-100"
        >
          <div class="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg mb-2">
            🔗
          </div>
          <span class="text-sm font-black text-amber-300 uppercase tracking-wider drop-shadow-md">
            Thả Vào Đây Để Gộp Ô!
          </span>
          <span class="text-[11px] text-white font-medium drop-shadow-sm mt-0.5">
            Gộp {{ draggedCard?.name }} vào {{ card.name }}
          </span>
        </div>

        <!-- Image & Carousel & Badges -->
        <div class="relative h-48 w-full bg-slate-900 overflow-hidden group/img">
          <img
            :src="getCardCurrentImage(card)"
            :alt="card.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            @error="handleImgError"
            @click.stop="openGallery(card)"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none"></div>

          <!-- NÚT LƯỚT ẢNH TRÁI / PHẢI KHI CÓ NHIỀU ẢNH BÁN HÀNG -->
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

          <!-- CHẤM CHỈ SỐ ẢNH (DOTS) & ĐẾM ẢNH -->
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
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span 
              :class="[
                'flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase shadow-lg tracking-wider whitespace-nowrap border',
                getPreserveBadge(card.porkType).cardClass
              ]"
            >
              <span>{{ getPreserveBadge(card.porkType).icon }}</span>
              <span>{{ getPreserveBadge(card.porkType).label }}</span>
            </span>

            <span 
              :class="[
                'flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase shadow-lg tracking-wider whitespace-nowrap border',
                getPigFeatureBadge(card.pigFeature).cardClass
              ]"
            >
              <span>{{ getPigFeatureBadge(card.pigFeature).icon }}</span>
              <span>{{ getPigFeatureBadge(card.pigFeature).label }}</span>
            </span>

            <span 
              v-if="card.isKg && card.weightKg > 0"
              class="px-2.5 py-1 rounded-md bg-emerald-950/95 text-emerald-300 text-[11px] font-black border border-emerald-500/50 whitespace-nowrap shadow-lg flex items-center gap-1"
            >
              ⚖️ {{ Number(card.weightKg).toLocaleString('vi-VN') }} kg
            </span>
            <span v-else class="px-2.5 py-1 rounded-md bg-slate-950/90 text-amber-400 text-[10px] font-bold border border-amber-400/30 whitespace-nowrap">
              {{ card.sizeType }}
            </span>
          </div>

          <!-- Actions: Sửa Giá -->
          <div class="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition z-10">
            <button
              type="button"
              @click.stop="handleOpenEditCard(card)"
              class="p-2 rounded-xl bg-slate-900/90 hover:bg-amber-600 text-slate-300 hover:text-white border border-slate-700/60 shadow-lg backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              :title="card.isMerged ? 'Kê giá bán đồng loạt cho nhóm gộp' : 'Chỉnh sửa giá bán lô này'"
            >
              <Edit2 class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Stock Count & Merged Status Badge -->
          <div class="absolute bottom-2.5 right-3 z-10 flex items-center gap-1.5">
            <span 
              v-if="card.isMerged" 
              class="px-2 py-0.5 rounded-md bg-cyan-500/90 text-slate-950 text-[10px] font-black uppercase shadow-md border border-cyan-300"
            >
              🔗 Gộp {{ card.suppliers.length }} lô
            </span>
            <span :class="[
              'px-2.5 py-1 rounded-lg text-xs font-black shadow-md border flex items-center gap-1',
              card.totalHeads > 0 
                ? 'bg-slate-950/95 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40' 
                : 'bg-slate-950/95 text-rose-400 border-rose-500/40'
            ]">
              <span>Còn: {{ card.totalHeads }} con</span>
              <span v-if="card.isKg && card.weightKg > 0" class="text-amber-300 font-black">({{ Number(card.weightKg).toLocaleString('vi-VN') }} kg)</span>
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-extrabold text-white text-base sm:text-lg leading-snug group-hover:text-amber-400 transition-colors">
                    {{ card.name }}
                  </h3>
                  <!-- Badge số Kg to nổi bật ngay cạnh tiêu đề -->
                  <span 
                    v-if="card.isKg && card.weightKg > 0"
                    class="px-2.5 py-0.5 rounded-xl bg-gradient-to-r from-emerald-500/25 to-teal-500/25 text-emerald-300 text-xs sm:text-sm font-black border border-emerald-500/40 inline-flex items-center gap-1 shadow-md shadow-emerald-950/40"
                  >
                    ⚖️ {{ Number(card.weightKg).toLocaleString('vi-VN') }} kg
                  </span>
                </div>
                <!-- Nhà Cung Cấp hiển thị rõ ràng -->
                <div v-if="!card.isMerged" class="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Building2 class="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span class="font-bold text-slate-200">NCC: {{ card.supplierName }}</span>
                </div>
              </div>
            </div>

            <!-- Nếu là nhóm gộp: Danh sách chi tiết nguồn hàng từng NCC -->
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

            <p v-if="card.importDetails" class="text-[11px] text-slate-400 italic line-clamp-1">
              "{{ card.importDetails }}"
            </p>
          </div>

          <!-- Price Box (Giá Bán Đồng Bộ & Giá Vốn Tham Chiếu) -->
          <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
            <div class="flex items-baseline justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Giá Bán:
              </span>
              <div class="text-right">
                <span v-if="card.sellingPrice > 0" class="text-xl sm:text-2xl font-extrabold text-amber-400 tracking-tight whitespace-nowrap">
                  {{ formatVND(card.sellingPrice) }}
                </span>
                <span v-else class="text-sm font-bold text-amber-500/80 italic">
                  Chưa kê giá
                </span>
                <span class="text-[10px] text-slate-500 block font-medium">/ {{ card.isKg ? '1 kg' : '1 con' }}</span>
              </div>
            </div>

            <div class="flex items-baseline justify-between pt-1.5 border-t border-slate-800/80 text-[11px]">
              <span class="text-[10px] font-medium text-slate-500">Giá vốn:</span>
              <span class="font-semibold text-slate-300 whitespace-nowrap text-right font-mono">
                <template v-if="card.minCost === card.maxCost">
                  {{ formatVND(card.minCost) }}<span v-if="card.isKg" class="text-[10px] text-emerald-400 font-bold">/kg</span>
                </template>
                <template v-else>
                  {{ formatVND(card.minCost) }} ~ {{ formatVND(card.maxCost) }}<span v-if="card.isKg" class="text-[10px] text-emerald-400 font-bold">/kg</span>
                </template>
              </span>
            </div>

            <div :class="['flex items-baseline justify-between text-[10px] font-bold pt-0.5', getGrossProfitInfo({ sellingPrice: card.sellingPrice, costPrice: card.avgCost }).colorClass]">
              <span>Lợi nhuận gộp/{{ card.isKg ? 'kg' : 'con' }}:</span>
              <span class="whitespace-nowrap font-mono">{{ getGrossProfitInfo({ sellingPrice: card.sellingPrice, costPrice: card.avgCost }).text }}</span>
            </div>
          </div>

          <!-- NÚT THAO TÁC GỘP / TÁCH TRỰC TIẾP -->
          <div class="pt-1 flex items-center gap-2">
            <!-- Nút Tách Lô (nếu ô đang gộp) -->
            <button
              v-if="card.isMerged"
              type="button"
              @click.stop="handleUnmerge(card)"
              class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600/90 to-amber-600/90 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md transition transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              title="Tách ô này thành từng ô riêng cho từng nhà cung cấp để bán giá khác nhau"
            >
              <Scissors class="w-3.5 h-3.5" />
              <span>✂️ Tách Lô (Hủy Gộp)</span>
            </button>

            <!-- Nút Gộp Với Lô Khác (nếu là ô đơn lẻ) -->
            <button
              v-else
              type="button"
              @click.stop="handleOpenMergePicker(card)"
              class="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 hover:text-amber-300 text-slate-300 text-xs font-bold border border-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
              title="Kéo đè ô này vào ô khác hoặc bấm để chọn lô gộp"
            >
              <Layers class="w-3.5 h-3.5 text-amber-400" />
              <span>🔗 Kéo / Chọn Gộp Ô</span>
            </button>
          </div>

        </div>
      </div>
    </div>


    <!-- ========================================================================= -->
    <!-- MODAL TẠO SẢN PHẨM MỚI (RỘNG RÃI THOÁNG ĐÃNG 760PX, 2 CỘT 7/5 CHUẨN ĐẸP) -->
    <!-- ========================================================================= -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center overscroll-contain animate-in fade-in duration-150"
    >
      <div 
        class="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl shadow-black p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto ring-1 ring-white/10"
        style="width: 100%; max-width: 760px; margin: auto;"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-slate-800/80 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {{ editingProduct ? 'Định Giá Lên Kệ' : 'Tạo Sản Phẩm Mới' }}
              </span>
              <h2 class="text-base sm:text-lg font-bold text-white tracking-tight">
                {{ editingProduct ? (form.name || 'Chỉnh Sửa Sản Phẩm Heo Sữa') : 'Tạo Sản Phẩm Mới' }}
              </h2>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              {{ editingProduct ? 'Thông tin size, giống heo và giá vốn được cố định từ Kho. Chỉ cần kê Giá Bán Ra, chi tiết đặc điểm và hình ảnh.' : 'Khai báo thông tin định danh, phân loại heo, size, giá bán và hình ảnh sản phẩm' }}
            </p>
          </div>

          <button
            type="button"
            @click="showModal = false"
            class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-xs border border-slate-800"
          >
            ✕
          </button>
        </div>

        <!-- THẺ THÔNG TIN CỐ ĐỊNH TỪ KHO (KHI ĐANG SỬA SẢN PHẨM HOẶC GỘP HÀNG) -->
        <div v-if="editingProduct || editingGroup" class="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-md">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Package class="w-3.5 h-3.5 text-amber-400" />
              <span>Thông Tin Cố Định Từ Kho (Khóa - Không được đổi)</span>
            </span>
            <span class="text-[10px] text-amber-400/90 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
              🔒 <span>{{ editingGroup ? `Đã gộp ${editingGroup.suppliers.length} nguồn NCC (${editingGroup.totalHeads} con)` : 'Đã liên kết kho' }}</span>
            </span>
          </div>

          <!-- DÒNG 1: PHÂN LOẠI & LOẠI SIZE -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <!-- 1. Bảo quản & Giống -->
            <div class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
              <span class="text-[10px] text-slate-500 block uppercase font-bold">Phân Loại Hàng & Giống Heo</span>
              <div class="flex flex-wrap gap-1.5 items-center">
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-900 text-slate-200 border border-slate-800">
                  {{ getPreserveBadge(form.porkType).icon }} {{ getPreserveBadge(form.porkType).label }}
                </span>
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-900 text-slate-200 border border-slate-800">
                  {{ getPigFeatureBadge(form.pigFeature).icon }} {{ getPigFeatureBadge(form.pigFeature).label }}
                </span>
              </div>
            </div>

            <!-- 2. Size Heo & Tổng Số Con -->
            <div class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
              <span class="text-[10px] text-slate-500 block uppercase font-bold">Loại Size & Tổng Tồn Kho</span>
              <div class="flex items-center justify-between">
                <span class="font-extrabold text-amber-300 text-xs truncate">
                  🐷 {{ form.sizeType || 'Heo sữa' }}
                </span>
                <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black">
                  Tổng: {{ editingGroup ? editingGroup.totalHeads : (editingProduct.headCount !== undefined ? editingProduct.headCount : (editingProduct.soLuongCon || 0)) }} con
                </span>
              </div>
            </div>
          </div>

          <!-- DÒNG 2: NGUỒN NHẬP TỪNG NCC VÀ GIÁ VỐN TRUNG BÌNH -->
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
            <!-- CHI TIẾT NGUỒN HÀNG TỪNG NHÀ CUNG CẤP (CHIẾM 8 PHẦN) -->
            <div class="sm:col-span-8 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-slate-500 block uppercase font-bold">
                  Nguồn Hàng & Giá Nhập Từng NCC:
                </span>
                <span v-if="editingGroup" class="text-[10px] text-slate-400 font-medium">
                  {{ editingGroup.suppliers.length }} nhà cung cấp
                </span>
              </div>

              <!-- Trường hợp Gộp hàng từ nhiều NCC -->
              <div v-if="editingGroup && editingGroup.suppliers && editingGroup.suppliers.length > 0" class="flex flex-wrap gap-2">
                <div 
                  v-for="(sup, sIdx) in editingGroup.suppliers" 
                  :key="sIdx"
                  class="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs"
                >
                  <span class="font-bold text-white flex items-center gap-1">
                    🏢 {{ sup.name }}:
                  </span>
                  <span class="font-black text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded text-[11px]">
                    {{ sup.count }} con
                  </span>
                  <span class="text-slate-600">•</span>
                  <span class="text-slate-400 text-[11px]">Giá nhập:</span>
                  <span class="font-black text-emerald-400 font-mono">
                    {{ formatVND(sup.cost) }}
                  </span>
                </div>
              </div>

              <!-- Trường hợp 1 NCC đơn lẻ -->
              <div v-else class="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                <span class="font-bold text-white flex items-center gap-1">
                  🏢 {{ (suppliers.find(s => String(s.id) === String(form.supplierId))?.tenNhaCungCap) || (suppliers.find(s => String(s.id) === String(form.supplierId))?.name) || 'NCC' }}:
                </span>
                <span class="font-black text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded text-[11px]">
                  {{ editingProduct?.headCount !== undefined ? editingProduct?.headCount : (editingProduct?.soLuongCon || 0) }} con
                </span>
                <span class="text-slate-600">•</span>
                <span class="text-slate-400 text-[11px]">Giá nhập:</span>
                <span class="font-black text-emerald-400 font-mono">
                  {{ formatVND(form.costPrice) }}
                </span>
              </div>
            </div>

            <!-- GIÁ VỐN TRUNG BÌNH KHO (CHIẾM 4 PHẦN) -->
            <div class="sm:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 p-2.5 rounded-xl border border-slate-800/80 space-y-1 flex flex-col justify-center">
              <span class="text-[10px] text-slate-500 block uppercase font-bold">
                {{ editingGroup && editingGroup.suppliers.length > 1 ? 'Giá Vốn Trung Bình' : 'Giá Vốn Nhập Kho' }}
              </span>
              <div class="font-black text-emerald-400 text-sm sm:text-base tracking-tight font-mono">
                {{ formatVND(editingGroup ? editingGroup.avgCost : form.costPrice) }}<span class="text-xs text-slate-400 font-normal">/con</span>
              </div>
              <span v-if="editingGroup && editingGroup.minCost !== editingGroup.maxCost" class="text-[10px] text-slate-400 block font-medium">
                (Từ {{ formatVND(editingGroup.minCost) }} ~ {{ formatVND(editingGroup.maxCost) }})
              </span>
            </div>
          </div>
        </div>

        <!-- Modal Form -->
        <form @submit.prevent="handleSaveProduct" class="grid grid-cols-12 gap-4">

          <!-- CỘT TRÁI (7 COLS): PHẦN ĐƯỢC PHÉP CHỈNH SỬA -->
          <div class="col-span-12 sm:col-span-7 space-y-3">

            <!-- 1. GIÁ BÁN RA (KÊ GIÁ) - NỔI BẬT NHẤT -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/60 p-4 rounded-2xl space-y-2 shadow-lg shadow-amber-950/20">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-black uppercase text-amber-400 tracking-wide">
                  💵 Giá Bán Ra / 1 Con (Kê Giá Bán) <span class="text-rose-500">*</span>
                </label>
                <span class="text-[10px] text-slate-400 font-medium">Giá hiển thị tại Cửa Hàng POS</span>
              </div>

              <div class="relative">
                <input
                  type="text"
                  required
                  :value="formatInputDisplay(form.sellingPrice)"
                  @input="handlePriceInput($event, 'sellingPrice')"
                  placeholder="Nhập giá bán ra..."
                  class="w-full bg-slate-950 border border-amber-500/80 rounded-xl pl-4 pr-14 py-3 text-lg font-black text-amber-300 outline-none focus:ring-2 focus:ring-amber-500/40 shadow-inner"
                />
                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-amber-400/80 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  VNĐ
                </span>
              </div>

              <!-- Lợi nhuận gộp ước tính tức thì -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span class="text-slate-400 text-[11px] font-medium">Lợi nhuận gộp ước tính (Giá bán - Vốn kho):</span>
                <span :class="['font-black text-sm', formProfitInfo.colorClass]">
                  {{ formProfitInfo.text }}/con
                </span>
              </div>
            </div>

            <!-- 2. CHI TIẾT / ĐẶC ĐIỂM LÔ HÀNG LÊN KỆ -->
            <div>
              <label class="block text-[11px] font-bold text-slate-300 mb-1">
                Chi Tiết / Đặc Điểm Lô Hàng Lên Kệ
              </label>
              <textarea
                rows="3"
                v-model="form.importDetails"
                placeholder="Nhập các đặc điểm nhận biết (da giòn, bao mỡ, đóng bao bì...), lưu ý cho nhân viên bán hàng..."
                class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition resize-none leading-relaxed"
              ></textarea>
            </div>

            <!-- Trường tạo mới thủ công nếu không phải sửa từ kho -->
            <div v-if="!editingProduct" class="space-y-3 pt-1">
              <div>
                <label class="block text-[11px] font-bold text-slate-300 mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  v-model="form.name"
                  placeholder="Nhập tên sản phẩm heo sữa..."
                  class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 mb-1">Bảo quản</label>
                  <select v-model="form.porkType" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white outline-none">
                    <option value="hot">🔥 Nóng</option>
                    <option value="cold">❄️ Lạnh</option>
                    <option value="wrapped">📦 Cuộn Bọc</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 mb-1">Đặc điểm</label>
                  <select v-model="form.pigFeature" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white outline-none">
                    <option value="duoi_cut">🐷 Đuôi Cụt</option>
                    <option value="duoi_dai">🐖 Đuôi Dài</option>
                    <option value="rung_lai">🐗 Rừng Lai</option>
                    <option value="mong_cai">🐽 Móng Cái</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 mb-1">Size</label>
                  <select v-model="form.sizeType" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white outline-none">
                    <option v-for="s in (flattenedSizes.length > 0 ? flattenedSizes : defaultSizes)" :key="s.id" :value="s.name">
                      {{ s.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          <!-- CỘT PHẢI (5 COLS): THƯ VIỆN ẢNH ĐẸP BÁN HÀNG -->
          <div class="col-span-12 sm:col-span-5 space-y-3">
            
            <div class="flex items-center justify-between">
              <label class="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <Camera class="w-4 h-4 text-rose-400" />
                <span>Thư Viện Ảnh Bán Hàng Đẹp</span>
              </label>
              <span class="text-[10px] text-slate-400 font-bold">
                {{ form.imageList?.length || (form.image ? 1 : 0) }} ảnh
              </span>
            </div>

            <!-- Upload Box & Gallery Manager -->
            <div class="border border-slate-700 hover:border-amber-500 bg-slate-950 rounded-2xl p-3.5 space-y-3 transition">
              
              <!-- Nút chọn thêm nhiều ảnh -->
              <div class="flex flex-col gap-2">
                <label class="flex items-center justify-center gap-2.5 w-full p-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700 hover:border-amber-500 text-center cursor-pointer transition shadow-md">
                  <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Upload class="w-3.5 h-3.5" />
                  </div>
                  <div class="text-left min-w-0">
                    <span class="text-xs font-bold text-white block truncate">+ Tải Thêm Nhiều Ảnh Đẹp</span>
                    <span class="text-[9px] text-slate-400 block truncate">Chọn 1 hoặc nhiều ảnh cùng lúc</span>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    class="hidden" 
                    @change="handleMultipleBeautyUpload" 
                  />
                </label>
              </div>

              <!-- Lưới danh sách ảnh đẹp bán hàng -->
              <div v-if="form.imageList && form.imageList.length > 0" class="space-y-2">
                <div class="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                  <span>Ảnh Đã Chọn (Bấm ⭐ để làm ảnh chính):</span>
                  <span class="text-amber-400">{{ form.imageList.length }} ảnh</span>
                </div>
                
                <div class="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div 
                    v-for="(imgUrl, imgIdx) in form.imageList" 
                    :key="imgIdx"
                    :class="[
                      'relative group rounded-xl overflow-hidden aspect-square border transition cursor-pointer',
                      form.image === imgUrl ? 'ring-2 ring-amber-400 border-amber-400' : 'border-slate-800 hover:border-slate-600'
                    ]"
                    @click="form.image = imgUrl"
                  >
                    <img :src="imgUrl" class="w-full h-full object-cover" />
                    
                    <!-- Badge ảnh đại diện chính -->
                    <span 
                      v-if="form.image === imgUrl"
                      class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[8px] font-black shadow-md flex items-center gap-0.5"
                    >
                      ⭐ Chính
                    </span>

                    <!-- Nút xóa ảnh -->
                    <button
                      type="button"
                      @click.stop="removeBeautyImage(imgIdx)"
                      class="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600/90 text-white flex items-center justify-center text-[10px] hover:bg-rose-500 shadow-md transition cursor-pointer"
                      title="Xóa ảnh này"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-4 text-slate-500 text-xs italic">
                Chưa có ảnh bán hàng nào. Bấm nút phía trên để thêm ảnh.
              </div>

            </div>

            <!-- Chú thích độc lập ảnh -->
            <div class="bg-gradient-to-br from-amber-500/10 to-slate-900/90 border border-amber-500/30 p-3 rounded-2xl space-y-1">
              <div class="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                <span>💡 Lưu Ý Về Ảnh Bán Hàng:</span>
              </div>
              <p class="text-[10px] text-slate-300 leading-relaxed">
                Ảnh tại đây là <strong>Ảnh Đẹp Bán Hàng độc lập</strong> dùng để chào khách và xuất hiện tại quầy POS. Ảnh này hoàn toàn không trùng với ảnh chụp chứng cứ heo thực tế/heo xấu lúc lập phiếu nhập.
              </p>
            </div>

          </div>

        </form>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            @click="showModal = false"
            class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            @click="handleSaveProduct"
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition transform active:scale-95 cursor-pointer"
          >
            {{ editingProduct || editingGroup ? '💾 Lưu & Đưa Lên Kệ Bán' : 'Lưu Sản Phẩm Mới' }}
          </button>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL BÁO GIÁ GỬI KHÁCH HÀNG (MENU SẠCH ĐẸP, CHUYÊN NGHIỆP ĐỂ CHỤP ẢNH / COPY) -->
    <!-- ========================================================================= -->
    <div 
      v-if="showQuoteModal" 
      class="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center overscroll-contain animate-in fade-in duration-150"
    >
      <div 
        class="bg-slate-950 border-2 border-emerald-500/50 rounded-3xl shadow-2xl shadow-emerald-950/40 p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto ring-1 ring-white/10"
        style="width: 100%; max-width: 680px; margin: auto;"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-900/40">
              📸
            </div>
            <div>
              <h2 class="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Bảng Báo Giá Heo Sữa Đang Còn Hàng</span>
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Bảng giá sạch đẹp, sẵn sàng chụp ảnh màn hình hoặc sao chép văn bản gửi khách
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="showQuoteModal = false"
            class="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-xs border border-slate-800"
          >
            ✕
          </button>
        </div>

        <!-- KHUNG BẢNG BÁO GIÁ ĐỂ CHỤP ẢNH MÀN HÌNH (GIAO DIỆN KHÁCH HÀNG) -->
        <div id="customer-quote-card" class="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/30 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">🥩</span>
              <div>
                <h3 class="font-black text-white text-sm sm:text-base uppercase tracking-wider">
                  DANH MỤC HEO SỮA & BẢNG BÁO GIÁ
                </h3>
                <span class="text-[11px] font-semibold text-emerald-400">● Đang sẵn hàng tại cửa hàng</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[11px] font-mono text-slate-400 font-bold block">
                {{ new Date().toLocaleDateString('vi-VN') }}
              </span>
              <span class="text-[9px] text-slate-500 uppercase font-black tracking-widest">Hôm nay</span>
            </div>
          </div>

          <!-- Danh sách heo đang còn hàng -->
          <div v-if="availableQuotes.length === 0" class="py-8 text-center text-slate-500 italic text-xs">
            Hiện tại chưa có loại heo nào còn tồn kho hoặc đã kê giá bán.
          </div>

          <div v-else class="divide-y divide-slate-800/60 space-y-2">
            <div 
              v-for="(q, qIdx) in availableQuotes" 
              :key="q.key || qIdx"
              class="pt-2 flex items-center justify-between gap-3"
            >
              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-black text-white text-sm sm:text-base">{{ q.name || ('Heo sữa ' + q.sizeType) }}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {{ getPreserveBadge(q.porkType).label }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {{ getPigFeatureBadge(q.pigFeature).label }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs text-slate-400">
                  <span class="text-emerald-400 font-bold">🟢 Còn: {{ q.totalHeads }} con</span>
                  <span v-if="q.importDetails" class="text-slate-400 truncate italic">"{{ q.importDetails }}"</span>
                </div>
              </div>

              <div class="text-right shrink-0">
                <div class="text-base sm:text-lg font-black text-amber-400 tracking-tight">
                  {{ q.sellingPrice > 0 ? formatVND(q.sellingPrice) : 'Liên hệ' }}
                </div>
                <span class="text-[10px] text-slate-500 font-medium">/ 1 con</span>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>✨ Heo tươi ngon tuyển chọn, bao chuẩn chất lượng</span>
            <span class="text-emerald-400 font-bold">Giao hàng tận nơi</span>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            @click="handleCopyQuoteText"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/30 transition cursor-pointer"
          >
            <Copy class="w-4 h-4" />
            <span>Sao Chép Báo Giá (Gửi Zalo/SMS)</span>
          </button>

          <button
            type="button"
            @click="showQuoteModal = false"
            class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODAL CHỌN LÔ ĐỂ GỘP (KHI BẤM NÚT "GỘP Ô") -->
    <!-- ========================================================================= -->
    <div 
      v-if="showMergePickerModal && mergingSourceCard" 
      class="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center overscroll-contain animate-in fade-in duration-150"
    >
      <div 
        class="bg-slate-950 border border-amber-500/50 rounded-3xl shadow-2xl shadow-amber-950/40 p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto ring-1 ring-white/10"
        style="width: 100%; max-width: 580px; margin: auto;"
        @click.stop
      >
        <div class="flex items-start justify-between border-b border-slate-800/80 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0 border border-amber-500/30">
              🔗
            </div>
            <div>
              <h3 class="text-base font-bold text-white">
                Gộp Ô Cho: {{ mergingSourceCard.name }}
              </h3>
              <p class="text-xs text-slate-400">
                Size: <span class="text-amber-300 font-bold">{{ mergingSourceCard.sizeType }}</span> • NCC: <span class="text-white font-bold">{{ mergingSourceCard.supplierName || 'NCC' }}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="showMergePickerModal = false"
            class="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer text-xs border border-slate-800"
          >
            ✕
          </button>
        </div>

        <div class="space-y-3">
          <label class="block text-xs font-bold text-slate-300">
            Chọn một lô có cùng Size heo & Đặc điểm để gộp chung vào 1 ô bán:
          </label>

          <div v-if="compatibleMergeCandidates.length === 0" class="py-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 p-4 space-y-1.5">
            <span class="text-2xl block">🔍</span>
            <p class="text-xs text-slate-300 font-bold">Không tìm thấy lô nào khác cùng loại!</p>
            <p class="text-[11px] text-slate-500 max-w-sm mx-auto">
              Chỉ có thể gộp các lô có cùng cách bảo quản ({{ getPreserveBadge(mergingSourceCard.porkType).label }}), đặc điểm ({{ getPigFeatureBadge(mergingSourceCard.pigFeature).label }}) và cùng Size ({{ mergingSourceCard.sizeType }}).
            </p>
          </div>

          <div v-else class="space-y-2 max-h-72 overflow-y-auto pr-1">
            <div
              v-for="target in compatibleMergeCandidates"
              :key="target.id"
              class="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 transition group cursor-pointer"
              @click="handleSelectMergeTarget(target)"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white text-xs sm:text-sm">{{ target.name }}</span>
                  <span v-if="target.isMerged" class="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold border border-cyan-500/30">
                    Đã có {{ target.suppliers.length }} lô
                  </span>
                  <span v-else class="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                    NCC: {{ target.supplierName }}
                  </span>
                </div>
                <div class="text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Còn: <strong class="text-emerald-400">{{ target.totalHeads }} con</strong></span>
                  <span>•</span>
                  <span>Giá bán: <strong class="text-amber-300">{{ formatVND(target.sellingPrice) }}</strong></span>
                </div>
              </div>

              <button
                type="button"
                class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition shrink-0 cursor-pointer"
              >
                Gộp Với Ô Này
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>💡 Bạn cũng có thể kéo đè trực tiếp các ô vào nhau trên màn hình.</span>
          <button
            type="button"
            @click="showMergePickerModal = false"
            class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer border border-slate-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
    <!-- ========================================== -->
    <!-- MODAL LIGHTBOX XEM THƯ VIỆN ẢNH FULLSCREEN -->
    <!-- ========================================== -->
    <div 
      v-if="showGalleryModal" 
      class="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
      @click.self="closeGallery"
    >
      <!-- Top bar -->
      <div class="w-full max-w-4xl flex items-center justify-between py-2 text-white border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg font-black text-amber-400">📸 {{ activeGalleryProduct?.name || 'Ảnh Bán Hàng Sản Phẩm' }}</span>
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

      <!-- Main image with prev/next buttons -->
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

      <!-- Thumbnails strip -->
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { 
  Plus, Edit2, Trash2, Search, RefreshCw, Flame, Snowflake, 
  Building2, Tag, Upload, Package, Info, Camera, Layers, Copy, Check, Scissors
} from 'lucide-vue-next';
import { formatVND, formatDate } from '../utils/formatters';
import { showConfirm, showAlert, showToast } from '../utils/dialog';

const defaultPigImage = 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&auto=format&fit=crop&q=80';

const products = ref([]);
const suppliers = ref([]);
const purchases = ref([]);
const sizes = ref([]);
const loading = ref(false);

const search = ref('');
const filterPreserve = ref('ALL');
const filterFeature = ref('ALL');
const filterSize = ref('ALL');
const filterSupplier = ref('ALL');

const showQuoteModal = ref(false);
const showModal = ref(false);
const editingProduct = ref(null);
const editingGroup = ref(null);

// DRAG & DROP & MERGE PICKER STATE
const draggedCard = ref(null);
const dragOverCardId = ref(null);
const showMergePickerModal = ref(false);
const mergingSourceCard = ref(null);

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

watch([showModal, showQuoteModal, showMergePickerModal, showGalleryModal], ([isOpenModal, isOpenQuote, isOpenMerge, isOpenGal]) => {
  if (isOpenModal || isOpenQuote || isOpenMerge || isOpenGal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

const form = ref({
  name: '',
  image: defaultPigImage,
  imageList: [],
  porkType: 'hot',
  pigFeature: 'duoi_cut',
  sizeType: 'Heo sữa (3 - 3.9kg)',
  unit: 'Con',
  costPrice: 200000,
  sellingPrice: 1200000,
  supplierId: '',
  importDate: new Date().toISOString().slice(0, 10),
  importDetails: '',
  notes: ''
});

const formatInputDisplay = (val) => {
  if (val === null || val === undefined || val === '') return '';
  const num = Number(val);
  if (isNaN(num)) return '';
  return num.toLocaleString('vi-VN');
};

const handlePriceInput = (event, field) => {
  const raw = event.target.value.replace(/\D/g, '');
  form.value[field] = raw ? Number(raw) : 0;
};

const handleMultipleBeautyUpload = (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  files.forEach(file => {
    if (file.size > 8 * 1024 * 1024) {
      showToast(`Ảnh ${file.name} vượt quá 8MB!`, "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!form.value.imageList) form.value.imageList = [];
      form.value.imageList.push(e.target.result);
      if (!form.value.image) {
        form.value.image = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  });
};

const removeBeautyImage = (idx) => {
  if (!form.value.imageList) return;
  const removed = form.value.imageList.splice(idx, 1)[0];
  if (form.value.image === removed) {
    form.value.image = form.value.imageList[0] || defaultPigImage;
  }
};

const defaultSizes = ref([
  { id: '1', name: 'Heo sữa (3 - 3.9kg)' },
  { id: '2', name: 'Heo sữa (4 - 4.9kg)' },
  { id: '3', name: 'Heo sữa (5 - 5.9kg)' },
  { id: '4', name: 'Heo sữa (6 - 6.9kg)' }
]);

const flattenedSizes = computed(() => {
  const result = [];
  sizes.value.forEach(s => {
    if (s.saleType === 'per_range' && Array.isArray(s.rangeTiers) && s.rangeTiers.length > 0) {
      s.rangeTiers.forEach((tier, index) => {
        result.push({
          id: `${s.id}_tier_${index}`,
          originalId: s.id,
          name: `${s.name} (${tier.minKg} - ${tier.maxKg}kg)`,
          rangeName: `${tier.minKg} - ${tier.maxKg}kg`,
          saleType: s.saleType
        });
      });
    } else {
      result.push(s);
    }
  });
  return result;
});

const getPreserveBadge = (pType) => {
  const t = (pType || '').toLowerCase();
  if (t === 'cold') {
    return {
      label: 'Hàng Lạnh',
      icon: '❄️',
      cardClass: 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold',
      pillClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    };
  } else if (t === 'wrapped' || t === 'hot_wrapped') {
    return {
      label: 'Cuộn Bọc',
      icon: '📦',
      cardClass: 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold',
      pillClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    };
  }
  return {
    label: 'Hàng Nóng',
    icon: '🔥',
    cardClass: 'bg-rose-500 text-white border-rose-400',
    pillClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  };
};

const getPigFeatureBadge = (feature) => {
  const f = (feature || '').toLowerCase();
  if (f === 'duoi_dai') {
    return {
      label: 'Đuôi Dài',
      icon: '🐖',
      cardClass: 'bg-indigo-600 text-white border-indigo-400 font-extrabold',
      pillClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
    };
  } else if (f === 'rung_lai') {
    return {
      label: 'Rừng Lai',
      icon: '🐗',
      cardClass: 'bg-amber-700 text-amber-100 border-amber-500 font-extrabold',
      pillClass: 'bg-amber-600/20 text-amber-300 border-amber-500/40'
    };
  } else if (f === 'mong_cai') {
    return {
      label: 'Móng Cái',
      icon: '🐽',
      cardClass: 'bg-pink-600 text-white border-pink-400 font-extrabold',
      pillClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
    };
  }
  return {
    label: 'Đuôi Cụt',
    icon: '🐷',
    cardClass: 'bg-emerald-600 text-white border-emerald-400 font-extrabold',
    pillClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  };
};

const getGrossProfitInfo = (product) => {
  const sell = Number(product.sellingPrice || product.giaBanRa) || 0;
  const cost = Number(product.costPrice || product.giaNhapVon) || 0;
  
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

const formProfitInfo = computed(() => {
  const sell = Number(form.value.sellingPrice) || 0;
  const cost = Number(form.value.costPrice) || 0;
  if (sell <= 0) {
    return { text: '0 đ', colorClass: 'text-slate-400' };
  }
  const diff = sell - cost;
  if (diff > 0) {
    return { text: `+${formatVND(diff)}`, colorClass: 'text-emerald-400' };
  } else if (diff === 0) {
    return { text: '0 đ', colorClass: 'text-slate-300' };
  } else {
    return { text: `-${formatVND(Math.abs(diff))}`, colorClass: 'text-rose-400' };
  }
});

const handleImgError = (e) => {
  e.target.src = defaultPigImage;
};

const allSizes = computed(() => {
  return Array.from(new Set(products.value.map(p => p.sizeType || p.loaiSize).filter(Boolean)));
});

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const name = (p.name || p.tenSanPham || '').toLowerCase();
    const size = (p.sizeType || p.loaiSize || '').toLowerCase();
    const supName = (p.supplier?.tenNhaCungCap || p.nhaCungCap?.tenNhaCungCap || '').toLowerCase();
    const preserveType = p.porkType || p.loaiHeo || 'hot';
    const featureType = p.pigFeature || p.dacDiemHeo || 'duoi_cut';

    const matchesSearch = name.includes(search.value.toLowerCase()) || size.includes(search.value.toLowerCase()) || supName.includes(search.value.toLowerCase());
    const matchesPreserve = filterPreserve.value === 'ALL' || preserveType === filterPreserve.value || (filterPreserve.value === 'wrapped' && (preserveType === 'wrapped' || preserveType === 'hot_wrapped'));
    const matchesFeature = filterFeature.value === 'ALL' || featureType === filterFeature.value;
    const matchesSize = filterSize.value === 'ALL' || (p.sizeType || p.loaiSize) === filterSize.value;
    const matchesSup = filterSupplier.value === 'ALL' || String(p.supplier?.id || p.nhaCungCap?.id) === String(filterSupplier.value);

    return matchesSearch && matchesPreserve && matchesFeature && matchesSize && matchesSup;
  });
});

// LOGIC HIỂN THỊ CÁC THẺ THEO NHÓM GỘP THỰC TẾ (NẾU NHÓM ĐÃ GỘP THÌ GỘP, CÒN LẠI TÁCH RIÊNG)
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
        let totalKg = 0;
        const suppliers = [];

        const isKg = first.donViTinh === 'Kg' || first.unit === 'Kg' || (first.name && first.name.toLowerCase().includes('theo kg')) || (first.sizeType && first.sizeType.toLowerCase().includes('theo kg'));

        groupItems.forEach(item => {
          const heads = Number(item.headCount !== undefined ? item.headCount : (item.soLuongCon || 0)) || 0;
          const cost = Number(item.costPrice || item.giaNhapVon || 0) || 0;
          const supName = item.supplier?.tenNhaCungCap || item.nhaCungCap?.tenNhaCungCap || 'NCC';
          const kg = Number(item.soKgTonKho || item.weightKg || item.trongLuongMoiCon || 0);
          
          totalHeads += heads;
          totalCostSum += (cost * heads);
          totalKg += kg;
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
          isKg,
          weightKg: totalKg,
          donViTinh: first.donViTinh,
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
    const isKg = p.donViTinh === 'Kg' || p.unit === 'Kg' || (p.name && p.name.toLowerCase().includes('theo kg')) || (p.sizeType && p.sizeType.toLowerCase().includes('theo kg'));
    const weightKg = Number(p.soKgTonKho || p.weightKg || p.trongLuongMoiCon || 0);

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
      isKg,
      weightKg,
      donViTinh: p.donViTinh,
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

// Danh sách các lô có thể gộp với lô đang chọn
const compatibleMergeCandidates = computed(() => {
  if (!mergingSourceCard.value) return [];
  const src = mergingSourceCard.value;
  return displayCards.value.filter(c => {
    if (c.id === src.id || (c.groupId && c.groupId === src.groupId)) return false;
    return c.porkType === src.porkType && c.pigFeature === src.pigFeature && c.sizeType === src.sizeType;
  });
});

// DRAG & DROP XỬ LÝ KÉO THẢ GỘP Ô
const onDragStart = (card, event) => {
  draggedCard.value = card;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(card.id));
  }
};

const onDragEnd = () => {
  draggedCard.value = null;
  dragOverCardId.value = null;
};

const onDragOver = (card, event) => {
  if (!draggedCard.value || draggedCard.value.id === card.id || (draggedCard.value.groupId && card.groupId && draggedCard.value.groupId === card.groupId)) {
    return;
  }
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  dragOverCardId.value = card.id;
};

const onDragLeave = (card, event) => {
  if (event?.currentTarget && event?.relatedTarget && event.currentTarget.contains(event.relatedTarget)) {
    return;
  }
  if (dragOverCardId.value === card.id) {
    dragOverCardId.value = null;
  }
};

const onDrop = async (targetCard, event) => {
  event.preventDefault();
  const source = draggedCard.value;
  draggedCard.value = null;
  dragOverCardId.value = null;

  if (!source || source.id === targetCard.id || (source.groupId && source.groupId === targetCard.groupId)) return;

  // Kiểm tra tương thích
  const isSameType = (source.porkType === targetCard.porkType) && 
                     (source.pigFeature === targetCard.pigFeature) && 
                     (source.sizeType === targetCard.sizeType);

  if (!isSameType) {
    showToast("Không thể gộp: Hai lô phải có cùng cách bảo quản, đặc điểm và quy cách size heo!", "warning");
    return;
  }

  const sourceIds = source.items.map(it => it.id);
  const targetIds = targetCard.items.map(it => it.id);
  const allIds = Array.from(new Set([...sourceIds, ...targetIds]));

  try {
    const targetPrice = targetCard.sellingPrice > 0 ? targetCard.sellingPrice : (source.sellingPrice > 0 ? source.sellingPrice : null);
    const targetGroupId = targetCard.groupId || source.groupId || `GROUP_${Date.now()}`;

    const res = await fetch('/api/products/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productIds: allIds,
        sellingPrice: targetPrice,
        targetGroupId: targetGroupId
      })
    });

    if (res.ok) {
      showToast(`Đã gộp thành công ${allIds.length} lô heo thành 1 ô bán!`, "success");
      fetchData();
    } else {
      showToast("Lỗi khi gộp các lô sản phẩm, vui lòng thử lại!", "error");
    }
  } catch (e) {
    showToast("Lỗi kết nối máy chủ: " + e.message, "error");
  }
};

// THAO TÁC GỘP BẰNG POPUP CHỌN
const handleOpenMergePicker = (card) => {
  mergingSourceCard.value = card;
  showMergePickerModal.value = true;
};

const handleSelectMergeTarget = async (targetCard) => {
  if (!mergingSourceCard.value || !targetCard) return;
  const source = mergingSourceCard.value;
  showMergePickerModal.value = false;

  const sourceIds = source.items.map(it => it.id);
  const targetIds = targetCard.items.map(it => it.id);
  const allIds = Array.from(new Set([...sourceIds, ...targetIds]));

  try {
    const targetPrice = targetCard.sellingPrice > 0 ? targetCard.sellingPrice : (source.sellingPrice > 0 ? source.sellingPrice : null);
    const targetGroupId = targetCard.groupId || source.groupId || `GROUP_${Date.now()}`;

    const res = await fetch('/api/products/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productIds: allIds,
        sellingPrice: targetPrice,
        targetGroupId: targetGroupId
      })
    });

    if (res.ok) {
      showToast(`🎉 Đã gộp thành công các lô vào chung 1 ô!`, "success");
      fetchData();
    } else {
      showToast("Lỗi khi gộp sản phẩm", "error");
    }
  } catch (e) {
    showToast("Lỗi kết nối: " + e.message, "error");
  }
};

// THAO TÁC TÁCH LÔ (HỦY GỘP)
const handleUnmerge = async (card) => {
  const confirmed = await showConfirm({
    title: 'Tách Riêng Từng Lô NCC',
    message: `Bạn có chắc chắn muốn tách ô gộp "${card.name}" thành các ô riêng biệt cho từng Nhà Cung Cấp không? Mỗi lô sẽ có giá bán và quản lý độc lập.`,
    confirmText: 'Tách Lô Ngay',
    cancelText: 'Giữ Lại'
  });

  if (!confirmed) return;

  try {
    const res = await fetch('/api/products/unmerge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupId: card.groupId,
        productId: card.items.length === 1 ? card.items[0].id : null
      })
    });

    if (res.ok) {
      showToast("Đã tách lô thành công! Mỗi nhà cung cấp hiện có ô quản lý riêng biệt.", "success");
      fetchData();
    } else {
      showToast("Lỗi khi tách lô sản phẩm, vui lòng thử lại!", "error");
    }
  } catch (e) {
    showToast("Lỗi kết nối máy chủ: " + e.message, "error");
  }
};

// Mở modal sửa giá
const handleOpenEditCard = (card) => {
  const images = getCardImages(card);
  if (card.isMerged) {
    editingGroup.value = card;
    editingProduct.value = card.items[0];
    form.value = {
      name: card.name,
      image: card.image || images[0] || defaultPigImage,
      imageList: [...images],
      porkType: card.porkType,
      pigFeature: card.pigFeature,
      sizeType: card.sizeType,
      unit: 'Con',
      costPrice: card.avgCost,
      sellingPrice: card.sellingPrice || 0,
      supplierId: card.items[0]?.supplier?.id || (suppliers.value[0]?.id || ''),
      importDate: new Date().toISOString().slice(0, 10),
      importDetails: card.importDetails || '',
      notes: ''
    };
  } else {
    editingGroup.value = null;
    editingProduct.value = card.items[0];
    form.value = {
      name: card.name,
      image: card.image || images[0] || defaultPigImage,
      imageList: [...images],
      porkType: card.porkType,
      pigFeature: card.pigFeature,
      sizeType: card.sizeType,
      unit: 'Con',
      costPrice: card.minCost,
      sellingPrice: card.sellingPrice || 0,
      supplierId: card.supplierId || (suppliers.value[0]?.id || ''),
      importDate: card.items[0]?.importDate || card.items[0]?.ngayNhap || new Date().toISOString().slice(0, 10),
      importDetails: card.importDetails || '',
      notes: card.items[0]?.notes || card.items[0]?.ghiChu || ''
    };
  }
  showModal.value = true;
};

// Danh sách các mục sẵn sàng báo giá gửi khách (Còn hàng > 0)
const availableQuotes = computed(() => {
  return displayCards.value.filter(g => g.totalHeads > 0);
});

const handleCopyQuoteText = () => {
  if (availableQuotes.value.length === 0) {
    showToast("Hiện chưa có sản phẩm nào có sẵn để sao chép báo giá!", "warning");
    return;
  }

  const todayStr = new Date().toLocaleDateString('vi-VN');
  let text = `🐷 BẢNG BÁO GIÁ HEO SỮA (HÔM NAY ${todayStr})\n`;
  text += `----------------------------------------\n`;

  availableQuotes.value.forEach((q, idx) => {
    const preserve = getPreserveBadge(q.porkType).label;
    const feature = getPigFeatureBadge(q.pigFeature).label;
    const priceStr = q.sellingPrice > 0 ? formatVND(q.sellingPrice) + '/con' : 'Liên hệ';
    text += `${idx + 1}. ${q.name || ('Heo sữa ' + q.sizeType)} (${preserve} - ${feature})\n`;
    text += `   👉 Đơn giá: ${priceStr} (Còn sẵn: ${q.totalHeads} con)\n`;
    if (q.importDetails) {
      text += `   ℹ️ Ghi chú: ${q.importDetails}\n`;
    }
    text += `\n`;
  });

  text += `----------------------------------------\n`;
  text += `✨ Heo tươi ngon sạch sẽ, bao chuẩn chất lượng!\n`;
  text += `📞 Quý khách vui lòng liên hệ đặt hàng sớm.`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("Đã sao chép bảng báo giá thành công! Bạn có thể dán ngay vào Zalo hoặc SMS.", "success");
  }).catch(() => {
    showToast("Không thể tự động sao chép vào bộ nhớ tạm, vui lòng chụp màn hình!", "warning");
  });
};

const handleOpenAdd = () => {
  editingProduct.value = null;
  editingGroup.value = null;
  form.value = {
    name: '',
    image: defaultPigImage,
    imageList: [],
    porkType: 'hot',
    pigFeature: 'duoi_cut',
    sizeType: 'Heo sữa (3 - 3.9kg)',
    unit: 'Con',
    costPrice: 200000,
    sellingPrice: 1200000,
    supplierId: suppliers.value.length > 0 ? suppliers.value[0].id : '',
    importDate: new Date().toISOString().slice(0, 10),
    importDetails: '',
    notes: ''
  };
  showModal.value = true;
};

const handleSaveProduct = async () => {
  if (!form.value.name.trim()) {
    showToast("Vui lòng nhập tên sản phẩm heo!", "warning");
    return;
  }

  const primaryImage = form.value.image || (form.value.imageList?.[0] || defaultPigImage);
  const imagesJson = JSON.stringify(form.value.imageList && form.value.imageList.length > 0 ? form.value.imageList : [primaryImage]);

  try {
    if (editingGroup.value) {
      // Cập nhật đồng bộ cho tất cả sản phẩm trong nhóm gộp
      for (const item of editingGroup.value.items) {
        const payload = {
          name: form.value.name,
          tenSanPham: form.value.name,
          productCode: item.productCode || item.maSanPham,
          maSanPham: item.productCode || item.maSanPham,
          image: primaryImage,
          imageUrl: primaryImage,
          hinhAnh: primaryImage,
          danhSachHinhAnh: imagesJson,
          images: imagesJson,
          porkType: item.porkType || item.loaiHeo || form.value.porkType,
          loaiHeo: item.porkType || item.loaiHeo || form.value.porkType,
          pigFeature: item.pigFeature || item.dacDiemHeo || form.value.pigFeature,
          dacDiemHeo: item.pigFeature || item.dacDiemHeo || form.value.pigFeature,
          sizeType: item.sizeType || item.loaiSize || form.value.sizeType,
          loaiSize: item.sizeType || item.loaiSize || form.value.sizeType,
          unit: 'Con',
          donViTinh: 'Con',
          costPrice: Number(item.costPrice || item.giaNhapVon) || 0,
          giaNhapVon: Number(item.costPrice || item.giaNhapVon) || 0,
          sellingPrice: Number(form.value.sellingPrice) || 0,
          giaBanRa: Number(form.value.sellingPrice) || 0,
          supplierId: item.supplier?.id || item.nhaCungCap?.id,
          nhaCungCapId: item.supplier?.id || item.nhaCungCap?.id,
          importDate: item.importDate || item.ngayNhap,
          ngayNhap: item.importDate || item.ngayNhap,
          importDetails: form.value.importDetails || '',
          chiTietNhap: form.value.importDetails || '',
          notes: form.value.notes || form.value.importDetails || '',
          ghiChu: form.value.notes || form.value.importDetails || '',
          nhomGopId: editingGroup.value.groupId
        };

        await fetch(`/api/products/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      showToast(`✅ Đã đồng bộ giá bán ${formatVND(form.value.sellingPrice)} cho toàn bộ ${editingGroup.value.sizeType}!`, "success");
      showModal.value = false;
      editingGroup.value = null;
      fetchData();
      return;
    }

    const payload = {
      name: form.value.name,
      tenSanPham: form.value.name,
      productCode: editingProduct.value ? (editingProduct.value.productCode || editingProduct.value.maSanPham) : `HEO-${Date.now().toString().slice(-4)}`,
      maSanPham: editingProduct.value ? (editingProduct.value.productCode || editingProduct.value.maSanPham) : `HEO-${Date.now().toString().slice(-4)}`,
      image: primaryImage,
      imageUrl: primaryImage,
      hinhAnh: primaryImage,
      danhSachHinhAnh: imagesJson,
      images: imagesJson,
      porkType: form.value.porkType,
      loaiHeo: form.value.porkType,
      pigFeature: form.value.pigFeature,
      dacDiemHeo: form.value.pigFeature,
      sizeType: form.value.sizeType,
      loaiSize: form.value.sizeType,
      unit: 'Con',
      donViTinh: 'Con',
      costPrice: Number(form.value.costPrice) || 0,
      giaNhapVon: Number(form.value.costPrice) || 0,
      sellingPrice: Number(form.value.sellingPrice) || 0,
      giaBanRa: Number(form.value.sellingPrice) || 0,
      supplierId: Number(form.value.supplierId) || null,
      nhaCungCapId: Number(form.value.supplierId) || null,
      importDate: form.value.importDate,
      ngayNhap: form.value.importDate,
      importDetails: form.value.importDetails || form.value.notes || '',
      chiTietNhap: form.value.importDetails || form.value.notes || '',
      notes: form.value.notes || form.value.importDetails || '',
      ghiChu: form.value.notes || form.value.importDetails || '',
      nhomGopId: editingProduct.value?.nhomGopId || null
    };

    const url = editingProduct.value ? `/api/products/${editingProduct.value.id}` : '/api/products';
    const method = editingProduct.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast(editingProduct.value ? "Cập nhật thông tin sản phẩm thành công!" : "Tạo sản phẩm mới thành công!", "success");
      showModal.value = false;
      fetchData();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast("Lỗi lưu sản phẩm: " + (err.message || 'Không thể hoàn tất thao tác'), "error");
    }
  } catch (err) {
    showToast("Lỗi kết nối máy chủ: " + err.message, "error");
  }
};

const handleDeleteProduct = async (p) => {
  const id = p.id;
  const name = p.name || p.tenSanPham;
  const confirmed = await showConfirm({
    title: 'Xác Nhận Xóa Sản Phẩm',
    message: `Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi danh mục bán hàng?`,
    confirmText: 'Xác Nhận Xóa',
    cancelText: 'Hủy Bỏ',
    type: 'danger'
  });

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast("Đã xóa sản phẩm khỏi danh mục thành công!", "success");
      fetchData();
    } else {
      showToast("Không thể xóa sản phẩm này vì đã có dữ liệu đơn hàng hoặc phiếu nhập liên kết!", "error");
    }
  } catch (e) {
    showToast("Lỗi xóa sản phẩm: " + e.message, "error");
  }
};

const fetchData = async (isSilent = false) => {
  if (!isSilent && products.value.length === 0) {
    loading.value = true;
  }
  try {
    const [pRes, sRes, puRes, szRes] = await Promise.all([
      fetch('/api/products').then(r => r.json()).catch(() => []),
      fetch('/api/suppliers').then(r => r.json()).catch(() => []),
      fetch('/api/purchases').then(r => r.json()).catch(() => []),
      fetch('/api/sizes').then(r => r.json()).catch(() => [])
    ]);

    products.value = Array.isArray(pRes) ? pRes : [];
    suppliers.value = Array.isArray(sRes) ? sRes : [];
    purchases.value = Array.isArray(puRes) ? puRes : [];
    sizes.value = Array.isArray(szRes) ? szRes : [];
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
