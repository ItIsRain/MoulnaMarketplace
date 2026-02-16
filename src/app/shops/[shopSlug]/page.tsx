"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import type { Shop } from "@/lib/types";
import {
  Star, Share2, MapPin, Calendar,
  MessageCircle, UserPlus, Grid3X3, List,
  Award, Package, Shield, Clock, Instagram, Loader2, Store
} from "lucide-react";

export default function ShopPage() {
  const params = useParams();
  const shopSlug = params.shopSlug as string;
  const [activeTab, setActiveTab] = React.useState<"products" | "reviews" | "about">("products");
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [shop, setShop] = React.useState<Shop | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [followLoading, setFollowLoading] = React.useState(false);

  React.useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch(`/api/shops/${shopSlug}`);
        if (res.ok) {
          const data = await res.json();
          setShop(data.shop);
          setIsFollowing(data.isFollowing);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (shopSlug) loadShop();
  }, [shopSlug]);

  const handleFollow = async () => {
    if (!shop) return;
    setFollowLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`/api/shops/${shop.slug}/follow`, { method });
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setShop({
          ...shop,
          followerCount: shop.followerCount + (isFollowing ? -1 : 1),
        });
      }
    } finally {
      setFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Shop Not Found</h2>
            <p className="text-muted-foreground mb-4">This shop doesn&apos;t exist or has been removed.</p>
            <Button variant="outline" asChild>
              <Link href="/explore/shops">Browse Shops</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const joinDate = new Date(shop.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Shop Banner */}
        <div className="relative h-64 md:h-80">
          {shop.bannerUrl ? (
            <Image
              src={shop.bannerUrl}
              alt={shop.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-moulna-gold/30 to-amber-100" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Shop Header */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 mb-8">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 -mt-20 md:-mt-24">
                  <div className="relative">
                    <DiceBearAvatar
                      seed={shop.avatarSeed || shop.slug}
                      style={shop.avatarStyle || "adventurer"}
                      size="3xl"
                      className="border-4 border-background shadow-lg"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="font-display text-2xl md:text-3xl font-bold">
                          {shop.name}
                        </h1>
                        {shop.isVerified && (
                          <Badge variant="gold">
                            <Shield className="w-3 h-3 me-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      {shop.tagline && (
                        <p className="text-muted-foreground mb-4">{shop.tagline}</p>
                      )}

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-moulna-gold text-moulna-gold" />
                          <span className="font-medium">{shop.rating}</span>
                          <span className="text-muted-foreground">({shop.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Package className="w-4 h-4" />
                          <span>{shop.totalListings} listings</span>
                        </div>
                        {shop.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{shop.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {joinDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                      <Button
                        variant={isFollowing ? "outline" : "gold"}
                        onClick={handleFollow}
                        disabled={followLoading}
                      >
                        {isFollowing ? (
                          <>Following ({shop.followerCount})</>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 me-2" />
                            Follow ({shop.followerCount})
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 me-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mt-4">
                    {shop.isArtisan && (
                      <Badge variant="outline">
                        <Award className="w-3 h-3 me-1" />
                        Artisan
                      </Badge>
                    )}
                    {shop.category && (
                      <Badge variant="outline">{shop.category}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-3 mt-6">
                <Button
                  variant={isFollowing ? "outline" : "gold"}
                  onClick={handleFollow}
                  disabled={followLoading}
                  className="flex-1"
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 me-2" />
                  Contact
                </Button>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b mb-8">
            <div className="flex gap-8">
              {[
                { id: "products", label: "Products", count: shop.totalListings },
                { id: "reviews", label: "Reviews", count: shop.reviewCount },
                { id: "about", label: "About" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "pb-4 px-1 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-moulna-gold text-moulna-gold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ms-2 text-muted-foreground">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="pb-12">
            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  {shop.category && (
                    <Badge variant="outline">{shop.category}</Badge>
                  )}
                  <div className="flex items-center border rounded-lg p-1">
                    <button
                      onClick={() => setView("grid")}
                      className={cn(
                        "p-1.5 rounded",
                        view === "grid" ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={cn(
                        "p-1.5 rounded",
                        view === "list" ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Card className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No products yet</h3>
                  <p className="text-sm text-muted-foreground">
                    This shop hasn&apos;t listed any products yet. Check back soon!
                  </p>
                </Card>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">{shop.rating}</div>
                      <div className="flex justify-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-5 h-5",
                              star <= Math.round(shop.rating)
                                ? "fill-moulna-gold text-moulna-gold"
                                : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{shop.reviewCount} reviews</p>
                    </div>
                    <Separator orientation="vertical" className="h-24" />
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-8">{stars} ★</span>
                          <Progress value={0} className="flex-1 h-2" />
                          <span className="text-sm text-muted-foreground w-12">0%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="p-8 text-center">
                  <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No reviews yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Be the first to review this shop!
                  </p>
                </Card>
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-4">About Us</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line">{shop.description || "No description available."}</p>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Quick Info */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Quick Info</h3>
                    <div className="space-y-4">
                      {shop.responseTime && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Response Time</p>
                            <p className="text-sm text-muted-foreground">{shop.responseTime}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Active Listings</p>
                          <p className="text-sm text-muted-foreground">{shop.totalListings} listings</p>
                        </div>
                      </div>
                      {shop.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Location</p>
                            <p className="text-sm text-muted-foreground">{shop.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Social Links */}
                  {shop.instagram && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Connect</h3>
                      <div className="space-y-3">
                        <a
                          href={`https://instagram.com/${shop.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm hover:text-moulna-gold transition-colors"
                        >
                          <Instagram className="w-5 h-5" />
                          <span>{shop.instagram}</span>
                        </a>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
