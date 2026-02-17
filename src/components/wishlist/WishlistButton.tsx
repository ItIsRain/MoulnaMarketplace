"use client";

import * as React from "react";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useTracking } from "@/hooks/useTracking";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WishlistButton({ productId, className, size = "md" }: WishlistButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const { trackEvent } = useTracking();
  const [inWishlist, setInWishlist] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated || !productId) return;

    let cancelled = false;
    fetch(`/api/wishlist/check?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setInWishlist(data.inWishlist);
          setChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) setChecked(true);
      });

    return () => { cancelled = true; };
  }, [isAuthenticated, productId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;
    if (loading) return;

    setLoading(true);
    try {
      if (inWishlist) {
        const res = await fetch(`/api/wishlist?productId=${productId}`, {
          method: "DELETE",
        });
        if (res.ok) setInWishlist(false);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          setInWishlist(true);
          trackEvent("wishlist_added", productId);
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "rounded-full flex items-center justify-center transition-all",
        "bg-white/90 hover:bg-white shadow-sm border border-black/5",
        sizeClasses[size],
        className
      )}
      title={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
    >
      {loading ? (
        <Loader2 className={cn(iconSizes[size], "animate-spin text-muted-foreground")} />
      ) : (
        <Heart
          className={cn(
            iconSizes[size],
            "transition-colors",
            inWishlist
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground hover:text-red-500"
          )}
        />
      )}
    </button>
  );
}
