# Moulna — Gamified Handmade & Social Sellers Marketplace

![Moulna Logo](./Moulna.svg)

> **Use this prompt with any AI coding assistant (Cursor, Claude, Bolt, v0, etc.) to scaffold the complete frontend.**
> **This is a UAE-focused marketplace by Moulna.ae — connecting local brands, creators, social sellers, and artisans with buyers — gamified from the ground up.**

---

## Brand Identity

| Element | Value |
|---------|-------|
| **Logo** | `./Moulna.svg` |
| **Primary Gold** | `#c7a34d` |
| **Primary Dark** | `#363e42` |
| **Brand Name** | Moulna |
| **Website** | Moulna.ae |

### Color Usage Guidelines
- **Gold (#c7a34d)**: Primary CTAs, buttons, highlights, badges, XP indicators, level rings, achievement accents
- **Dark Charcoal (#363e42)**: Headers, body text, dark mode backgrounds, secondary buttons, navigation

---

## 🎯 Project Overview

Build a **gamified multi-vendor marketplace** for handmade goods, local brands, social sellers, and artisan products — primarily serving the UAE and GCC region. Unlike traditional marketplaces (Etsy, Amazon Handmade, Noon), this platform makes buying and selling **feel like a game**: users earn XP, level up, collect badges, climb leaderboards, and unlock perks — all while shopping and selling.

The platform name is **Moulna**. The logo is located at `./Moulna.svg`.

### Core Users
1. **Buyers** — Browse, shop, review, earn XP for engagement
2. **Sellers** — List products, manage shop, fulfill orders, earn seller XP
3. **Artisans** — Verified handmade creators with special badge system
4. **Admins** — Platform moderation, analytics, featured curation

### What Makes This Different
- **Gamification-first**: XP, levels, badges, streaks, daily challenges, leaderboards baked into EVERY interaction
- **DiceBear avatars**: Every user gets a procedurally-generated avatar from `api.dicebear.com` (upgradeable)
- **Hyper-organized UX**: Step-by-step guided flows, progress indicators, breadcrumbs, contextual help everywhere
- **UAE/GCC native**: AED currency, Arabic-ready (RTL support), Emirates-specific categories, COD support

---

## 🛠 Tech Stack & Libraries

```
Framework:       Next.js 15 (App Router, Server Components)
Language:        TypeScript (strict mode)
Styling:         Tailwind CSS 4 + tailwind-animate
UI Components:   shadcn/ui (Radix primitives) — install ALL components
Animations:      Framer Motion 12
Icons:           Lucide React + Phosphor Icons
Forms:           React Hook Form + Zod validation
State:           Zustand (global + gamification state) + TanStack Query v5
Tables:          TanStack Table v8
Rich Text:       Tiptap Editor (product descriptions)
Date/Time:       date-fns + react-day-picker
Charts:          Recharts 2
Drag & Drop:     dnd-kit (image reordering, shop layout)
File Upload:     react-dropzone
Toast/Notifs:    Sonner
Maps:            Mapbox GL JS or react-map-gl (seller locations)
Payments UI:     Stripe Elements (mock) + COD toggle
Auth UI:         Mock auth context (ready for NextAuth/Clerk)
Markdown:        react-markdown (product long descriptions)
Avatars:         DiceBear API (api.dicebear.com) — adventurer, bottts, lorelei, thumbs styles
Confetti:        canvas-confetti (level-ups, achievements)
Number Anim:     react-countup (XP counters, stats)
Lottie:          lottie-react (empty states, achievement animations)
Barcode:         react-qr-code (order QR codes)
Carousel:        embla-carousel-react
```

---

## 🎨 Design System & Principles

### Theme — Moulna Brand Colors
- **Primary Gold** `#c7a34d` — Elegant amber/gold accent for CTAs, highlights, and brand elements
- **Primary Dark** `#363e42` — Sophisticated charcoal for text, headers, and dark mode backgrounds
- This palette reflects UAE luxury marketplace aesthetic with warm gold and refined dark tones
- Light mode default + dark mode (system + toggle)
- Typography: **Inter** for body, **Space Grotesk** for headings, **Noto Sans Arabic** for Arabic text
- Border radius: `0.75rem` (rounded-xl)
- Subtle gradients using `#c7a34d` to soft cream tones on hero sections and achievement cards
- Generous whitespace, max content width 1280px

### CSS Variables
```css
:root {
  --moulna-gold: #c7a34d;
  --moulna-gold-light: #d4b86a;
  --moulna-gold-dark: #a8863d;
  --moulna-charcoal: #363e42;
  --moulna-charcoal-light: #4a5459;
  --moulna-charcoal-dark: #252a2d;
}
```

### Tailwind Config Extension
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        moulna: {
          gold: {
            DEFAULT: '#c7a34d',
            light: '#d4b86a',
            dark: '#a8863d',
          },
          charcoal: {
            DEFAULT: '#363e42',
            light: '#4a5459',
            dark: '#252a2d',
          },
        },
        primary: '#c7a34d',      // Moulna Gold
        secondary: '#363e42',     // Moulna Charcoal
      },
    },
  },
}
```

### Design Rules — "Organized So People Understand What They're Doing"
1. **Every page has a clear title, subtitle, and breadcrumb** — users always know where they are
2. **Step indicators on every multi-step flow** — numbered steps with labels, not just dots
3. **Contextual help tooltips** — `(?)` icons next to complex fields with popovers explaining what to do
4. **Progress bars everywhere** — profile completion, shop setup, order progress, level progress
5. **Empty states with actions** — never a blank page, always illustration + "Here's what to do next"
6. **Confirmation before destructive actions** — type-to-confirm for deletes
7. **Success states are celebrated** — confetti on first sale, badge unlock animations, XP pop-ups
8. **Card-based layouts** — consistent card patterns across the entire app
9. **Inline validation** — real-time field validation, not just on submit
10. **Skeleton loaders** — shimmer placeholders, never spinners
11. **Mobile-first** — bottom sheets for mobile dialogs, thumb-friendly touch targets
12. **Consistent iconography** — same icon set everywhere, never mix

---

## 🎮 GAMIFICATION SYSTEM (Core Feature)

This is the heart of the platform. Every component should reference and integrate with this system.

### XP & Levels

```typescript
// XP Sources — Buyers
const BUYER_XP = {
  SIGN_UP: 100,
  COMPLETE_PROFILE: 200,
  FIRST_PURCHASE: 300,
  LEAVE_REVIEW: 50,
  REVIEW_WITH_PHOTO: 100,
  ADD_TO_WISHLIST: 5,
  SHARE_PRODUCT: 20,
  REFER_FRIEND: 500,
  DAILY_LOGIN: 10,
  DAILY_LOGIN_STREAK_7: 100,    // bonus for 7-day streak
  DAILY_LOGIN_STREAK_30: 500,   // bonus for 30-day streak
  COMPLETE_QUIZ: 75,            // product quiz / style quiz
  FIRST_IN_CATEGORY: 150,       // first purchase in a new category
  FOLLOW_SELLER: 10,
  HELPFUL_REVIEW_VOTE: 15,      // when others vote your review helpful
  REACH_WISHLIST_10: 50,
  BIRTHDAY_BONUS: 200,
};

// XP Sources — Sellers
const SELLER_XP = {
  OPEN_SHOP: 500,
  FIRST_LISTING: 100,
  REACH_10_LISTINGS: 300,
  REACH_50_LISTINGS: 1000,
  FIRST_SALE: 500,
  REACH_10_SALES: 800,
  REACH_100_SALES: 3000,
  FIVE_STAR_REVIEW: 100,
  SHIP_WITHIN_24H: 50,          // fast shipping bonus
  ZERO_CANCELLATIONS_30_DAYS: 300,
  COMPLETE_SHOP_PROFILE: 200,
  ADD_SHOP_STORY: 150,          // artisan story/about section
  FEATURED_PRODUCT: 500,
  DAILY_ACTIVE: 10,
};

