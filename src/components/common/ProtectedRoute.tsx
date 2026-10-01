import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { currentUser, switchRole, addToast } = useStore();
  const location = useLocation();

  if (!allowedRoles.includes(currentUser.role)) {
    // Proactively switch persona or prompt user
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#0F1B2D]/10 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-[#F59E0B] flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="font-display font-bold text-xl text-[#0F1B2D]">Role Access Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            This workspace requires the <strong className="capitalize text-slate-800">{allowedRoles.join(' or ')}</strong> role. Your active persona is currently <strong>{currentUser.role}</strong>.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => switchRole(allowedRoles[0])}
              className="w-full py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-bold shadow-md hover:bg-slate-800"
            >
              Switch Persona to {allowedRoles[0].toUpperCase()} & Proceed
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
