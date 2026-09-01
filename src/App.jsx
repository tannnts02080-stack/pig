import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import POS from './components/POS';
import Products from './components/Products';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import BankAccounts from './components/BankAccounts';
import Reports from './components/Reports';
import Customers from './components/Customers';
import ConnectMobile from './components/ConnectMobile';
import Settings from './components/Settings';
import { api } from './utils/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('pos');
  const [settings, setSettings] = useState({});

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data || {});
    } catch (e) {
      console.error("Lỗi tải settings:", e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Thanh Menu điều hướng */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        settings={settings}
      />

      {/* Nội dung các màn hình */}
      <main className="flex-1 pb-20 lg:pb-8">
        {currentTab === 'pos' && <POS />}
        {currentTab === 'products' && <Products />}
        {currentTab === 'inventory' && <Inventory />}
        {currentTab === 'orders' && <Orders />}
        {currentTab === 'banks' && <BankAccounts />}
        {currentTab === 'reports' && <Reports />}
        {currentTab === 'customers' && <Customers />}
        {currentTab === 'connect' && <ConnectMobile />}
        {currentTab === 'settings' && <Settings settings={settings} onRefresh={fetchSettings} />}
      </main>
    </div>
  );
}
