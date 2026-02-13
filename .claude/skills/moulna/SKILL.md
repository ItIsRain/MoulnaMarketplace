---
name: moulna-dev
description: >
  Moulna marketplace development skill for the gamified handmade & social sellers
  marketplace. Activate when writing components, pages, API routes, forms, or any
  code for Moulna. Covers TypeScript strictness, security, accessibility,
  performance, testing, gamification engine, DiceBear avatar system, marketplace
  commerce patterns, seller dashboard, and component architecture standards.
  UAE/GCC-native with AED currency and RTL support.
---

# Moulna Platform Builder — Claude Code SKILL

> **Moulna** — Gamified Handmade & Social Sellers Marketplace
> UAE-focused multi-vendor marketplace with XP, badges, levels, streaks, and DiceBear avatars
> Built with Next.js 15 (App Router), TypeScript (strict), Tailwind CSS 4, shadcn/ui, Framer Motion 12

---

## Table of Contents

1. [Project Bootstrap](#1-project-bootstrap)
2. [Code Quality Hooks](#2-code-quality-hooks)
3. [Security Hooks](#3-security-hooks)
4. [Logic & Runtime Safety Hooks](#4-logic--runtime-safety-hooks)
5. [TypeScript Strictness Hooks](#5-typescript-strictness-hooks)
6. [Accessibility Hooks](#6-accessibility-hooks)
7. [Performance Hooks](#7-performance-hooks)
8. [Component Architecture Rules](#8-component-architecture-rules)
9. [Gamification Engine](#9-gamification-engine)
10. [DiceBear Avatar System](#10-dicebear-avatar-system)
11. [Marketplace Commerce Patterns](#11-marketplace-commerce-patterns)
12. [Seller Dashboard Patterns](#12-seller-dashboard-patterns)
13. [Internationalization & UAE Localization](#13-internationalization--uae-localization)
14. [Testing Hooks](#14-testing-hooks)
15. [Git Hooks & CI Gates](#15-git-hooks--ci-gates)
16. [File-by-File Validation Checklist](#16-file-by-file-validation-checklist)
17. [Implementation Phases](#17-implementation-phases)
18. [Mock Data & Type Safety](#18-mock-data--type-safety)
19. [Error Handling Standards](#19-error-handling-standards)
20. [Environment & Config Safety](#20-environment--config-safety)

---

## 1. Project Bootstrap

### Initial Setup Commands

```bash
# Create project
npx create-next-app@latest moulna --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd moulna

# Core dependencies
npm install framer-motion@^12 zustand @tanstack/react-query@^5 @tanstack/react-table@^8 \
  react-hook-form @hookform/resolvers zod sonner date-fns react-day-picker \
  recharts @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-dropzone \
  react-markdown rehype-highlight rehype-sanitize lucide-react @phosphor-icons/react \
  @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder \
  clsx tailwind-merge class-variance-authority \
  embla-carousel-react react-countup canvas-confetti lottie-react \
  react-qr-code zustand-immer immer

# shadcn/ui — install ALL components
npx shadcn@latest init
npx shadcn@latest add --all

# Dev dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-security eslint-plugin-react-hooks eslint-plugin-jsx-a11y \
  eslint-plugin-import eslint-plugin-no-secrets eslint-plugin-sonarjs \
  prettier prettier-plugin-tailwindcss \
  husky lint-staged commitlint @commitlint/config-conventional \
  vitest @testing-library/react @testing-library/jest-dom \
  @vitejs/plugin-react jsdom \
  typescript-eslint depcheck \
  eslint-plugin-unicorn \
  @types/canvas-confetti
```

### tsconfig.json — Strict Mode (NON-NEGOTIABLE)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": false,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "isolatedModules": true,
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "es2022",
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] },
    "baseUrl": ".",
    "skipLibCheck": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 2. Code Quality Hooks

### ESLint Configuration (`.eslintrc.json`)

Every file MUST pass with zero warnings:

```json
{
  "root": true,
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:security/recommended-legacy",
    "plugin:jsx-a11y/strict",
    "plugin:sonarjs/recommended-legacy",
    "plugin:unicorn/recommended"
  ],
  "plugins": [
    "@typescript-eslint",
    "security",
    "jsx-a11y",
    "sonarjs",
    "no-secrets",
    "unicorn"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-secrets/no-secrets": "error",
    "security/detect-object-injection": "warn",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-possible-timing-attacks": "error",

    "sonarjs/no-duplicate-string": ["warn", { "threshold": 3 }],
    "sonarjs/no-identical-functions": "error",
    "sonarjs/no-collapsible-if": "error",
    "sonarjs/no-redundant-boolean": "error",
    "sonarjs/no-unused-collection": "error",
    "sonarjs/prefer-immediate-return": "error",

    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-non-null-assertion": "error",

    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",

    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-static-element-interactions": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/label-has-associated-control": "error",

    "import/no-duplicates": "error",
    "import/no-cycle": "error",
    "import/no-self-import": "error",

    "unicorn/prevent-abbreviations": "off",
    "unicorn/filename-case": ["error", { "case": "kebabCase", "ignore": ["^\\[.*\\]$"] }],
    "unicorn/no-null": "off",
    "unicorn/prefer-module": "off",
    "unicorn/no-array-reduce": "off"
  },
  "overrides": [
    {
      "files": ["*.test.ts", "*.test.tsx", "*.spec.ts"],
      "rules": {
        "@typescript-eslint/no-unsafe-assignment": "off",
        "sonarjs/no-duplicate-string": "off"
      }
    }
  ]
}
```

### Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["cn", "clsx", "cva"]
}
```

---

## 3. Security Hooks

### HOOK: Pre-Write Security Checklist

Before writing ANY file, verify:

```
□ No hardcoded secrets, API keys, tokens, or passwords
□ No eval(), Function(), or innerHTML with dynamic content
□ No dangerouslySetInnerHTML without DOMPurify/rehype-sanitize
□ All user input validated via Zod schemas BEFORE processing
□ All URL parameters validated and sanitized
□ No direct object property access from user input (bracket notation with validation)
□ All external URLs validated against allowlists
□ No sensitive data in localStorage (tokens in httpOnly cookies)
□ No prototype pollution vectors (Object.create(null) for dictionaries)
□ No open redirects (validate redirect URLs)
□ Price/financial calculations use integer cents (AED fils), NEVER floats
□ Seller input (product descriptions, shop names) is sanitized before render
□ Image uploads validated: file type, size limit, dimensions
□ Cart/checkout amounts validated server-side (never trust client totals)
```

### HOOK: API Route Security Template

Every API route MUST follow this pattern:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  // Strict validation
});

function checkRateLimit(_request: NextRequest): boolean {
  return true; // Implement with upstash/ratelimit in production
}

function getAuthUser(_request: NextRequest) {
  return null; // Extract and validate session
}

export async function POST(request: NextRequest) {
  try {
    if (!checkRateLimit(request)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: unknown = await request.json();
    const result = requestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 },
      );
    }

    const validatedData = result.data;
    return NextResponse.json({ success: true, data: validatedData });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### HOOK: Marketplace-Specific Security

```typescript
// CRITICAL: Financial calculations use integer fils (1 AED = 100 fils)
// NEVER use floating-point for money

// ❌ BAD:
const total = price * quantity; // Floating point errors

// ✅ GOOD:
function calculateTotalFils(priceFils: number, quantity: number): number {
  return Math.round(priceFils * quantity);
}

function filsToAed(fils: number): string {
  return (fils / 100).toFixed(2);
}

function aedToFils(aed: number): number {
  return Math.round(aed * 100);
}

// Display:
function formatAED(fils: number): string {
  return `AED ${filsToAed(fils)}`;
}

// CRITICAL: Server-side cart validation
// NEVER trust client-computed totals
// API MUST recalculate: fetch current prices → multiply → sum → compare
```

### HOOK: XSS Prevention for Seller Content

```typescript
// Seller product descriptions, shop names, and rich text
// ALWAYS sanitize before render

import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

// CORRECT — seller-generated content:
<ReactMarkdown rehypePlugins={[rehypeSanitize]}>
  {product.description}
</ReactMarkdown>

// For Tiptap output, sanitize BOTH on save and on render
// Strip scripts, iframes, event handlers from HTML output

// Product titles and short text: escape HTML entities
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m] ?? m);
}
```

---

## 4. Logic & Runtime Safety Hooks

### HOOK: Exhaustive Pattern Matching

```typescript
function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

// Every status enum MUST have exhaustive switches:
type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':    return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':  return 'bg-blue-100 text-blue-800';
    case 'processing': return 'bg-indigo-100 text-indigo-800';
    case 'shipped':    return 'bg-purple-100 text-purple-800';
    case 'delivered':  return 'bg-green-100 text-green-800';
    case 'cancelled':  return 'bg-red-100 text-red-800';
    case 'returned':   return 'bg-orange-100 text-orange-800';
    default: return assertNever(status);
  }
}
```

### HOOK: Safe Array/Object Access

```typescript
// With noUncheckedIndexedAccess, array access returns T | undefined
// ALWAYS handle the undefined case

// ❌ BAD:
const item = cart.items[index];
item.quantity += 1; // Could crash

// ✅ GOOD:
const item = cart.items[index];
if (item === undefined) {
  throw new Error(`Cart item at index ${index} not found`);
}
item.quantity += 1;
```

### HOOK: Price & Inventory Safety

```typescript
// NEVER allow negative prices or stock
const productPriceSchema = z.number()
  .int('Price must be in fils (integer)')
  .nonnegative('Price cannot be negative')
  .max(100_000_00, 'Price cannot exceed 100,000 AED'); // 100,000 AED in fils

const stockSchema = z.number()
  .int()
  .nonnegative('Stock cannot be negative')
  .max(999_999);

// ALWAYS check stock before adding to cart
function canAddToCart(product: Product, requestedQty: number): boolean {
  return product.stock >= requestedQty && requestedQty > 0;
}

// ALWAYS check stock again at checkout (race condition protection)
// Server-side: SELECT ... FOR UPDATE pattern in real DB
```

### HOOK: Gamification State Safety

```typescript
// XP can NEVER go negative
// Level can NEVER decrease
// Badge once earned can NEVER be un-earned (unless admin action)

function addXP(currentXP: number, earned: number): number {
  if (earned < 0) {
    throw new Error('Cannot add negative XP');
  }
  return currentXP + earned;
}

function calculateLevel(totalXP: number, levels: readonly LevelThreshold[]): number {
  let currentLevel = 1;
  for (const level of levels) {
    if (totalXP >= level.xpRequired) {
      currentLevel = level.level;
    } else {
      break;
    }
  }
  return currentLevel;
}

// Streak logic: timezone-aware (UAE is GMT+4)
function isConsecutiveDay(lastLogin: Date, now: Date): boolean {
  const uaeOffset = 4 * 60; // GMT+4 in minutes
  const lastUAE = new Date(lastLogin.getTime() + uaeOffset * 60 * 1000);
  const nowUAE = new Date(now.getTime() + uaeOffset * 60 * 1000);

  const lastDay = Math.floor(lastUAE.getTime() / (24 * 60 * 60 * 1000));
  const nowDay = Math.floor(nowUAE.getTime() / (24 * 60 * 60 * 1000));

  return nowDay - lastDay === 1;
}
```

### HOOK: Form Validation Safety

```typescript
// ALL forms use react-hook-form + zod
// Schemas shared between client and server

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(20, 'Describe your product in at least 20 characters').max(5000),
  priceFils: z.number().int().positive().max(100_000_00),
  compareAtPriceFils: z.number().int().nonnegative().optional(),
  stock: z.number().int().nonnegative().max(999_999),
  categoryId: z.string().min(1, 'Select a category'),
  isHandmade: z.boolean(),
  weight: z.number().positive().optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags'),
  images: z.array(z.string().url()).min(1, 'At least 1 image required').max(10),
}).refine(
  (data) => !data.compareAtPriceFils || data.compareAtPriceFils > data.priceFils,
  { message: 'Compare-at price must be higher than selling price', path: ['compareAtPriceFils'] },
);

type ProductFormData = z.infer<typeof productSchema>;
```

---

## 5. TypeScript Strictness Hooks

### HOOK: Core Type Definitions

```typescript
// src/lib/types.ts — ALL marketplace types

// ── Branded ID Types ──────────────────────────────
type ProductId = string & { readonly __brand: 'ProductId' };
type ShopId = string & { readonly __brand: 'ShopId' };
type OrderId = string & { readonly __brand: 'OrderId' };
type UserId = string & { readonly __brand: 'UserId' };
type ReviewId = string & { readonly __brand: 'ReviewId' };
type BadgeId = string & { readonly __brand: 'BadgeId' };
type CouponId = string & { readonly __brand: 'CouponId' };
type CategoryId = string & { readonly __brand: 'CategoryId' };

// ── Enums as const objects ────────────────────────
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  OUT_OF_STOCK: 'out_of_stock',
  ARCHIVED: 'archived',
} as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const USER_ROLE = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const;
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const PAYMENT_METHOD = {
  CARD: 'card',
  COD: 'cod',
  APPLE_PAY: 'apple_pay',
} as const;
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

// ── DiceBear Avatar Config ────────────────────────
export interface AvatarConfig {
  readonly style: DiceBearStyle;
  readonly seed: string;
  readonly backgroundColor: string;
  readonly accessories?: string[];
}

export const DICEBEAR_STYLES = [
  'adventurer', 'adventurer-neutral', 'bottts', 'thumbs',
  'lorelei', 'lorelei-neutral', 'avataaars', 'avataaars-neutral',
  'big-ears', 'big-ears-neutral', 'micah', 'open-peeps',
  'personas', 'notionists', 'notionists-neutral', 'fun-emoji',
  'pixel-art', 'pixel-art-neutral',
] as const;
export type DiceBearStyle = (typeof DICEBEAR_STYLES)[number];

// ── Gamification Types ────────────────────────────
export interface LevelThreshold {
  readonly level: number;
  readonly title: string;
  readonly xpRequired: number;
  readonly color: string;
  readonly unlockedAvatarStyles?: readonly DiceBearStyle[];
}

export interface Badge {
  readonly id: BadgeId;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly category: BadgeCategory;
  readonly xpReward: number;
}

export const BADGE_CATEGORY = {
  SHOPPING: 'shopping',
  SOCIAL: 'social',
  SELLER: 'seller',
  STREAK: 'streak',
  SEASONAL: 'seasonal',
} as const;
export type BadgeCategory = (typeof BADGE_CATEGORY)[keyof typeof BADGE_CATEGORY];

export interface UserGamification {
  readonly xp: number;
  readonly level: number;
  readonly levelTitle: string;
  readonly badges: readonly BadgeId[];
  readonly loginStreak: number;
  readonly purchaseStreak: number;
  readonly reviewStreak: number;
  readonly lastLoginDate: string;
  readonly dailyChallenges: readonly DailyChallenge[];
  readonly xpHistory: readonly XPTransaction[];
}

export interface DailyChallenge {
  readonly id: string;
  readonly task: string;
  readonly xpReward: number;
  readonly icon: string;
  readonly completed: boolean;
}

export interface XPTransaction {
  readonly id: string;
  readonly action: string;
  readonly xpEarned: number;
  readonly timestamp: string;
  readonly runningTotal: number;
}

// ── Core Entity Types ─────────────────────────────
export interface User {
  readonly id: UserId;
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly phone?: string;
  readonly role: UserRole;
  readonly avatar: AvatarConfig;
  readonly gamification: UserGamification;
  readonly emirate?: Emirate;
  readonly joinDate: string;
  readonly isVerified: boolean;
}

export const EMIRATES = [
  'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman',
  'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah',
] as const;
export type Emirate = (typeof EMIRATES)[number];

export interface Shop {
  readonly id: ShopId;
  readonly ownerId: UserId;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly story?: string;
  readonly avatar: AvatarConfig;
  readonly banner?: string;
  readonly logo?: string;
  readonly rating: number;
  readonly totalReviews: number;
  readonly totalSales: number;
  readonly level: number;
  readonly xp: number;
  readonly badges: readonly BadgeId[];
  readonly location?: Emirate;
  readonly joinDate: string;
  readonly isVerifiedArtisan: boolean;
  readonly categories: readonly CategoryId[];
  readonly socialLinks?: ShopSocialLinks;
}

export interface ShopSocialLinks {
  readonly instagram?: string;
  readonly whatsapp?: string;
  readonly website?: string;
}

export interface Product {
  readonly id: ProductId;
  readonly shopId: ShopId;
  readonly title: string;
  readonly slug: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly images: readonly string[];
  readonly priceFils: number;
  readonly compareAtPriceFils?: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly stock: number;
  readonly categoryId: CategoryId;
  readonly subcategoryId?: CategoryId;
  readonly tags: readonly string[];
  readonly isHandmade: boolean;
  readonly isTrending: boolean;
  readonly isNew: boolean;
  readonly status: ProductStatus;
  readonly variants?: readonly ProductVariant[];
  readonly weight?: number;
  readonly dimensions?: ProductDimensions;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ProductVariant {
  readonly id: string;
  readonly name: string;
  readonly options: readonly VariantOption[];
}

export interface VariantOption {
  readonly value: string;
  readonly priceFils?: number;
  readonly stock?: number;
  readonly image?: string;
}

export interface ProductDimensions {
  readonly length: number;
  readonly width: number;
  readonly height: number;
  readonly unit: 'cm' | 'in';
}

export interface Category {
  readonly id: CategoryId;
  readonly name: string;
  readonly nameAr: string;
  readonly slug: string;
  readonly icon: string;
  readonly image?: string;
  readonly parentId?: CategoryId;
  readonly productCount: number;
}

export interface Order {
  readonly id: OrderId;
  readonly buyerId: UserId;
  readonly sellerId: UserId;
  readonly shopId: ShopId;
  readonly items: readonly OrderItem[];
  readonly status: OrderStatus;
  readonly subtotalFils: number;
  readonly shippingFils: number;
  readonly discountFils: number;
  readonly totalFils: number;
  readonly paymentMethod: PaymentMethod;
  readonly shippingAddress: Address;
  readonly trackingNumber?: string;
  readonly trackingCarrier?: string;
  readonly couponCode?: string;
  readonly notes?: string;
  readonly xpEarned: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OrderItem {
  readonly productId: ProductId;
  readonly title: string;
  readonly image: string;
  readonly variantLabel?: string;
  readonly quantity: number;
  readonly priceFils: number;
}

export interface Address {
  readonly fullName: string;
  readonly phone: string;
  readonly emirate: Emirate;
  readonly area: string;
  readonly street: string;
  readonly building: string;
  readonly apartment?: string;
  readonly landmark?: string;
}

export interface Review {
  readonly id: ReviewId;
  readonly productId: ProductId;
  readonly buyerId: UserId;
  readonly buyerName: string;
  readonly buyerAvatar: AvatarConfig;
  readonly buyerLevel: number;
  readonly rating: number;
  readonly text: string;
  readonly photos: readonly string[];
  readonly helpfulCount: number;
  readonly sellerResponse?: string;
  readonly isVerifiedPurchase: boolean;
  readonly createdAt: string;
}

export interface CartItem {
  readonly productId: ProductId;
  readonly shopId: ShopId;
  readonly quantity: number;
  readonly selectedVariant?: string;
}

export interface Notification {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly message: string;
  readonly link?: string;
  readonly isRead: boolean;
  readonly createdAt: string;
  readonly xpAmount?: number;
}

export const NOTIFICATION_TYPE = {
  ORDER_UPDATE: 'order_update',
  XP_EARNED: 'xp_earned',
  BADGE_UNLOCKED: 'badge_unlocked',
  LEVEL_UP: 'level_up',
  STREAK_WARNING: 'streak_warning',
  PRICE_DROP: 'price_drop',
  NEW_REVIEW: 'new_review',
  SELLER_RESPONSE: 'seller_response',
  FLASH_SALE: 'flash_sale',
  NEW_FOLLOWER: 'new_follower',
  CHALLENGE_COMPLETE: 'challenge_complete',
  PAYOUT: 'payout',
} as const;
export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

// ── API Response Types ────────────────────────────
interface ApiSuccess<T> {
  readonly success: true;
  readonly data: T;
}

interface ApiError {
  readonly success: false;
  readonly error: string;
  readonly details?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Paginated Response ────────────────────────────
export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly hasMore: boolean;
}
```

### HOOK: Component Prop Types

```typescript
// ALL components MUST have explicit readonly prop interfaces
// NEVER use React.FC

interface ProductCardProps {
  readonly product: Product;
  readonly seller?: Shop;
  readonly variant?: 'default' | 'compact' | 'horizontal';
  readonly showXPPreview?: boolean;
  readonly onAddToCart?: (productId: ProductId) => void;
  readonly onWishlistToggle?: (productId: ProductId) => void;
  readonly className?: string;
}

function ProductCard({
  product,
  seller,
  variant = 'default',
  showXPPreview = true,
  onAddToCart,
  onWishlistToggle,
  className,
}: ProductCardProps) {
  // Implementation
}
```

---

## 6. Accessibility Hooks

### HOOK: Component A11y Checklist

Every component MUST satisfy:

```
□ All interactive elements are focusable
□ All images have meaningful alt text (product images: "{title} - {category}")
□ All form inputs have associated labels
□ Color is never the ONLY indicator (badges have icons + text, not just color)
□ Contrast ratio ≥ 4.5:1 for text
□ Focus indicators visible (never outline-none without replacement)
□ Modals trap focus and return focus on close
□ aria-label on icon-only buttons ("Add to cart", "Add to wishlist")
□ aria-live regions for: cart count updates, XP popups, search results count
□ Star ratings: aria-label="Rated {n} out of 5 stars"
□ Price: aria-label="Price: {amount} AED" (screen readers read numbers oddly)
□ Badge unlock notifications: aria-live="assertive"
□ Product image galleries: arrow key navigation + aria-roledescription
□ Skip nav link at top of every page
□ Heading hierarchy is logical (never skip levels)
□ RTL support: dir="rtl" on <html> when Arabic is selected
```

### HOOK: Marketplace-Specific A11y

```typescript
// Price display: always include aria-label for screen readers
function PriceDisplay({ priceFils, compareAtPriceFils }: PriceDisplayProps) {
  const price = filsToAed(priceFils);
  const hasDiscount = compareAtPriceFils && compareAtPriceFils > priceFils;

  return (
    <div aria-label={`Price: ${price} AED${hasDiscount ? ', on sale' : ''}`}>
      <span className="text-lg font-bold">AED {price}</span>
      {hasDiscount && (
        <span className="ml-2 text-sm text-muted-foreground line-through" aria-hidden="true">
          AED {filsToAed(compareAtPriceFils)}
        </span>
      )}
    </div>
  );
}

// Star rating: accessible
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars, ${count} reviews`}
    >
      {/* Visual stars */}
    </div>
  );
}

// Cart button: announce count changes
function CartIcon({ count }: { count: number }) {
  return (
    <>
      <button aria-label={`Shopping cart, ${count} items`}>
        {/* Icon */}
        {count > 0 && <span aria-hidden="true">{count}</span>}
      </button>
      <div role="status" aria-live="polite" className="sr-only">
        {count} items in cart
      </div>
    </>
  );
}
```

---

## 7. Performance Hooks

### HOOK: Performance Rules

```
□ Product grids > 20 items use virtualization (@tanstack/react-virtual)
□ All product images use next/image with width, height, blur placeholder
□ Heavy components lazy loaded: Tiptap, Charts, Maps, Monaco
□ Search input debounced (300ms)
□ Product image carousels use Embla with lazy loading
□ Cart state persisted to localStorage (offline-capable)
□ Skeleton loaders match exact layout of loaded content
□ Prefetch category pages and product pages on hover
□ DiceBear avatar URLs are deterministic (same seed = same image, cacheable)
□ No blocking operations in render path
□ Bundle: no single page JS > 200KB gzipped
```

### HOOK: DiceBear Avatar Caching

```typescript
// DiceBear URLs are deterministic — cache aggressively
// Build URL once, reuse everywhere

function getDiceBearUrl(config: AvatarConfig, size = 128): string {
  const params = new URLSearchParams({
    seed: config.seed,
    backgroundColor: config.backgroundColor.replace('#', ''),
    size: String(size),
  });
  return `https://api.dicebear.com/9.x/${config.style}/svg?${params.toString()}`;
}

// Use next/image with the URL for caching:
<Image
  src={getDiceBearUrl(user.avatar)}
  alt={`${user.name}'s avatar`}
  width={48}
  height={48}
  className="rounded-full"
  unoptimized  // SVGs don't need optimization
/>
```

### HOOK: Data Fetching Pattern

```typescript
// TanStack Query for ALL server state
// Query keys centralized and typed

const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters: ProductFilters) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    byShop: (shopId: string) => ['products', 'shop', shopId] as const,
    trending: ['products', 'trending'] as const,
  },
  shops: {
    all: ['shops'] as const,
    detail: (slug: string) => ['shops', 'detail', slug] as const,
  },
  cart: {
    items: ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    seller: ['orders', 'seller'] as const,
  },
  reviews: {
    byProduct: (productId: string) => ['reviews', 'product', productId] as const,
    byShop: (shopId: string) => ['reviews', 'shop', shopId] as const,
  },
  gamification: {
    profile: ['gamification', 'profile'] as const,
    badges: ['gamification', 'badges'] as const,
    leaderboard: (type: string, period: string) =>
      ['gamification', 'leaderboard', type, period] as const,
    challenges: ['gamification', 'challenges'] as const,
  },
  user: {
    profile: ['user', 'profile'] as const,
    notifications: ['user', 'notifications'] as const,
    wishlist: ['user', 'wishlist'] as const,
  },
} as const;

// Optimistic add-to-wishlist
function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: ProductId) => toggleWishlistApi(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.user.wishlist });
      const previous = queryClient.getQueryData<ProductId[]>(queryKeys.user.wishlist);
      queryClient.setQueryData<ProductId[]>(queryKeys.user.wishlist, (old = []) =>
        old.includes(productId)
          ? old.filter((id) => id !== productId)
          : [...old, productId],
      );
      return { previous };
    },
    onError: (_err, _productId, context) => {
      queryClient.setQueryData(queryKeys.user.wishlist, context?.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.wishlist });
    },
  });
}
```

---

## 8. Component Architecture Rules

### HOOK: File Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth pages
│   ├── (marketing)/              # Public marketing pages
│   ├── explore/                  # Browse products, categories
│   ├── products/[productId]/     # Product detail
│   ├── shops/[shopSlug]/         # Shop storefront
│   ├── cart/                     # Cart & checkout
│   ├── checkout/                 # Checkout flow
│   ├── dashboard/                # Buyer dashboard
│   ├── seller/                   # Seller dashboard
│   ├── admin/                    # Admin panel
│   ├── profile/[username]/       # Public profiles
│   └── api/                      # API routes
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Navbar, Sidebars, Footer, PageHeader
│   ├── gamification/             # XPBar, LevelBadge, BadgeCard, StreakCounter, etc.
│   ├── avatar/                   # DiceBearAvatar, AvatarWithLevel, AvatarCustomizer
│   ├── product/                  # ProductCard, ImageGallery, VariantSelector, etc.
│   ├── shop/                     # ShopCard, ShopHeader, SellerBadge
│   ├── order/                    # OrderCard, OrderTimeline, TrackingInfo
│   ├── review/                   # ReviewCard, ReviewForm, RatingSummary
│   ├── cart/                     # CartItem, CartSummary, EmptyCart
│   ├── forms/                    # FormField, ImageUpload, PriceInput, etc.
│   ├── data/                     # DataTable, StatsCard, EmptyState, Skeleton
│   ├── dialogs/                  # All 45 dialog components
│   ├── feedback/                 # StatusBadge, ProgressSteps, CountdownTimer
│   └── special/                  # CommandPalette, ThemeToggle, ShareButton, QRCode
├── hooks/
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   ├── use-local-storage.ts
│   ├── use-xp-animation.ts      # XP popup trigger hook
│   ├── use-gamification.ts       # XP earning, badge check, streak logic
│   ├── use-cart.ts               # Cart state management
│   └── use-auth.ts               # Auth state hook
├── lib/
│   ├── types.ts                  # ALL TypeScript types (see section 5)
│   ├── constants.ts              # Gamification constants, categories, etc.
│   ├── utils.ts                  # cn(), formatAED(), slugify(), etc.
│   ├── validations.ts            # All Zod schemas
│   ├── mock-data.ts              # Comprehensive mock data
│   ├── query-keys.ts             # TanStack Query keys
│   ├── api.ts                    # API client functions
│   ├── gamification.ts           # XP calculation, level logic, badge checks
│   └── dicebear.ts              # Avatar URL builder, style unlocking
├── providers/
│   ├── auth-provider.tsx
│   ├── query-provider.tsx
│   ├── theme-provider.tsx
│   ├── cart-provider.tsx
│   └── gamification-provider.tsx  # XP state, badge checks, streak tracking
└── styles/
    └── globals.css
```

