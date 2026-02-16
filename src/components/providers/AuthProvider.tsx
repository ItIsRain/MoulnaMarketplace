"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

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
          }
        });
      } else if (event === "SIGNED_OUT") {
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, fetchProfile]);

  return <>{children}</>;
}
