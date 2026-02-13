"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Star, MessageSquare, ThumbsUp, ThumbsDown,
  Filter, TrendingUp, AlertCircle, CheckCircle,
  Clock, Reply
} from "lucide-react";

const REVIEWS = [
  {
    id: "1",
    customer: {
      name: "Fatima Al Zahra",
      avatar: "fatima-review",
    },
    product: {
      name: "Royal Oud Collection",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100",
    },
    rating: 5,
    title: "Absolutely stunning fragrance!",
    content: "The quality of this oud is exceptional. It lasts all day and I receive compliments wherever I go. The packaging was beautiful and it arrived quickly. Will definitely order again!",
    date: "2024-01-15",
    helpful: 12,
    replied: true,
    reply: "Thank you so much for your kind words! We're delighted you love the Royal Oud Collection. Looking forward to serving you again!",
  },
  {
    id: "2",
    customer: {
      name: "Ahmed Hassan",
      avatar: "ahmed-review",
    },
    product: {
      name: "Arabian Nights Perfume",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=100",
    },
    rating: 4,
    title: "Great product, slight delay",
    content: "The perfume is lovely and exactly as described. Only giving 4 stars because shipping took a bit longer than expected. Otherwise, very satisfied with my purchase.",
    date: "2024-01-12",
    helpful: 5,
    replied: false,
    reply: null,
  },
  {
    id: "3",
    customer: {
      name: "Sara Abdullah",
      avatar: "sara-review",
    },
    product: {
      name: "Musk Al Emarat",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100",
    },
    rating: 5,
    title: "Best musk I've ever purchased",
    content: "This is hands down the best musk fragrance I've ever bought. The scent is authentic and long-lasting. The seller was also very helpful in answering my questions before purchase.",
    date: "2024-01-10",
    helpful: 18,
    replied: true,
    reply: "Thank you Sara! We take pride in offering authentic Arabian fragrances. Enjoy!",
  },
  {
    id: "4",
    customer: {
      name: "Omar Nasser",
      avatar: "omar-review",
    },
    product: {
      name: "Oud Wood Chips",
      image: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=100",
    },
    rating: 3,
    title: "Decent quality",
    content: "The oud chips are okay but I expected better quality for this price. The fragrance is nice but not as strong as I hoped. May try a different grade next time.",
    date: "2024-01-08",
    helpful: 3,
    replied: false,
    reply: null,
  },
];

const STATS = [
  { label: "Average Rating", value: "4.7", icon: Star, color: "text-yellow-500" },
  { label: "Total Reviews", value: "156", icon: MessageSquare, color: "text-blue-500" },
  { label: "Response Rate", value: "92%", icon: Reply, color: "text-green-500" },
  { label: "Pending Replies", value: "3", icon: Clock, color: "text-orange-500" },
];

export default function SellerReviewsPage() {
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");

  const filteredReviews = REVIEWS.filter(review => {
    if (selectedFilter === "pending") return !review.replied;
    if (selectedFilter === "replied") return review.replied;
    if (selectedFilter === "positive") return review.rating >= 4;
    if (selectedFilter === "negative") return review.rating < 4;
    return true;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer feedback and build trust
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Rating Distribution */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Rating Distribution</h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = REVIEWS.filter(r => r.rating === rating).length;
              const percentage = (count / REVIEWS.length) * 100;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium">{rating} star</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-muted-foreground text-end">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: "all", label: "All Reviews" },
            { value: "pending", label: "Pending Reply" },
            { value: "replied", label: "Replied" },
            { value: "positive", label: "Positive" },
            { value: "negative", label: "Needs Attention" },
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <img
                    src={review.product.image}
                    alt={review.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold">{review.title}</h3>
                      </div>
                      <Badge variant={review.replied ? "default" : "secondary"}>
                        {review.replied ? (
                          <><CheckCircle className="w-3 h-3 me-1" /> Replied</>
                        ) : (
                          <><Clock className="w-3 h-3 me-1" /> Pending</>
                        )}
                      </Badge>
                    </div>

                    {/* Content */}
                    <p className="text-muted-foreground mb-3">{review.content}</p>

                    {/* Customer & Product */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DiceBearAvatar seed={review.customer.avatar} size="xs" />
                        <span>{review.customer.name}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{review.product.name}</span>
                    </div>

                    {/* Reply */}
                    {review.replied && review.reply && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border-s-4 border-moulna-gold">
                        <p className="text-sm font-medium mb-1">Your reply:</p>
                        <p className="text-sm text-muted-foreground">{review.reply}</p>
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === review.id && (
                      <div className="mt-4 space-y-3">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm">Send Reply</Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful} found helpful</span>
                      </div>
                      {!review.replied && replyingTo !== review.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReplyingTo(review.id)}
                        >
                          <Reply className="w-4 h-4 me-1" />
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No reviews found</h3>
            <p className="text-sm text-muted-foreground">
              Reviews matching your filter will appear here
            </p>
          </Card>
        )}
    </div>
  );
}
