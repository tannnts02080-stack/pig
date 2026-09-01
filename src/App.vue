<template>
  <!-- Security Login Gate (admin / giadinh@) -->
  <LoginGate
    v-if="!isAuthenticated"
    @authenticated="isAuthenticated = true"
  />

  <!-- Main Authenticated Application -->
  <div v-else class="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
    <!-- Header Navbar -->
    <Navbar
      :currentTab="currentTab"
      @update:currentTab="currentTab = $event"
      :settings="settings"
      @logout="handleLogout"
    />

    <!-- Main Content Area with v-show for instantaneous 0ms Tab Switching -->
    <main class="flex-1 pb-20 lg:pb-10">
      <POS v-show="currentTab === 'pos'" />
      <Products v-show="currentTab === 'products'" />
      <Inventory v-show="currentTab === 'inventory'" />
      <Customers v-show="currentTab === 'customers'" />
      <SizeManager v-show="currentTab === 'sizes'" />
      <Orders v-show="currentTab === 'orders'" />
      <BankAccounts v-show="currentTab === 'banks'" />
      <Reports v-show="currentTab === 'reports'" />
      <ConnectMobile v-show="currentTab === 'connect'" />
      <Settings v-show="currentTab === 'settings'" :settings="settings" @refresh="fetchSettings" @logout="handleLogout" />
    </main>

    <!-- Global Dialog & Toast Container -->
    <GlobalDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoginGate from './components/LoginGate.vue';
import GlobalDialog from './components/GlobalDialog.vue';
import Navbar from './components/Navbar.vue';
import POS from './components/POS.vue';
import Products from './components/Products.vue';
import Inventory from './components/Inventory.vue';
import Orders from './components/Orders.vue';
import BankAccounts from './components/BankAccounts.vue';
import Reports from './components/Reports.vue';
import Customers from './components/Customers.vue';
import SizeManager from './components/SizeManager.vue';
import ConnectMobile from './components/ConnectMobile.vue';
import Settings from './components/Settings.vue';

const tabComponents = {
  pos: POS,
  products: Products,
  inventory: Inventory,
  customers: Customers,
  sizes: SizeManager,
  orders: Orders,
  banks: BankAccounts,
  reports: Reports,
  connect: ConnectMobile,
  settings: Settings
};

const isAuthenticated = ref(false);
const currentTab = ref('pos');
const settings = ref({});

const checkAuth = () => {
  const auth = localStorage.getItem('kho_heo_authenticated');
  isAuthenticated.value = auth === 'true';
};

const handleLogout = () => {
  localStorage.removeItem('kho_heo_authenticated');
  isAuthenticated.value = false;
};

const fetchSettings = async () => {
  try {
    const res = await fetch('/api/settings');
    if (res && res.ok) {
      const data = await res.json();
      settings.value = data || {};
    }
  } catch (e) {
    console.error("Lỗi tải settings:", e);
  }
};

onMounted(() => {
  checkAuth();
  fetchSettings();
});
</script>