### HOOK: Server vs Client Component Split

```typescript
// DEFAULT: Server Components for data display
// "use client" ONLY for: forms, interactivity, browser APIs, animations

// ✅ Server Component (product listing page):
// app/explore/page.tsx
import { ProductGrid } from '@/components/product/product-grid';
async function ExplorePage() {
  const products = await getProducts(); // Server fetch
  return <ProductGrid products={products} />;
}

// ✅ Client Component (only the interactive parts):
// components/product/add-to-cart-button.tsx
'use client';
function AddToCartButton({ productId }: { productId: ProductId }) {
  // Client-side cart state, animation, XP popup
}

// ❌ NEVER: Entire page as "use client" just for one button
```

### HOOK: Utility Functions

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filsToAed(fils: number): string {
  return (fils / 100).toFixed(2);
}

export function formatAED(fils: number): string {
  return `AED ${filsToAed(fils)}`;
}

export function aedToFils(aed: number): number {
  return Math.round(aed * 100);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-AE').format(num);
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

export function formatRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = date.getTime() - Date.now();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (Math.abs(days) < 1) {
    const hours = Math.round(diff / (1000 * 60 * 60));
    return rtf.format(hours, 'hour');
  }
  if (Math.abs(days) < 30) return rtf.format(days, 'day');
  return rtf.format(Math.round(days / 30), 'month');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getDiscountPercentage(priceFils: number, compareAtFils: number): number {
  if (compareAtFils <= priceFils) return 0;
  return Math.round(((compareAtFils - priceFils) / compareAtFils) * 100);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
```

---

## 9. Gamification Engine

### HOOK: Constants (`src/lib/constants.ts`)

```typescript
// ── XP Reward Table ────────────────────────────────
export const BUYER_XP_REWARDS = {
  SIGN_UP: 100,
  COMPLETE_PROFILE: 200,
  FIRST_PURCHASE: 300,
  PURCHASE: 50,            // per order
  LEAVE_REVIEW: 50,
  REVIEW_WITH_PHOTO: 100,
  ADD_TO_WISHLIST: 5,
  SHARE_PRODUCT: 20,
  REFER_FRIEND: 500,
  DAILY_LOGIN: 10,
  STREAK_7_BONUS: 100,
  STREAK_30_BONUS: 500,
  FOLLOW_SELLER: 10,
  HELPFUL_REVIEW_VOTE: 15,
  BIRTHDAY_BONUS: 200,
  FIRST_IN_CATEGORY: 150,
} as const;

export const SELLER_XP_REWARDS = {
  OPEN_SHOP: 500,
  FIRST_LISTING: 100,
  REACH_10_LISTINGS: 300,
  REACH_50_LISTINGS: 1000,
  FIRST_SALE: 500,
  REACH_10_SALES: 800,
  REACH_100_SALES: 3000,
  FIVE_STAR_REVIEW: 100,
  SHIP_WITHIN_24H: 50,
  ZERO_CANCELLATIONS_30D: 300,
  COMPLETE_SHOP_PROFILE: 200,
  ADD_SHOP_STORY: 150,
  FEATURED_PRODUCT: 500,
  DAILY_ACTIVE: 10,
} as const;

// ── Level Thresholds ──────────────────────────────
export const LEVELS: readonly LevelThreshold[] = [
  { level: 1,  title: 'Newcomer',     xpRequired: 0,      color: '#94a3b8' },
  { level: 2,  title: 'Explorer',     xpRequired: 500,    color: '#60a5fa' },
  { level: 3,  title: 'Regular',      xpRequired: 1500,   color: '#34d399' },
  { level: 4,  title: 'Enthusiast',   xpRequired: 3500,   color: '#a78bfa' },
  { level: 5,  title: 'Connoisseur',  xpRequired: 7000,   color: '#f472b6' },
  { level: 6,  title: 'Trendsetter',  xpRequired: 12000,  color: '#fb923c' },
  { level: 7,  title: 'Tastemaker',   xpRequired: 20000,  color: '#facc15' },
  { level: 8,  title: 'Elite',        xpRequired: 35000,  color: '#f43f5e' },
  { level: 9,  title: 'Legend',        xpRequired: 60000,  color: '#e11d48' },
  { level: 10, title: 'Patron',       xpRequired: 100000, color: '#fbbf24' },
] as const;

// ── Avatar Style Unlocks ──────────────────────────
export const AVATAR_STYLE_UNLOCKS: Record<number, readonly DiceBearStyle[]> = {
  1: ['adventurer', 'adventurer-neutral', 'bottts', 'thumbs'],
  3: ['lorelei', 'lorelei-neutral', 'avataaars', 'avataaars-neutral'],
  5: ['big-ears', 'big-ears-neutral', 'micah', 'open-peeps'],
  7: ['personas', 'notionists', 'notionists-neutral', 'fun-emoji'],
  10: ['pixel-art', 'pixel-art-neutral'],
};

// ── Badge Definitions ─────────────────────────────
// Full badge list with 40+ badges across 5 categories
// See prompt document for complete badge definitions
// Each badge: { id, name, icon, description, category, xpReward, unlockCriteria }

// ── Daily Challenge Templates ─────────────────────
export const DAILY_CHALLENGE_TEMPLATES = [
  { id: 'browse_3',      task: 'Browse 3 different categories',    xp: 30,  icon: '👀' },
  { id: 'add_wishlist',  task: 'Add 2 items to your wishlist',     xp: 20,  icon: '❤️' },
  { id: 'leave_review',  task: 'Leave a review on a past order',   xp: 50,  icon: '✍️' },
  { id: 'share_product', task: 'Share a product on social media',  xp: 25,  icon: '📤' },
  { id: 'follow_seller', task: 'Follow a new seller',              xp: 15,  icon: '➕' },
  { id: 'first_purchase', task: 'Make a purchase today',           xp: 75,  icon: '🛒' },
  { id: 'list_product',  task: 'List a new product',               xp: 40,  icon: '📦' },
  { id: 'respond_msg',   task: 'Respond to a customer message',    xp: 20,  icon: '💬' },
] as const;

// ── Product Categories ────────────────────────────
export const CATEGORIES = [
  { id: 'cat_jewelry',      name: 'Handmade Jewelry',      nameAr: 'مجوهرات يدوية',     icon: '💍' },
  { id: 'cat_home',         name: 'Home Décor',            nameAr: 'ديكور منزلي',       icon: '🏠' },
  { id: 'cat_calligraphy',  name: 'Arabic Calligraphy',    nameAr: 'خط عربي',           icon: '🖋️' },
  { id: 'cat_perfume',      name: 'Perfumes & Oud',        nameAr: 'عطور وعود',         icon: '🌸' },
  { id: 'cat_fashion',      name: 'Fashion & Clothing',    nameAr: 'أزياء وملابس',      icon: '👗' },
  { id: 'cat_food',         name: 'Food & Sweets',         nameAr: 'طعام وحلويات',      icon: '🍯' },
  { id: 'cat_art',          name: 'Art & Prints',          nameAr: 'فنون ومطبوعات',     icon: '🎨' },
  { id: 'cat_baby',         name: 'Baby & Kids',           nameAr: 'أطفال ورضع',        icon: '🧸' },
  { id: 'cat_beauty',       name: 'Wellness & Beauty',     nameAr: 'صحة وجمال',         icon: '✨' },
  { id: 'cat_gifts',        name: 'Gifts & Occasions',     nameAr: 'هدايا ومناسبات',    icon: '🎁' },
  { id: 'cat_tech',         name: 'Tech Accessories',      nameAr: 'إكسسوارات تقنية',   icon: '📱' },
  { id: 'cat_custom',       name: 'Custom & Personalized', nameAr: 'مخصص وشخصي',       icon: '✂️' },
] as const;
```

### HOOK: Gamification Logic (`src/lib/gamification.ts`)

```typescript
import type { LevelThreshold, Badge, BadgeId, UserGamification } from './types';
import { LEVELS, AVATAR_STYLE_UNLOCKS } from './constants';

export function calculateLevel(xp: number): LevelThreshold {
  let current = LEVELS[0]!;
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getXPToNextLevel(xp: number): { current: number; next: number; progress: number } {
  const currentLevel = calculateLevel(xp);
  const currentIdx = LEVELS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = LEVELS[currentIdx + 1];

  if (!nextLevel) {
    return { current: xp, next: xp, progress: 100 }; // Max level
  }

  const xpIntoLevel = xp - currentLevel.xpRequired;
  const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));

  return { current: xpIntoLevel, next: xpNeeded, progress };
}

export function getUnlockedAvatarStyles(level: number): DiceBearStyle[] {
  const styles: DiceBearStyle[] = [];
  for (const [unlockLevel, levelStyles] of Object.entries(AVATAR_STYLE_UNLOCKS)) {
    if (level >= Number(unlockLevel)) {
      styles.push(...levelStyles);
    }
  }
  return styles;
}

export function checkLevelUp(
  oldXP: number,
  newXP: number,
): { leveledUp: boolean; newLevel?: LevelThreshold; oldLevel: LevelThreshold } {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);
  return {
    leveledUp: newLevel.level > oldLevel.level,
    newLevel: newLevel.level > oldLevel.level ? newLevel : undefined,
    oldLevel,
  };
}

