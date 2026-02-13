"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  User, MapPin, Calendar, Star, MessageSquare,
  ShoppingBag, Award, Heart, Share2, Users,
  Instagram, Twitter, Globe, Sparkles, Trophy
} from "lucide-react";

// Mock user data
const USER_DATA = {
  username: "ahmed_hassan",
  name: "Ahmed Hassan",
  avatar: "ahmed-public",
  bio: "Passionate collector of Arabian fragrances and handmade crafts. Level 5 Moulna enthusiast! Always on the lookout for unique pieces from local artisans.",
  location: "Dubai, UAE",
  joinedDate: "2023-06-15",
  level: 5,
  xp: 2340,
  badges: [
    { name: "Early Adopter", icon: Trophy, color: "bg-purple-500" },
    { name: "Shopaholic", icon: ShoppingBag, color: "bg-blue-500" },
    { name: "Review Master", icon: Star, color: "bg-yellow-500" },
  ],
  stats: {
    reviews: 28,
    following: 45,
    followers: 120,
    purchases: 34,
  },
  recentReviews: [
    {
      id: "1",
      product: "Royal Oud Collection",
      productImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100",
      rating: 5,
      content: "Absolutely stunning fragrance! The quality is exceptional and it lasts all day.",
      date: "2024-01-10",
    },
    {
      id: "2",
      product: "Handmade Pearl Necklace",
      productImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100",
      rating: 5,
      content: "Beautiful craftsmanship. The pearls are genuine and the design is elegant.",
      date: "2024-01-05",
    },
  ],
  social: {
    instagram: "@ahmed_uae",
    twitter: "",
    website: "",
  },
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const user = USER_DATA; // In real app, fetch based on username

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="relative">
                    <DiceBearAvatar
                      seed={user.avatar}
                      size="xl"
                      className="w-32 h-32 border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2">
                      <LevelBadge level={user.level} size="md" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-start">
                  <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                  <p className="text-muted-foreground mb-3">@{user.username}</p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(user.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4 max-w-lg">
                    {user.bio}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    {user.badges.map((badge) => (
                      <Badge key={badge.name} className={cn("gap-1", badge.color)}>
                        <badge.icon className="w-3 h-3" />
                        {badge.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center md:justify-start gap-2">
                    <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
                      <Users className="w-4 h-4 me-2" />
                      Follow
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 me-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stats Card */}
                <Card className="p-4 w-full md:w-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-moulna-gold">{user.xp.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total XP</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{user.stats.reviews}</p>
                      <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{user.stats.followers}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{user.stats.following}</p>
                      <p className="text-xs text-muted-foreground">Following</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Reviews */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Star className="w-5 h-5 text-moulna-gold" />
                      Recent Reviews
                    </h2>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="space-y-4">
                    {user.recentReviews.map((review) => (
                      <div key={review.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                        <img
                          src={review.productImage}
                          alt={review.product}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">{review.product}</h3>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {review.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Activity */}
                <Card className="p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-moulna-gold" />
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Star className="w-4 h-4 text-green-600" />
                      </div>
                      <span>Wrote a review for <strong>Royal Oud Collection</strong></span>
                      <span className="text-muted-foreground ms-auto">2 days ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Award className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Earned the <strong>Review Master</strong> badge</span>
                      <span className="text-muted-foreground ms-auto">5 days ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>Followed <strong>Scent of Arabia</strong></span>
                      <span className="text-muted-foreground ms-auto">1 week ago</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Level Progress */}
                <Card className="p-6">
                  <h2 className="font-semibold mb-4">Level Progress</h2>
                  <div className="text-center mb-4">
                    <LevelBadge level={user.level} size="lg" showTitle />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Level {user.level + 1}</span>
                      <span className="text-moulna-gold">{user.xp % 1000} / 1000 XP</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-moulna-gold rounded-full"
                        style={{ width: `${(user.xp % 1000) / 10}%` }}
                      />
                    </div>
                  </div>
                </Card>

                {/* Badges */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Badges</h2>
                    <Badge variant="secondary">{user.badges.length}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {user.badges.map((badge) => (
                      <div
                        key={badge.name}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white",
                          badge.color
                        )}>
                          <badge.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-center">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Social Links */}
                {user.social.instagram && (
                  <Card className="p-6">
                    <h2 className="font-semibold mb-4">Social Links</h2>
                    <div className="space-y-2">
                      {user.social.instagram && (
                        <a
                          href={`https://instagram.com/${user.social.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-moulna-gold transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          {user.social.instagram}
                        </a>
                      )}
                      {user.social.twitter && (
                        <a
                          href={`https://twitter.com/${user.social.twitter.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-moulna-gold transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                          {user.social.twitter}
                        </a>
                      )}
                      {user.social.website && (
                        <a
                          href={user.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-moulna-gold transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          {user.social.website}
                        </a>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
