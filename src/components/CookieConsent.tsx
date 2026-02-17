"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("moulna_cookie_consent");
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("moulna_cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("moulna_cookie_consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-full bg-moulna-gold/10 items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-moulna-gold" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1">
                      We use cookies to enhance your experience
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We use cookies and similar technologies to track your activity, personalize your experience,
                      and improve our services. This includes tracking your browsing for challenges and rewards.
                      By accepting, you consent to our use of cookies as described in our{" "}
                      <Link href="/privacy" className="text-moulna-gold hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                  <button
                    onClick={handleDecline}
                    className="text-muted-foreground hover:text-foreground flex-shrink-0 sm:hidden"
                    aria-label="Dismiss"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Button
                    onClick={handleAccept}
                    className="bg-moulna-gold hover:bg-moulna-gold-dark text-white"
                    size="sm"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    size="sm"
                  >
                    Decline
                  </Button>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