export function selectDailyChallenges(
  templates: readonly DailyChallengeTemplate[],
  userRole: 'buyer' | 'seller',
  seed: string, // date string for deterministic selection
): DailyChallengeTemplate[] {
  // Filter by role, then deterministically pick 3
  const eligible = templates.filter((t) =>
    userRole === 'seller' || !['list_product', 'respond_msg'].includes(t.id),
  );

  // Seeded random using date for consistency per day
  const hash = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shuffled = [...eligible].sort((a, b) => {
    const ha = hash * a.id.length;
    const hb = hash * b.id.length;
    return ha - hb;
  });

  return shuffled.slice(0, 3);
}
```

### HOOK: Gamification Provider

```typescript
// src/providers/gamification-provider.tsx
'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface GamificationState {
  xp: number;
  level: number;
  badges: BadgeId[];
  loginStreak: number;
  pendingXPPopups: Array<{ id: string; amount: number; action: string }>;

  earnXP: (amount: number, action: string) => void;
  unlockBadge: (badgeId: BadgeId) => void;
  dismissXPPopup: (id: string) => void;
  incrementStreak: () => void;
}

// This Zustand store powers all gamification UI
// XP popups are queued and displayed by a global XPPopupRenderer component
```

---

## 10. DiceBear Avatar System

### HOOK: Avatar Utility (`src/lib/dicebear.ts`)

```typescript
import type { AvatarConfig, DiceBearStyle } from './types';

