import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { UserRole } from '../../types';
import { Logo } from '../../components/common/Logo';
import { Shield, Store, ShoppingBag, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'buyer';
  const redirectPath = searchParams.get('redirect') || '/';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const { switchRole, addToast } = useStore();
  const navigate = useNavigate();

  const handleDemoLogin = (targetRole: UserRole) => {
    switchRole(targetRole);
    if (targetRole === 'seller') navigate('/seller');
    else if (targetRole === 'admin') navigate('/admin');
    else navigate(redirectPath);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(role);
    if (role === 'seller') navigate('/seller');
    else if (role === 'admin') navigate('/admin');
    else navigate(redirectPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#0F1B2D]/10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D]">
            {isSignUp ? 'Join Ecomma Marketplace' : 'Welcome to Ecomma'}
          </h1>
          <p className="text-xs text-slate-500">
            {isSignUp ? 'Create your profile as a patron, artisan seller, or administrator' : 'Select your account persona to access tailored tools'}
          </p>
        </div>

        {/* Demo Fast Logins Section (Requested in Brief) */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
          <p className="text-[11px] font-bold text-amber-950 uppercase tracking-wider text-center">
            One-Click Instant Demo Login
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('buyer')}
              className="py-2.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-xs font-bold text-slate-800 shadow-2xs flex flex-col items-center gap-1 transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#FF6B4A]" />
              <span>Buyer Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('seller')}
              className="py-2.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-xs font-bold text-slate-800 shadow-2xs flex flex-col items-center gap-1 transition-transform active:scale-95"
            >
              <Store className="w-4 h-4 text-[#F59E0B]" />
              <span>Seller Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-2.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-xs font-bold text-slate-800 shadow-2xs flex flex-col items-center gap-1 transition-transform active:scale-95"
            >
              <Shield className="w-4 h-4 text-[#0F1B2D]" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Select Role</label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                role === 'buyer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Shopper
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                role === 'seller' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Artisan Seller
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                role === 'admin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`${role}@ecomma.in`}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'Create Account' : `Sign In as ${role.toUpperCase()}`}</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#FF6B4A] font-semibold hover:underline"
          >
            {isSignUp ? 'Already registered? Sign in' : 'New to Ecomma? Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};
