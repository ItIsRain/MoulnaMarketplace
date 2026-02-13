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
  Star, ThumbsUp, MessageSquare, Filter, Image,
  CheckCircle, ArrowUpDown, Camera
} from "lucide-react";

const SHOP_DATA = {
  name: "Arabian Scents Boutique",
  slug: "arabian-scents",
  avatar: "arabian-scents",
  rating: 4.9,
  reviewCount: 456,
  verified: true,
};

const RATING_BREAKDOWN = [
  { stars: 5, count: 380, percentage: 83 },
  { stars: 4, count: 52, percentage: 11 },
  { stars: 3, count: 15, percentage: 3 },
  { stars: 2, count: 6, percentage: 1 },
  { stars: 1, count: 3, percentage: 1 },
];

const REVIEWS = [
  {
    id: "1",
    user: { name: "Sarah Ahmed", avatar: "sarah-ahmed", level: 6 },
    rating: 5,
    date: "2 days ago",
    product: "Premium Oud Collection Set",
    title: "Absolutely amazing quality!",
    content: "The scent is authentic and long-lasting. I've tried many oud products but this collection is by far the best. The packaging was beautiful and it arrived in perfect condition. Highly recommend this shop!",
    helpful: 24,
    hasPhotos: true,
    verified: true,
    reply: {
      content: "Thank you so much for your kind words, Sarah! We're thrilled you love the collection. 🙏",
      date: "1 day ago",
    },
  },
  {
    id: "2",
    user: { name: "Mohammed Ali", avatar: "mohammed-ali", level: 4 },
    rating: 5,
    date: "1 week ago",
    product: "Arabian Nights Perfume 100ml",
    title: "Perfect gift for my wife",
    content: "My wife loved this perfume! The fragrance is elegant and not overpowering. Will definitely be ordering more from this shop.",
    helpful: 18,
    hasPhotos: false,
    verified: true,
  },
  {
    id: "3",
    user: { name: "Fatima Hassan", avatar: "fatima-hassan", level: 8 },
    rating: 4,
    date: "2 weeks ago",
    product: "Traditional Bakhoor Set",
    title: "Great quality, minor packaging issue",
    content: "The bakhoor itself is excellent quality and smells amazing. Only giving 4 stars because one of the containers was slightly damaged during shipping, but the seller quickly offered a replacement.",
    helpful: 12,
    hasPhotos: true,
    verified: true,
    reply: {
      content: "Thank you for your feedback, Fatima! We're sorry about the packaging issue and glad we could resolve it for you.",
      date: "2 weeks ago",
    },
  },
  {
    id: "4",
    user: { name: "Ahmed Khalid", avatar: "ahmed-khalid", level: 3 },
    rating: 5,
    date: "3 weeks ago",
    product: "Luxury Oud Chips 50g",
    title: "Best oud chips in the UAE",
    content: "I've been buying oud for years and these are some of the finest chips I've ever used. The aroma fills the whole house. Worth every dirham!",
    helpful: 31,
    hasPhotos: true,
    verified: true,
  },
];

const FILTER_OPTIONS = [
  { id: "all", label: "All Reviews" },
  { id: "5", label: "5 Stars" },
  { id: "4", label: "4 Stars" },
  { id: "3", label: "3 Stars" },
  { id: "photos", label: "With Photos" },
];

export default function ShopReviewsPage() {
  const params = useParams();
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("recent");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Shop Header */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <DiceBearAvatar seed={SHOP_DATA.avatar} size="lg" className="w-16 h-16" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{SHOP_DATA.name}</h1>
                {SHOP_DATA.verified && (
                  <Badge className="bg-blue-100 text-blue-700">Verified</Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{SHOP_DATA.rating}</span>
                <span className="text-muted-foreground">
                  ({SHOP_DATA.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="ms-auto">
              <Button variant="outline" asChild>
                <Link href={`/shops/${params.shopSlug}`}>View Shop</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Rating Summary */}
            <Card className="p-6 mb-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-moulna-gold mb-1">
                  {SHOP_DATA.rating}
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= Math.round(SHOP_DATA.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {SHOP_DATA.reviewCount} reviews
                </p>
              </div>

              <div className="space-y-2">
                {RATING_BREAKDOWN.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating.stars}★</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${rating.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-10">
                      {rating.count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filters */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter Reviews
              </h3>
              <div className="space-y-2">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedFilter(option.id)}
                    className={cn(
                      "block w-full text-start px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedFilter === option.id
                        ? "bg-moulna-gold/10 text-moulna-gold font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Reviews */}
          <div className="lg:col-span-3">
            {/* Sort */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Customer Reviews</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {REVIEWS.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <DiceBearAvatar seed={review.user.avatar} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.user.name}</span>
                            <LevelBadge level={review.user.level} size="sm" />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
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
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 me-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>

                    {/* Product */}
                    <p className="text-sm text-muted-foreground mb-2">
                      Purchased: <span className="text-foreground">{review.product}</span>
                    </p>

                    {/* Content */}
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                    <p className="text-muted-foreground mb-4">{review.content}</p>

                    {/* Photos */}
                    {review.hasPhotos && (
                      <div className="flex gap-2 mb-4">
                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                          <Camera className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                          <Camera className="w-6 h-6 text-muted-foreground" />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-4 h-4 me-1" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4 me-1" />
                        Reply
                      </Button>
                    </div>

                    {/* Seller Reply */}
                    {review.reply && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border-s-4 border-moulna-gold">
                        <div className="flex items-center gap-2 mb-2">
                          <DiceBearAvatar seed={SHOP_DATA.avatar} size="xs" />
                          <span className="font-medium text-sm">
                            {SHOP_DATA.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">Seller</Badge>
                          <span className="text-xs text-muted-foreground">
                            {review.reply.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.reply.content}
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