const DICEBEAR_BASE = 'https://api.dicebear.com/9.x';

export function buildAvatarUrl(config: AvatarConfig, size = 128): string {
  const params = new URLSearchParams({
    seed: config.seed,
    size: String(size),
    backgroundColor: config.backgroundColor.replace('#', ''),
  });
  return `${DICEBEAR_BASE}/${config.style}/svg?${params.toString()}`;
}

export function generateDefaultAvatar(username: string): AvatarConfig {
  return {
    style: 'adventurer',
    seed: username,
    backgroundColor: '#e2e8f0',
  };
}

// Avatar styles locked behind levels:
export function isStyleUnlocked(style: DiceBearStyle, userLevel: number): boolean {
  for (const [level, styles] of Object.entries(AVATAR_STYLE_UNLOCKS)) {
    if (styles.includes(style)) {
      return userLevel >= Number(level);
    }
  }
  return false;
}
```

### HOOK: Avatar Components

```typescript
// components/avatar/dicebear-avatar.tsx
// Renders a DiceBear avatar with optional level ring

// components/avatar/avatar-with-level.tsx
// Combines: DiceBear image + circular progress ring (XP to next level)
// + level number badge overlay (bottom-right)
// Used everywhere a user is displayed: reviews, shop headers, leaderboards