// Level Thresholds (using Moulna brand progression)
const LEVELS = [
  { level: 1,  title: "Newcomer",        xpRequired: 0,      color: "#94a3b8" },
  { level: 2,  title: "Explorer",        xpRequired: 500,    color: "#60a5fa" },
  { level: 3,  title: "Regular",         xpRequired: 1500,   color: "#34d399" },
  { level: 4,  title: "Enthusiast",      xpRequired: 3500,   color: "#a78bfa" },
  { level: 5,  title: "Connoisseur",     xpRequired: 7000,   color: "#d4b86a" },  // Moulna Gold Light
  { level: 6,  title: "Trendsetter",     xpRequired: 12000,  color: "#c7a34d" },  // Moulna Gold
  { level: 7,  title: "Tastemaker",      xpRequired: 20000,  color: "#a8863d" },  // Moulna Gold Dark
  { level: 8,  title: "Elite",           xpRequired: 35000,  color: "#363e42" },  // Moulna Charcoal
  { level: 9,  title: "Legend",          xpRequired: 60000,  color: "#252a2d" },  // Moulna Charcoal Dark
  { level: 10, title: "Moulna Patron",   xpRequired: 100000, color: "#c7a34d", special: true },  // Moulna Gold (Elite)
];
```

### Badges System

```typescript
// Badge Categories
const BADGE_CATEGORIES = {
  SHOPPING: [
    { id: "first_buy",       name: "First Purchase",      icon: "🛍️", desc: "Made your first purchase" },
    { id: "big_spender",     name: "Big Spender",         icon: "💎", desc: "Spent over 5,000 AED total" },
    { id: "category_explorer", name: "Category Explorer",  icon: "🧭", desc: "Bought from 5+ categories" },
    { id: "repeat_buyer",    name: "Loyal Customer",       icon: "🔄", desc: "Bought from same seller 3+ times" },
    { id: "early_bird",      name: "Early Bird",           icon: "🐦", desc: "First to buy a new product" },
    { id: "night_owl",       name: "Night Owl",            icon: "🦉", desc: "Made a purchase after midnight" },
    { id: "flash_shopper",   name: "Flash Shopper",        icon: "⚡", desc: "Bought during a flash sale" },
  ],
  SOCIAL: [
    { id: "first_review",    name: "Critic",              icon: "✍️", desc: "Left your first review" },
    { id: "photo_reviewer",  name: "Photographer",        icon: "📸", desc: "Left 5 reviews with photos" },
    { id: "helpful_voice",   name: "Helpful Voice",       icon: "🗣️", desc: "10 reviews marked as helpful" },
    { id: "referral_king",   name: "Ambassador",          icon: "👑", desc: "Referred 10+ friends" },
    { id: "social_butterfly", name: "Social Butterfly",   icon: "🦋", desc: "Shared 20+ products" },
    { id: "community_pillar", name: "Community Pillar",   icon: "🏛️", desc: "Active for 365 days" },
  ],
  SELLER: [
    { id: "shop_open",       name: "Shop Owner",          icon: "🏪", desc: "Opened your first shop" },
    { id: "first_sale",      name: "First Sale",          icon: "🎉", desc: "Made your first sale" },
    { id: "top_rated",       name: "Top Rated",           icon: "⭐", desc: "Maintained 4.8+ rating for 30 days" },
    { id: "speed_demon",     name: "Speed Demon",         icon: "🚀", desc: "Shipped 10 orders within 24h" },
    { id: "century_club",    name: "Century Club",        icon: "💯", desc: "100 sales milestone" },
    { id: "handmade_hero",   name: "Handmade Hero",       icon: "🧵", desc: "Verified artisan with 50+ sales" },
    { id: "trending_seller", name: "Trending",            icon: "🔥", desc: "Product was trending this week" },
  ],
  STREAK: [
    { id: "streak_7",        name: "Weekly Warrior",       icon: "🔥", desc: "7-day login streak" },
    { id: "streak_30",       name: "Monthly Master",       icon: "🌟", desc: "30-day login streak" },
    { id: "streak_100",      name: "Centurion",           icon: "🏆", desc: "100-day login streak" },
    { id: "streak_365",      name: "Year-Round",          icon: "🌍", desc: "365-day login streak" },
  ],
  SEASONAL: [
    { id: "ramadan_shopper", name: "Ramadan Spirit",       icon: "🌙", desc: "Shopped during Ramadan season" },
    { id: "national_day",    name: "Spirit of the Union",  icon: "🇦🇪", desc: "Active on UAE National Day" },
    { id: "eid_gifter",      name: "Eid Gifter",           icon: "🎁", desc: "Sent a gift during Eid" },
  ],
};
```

### DiceBear Avatar System

```typescript
// Avatar Configuration
// Every new user gets a DiceBear avatar on signup
// Users can customize and upgrade their avatar as they level up

const AVATAR_STYLES = {
  // Unlocked at Level 1 (free)
  DEFAULT: ["adventurer", "adventurer-neutral", "bottts", "thumbs"],
  // Unlocked at Level 3
  LEVEL_3: ["lorelei", "lorelei-neutral", "avataaars", "avataaars-neutral"],
  // Unlocked at Level 5
  LEVEL_5: ["big-ears", "big-ears-neutral", "micah", "open-peeps"],
  // Unlocked at Level 7
  LEVEL_7: ["personas", "notionists", "notionists-neutral", "fun-emoji"],
  // Unlocked at Level 10
  LEVEL_10: ["pixel-art", "pixel-art-neutral"], // rare/exclusive styles
};

// Avatar URL Pattern:
// https://api.dicebear.com/9.x/{style}/svg?seed={username}&backgroundColor={levelColor}
// Background color changes with level for instant visual prestige
```

### Daily Challenges

```typescript
const DAILY_CHALLENGES = [
  { id: "browse_3",       task: "Browse 3 different categories",      xp: 30,  icon: "👀" },
  { id: "add_wishlist",   task: "Add 2 items to your wishlist",       xp: 20,  icon: "❤️" },
  { id: "leave_review",   task: "Leave a review on a past order",     xp: 50,  icon: "✍️" },
  { id: "share_product",  task: "Share a product on social media",    xp: 25,  icon: "📤" },
  { id: "follow_seller",  task: "Follow a new seller",                xp: 15,  icon: "➕" },
  { id: "complete_quiz",  task: "Complete today's style quiz",        xp: 40,  icon: "🧠" },
  { id: "first_purchase",  task: "Make a purchase today",             xp: 75,  icon: "🛒" },
  // Seller-specific
  { id: "list_product",   task: "List a new product",                 xp: 40,  icon: "📦" },
  { id: "respond_msg",    task: "Respond to a customer message",      xp: 20,  icon: "💬" },
  { id: "update_listing", task: "Update a product listing",           xp: 15,  icon: "✏️" },
];
// 3 random challenges shown per day, refreshing at midnight UAE time (GMT+4)
```

### Leaderboards

```
Monthly leaderboards:
- Top Buyers (by XP earned this month)
- Top Sellers (by sales + rating combo)
- Top Reviewers (by helpful review votes)
- Top Artisans (by handmade verification + sales)
- Rising Stars (new sellers with fastest growth)

Rewards for top 10 each month:
- Exclusive "Monthly Champion" badge
- Featured on homepage
- Extra XP multiplier for next month (1.5x)
```

### Streak System

```
Visual: Fire icon 🔥 with streak count next to username everywhere
- Login streak counter (consecutive days)
- Purchase streak (purchases in consecutive weeks)
- Review streak (reviews left in consecutive weeks)
- Seller: fulfillment streak (orders shipped within 24h consecutively)

