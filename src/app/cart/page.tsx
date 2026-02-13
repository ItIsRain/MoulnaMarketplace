"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag,
  Sparkles, Truck, Shield, ChevronRight, Gift, Store
} from "lucide-react";

// Mock cart data
const INITIAL_CART = {
  items: [
    {
      id: "item_1",
      product: {
        id: "prd_1",
        title: "Handcrafted Arabian Oud Perfume",
        slug: "handcrafted-arabian-oud-perfume",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
        priceFils: 45000,
        variant: "100ml",
      },
      seller: {
        id: "shp_1",
        name: "Scent of Arabia",
        slug: "scent-of-arabia",
        avatar: "scent-arabia",
        level: 6,
      },
      quantity: 1,
      xpReward: 45,
    },
    {
      id: "item_2",
      product: {
        id: "prd_3",
        title: "Gold-Plated Pearl Earrings",
        slug: "gold-plated-pearl-earrings",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
        priceFils: 32000,
      },
      seller: {
        id: "shp_2",
        name: "Gulf Gems",
        slug: "gulf-gems",
        avatar: "gulf-gems",
        level: 5,
      },
      quantity: 2,
      xpReward: 64,
    },
    {
      id: "item_3",
      product: {
        id: "prd_6",
        title: "Organic Date Honey Gift Box",
        slug: "organic-date-honey-gift-box",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
        priceFils: 28000,
      },
      seller: {
        id: "shp_1",
        name: "Scent of Arabia",
        slug: "scent-of-arabia",
        avatar: "scent-arabia",
        level: 6,
      },
      quantity: 1,
      xpReward: 28,
    },
  ],
};

export default function CartPage() {
  const [cart, setCart] = React.useState(INITIAL_CART);
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [couponError, setCouponError] = React.useState("");

  // Group items by seller
  const itemsBySeller = React.useMemo(() => {
    const grouped = new Map<string, typeof cart.items>();
    for (const item of cart.items) {
      const existing = grouped.get(item.seller.id) ?? [];
      grouped.set(item.seller.id, [...existing, item]);
    }
    return grouped;
  }, [cart.items]);

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      ),
    }));
  };

  const removeItem = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setAppliedCoupon("WELCOME10");
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.priceFils * item.quantity,
    0
  );
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 15000 ? 0 : 2500; // Free shipping over 150 AED
  const total = subtotal - discount + shipping;
  const totalXP = cart.items.reduce(
    (sum, item) => sum + item.xpReward * item.quantity,
    0
  );

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Discover unique handmade treasures from UAE artisans
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link href="/explore">
                Start Shopping
                <ArrowRight className="w-4 h-4 ms-2" />
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Shopping Cart</span>
          </nav>

          <h1 className="font-display text-3xl font-bold mb-8">
            Shopping Cart
            <span className="text-muted-foreground font-normal text-lg ms-2">
              ({cart.items.length} items)
            </span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Array.from(itemsBySeller.entries()).map(([sellerId, items]) => {
                const seller = items[0].seller;
                return (
                  <Card key={sellerId} className="overflow-hidden">
                    {/* Seller Header */}
                    <div className="bg-muted/50 px-6 py-4 flex items-center justify-between">
                      <Link
                        href={`/shops/${seller.slug}`}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                      >
                        <DiceBearAvatar seed={seller.avatar} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{seller.name}</span>
                            <LevelBadge level={seller.level} size="sm" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {items.length} item{items.length > 1 ? "s" : ""} from this seller
                          </p>
                        </div>
                      </Link>
                      <Store className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {/* Items */}
                    <div className="divide-y">
                      <AnimatePresence>
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-6"
                          >
                            <div className="flex gap-4">
                              {/* Image */}
                              <Link
                                href={`/products/${item.product.slug}`}
                                className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
                              >
                                <Image
                                  src={item.product.image}
                                  alt={item.product.title}
                                  fill
                                  className="object-cover"
                                />
                              </Link>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  className="font-medium hover:text-moulna-gold transition-colors line-clamp-2"
                                >
                                  {item.product.title}
                                </Link>
                                {item.product.variant && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Size: {item.product.variant}
                                  </p>
                                )}

                                <div className="flex items-center gap-4 mt-3">
                                  {/* Quantity */}
                                  <div className="flex items-center border rounded-lg">
                                    <button
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-10 text-center text-sm font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Remove */}
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                  </button>
                                </div>
                              </div>

                              {/* Price & XP */}
                              <div className="text-end flex-shrink-0">
                                <p className="font-bold text-lg">
                                  {formatAED(item.product.priceFils * item.quantity)}
                                </p>
                                <div className="flex items-center gap-1 text-sm text-moulna-gold justify-end mt-1">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>+{item.xpReward * item.quantity} XP</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Coupon Code</label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span className="font-medium">{appliedCoupon}</span>
                        <span className="text-sm">(-10%)</span>
                      </div>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={applyCoupon}>
                        Apply
                      </Button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-sm text-red-500 mt-1">{couponError}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Try: WELCOME10 for 10% off
                  </p>
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatAED(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatAED(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatAED(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatAED(15000 - subtotal)} more for free shipping
                    </p>
                  )}

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatAED(total)}</span>
                  </div>

                  {/* XP Preview */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-moulna-gold text-white">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-medium">XP you&apos;ll earn</span>
                    </div>
                    <span className="font-bold">+{totalXP} XP</span>
                  </div>
                </div>

                <Button variant="gold" size="lg" className="w-full mt-6" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ms-2" />
                  </Link>
                </Button>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {[
                    { icon: Shield, label: "Secure Checkout" },
                    { icon: Truck, label: "Fast Delivery" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Gift Wrap Banner */}
          <Card className="mt-8 p-6 bg-gradient-to-r from-moulna-gold/10 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-moulna-gold" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Add Gift Wrapping</h3>
                <p className="text-sm text-muted-foreground">
                  Make it special with our premium gift wrapping service
                </p>
              </div>
              <Button variant="outline">
                Add for AED 15
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
