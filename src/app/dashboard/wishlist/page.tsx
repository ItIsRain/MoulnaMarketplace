"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import {
  Heart, MessageCircle, Trash2, Star, Share2,
  Grid3X3, List, Sparkles, Loader2
} from "lucide-react";

interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: Product | null;
}

export default function SavedItemsPage() {
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [removing, setRemoving] = React.useState<string | null>(null);
  const [view, setView] = React.useState<"grid" | "list">("grid");

  React.useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId: string) {
    setRemoving(productId);
    try {
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      }
    } catch {
      // silently fail
    } finally {
      setRemoving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            Saved Items
          </h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <div className="flex items-center gap-2">
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
      </div>

      {/* XP Tip */}
      <Card className="p-4 bg-moulna-gold text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm">
            Contact sellers about your saved items to earn <span className="font-bold">+30 XP per conversation</span>
          </span>
        </div>
      </Card>

      {/* Saved Items */}
      {items.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        )}>
          <AnimatePresence>
            {items.map((item, index) => {
              const product = item.product;
              if (!product) return null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={cn(
                    "overflow-hidden group",
                    view === "list" && "flex"
                  )}>
                    {/* Image */}
                    <div className={cn(
                      "relative overflow-hidden",
                      view === "grid" ? "aspect-square" : "w-40 flex-shrink-0"
                    )}>
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Heart className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      {!product.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="outline" className="bg-white/90">
                            Unavailable
                          </Badge>
                        </div>
                      )}
                      {product.compareAtPriceFils && (
                        <Badge variant="default" className="absolute top-3 start-3 bg-red-500">
                          Reduced
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-medium hover:text-moulna-gold transition-colors line-clamp-2 mb-1">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-muted-foreground mb-2">
                        {product.seller.name}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-bold text-lg">
                          {formatAED(product.priceFils)}
                        </span>
                        {product.compareAtPriceFils && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatAED(product.compareAtPriceFils)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="gold"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link href={`/products/${product.slug}`}>
                            <MessageCircle className="w-4 h-4 me-2" />
                            Contact Seller
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={removing === item.productId}
                          onClick={() => removeItem(item.productId)}
                        >
                          {removing === item.productId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3">
                        Saved on {new Date(item.addedAt).toLocaleDateString("en-AE", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No saved items yet</h3>
          <p className="text-muted-foreground mb-6">
            Save listings you like and find them here anytime
          </p>
          <Button variant="gold" asChild>
            <Link href="/explore">Browse Listings</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
