import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import { Logo } from '../../components/common/Logo';
import {
  LayoutDashboard,
  Sparkles,
  Package,
  Truck,
  Wallet,
  BarChart3,
  Settings,
  ArrowUpRight,
  Sun,
  Moon,
  ChevronDown,
  Store,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react';

export const SellerLayout: React.FC = () => {
  const { currentUser, sellers, switchRole, isDarkMode, toggleDarkMode } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active seller profile
  const seller = sellers.find(s => s.id === currentUser.sellerId) || sellers[0];

  const navItems = [
    { label: 'Overview', path: '/seller', icon: LayoutDashboard },
    { label: 'AI Listing Studio', path: '/seller/add-product', icon: Sparkles, badge: 'AI Hero' },
    { label: 'My Products', path: '/seller/products', icon: Package },
    { label: 'Orders & Dispatch', path: '/seller/orders', icon: Truck },
    { label: 'Earnings & Payouts', path: '/seller/earnings', icon: Wallet },
    { label: 'Sales Analytics', path: '/seller/analytics', icon: BarChart3 },
    { label: 'Store Settings', path: '/seller/settings', icon: Settings }
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#FBF7F0] text-[#0F1B2D]'}`}>
      {/* Sidebar for Desktop */}
      <aside className={`w-64 border-r hidden md:flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#0F1B2D]/10'
      }`}>
        <div className="space-y-6">
          {/* Logo & Portal Label */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Logo size="sm" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
              Seller Hub
            </span>
          </div>

          {/* Seller Store Mini Card */}
          <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
            isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-[#FBF7F0] border-slate-200/80'
          }`}>
            <img src={seller.logo} alt={seller.storeName} className="w-10 h-10 rounded-xl object-cover bg-white shrink-0" />
            <div className="min-w-0">
              <p className="font-display font-bold text-xs truncate text-[#0F1B2D] dark:text-white">{seller.storeName}</p>
              <p className="text-[10px] text-slate-500 truncate">{seller.pickupAddress.city}, {seller.pickupAddress.state}</p>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active & Verified</span>
              </div>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0F1B2D] text-white shadow-sm'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-700 hover:text-[#0F1B2D] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B] text-[#0F1B2D]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          {/* Wallet summary button */}
          <Link
            to="/seller/earnings"
            className="block p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Available Wallet</p>
            <p className="font-mono font-bold text-sm text-[#0F1B2D] dark:text-white">{formatINR(seller.walletBalance)}</p>
          </Link>

          <div className="flex items-center justify-between">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/"
              className="flex items-center gap-1 text-[11px] font-semibold text-[#FF6B4A] hover:underline"
            >
              <span>View Live Marketplace</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for Seller */}
        <header className={`h-16 border-b flex items-center justify-between px-4 sm:px-8 shrink-0 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#0F1B2D]/10'
        }`}>
          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo size="sm" />
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Seller Dashboard</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs font-bold text-[#0F1B2D] dark:text-white">{seller.storeName}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick action to add product with AI */}
            <Link
              to="/seller/add-product"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI New Listing</span>
            </Link>

            {/* Persona Switcher for easy testing */}
            <button
              onClick={() => switchRole('buyer')}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Switch to Buyer
            </button>
          </div>
        </header>

        {/* Mobile Slide-Over Menu */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/50 md:hidden">
            <div className="w-64 bg-white p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b">
                <Logo size="sm" />
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-800 hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Child Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
