import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Logo } from '../../components/common/Logo';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Package,
  Truck,
  Wallet,
  Tag,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Sun,
  Moon
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, switchRole, isDarkMode, toggleDarkMode } = useStore();
  const location = useLocation();

  const navItems = [
    { label: 'Platform Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Sellers & KYC', path: '/admin/sellers', icon: Users },
    { label: 'Product Moderation', path: '/admin/products', icon: Package },
    { label: 'Orders & Disputes', path: '/admin/orders', icon: Truck },
    { label: 'Seller Payouts', path: '/admin/payouts', icon: Wallet },
    { label: 'Coupons & Categories', path: '/admin/marketing', icon: Tag },
    { label: 'Business Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'AI Market Insights', path: '/admin/ai-insights', icon: Sparkles, badge: 'Gemini AI' }
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#FBF7F0] text-[#0F1B2D]'}`}>
      {/* Admin Sidebar */}
      <aside className={`w-64 border-r hidden md:flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#0F1B2D]/10'
      }`}>
        <div className="space-y-6">
          {/* Logo & Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Logo size="sm" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#F59E0B]" />
              <span>Admin</span>
            </span>
          </div>

          <div className="px-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Governance Console</p>
          </div>

          {/* Navigation Items */}
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
                      ? 'bg-[#0F1B2D] text-white shadow-xs'
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

        {/* Footer */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
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
              <span>Back to Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            onClick={() => switchRole('buyer')}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-[11px] font-bold"
          >
            Switch to Shopper Persona
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-16 border-b flex items-center justify-between px-4 sm:px-8 shrink-0 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#0F1B2D]/10'
        }`}>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
            <span className="font-display font-bold text-sm text-[#0F1B2D] dark:text-white">
              Ecomma National Governance Portal
            </span>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              Live Operations
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 hidden sm:inline">Signed in as {currentUser.name}</span>
            <Link
              to="/"
              className="text-xs font-semibold text-[#FF6B4A] hover:underline"
            >
              Storefront ↗
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
