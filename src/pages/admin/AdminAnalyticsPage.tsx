import React from 'react';
import { useStore, formatINR } from '../../store/useStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  Download,
  Filter,
  TrendingUp,
  CreditCard,
  Banknote,
  RotateCcw
} from 'lucide-react';

const FUNNEL_DATA = [
  { stage: '1. Store Visits', count: 84000, dropoff: '100%' },
  { stage: '2. Product Views', count: 48000, dropoff: '57.1%' },
  { stage: '3. Add to Bag', count: 14200, dropoff: '16.9%' },
  { stage: '4. Initiated Checkout', count: 6800, dropoff: '8.1%' },
  { stage: '5. Successful Orders', count: 4120, dropoff: '4.9%' }
];

const PAYMENT_SPLIT = [
  { name: 'UPI & RuPay Cards', value: 58, color: '#14B8A6' },
  { name: 'Cash on Delivery (COD)', value: 42, color: '#F59E0B' }
];

const SELLER_GMV_CONTRIBUTION = [
  { name: 'Malabar Spice Trove', gmv: 782000 },
  { name: 'VedaVruksha Herbals', gmv: 645000 },
  { name: 'Kavita Silks & Crafts', gmv: 489200 },
  { name: 'Dhokra Bastar Heritage', gmv: 312000 },
  { name: 'Royale Jodhpur Mojari', gmv: 298400 },
  { name: 'Khurja Studio Pottery', gmv: 215000 }
];

export const AdminAnalyticsPage: React.FC = () => {
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Metric,Value\n"
      + "Total Platform GMV,₹2741600\n"
      + "Online Share,58%\n"
      + "COD Share,42%\n"
      + "Overall Conversion,4.9%\n"
      + "Returns Rate,1.4%\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ecomma_Business_Analytics_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            Marketplace Analytics & Conversion Funnel
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Funnel progression, COD vs Online remittance ratio, and seller GMV contributions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overall Funnel Conversion</span>
          <p className="font-mono text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">4.9%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+0.8% festive lift</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Online vs COD Ratio</span>
          <p className="font-mono text-2xl font-bold text-[#14B8A6] tabular-nums">58% / 42%</p>
          <span className="text-[10px] text-slate-400">Escrow backed</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Basket Size</span>
          <p className="font-mono text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">{formatINR(3240)}</p>
          <span className="text-[10px] text-slate-400">1.8 items / cart</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Return Rate</span>
          <p className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">1.4%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Low RTO (Return to Origin)</span>
        </div>
      </div>

      {/* Funnel & Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Conversion Funnel */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Shopper Conversion Funnel</h2>

          <div className="space-y-3">
            {FUNNEL_DATA.map((item, index) => {
              const widthPct = (item.count / FUNNEL_DATA[0].count) * 100;

              return (
                <div key={item.stage} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{item.stage}</span>
                    <span className="font-mono text-slate-500">{item.count.toLocaleString('en-IN')} users ({item.dropoff})</span>
                  </div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-[#0F1B2D] dark:bg-[#F59E0B] rounded-lg transition-all"
                      style={{ width: `${Math.max(6, widthPct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Split Pie */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Payment Method Distribution</h2>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYMENT_SPLIT}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PAYMENT_SPLIT.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {PAYMENT_SPLIT.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seller GMV Contribution Bar Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Top Artisan Guilds by Gross Revenue</h2>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SELLER_GMV_CONTRIBUTION} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(15,27,45,0.06)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val: any) => [formatINR(val as number), 'Gross Sales']}
                contentStyle={{ backgroundColor: '#0F1B2D', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="gmv" fill="#14B8A6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
