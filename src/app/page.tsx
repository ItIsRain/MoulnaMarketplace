"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Star,
  Heart,
  TrendingUp,
  Loader2,
  UserPlus,
  Store,
  MapPin,
  Package,
  Trophy,
  Shield,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { formatAED } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import type { Product, Shop } from "@/lib/types";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// ─── Seasonal Campaigns ───

interface SeasonalCampaign {
  slug: string;
  title: string;
  description: string;
  image: string;
  gradient: string;
  badge: string;
}

const SEASONAL_CAMPAIGNS: { start: string; end: string; campaign: SeasonalCampaign }[] = [
  // Ramadan (approx late Feb – late Mar 2026)
  {
    start: "02-15",
    end: "03-25",
    campaign: {
      slug: "ramadan-sale",
      title: "Ramadan Kareem",
      description: "Discover handcrafted gifts, oud collections, and special Ramadan bundles from UAE's finest artisans. Exclusive deals throughout the holy month.",
      image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80",
      gradient: "from-purple-900/80 via-indigo-900/60 to-transparent",
      badge: "Ramadan Special",
    },
  },
  // Eid Al Fitr (late Mar – mid Apr)
  {
    start: "03-26",
    end: "04-15",
    campaign: {
      slug: "eid-al-fitr-sale",
      title: "Eid Mubarak",
      description: "Celebrate Eid with stunning handmade gifts, festive home décor, and exclusive collections. Treat yourself and your loved ones.",
      image: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=1200&q=80",
      gradient: "from-emerald-900/80 via-teal-900/60 to-transparent",
      badge: "Eid Collection",
    },
  },
  // Summer Sale (Jun – Aug)
  {
    start: "06-01",
    end: "08-31",
    campaign: {
      slug: "summer-sale",
      title: "Summer Sale",
      description: "Beat the heat with cool deals! Up to 50% off on handmade accessories, home fragrances, and artisan crafts all summer long.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      gradient: "from-orange-900/80 via-amber-900/60 to-transparent",
      badge: "Summer Deals",
    },
  },
  // Back to School (Sep)
  {
    start: "09-01",
    end: "09-30",
    campaign: {
      slug: "back-to-school",
      title: "Back to School",
      description: "Start the new school year with unique handmade stationery, calligraphy sets, and personalized accessories for students.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
      gradient: "from-blue-900/80 via-sky-900/60 to-transparent",
      badge: "School Season",
    },
  },
  // UAE National Day (Nov 15 – Dec 10)
  {
    start: "11-15",
    end: "12-10",
    campaign: {
      slug: "national-day-sale",
      title: "UAE National Day",
      description: "Celebrate the spirit of the union with proudly Emirati crafts, heritage items, and patriotic collections from local artisans.",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
      gradient: "from-red-900/80 via-rose-900/60 to-transparent",
      badge: "National Day",
    },
  },
  // Year-End / New Year (Dec 11 – Jan 10)
  {
    start: "12-11",
    end: "01-10",
    campaign: {
      slug: "new-year-sale",
      title: "New Year, New Finds",
      description: "Ring in the new year with exclusive artisan collections. Handpicked gifts, limited editions, and festive deals to start fresh.",
      image: "https://images.unsplash.com/photo-1482245294234-b3f2f8d5f1a4?w=1200&q=80",
      gradient: "from-violet-900/80 via-purple-900/60 to-transparent",
      badge: "New Year Sale",
    },
  },
  // Dubai Shopping Festival (Jan 11 – Feb 14)
  {
    start: "01-11",
    end: "02-14",
    campaign: {
      slug: "dsf-sale",
      title: "Dubai Shopping Festival",
      description: "The biggest shopping event in the region! Explore thousands of handmade products with exclusive DSF deals and surprise discounts.",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80",
      gradient: "from-cyan-900/80 via-blue-900/60 to-transparent",
      badge: "DSF Deals",
    },
  },
];

