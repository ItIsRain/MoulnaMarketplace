"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import {
  ArrowLeft, Send, Store, Loader2, MessageSquare
} from "lucide-react";

interface SellerInfo {
  ownerId: string;
  shopName: string;
  shopSlug: string;
  logoUrl?: string;
  avatarStyle: string;
  avatarSeed: string;
}

export default function NewMessagePage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-[40vh]"><Loader2 className="w-8 h-8 animate-spin text-moulna-gold" /></div>}>
      <NewMessageForm />
    </React.Suspense>
  );
}

function NewMessageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerSlug = searchParams.get("seller");
  const productId = searchParams.get("product");

  const [seller, setSeller] = React.useState<SellerInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!sellerSlug) {
      setError("No seller specified");
      setLoading(false);
      return;
    }

    fetch(`/api/shops/${sellerSlug}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.shop) {
          setSeller({
            ownerId: data.shop.ownerId,
            shopName: data.shop.name,
            shopSlug: data.shop.slug,
            logoUrl: data.shop.logoUrl,
            avatarStyle: data.shop.avatarStyle || "adventurer",
            avatarSeed: data.shop.avatarSeed || data.shop.slug,
          });
        } else {
          setError("Seller not found");
        }
      })
      .catch(() => setError("Failed to load seller info"))
      .finally(() => setLoading(false));
  }, [sellerSlug]);

  async function handleSend() {
    if (!message.trim() || !seller || sending) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: seller.ownerId,
          content: message.trim(),
          productId: productId || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/messages/${data.conversationId}`);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Failed to send message");
      }
    } catch {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  if (error && !seller) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/messages">
            <ArrowLeft className="w-4 h-4 me-2" />
            Back to Messages
          </Link>
        </Button>
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">{error}</h3>
          <Button variant="gold" asChild>
            <Link href="/explore">Browse Listings</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/messages">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="font-display text-xl font-bold">New Message</h1>
      </div>

      {/* Seller Info */}
      {seller && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ShopAvatar
              logoUrl={seller.logoUrl}
              avatarSeed={seller.avatarSeed}
              avatarStyle={seller.avatarStyle}
              name={seller.shopName}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg">{seller.shopName}</h2>
                <Store className="w-4 h-4 text-moulna-gold" />
              </div>
              <p className="text-sm text-muted-foreground">
                Send a message to start a conversation
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Message Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'm interested in your listing..."
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="w-full bg-moulna-gold hover:bg-moulna-gold-dark"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin me-2" />
            ) : (
              <Send className="w-5 h-5 me-2" />
            )}
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
