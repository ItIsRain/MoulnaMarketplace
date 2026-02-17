"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { formatAED } from "@/lib/utils";
import {
  Inbox, Search, Filter, Clock, MessageCircle,
  CheckCircle, CheckCircle2, Eye, Sparkles, Loader2
} from "lucide-react";

interface InquiryCustomer {
  id: string;
  name: string;
  username: string;
  avatarStyle: string;
  avatarSeed: string;
  level: number;
  joinDate: string;
}

interface InquiryListing {
  title: string;
  slug: string;
  priceFils: number;
  image: string | null;
}

interface Inquiry {
  id: string;
  status: string;
  salePriceFils: number | null;
  customer: InquiryCustomer | null;
  listing: InquiryListing | null;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
}

interface Stats {
  total: number;
  new: number;
  replied: number;
  archived: number;
  sold: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  replied: { label: "Replied", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", icon: Inbox },
  sold: { label: "Sold", color: "bg-moulna-gold/10 text-moulna-gold dark:bg-moulna-gold/20 dark:text-moulna-gold", icon: CheckCircle2 },
};

export default function SellerInquiriesPage() {
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [stats, setStats] = React.useState<Stats>({ total: 0, new: 0, replied: 0, archived: 0, sold: 0 });
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    fetch("/api/inquiries")
      .then((res) => res.ok ? res.json() : { inquiries: [], stats: { total: 0, new: 0, replied: 0, archived: 0, sold: 0 } })
      .then((data) => {
        setInquiries(data.inquiries || []);
        setStats(data.stats || { total: 0, new: 0, replied: 0, archived: 0, sold: 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    const name = inquiry.customer?.name || "";
    const title = inquiry.listing?.title || "";
    const msg = inquiry.lastMessage || "";
    const matchesSearch = !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
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
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <Inbox className="w-6 h-6" />
          Inquiries
        </h1>
        <p className="text-muted-foreground">
          Manage buyer inquiries about your listings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total", value: stats.total, filter: "all" },
          { label: "New", value: stats.new, filter: "new", urgent: stats.new > 0 },
          { label: "Replied", value: stats.replied, filter: "replied" },
          { label: "Sold", value: stats.sold, filter: "sold" },
          { label: "Archived", value: stats.archived, filter: "archived" },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => setStatusFilter(stat.filter)}
            className={cn(
              "text-center p-4 rounded-xl border-2 transition-all",
              statusFilter === stat.filter
                ? "border-moulna-gold bg-moulna-gold/5"
                : "border-transparent bg-card hover:border-muted"
            )}
          >
            <p className={cn(
              "text-2xl font-bold",
              stat.urgent && "text-blue-600"
            )}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, listing, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 me-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry, index) => {
          const status = statusConfig[inquiry.status] || statusConfig.new;
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "p-6",
                inquiry.status === "new" && "border-blue-200 dark:border-blue-900/50"
              )}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <DiceBearAvatar
                      seed={inquiry.customer?.avatarSeed || "user"}
                      style={inquiry.customer?.avatarStyle || "adventurer"}
                      size="lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{inquiry.customer?.name || "Unknown"}</span>
                        {inquiry.customer && inquiry.customer.level > 1 && (
                          <LevelBadge level={inquiry.customer.level} size="sm" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Member since {inquiry.customer?.joinDate || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1", status.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {timeAgo(inquiry.lastMessageAt || inquiry.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Listing Reference */}
                {inquiry.listing && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
                    {inquiry.listing.image ? (
                      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={inquiry.listing.image}
                          alt={inquiry.listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{inquiry.listing.title}</p>
                      <p className="text-xs text-muted-foreground">Listed at {formatAED(inquiry.listing.priceFils)}</p>
                    </div>
                    {inquiry.status === "sold" && inquiry.salePriceFils && (
                      <Badge className="bg-moulna-gold/10 text-moulna-gold border-moulna-gold/30">
                        Sold {formatAED(inquiry.salePriceFils)}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Message Preview */}
                {inquiry.lastMessage && (
                  <p className="text-muted-foreground mb-4">
                    &ldquo;{inquiry.lastMessage}&rdquo;
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {inquiry.status === "new" && (
                      <div className="flex items-center gap-1 text-moulna-gold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Reply fast for +50 XP</span>
                      </div>
                    )}
                    {inquiry.unreadCount > 0 && (
                      <Badge className="bg-moulna-gold text-white text-xs">
                        {inquiry.unreadCount} new
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {inquiry.status === "new" && (
                      <Button variant="gold" size="sm" asChild>
                        <Link href={`/seller/orders/${inquiry.id}`}>
                          <MessageCircle className="w-4 h-4 me-2" />
                          Reply
                        </Link>
                      </Button>
                    )}
                    {inquiry.status === "replied" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/seller/orders/${inquiry.id}`}>
                          <MessageCircle className="w-4 h-4 me-2" />
                          Continue Chat
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/seller/orders/${inquiry.id}`}>
                        <Eye className="w-4 h-4 me-2" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {filteredInquiries.length === 0 && (
          <Card className="p-12 text-center">
            <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No inquiries found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "New inquiries from buyers will appear here"
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