Streak breaks show a "Revive your streak?" dialog with option to use XP to restore
```

---

## 📁 Complete File/Route Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── verify-email/page.tsx
│   ├── verify-phone/page.tsx              ← UAE phone verification (OTP)
│   └── onboarding/page.tsx                ← guided profile setup wizard
│
├── (marketing)/
│   ├── page.tsx                            ← Landing / Home page
│   ├── about/page.tsx
│   ├── how-it-works/page.tsx               ← Step-by-step guide (buyers + sellers)
│   ├── sell-with-us/page.tsx               ← Seller recruitment landing page
│   ├── artisan-program/page.tsx            ← Verified artisan program info
│   ├── pricing/page.tsx                    ← Seller subscription tiers
│   ├── blog/
│   │   ├── page.tsx                        ← Blog listing
│   │   └── [slug]/page.tsx                ← Blog post
│   ├── contact/page.tsx
│   ├── help/page.tsx                       ← Help center / FAQ hub
│   ├── help/[category]/page.tsx            ← Help category
│   ├── help/[category]/[article]/page.tsx  ← Help article
│   └── legal/
│       ├── terms/page.tsx
│       ├── privacy/page.tsx
│       ├── seller-agreement/page.tsx
│       ├── refund-policy/page.tsx
│       └── cookies/page.tsx
│
├── explore/                                ← Public browsing (no auth required)
│   ├── page.tsx                            ← Main explore page (curated + categories)
│   ├── categories/page.tsx                 ← All categories grid
│   ├── categories/[slug]/page.tsx          ← Category product listing
│   ├── collections/page.tsx                ← Curated collections ("Ramadan Gifts", "Office Essentials")
│   ├── collections/[slug]/page.tsx         ← Collection detail
│   ├── trending/page.tsx                   ← Trending products
│   ├── new-arrivals/page.tsx               ← Latest listings
│   ├── deals/page.tsx                      ← Flash sales & deals
│   ├── local/page.tsx                      ← Local sellers near you (map view)
│   ├── leaderboard/page.tsx                ← Public leaderboards (buyers, sellers, artisans)
│   └── search/page.tsx                     ← Search results
│
├── products/
│   └── [productId]/page.tsx                ← Product detail page
│
├── shops/
│   ├── page.tsx                            ← Browse all shops
│   └── [shopSlug]/
│       ├── page.tsx                        ← Public shop storefront
│       ├── products/page.tsx               ← All shop products
│       ├── reviews/page.tsx                ← Shop reviews
│       └── about/page.tsx                  ← Seller story / about
│
├── cart/page.tsx                            ← Shopping cart
├── checkout/page.tsx                        ← Checkout flow
├── checkout/success/page.tsx                ← Order success + XP celebration
│
├── dashboard/                              ← Authenticated buyer dashboard
│   ├── page.tsx                            ← Home (XP overview, recent activity, daily challenges)
│   ├── orders/
│   │   ├── page.tsx                        ← My orders list
│   │   └── [orderId]/page.tsx              ← Order detail + tracking
│   ├── wishlist/page.tsx                   ← Saved items / wishlist
│   ├── reviews/page.tsx                    ← My reviews
│   ├── messages/page.tsx                   ← Inbox (seller conversations)
│   ├── messages/[conversationId]/page.tsx  ← Conversation thread
│   ├── notifications/page.tsx              ← All notifications
│   ├── rewards/
│   │   ├── page.tsx                        ← Rewards hub (XP, level, badges, streaks)
│   │   ├── badges/page.tsx                 ← Full badge collection
│   │   ├── challenges/page.tsx             ← Daily & weekly challenges
│   │   ├── leaderboard/page.tsx            ← My rank + leaderboards
│   │   └── history/page.tsx                ← XP history log
│   ├── referrals/page.tsx                  ← Referral program + share link
│   ├── addresses/page.tsx                  ← Saved addresses
│   ├── payments/page.tsx                   ← Saved payment methods
│   ├── profile/
│   │   ├── page.tsx                        ← View my public profile
│   │   ├── edit/page.tsx                   ← Edit profile + avatar customizer
│   │   └── avatar/page.tsx                 ← DiceBear avatar customizer (full page)
│   └── settings/
│       ├── page.tsx                        ← Account settings
│       ├── notifications/page.tsx          ← Notification preferences
│       ├── privacy/page.tsx                ← Privacy settings
│       └── security/page.tsx               ← Password + 2FA
│
├── seller/                                 ← Seller dashboard (requires seller role)
│   ├── page.tsx                            ← Seller home (stats, sales, XP, challenges)
│   ├── onboarding/page.tsx                 ← Guided shop setup wizard (step-by-step)
│   ├── shop/
│   │   ├── page.tsx                        ← Shop overview / customize storefront
│   │   ├── edit/page.tsx                   ← Edit shop details
│   │   ├── story/page.tsx                  ← Edit artisan story / brand story
│   │   └── branding/page.tsx               ← Shop branding (logo, banner, colors)
│   ├── products/
│   │   ├── page.tsx                        ← Product inventory list
│   │   ├── new/page.tsx                    ← Add new product (multi-step)
│   │   ├── [productId]/edit/page.tsx       ← Edit product
│   │   ├── categories/page.tsx             ← Manage product categories
│   │   └── bulk/page.tsx                   ← Bulk upload / edit
│   ├── orders/
│   │   ├── page.tsx                        ← Incoming orders list
│   │   ├── [orderId]/page.tsx              ← Order detail + fulfillment
│   │   └── returns/page.tsx                ← Returns & refunds
│   ├── customers/
│   │   ├── page.tsx                        ← Customer list
│   │   └── [customerId]/page.tsx           ← Customer detail
│   ├── reviews/page.tsx                    ← Shop reviews management
│   ├── messages/page.tsx                   ← Customer messages
│   ├── analytics/
│   │   ├── page.tsx                        ← Sales overview
│   │   ├── products/page.tsx               ← Product performance
│   │   ├── customers/page.tsx              ← Customer analytics
│   │   └── traffic/page.tsx                ← Traffic sources
│   ├── promotions/
│   │   ├── page.tsx                        ← Active promotions
│   │   ├── coupons/page.tsx                ← Coupon management
│   │   ├── flash-sales/page.tsx            ← Flash sale setup
│   │   └── bundles/page.tsx                ← Product bundles
│   ├── shipping/
│   │   ├── page.tsx                        ← Shipping settings
│   │   ├── zones/page.tsx                  ← Shipping zones & rates
│   │   └── methods/page.tsx                ← Shipping methods
│   ├── finances/
│   │   ├── page.tsx                        ← Balance & earnings overview
│   │   ├── transactions/page.tsx           ← Transaction history
│   │   ├── payouts/page.tsx                ← Payout history & schedule
│   │   └── invoices/page.tsx               ← Invoices
│   ├── rewards/
│   │   ├── page.tsx                        ← Seller rewards hub (XP, badges, rank)
│   │   └── achievements/page.tsx           ← Seller achievement progress
│   └── settings/
│       ├── page.tsx                        ← Shop settings
│       ├── team/page.tsx                   ← Team members / collaborators
│       ├── integrations/page.tsx           ← Connect Instagram, WhatsApp, etc.
│       ├── notifications/page.tsx          ← Seller notification prefs
│       └── billing/page.tsx                ← Seller subscription & fees
│
├── profile/[username]/page.tsx             ← Public user profile (buyer or seller)
│
├── admin/                                  ← Platform admin
│   ├── page.tsx                            ← Admin dashboard
│   ├── users/page.tsx                      ← User management
│   ├── users/[userId]/page.tsx             ← User detail
│   ├── sellers/page.tsx                    ← Seller management
│   ├── sellers/[sellerId]/page.tsx         ← Seller detail
│   ├── sellers/applications/page.tsx       ← New seller applications
│   ├── products/page.tsx                   ← Product moderation
│   ├── orders/page.tsx                     ← All platform orders
│   ├── reviews/page.tsx                    ← Review moderation
│   ├── categories/page.tsx                 ← Category management
│   ├── collections/page.tsx                ← Collection curation
│   ├── featured/page.tsx                   ← Featured products / sellers
│   ├── reports/page.tsx                    ← Reported content
│   ├── gamification/
│   │   ├── page.tsx                        ← Gamification settings
│   │   ├── badges/page.tsx                 ← Badge management
│   │   ├── challenges/page.tsx             ← Challenge management
│   │   └── leaderboards/page.tsx           ← Leaderboard management
│   ├── promotions/page.tsx                 ← Platform-wide promotions
│   ├── analytics/page.tsx                  ← Platform analytics
│   ├── finances/page.tsx                   ← Platform revenue / commissions
│   └── settings/page.tsx                   ← Platform settings
│
└── api/                                    ← API route stubs
    ├── auth/[...nextauth]/route.ts
    ├── products/route.ts
    ├── orders/route.ts
    ├── reviews/route.ts
    ├── gamification/xp/route.ts
    ├── upload/route.ts
    └── webhooks/stripe/route.ts
```

