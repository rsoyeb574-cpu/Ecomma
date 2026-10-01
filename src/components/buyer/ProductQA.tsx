import React, { useState } from 'react';
import { Product } from '../../types';
import { askProductQA } from '../../services/geminiService';
import { Sparkles, Send, Bot, User, HelpCircle, CheckCircle2 } from 'lucide-react';

interface ProductQAProps {
  product: Product;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const ProductQA: React.FC<ProductQAProps> = ({ product }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Namaste! I'm Ecomma's assistant. Ask me anything about ${product.title}—materials, sizing, COD, or artisan credentials.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'Is Cash on Delivery available?',
    'What is the return and exchange policy?',
    'What are the care guidelines?',
    'Where is this crafted in India?'
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    setInput('');
    const newChat: Message[] = [...messages, { sender: 'user', text: q }];
    setMessages(newChat);
    setLoading(true);

    try {
      const answer = await askProductQA({
        product,
        question: q,
        chatHistory: messages
      });
      setMessages([...newChat, { sender: 'ai', text: answer }]);
    } catch {
      setMessages([
        ...newChat,
        {
          sender: 'ai',
          text: `This item is crafted by ${product.sellerName} and backed by Ecomma's 7-day easy return policy. Cash on Delivery is ${product.isCodAvailable ? 'available' : 'not available for this specific category'}.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#0F1B2D]/10 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#0F1B2D] px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B] text-[#0F1B2D] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-base leading-tight">Ask AI About This Product</h4>
            <p className="text-[11px] text-slate-300">Instant answers verified against authentic artisan specifications</p>
          </div>
        </div>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Online</span>
        </span>
      </div>

      {/* Suggested Quick Chips */}
      <div className="p-4 bg-[#FBF7F0]/60 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Quick:</span>
        </span>
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            disabled={loading}
            className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#F59E0B] hover:text-[#0F1B2D] hover:bg-amber-50/50 whitespace-nowrap transition-colors shadow-2xs"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="p-4 max-h-72 overflow-y-auto space-y-3 text-sm">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-[#0F1B2D] text-white'
                  : 'bg-[#F59E0B]/20 text-[#0F1B2D]'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-[#0F1B2D]" />}
            </div>

            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#0F1B2D] text-white rounded-tr-none'
                  : 'bg-[#FBF7F0] text-slate-800 border border-slate-200/80 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
            <Bot className="w-3.5 h-3.5 animate-spin text-[#F59E0B]" />
            <span>Consulting artisan catalog & logistics records...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${product.title.slice(0, 30)}...`}
          className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-[#0F1B2D] hover:bg-[#1D3557] disabled:opacity-40 text-white transition-colors"
          aria-label="Send question"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
