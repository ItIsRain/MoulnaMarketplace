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
  badgeCount: number;
  streakDays: number;
  avatar: AvatarConfig;
  location?: string;
  joinDate: string;
  isVerified: boolean;
  kycStatus?: KYCStatus;
  onboardingCompleted?: boolean;
}

export type KYCStatus = 'none' | 'pending' | 'approved' | 'declined' | 'expired' | 'abandoned' | 'in_progress' | 'in_review';

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

export type BadgeCategory = 'engagement' | 'social' | 'seller' | 'streak' | 'seasonal';

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
  description?: string;
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

// Product Seller (lightweight shop info for product responses)
export interface ProductSeller {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  avatarStyle: string;
  avatarSeed?: string;
  logoUrl?: string;
  level: number;
  totalListings: number;
  location?: string;
  isVerified: boolean;
  responseTime?: string;
}

// Product Types
export type ProductStatus = 'active' | 'draft' | 'expired' | 'hidden';
export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';

export interface Product {
  id: string;
  slug: string;
  ownerId: string;
  shopId: string;
  title: string;
  description: string;
  shortDescription?: string;
  category?: string;
  tags: string[];
  images: string[];
  videoUrl?: string;
  priceFils: number;
  compareAtPriceFils?: number;
  costFils?: number;
  sku?: string;
  condition?: ProductCondition;
  variants?: ProductVariant[];
  status: ProductStatus;
  listingDuration?: number;
  expiresAt?: string;
  autoRenew: boolean;
  allowOffers: boolean;
  processingTime?: string;
  meetupPreference?: string;
  isHandmade: boolean;
  customFields?: CustomField[];
  inquiryCount: number;
  viewCount: number;
  xpReward: number;
  seller: ProductSeller;
  badges: ProductBadge[];
  // Derived fields (not stored in DB)
  isTrending: boolean;
  isNew: boolean;
  isSponsored: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface CustomField {
  id: string;
  label: string;
  type: "text" | "boolean" | "select";
  value: string;
  options?: string[];
}

export type ProductBadge = 'trending' | 'new' | 'flash-deal' | 'handmade' | 'top-seller' | 'sponsored';

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

// Shop Types
export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  category?: string;
  avatarStyle: string;
  avatarSeed?: string;
  logoUrl?: string;
  bannerUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
  story?: string;
  storySections: StorySection[];
  milestones: Milestone[];
  coreValues: string[];
  operatingHours: Record<string, string>;
  policies: Record<string, string>;
  branding: Record<string, string>;
  listingPreferences: Record<string, unknown>;
  totalListings: number;
  followerCount: number;
  isVerified: boolean;
  isArtisan: boolean;
  responseTime?: string;
  workshopSections: WorkshopSection[];
  createdAt: string;
  updatedAt: string;
}

export interface StorySection {
  id: string;
  type: 'text' | 'image' | 'quote' | 'video' | 'heading' | 'divider' | 'callout' | 'gallery';
  title?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  author?: string;
  images?: string[];
  icon?: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface WorkshopSection {
  id: string;
  type: 'image' | 'video' | 'gallery' | 'text';
  title?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  images?: string[];
}

// Seller/Shop Types (legacy, used by Product)
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
  totalListings: number;
  badges: Badge[];
  location: string;
  joinDate: string;
  isVerified: boolean;
  isArtisan: boolean;
  responseTime?: string;
  followerCount: number;
}

// Inquiry Types
export interface Inquiry {
  id: string;
  buyer: User;
  seller: Seller;
  listing: Product;
  status: InquiryStatus;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  xpEarned: number;
}

export type InquiryStatus = 'new' | 'replied' | 'archived';

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
  | 'inquiry'
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
