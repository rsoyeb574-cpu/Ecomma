import React from 'react';
import { Link } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import {
  TrendingUp,
  Package,
  Users,
  Percent,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
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

const ADMIN_GMV_TREND = [
  { week: 'W1 Dec', gmv: 340000, commission: 27200 },
  { week: 'W2 Dec', gmv: 420000, commission: 33600 },
  { week: 'W3 Dec', gmv: 510000, commission: 40800 },
  { week: 'W4 Dec', gmv: 590000, commission: 47200 },
  { week: 'W1 Jan', gmv: 620000, commission: 49600 },
  { week: 'W2 Jan', gmv: 710000, commission: 56800 },
  { week: 'W3 Jan', gmv: 840000, commission: 67200 },
  { week: 'W4 Jan', gmv: 980000, commission: 78400 }
];

export const AdminOverviewPage: React.FC = () => {
  const { orders, sellers, products, payouts } = useStore();

  const totalGMV = 2741600;
  const platformCommission = Math.round(totalGMV * 0.08);

  const pendingPayouts = payouts.filter(p => p.status === 'requested');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D] dark:text-white">
            Marketplace Executive Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform GMV, seller commission margins, and multi-vendor operational health.
          </p>
        </div>

        <Link
          to="/admin/ai-insights"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span>Generate AI Executive Insights</span>
        </Link>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Platform GMV</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {formatINR(totalGMV)}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">+24.8% Month-over-Month</span>
        </div>

        {/* Commission */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ecomma Commission (8%)</span>
            <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {formatINR(platformCommission)}
          </p>
          <span className="text-[10px] text-slate-400">Net platform earnings</span>
        </div>

        {/* Active Sellers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Verified Guilds</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {sellers.length} Guilds
          </p>
          <span className="text-[10px] text-slate-400">Across 6 Indian craft clusters</span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Marketplace Orders</span>
            <div className="w-7 h-7 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {orders.length + 138} Orders
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">98.2% Courier Delivery SLA</span>
        </div>
      </div>

      {/* Main Growth Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-[#0F1B2D] dark:text-white">National GMV Growth Trend</h2>
            <p className="text-xs text-slate-500">Gross transaction values aggregated weekly across all verified sellers</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#14B8A6] bg-teal-500/10 px-3 py-1 rounded-full">
            +38.5% Quarterly Run-Rate
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ADMIN_GMV_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="adminGmvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15,27,45,0.06)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val: any) => [formatINR(val as number), 'Weekly GMV']}
                contentStyle={{ backgroundColor: '#0F1B2D', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="gmv" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#adminGmvGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actionable Live Moderation Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Payout Requests */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Seller Withdrawal Requests</h3>
            <Link to="/admin/payouts" className="text-xs font-semibold text-[#FF6B4A] hover:underline">
              View All ({payouts.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {payouts.slice(0, 3).map((pay) => (
              <div
                key={pay.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{pay.sellerName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">Amount: {formatINR(pay.amount)} · {pay.upiOrBank}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                  pay.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {pay.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Marketplace Activity Feed */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Operational Activity Log</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-800 dark:text-slate-200">Delhivery courier picked up Order #ECM-2025-8812 in Chanderi.</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">10m ago</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-800 dark:text-slate-200">KYC documents verified for artisan cooperative "Dhokra Bastar Heritage".</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">1h ago</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-slate-800 dark:text-slate-200">AI content moderation approved 4 new silk kurti listings.</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">3h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
