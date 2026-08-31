<template>
  <div class="flex flex-col min-h-screen">
    <!-- SUB NAVIGATION BAR -->
    <div class="sticky top-[64px] z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-slate-950/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center gap-1 h-11">
          <button
            v-for="t in subTabs"
            :key="t.id"
            @click="activeTab = t.id"
            :class="[
              'relative flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap',
              activeTab === t.id
                ? 'text-amber-400 bg-slate-800/90 border border-amber-400/20 shadow-sm'
                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900'
            ]"
          >
            <component :is="t.icon" class="w-3.5 h-3.5 shrink-0" />
            <span>{{ t.label }}</span>
            <span v-if="activeTab === t.id" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full translate-y-[7px]"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="flex-1">
      <Products v-if="activeTab === 'products'" />
      <Inventory v-if="activeTab === 'inventory'" />
      <Customers v-if="activeTab === 'customers'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Tag, Package, Users } from 'lucide-vue-next';
import Products from './Products.vue';
import Inventory from './Inventory.vue';
import Customers from './Customers.vue';

const activeTab = ref('products');

const subTabs = [
  { id: 'products', label: 'San Pham', icon: Tag },
  { id: 'inventory', label: 'Kho & Nhap Hang', icon: Package },
  { id: 'customers', label: 'NCC & Khach Hang', icon: Users }
];
</script>