// Default campaign when nothing else matches
const DEFAULT_CAMPAIGN: SeasonalCampaign = {
  slug: "deals",
  title: "Explore What's New",
  description: "Discover the latest handmade products, artisan collections, and exclusive finds from UAE's best creators.",
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  gradient: "from-neutral-900/80 via-neutral-800/60 to-transparent",
  badge: "Featured",
};

function getCurrentCampaign(): SeasonalCampaign {
  const now = new Date();
  const mmdd = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  for (const { start, end, campaign } of SEASONAL_CAMPAIGNS) {
    // Handle year-wrap (e.g., Dec 11 – Jan 10)
    if (start > end) {
      if (mmdd >= start || mmdd <= end) return campaign;
    } else {
      if (mmdd >= start && mmdd <= end) return campaign;
    }
  }

  return DEFAULT_CAMPAIGN;
}


// ─── Seasonal Banner Component ───

function SeasonalBanner() {
  const campaign = getCurrentCampaign();

  return (
    <section className="py-10 lg:py-16 bg-background">
      <div className="container-app">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Link href={`/explore/${campaign.slug}`}>
            <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
              {/* Background Image */}
              <div className="relative h-[280px] md:h-[360px] lg:h-[420px]">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${campaign.gradient}`} />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 lg:px-20">
                <Badge variant="gold" className="w-fit mb-4 text-sm px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  {campaign.badge}
                </Badge>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gold-gradient mb-3 max-w-xl drop-shadow-lg">
                  {campaign.title}
                </h2>

                <p className="text-white/80 text-sm md:text-base lg:text-lg max-w-lg leading-relaxed line-clamp-3">
                  {campaign.description}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Trending products loaded from API - see TrendingSection component below

function TrendingSection() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/products?sort=trending&limit=8")
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container-app">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">Hot Right Now</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-display font-bold">
              Trending Products
            </motion.h2>
          </div>
          <motion.div variants={fadeInUp}>
            <Link href="/explore?sort=trending">
              <Button variant="ghost" className="gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No products yet. Be the first to list!</p>
            <Button variant="gold" className="mt-4" asChild>
              <Link href="/seller/products/new">Add Listing</Link>
            </Button>
          </Card>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={scaleIn}>
                <Link href={`/products/${product.slug}`}>
                  <Card hover className="overflow-hidden group">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                          No image
                        </div>
                      )}
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
                        {product.isSponsored && (
                          <Badge variant="sponsored">Sponsored</Badge>
                        )}
                        {product.isTrending && (
                          <Badge variant="trending">Trending</Badge>
                        )}
                        {product.isNew && (
                          <Badge variant="new">New</Badge>
                        )}
                        {product.isHandmade && (
                          <Badge variant="handmade">Handmade</Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 truncate">{product.title}</h3>

                      {/* Seller */}
                      <div className="flex items-center gap-2 mb-2">
                        <ShopAvatar
                          avatarSeed={product.seller.avatarSeed || product.seller.name}
                          avatarStyle={product.seller.avatarStyle}
                          name={product.seller.name}
                          size="xs"
                        />
                        <span className="text-xs text-muted-foreground truncate">
                          {product.seller.name}
                        </span>
                        <LevelBadge level={product.seller.level} size="sm" />
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-moulna-gold">
                          {formatAED(product.priceFils)}
                        </span>
                        {product.compareAtPriceFils && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatAED(product.compareAtPriceFils)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function FollowedSellersSection() {
  const { isAuthenticated } = useAuthStore();
  const [shops, setShops] = React.useState<Shop[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    async function fetchFollowed() {
      try {
        const res = await fetch("/api/shops/following");
        if (res.ok) {
          const data = await res.json();
          setShops(data.shops || []);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchFollowed();
  }, [isAuthenticated]);

  // Don't show section if not logged in or not following anyone
  if (!isAuthenticated || (!loading && shops.length === 0)) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-app flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-moulna-gold" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container-app">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-2">
              <Store className="w-5 h-5 text-moulna-gold" />
              <span className="text-sm font-medium text-moulna-gold">Your Favorites</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-display font-bold">
              Sellers You Follow
            </motion.h2>
          </div>
          <motion.div variants={fadeInUp}>
            <Link href="/explore/shops">
              <Button variant="ghost" className="gap-1">
                Browse All Sellers <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {shops.map((shop) => (
            <motion.div key={shop.id} variants={scaleIn}>
              <Link href={`/shops/${shop.slug}`}>
                <Card hover className="overflow-hidden group">
                  {/* Cover Image */}
                  <div className="relative h-32 overflow-hidden">
                    {shop.bannerUrl ? (
                      <Image
                        src={shop.bannerUrl}
                        alt={shop.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-moulna-gold/20 via-amber-50 to-moulna-gold/10 group-hover:scale-105 transition-transform duration-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {shop.isVerified && (
                      <Badge variant="verified" className="absolute top-3 end-3 text-xs">
                        <Shield className="w-3 h-3 me-1" />
                        ID Verified
                      </Badge>
                    )}
                  </div>

                  {/* Seller Info */}
                  <div className="relative px-4 pb-4 pt-7">
                    <div className="absolute -top-6 left-4">
                      <ShopAvatar
                        logoUrl={shop.logoUrl}
                        avatarSeed={shop.avatarSeed || shop.slug}
                        avatarStyle={shop.avatarStyle}
                        name={shop.name}
                        size="lg"
                        className="border-2 border-background shadow-md"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0 ml-14">
                        <h3 className="font-semibold truncate">{shop.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        {shop.totalListings} listings
                      </span>
                      {shop.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {shop.location}
                        </span>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <UserPlus className="w-3.5 h-3.5" />
                      Following
                    </Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Social Proof Bar (live stats) ───

interface PlatformStats {
  totalProducts: number;
  totalSellers: number;
  totalUsers: number;
}

function SocialProofBar() {
  const [stats, setStats] = React.useState<PlatformStats | null>(null);

  React.useEffect(() => {
    fetch("/api/platform/stats")
      .then((res) => res.json())
      .then((data: PlatformStats) => setStats(data))
      .catch(() => {});
  }, []);

  const fmt = (n: number) => n.toLocaleString() + "+";

  return (
    <section className="bg-card shadow-sm">
      <div className="container-app py-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 text-center"
        >
          <div>
            <p className="text-2xl font-bold text-moulna-gold">
              {stats ? fmt(stats.totalProducts) : "\u2026"}
            </p>
            <p className="text-sm text-muted-foreground">Products</p>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block" />
          <div>
            <p className="text-2xl font-bold text-moulna-gold">
              {stats ? fmt(stats.totalSellers) : "\u2026"}
            </p>
            <p className="text-sm text-muted-foreground">Sellers</p>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block" />
          <div>
            <p className="text-2xl font-bold text-moulna-gold">
              {stats ? fmt(stats.totalUsers) : "\u2026"}
            </p>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Seller of the Week (dynamic) ───

interface SOTWData {
  seller: {
    id: string;
    headline: string | null;
    description: string | null;
    imageUrl: string | null;
    shop: {
      id: string;
      name: string;
      slug: string;
      avatar_style: string;
      avatar_seed: string | null;
      total_listings: number;
      location: string | null;
      is_verified: boolean;
      category: string | null;
    };
  } | null;
}

function SellerOfTheWeekSection() {
  const [data, setData] = React.useState<SOTWData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/ads/seller-of-week/current")
      .then((res) => res.json())
      .then((d: SOTWData) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  // If no active SOTW, show a CTA for sellers
  if (!data?.seller) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-app">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-moulna-gold" />
              <span className="text-sm font-medium text-moulna-gold">Featured Creator</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-display font-bold mb-8">
              Seller of the Week
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <Card className="p-8 text-center">
                <Trophy className="w-12 h-12 text-moulna-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Want to be featured here?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Get your shop featured on the Moulna homepage for an entire week.
                  Reach thousands of potential customers!
                </p>
                <Link href="/seller/promotions/seller-of-week">
                  <Button variant="gold" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Become Seller of the Week
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  const { seller } = data;
  const shop = seller.shop;

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container-app">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-moulna-gold" />
            <span className="text-sm font-medium text-moulna-gold">Featured Creator</span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-display font-bold mb-8">
            Seller of the Week
          </motion.h2>

          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Seller Image */}
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={seller.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800"}
                    alt="Seller of the Week"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent lg:bg-gradient-to-t" />
                  <Badge variant="gold" className="absolute top-4 left-4 text-sm px-3 py-1">
                    <Trophy className="w-4 h-4 mr-1" />
                    Seller of the Week
                  </Badge>
                </div>

                {/* Seller Details */}
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <ShopAvatar
                      avatarSeed={shop.avatar_seed || shop.slug}
                      avatarStyle={shop.avatar_style}
                      name={shop.name}
                      size="xl"
                      className="border-2 border-moulna-gold shadow-md"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{shop.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {seller.headline || shop.category || "Featured Seller"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {shop.is_verified && (
                          <Badge variant="gold" className="text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    {seller.description || `Discover amazing products from ${shop.name} — this week's featured seller on Moulna.`}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold text-moulna-gold">{shop.total_listings}</p>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold text-moulna-gold">{shop.location || "UAE"}</p>
                      <p className="text-xs text-muted-foreground">Location</p>
                    </div>
                  </div>

                  <Link href={`/shops/${shop.slug}`}>
                    <Button variant="gold" className="w-full sm:w-auto gap-2">
                      View Page <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-mesh-gold pattern-arabic">
          <div className="container-app py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="text-center lg:text-left"
              >
                <motion.div variants={fadeInUp} className="mb-4">
                  <Badge variant="gold" className="text-sm px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    UAE's #1 Artisan Marketplace
                  </Badge>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-2xl sm:text-4xl lg:text-6xl font-display font-bold leading-tight mb-6"
                >
                  Discover{" "}
                  <span className="text-gold-gradient">Unique,</span>
                  <br />
                  Handmade & Local
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
                >
                  Browse UAE's finest creators — connect directly with sellers.
                  Level up, collect badges, and unlock exclusive perks!
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link href="/explore">
                    <Button size="xl" className="w-full sm:w-auto gap-2">
                      Explore Products
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/sell-with-us">
                    <Button variant="outline" size="xl" className="w-full sm:w-auto">
                      Become a Seller
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="mt-8 flex items-center gap-2 justify-center lg:justify-start text-sm"
                >
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-moulna-gold-50 dark:bg-moulna-gold/10">
                    <Sparkles className="w-4 h-4 text-moulna-gold" />
                    <span className="font-semibold text-moulna-gold-dark dark:text-moulna-gold">
                      Earn 100 XP
                    </span>
                    <span className="text-muted-foreground">just for signing up!</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right - Product Showcase */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  {/* Floating Product Cards */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-48 bg-card rounded-2xl shadow-xl p-3"
                  >
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-rose-100 to-pink-50 mb-2 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200"
                        alt="Jewelry"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-semibold text-sm truncate">Pearl Earrings</p>
                    <p className="text-moulna-gold font-bold">AED 185</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-20 right-0 w-52 bg-card rounded-2xl shadow-xl p-3"
                  >
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 mb-2 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=200"
                        alt="Perfume"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-semibold text-sm truncate">Oud Perfume</p>
                    <div className="flex items-center justify-between">
                      <p className="text-moulna-gold font-bold">AED 450</p>
                      <Badge variant="trending" className="text-[10px]">Trending</Badge>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-10 left-10 w-44 bg-card rounded-2xl shadow-xl p-3"
                  >
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 mb-2 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=200"
                        alt="Art"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-semibold text-sm truncate">Calligraphy Art</p>
                    <p className="text-moulna-gold font-bold">AED 280</p>
                  </motion.div>

                  {/* Decorative Elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-moulna-gold/20 to-transparent blur-3xl" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Wave Decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Social Proof Bar */}
        <SocialProofBar />

        {/* Seasonal Campaign Banner */}
        <SeasonalBanner />

        {/* Seller of the Week */}
        <SellerOfTheWeekSection />

        {/* Trending Products */}
        <TrendingSection />

        {/* Sellers You Follow */}
        <FollowedSellersSection />
      </main>

      <Footer />
    </>
  );
}
