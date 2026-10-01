import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { BuyerLayout } from './components/buyer/BuyerLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Buyer Pages
import { HomePage } from './pages/buyer/HomePage';
import { ProductListingPage } from './pages/buyer/ProductListingPage';
import { ProductDetailPage } from './pages/buyer/ProductDetailPage';
import { CartPage } from './pages/buyer/CartPage';
import { CheckoutPage } from './pages/buyer/CheckoutPage';
import { OrderSuccessPage } from './pages/buyer/OrderSuccessPage';
import { MyOrdersPage } from './pages/buyer/MyOrdersPage';
import { OrderTrackingPage } from './pages/buyer/OrderTrackingPage';
import { WishlistPage } from './pages/buyer/WishlistPage';
import { ProfilePage } from './pages/buyer/ProfilePage';
import { SellerOnboardingPage } from './pages/buyer/SellerOnboardingPage';
import { AuthPage } from './pages/buyer/AuthPage';

// Seller Pages
import { SellerLayout } from './pages/seller/SellerLayout';
import { SellerOverviewPage } from './pages/seller/SellerOverviewPage';
import { SellerListingEditorPage } from './pages/seller/SellerListingEditorPage';
import { SellerProductsPage } from './pages/seller/SellerProductsPage';
import { SellerOrdersPage } from './pages/seller/SellerOrdersPage';
import { SellerEarningsPage } from './pages/seller/SellerEarningsPage';
import { SellerAnalyticsPage } from './pages/seller/SellerAnalyticsPage';
import { SellerSettingsPage } from './pages/seller/SellerSettingsPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminSellersPage } from './pages/admin/AdminSellersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPayoutsPage } from './pages/admin/AdminPayoutsPage';
import { AdminMarketingPage } from './pages/admin/AdminMarketingPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminAIInsightsPage } from './pages/admin/AdminAIInsightsPage';

// Scroll to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Buyer & Public Storefront */}
        <Route element={<BuyerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/orders/track/:id" element={<OrderTrackingPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/become-a-seller" element={<SellerOnboardingPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        {/* Seller Dashboard */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerOverviewPage />} />
          <Route path="add-product" element={<SellerListingEditorPage />} />
          <Route path="products" element={<SellerProductsPage />} />
          <Route path="orders" element={<SellerOrdersPage />} />
          <Route path="earnings" element={<SellerEarningsPage />} />
          <Route path="analytics" element={<SellerAnalyticsPage />} />
          <Route path="settings" element={<SellerSettingsPage />} />
        </Route>

        {/* Admin Governance Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="sellers" element={<AdminSellersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="payouts" element={<AdminPayoutsPage />} />
          <Route path="marketing" element={<AdminMarketingPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="ai-insights" element={<AdminAIInsightsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
