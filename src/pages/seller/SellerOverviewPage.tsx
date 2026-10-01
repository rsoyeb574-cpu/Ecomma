import React from 'react';
import { Link } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import {
  TrendingUp,
  Package,
  Truck,
  Wallet,
  Star,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const SALES_CHART_DATA = [
  { day: 'Jan 16', revenue: 12400, orders: 4 },
  { day: 'Jan 17', revenue: 18900, orders: 6 },
  { day: 'Jan 18', revenue: 15200, orders: 5 },
  { day: 'Jan 19', revenue: 24800, orders: 8 },
  { day: 'Jan 20', revenue: 21000, orders: 7 },
  { day: 'Jan 21', revenue: 28400, orders: 9 },
  { day: 'Jan 22', revenue: 32000, orders: 11 },
  { day: 'Jan 23', revenue: 29500, orders: 10 },
  { day: 'Jan 24', revenue: 38200, orders: 13 },
  { day: 'Jan 25', revenue: 34100, orders: 12 },
  { day: 'Jan 26', revenue: 42000, orders: 15 },
  { day: 'Jan 27', revenue: 45800, orders: 16 },
  { day: 'Jan 28', revenue: 41200, orders: 14 },
  { day: 'Jan 29', revenue: 49500, orders: 18 }
];

export const SellerOverviewPage: React.FC = () => {
  const { sellers, currentUser, products, orders, updateProduct } = useStore();

  const seller = sellers.find(s => s.id === currentUser.sellerId) || sellers[0];
  const sellerProducts = products.filter(p => p.sellerId === seller.id);

  // Sub-orders for this seller
  const sellerSubOrders = orders.flatMap(o =>
    o.subOrders.filter(sub => sub.sellerId === seller.id)
  );

  const pendingShipments = sellerSubOrders.filter(s => ['placed', 'confirmed', 'packed'].includes(s.status));
  const lowStockItems = sellerProducts.filter(p => p.stock <= 12);

  const handleQuickAddStock = (prodId: string, currentStock: number) => {
    updateProduct(prodId, { stock: currentStock + 10 });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D] dark:text-white">
            Welcome back, {seller.storeName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Here is your daily dispatch, sales performance, and logistics overview.</p>
        </div>

        <Link
          to="/seller/add-product"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span>New AI Product Listing</span>
        </Link>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Today's Sales */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#0F1B2D]/10 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Sales</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {formatINR(49500)}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">+18.4% vs last week</span>
        </div>

        {/* Orders in Dispatch */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#0F1B2D]/10 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {sellerSubOrders.length || 24}
          </p>
          <span className="text-[10px] text-slate-400">All-time marketplace orders</span>
        </div>

        {/* Pending Shipments */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#0F1B2D]/10 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Dispatch</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-[#F59E0B] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-bold text-[#F59E0B] tabular-nums">
            {pendingShipments.length} Packets
          </p>
          <Link to="/seller/orders" className="text-[10px] text-[#FF6B4A] font-semibold hover:underline block">
            Print labels & dispatch →
          </Link>
        </div>

        {/* Wallet Balance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#0F1B2D]/10 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Settled Wallet</span>
            <div className="w-7 h-7 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {formatINR(seller.walletBalance)}
          </p>
          <Link to="/seller/earnings" className="text-[10px] text-emerald-600 font-semibold hover:underline block">
            Request Payout →
          </Link>
        </div>

        {/* Seller Rating */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#0F1B2D]/10 dark:border-slate-800 space-y-2 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Store Rating</span>
            <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {seller.rating} / 5
          </p>
          <span className="text-[10px] text-slate-400">{seller.reviewCount} customer reviews</span>
        </div>
      </div>

      {/* Main Charts & Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sales Chart Card */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#0F1B2D]/10 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-[#0F1B2D] dark:text-white">Revenue Velocity (Last 14 Days)</h2>
              <p className="text-xs text-slate-500">Gross merchandise value before 8% commission</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#14B8A6] bg-teal-500/10 px-2.5 py-1 rounded-full">
              Average Daily: ₹30,300
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sellerRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15,27,45,0.06)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [formatINR(val as number), 'Revenue']}
                  contentStyle={{ backgroundColor: '#0F1B2D', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#sellerRevGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low-Stock Inventory Alerts */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#0F1B2D]/10 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Inventory Alerts</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
              Low Stock
            </span>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-500">All inventory levels are healthy.</p>
            ) : (
              lowStockItems.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{prod.title}</p>
                    <p className="text-[11px] text-amber-600 font-bold mt-0.5">
                      Only {prod.stock} units left in workshop
                    </p>
                  </div>

                  <button
                    onClick={() => handleQuickAddStock(prod.id, prod.stock)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0F1B2D] hover:bg-slate-800 text-white font-semibold text-[11px] shrink-0"
                  >
                    +10 Units
                  </button>
                </div>
              ))
            )}
          </div>

          <Link
            to="/seller/products"
            className="block text-center text-xs font-semibold text-[#FF6B4A] hover:underline pt-2"
          >
            Manage All {sellerProducts.length} Listings →
          </Link>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#0F1B2D]/10 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#0F1B2D] dark:text-white">Bestselling Store Catalog</h2>
          <Link to="/seller/products" className="text-xs font-semibold text-[#FF6B4A] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock Status</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sellerProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{p.title}</p>
                      <p className="text-[10px] text-slate-400">{p.category}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                    {formatINR(p.price)}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-slate-800 dark:text-slate-200">{p.rating}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/product/${p.id}`}
                      className="text-xs font-semibold text-[#FF6B4A] hover:underline"
                    >
                      View Live →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
