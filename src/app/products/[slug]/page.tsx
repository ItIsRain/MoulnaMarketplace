"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { cn, formatAED, getDiscountPercentage } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Star, Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw,
  Minus, Plus, ChevronRight, Check, MessageCircle, ThumbsUp,
  Sparkles, Award, Clock, MapPin, ChevronLeft
} from "lucide-react";

// Mock product data
const PRODUCT = {
  id: "prd_1",
  title: "Handcrafted Arabian Oud Perfume - Premium Collection",
  slug: "handcrafted-arabian-oud-perfume",
  shortDescription: "Luxurious blend of authentic Arabian oud with hints of amber and sandalwood",
  description: `
    Experience the essence of Arabian luxury with our handcrafted Oud perfume.

    This premium fragrance is carefully blended using traditional methods passed down through generations. Each bottle contains authentic Agarwood (Oud) sourced from sustainable forests, combined with warm notes of amber, sandalwood, and a hint of rose.

    **Key Features:**
    - 100% Natural Ingredients
    - Long-lasting formula (12+ hours)
    - Handcrafted in the UAE
    - Comes in an elegant gift box

    **Notes:**
    - Top: Saffron, Bergamot
    - Heart: Rose, Oud, Geranium
    - Base: Amber, Sandalwood, Musk
  `,
  images: [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
    "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800",
    "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",
  ],
  priceFils: 45000,
  compareAtPriceFils: 55000,
  rating: 4.8,
  reviewCount: 124,
  stock: 15,
  category: "Perfumes & Oud",
  categorySlug: "perfume",
  isHandmade: true,
  isTrending: true,
  tags: ["oud", "perfume", "luxury", "handmade", "gift"],
  variants: [
    { name: "Size", options: ["50ml", "100ml", "150ml"] },
  ],
  xpReward: 45,
  seller: {
    id: "shp_1",
    name: "Scent of Arabia",
    slug: "scent-of-arabia",
    avatar: "scent-arabia",
    level: 6,
    rating: 4.9,
    totalSales: 1250,
    joinDate: "2022",
    isVerified: true,
    location: "Dubai",
    responseTime: "Within 2 hours",
  },
};

const REVIEWS = [
  {
    id: "rvw_1",
    user: { name: "Ahmed K.", avatar: "ahmed-k", level: 5 },
    rating: 5,
    text: "Absolutely stunning fragrance! The oud is authentic and the longevity is impressive. Received so many compliments wearing this.",
    date: "2 weeks ago",
    helpful: 24,
    isVerifiedPurchase: true,
    photos: ["https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=200"],
  },
  {
    id: "rvw_2",
    user: { name: "Sara M.", avatar: "sara-m", level: 3 },
    rating: 5,
    text: "Perfect gift for my husband. The packaging was beautiful and the scent is divine. Will definitely order again!",
    date: "1 month ago",
    helpful: 18,
    isVerifiedPurchase: true,
  },
  {
    id: "rvw_3",
    user: { name: "Mohammed R.", avatar: "mohammed-r", level: 7 },
    rating: 4,
    text: "Great quality oud. Slightly stronger than I expected but it mellows nicely after an hour. Overall very happy with my purchase.",
    date: "1 month ago",
    helpful: 12,
    isVerifiedPurchase: true,
  },
];

const RELATED_PRODUCTS = [
  {
    id: "prd_2",
    title: "Rose Oud Mist",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
    priceFils: 22000,
    rating: 4.7,
  },
  {
    id: "prd_3",
    title: "Amber Bakhoor Set",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=400",
    priceFils: 35000,
    rating: 4.9,
  },
  {
    id: "prd_4",
    title: "Traditional Oud Burner",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400",
    priceFils: 18500,
    rating: 4.6,
  },
  {
    id: "prd_5",
    title: "Premium Oud Chips",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    priceFils: 89000,
    rating: 5.0,
  },
];

