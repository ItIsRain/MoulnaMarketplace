"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn, timeAgo, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import {
  ArrowLeft, Send, Paperclip, Image, MoreVertical,
  Store, CheckCheck, Check, Smile, Loader2
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
  const [participant, setParticipant] = React.useState<Participant | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [relatedProduct, setRelatedProduct] = React.useState<RelatedProduct | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend() {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: message.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: data.messageId,
            senderId: "",
            content: message.trim(),
            isFromMe: true,
            read: false,
            createdAt: new Date().toISOString(),
          },
        ]);
        setMessage("");
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
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/messages">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            {participant?.isShop ? (
              <ShopAvatar
                logoUrl={participant.logoUrl}
                avatarSeed={participant.avatarSeed}
                avatarStyle={participant.avatarStyle}
                name={participant.shopName || participant.name}
                size="md"
              />
            ) : (
              <DiceBearAvatar
                seed={participant?.avatarSeed || "user"}
                style={participant?.avatarStyle || "adventurer"}
                size="md"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">
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
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex gap-4 mt-4 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  "flex",
                  msg.isFromMe ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2",
                  msg.isFromMe
                    ? "bg-moulna-gold text-white rounded-br-none"
                    : "bg-muted rounded-bl-none"
                )}>
                  <p>{msg.content}</p>
                  <div className={cn(
                    "flex items-center gap-1 mt-1 text-xs",
                    msg.isFromMe ? "text-white/70 justify-end" : "text-muted-foreground"
                  )}>
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.isFromMe && (
                      msg.read ? (
                        <CheckCheck className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sidebar */}
        <div className="w-80 hidden lg:block space-y-4 flex-shrink-0">
          {/* Participant Info */}
          <Card className="p-4">
            <div className="text-center mb-4">
              {participant?.isShop ? (
                <div className="mx-auto mb-3 flex justify-center">
                  <ShopAvatar
                    logoUrl={participant.logoUrl}
                    avatarSeed={participant.avatarSeed}
                    avatarStyle={participant.avatarStyle}
                    name={participant.shopName || participant.name}
                    size="xl"
                  />
                </div>
              ) : (
                <DiceBearAvatar
                  seed={participant?.avatarSeed || "user"}
                  style={participant?.avatarStyle || "adventurer"}
                  size="xl"
                  className="mx-auto mb-3"
                />
              )}
              <h3 className="font-semibold">
                {participant?.isShop
                  ? participant.shopName || participant.name
                  : participant?.name || "Unknown"}
              </h3>
            </div>
            {participant?.isShop && participant.shopSlug && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/shops/${participant.shopSlug}`}>
                  View Shop
                </Link>
              </Button>
            )}
          </Card>

          {/* Related Product */}
          {relatedProduct && (
            <Card className="p-4">
              <h4 className="font-medium text-sm mb-3">Related Listing</h4>
              <div className="flex gap-3">
                {relatedProduct.image ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover"
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

      {/* Input Area — full width below messages + sidebar */}
      <div className="pt-4 border-t mt-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Image className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="pe-12"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="bg-moulna-gold hover:bg-moulna-gold-dark flex-shrink-0"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
