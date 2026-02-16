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
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import type { Product } from "@/lib/types";
import {
  Star, Heart, Share2, Shield,
  ChevronRight, MessageCircle,
  Sparkles, Clock, MapPin, ChevronLeft, Phone, Loader2
} from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProduct(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Product not found");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">{error || "Product not found"}</p>
            <Button asChild>
              <Link href="/explore">Browse Listings</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.compareAtPriceFils
    ? getDiscountPercentage(product.priceFils, product.compareAtPriceFils)
    : 0;

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
            {product.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/explore?category=${product.category}`} className="hover:text-foreground">
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                {product.images.length > 0 ? (
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
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 start-4 flex flex-col gap-2">
                  {product.isTrending && <Badge variant="trending">Trending</Badge>}
                  {product.isHandmade && <Badge variant="handmade">Handmade</Badge>}
                  {discount > 0 && (
                    <Badge variant="default" className="bg-red-500">
                      -{discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
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
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
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
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold mb-3">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {product.viewCount} views
                  </span>
                  {product.condition && product.condition !== "new" && (
                    <Badge variant="outline" className="capitalize">
                      {product.condition.replace("_", " ")}
                    </Badge>
                  )}
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
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-moulna-gold text-white text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>+{product.xpReward} XP</span>
                </div>
              </div>

              {product.shortDescription && (
                <p className="text-muted-foreground">{product.shortDescription}</p>
              )}

              <Separator />

              {/* Variants Display */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  {product.variants.map((variant) => (
                    <div key={variant.name} className="mb-3">
                      <label className="text-sm font-medium mb-2 block">{variant.name}</label>
                      <div className="flex gap-3">
                        {variant.options.map((option) => (
                          <span
                            key={option}
                            className="px-4 py-2 rounded-lg border text-sm font-medium text-muted-foreground"
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Seller Actions */}
              <div className="space-y-3">
                <Button variant="gold" size="lg" className="w-full" asChild>
                  <Link href={`/dashboard/messages/new?seller=${product.seller.slug}`}>
                    <MessageCircle className="w-5 h-5 me-2" />
                    Contact Seller
                  </Link>
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex-1"
                  >
                    <Heart className={cn("w-5 h-5 me-2", isWishlisted && "fill-red-500 text-red-500")} />
                    {isWishlisted ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    <Share2 className="w-5 h-5 me-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, label: "Verified Seller", sublabel: product.seller.isVerified ? "Identity confirmed" : "Not verified" },
                  { icon: Clock, label: "Response Time", sublabel: product.seller.responseTime || "Not set" },
                  { icon: MapPin, label: "Location", sublabel: product.seller.location || "UAE" },
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
                      seed={product.seller.avatarSeed || product.seller.name}
                      style={product.seller.avatarStyle}
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
                        {product.seller.rating.toFixed(1)}
                      </span>
                      <span>{product.seller.totalListings} listings</span>
                      {product.seller.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {product.seller.location}
                        </span>
                      )}
                    </div>
                    {product.seller.responseTime && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Typically responds {product.seller.responseTime}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="gold" size="sm" asChild>
                    <Link href={`/shops/${product.seller.slug}`}>
                      Visit Shop
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-16">
              <div className="border-b">
                <div className="flex gap-8">
                  <button className="pb-4 px-1 text-sm font-medium border-b-2 border-moulna-gold text-moulna-gold">
                    Description
                  </button>
                </div>
              </div>
              <div className="py-8">
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            </div>
          )}

          {/* Reviews placeholder */}
          <section id="reviews" className="mt-8">
            <h2 className="font-display text-2xl font-bold mb-6">Reviews</h2>
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Reviews coming soon.</p>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
