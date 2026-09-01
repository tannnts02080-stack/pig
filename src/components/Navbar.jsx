import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
  BarChart3, 
  Smartphone, 
  Settings, 
  Building2,
  FileText,
  DollarSign,
  Sparkles,
  Tag,
  Menu,
  X
} from 'lucide-react';
import { useDeviceType } from '../hooks/useDeviceType';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  settings = {}
}) {
  const { isMobile } = useDeviceType();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'pos', label: 'Cửa Hàng Ô Sản Phẩm', shortLabel: 'Cửa Hàng', icon: ShoppingCart, highlight: true },
    { id: 'products', label: 'Quản Lý Sản Phẩm', shortLabel: 'Sản Phẩm', icon: Tag },
    { id: 'inventory', label: 'Kho Heo & Nhập Xe', shortLabel: 'Kho Heo', icon: Package },
    { id: 'orders', label: 'Quản Lý Đơn & Lợi Nhuận', shortLabel: 'Đơn Hàng', icon: FileText },
    { id: 'banks', label: 'Tài Khoản & Dòng Tiền', shortLabel: 'Dòng Tiền', icon: Building2 },
    { id: 'reports', label: 'Dashboard Doanh Thu', shortLabel: 'Báo Cáo', icon: BarChart3 },
    { id: 'customers', label: 'Khách Hàng & NCC', shortLabel: 'Khách Hàng', icon: Users },
    { id: 'connect', label: 'App Android APK', shortLabel: 'Kết Nối', icon: Smartphone, special: true },
    { id: 'settings', label: 'Cài Đặt', shortLabel: 'Cài Đặt', icon: Settings },
  ];

  const primaryTabs = ['pos', 'products', 'inventory', 'orders', 'banks', 'reports'];
  const bottomNavItems = navItems.filter(item => primaryTabs.includes(item.id));

  return (
    <>
      {/* DESKTOP HEADER NAVBAR */}
      <header className="hidden lg:block sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Store Name */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('pos')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
                <span className="text-xl">🐖</span>
              </div>
              <div>
                <h1 className="font-black text-lg text-white flex items-center gap-2 tracking-tight">
                  {settings.shopName || 'TỔNG KHO BUÔN BÁN HEO'}
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    DESKTOP PRO
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium truncate max-w-sm">
                  {settings.shopTagline || 'Heo Sữa Tươi Nóng & Cấp Đông Nguyên Con'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? item.highlight
                          ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/30'
                          : 'bg-slate-800 text-amber-400 border border-slate-700 shadow-sm'
                        : item.special
                          ? 'text-cyan-400 hover:bg-cyan-500/10'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="px-3 py-2.5 flex items-center justify-between">
          {/* Logo & Store Name - Mobile Optimized */}
          <div 
            className="flex items-center space-x-2 cursor-pointer active:scale-95 transition-transform" 
            onClick={() => setCurrentTab('pos')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md">
              <span className="text-lg">🐖</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-sm text-white truncate leading-tight">
                {isMobile 
                  ? (settings.shopName || 'KHO HEO SỮA').substring(0, 18)
                  : settings.shopName || 'TỔNG KHO HEO'}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] text-amber-400 font-semibold">
                  Nóng & Lạnh
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentTab('connect')}
              className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 active:scale-95 transition-transform"
              aria-label="Kết nối điện thoại"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 active:scale-95 transition-transform"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 shadow-2xl max-h-[70vh] overflow-y-auto">
            <div className="p-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-98 ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg'
                        : item.special
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR - Enhanced */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-lg border-t border-slate-800 pb-safe shadow-2xl">
        <div className="grid grid-cols-6 h-16 items-center px-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-400 active:text-slate-200'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"></div>
                )}
                
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-amber-500/20 scale-110' : ''
                }`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[9px] mt-0.5 tracking-tight leading-tight ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}>
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
