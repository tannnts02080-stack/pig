import React from 'react';
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
  Tag
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  settings = {}
}) {
  const navItems = [
    { id: 'pos', label: 'Cửa Hàng Ô Sản Phẩm', icon: ShoppingCart, highlight: true },
    { id: 'products', label: 'Quản Lý Sản Phẩm', icon: Tag },
    { id: 'inventory', label: 'Kho Heo & Nhập Xe', icon: Package },
    { id: 'orders', label: 'Quản Lý Đơn & Lợi Nhuận', icon: FileText },
    { id: 'banks', label: 'Tài Khoản & Dòng Tiền', icon: Building2 },
    { id: 'reports', label: 'Dashboard Doanh Thu', icon: BarChart3 },
    { id: 'customers', label: 'Khách Hàng & NCC', icon: Users },
    { id: 'connect', label: 'App Android APK', icon: Smartphone, special: true },
    { id: 'settings', label: 'Cài Đặt', icon: Settings },
  ];

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
      <div className="lg:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5" onClick={() => setCurrentTab('pos')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md">
            <span className="text-base">🐖</span>
          </div>
          <div>
            <h1 className="font-bold text-sm text-white truncate max-w-[180px]">
              {settings.shopName || 'KHO HEO SỮA'}
            </h1>
            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Nóng & Lạnh
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('connect')}
            className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs"
            title="Kết nối điện thoại"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-safe shadow-2xl">
        <div className="grid grid-cols-6 h-16 items-center px-1">
          {[
            { id: 'pos', label: 'Cửa Hàng', icon: ShoppingCart },
            { id: 'products', label: 'Sản Phẩm', icon: Tag },
            { id: 'inventory', label: 'Kho Heo', icon: Package },
            { id: 'orders', label: 'Đơn Hàng', icon: FileText },
            { id: 'banks', label: 'Dòng Tiền', icon: Building2 },
            { id: 'reports', label: 'Báo Cáo', icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex flex-col items-center justify-center h-full transition-all duration-150 ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-amber-500/20 scale-110 shadow-lg' : ''
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