// components/avatar/avatar-customizer.tsx
// Full-page avatar studio:
// - Style grid (locked styles show level requirement + lock icon)
// - Seed text input (changes generated look in real-time)
// - Background color picker (swatches)
// - Live large preview
// - "Randomize" button
// - "Save" button
```

---

## 11. Marketplace Commerce Patterns

### HOOK: Cart State Management

```typescript
// Cart uses Zustand + localStorage persistence
// Grouped by seller (multi-vendor cart)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: ProductId) => void;
  updateQuantity: (productId: ProductId, quantity: number) => void;
  clearCart: () => void;
  getItemsBySeller: () => Map<ShopId, CartItem[]>;
  getTotalItems: () => number;
  // Note: totals calculated at render time from current product prices
  // NEVER store computed totals (prices can change)
}

const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.selectedVariant === item.selectedVariant,
          );
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            state.items.push(item);
          }
        }),
      removeItem: (productId) =>
        set((state) => {
          state.items = state.items.filter((i) => i.productId !== productId);
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.productId === productId);
          if (item) {
            item.quantity = Math.max(1, quantity);
          }
        }),
      clearCart: () => set((state) => { state.items = []; }),
      getItemsBySeller: () => {
        const grouped = new Map<ShopId, CartItem[]>();
        for (const item of get().items) {
          const existing = grouped.get(item.shopId) ?? [];
          existing.push(item);
          grouped.set(item.shopId, existing);
        }
        return grouped;
      },
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    })),
    { name: 'moulna-cart' },
  ),
);
```

### HOOK: Checkout Flow Pattern

```typescript
// Multi-step checkout with progress bar:
// Step 1: Shipping Address → Step 2: Payment → Step 3: Review → Success

