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
  CheckCircle, CheckCircle2, ChevronRight, Eye, Sparkles, Phone
} from "lucide-react";

const INQUIRIES = [
  {
    id: "inq_1",
    customer: {
      name: "Fatima M.",
      avatar: "fatima-m",
      level: 4,
      joinDate: "2023",
    },
    listing: {
      title: "Arabian Oud Perfume - 100ml",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100",
      price: 45000,
    },
    message: "Hi, is this still available? Can I get it in 150ml? Also, Can we meet in Abu Dhabi?",
    status: "new",
    date: "2024-02-13T10:30:00Z",
  },
  {
    id: "inq_2",
    customer: {
      name: "Ahmed K.",
      avatar: "ahmed-k",
      level: 7,
      joinDate: "2022",
    },
    listing: {
      title: "Premium Oud Gift Set",
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=100",
      price: 85000,
    },
    message: "What's the best price for 5 sets? I need them for corporate gifts.",
    status: "replied",
    date: "2024-02-13T08:15:00Z",
  },
  {
    id: "inq_3",
    customer: {
      name: "Sara A.",
      avatar: "sara-a",
      level: 5,
      joinDate: "2023",
    },
    listing: {
      title: "Amber & Musk Blend",
      image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=100",
      price: 35000,
    },
    message: "Can we meet in Dubai Marina for pickup? I'd like to smell it first before buying.",
    status: "new",
    date: "2024-02-12T16:45:00Z",
  },
  {
    id: "inq_4",
    customer: {
      name: "Khalid R.",
      avatar: "khalid-r",
      level: 3,
      joinDate: "2024",
    },
    listing: {
      title: "Home Fragrance Diffuser",
      image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=100",
      price: 22000,
    },
    message: "Thank you! I'll take it. When can we arrange the handover?",
    status: "replied",
    date: "2024-02-11T14:20:00Z",
  },
  {
    id: "inq_5",
    customer: {
      name: "Noura S.",
      avatar: "noura-s",
      level: 2,
      joinDate: "2024",
    },
    listing: {
      title: "Rose Oud Mist",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=100",
      price: 22000,
    },
    message: "Is this available in a smaller size? Looking for something for travel.",
    status: "archived",
    date: "2024-02-10T09:00:00Z",
  },
  {
    id: "inq_6",
    customer: {
      name: "Layla H.",
      avatar: "layla-h",
      level: 6,
      joinDate: "2023",
    },
    listing: {
      title: "Premium Oud Gift Set",
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=100",
      price: 85000,
    },
    message: "Deal done! Thank you for the beautiful set.",
    status: "sold",
    salePrice: 82000,
    date: "2024-02-09T12:00:00Z",
  },
  {
    id: "inq_7",
    customer: {
      name: "Mohammed A.",
      avatar: "mohammed-a",
      level: 5,
      joinDate: "2022",
    },
    listing: {
      title: "Arabian Oud Perfume - 100ml",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100",
      price: 45000,
    },
    message: "Picked up today, smells amazing. Thank you!",
    status: "sold",
    salePrice: 45000,
    date: "2024-02-07T15:30:00Z",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  replied: { label: "Replied", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", icon: Inbox },
  sold: { label: "Sold", color: "bg-moulna-gold/10 text-moulna-gold dark:bg-moulna-gold/20 dark:text-moulna-gold", icon: CheckCircle2 },
};

export default function SellerInquiriesPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredInquiries = INQUIRIES.filter(inquiry => {
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    const matchesSearch = inquiry.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: INQUIRIES.length,
    new: INQUIRIES.filter(i => i.status === "new").length,
    replied: INQUIRIES.filter(i => i.status === "replied").length,
    archived: INQUIRIES.filter(i => i.status === "archived").length,
    sold: INQUIRIES.filter(i => i.status === "sold").length,
  };

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
          const status = statusConfig[inquiry.status];
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
                    <DiceBearAvatar seed={inquiry.customer.avatar} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{inquiry.customer.name}</span>
                        <LevelBadge level={inquiry.customer.level} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Member since {inquiry.customer.joinDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1", status.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {timeAgo(inquiry.date)}
                    </p>
                  </div>
                </div>

                {/* Listing Reference */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={inquiry.listing.image}
                      alt={inquiry.listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{inquiry.listing.title}</p>
                    <p className="text-xs text-muted-foreground">Listed at AED {(inquiry.listing.price / 100).toLocaleString()}</p>
                  </div>
                  {inquiry.status === "sold" && "salePrice" in inquiry && (
                    <Badge className="bg-moulna-gold/10 text-moulna-gold border-moulna-gold/30">
                      Sold {formatAED((inquiry as { salePrice: number }).salePrice)}
                    </Badge>
                  )}
                </div>

                {/* Message Preview */}
                <p className="text-muted-foreground mb-4">
                  &ldquo;{inquiry.message}&rdquo;
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {inquiry.status === "new" && (
                      <div className="flex items-center gap-1 text-moulna-gold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Reply fast for +50 XP</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {inquiry.status === "new" && (
                      <Button variant="gold" size="sm" asChild>
                        <Link href={`/seller/messages/${inquiry.id}`}>
                          <MessageCircle className="w-4 h-4 me-2" />
                          Reply
                        </Link>
                      </Button>
                    )}
                    {inquiry.status === "replied" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/seller/messages/${inquiry.id}`}>
                          <MessageCircle className="w-4 h-4 me-2" />
                          Continue Chat
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/seller/messages/${inquiry.id}`}>
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
