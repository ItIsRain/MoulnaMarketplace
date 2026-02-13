"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check, Package, Sparkles, ArrowRight, Share2,
  Copy, MessageCircle
} from "lucide-react";

export default function CheckoutSuccessPage() {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Fire confetti on mount
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ["#c7a34d", "#fbbf24", "#f59e0b"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const copyOrderId = () => {
    navigator.clipboard.writeText("ORD-2024-001234");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-moulna-gold/5 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <Card className="p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-emerald-600" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We&apos;ve sent a confirmation to your email.
          </p>

          {/* Order ID */}
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono font-bold text-lg">ORD-2024-001234</span>
              <button
                onClick={copyOrderId}
                className="p-1 hover:bg-background rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* XP Earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-moulna-gold/20 to-moulna-gold/10 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-moulna-gold" />
              <span className="text-2xl font-bold text-moulna-gold">+109 XP</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You&apos;re now closer to leveling up!
            </p>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs">
              <span className="px-2 py-1 rounded-full bg-moulna-gold/20 text-moulna-gold">
                🛍️ Purchase XP
              </span>
              <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                🎯 Challenge Progress
              </span>
            </div>
          </motion.div>

          {/* What's Next */}
          <div className="text-start mb-6">
            <h3 className="font-semibold mb-3">What&apos;s Next?</h3>
            <div className="space-y-3">
              {[
                {
                  icon: Package,
                  title: "Order Processing",
                  desc: "Your order is being prepared by our sellers",
                },
                {
                  icon: MessageCircle,
                  title: "Stay Updated",
                  desc: "We'll notify you when your order ships",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button variant="gold" size="lg" className="w-full" asChild>
              <Link href="/dashboard/orders">
                View Order Details
                <ArrowRight className="w-4 h-4 ms-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/explore">
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Share */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Share your find with friends
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 me-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>

        {/* Logo */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Image
              src="/moulna-logo.svg"
              alt="Moulna"
              width={100}
              height={32}
              className="h-8 w-auto mx-auto opacity-50 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
