import React, { useState } from 'react';
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
import { BarChart3, MapPin, TrendingUp, Users, RotateCcw } from 'lucide-react';

const STATE_DATA = [
  { state: 'Karnataka', percentage: 32, sales: 156000 },
  { state: 'Maharashtra', percentage: 26, sales: 128000 },
  { state: 'Delhi NCR', percentage: 18, sales: 89000 },
  { state: 'West Bengal', percentage: 12, sales: 58000 },
  { state: 'Tamil Nadu', percentage: 8, sales: 39000 },
  { state: 'Others', percentage: 4, sales: 19200 }
];

const CATEGORY_SHARE = [
  { name: 'Sarees & Handlooms', value: 55, color: '#F59E0B' },
  { name: 'Kurtis & Dupattas', value: 30, color: '#FF6B4A' },
  { name: 'Stoles & Fabrics', value: 15, color: '#14B8A6' }
];

export const SellerAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30' | '90' | '365'>('30');

  return (
    <div className="space-y-8">
      {/* Title & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            Store Performance & Customer Demographics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data insights on regional customer demand, conversion ratios, and product returns.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTimeRange('30')}
            className={`px-3 py-1.5 rounded-lg ${timeRange === '30' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600'}`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('90')}
            className={`px-3 py-1.5 rounded-lg ${timeRange === '90' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600'}`}
          >
            Last 90 Days
          </button>
          <button
            onClick={() => setTimeRange('365')}
            className={`px-3 py-1.5 rounded-lg ${timeRange === '365' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600'}`}
          >
            Last Year
          </button>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Sales</span>
          <p className="font-mono text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">{formatINR(489200)}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+22.4% MoM</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Visitor Conversion</span>
          <p className="font-mono text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">4.12%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Above 3.2% benchmark</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Return Rate</span>
          <p className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">1.4%</p>
          <span className="text-[10px] text-slate-400">Industry avg: 4.8%</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Order Value</span>
          <p className="font-mono text-2xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">{formatINR(2840)}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+₹320 Festive uplift</span>
        </div>
      </div>

      {/* Regional Customer Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer Locations by Indian State */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF6B4A]" />
              <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Customer Distribution by State</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Pan-India Shipments</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATE_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(15,27,45,0.06)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}% of Orders`, 'Share']}
                  contentStyle={{ backgroundColor: '#0F1B2D', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="percentage" fill="#F59E0B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Revenue by Category Sub-type</h2>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SHARE}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 text-xs">
            {CATEGORY_SHARE.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