// CRITICAL: At Step 3 (Review), re-validate:
// 1. All products still in stock
// 2. Prices haven't changed
// 3. Shipping rates current
// 4. Coupon still valid
// Display warning if anything changed

// On success:
// 1. Clear cart
// 2. Show order confirmation
// 3. Award XP (animated counter + confetti if first purchase)
// 4. Check for badge unlocks
// 5. Update purchase streak
```

### HOOK: Product Filtering Pattern

```typescript
// Product filters are URL-state driven (shareable URLs)
// Use Next.js searchParams, not component state

interface ProductFilters {
  readonly category?: string;
  readonly subcategory?: string;
  readonly minPrice?: number;       // in fils
  readonly maxPrice?: number;       // in fils
  readonly rating?: number;         // minimum stars
  readonly emirate?: Emirate;
  readonly isHandmade?: boolean;
  readonly isOnSale?: boolean;
  readonly isFreeShipping?: boolean;
  readonly sellerLevel?: number;    // minimum seller level
  readonly sort?: 'trending' | 'newest' | 'price_asc' | 'price_desc' | 'top_rated' | 'most_sold';
  readonly view?: 'grid' | 'list';
  readonly page?: number;
  readonly q?: string;              // search query
}

// Serialize to/from URL searchParams
// Every filter change updates the URL (useRouter.push with shallow)
// This makes filters bookmarkable and shareable
```

---

## 12. Seller Dashboard Patterns

### HOOK: Seller Onboarding Wizard

```typescript
// 5-step guided wizard with persistent progress
// Each step shows XP reward and checks completion

const ONBOARDING_STEPS = [
  { id: 'name',     label: 'Name Your Shop',       xp: 100 },
  { id: 'story',    label: 'Tell Your Story',       xp: 100 },
  { id: 'branding', label: 'Set Up Branding',       xp: 100 },
  { id: 'product',  label: 'Add First Product',     xp: 100 },
  { id: 'shipping', label: 'Configure Shipping',    xp: 100 },
] as const;

// Persist step progress to localStorage
// Show completion percentage in seller sidebar until done
// Award total 500 XP + "Shop Owner" badge on completion
```

### HOOK: Seller Analytics Components

```typescript
// Every seller analytics page follows this pattern:
// 1. Date range selector (7d / 30d / 90d / 1y / custom)
// 2. Key metric cards (4 across) with sparklines
// 3. Main chart (Recharts line/bar)
// 4. Breakdown table (TanStack Table, sortable)

