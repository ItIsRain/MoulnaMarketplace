"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, formatAED, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star, ThumbsUp, MessageCircle, Edit2, Trash2,
  Camera, Sparkles, ChevronRight
} from "lucide-react";

const MY_REVIEWS = [
  {
    id: "rev_1",
    product: {
      id: "prd_1",
      title: "Handcrafted Arabian Oud Perfume",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200",
      slug: "handcrafted-arabian-oud-perfume",
    },
    rating: 5,
    title: "Absolutely stunning fragrance!",
    text: "This oud perfume exceeded all my expectations. The scent is rich, long-lasting, and perfect for special occasions. The packaging was also beautiful. Will definitely buy again!",
    photos: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    ],
    helpfulCount: 24,
    createdAt: "2024-02-10T14:30:00Z",
    xpEarned: 100,
    hasSellerResponse: true,
    sellerResponse: {
      text: "Thank you so much for your kind words! We're thrilled you love the fragrance. Looking forward to serving you again!",
      date: "2024-02-11T10:00:00Z",
    },
    isVerifiedPurchase: true,
  },
  {
    id: "rev_2",
    product: {
      id: "prd_2",
      title: "Gold-Plated Pearl Earrings",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200",
      slug: "gold-plated-pearl-earrings",
    },
    rating: 4,
    title: "Beautiful but slightly smaller than expected",
    text: "The earrings are gorgeous and the quality is excellent. The only reason I'm giving 4 stars is because they were a bit smaller than I imagined from the photos. Still, I love them!",
    photos: [],
    helpfulCount: 8,
    createdAt: "2024-02-05T16:45:00Z",
    xpEarned: 50,
    hasSellerResponse: false,
    isVerifiedPurchase: true,
  },
  {
    id: "rev_3",
    product: {
      id: "prd_3",
      title: "Traditional Arabic Calligraphy Art",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200",
      slug: "traditional-arabic-calligraphy-art",
    },
    rating: 5,
    title: "A masterpiece for my home",
    text: "The artist did an amazing job with my custom name piece. The calligraphy is elegant and the colors are vibrant. It's now the centerpiece of my living room. Highly recommend!",
    photos: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400",
    ],
    helpfulCount: 32,
    createdAt: "2024-01-28T09:15:00Z",
    xpEarned: 100,
    hasSellerResponse: true,
    sellerResponse: {
      text: "Thank you for sharing those beautiful photos! It was a pleasure creating this piece for you.",
      date: "2024-01-29T11:30:00Z",
    },
    isVerifiedPurchase: true,
  },
];

const PENDING_REVIEWS = [
  {
    id: "ord_1",
    product: {
      id: "prd_4",
      title: "Organic Date Honey Gift Box",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200",
      slug: "organic-date-honey-gift-box",
    },
    orderDate: "2024-02-08",
    xpReward: 50,
  },
  {
    id: "ord_2",
    product: {
      id: "prd_5",
      title: "Embroidered Abaya with Gold Thread",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200",
      slug: "embroidered-abaya-gold-thread",
    },
    orderDate: "2024-02-12",
    xpReward: 50,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = React.useState<"written" | "pending">("written");

  const totalXPEarned = MY_REVIEWS.reduce((sum, r) => sum + r.xpEarned, 0);
  const totalHelpful = MY_REVIEWS.reduce((sum, r) => sum + r.helpfulCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <Star className="w-6 h-6 text-yellow-500" />
          My Reviews
        </h1>
        <p className="text-muted-foreground">
          Share your experience and earn XP for every review
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{MY_REVIEWS.length}</p>
          <p className="text-sm text-muted-foreground">Reviews Written</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-moulna-gold">{totalXPEarned}</p>
          <p className="text-sm text-muted-foreground">XP Earned</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{totalHelpful}</p>
          <p className="text-sm text-muted-foreground">Helpful Votes</p>
        </Card>
      </div>

      {/* XP Tip */}
      <Card className="p-4 bg-gradient-to-r from-moulna-gold/10 to-transparent">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-moulna-gold" />
          <span className="text-sm">
            <span className="font-medium">Tip:</span> Reviews with photos earn <span className="text-moulna-gold font-bold">100 XP</span> instead of 50 XP!
          </span>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("written")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activeTab === "written"
                ? "text-moulna-gold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            My Reviews ({MY_REVIEWS.length})
            {activeTab === "written" && (
              <motion.div
                layoutId="reviewTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-moulna-gold"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activeTab === "pending"
                ? "text-moulna-gold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Pending Reviews ({PENDING_REVIEWS.length})
            {activeTab === "pending" && (
              <motion.div
                layoutId="reviewTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-moulna-gold"
              />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "written" ? (
        <div className="space-y-6">
          {MY_REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link href={`/products/${review.product.slug}`}>
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={review.product.image}
                        alt={review.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link
                          href={`/products/${review.product.slug}`}
                          className="font-medium hover:text-moulna-gold transition-colors line-clamp-1"
                        >
                          {review.product.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} />
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(review.createdAt)}
                          </span>
                          {review.isVerifiedPurchase && (
                            <Badge variant="outline" className="text-xs">
                              Verified Buyer
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {review.title && (
                      <p className="font-medium mb-1">{review.title}</p>
                    )}
                    <p className="text-sm text-muted-foreground mb-3">
                      {review.text}
                    </p>

                    {/* Review Photos */}
                    {review.photos.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.photos.map((photo, i) => (
                          <div
                            key={i}
                            className="relative w-16 h-16 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={photo}
                              alt={`Review photo ${i + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpfulCount} found helpful</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-moulna-gold">
                        <Sparkles className="w-4 h-4" />
                        <span>+{review.xpEarned} XP earned</span>
                      </div>
                    </div>

                    {/* Seller Response */}
                    {review.hasSellerResponse && review.sellerResponse && (
                      <div className="mt-4 p-3 rounded-lg bg-muted/50 border-s-2 border-moulna-gold">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageCircle className="w-4 h-4 text-moulna-gold" />
                          <span className="text-sm font-medium">Seller Response</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.sellerResponse.text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {PENDING_REVIEWS.length > 0 ? (
            PENDING_REVIEWS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{item.product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Bought on {item.orderDate}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-moulna-gold mt-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Earn +{item.xpReward} XP</span>
                        <Camera className="w-3.5 h-3.5 ms-2" />
                        <span>+50 XP with photos</span>
                      </div>
                    </div>
                    <Button variant="gold">
                      Write Review
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="p-8 text-center">
              <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No pending reviews</h3>
              <p className="text-sm text-muted-foreground">
                You&apos;ve reviewed all your recent deals. Keep exploring to earn more XP!
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
