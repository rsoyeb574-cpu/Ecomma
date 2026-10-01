import { create } from 'zustand';
import { User, UserRole, CartItem, Product, SellerProfile, Order, Coupon, Payout, Category, SubOrder } from '../types';
import * as storage from '../services/storageService';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface EcommaStore {
  // Auth & Roles
  currentUser: User;
  switchRole: (role: UserRole) => void;
  updateCurrentUser: (updates: Partial<User>) => void;

  // Data Collections
  products: Product[];
  sellers: SellerProfile[];
  categories: Category[];
  orders: Order[];
  coupons: Coupon[];
  payouts: Payout[];

  // Refresh
  refreshData: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Coupon
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Product Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Order Actions
  placeOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;
  fastForwardOrder: (orderId: string, subOrderId: string) => SubOrder | undefined;

  // Seller Actions
  registerSeller: (data: Omit<SellerProfile, 'id' | 'rating' | 'reviewCount' | 'isVerified' | 'joinedDate' | 'totalSales' | 'walletBalance' | 'pendingBalance' | 'kycStatus' | 'status'>) => SellerProfile;
  updateSeller: (id: string, updates: Partial<SellerProfile>) => void;
  requestPayout: (amount: number) => boolean;
  updatePayoutStatus: (payoutId: string, status: 'completed' | 'rejected') => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Dark Mode for Dashboards
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Indian Rupee currency formatter
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export const useStore = create<EcommaStore>((set, get) => {
  // Initialize storage seeds
  storage.initStorage();

  return {
    currentUser: storage.getCurrentUser(),
    products: storage.getProducts(),
    sellers: storage.getSellers(),
    categories: storage.getCategories(),
    orders: storage.getOrders(),
    coupons: storage.getCoupons(),
    payouts: storage.getPayouts(),
    cart: storage.getCart(),
    wishlist: storage.getWishlist(),
    appliedCoupon: null,
    discountAmount: 0,
    toasts: [],
    isDarkMode: false,

    toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),

    refreshData: () => {
      set({
        currentUser: storage.getCurrentUser(),
        products: storage.getProducts(),
        sellers: storage.getSellers(),
        categories: storage.getCategories(),
        orders: storage.getOrders(),
        coupons: storage.getCoupons(),
        payouts: storage.getPayouts(),
        cart: storage.getCart(),
        wishlist: storage.getWishlist(),
      });
    },

    switchRole: (role: UserRole) => {
      const users = storage.getUsers();
      const targetUser = users.find(u => u.role === role) || {
        id: `user-${role}-demo`,
        name: role === 'buyer' ? 'Aarav Sharma' : role === 'seller' ? 'Kavita Maheshwari' : 'Vikram Sengupta',
        email: `${role}@ecomma.in`,
        role,
        phone: '+91 98112 34567',
        addresses: [],
        sellerId: role === 'seller' ? 'seller-1' : undefined
      };

      storage.setCurrentUser(targetUser);
      set({ currentUser: targetUser });
      get().addToast(`Switched active persona to ${role.toUpperCase()} mode.`, 'info');
    },

    updateCurrentUser: (updates) => {
      const updated = storage.updateUser(get().currentUser.id, updates);
      set({ currentUser: updated });
      get().addToast('Profile updated successfully', 'success');
    },

    // Cart Actions
    addToCart: (product, quantity = 1, variantId) => {
      const variant = variantId && product.variants ? product.variants.find(v => v.id === variantId) : undefined;
      const price = variant ? variant.price : product.price;
      const originalPrice = variant ? variant.originalPrice : product.originalPrice;
      const stock = variant ? variant.stock : product.stock;

      const item: CartItem = {
        id: `cart-${product.id}-${variantId || 'default'}`,
        productId: product.id,
        productTitle: product.title,
        variantId,
        variantName: variant?.name,
        price,
        originalPrice,
        quantity,
        image: variant?.image || product.images[0] || '',
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        isCodAvailable: product.isCodAvailable,
        stock
      };

      const updatedCart = storage.addToCart(item);
      set({ cart: updatedCart });
      get().addToast(`Added "${product.title.slice(0, 30)}..." to your shopping bag.`, 'success');
    },

    updateCartQuantity: (cartItemId, quantity) => {
      const updatedCart = storage.updateCartQuantity(cartItemId, quantity);
      set({ cart: updatedCart });
    },

    removeFromCart: (cartItemId) => {
      const updatedCart = storage.removeFromCart(cartItemId);
      set({ cart: updatedCart });
      get().addToast('Item removed from cart', 'info');
    },

    clearCart: () => {
      storage.clearCart();
      set({ cart: [], appliedCoupon: null, discountAmount: 0 });
    },

    // Coupons
    applyCoupon: (code: string) => {
      const subtotal = get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const result = storage.validateCoupon(code, subtotal);
      if (result.valid && result.coupon) {
        set({ appliedCoupon: result.coupon, discountAmount: result.discount });
        get().addToast(`Coupon "${result.coupon.code}" applied! You saved ${formatINR(result.discount)}`, 'success');
        return { success: true, message: `Saved ${formatINR(result.discount)}!` };
      } else {
        get().addToast(result.error || 'Failed to apply coupon', 'error');
        return { success: false, message: result.error || 'Invalid coupon' };
      }
    },

    removeCoupon: () => {
      set({ appliedCoupon: null, discountAmount: 0 });
      get().addToast('Coupon removed', 'info');
    },

    // Wishlist
    toggleWishlist: (productId: string) => {
      const updated = storage.toggleWishlist(productId);
      const isAdded = updated.includes(productId);
      set({ wishlist: updated });
      get().addToast(isAdded ? 'Saved to your Wishlist!' : 'Removed from Wishlist', isAdded ? 'success' : 'info');
    },

    isInWishlist: (productId: string) => {
      return get().wishlist.includes(productId);
    },

    // Product CRUD
    addProduct: (product: Product) => {
      storage.addProduct(product);
      set({ products: storage.getProducts() });
      get().addToast(`Listing "${product.title.slice(0, 25)}..." published successfully!`, 'success');
    },

    updateProduct: (id: string, updates: Partial<Product>) => {
      storage.updateProduct(id, updates);
      set({ products: storage.getProducts() });
      get().addToast('Product updated successfully.', 'success');
    },

    deleteProduct: (id: string) => {
      storage.deleteProduct(id);
      set({ products: storage.getProducts() });
      get().addToast('Product listing removed.', 'info');
    },

    // Orders
    placeOrder: (order: Order) => {
      storage.createOrder(order);
      set({
        orders: storage.getOrders(),
        products: storage.getProducts(),
        sellers: storage.getSellers(),
        cart: [],
        appliedCoupon: null,
        discountAmount: 0
      });
      get().addToast(`Order #${order.orderNumber} placed successfully!`, 'success');
    },

    cancelOrder: (orderId: string) => {
      const order = storage.cancelOrder(orderId);
      if (order) {
        set({
          orders: storage.getOrders(),
          products: storage.getProducts()
        });
        get().addToast(`Order #${order.orderNumber} has been cancelled.`, 'info');
      }
    },

    fastForwardOrder: (orderId: string, subOrderId: string) => {
      const result = storage.advanceSubOrderStatus(orderId, subOrderId);
      if (result) {
        set({
          orders: storage.getOrders(),
          sellers: storage.getSellers()
        });
        get().addToast(`Order progressed to status: ${result.subOrder.status.replace(/_/g, ' ').toUpperCase()}`, 'info');
        return result.subOrder;
      }
      return undefined;
    },

    // Seller Onboarding & Actions
    registerSeller: (data) => {
      const id = `seller-${Date.now()}`;
      const newSeller: SellerProfile = {
        ...data,
        id,
        rating: 5.0,
        reviewCount: 0,
        isVerified: true,
        joinedDate: new Date().toISOString().split('T')[0],
        totalSales: 0,
        walletBalance: 0,
        pendingBalance: 0,
        kycStatus: 'verified',
        status: 'active'
      };

      storage.addSeller(newSeller);
      const user = get().currentUser;
      storage.updateUser(user.id, { role: 'seller', sellerId: id });
      set({
        sellers: storage.getSellers(),
        currentUser: storage.getCurrentUser()
      });
      get().addToast(`Welcome to Ecomma! Store "${newSeller.storeName}" is now active.`, 'success');
      return newSeller;
    },

    updateSeller: (id, updates) => {
      storage.updateSeller(id, updates);
      set({ sellers: storage.getSellers() });
    },

    requestPayout: (amount: number) => {
      const user = get().currentUser;
      const sellerId = user.sellerId || 'seller-1';
      const payout = storage.requestPayout(sellerId, amount);
      if (payout) {
        set({
          payouts: storage.getPayouts(),
          sellers: storage.getSellers()
        });
        get().addToast(`Payout request of ${formatINR(amount)} submitted!`, 'success');
        return true;
      } else {
        get().addToast('Insufficient wallet balance for this payout.', 'error');
        return false;
      }
    },

    updatePayoutStatus: (payoutId: string, status: 'completed' | 'rejected') => {
      storage.updatePayoutStatus(payoutId, status);
      set({ payouts: storage.getPayouts() });
      get().addToast(`Payout marked as ${status.toUpperCase()}`, 'info');
    },

    // Toasts
    addToast: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      set(state => ({
        toasts: [...state.toasts.slice(-4), { id, message, type }]
      }));
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },

    removeToast: (id: string) => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }
  };
});