// Chart components are lazy-loaded:
const SalesChart = dynamic(() => import('@/components/charts/sales-chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
```

### HOOK: Order Fulfillment Flow

```typescript
// Seller order actions follow strict status transitions:
// Pending → Confirmed → Processing → Shipped → (auto) Delivered
//                    ↘ Cancelled
//                                              ↘ Returned

// Each transition has:
// 1. Confirmation dialog
// 2. Required fields (e.g., tracking number for "Shipped")
// 3. Buyer notification trigger
// 4. XP award check (e.g., "Shipped within 24h" bonus)
// 5. Optimistic UI update with rollback on error
```

---

## 13. Internationalization & UAE Localization

### HOOK: RTL Support

```typescript
// All layouts MUST work in both LTR and RTL
// Use logical CSS properties (Tailwind supports this):

// ✅ GOOD (works in both directions):
className="ms-4"     // margin-inline-start
className="me-4"     // margin-inline-end
className="ps-4"     // padding-inline-start
className="pe-4"     // padding-inline-end
className="text-start"
className="text-end"
className="start-0"  // instead of "left-0"
className="end-0"    // instead of "right-0"

// ❌ BAD (breaks in RTL):
className="ml-4"
className="text-left"
className="left-0"

// HTML dir attribute:
// <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>

// For icons that should flip in RTL (arrows, chevrons):
className="rtl:rotate-180"
```

### HOOK: Currency & Number Formatting

```typescript
// ALWAYS use AED, never USD
// ALWAYS format with proper locale

function formatAED(fils: number): string {
  return `AED ${(fils / 100).toFixed(2)}`;
}

// For Arabic display:
function formatAEDArabic(fils: number): string {
  return `${(fils / 100).toFixed(2)} د.إ`;
}

// Phone numbers: UAE format +971 XX XXX XXXX
const UAE_PHONE_REGEX = /^\+971[0-9]{9}$/;
```

### HOOK: Date/Time with UAE Timezone

```typescript
// UAE timezone: Asia/Dubai (GMT+4, no DST)
import { format, parseISO } from 'date-fns';

const UAE_TIMEZONE = 'Asia/Dubai';

function formatDateUAE(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'dd MMM yyyy, hh:mm a');
  // In production: use date-fns-tz for proper timezone conversion
}
```

---

## 14. Testing Hooks

### HOOK: Test Requirements

```
□ Every utility in lib/ has unit tests
□ Every Zod schema has validation tests (valid + invalid)
□ Gamification logic: XP calculation, level-up, badge unlock, streak logic
□ Price calculations: fils/AED conversion, discount %, cart totals
□ DiceBear URL builder: correct URL format, style unlocking
□ Cart store: add, remove, update quantity, group by seller
□ Critical components render without errors (smoke tests)
□ Accessibility: key components tested via jest-axe
```

### HOOK: Gamification Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { calculateLevel, getXPToNextLevel, checkLevelUp } from '../gamification';

describe('calculateLevel', () => {
  it('returns Newcomer for 0 XP', () => {
    expect(calculateLevel(0).title).toBe('Newcomer');
  });

  it('returns Explorer at 500 XP', () => {
    expect(calculateLevel(500).title).toBe('Explorer');
  });

  it('returns Patron at 100000 XP', () => {
    expect(calculateLevel(100_000).title).toBe('Patron');
  });

  it('stays at current level just below threshold', () => {
    expect(calculateLevel(499).title).toBe('Newcomer');
    expect(calculateLevel(1499).title).toBe('Explorer');
  });
});

describe('checkLevelUp', () => {
  it('detects level up from 400 to 600 XP', () => {
    const result = checkLevelUp(400, 600);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel?.title).toBe('Explorer');
  });

  it('no level up within same level', () => {
    const result = checkLevelUp(100, 300);
    expect(result.leveledUp).toBe(false);
  });
});
```

### HOOK: Price Calculation Tests

```typescript
describe('price utilities', () => {
  it('converts fils to AED', () => {
    expect(filsToAed(1500)).toBe('15.00');
    expect(filsToAed(99)).toBe('0.99');
    expect(filsToAed(0)).toBe('0.00');
  });

  it('formats AED correctly', () => {
    expect(formatAED(5000)).toBe('AED 50.00');
  });

  it('calculates discount percentage', () => {
    expect(getDiscountPercentage(8000, 10000)).toBe(20);
    expect(getDiscountPercentage(10000, 10000)).toBe(0);
  });
});
```

### Vitest Configuration

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', 'src/components/ui/'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

---

## 15. Git Hooks & CI Gates

### Husky + lint-staged

```bash
npx husky init
```

### `lint-staged.config.mjs`

```javascript
export default {
  '*.{ts,tsx}': [
    'eslint --fix --max-warnings 0',
    'prettier --write',
    () => 'tsc --noEmit',
  ],
  '*.css': ['prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
```

### Commit Convention

```typescript
// commitlint.config.ts
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert',
    ]],
    'subject-max-length': [2, 'always', 72],
  },
};
```

---

## 16. File-by-File Validation Checklist

### HOOK: Before Saving ANY File

```
═══════════════════════════════════════════════════
  MOULNA FILE VALIDATION GATE
═══════════════════════════════════════════════════

📁 FILE: [filename]

STRUCTURE
  □ Correct directory per project structure
  □ kebab-case filename
  □ Single responsibility
  □ Imports organized: external → internal → types → styles

TYPESCRIPT
  □ No `any` types
  □ No type assertions without validation
  □ All params and returns typed
  □ No @ts-ignore without justification comment

SECURITY
  □ No hardcoded secrets
  □ User input validated via Zod
  □ No eval/innerHTML/dangerouslySetInnerHTML
  □ Price calculations use integer fils
  □ Seller content sanitized before render

MARKETPLACE LOGIC
  □ Prices displayed as "AED X.XX" (never raw fils)
  □ Stock checks before cart/checkout operations
  □ Cart totals calculated from source data (never cached)
  □ Order status transitions validated

GAMIFICATION
  □ XP can never go negative
  □ Level never decreases
  □ Badge unlocks use proper criteria checks
  □ Streak logic is timezone-aware (UAE GMT+4)
  □ DiceBear avatar styles respect level locks

REACT
  □ Hooks follow rules (not conditional)
  □ useEffect has correct deps + cleanup
  □ No memory leaks
  □ Keys in lists are stable and unique
  □ "use client" only where needed

ACCESSIBILITY
  □ All images have alt text
  □ Prices have aria-labels
  □ Star ratings have aria-labels
  □ Icon-only buttons have aria-labels
  □ Form inputs have labels

PERFORMANCE
  □ No unnecessary re-renders
  □ Large lists virtualized
  □ Images use next/image
  □ Heavy imports are lazy/dynamic

STYLE
  □ Uses cn() for conditional classes
  □ Responsive classes present (mobile-first)
  □ Dark mode classes present
  □ RTL-safe (ms-/me-/ps-/pe- instead of ml-/mr-)
  □ No hardcoded colors — uses design tokens

═══════════════════════════════════════════════════
```

---

## 17. Implementation Phases

### Phase 1 — Foundation (Days 1-2)

```
1. Project init + all dependencies
2. Tailwind config (amber/indigo theme, fonts, spacing)
3. Global CSS with CSS variables
4. ALL types in lib/types.ts
5. ALL constants in lib/constants.ts (XP, levels, badges, categories)
6. Utility functions in lib/utils.ts
7. Gamification logic in lib/gamification.ts
8. DiceBear utility in lib/dicebear.ts
9. Zod schemas in lib/validations.ts
10. Mock data in lib/mock-data.ts (100 products, 20 shops, 50 users, etc.)
11. Layout components: Navbar, Footer, BuyerSidebar, SellerSidebar, AdminSidebar
12. Auth mock context + providers (auth, query, theme, cart, gamification)
13. Gamification components: XPBar, LevelBadge, BadgeCard, StreakCounter
14. DiceBear components: DiceBearAvatar, AvatarWithLevel
15. Command palette (Cmd+K)

GATE: npm run build — 0 errors, 0 warnings
```

### Phase 2 — Shopping Experience (Days 3-5)

```
1. Landing page (hero, categories, trending, seller showcase, gamification teaser)
2. Explore page (filters, search, product grid, sort, view toggle)
3. Category pages
4. Product detail page (gallery, variants, reviews, seller card, XP preview)
5. Shop storefront (banner, products, reviews, about/story)
6. Cart page (grouped by seller, coupon, XP preview)
7. Checkout flow (address → payment → review → success + XP celebration)
8. Search results page
9. Auth pages (login, register + DiceBear avatar generation, onboarding wizard)

GATE: All pages render, navigation works, cart works, responsive at 375px
```

### Phase 3 — Buyer Dashboard (Days 6-7)

```
1. Dashboard home (XP overview, daily challenges, recent orders)
2. Orders list + detail with tracking timeline
3. Wishlist
4. Reviews page
5. Rewards hub (XP, badges collection, challenges, leaderboard, XP history)
6. Profile view + edit + avatar customizer (full page)
7. Messages
8. Notifications
9. Addresses + payment methods
10. Settings (account, notifications, privacy, security)
11. Referrals page

GATE: Dashboard sidebar navigation works, all sub-pages populated
```

### Phase 4 — Seller Dashboard (Days 8-10)

```
1. Seller onboarding wizard (5 steps with XP rewards)
2. Seller dashboard home (stats, sales chart, recent orders, challenges)
3. Add product (7-step wizard)
4. Product inventory list
5. Order management (list + detail + fulfillment flow)
6. Returns management
7. Customer list + detail
8. Shop reviews management
9. Analytics (sales, products, customers, traffic)
10. Promotions (coupons, flash sales, bundles)
11. Shipping configuration
12. Finances (balance, transactions, payouts, invoices)
13. Seller rewards hub
14. Shop settings (branding, team, integrations)

GATE: Full seller flow works: onboard → list product → receive order → fulfill
```

### Phase 5 — Social & Community (Days 11-12)

```
1. Public profiles (buyer + seller)
2. Leaderboards (public page)
3. Browse shops page
4. Collections pages
5. Trending + new arrivals + deals pages
6. Local sellers map view
7. Blog pages
8. Help center

GATE: All public pages populated, leaderboards functional
```

### Phase 6 — Admin & Polish (Days 13-14)

```
1. Admin dashboard
2. User + seller management
3. Product moderation
4. Order overview
5. Gamification admin (badges, challenges, XP events)
6. Category management
7. Featured curation
8. Platform analytics + finances
9. ALL 45 dialogs implemented
10. Marketing pages (About, How It Works, Sell With Us, Pricing, Legal)
11. 404/500 error pages
12. Dark mode polish pass
13. Mobile responsiveness pass
14. RTL layout testing

GATE: Full validation script passes
```

---

## 18. Mock Data & Type Safety

### HOOK: Mock Data Requirements

```typescript
// src/lib/mock-data.ts MUST include:

// Products: 100 across 12 categories
// - Use realistic UAE product names and descriptions
// - Prices in AED (stored as fils)
// - Mix of: handmade, trending, new, on-sale, out-of-stock
// - Each with 3-6 images (placeholder URLs)
// - Rating distribution: mostly 4-5 stars

// Shops: 20
// - DiceBear avatars: https://api.dicebear.com/9.x/{style}/svg?seed={shopname}
// - Mix of levels 1-8
// - Some verified artisans
// - UAE emirate locations

// Users: 50
// - DiceBear avatars with varied styles
// - Level distribution: weighted toward lower levels
// - Badge collections: 0-15 per user
// - Streak data: 0-100 days

// Orders: 30 across all statuses
// Reviews: 50 with photos and seller responses
// Notifications: 30 of all types (order, XP, badge, streak, etc.)
// Leaderboard entries: 20 per board
// Blog posts: 10
// Collections: 8 curated
// Daily challenges: full template list

// ALL data uses exact TypeScript interfaces from types.ts
// ALL IDs follow format: prd_xxx, shp_xxx, usr_xxx, ord_xxx, rvw_xxx, bdg_xxx
// ALL dates are realistic ISO strings (some past, some future)
// ALL prices are in fils (integer)
```

---

## 19. Error Handling Standards

### HOOK: Error Boundary

```typescript
// src/components/error-boundary.tsx — same pattern as CloudHub skill
// Includes retry button, clear error message, consistent branding

// Custom error pages required:
// src/app/not-found.tsx — 404 with illustration + search + popular categories
// src/app/error.tsx — 500 with retry button
// src/app/global-error.tsx — root boundary
```

### HOOK: Marketplace-Specific Errors

```typescript
// Product errors:
// - Out of stock → show "Notify me when available" CTA
// - Price changed → show updated price with warning
// - Product removed → redirect to category with toast

// Cart errors:
// - Item out of stock → highlight item, suggest remove
// - Price changed → show price comparison, ask to accept
// - Seller unavailable → group and highlight affected items

// Checkout errors:
// - Payment failed → show clear reason, offer alternatives (try COD?)
// - Address invalid → highlight specific fields
// - Stock conflict → redirect to cart with updated stock warnings

// Auth errors:
// - Session expired → redirect to login with return URL
// - Unauthorized action → show role-appropriate message
```

---

## 20. Environment & Config Safety

### HOOK: Environment Variables

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Moulna'),
  NEXT_PUBLIC_DICEBEAR_BASE: z.string().url().default('https://api.dicebear.com/9.x'),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
  AUTH_SECRET: z.string().min(32).optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'],
  NEXT_PUBLIC_APP_NAME: process.env['NEXT_PUBLIC_APP_NAME'],
  NEXT_PUBLIC_DICEBEAR_BASE: process.env['NEXT_PUBLIC_DICEBEAR_BASE'],
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env['NEXT_PUBLIC_MAPBOX_TOKEN'],
  DATABASE_URL: process.env['DATABASE_URL'],
  STRIPE_SECRET_KEY: process.env['STRIPE_SECRET_KEY'],
  AUTH_SECRET: process.env['AUTH_SECRET'],
});
```

### `.env.example`

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Moulna
NEXT_PUBLIC_DICEBEAR_BASE=https://api.dicebear.com/9.x

# Maps (optional)
NEXT_PUBLIC_MAPBOX_TOKEN=

# Database (server only)
DATABASE_URL=

# Auth (server only)
AUTH_SECRET=

# Payments (server only)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## Master Validation Command

```bash
#!/bin/bash
echo "🏗️  Moulna Full Validation"
echo "=========================="