---

## 📄 Page-by-Page Specifications

### 1. LANDING PAGE (`/`)
```
Layout:
- Sticky navbar: Moulna.svg logo, search bar (command-K style), category dropdown,
  cart icon with count badge, user avatar (DiceBear) with level indicator ring,
  notification bell, "Sell on Moulna" CTA (gold #c7a34d button)
  
- Hero section:
  - Left: headline "Discover Unique, Handmade & Local"
    + subtitle "Shop from UAE's finest creators — earn rewards with every purchase"
    + Two CTAs: "Start Shopping" (primary gold #c7a34d) + "Open Your Shop" (outline #363e42)
    + XP teaser: "🎮 Earn 100 XP just for signing up!"
  - Right: animated product collage / 3D product showcase
  - Background: warm mesh gradient (gold #c7a34d to cream)

- Social proof bar: "12,000+ products • 3,000+ sellers • 50,000+ happy customers"

- "How It Works" — 3-step horizontal cards with icons:
  1. "Browse & Discover" — Find unique products from local sellers
  2. "Shop & Earn" — Every purchase earns XP, badges, and rewards
  3. "Level Up" — Unlock perks, discounts, and exclusive access

- Category showcase grid (8-12 categories with image + label):
  Handmade Jewelry, Home Décor, Arabic Calligraphy, Perfumes & Oud,
  Fashion & Clothing, Food & Sweets, Art & Prints, Baby & Kids,
  Wellness & Beauty, Gifts & Occasions, Tech Accessories, Custom & Personalized

- "Trending Now" — horizontal product carousel with fire badge + sales count

- "Top Sellers This Month" — seller cards with DiceBear avatar, level badge,
  shop name, rating, product preview thumbnails

- "Daily Deals" — countdown timer + deal cards with discount percentage overlay

- Gamification teaser section:
  - "Level Up While You Shop" headline
  - Visual: level progression bar with badge previews
  - Cards: "Earn XP" / "Collect Badges" / "Climb Leaderboards" / "Unlock Perks"
  - CTA: "Start Your Journey"

- "Fresh From Artisans" — curated artisan products with verified badge

- Testimonials — buyer + seller testimonials with DiceBear avatars and level badges

- "Start Selling Today" CTA banner for sellers

- Footer: Moulna.svg logo, categories, company links, help, social icons, App Store badges,
  language toggle (EN/AR), currency display (AED), gold (#c7a34d) accent on links
```

### 2. AUTH PAGES (`/login`, `/register`, `/forgot-password`, etc.)
```
Design:
- Split layout: left = Moulna brand panel with Moulna.svg logo + animated SVG illustration + tagline,
  gold (#c7a34d) gradient background accents
  right = auth form with charcoal (#363e42) text
- Registration generates a DiceBear avatar immediately on name input
  (live preview updates as user types)

Register Flow:
- Step 1: Email/Phone + Password (social login: Google, Apple)
- Step 2: Name + auto-generated avatar preview
- Step 3: "I want to..." → "Shop" / "Sell" / "Both" (role selection chips)
- Success: Confetti + "+100 XP Welcome Bonus!" animation

Onboarding Wizard (post-register):
- Step 1: Upload custom photo OR customize DiceBear avatar (style, seed, colors)
- Step 2: Select interests (category tags) — used for personalized feed
- Step 3: Set location (emirate selector: Abu Dhabi, Dubai, Sharjah, etc.)
- Step 4: (Sellers only) Quick shop name + category
- Each step shows XP reward: "Complete this step → +50 XP"
- Progress bar at top: "Profile 40% complete — finish to earn 200 XP!"
```

### 3. EXPLORE PAGE (`/explore`)
```
Layout:
- Full-width hero: "Discover Something New" with search bar
- Category pills (horizontally scrollable with icons)
- Quick filter chips: "Handmade", "Local Pickup", "Free Shipping", "On Sale", "New"
- Sort: "Trending", "Newest", "Price: Low→High", "Price: High→Low", "Top Rated", "Most Sold"
- View toggle: Grid (2/3/4 col) / List
- Price range slider (AED)
- Rating filter (minimum stars)
- Location filter (emirate dropdown)
- Seller level filter (show only Level 5+ sellers etc.)

Product Cards:
- Product image (hover: second image or quick view)
- Product title (truncated)
- Seller name + DiceBear avatar (tiny) + level badge
- Price in AED (original price strikethrough if on sale)
- Star rating + review count
- "Handmade" badge (if applicable)
- Wishlist heart icon (top-right, animated fill)
- "Add to Cart" button on hover
- Hover lift animation + shadow

Product card badges:
- "🔥 Trending" (if trending)
- "🆕 New" (if listed < 7 days ago)
- "⚡ Flash Deal" (if in flash sale)
- "✋ Handmade" (if verified handmade)
- "🏆 Top Seller" (if seller is top rated)
```

### 4. PRODUCT DETAIL PAGE (`/products/[productId]`)
```
Layout:
- Breadcrumb: Home > Category > Subcategory > Product Name
- Two-column layout:
  Left (60%):
  - Image gallery (main image + thumbnails, click to zoom, swipe on mobile)
  - Lightbox on click
  
  Right (40%):
  - Product title
  - Seller card: DiceBear avatar + shop name + level badge + "Follow" button
  - Rating: stars + review count + "Verified Purchase" indicator
  - Price: AED with any discounts shown
  - Variant selectors (color, size, etc.) — visual swatches
  - Quantity selector
  - "Add to Cart" (primary button, full-width)
  - "Buy Now" (secondary)
  - "Add to Wishlist" (outline with heart)
  - XP indicator: "🎮 Earn 50 XP with this purchase"
  - Shipping info: estimated delivery, free shipping threshold
  - Payment options: Card, COD, Apple Pay badges
  - "Share" button (copy link, WhatsApp, Instagram, Twitter)

  Below fold:
  - Tab navigation: Description | Reviews | Seller | Shipping & Returns
  
  Description Tab:
  - Rich text product description
  - Product specifications table
  - "Handmade" process story (if artisan)
  - Materials / ingredients list
  
  Reviews Tab:
  - Overall rating summary (bar chart of 5-4-3-2-1 stars)
  - Filter by: Stars, With Photos, Verified Purchase
  - Sort: Most Recent, Most Helpful
  - Review cards: DiceBear avatar + name + level badge + rating + date
    + review text + photos + "Helpful" vote button + seller response
  - "Write a Review" button → opens review dialog
  - XP callout: "Leave a review → earn 50 XP, with photo → earn 100 XP!"
  
  Seller Tab:
  - Full seller card: banner, avatar, shop name, level, member since
  - Rating + total sales
  - Response time
  - "Visit Shop" button
  - "Message Seller" button
  
  Shipping Tab:
  - Delivery estimates by emirate
  - Return policy
  - Shipping cost calculator

- Related Products carousel
- "Recently Viewed" carousel
- "Customers also bought" carousel
```

### 5. SHOP STOREFRONT (`/shops/[shopSlug]`)
```
Layout:
- Shop banner image (customizable by seller)
- Shop profile section:
  - DiceBear avatar (large) with level ring
  - Shop name + verified badge (if applicable)
  - Level badge: "Level 7 — Tastemaker"
  - Star rating + total reviews + total sales
  - Member since + location (emirate)
  - "Follow" button with follower count
  - "Message" button
  - Badge showcase: top 3-5 badges earned (click to see all)
  
- Navigation tabs: Products | Collections | Reviews | About / Story

Products Tab:
- Search within shop
- Category filter (shop's categories)
- Sort options
- Product grid

Collections Tab:
- Seller's curated collections (cards with cover image + title)

Reviews Tab:
- Shop-level reviews (same pattern as product reviews)

About Tab:
- Seller's story (rich text — "our story", "how we make it", etc.)
- Photo gallery of process / workshop / team
- Location map (if brick-and-mortar)
- Social links (Instagram, WhatsApp, website)
```

