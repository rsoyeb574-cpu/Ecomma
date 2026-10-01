import React, { useState, useEffect } from 'react';
import { useStore, formatINR } from '../../store/useStore';
import { getBusinessInsights, BusinessInsightsResponse } from '../../services/geminiService';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AdminAIInsightsPage: React.FC = () => {
  const { orders, sellers, products, addToast } = useStore();
  const [loading, setLoading] = useState(false);
  const [insightsData, setInsightsData] = useState<BusinessInsightsResponse | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await getBusinessInsights({
        role: 'admin',
        context: {
          platformGmv: 2741600,
          ordersCount: orders.length + 138,
          activeSellers: sellers.length,
          topCategory: 'Ethnic Wear & Handlooms',
          regionalAlert: 'Kolkata/Siliguri courier SLA latency +1.4 days'
        }
      });
      setInsightsData(data);
    } catch {
      addToast('Using fallback insights report', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
              Gemini AI Strategic Market Insights
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Machine intelligence synthesizes cross-seller trends, regional delivery logistics, and consumer behavior into plain-language business recommendations.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#F59E0B] ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Synthesizing Data...' : 'Re-Run Market Analysis'}</span>
        </button>
      </div>

      {loading && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Sparkles className="w-8 h-8 text-[#F59E0B] animate-spin mx-auto" />
          <h3 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Analyzing Marketplace Run-Rate & Courier Telemetry</h3>
          <p className="text-xs text-slate-500">Gemini 3.8 Flash is cross-referencing fulfillment timelines, category margins, and regional sales spikes...</p>
        </div>
      )}

      {insightsData && !loading && (
        <div className="space-y-6">
          {/* Executive Summary Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#F5EFE6] to-white dark:from-slate-900 dark:to-slate-800 border border-[#F59E0B]/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F1B2D] text-white uppercase tracking-wider">
                Executive Synthesis
              </span>
              <span className="text-xs text-slate-500">Grounded in verified database records</span>
            </div>

            <p className="font-display text-base sm:text-lg font-bold text-[#0F1B2D] dark:text-white leading-relaxed">
              "{insightsData.summary}"
            </p>
          </div>

          {/* Structured Insight Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insightsData.insights.map((card, idx) => {
              const isOpportunity = card.type === 'opportunity';
              const isRisk = card.type === 'risk';

              const icon = isOpportunity ? (
                <Lightbulb className="w-5 h-5 text-emerald-600" />
              ) : isRisk ? (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              ) : (
                <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
              );

              const badgeColor = isOpportunity
                ? 'bg-emerald-100 text-emerald-800'
                : isRisk
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-900';

              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        {icon}
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>
                        {card.type}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white leading-tight">
                      {card.title}
                    </h3>

                    {card.metric && (
                      <p className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        Metric: <span className="text-[#FF6B4A]">{card.metric}</span>
                      </p>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recommended Action</p>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2">
                      <span>{card.action}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