echo "1/6 TypeScript..." && npx tsc --noEmit && echo "✅ Types OK"
echo "2/6 ESLint..." && npx eslint src/ --max-warnings 0 && echo "✅ Lint OK"
echo "3/6 Prettier..." && npx prettier --check "src/**/*.{ts,tsx}" && echo "✅ Format OK"
echo "4/6 Tests..." && npx vitest run && echo "✅ Tests OK"
echo "5/6 Build..." && npm run build && echo "✅ Build OK"
echo "6/6 Security..." && npm audit --audit-level=high && echo "✅ Security OK"

echo "=========================="
echo "🎉 All checks passed!"
```

---

## Quick Reference: Do's and Don'ts

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use Zod for ALL validation | Use `any` type |
| Use `cn()` for class merging | String concatenation for classes |
| Use next/image for ALL images | Raw `<img>` tags |
| Use TanStack Query for server data | Fetch in useEffect |
| Use date-fns for dates | Raw Date methods |
| Store prices as integer fils | Use floating-point for money |
| Format as "AED X.XX" | Show raw fils to users |
| Use `ms-`/`me-` (logical) for margins | `ml-`/`mr-` (physical) |
| Use constants for magic strings | Hardcode strings inline |
| Handle loading + error + empty states | Show blank screens |
| Add aria-labels to prices & ratings | Rely on visual-only info |
| Use Server Components by default | "use client" everywhere |
| Validate env vars with Zod | process.env directly |
| Use branded types for IDs | Plain strings for IDs |
| Award XP through gamification provider | Mutate XP directly |
| Check avatar style unlock before render | Show locked styles as available |
| Validate stock at checkout (server-side) | Trust client stock state |
| Use skeleton loaders | Spinner loading states |
| Auto-save long forms to localStorage | Lose user data on navigation |
| Show XP reward previews before actions | Award XP silently |
| Celebrate wins (confetti, animations) | Flat "success" messages |
| Group cart items by seller | Flat cart list |