### 6. CART & CHECKOUT (`/cart`, `/checkout`)
```
Cart Page:
- Cart items grouped by seller (seller header with avatar + name)
- Each item: image, title, variant, qty selector, unit price, subtotal, remove
- Coupon code input with "Apply" button
- XP preview: "You'll earn approximately 150 XP from this order!"
- Cart summary sidebar:
  - Subtotal, Shipping, Discount, Total (AED)
  - "Proceed to Checkout" button
  - Accepted payment icons
- "You might also like" recommendations below
- Empty cart state: illustration + "Start Shopping" CTA + current daily deals

Checkout Page (multi-step with progress bar):
- Step 1 — Shipping Address:
  - Saved addresses (radio cards) + "Add New Address" button
  - Address form: name, phone, emirate dropdown, area, street, building,
    apartment, landmark, map pin (optional)
  - Delivery type: Standard / Express / Same Day (where available)
  
- Step 2 — Payment Method:
  - Saved cards (radio cards) + "Add New Card"
  - Payment options: Credit/Debit Card (Stripe mock), COD, Apple Pay
  - COD fee notice if applicable
  
- Step 3 — Review & Confirm:
  - Full order summary (items, shipping, payment, address)
  - Coupon applied indicator
  - Order notes textarea
  - Terms agreement checkbox
  - "Place Order" button with order total
  
Success Page (/checkout/success):
- Large checkmark animation → confetti burst
- "+150 XP earned!" animated counter
- New badges unlocked (if any) — badge reveal animation
- Order number + estimated delivery
- "Track Order" button
- "Continue Shopping" button
- Streak update: "🔥 Purchase streak: 3 weeks!"
- Social share: "Share your purchase and earn 20 XP"
```

### 7. BUYER DASHBOARD (`/dashboard`)
```
Layout:
- Left sidebar navigation (collapsible on mobile → bottom nav)
- Main content area

Dashboard Home:
- Welcome header: "Welcome back, [Name]!" + DiceBear avatar + level badge
- XP bar: current XP / next level XP (animated progress bar with glow)
  + "You need 1,200 more XP to reach Level 5 — Connoisseur"
- Login streak counter: "🔥 12-day streak! Don't break it!"

- Daily Challenges card (3 challenges for today):
  - Each with checkbox, task description, XP reward
  - Progress: "1 of 3 completed"
  - Timer: "Refreshes in 8h 23m"

- Quick stats cards row:
  - Total Orders / Wishlist Items / Reviews Left / XP This Month

- Recent Orders (last 3 with status badges: Processing → Shipped → Delivered)
- Recommended Products carousel (based on interests + purchase history)
- "Your Badges" preview — show latest 4 earned, "View All" link
- Activity feed: recent XP earnings log
```

### 8. BUYER REWARDS HUB (`/dashboard/rewards`)
```
Main Page:
- Giant level card:
  - DiceBear avatar (large) with animated level ring (progress arc)
  - Current level + title + XP count
  - "Next level: [Name] — [XP needed] XP to go"
  - Level perks unlocked at current level
  
- Streak section:
  - Login streak with fire animation
  - Purchase streak
  - Review streak
  - Calendar heatmap (GitHub-style) showing active days

- XP earned this month chart (line chart, daily breakdown)

- Quick links: "My Badges" / "Challenges" / "Leaderboard" / "XP History"

Badges Page (/dashboard/rewards/badges):
- Grid of ALL badges organized by category tabs
- Earned badges: full color with earned date
- Locked badges: greyed out with "?" or lock icon
  + hover reveals requirement to unlock
- Badge detail dialog: name, description, date earned, XP rewarded
- Filter: "Earned" / "Locked" / "All"
- Progress counter: "24 of 42 badges earned (57%)"

Challenges Page (/dashboard/rewards/challenges):
- Today's Challenges (3 daily)
- Weekly Challenge (1 bigger challenge)
- Completed challenges history
- Timer to next refresh

Leaderboard Page (/dashboard/rewards/leaderboard):
- Tab toggle: "Buyers" / "Sellers" / "Reviewers" / "Artisans"
- Time filter: "This Week" / "This Month" / "All Time"
- Table: Rank / Avatar + Name + Level / XP / Streak / Badges
- "Your Position" highlighted row (even if not in top 100)
- Top 3 with medal icons (gold, silver, bronze) and larger cards

XP History (/dashboard/rewards/history):
- Filterable table/list of all XP transactions
- Columns: Date, Action, XP Earned, Running Total
- Filter by: type (purchase, review, streak, badge, etc.)
```

### 9. BUYER PROFILE & AVATAR (`/dashboard/profile/*`)
```
Profile View:
- Cover image (optional)
- DiceBear avatar (large, with level ring)
- Name, username, location, member since
- Level badge + title
- XP bar
- Stats: Orders | Reviews | Badges | Following
- Badge showcase (top badges)
- Public review history
- "Edit Profile" button

Avatar Customizer (/dashboard/profile/avatar):
- Full-page avatar studio
- Left: Large avatar preview (real-time updates)
- Right: Customization panels
  - Style selector (locked styles show level requirement)
  - Seed input (changes the generated look)
  - Background color picker
  - Accessories (unlocked by badges — e.g., crown for Level 10)
- "Save Avatar" button
- "Randomize" button
- Preview: "This is how others see you"
```

### 10. SELLER DASHBOARD (`/seller`)
```
Seller Home:
- Welcome: "Your Shop Dashboard" + shop name + avatar + seller level
- XP bar (seller-specific level progression)
- Daily seller challenges (3)
- Key metrics cards: Today's Orders / Today's Revenue / Pending Shipments / 
  Rating / Total Sales / Conversion Rate
- Sales chart (line, last 30 days)
- Recent orders table (last 5, with status + action buttons)
- Low stock alerts
- Customer messages unread count
- "Quick Actions" buttons: Add Product, Process Order, View Analytics

Seller Onboarding Wizard (/seller/onboarding):
- 5 clear steps with progress bar + checklist:
  1. "Name Your Shop" — shop name + category
  2. "Tell Your Story" — brand description + artisan story
  3. "Set Up Branding" — logo upload, banner, DiceBear avatar style selection
  4. "Add Your First Product" — guided product creation
  5. "Configure Shipping" — shipping zones + rates
- Each step: "+100 XP" reward
- Completion: "+500 XP Shop Owner badge unlocked!" with confetti
- Checklist persists on sidebar until all done
```

### 11. ADD PRODUCT (`/seller/products/new`)
```
Multi-step form with clear numbered progress:

Step 1 — Product Info:
- Category selector (visual tree with icons)
- Product title (with character count)
- Short description (max 200 chars)
- Long description (Tiptap rich text editor)
- Tags (autocomplete multi-select)
- Tooltip: "💡 Great titles include the material, style, and use case"

Step 2 — Media:
- Image upload (drag & drop zone, up to 10 images)
- Reorder images with dnd-kit drag handles
- First image = main product image
- Image guidelines popover: dimensions, file types, tips
- Video upload (optional, 1 video max)
- "📸 Tip: Products with 5+ photos sell 3x more!"

Step 3 — Pricing & Inventory:
- Price (AED) with currency display
- Compare-at price (for showing discounts)
- Cost per item (for profit calculation — private)
- SKU (optional)
- Quantity in stock
- Low stock threshold
- "Is this handmade?" toggle → unlocks artisan verification badge request
- Profit margin calculator (inline display)

Step 4 — Variants (optional):
- Add variant options (Color, Size, Material, Custom)
- Variant matrix auto-generates combinations
- Individual pricing & stock per variant
- Image assignment per variant

Step 5 — Shipping:
- Weight & dimensions (for auto rate calculation)
- Shipping profile selector (from saved profiles)
- Local pickup available toggle
- Free shipping toggle + threshold
- Processing time (1-3 days, 3-5 days, etc.)

Step 6 — SEO & Visibility:
- SEO title + meta description
- URL slug (auto-generated, editable)
- Visibility: Active / Draft / Scheduled
- Schedule publish date (if scheduled)

Step 7 — Review & Publish:
- Full preview (exactly as it would appear on the site)
- Publish / Save Draft
- "+40 XP" for publishing
- "🎉 First listing? Earn the First Listing badge!"

Auto-save indicator: "Saved 3 seconds ago" in the corner
```

