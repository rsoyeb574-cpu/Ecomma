export type UserRole = 'buyer' | 'seller' | 'admin';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
  type: 'home' | 'work';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  addresses: Address[];
  sellerId?: string;
}

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  upiId?: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  logo: string;
  banner?: string;
  description: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  joinedDate: string;
  gstNumber?: string;
  bankDetails: BankDetails;
  pickupAddress: Address;
  commissionRate: number; // e.g. 0.08 for 8%
  totalSales: number;
  walletBalance: number;
  pendingBalance: number;
  kycStatus: 'verified' | 'pending' | 'rejected';
  status: 'active' | 'suspended';
}

export interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  attributes: Record<string, string>;
  image?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  title: string;
  slug: string;
  description: string;
  bulletFeatures: string[];
  category: string;
  subCategory?: string;
  tags: string[];
  images: string[];
  price: number;
  originalPrice: number;
  stock: number;
  isCodAvailable: boolean;
  status: 'active' | 'inactive' | 'draft' | 'under_review';
  rating: number;
  reviewCount: number;
  variants: Variant[];
  seoTitle?: string;
  seoDescription?: string;
  aiScore?: number;
  returnPolicyDays: number;
  weightGrams: number;
  createdAt: string;
  isTrending?: boolean;
  isBestseller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  variantId?: string;
  variantName?: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
  isCodAvailable: boolean;
  stock: number;
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Shipment {
  id: string;
  subOrderId: string;
  courierName: string;
  awbNumber: string;
  trackingUrl?: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
}

export interface SubOrder {
  id: string;
  orderId: string;
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  commission: number;
  tax: number;
  netPayout: number;
  status: OrderStatus;
  shipment?: Shipment;
  payoutStatus: 'pending' | 'settled' | 'refunded';
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: Address;
  subOrders: SubOrder[];
  totalAmount: number;
  discountAmount: number;
  shippingTotal: number;
  grandTotal: number;
  paymentMethod: 'ONLINE' | 'COD';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  overallStatus: OrderStatus;
  couponCode?: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  status: 'requested' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  settledAt?: string;
  referenceNumber?: string;
  upiOrBank: string;
  ordersCount: number;
}

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validUntil: string;
  description: string;
  isActive: boolean;
}

export interface AIGeneratedListing {
  title: string;
  description: string;
  features: string[];
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  suggestedPriceRange: {
    min: number;
    max: number;
    optimal: number;
  };
  seoScore: number;
  improvementTips: string[];
}
