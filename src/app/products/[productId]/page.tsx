"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Star, Heart, ShoppingCart, Share2, Truck, Shield, Gift,
  ChevronRight, Minus, Plus, MessageSquare, CheckCircle,
  Package, Clock, MapPin
} from "lucide-react";

const PRODUCT = {
  id: "1",
  name: "Premium Oud Collection Set",
  description: `Experience the finest Arabian oud with our Premium Collection Set. This carefully curated set includes three distinct oud varieties, each sourced from the finest regions and aged to perfection.

The collection features:
• Cambodian Oud - Deep, woody notes with hints of leather
• Indian Oud - Rich, earthy tones with subtle sweetness
• Indonesian Oud - Light, floral undertones with creamy finish

Each bottle contains 10ml of pure oud oil, presented in hand-crafted glass bottles with traditional Arabic designs. Perfect for gifting or personal collection.`,
  price: 450,
  originalPrice: 550,
  rating: 4.9,
  reviews: 156,
  category: "Oud",
  stock: 15,
  sku: "OUD-PREM-001",
  images: ["/products/oud-1.jpg", "/products/oud-2.jpg", "/products/oud-3.jpg"],
  features: [
    "100% Natural Oud Oil",
    "Hand-selected Premium Quality",
    "Traditional Glass Bottles",
    "Gift Box Included",
  ],
  seller: {
    name: "Arabian Scents Boutique",
    avatar: "arabian-scents",
    rating: 4.9,
    reviews: 456,
    verified: true,
    responseTime: "Usually responds within 1 hour",
  },
  shipping: {
    freeOver: 200,
    estimatedDelivery: "2-3 business days",
    locations: ["Dubai", "Abu Dhabi", "All UAE"],
  },
  xpReward: 45,
};

const REVIEWS = [
  {
    id: "1",
    user: { name: "Sarah Ahmed", avatar: "sarah-ahmed", level: 6 },
    rating: 5,
    date: "2 days ago",
    content: "Absolutely amazing quality! The scent is authentic and long-lasting. Highly recommend!",
    helpful: 24,
  },
  {
    id: "2",
    user: { name: "Mohammed Ali", avatar: "mohammed-ali", level: 4 },
    rating: 5,
    date: "1 week ago",
    content: "Perfect gift for my wife. The packaging was beautiful and it arrived in perfect condition.",
    helpful: 18,
  },
];

export default function ProductPage() {
  const params = useParams();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/explore" className="hover:text-foreground">Explore</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/explore/categories/${PRODUCT.category.toLowerCase()}`} className="hover:text-foreground">
            {PRODUCT.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{PRODUCT.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden">
              {/* Main image placeholder */}
            </div>
            <div className="flex gap-4">
              {PRODUCT.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "w-20 h-20 rounded-lg bg-gradient-to-br from-muted to-muted/50 border-2 transition-all",
                    selectedImage === index
                      ? "border-moulna-gold"
                      : "border-transparent hover:border-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <Badge variant="secondary" className="mb-2">{PRODUCT.category}</Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">{PRODUCT.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{PRODUCT.rating}</span>
                  <span className="text-muted-foreground">({PRODUCT.reviews} reviews)</span>
                </div>
                <span className="text-muted-foreground">SKU: {PRODUCT.sku}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">AED {PRODUCT.price}</span>
              {PRODUCT.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    AED {PRODUCT.originalPrice}
                  </span>
                  <Badge className="bg-red-500 text-white">
                    {Math.round((1 - PRODUCT.price / PRODUCT.originalPrice) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* XP Reward */}
            <div className="flex items-center gap-2 p-3 bg-moulna-gold/10 rounded-lg">
              <Gift className="w-5 h-5 text-moulna-gold" />
              <span className="text-sm">
                Earn <strong className="text-moulna-gold">{PRODUCT.xpReward} XP</strong> with this purchase!
              </span>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(PRODUCT.stock, quantity + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {PRODUCT.stock} items available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 bg-moulna-gold hover:bg-moulna-gold-dark">
                <ShoppingCart className="w-5 h-5 me-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(isWishlisted && "text-red-500 border-red-500")}
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-500")} />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {PRODUCT.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Shipping */}
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-moulna-gold mt-0.5" />
                <div>
                  <p className="font-medium mb-1">
                    Free shipping on orders over AED {PRODUCT.shipping.freeOver}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estimated delivery: {PRODUCT.shipping.estimatedDelivery}
                  </p>
                </div>
              </div>
            </Card>

            {/* Seller */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <Link href={`/shops/${PRODUCT.seller.avatar}`} className="flex items-center gap-3">
                  <DiceBearAvatar seed={PRODUCT.seller.avatar} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{PRODUCT.seller.name}</span>
                      {PRODUCT.seller.verified && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          <CheckCircle className="w-3 h-3 me-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {PRODUCT.seller.rating} ({PRODUCT.seller.reviews} reviews)
                    </div>
                  </div>
                </Link>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 me-1" />
                  Message
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Description & Reviews */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Product Description</h2>
              <div className="prose prose-gray max-w-none">
                {PRODUCT.description.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4 last:mb-0 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            {/* Reviews Section */}
            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Customer Reviews</h2>
                <Button variant="outline">Write a Review</Button>
              </div>
              <div className="space-y-6">
                {REVIEWS.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <DiceBearAvatar seed={review.user.avatar} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user.name}</span>
                          <LevelBadge level={review.user.level} size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-4 h-4",
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.content}</p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Protection */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-moulna-gold" />
                Buyer Protection
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Full refund if item not received</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Full or partial refund if not as described</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>14-day return policy</span>
                </li>
              </ul>
            </Card>

            {/* Delivery */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-moulna-gold" />
                Delivery Options
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Dubai</span>
                  </div>
                  <span className="font-medium">1-2 days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Abu Dhabi</span>
                  </div>
                  <span className="font-medium">2-3 days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Other UAE</span>
                  </div>
                  <span className="font-medium">3-5 days</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