### 12. ORDER MANAGEMENT (Seller) (`/seller/orders/*`)
```
Orders List:
- Tab filters: All / Pending / Processing / Shipped / Delivered / Cancelled / Returns
- Searchable + filterable TanStack Table
- Columns: Order #, Customer, Items, Total, Date, Status, Actions
- Bulk actions: Mark as Shipped, Print Labels, Export
- Status badges: color-coded pills

Order Detail (/seller/orders/[orderId]):
- Order status timeline (visual stepper: Placed → Confirmed → Shipped → Delivered)
- Customer info card: name + DiceBear avatar + level + order history count
- Items list with images
- Shipping address + map pin
- Payment info
- Order notes
- Action buttons: Confirm Order / Mark as Shipped / Add Tracking Number
- Shipment tracking number input dialog
- Print packing slip button
- "Shipped within 24h → earn 50 XP!" notification
```

### 13. SELLER ANALYTICS (`/seller/analytics/*`)
```
Sales Overview:
- Revenue chart (line, selectable: 7d/30d/90d/1y)
- Orders chart
- Key metrics: Revenue, Orders, Avg Order Value, Conversion Rate
- Top selling products (table: rank, product, sales, revenue)
- Revenue by category (pie chart)

Product Performance:
- Table: Product, Views, Cart Adds, Sales, Conversion, Revenue
- Sortable + filterable
- Click → individual product analytics

Customer Analytics:
- New vs returning customers (donut chart)
- Top customers table
- Geographic distribution (by emirate — bar chart)
- Customer acquisition source

Traffic:
- Views over time (line chart)
- Traffic sources (direct, search, social, referral)
- Top landing pages
```

### 14. SELLER PROMOTIONS (`/seller/promotions/*`)
```
Coupons Page:
- Active coupons table: Code, Type (% or fixed), Value, Usage/Limit, Expiry, Status
- Create coupon dialog (code, type, value, min order, max uses, expiry, products/categories)

Flash Sales:
- Create flash sale: select products, discount %, start/end time
- Active flash sales with countdown timer
- "⚡ Flash sales earn 2x XP on sold items!"

Bundles:
- Create bundle: select products, set bundle price vs individual total
- Bundle preview card
```

### 15. SELLER FINANCES (`/seller/finances/*`)
```
Balance Overview:
- Available balance (AED)
- Pending balance (in transit)
- Total earned (all time)
- "Request Payout" button
- Next auto-payout date

Transactions:
- Table: Date, Type (sale/refund/payout/fee), Description, Amount, Status
- Filter by type + date range
- Export CSV

Payouts:
- Payout history table
- Bank account management (add/edit)
- Payout schedule settings (weekly/bi-weekly/monthly)

Invoices:
- Platform fee invoices
- Download as PDF
```

### 16. ADMIN PANEL (`/admin/*`)
```
Dashboard:
- Platform metrics: Total Users, Sellers, Products, Orders, Revenue (GMV)
- Charts: growth over time, orders per day, revenue per day
- New signups today, new sellers today
- Pending seller applications count
- Flagged content count
- Gamification stats: avg user level, most earned badge, total XP distributed

User Management:
- Full table: Name, Email, Role, Level, XP, Status, Joined, Actions
- Click → user detail drawer with full profile + order history + XP log
- Actions: Suspend, Ban, Reset Password, Grant XP, Assign Badge, Make Admin

Seller Management:
- Seller applications queue (approve/reject with review)
- Active sellers table
- Seller detail: shop info, products, orders, revenue, compliance

Product Moderation:
- Flagged/reported products queue
- Review product → Approve / Reject / Require Changes
- Category reassignment

Gamification Admin:
- Badge creator (name, icon, description, unlock criteria)
- Challenge creator (task, XP, duration)
- XP multiplier events (e.g., "2x XP Weekend")
- Leaderboard management + reset
- Manual XP grant tool

Platform Settings:
- Commission rate configuration
- Category management (add/edit/reorder with drag & drop)
- Featured products/sellers rotation
- Banner management (home page banners)
- Email template management
```

### 17. PROFILE PAGE (`/profile/[username]`)
```
Public profile visible to anyone:
- Cover image + DiceBear avatar with animated level ring
- Name + level title + badge
- Member since + location
- Stats: Reviews | Orders | Badges | Following | Followers
- Badge showcase (expandable grid)
- If seller: link to shop
- Activity feed: public reviews, badges earned
- "Follow" button
```

### 18. HELP CENTER (`/help`)
```
Layout:
- Search bar (prominent)
- Category grid: Getting Started, Buying, Selling, Shipping, 
  Payments, Gamification, Account, Safety
- Popular articles list
- "Contact Support" CTA
- Help article page: clean typography, step-by-step instructions 
  with screenshots, related articles, "Was this helpful?" feedback
```

### 19. SELL WITH US PAGE (`/sell-with-us`)
```
Seller recruitment landing page:
- Moulna.svg logo prominently displayed
- Hero: "Turn Your Passion Into a Business with Moulna"
- Benefits grid: Low Fees, Easy Setup, Gamified Growth, UAE-focused,
  Analytics, Support
- Pricing tiers: Free (5 products) / Standard / Pro
- "How to Get Started" steps
- Seller testimonials with gold (#c7a34d) accent highlights
- FAQ
- "Start Selling on Moulna" CTA → links to /register or /seller/onboarding
```

### 20. PRICING PAGE (`/pricing`)
```
Two pricing sections:
A. Seller Plans:
  - Starter (Free): 5 products, basic analytics, standard support
  - Growth (XX AED/mo): 100 products, advanced analytics, priority support, coupons
  - Pro (XX AED/mo): Unlimited products, full analytics, flash sales, team members
  - Enterprise: Contact us
  
B. Commission Structure:
  - Table showing commission per category
  - Payment processing fees
  - "No listing fees" highlight

Feature comparison table
FAQ section
```

---

## 🔲 Required Dialogs & Modals

