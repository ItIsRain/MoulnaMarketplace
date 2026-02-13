// ==========================================
// MOULNA TYPE DEFINITIONS
// ==========================================

// User & Auth Types
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  level: number;
  xp: number;
  badges: Badge[];
  streakDays: number;
  avatar: AvatarConfig;
  location?: string;
  joinDate: string;
  isVerified: boolean;
}

export type UserRole = 'buyer' | 'seller' | 'admin' | 'both';

export interface AvatarConfig {
  style: string;
  seed: string;
  backgroundColor?: string;
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: BadgeCategory;
  earnedAt?: string;
  xpReward: number;
}

export type BadgeCategory = 'shopping' | 'social' | 'seller' | 'streak' | 'seasonal';

export interface Level {
  level: number;
  title: string;
  xpRequired: number;
  color: string;
  special?: boolean;
}

export interface DailyChallenge {
  id: string;
  task: string;
  xp: number;
  icon: string;
  completed: boolean;
  progress?: number;
  target?: number;
}

export interface XPTransaction {
  id: string;
  amount: number;
  action: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  streak: number;
  badgeCount: number;
}

// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  seller: Seller;
  category: Category;
  subcategory?: Category;
  tags: string[];
  isHandmade: boolean;
  isTrending: boolean;
  isNew: boolean;
  stock: number;
  variants?: ProductVariant[];
  badges: ProductBadge[];
  createdAt: string;
  xpReward: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'material' | 'custom';
  value: string;
  price?: number;
  stock: number;
  image?: string;
}

export type ProductBadge = 'trending' | 'new' | 'flash-deal' | 'handmade' | 'top-seller';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  parentId?: string;
  productCount?: number;
}

// Seller/Shop Types
export interface Seller {
  id: string;
  shopName: string;
  slug: string;
  description: string;
  story?: string;
  avatar: AvatarConfig;
  banner?: string;
  logo?: string;
  level: number;
  xp: number;
  rating: number;
  totalSales: number;
  totalReviews: number;
  badges: Badge[];
  location: string;
  joinDate: string;
  isVerified: boolean;
  isArtisan: boolean;
  responseTime?: string;
  followerCount: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  buyer: User;
  seller: Seller;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  trackingNumber?: string;
  carrier?: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  xpEarned: number;
}

export interface OrderItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'return-requested'
  | 'returned';

export type PaymentMethod = 'card' | 'cod' | 'apple-pay';

export interface Address {
  id: string;
  name: string;
  phone: string;
  emirate: string;
  area: string;
  street: string;
  building: string;
  apartment?: string;
  landmark?: string;
  isDefault: boolean;
}

// Review Types
export interface Review {
  id: string;
  product: Product;
  buyer: User;
  rating: number;
  text: string;
  photos: string[];
  helpfulCount: number;
  sellerResponse?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  xpEarned: number;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  estimatedXP: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  xpAmount?: number;
  badge?: Badge;
}

export type NotificationType =
  | 'order'
  | 'xp'
  | 'badge'
  | 'level-up'
  | 'streak'
  | 'message'
  | 'price-drop'
  | 'promo';

// Collection Types
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  products: Product[];
  productCount: number;
}

// Message Types
export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: string;
}

// Emirates list for location selection
export const EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
] as const;

export type Emirate = typeof EMIRATES[number];
