<template>
  <!-- DESKTOP HEADER NAVBAR -->
  <header class="hidden lg:block sticky top-0 z-50 bg-slate-950 border-b border-slate-800 shadow-2xl">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-center h-16 py-2">
        <!-- Desktop Navigation Tabs (Horizontal, Centered, Single Line) -->
        <nav class="flex items-center justify-center space-x-1.5 xl:space-x-2 overflow-x-auto no-scrollbar py-1">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="emitTab(item.id)"
            :class="[
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] xl:text-[13px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none shrink-0',
              currentTab === item.id
                ? item.highlight
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold border border-white/20'
                  : 'bg-slate-800/90 text-amber-400 border border-amber-400/40 shadow-sm font-bold'
                : item.special
                  ? 'text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            <span class="whitespace-nowrap">{{ item.label }}</span>
          </button>
        </nav>
      </div>
    </div>
  </header>

  <!-- MOBILE TOP BAR -->
  <div class="lg:hidden sticky top-0 z-50 bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-xl">
    <div class="flex items-center space-x-2">
      <span class="font-extrabold text-sm text-white tracking-tight">KHO HEO SỮA</span>
      <span class="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">PRO</span>
    </div>

    <button
      @click="emitTab('connect')"
      class="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs flex items-center gap-1.5 font-bold hover:bg-cyan-500/20 active:scale-95 transition cursor-pointer"
      title="Tải App Android APK"
    >
      <Download class="w-3.5 h-3.5 text-cyan-400" />
      <span>Tải APK</span>
    </button>
  </div>

  <!-- MOBILE BOTTOM NAVIGATION BAR -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 pb-safe shadow-2xl">
    <div class="grid grid-cols-7 h-15 items-center px-1">
      <button
        v-for="item in mobileNavItems"
        :key="item.id"
        @click="emitTab(item.id)"
        :class="[
          'relative flex flex-col items-center justify-center h-full transition-all duration-150',
          currentTab === item.id ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        ]"
      >
        <div :class="[
          'p-1.5 rounded-xl transition-all',
          currentTab === item.id ? 'bg-amber-500/20 scale-105' : ''
        ]">
          <component :is="item.icon" class="w-4 h-4" />
        </div>
        <span class="text-[9px] mt-0.5 tracking-tight font-medium whitespace-nowrap">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { 
  ShoppingCart, 
  Tag, 
  Package, 
  FileText, 
  Building2, 
  BarChart3, 
  Users, 
  Smartphone, 
  Download,
  Settings,
  Ruler,
  LayoutDashboard
} from 'lucide-vue-next';

const props = defineProps({
  currentTab: { type: String, default: 'pos' },
  settings: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:currentTab']);

const cleanShopName = (raw) => {
  if (!raw || raw.includes('HEO QUAY')) return 'TỔNG KHO BUÔN BÁN HEO SỮA';
  return raw;
};

const cleanShopTagline = (raw) => {
  if (!raw || raw.includes('Heo Quay')) return 'Heo Sữa Tươi Nóng & Cấp Đông Nguyên Con';
  return raw;
};

const emitTab = (tabId) => {
  emit('update:currentTab', tabId);
};

const navItems = [
  { id: 'pos',        label: 'Cửa Hàng',              icon: ShoppingCart, highlight: true },
  { id: 'products',   label: 'Quản Lý Sản Phẩm',    icon: Tag },
  { id: 'inventory',  label: 'Kho & Nhập Hàng',       icon: Package },
  { id: 'customers',  label: 'NCC & Khách Hàng',      icon: Users },
  { id: 'sizes',      label: 'Quản Lý Size',           icon: Ruler },
  { id: 'banks',      label: 'Ngân Hàng & Dòng Tiền', icon: Building2 },
  { id: 'reports',    label: 'Dashboard Doanh Thu',    icon: BarChart3 },
  { id: 'orders',     label: 'Đơn Hàng',               icon: FileText },
  { id: 'connect',    label: 'App Android APK',        icon: Smartphone, special: true },
  { id: 'settings',   label: 'Cài Đặt',               icon: Settings },
];

const mobileNavItems = [
  { id: 'pos',       label: 'Cửa Hàng', icon: ShoppingCart },
  { id: 'products',  label: 'Sản Phẩm', icon: Tag },
  { id: 'inventory', label: 'Kho Hàng',  icon: Package },
  { id: 'customers', label: 'NCC/KH',     icon: Users },
  { id: 'sizes',     label: 'Size',       icon: Ruler },
  { id: 'banks',     label: 'Dòng Tiền', icon: Building2 },
  { id: 'settings',  label: 'Cài Đặt',  icon: Settings },
];
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