```
Create ALL as reusable components (even if dummy content inside):

1.  ConfirmDialog              — Generic confirm/cancel + destructive variant
2.  AddToCartDialog            — "Added to cart!" with product preview + XP earned + "Continue / Go to Cart"
3.  QuickViewDialog            — Product quick view (image + details + add to cart without leaving page)
4.  WriteReviewDialog          — Star rating + text + photo upload + XP preview
5.  ReportProductDialog        — Report reason selector + details textarea
6.  ReportSellerDialog         — Report reason + details
7.  ShareProductDialog         — Copy link, WhatsApp, Instagram, Twitter, embed code
8.  AddToWishlistDialog        — Wishlist folder selector + create new folder
9.  CouponApplyDialog          — Enter coupon code + validation feedback
10. AddressFormDialog          — Full address form for checkout/saved addresses
11. PaymentMethodDialog        — Add card form (Stripe elements mock)
12. OrderCancelDialog          — Cancel reason selector + confirm
13. ReturnRequestDialog        — Return reason + item selector + condition
14. RefundDialog               — Refund amount + reason (seller side)
15. TrackingNumberDialog       — Enter tracking number + carrier selector
16. MessageSellerDialog        — Quick message form (from product page)
17. FollowConfirmDialog        — Confirm follow + notification preference
18. BadgeDetailDialog          — Badge info: name, description, how to earn, date earned
19. LevelUpDialog              — 🎉 Celebration modal with new level + perks unlocked + confetti
20. XPEarnedToast              — Floating "+50 XP" toast with animation (not blocking)
21. DailyChallengeCompleteDialog — Challenge complete celebration + next challenge preview
22. StreakWarningDialog         — "Your streak is about to end! Log in tomorrow to keep it"
23. StreakReviveDialog          — "Revive your streak for 500 XP?" 
24. AvatarCustomizerDialog     — Quick avatar style/seed changer
25. CreateCouponDialog         — Seller coupon creation form
26. FlashSaleDialog            — Seller flash sale setup
27. BundleCreateDialog         — Bundle product selector + pricing
28. ShippingZoneDialog         — Shipping zone + rate configuration
29. InviteTeamMemberDialog     — Invite collaborator by email + role
30. ProductBulkActionDialog    — Bulk edit: price, stock, visibility, category
31. ImportProductsDialog       — CSV upload + column mapping
32. ExportDataDialog           — Format selector + filter + download
33. DeleteConfirmDialog        — Type shop name / product name to confirm
34. SellerApplicationDialog    — Admin: review seller application + approve/reject
35. GrantXPDialog              — Admin: manually grant XP to user
36. AssignBadgeDialog          — Admin: manually assign badge to user
37. CreateBadgeDialog          — Admin: badge creator form
38. CreateChallengeDialog      — Admin: challenge creator form
39. BannerManageDialog         — Admin: upload banner + set link + schedule
40. CommandPalette             — Cmd+K global search/navigation
41. NotificationPanel          — Slide-over notification list with XP notifications
42. CartDrawer                 — Slide-over cart (alternative to full page)
43. FilterDrawer               — Mobile filter panel (bottom sheet on mobile)
44. ImageLightboxDialog        — Full-screen image gallery viewer
45. SizeGuideDialog            — Product size guide table/image
```

---

## 🧩 Reusable Component Library

```
components/
├── ui/                             ← All shadcn/ui components
│
├── layout/
│   ├── Navbar.tsx                  ← Main nav with Moulna.svg logo, search, cart, avatar, notif
│   ├── SellerSidebar.tsx           ← Seller dashboard sidebar (gold #c7a34d accents)
│   ├── BuyerSidebar.tsx            ← Buyer dashboard sidebar (gold #c7a34d accents)
│   ├── AdminSidebar.tsx            ← Admin dashboard sidebar
│   ├── Footer.tsx                  ← Full footer with Moulna.svg logo
│   ├── PageHeader.tsx              ← Breadcrumb + title + description + actions
│   ├── MobileBottomNav.tsx         ← Mobile bottom tab bar (Shop, Explore, Cart, Profile, More)
│   └── StepHeader.tsx              ← Step indicator for multi-step flows
│
├── gamification/
│   ├── XPBar.tsx                   ← XP progress bar (current/next level) with glow
│   ├── XPPopup.tsx                 ← Floating "+XX XP" animation
│   ├── LevelBadge.tsx              ← Level number + title badge component
│   ├── LevelRing.tsx               ← Circular progress ring around avatar
│   ├── BadgeCard.tsx               ← Badge display (earned vs locked)
│   ├── BadgeGrid.tsx               ← Grid of badges with categories
│   ├── BadgeUnlockAnimation.tsx    ← Badge unlock celebration
│   ├── StreakCounter.tsx           ← Fire icon + streak count
│   ├── StreakCalendar.tsx          ← GitHub-style activity heatmap
│   ├── DailyChallenge.tsx          ← Challenge card with checkbox + XP
│   ├── DailyChallengePanel.tsx     ← Panel showing today's 3 challenges
│   ├── LeaderboardTable.tsx        ← Ranked table with medals for top 3
│   ├── LeaderboardCard.tsx         ← User's rank card
│   ├── AchievementToast.tsx        ← Toast notification for badge/level/streak
│   ├── ConfettiTrigger.tsx         ← Wrapper that triggers confetti effect
│   └── XPCounter.tsx               ← Animated number counter for XP
│
├── avatar/
│   ├── DiceBearAvatar.tsx          ← Component that renders DiceBear avatar from API
│   ├── AvatarWithLevel.tsx         ← Avatar + level ring + level badge combo
│   ├── AvatarCustomizer.tsx        ← Full customizer UI (style, seed, bg, accessories)
│   └── AvatarStylePicker.tsx       ← Grid of available styles (locked ones shown)
│
├── product/
│   ├── ProductCard.tsx             ← Standard product card for grids
│   ├── ProductCardHorizontal.tsx   ← Horizontal card for lists
│   ├── ProductImageGallery.tsx     ← Main image + thumbnails + zoom
│   ├── ProductBadge.tsx            ← "Trending", "New", "Handmade" badges
│   ├── ProductPrice.tsx            ← Price display with sale logic
│   ├── ProductRating.tsx           ← Star rating display
│   ├── ProductQuickView.tsx        ← Quick view overlay content
│   ├── VariantSelector.tsx         ← Color/size/option selector swatches
│   ├── QuantitySelector.tsx        ← +/- quantity input
│   ├── AddToCartButton.tsx         ← Cart button with XP preview
│   ├── WishlistButton.tsx          ← Heart toggle with animation
│   └── ProductCarousel.tsx         ← Embla carousel of product cards
│
├── shop/
│   ├── ShopCard.tsx                ← Shop preview card (for browse shops page)
│   ├── ShopHeader.tsx              ← Shop banner + avatar + info bar
│   ├── SellerBadge.tsx             ← Verified seller / artisan badge
│   └── SellerRatingBar.tsx         ← Seller rating with breakdown
│
├── order/
│   ├── OrderCard.tsx               ← Order summary card for lists
│   ├── OrderTimeline.tsx           ← Visual order status stepper
│   ├── OrderItemRow.tsx            ← Single item in order detail
│   └── TrackingInfo.tsx            ← Tracking number + carrier + link
│
├── review/
│   ├── ReviewCard.tsx              ← Review display with avatar + rating + text
│   ├── ReviewForm.tsx              ← Star selector + text + photo upload
│   ├── RatingSummary.tsx           ← Rating breakdown bar chart
│   └── HelpfulButton.tsx           ← "Was this helpful?" vote button
│
├── cart/
│   ├── CartItem.tsx                ← Cart line item with qty + remove
│   ├── CartSummary.tsx             ← Subtotal + shipping + total card
│   └── EmptyCart.tsx               ← Empty cart illustration + CTA
│
├── forms/
│   ├── FormField.tsx               ← Label + input + error + tooltip wrapper
│   ├── ImageUpload.tsx             ← Drag & drop with preview grid
│   ├── RichTextEditor.tsx          ← Tiptap wrapper
│   ├── TagSelector.tsx             ← Multi-select autocomplete
│   ├── DateTimePicker.tsx          ← Date + time combo picker
│   ├── LocationPicker.tsx          ← Emirate selector + address
│   ├── PriceInput.tsx              ← AED-prefixed number input
│   ├── PasswordInput.tsx           ← Show/hide + strength meter
│   ├── PhoneInput.tsx              ← UAE phone with +971 prefix
│   ├── StepWizard.tsx              ← Multi-step form container with step labels
│   └── CategoryTreeSelect.tsx      ← Hierarchical category picker
│
├── data/
│   ├── DataTable.tsx               ← TanStack Table wrapper
│   ├── StatsCard.tsx               ← Metric card (icon + label + value + trend)
│   ├── EmptyState.tsx              ← Illustrated empty state with CTA
│   ├── SkeletonLoader.tsx          ← Multiple skeleton variants
│   ├── InfiniteScroll.tsx          ← Scroll-based pagination
│   ├── SearchBar.tsx               ← Search with suggestions dropdown
│   └── FilterBar.tsx               ← Horizontal filter chips/dropdowns
│
├── feedback/
│   ├── StatusBadge.tsx             ← Color-coded status pills (order, product)
│   ├── ProgressSteps.tsx           ← Numbered step indicator
│   ├── TooltipHelp.tsx             ← (?) icon with popover explanation
│   └── CountdownTimer.tsx          ← Deal/flash sale countdown
│
└── special/
    ├── CommandPalette.tsx          ← Cmd+K search overlay
    ├── ThemeToggle.tsx             ← Light/Dark mode switch
    ├── LanguageToggle.tsx          ← EN/AR toggle
    ├── ShareButton.tsx             ← Share with WhatsApp, Insta, copy link
    ├── QRCode.tsx                  ← Order QR code generator
    └── MapEmbed.tsx                ← Mapbox embed for seller location
```

