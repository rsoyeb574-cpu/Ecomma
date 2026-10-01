import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { ToastContainer } from '../common/ToastContainer';

export const BuyerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF7F0] text-[#0F1B2D]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
