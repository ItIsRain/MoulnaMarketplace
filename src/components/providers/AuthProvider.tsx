"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const streakRecorded = useRef(false);

  useEffect(() => {
    initialize();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchProfile().then((profile) => {
          if (profile) {
            useAuthStore.setState({
              user: profile,
              isAuthenticated: true,
            });

            // Record login streak + daily visit challenge once per session
            if (!streakRecorded.current) {
              streakRecorded.current = true;
              fetch("/api/gamification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "login_streak" }),
              }).catch(() => {});

              // Track daily visit for challenge progress
              if (localStorage.getItem("moulna_cookie_consent") === "accepted") {
                fetch("/api/tracking/event", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ eventType: "daily_visit" }),
                }).catch(() => {});
              }
            }
          }
        });
      } else if (event === "SIGNED_OUT") {
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
        });
        streakRecorded.current = false;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, fetchProfile]);

  return <>{children}</>;
}
