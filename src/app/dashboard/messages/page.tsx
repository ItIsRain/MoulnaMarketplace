"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  MessageSquare, Search, Store, Loader2
} from "lucide-react";

interface ConversationParticipant {
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

interface Conversation {
  id: string;
  participant: ConversationParticipant | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.ok ? res.json() : { conversations: [] })
      .then((data) => setConversations(data.conversations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = conversations.filter((c) => {
    if (!searchQuery) return true;
    const name = c.participant?.shopName || c.participant?.name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          Messages
        </h1>
        <p className="text-muted-foreground">
          Chat with sellers and manage your conversations
        </p>
      </div>

      {conversations.length > 0 ? (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>

          {/* Conversation List */}
          <Card className="divide-y">
            {filtered.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/dashboard/messages/${conv.id}`}
                  className={cn(
                    "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
                    conv.unreadCount > 0 && "bg-moulna-gold/5"
                  )}
                >
                  <div className="relative flex-shrink-0">
                    {conv.participant?.isShop ? (
                      <ShopAvatar
                        logoUrl={conv.participant.logoUrl}
                        avatarSeed={conv.participant.avatarSeed}
                        avatarStyle={conv.participant.avatarStyle}
                        name={conv.participant.shopName || conv.participant.name}
                        size="md"
                      />
                    ) : (
                      <DiceBearAvatar
                        seed={conv.participant?.avatarSeed || "user"}
                        style={conv.participant?.avatarStyle || "adventurer"}
                        size="md"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-medium truncate", conv.unreadCount > 0 && "font-semibold")}>
                        {conv.participant?.isShop
                          ? conv.participant.shopName || conv.participant.name
                          : conv.participant?.name || "Unknown"}
                      </span>
                      {conv.participant?.isShop && (
                        <Store className="w-3.5 h-3.5 text-moulna-gold flex-shrink-0" />
                      )}
                      {conv.participant && !conv.participant.isShop && conv.participant.level > 1 && (
                        <LevelBadge level={conv.participant.level} size="xs" />
                      )}
                    </div>
                    <p className={cn(
                      "text-sm truncate",
                      conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(conv.lastMessageAt)}
                    </span>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-moulna-gold text-white text-xs h-5 min-w-[20px] flex items-center justify-center">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </Card>
        </>
      ) : (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
          <p className="text-muted-foreground mb-6">
            When you contact a seller about a listing, your conversations will appear here
          </p>
          <Button variant="gold" asChild>
            <Link href="/explore">Browse Listings</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