---

## 📊 Mock Data (`/lib/mock-data.ts` + `/lib/types.ts`)

```typescript
// Comprehensive typed mock data — include at minimum:

// Users
- 50 mock users with DiceBear avatars (url: `https://api.dicebear.com/9.x/adventurer/svg?seed={username}`)
- Each user: id, name, username, email, role, level, xp, badges[], streakDays,
  avatar: { style, seed, backgroundColor }, location (emirate), joinDate

// Products
- 100 mock products across 12 categories
- Each: id, title, description, images[], price, compareAtPrice, rating, reviewCount,
  seller, category, tags[], isHandmade, isTrending, isNew, stock, variants[], badges[]

// Sellers/Shops
- 20 mock shops with DiceBear avatars
- Each: id, shopName, slug, description, story, avatar, banner, level, xp,
  rating, totalSales, totalReviews, badges[], products[], location, joinDate

// Orders
- 30 mock orders with various statuses
- Each: id, buyer, seller, items[], status, total, shippingAddress, trackingNumber,
  createdAt, updatedAt, xpEarned

// Reviews
- 50 mock reviews with photos
- Each: id, product, buyer (with avatar + level), rating, text, photos[],
  helpfulCount, sellerResponse, createdAt

// Badges
- All 40+ badges defined in gamification system above

// Daily Challenges
- 10 challenge templates (3 randomly selected per day)

// Categories
- 12 main categories, each with 4-6 subcategories

// Collections
- 8 curated collections ("Ramadan Gifts", "UAE National Day", "Office Essentials",
  "Newborn Gifts", "Home Makeover", "Artisan Picks", "Under 50 AED", "Trending Now")

// Notifications
- 30 mock notifications (order updates, XP earned, badge unlocked, 
  price drop, seller response, streak warning)

// Blog Posts
- 10 mock posts

// Leaderboard Data
- 20 entries per leaderboard (buyers, sellers, reviewers)

// All with full TypeScript interfaces in /lib/types.ts
```

---

## ⚡ Performance & UX Requirements

```
1. Route transitions: Framer Motion AnimatePresence on page mounts
2. Skeleton screens: Every data-dependent component shows skeletons first
3. Optimistic updates: Wishlist, cart, review votes update UI instantly
4. Virtualized lists: TanStack Virtual for product grids > 50 items
5. Image optimization: Next/Image with blur placeholder for all product images
6. Command palette: Cmd+K opens global search/navigation anywhere
7. Keyboard shortcuts: Escape closes modals, arrow keys navigate
8. Toast notifications: Sonner for actions + custom XP toast for gamification
9. Form persistence: Auto-save to localStorage for multi-step forms
10. Responsive dialogs: Modal on desktop → Bottom sheet on mobile
11. Error boundaries: Per-section with retry button
12. 404/500 pages: Custom designed with illustrations and helpful links
13. XP animations: Non-blocking floating "+XP" popups on relevant actions
14. RTL-ready: All layouts should support RTL for Arabic toggle
15. PWA-ready: Service worker + manifest for installable mobile experience
16. Offline cart: Cart persists to localStorage for offline access
```

---

## 🔐 Auth Context (Mock)

```typescript
// AuthProvider wraps the entire app
// States: loading, authenticated, unauthenticated
// User object includes: id, name, email, role (buyer/seller/admin),
//   level, xp, badges, streakDays, avatar (DiceBear config)
// Mock login: any email + password "demo123" works
// Role switcher for development (toggle buyer/seller/admin)
// Persist to localStorage
// Protected routes redirect to /login
// Seller routes require seller role
// Admin routes require admin role
```

---

## 🎬 Animation Guidelines

```
Page enter:           fade-in + slide-up (200ms, ease-out)
Page exit:            fade-out (150ms)
Card hover:           translateY(-2px) + shadow increase (150ms)
Button press:         scale(0.98) (100ms)
Modal open:           backdrop fade + modal slide-up with spring
Modal close:          reverse of open
List items:           staggered fade-in (50ms delay between items)
Tab switch:           cross-fade with underline slide
Skeleton:             shimmer pulse (1.5s infinite)
XP popup:             float-up + fade-out (from trigger position, 1.5s)
Level up:             scale bounce + confetti burst + glow ring (2s)
Badge unlock:         flip reveal + sparkle particles (1.5s)
Streak fire:          gentle pulse/flicker animation (continuous)
Add to cart:          product image flies to cart icon (300ms)
Wishlist heart:       scale bounce + fill color (200ms)
Progress bar:         smooth width transition (500ms ease-out)
Counter:              number roll animation (react-countup)
Star rating:          sequential fill animation on hover
Notification:         slide-in from right (300ms)
Login streak:         slot-machine number roll for streak count
```

---

## 📝 Implementation Order

```
Phase 1 — Foundation:
  1. Tailwind + shadcn/ui + theme configuration
  2. Layout components (Navbar, Footer, Sidebars, Mobile nav)
  3. Auth pages + mock auth context
  4. DiceBear avatar component + customizer
  5. Gamification core: XP bar, level badge, streak counter, badge card
  6. Command palette

Phase 2 — Shopping Experience:
  7. Landing page
  8. Explore / browse page
  9. Product detail page
  10. Shop storefront page
  11. Cart + checkout flow
  12. Search + filters

Phase 3 — Buyer Dashboard:
  13. Dashboard home
  14. Orders list + detail
  15. Wishlist
  16. Reviews
  17. Rewards hub (XP, badges, challenges, leaderboard)
  18. Profile + avatar customizer
  19. Settings

Phase 4 — Seller Dashboard:
  20. Seller onboarding wizard
  21. Seller dashboard home
  22. Add/edit product flow
  23. Order management
  24. Analytics
  25. Promotions (coupons, flash sales)
  26. Finances
  27. Shop settings + branding

Phase 5 — Social & Community:
  28. Public profiles
  29. Messages
  30. Leaderboards (public)
  31. Help center
  32. Blog

Phase 6 — Admin:
  33. Admin dashboard
  34. User + seller management
  35. Product moderation
  36. Gamification admin (badges, challenges, XP events)
  37. Platform analytics + finances

Phase 7 — Polish:
  38. All remaining dialogs
  39. Marketing pages (About, How it Works, Sell With Us, Pricing)
  40. Legal pages
  41. 404/500 error pages
  42. Dark mode polish
  43. Mobile responsiveness pass
  44. RTL layout support
```

---

## 🚨 Critical Rules

```
1. Every page must be functional — mocked data, all interactions work, navigation works
2. Every dialog in the list must exist and open/close with proper animation
3. No // TODO or // Coming soon — implement at least a dummy version
4. Type everything — no `any` types, full TypeScript interfaces
5. No blank pages — always empty states with illustrations + CTAs
6. Mobile-first — test every page at 375px width
7. Dark mode works — every component respects theme
8. Gamification is visible everywhere — XP bar in sidebar, level badges on avatars,
   streak counter in header, XP callouts on actions
9. DiceBear avatars used consistently — every user display shows their DiceBear avatar
   (never a blank/default avatar)
10. Organized UX — breadcrumbs on every page, step indicators on every wizard,
    tooltips on complex fields, clear section headers
11. AED currency throughout — prices always formatted as "AED XX.XX"
12. XP rewards surfaced proactively — show "earn XX XP" before actions to motivate
13. Consistent card patterns — same card component reused everywhere
14. Progress bars everywhere — profile completion, shop setup, order status, level progress
15. Celebrate wins — confetti on milestones, animations on badge unlocks,
    celebration dialogs on level ups
```