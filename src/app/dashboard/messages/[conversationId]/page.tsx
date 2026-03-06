"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { cn, timeAgo, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ArrowLeft, Send, Store, Loader2, Package
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  username: string;
  avatarStyle: string;
  avatarSeed: string;
  level: number;
  isShop: boolean;
  shopName?: string;
  shopSlug?: string;
  logoUrl?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  isFromMe: boolean;
  read: boolean;
  createdAt: string;
}

interface RelatedProduct {
  id: string;
  title: string;
  slug: string;
  priceFils: number;
  image: string | null;
}

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { user } = useAuthStore();
  const [participant, setParticipant] = React.useState<Participant | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [relatedProduct, setRelatedProduct] = React.useState<RelatedProduct | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [replyText, setReplyText] = React.useState("");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/messages?conversationId=${conversationId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          setParticipant(data.participant);
          setMessages(data.messages || []);
          setRelatedProduct(data.relatedProduct);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [conversationId]);

  async function handleSendReply() {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: replyText.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: data.messageId,
            senderId: "",
            content: replyText.trim(),
            isFromMe: true,
            read: false,
            createdAt: new Date().toISOString(),
          },
        ]);
        setReplyText("");
      }
    } catch {
      // silently fail
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/messages">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {participant?.isShop
                ? participant.shopName || participant.name
                : participant?.name || "Unknown"}
            </h1>
            {participant?.isShop && (
              <Badge variant="outline" className="text-xs">
                <Store className="w-3 h-3 me-1" />
                Shop
              </Badge>
            )}
          </div>
          {relatedProduct && (
            <p className="text-muted-foreground">
              About: {relatedProduct.title}
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Conversation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Reference */}
          {relatedProduct && (
            <Card className="p-4">
              <div className="flex items-center gap-4">
                {relatedProduct.image ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                )}
                <div className="flex-1">
                  <Link
                    href={`/products/${relatedProduct.slug}`}
                    className="font-medium hover:text-moulna-gold transition-colors"
                  >
                    {relatedProduct.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Listed at {formatAED(relatedProduct.priceFils)}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/products/${relatedProduct.slug}`}>
                    View Listing
                  </Link>
                </Button>
              </div>
            </Card>
          )}

          {/* Messages */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Conversation</h2>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No messages yet</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.isFromMe && "flex-row-reverse"
                    )}
                  >
                    <DiceBearAvatar
                      seed={msg.isFromMe ? (user?.avatar?.seed || "me") : (participant?.avatarSeed || "user")}
                      style={msg.isFromMe ? (user?.avatar?.style || "adventurer") : (participant?.avatarStyle || "adventurer")}
                      size="sm"
                    />
                    <div className={cn(
                      "max-w-[70%] p-3 rounded-lg",
                      msg.isFromMe
                        ? "bg-moulna-gold/10 text-foreground"
                        : "bg-muted"
                    )}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Reply Box */}
            <div className="mt-6 pt-4 border-t">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your message..."
                rows={3}
              />
              <div className="flex items-center justify-end mt-3">
                <Button
                  variant="gold"
                  disabled={!replyText.trim() || sending}
                  onClick={handleSendReply}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 me-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 me-2" />
                  )}
                  Send Message
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">
              {participant?.isShop ? "Shop" : "Seller"}
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <DiceBearAvatar
                seed={participant?.avatarSeed || "user"}
                style={participant?.avatarStyle || "adventurer"}
                size="lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {participant?.isShop
                      ? participant.shopName || participant.name
                      : participant?.name || "Unknown"}
                  </p>
                  {participant && participant.level > 1 && (
                    <LevelBadge level={participant.level} size="sm" />
                  )}
                </div>
                {participant?.isShop && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    Verified Shop
                  </p>
                )}
              </div>
            </div>
            {participant?.isShop && participant.shopSlug && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/shops/${participant.shopSlug}`}>
                  View Shop
                </Link>
              </Button>
            )}
          </Card>

          {/* Related Listing */}
          {relatedProduct && (
            <Card className="p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Related Listing
              </h2>
              <div className="flex gap-3">
                {relatedProduct.image ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{relatedProduct.title}</p>
                  <p className="font-semibold text-moulna-gold mt-1">
                    {formatAED(relatedProduct.priceFils)}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <Link href={`/products/${relatedProduct.slug}`}>
                  View Listing
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
