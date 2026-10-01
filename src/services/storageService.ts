import { Product, SellerProfile, Category, Order, CartItem, Review, Coupon, User, Payout, SubOrder, OrderStatus, TrackingEvent } from '../types';
import { INITIAL_CATEGORIES, INITIAL_SELLERS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_COUPONS, INITIAL_REVIEWS } from '../data/mockData';

const KEYS = {
  PRODUCTS: 'ecomma_products',
  SELLERS: 'ecomma_sellers',
  CATEGORIES: 'ecomma_categories',
  ORDERS: 'ecomma_orders',
  COUPONS: 'ecomma_coupons',
  REVIEWS: 'ecomma_reviews',
  USERS: 'ecomma_users',
  CURRENT_USER: 'ecomma_current_user',
  CART: 'ecomma_cart',
  WISHLIST: 'ecomma_wishlist',
  PAYOUTS: 'ecomma_payouts',
  SAVED_FOR_LATER: 'ecomma_saved_for_later'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading key ${key} from localStorage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing key ${key} to localStorage:`, e);
  }
}

// Initial hydration if empty
export function initStorage(): void {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    safeSet(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(KEYS.SELLERS)) {
    safeSet(KEYS.SELLERS, INITIAL_SELLERS);
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    safeSet(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    safeSet(KEYS.ORDERS, INITIAL_ORDERS);
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    safeSet(KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    safeSet(KEYS.CURRENT_USER, INITIAL_USERS[0]); // Aarav Sharma (buyer)
  }
  if (!localStorage.getItem(KEYS.COUPONS)) {
    safeSet(KEYS.COUPONS, INITIAL_COUPONS);
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    safeSet(KEYS.REVIEWS, INITIAL_REVIEWS);
  }
  if (!localStorage.getItem(KEYS.CART)) {
    safeSet(KEYS.CART, []);
  }
  if (!localStorage.getItem(KEYS.WISHLIST)) {
    safeSet(KEYS.WISHLIST, ['prod-1', 'prod-7']);
  }
  if (!localStorage.getItem(KEYS.PAYOUTS)) {
    safeSet(KEYS.PAYOUTS, [
      {
        id: 'pay-1',
        sellerId: 'seller-1',
        sellerName: 'Kavita Silks & Crafts',
        amount: 25000,
        status: 'completed',
        requestedAt: '2025-01-15T10:00:00Z',
        settledAt: '2025-01-16T14:30:00Z',
        referenceNumber: 'NEFT-HDFC-9918231',
        upiOrBank: 'HDFC Bank (A/C ...1928)',
        ordersCount: 8
      },
      {
        id: 'pay-2',
        sellerId: 'seller-1',
        sellerName: 'Kavita Silks & Crafts',
        amount: 15000,
        status: 'requested',
        requestedAt: '2025-01-29T11:00:00Z',
        upiOrBank: 'HDFC Bank (A/C ...1928)',
        ordersCount: 5
      }
    ]);
  }
}

// PRODUCTS
export function getProducts(): Product[] {
  return safeGet(KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find(p => p.id === id);
}

export function saveProducts(products: Product[]): void {
  safeSet(KEYS.PRODUCTS, products);
}

export function addProduct(product: Product): Product {
  const products = getProducts();
  products.unshift(product);
  saveProducts(products);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
  return true;
}

// SELLERS
export function getSellers(): SellerProfile[] {
  return safeGet(KEYS.SELLERS, INITIAL_SELLERS);
}

export function getSellerById(id: string): SellerProfile | undefined {
  return getSellers().find(s => s.id === id);
}

export function updateSeller(id: string, updates: Partial<SellerProfile>): SellerProfile | undefined {
  const sellers = getSellers();
  const index = sellers.findIndex(s => s.id === id);
  if (index === -1) return undefined;
  sellers[index] = { ...sellers[index], ...updates };
  safeSet(KEYS.SELLERS, sellers);
  return sellers[index];
}

export function addSeller(seller: SellerProfile): SellerProfile {
  const sellers = getSellers();
  sellers.push(seller);
  safeSet(KEYS.SELLERS, sellers);
  return seller;
}

// CATEGORIES
export function getCategories(): Category[] {
  return safeGet(KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export function saveCategories(categories: Category[]): void {
  safeSet(KEYS.CATEGORIES, categories);
}

// USERS & CURRENT USER
export function getUsers(): User[] {
  return safeGet(KEYS.USERS, INITIAL_USERS);
}

export function getCurrentUser(): User {
  return safeGet(KEYS.CURRENT_USER, INITIAL_USERS[0]);
}

export function setCurrentUser(user: User): void {
  safeSet(KEYS.CURRENT_USER, user);
}

export function updateUser(id: string, updates: Partial<User>): User {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    safeSet(KEYS.USERS, users);
    const current = getCurrentUser();
    if (current.id === id) {
      setCurrentUser(users[index]);
    }
    return users[index];
  }
  return getCurrentUser();
}

// CART
export function getCart(): CartItem[] {
  return safeGet(KEYS.CART, []);
}

export function saveCart(items: CartItem[]): void {
  safeSet(KEYS.CART, items);
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();
  const existing = cart.find(i => i.productId === item.productId && i.variantId === item.variantId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + item.quantity, item.stock || 99);
  } else {
    cart.push(item);
  }
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(id: string, quantity: number): CartItem[] {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  } else {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity = Math.min(quantity, item.stock || 99);
    }
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(id: string): CartItem[] {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  safeSet(KEYS.CART, []);
}

// WISHLIST
export function getWishlist(): string[] {
  return safeGet(KEYS.WISHLIST, []);
}

export function toggleWishlist(productId: string): string[] {
  const list = getWishlist();
  const index = list.indexOf(productId);
  let updated: string[];
  if (index >= 0) {
    updated = list.filter(id => id !== productId);
  } else {
    updated = [...list, productId];
  }
  safeSet(KEYS.WISHLIST, updated);
  return updated;
}

// ORDERS
export function getOrders(): Order[] {
  return safeGet(KEYS.ORDERS, INITIAL_ORDERS);
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find(o => o.id === id || o.orderNumber === id);
}

export function saveOrders(orders: Order[]): void {
  safeSet(KEYS.ORDERS, orders);
}

export function createOrder(order: Order): Order {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);

  // Decrement stock for ordered items
  const products = getProducts();
  for (const subOrder of order.subOrders) {
    for (const item of subOrder.items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (item.variantId && prod.variants) {
          const variant = prod.variants.find(v => v.id === item.variantId);
          if (variant) {
            variant.stock = Math.max(0, variant.stock - item.quantity);
          }
        }
      }
    }
  }
  saveProducts(products);

  // Clear cart
  clearCart();

  return order;
}

export function cancelOrder(orderId: string): Order | undefined {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return undefined;

  order.overallStatus = 'cancelled';
  for (const sub of order.subOrders) {
    sub.status = 'cancelled';
    if (sub.shipment) {
      sub.shipment.events.push({
        timestamp: new Date().toLocaleString(),
        status: 'Order Cancelled',
        location: 'Customer Service',
        description: 'Customer requested cancellation. Inventory restored.'
      });
    }
  }

  // Restore inventory
  const products = getProducts();
  for (const sub of order.subOrders) {
    for (const item of sub.items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock += item.quantity;
      }
    }
  }
  saveProducts(products);
  saveOrders(orders);
  return order;
}

// Advancing Order Status Workflow (Auto-progression & Fast-forward simulator)
const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  placed: 'confirmed',
  confirmed: 'packed',
  packed: 'shipped',
  shipped: 'out_for_delivery',
  out_for_delivery: 'delivered',
  delivered: null,
  cancelled: null,
  returned: null
};

export function advanceSubOrderStatus(orderId: string, subOrderId: string): { order: Order; subOrder: SubOrder } | undefined {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return undefined;

  const subOrder = order.subOrders.find(s => s.id === subOrderId);
  if (!subOrder) return undefined;

  const currentStatus = subOrder.status;
  const next = NEXT_STATUS[currentStatus];
  if (!next) return { order, subOrder };

  subOrder.status = next;

  // Auto assign shipment if packed or shipped
  if (!subOrder.shipment) {
    const couriers = ['Delhivery Express', 'BlueDart Air', 'Shadowfax Hub', 'Xpressbees Surface'];
    const randomCourier = couriers[Math.floor(Math.random() * couriers.length)];
    const awb = `ECM-${Math.floor(100000 + Math.random() * 900000)}-IN`;
    subOrder.shipment = {
      id: `ship-${Date.now()}`,
      subOrderId: subOrder.id,
      courierName: randomCourier,
      awbNumber: awb,
      estimatedDelivery: 'Within 2-3 business days',
      events: [
        {
          timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          status: 'Order Placed',
          location: 'Origin Facility',
          description: 'Shipment manifest generated.'
        }
      ]
    };
  }

  // Add event
  const eventDescriptions: Record<OrderStatus, string> = {
    placed: 'Order confirmed and awaiting seller dispatch.',
    confirmed: 'Seller accepted order and scheduled packaging.',
    packed: 'Packed with security label. AWB allocated.',
    shipped: 'Package dispatched from seller pickup hub with courier partner.',
    out_for_delivery: 'Out with delivery executive for doorstep handover.',
    delivered: order.paymentMethod === 'COD'
      ? 'Delivered successfully. Cash payment collected and remitted to seller account.'
      : 'Delivered successfully to verified address.',
    cancelled: 'Order was cancelled.',
    returned: 'Return request processed and picked up.'
  };

  const eventLocations: Record<OrderStatus, string> = {
    placed: 'Online System',
    confirmed: 'Seller Workshop',
    packed: 'Origin Hub',
    shipped: 'Transit Hub',
    out_for_delivery: 'Local Delivery Center',
    delivered: order.shippingAddress.city,
    cancelled: 'Support Hub',
    returned: 'Origin Hub'
  };

  subOrder.shipment.events.push({
    timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    status: next.replace(/_/g, ' ').toUpperCase(),
    location: eventLocations[next],
    description: eventDescriptions[next]
  });

  // If delivered, update seller balance and COD settlement
  if (next === 'delivered') {
    subOrder.payoutStatus = 'settled';
    if (order.paymentMethod === 'COD') {
      order.paymentStatus = 'PAID';
    }
    const sellers = getSellers();
    const seller = sellers.find(s => s.id === subOrder.sellerId);
    if (seller) {
      seller.walletBalance += subOrder.netPayout;
      seller.pendingBalance = Math.max(0, seller.pendingBalance - subOrder.netPayout);
      safeSet(KEYS.SELLERS, sellers);
    }
  }

  // Update overall order status based on all sub-orders
  const allDelivered = order.subOrders.every(s => s.status === 'delivered');
  const allCancelled = order.subOrders.every(s => s.status === 'cancelled');
  if (allDelivered) {
    order.overallStatus = 'delivered';
  } else if (allCancelled) {
    order.overallStatus = 'cancelled';
  } else {
    order.overallStatus = next;
  }

  saveOrders(orders);
  return { order, subOrder };
}

// PAYOUTS
export function getPayouts(): Payout[] {
  return safeGet(KEYS.PAYOUTS, []);
}

export function requestPayout(sellerId: string, amount: number): Payout | null {
  const sellers = getSellers();
  const seller = sellers.find(s => s.id === sellerId);
  if (!seller || seller.walletBalance < amount) return null;

  seller.walletBalance -= amount;
  safeSet(KEYS.SELLERS, sellers);

  const payouts = getPayouts();
  const newPayout: Payout = {
    id: `pay-${Date.now()}`,
    sellerId: seller.id,
    sellerName: seller.storeName,
    amount,
    status: 'requested',
    requestedAt: new Date().toISOString(),
    upiOrBank: seller.bankDetails.upiId || `${seller.bankDetails.bankName} (...${seller.bankDetails.accountNumber.slice(-4)})`,
    ordersCount: Math.ceil(amount / 2000)
  };
  payouts.unshift(newPayout);
  safeSet(KEYS.PAYOUTS, payouts);
  return newPayout;
}

export function updatePayoutStatus(payoutId: string, status: 'completed' | 'rejected', refNumber?: string): Payout | undefined {
  const payouts = getPayouts();
  const p = payouts.find(x => x.id === payoutId);
  if (!p) return undefined;
  p.status = status;
  if (status === 'completed') {
    p.settledAt = new Date().toISOString();
    p.referenceNumber = refNumber || `UTR-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  }
  safeSet(KEYS.PAYOUTS, payouts);
  return p;
}

// REVIEWS
export function getReviews(productId?: string): Review[] {
  const reviews = safeGet<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  if (productId) {
    return reviews.filter(r => r.productId === productId);
  }
  return reviews;
}

export function addReview(review: Review): Review {
  const reviews = getReviews();
  reviews.unshift(review);
  safeSet(KEYS.REVIEWS, reviews);

  // Update product rating
  const products = getProducts();
  const prod = products.find(p => p.id === review.productId);
  if (prod) {
    const prodReviews = reviews.filter(r => r.productId === prod.id);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    prod.rating = parseFloat(avg.toFixed(2));
    prod.reviewCount = prodReviews.length;
    saveProducts(products);
  }

  return review;
}

// COUPONS
export function getCoupons(): Coupon[] {
  return safeGet(KEYS.COUPONS, INITIAL_COUPONS);
}

export function validateCoupon(code: string, cartTotal: number): { valid: boolean; discount: number; coupon?: Coupon; error?: string } {
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  if (!coupon) {
    return { valid: false, discount: 0, error: 'Invalid coupon code' };
  }
  if (cartTotal < coupon.minOrderValue) {
    return { valid: false, discount: 0, error: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required.` };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  return { valid: true, discount: Math.round(discount), coupon };
}
