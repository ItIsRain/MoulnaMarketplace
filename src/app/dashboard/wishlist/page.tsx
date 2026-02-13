"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart, ShoppingCart, Trash2, Star, Bell, Share2,
  Grid3X3, List, Sparkles
} from "lucide-react";

const WISHLIST_ITEMS = [
  {
    id: "wish_1",
    product: {
      id: "prd_1",
      title: "Handcrafted Arabian Oud Perfume - Premium Collection",
      slug: "handcrafted-arabian-oud-perfume",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      priceFils: 45000,
      compareAtPriceFils: 55000,
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
      seller: "Scent of Arabia",
    },
    addedDate: "Feb 10, 2024",
    xpReward: 45,
  },
  {
    id: "wish_2",
    product: {
      id: "prd_2",
      title: "Traditional Arabic Calligraphy Art - Custom Name",
      slug: "traditional-arabic-calligraphy-art",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
      priceFils: 89000,
      rating: 5.0,
      reviewCount: 56,
      inStock: true,
      seller: "Khalid Arts",
    },
    addedDate: "Feb 8, 2024",
    xpReward: 89,
  },
  {
    id: "wish_3",
    product: {
      id: "prd_3",
      title: "Gold-Plated Pearl Earrings - Handmade",
      slug: "gold-plated-pearl-earrings",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
      priceFils: 32000,
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      seller: "Gulf Gems",
    },
    addedDate: "Feb 5, 2024",
    xpReward: 32,
  },
  {
    id: "wish_4",
    product: {
      id: "prd_4",
      title: "Moroccan Ceramic Vase Set - Limited Edition",
      slug: "moroccan-ceramic-vase-set",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400",
      priceFils: 67500,
      compareAtPriceFils: 85000,
      rating: 4.7,
      reviewCount: 42,
      inStock: false,
      seller: "Desert Home",
    },
    addedDate: "Jan 28, 2024",
    xpReward: 67,
    priceDropAlert: true,
  },
  {
    id: "wish_5",
    product: {
      id: "prd_5",
      title: "Embroidered Abaya with Gold Thread",
      slug: "embroidered-abaya-gold-thread",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400",
      priceFils: 125000,
      rating: 4.9,
      reviewCount: 78,
      inStock: true,
      seller: "Elegance UAE",
    },
    addedDate: "Jan 20, 2024",
    xpReward: 125,
  },
];

export default function WishlistPage() {
  const [items, setItems] = React.useState(WISHLIST_ITEMS);
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const totalValue = items.reduce((sum, item) => sum + item.product.priceFils, 0);
  const totalXP = items.reduce((sum, item) => sum + item.xpReward, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {items.length} items saved · Total value: {formatAED(totalValue)}
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

      {/* XP Preview */}
      <Card className="p-4 bg-moulna-gold text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm">
              Buy all wishlist items and earn <span className="font-bold">+{totalXP} XP</span>
            </span>
          </div>
          <Button size="sm" className="bg-white text-moulna-gold-dark hover:bg-white/90">
            <ShoppingCart className="w-4 h-4 me-2" />
            Add All to Cart
          </Button>
        </div>
      </Card>

      {/* Wishlist Items */}
      {items.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        )}>
          <AnimatePresence>
            {items.map((item, index) => (
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
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!item.product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="outOfStock">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                    {item.product.compareAtPriceFils && (
                      <Badge variant="default" className="absolute top-3 start-3 bg-red-500">
                        Sale
                      </Badge>
                    )}
                    {item.priceDropAlert && (
                      <Badge variant="outline" className="absolute top-3 end-3 bg-white/90">
                        <Bell className="w-3 h-3 me-1" />
                        Alert On
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 className="font-medium hover:text-moulna-gold transition-colors line-clamp-2 mb-1">
                        {item.product.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-muted-foreground mb-2">
                      {item.product.seller}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-moulna-gold text-moulna-gold" />
                        <span className="text-sm font-medium">{item.product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({item.product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-bold text-lg">
                        {formatAED(item.product.priceFils)}
                      </span>
                      {item.product.compareAtPriceFils && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatAED(item.product.compareAtPriceFils)}
                        </span>
                      )}
                    </div>

                    {/* XP Preview */}
                    <div className="flex items-center gap-1 text-sm text-moulna-gold mb-4">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+{item.xpReward} XP</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="gold"
                        size="sm"
                        className="flex-1"
                        disabled={!item.product.inStock}
                      >
                        <ShoppingCart className="w-4 h-4 me-2" />
                        {item.product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3">
                      Added on {item.addedDate}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Save items you love to your wishlist and find them here anytime
          </p>
          <Button variant="gold" asChild>
            <Link href="/explore">Explore Products</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