export default function ProductPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState("50ml");
  const [quantity, setQuantity] = React.useState(1);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [showAllReviews, setShowAllReviews] = React.useState(false);

  const product = PRODUCT; // In real app, fetch by slug

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/explore" className="hover:text-foreground">Explore</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/explore?category=${product.categorySlug}`} className="hover:text-foreground">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 start-4 flex flex-col gap-2">
                  {product.isTrending && <Badge variant="trending">Trending</Badge>}
                  {product.isHandmade && <Badge variant="handmade">Handmade</Badge>}
                  {product.compareAtPriceFils && (
                    <Badge variant="default" className="bg-red-500">
                      -{getDiscountPercentage(product.priceFils, product.compareAtPriceFils)}% OFF
                    </Badge>
                  )}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                  className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/50 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-black/50 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImage === index
                        ? "border-moulna-gold"
                        : "border-transparent hover:border-moulna-gold/50"
                    )}
                  >
                    <Image src={image} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title & Rating */}
              <div>
                <h1 className="font-display text-3xl font-bold mb-3">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-5 h-5",
                            star <= Math.round(product.rating)
                              ? "fill-moulna-gold text-moulna-gold"
                              : "text-muted"
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <Link href="#reviews" className="text-muted-foreground hover:text-foreground">
                    {product.reviewCount} reviews
                  </Link>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{formatAED(product.priceFils)}</span>
                {product.compareAtPriceFils && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatAED(product.compareAtPriceFils)}
                  </span>
                )}
                {/* XP Reward */}
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-moulna-gold text-white text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>+{product.xpReward} XP</span>
                </div>
              </div>

              <p className="text-muted-foreground">{product.shortDescription}</p>

              <Separator />

              {/* Variant Selection */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <div className="flex gap-3">
                    {product.variants[0].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedSize(option)}
                        className={cn(
                          "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                          selectedSize === option
                            ? "border-moulna-gold bg-moulna-gold/10 text-moulna-gold"
                            : "border-muted hover:border-moulna-gold/50"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.stock} available
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button variant="gold" size="lg" className="flex-1">
                  <ShoppingCart className="w-5 h-5 me-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-500 text-red-500")} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: "Free Shipping", sublabel: "Orders over AED 150" },
                  { icon: Shield, label: "Buyer Protection", sublabel: "Full refund guarantee" },
                  { icon: RotateCcw, label: "Easy Returns", sublabel: "14-day return policy" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 rounded-lg bg-muted/50">
                    <item.icon className="w-5 h-5 mx-auto mb-1 text-moulna-gold" />
                    <p className="text-xs font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Seller Card */}
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <Link href={`/shops/${product.seller.slug}`}>
                    <DiceBearAvatar
                      seed={product.seller.avatar}
                      size="xl"
                      className="rounded-xl"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/shops/${product.seller.slug}`}
                        className="font-semibold hover:text-moulna-gold transition-colors"
                      >
                        {product.seller.name}
                      </Link>
                      <LevelBadge level={product.seller.level} size="sm" />
                      {product.seller.isVerified && (
                        <Badge variant="gold" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-moulna-gold text-moulna-gold" />
                        {product.seller.rating}
                      </span>
                      <span>{product.seller.totalSales.toLocaleString()} sales</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {product.seller.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Typically responds {product.seller.responseTime}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 me-2" />
                    Contact
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="border-b">
              <div className="flex gap-8">
                {["Description", "Reviews", "Shipping"].map((tab, i) => (
                  <button
                    key={tab}
                    className={cn(
                      "pb-4 px-1 text-sm font-medium border-b-2 transition-colors",
                      i === 0
                        ? "border-moulna-gold text-moulna-gold"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-8">
              <div className="prose dark:prose-invert max-w-none">
                <p>{product.description}</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section id="reviews" className="mt-8">
            <h2 className="font-display text-2xl font-bold mb-6">Customer Reviews</h2>

            {/* Rating Summary */}
            <Card className="p-6 mb-8">
              <div className="flex items-start gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{product.rating}</div>
                  <div className="flex justify-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-5 h-5",
                          star <= Math.round(product.rating)
                            ? "fill-moulna-gold text-moulna-gold"
                            : "text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{product.reviewCount} reviews</p>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const percentage = stars === 5 ? 72 : stars === 4 ? 20 : stars === 3 ? 5 : 2;
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm w-8">{stars} ★</span>
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>

                <Button variant="gold">
                  Write a Review
                  <Sparkles className="w-4 h-4 ms-2" />
                </Button>
              </div>
            </Card>

            {/* Review List */}
            <div className="space-y-6">
              {REVIEWS.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <DiceBearAvatar seed={review.user.avatar} size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.user.name}</span>
                        <LevelBadge level={review.user.level} size="sm" />
                        {review.isVerifiedPurchase && (
                          <Badge variant="outline" className="text-xs">
                            <Check className="w-3 h-3 me-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-4 h-4",
                                star <= review.rating
                                  ? "fill-moulna-gold text-moulna-gold"
                                  : "text-muted"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground mb-3">{review.text}</p>

                      {review.photos && (
                        <div className="flex gap-2 mb-3">
                          {review.photos.map((photo, i) => (
                            <div key={i} className="w-20 h-20 rounded-lg overflow-hidden">
                              <Image src={photo} alt="" width={80} height={80} className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          </section>

          {/* Related Products */}
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {RELATED_PRODUCTS.map((item) => (
                <Card key={item.id} hover className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-1 mb-1">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{formatAED(item.priceFils)}</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-moulna-gold text-moulna-gold" />
                        {item.rating}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
