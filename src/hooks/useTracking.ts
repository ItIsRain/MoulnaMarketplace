"use client";

import { useCallback, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

type EventType =
  | "category_viewed"
  | "listing_viewed"
  | "wishlist_added"
  | "seller_contacted"
  | "daily_visit"
  | "shop_viewed"
  | "review_written";

function hasTrackingConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("moulna_cookie_consent") === "accepted";
}

/**
 * Hook for tracking user activity events.
 * Respects cookie consent — events are silently dropped if consent not given.
 * Deduplicates events within the same page session to avoid spamming.
 */
export function useTracking() {
  const { isAuthenticated } = useAuthStore();
  const sentEvents = useRef(new Set<string>());

  const trackEvent = useCallback(
    (eventType: EventType, itemId?: string) => {
      if (!isAuthenticated) return;
      if (!hasTrackingConsent()) return;

      // Deduplicate: same event+item within this component lifecycle
      const key = `${eventType}:${itemId || ""}`;
      if (sentEvents.current.has(key)) return;
      sentEvents.current.add(key);

      // Fire and forget — don't block the UI
      fetch("/api/tracking/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, itemId }),
      }).catch(() => {
        // Silently fail — tracking is non-critical
      });
    },
    [isAuthenticated]
  );

  return { trackEvent };
}

/**
 * Check if user has given cookie consent.
 */
export { hasTrackingConsent };
