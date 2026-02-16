"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn, timeAgo, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Phone, MessageSquare, Send, Sparkles,
  Clock, CheckCircle, Inbox, CheckCircle2, DollarSign
} from "lucide-react";

// Mock inquiry data
const INQUIRY = {
  id: "inq_1",
  status: "new",
  customer: {
    name: "Fatima Al Zahra",
    avatar: "fatima-customer",
    level: 4,
    joinDate: "2023",
    phone: "+971 50 123 4567",
  },
  listing: {
    title: "Royal Oud Collection - 50ml",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200",
    price: 45000,
    slug: "royal-oud-collection",
  },
  messages: [
    {
      id: "msg_1",
      sender: "customer",
      text: "Hi! Is this still available? I'm interested in the 50ml size. Can we meet somewhere in Dubai Marina?",
      date: "2024-02-13T10:30:00Z",
    },
    {
      id: "msg_2",
      sender: "seller",
      text: "Hello Fatima! Yes, it's still available. I can meet you at Dubai Marina Mall tomorrow around 5 PM. Would that work?",
      date: "2024-02-13T11:15:00Z",
    },
    {
      id: "msg_3",
      sender: "customer",
      text: "That sounds perfect! I'll be at the ground floor near the main entrance. Also, do you have the 100ml version available?",
      date: "2024-02-13T11:45:00Z",
    },
  ],
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  replied: { label: "Replied", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", icon: Inbox },
  sold: { label: "Sold", color: "bg-moulna-gold/10 text-moulna-gold dark:bg-moulna-gold/20 dark:text-moulna-gold", icon: CheckCircle2 },
};

export default function InquiryDetailPage() {
  const params = useParams();
  const inquiry = INQUIRY;
  const status = statusConfig[inquiry.status];
  const StatusIcon = status.icon;

  const [replyText, setReplyText] = React.useState("");
  const [showSoldForm, setShowSoldForm] = React.useState(false);
  const [salePrice, setSalePrice] = React.useState(String(inquiry.listing.price / 100));
  const [isSold, setIsSold] = React.useState(false);
  const [showXPNotification, setShowXPNotification] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/seller/orders">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Inquiry from {inquiry.customer.name}</h1>
              <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1", status.color)}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            <p className="text-muted-foreground">
              About: {inquiry.listing.title}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`tel:${inquiry.customer.phone}`}>
              <Phone className="w-4 h-4 me-2" />
              Call
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`https://wa.me/${inquiry.customer.phone.replace(/\s/g, "")}?text=Hi ${inquiry.customer.name}, regarding your inquiry about ${inquiry.listing.title}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="w-4 h-4 me-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Conversation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Reference */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={inquiry.listing.image}
                  alt={inquiry.listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <Link
                  href={`/products/${inquiry.listing.slug}`}
                  className="font-medium hover:text-moulna-gold transition-colors"
                >
                  {inquiry.listing.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Listed at AED {(inquiry.listing.price / 100).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/products/${inquiry.listing.slug}`}>
                  View Listing
                </Link>
              </Button>
            </div>
          </Card>

          {/* Messages */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Conversation</h2>
            <div className="space-y-4">
              {inquiry.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.sender === "seller" && "flex-row-reverse"
                  )}
                >
                  <DiceBearAvatar
                    seed={msg.sender === "customer" ? inquiry.customer.avatar : "seller-ahmed"}
                    size="sm"
                  />
                  <div className={cn(
                    "max-w-[70%] p-3 rounded-lg",
                    msg.sender === "seller"
                      ? "bg-moulna-gold/10 text-foreground"
                      : "bg-muted"
                  )}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(msg.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <div className="mt-6 pt-4 border-t">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-sm text-moulna-gold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reply within 1 hour for +50 XP</span>
                </div>
                <Button variant="gold" disabled={!replyText.trim()}>
                  <Send className="w-4 h-4 me-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Customer</h2>
            <div className="flex items-center gap-3 mb-4">
              <DiceBearAvatar seed={inquiry.customer.avatar} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{inquiry.customer.name}</p>
                  <LevelBadge level={inquiry.customer.level} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Member since {inquiry.customer.joinDate}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{inquiry.customer.phone}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {!isSold && (
                <>
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="w-4 h-4 me-2" />
                    Mark as Replied
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-moulna-gold/50 text-moulna-gold hover:bg-moulna-gold/5"
                    onClick={() => setShowSoldForm(!showSoldForm)}
                  >
                    <CheckCircle2 className="w-4 h-4 me-2" />
                    Mark as Sold
                  </Button>
                </>
              )}

              {/* Sold Confirmation Form */}
              {showSoldForm && !isSold && (
                <div className="p-4 rounded-lg border border-moulna-gold/30 bg-moulna-gold/5 space-y-3">
                  <h3 className="text-sm font-medium">Confirm Sale</h3>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Sale Price (AED)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        className="ps-8"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Buyer</label>
                    <p className="text-sm font-medium">{inquiry.customer.name}</p>
                  </div>
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={() => {
                      setIsSold(true);
                      setShowSoldForm(false);
                      setShowXPNotification(true);
                      setTimeout(() => setShowXPNotification(false), 4000);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 me-2" />
                    Confirm Sale
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowSoldForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Sold state */}
              {isSold && (
                <div className="p-4 rounded-lg bg-moulna-gold/10 border border-moulna-gold/30 text-center">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-moulna-gold mb-2" />
                  <p className="font-semibold text-moulna-gold">Sold!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sale recorded at AED {Number(salePrice).toLocaleString()}
                  </p>
                </div>
              )}

              {!isSold && (
                <Button variant="outline" className="w-full justify-start">
                  <Inbox className="w-4 h-4 me-2" />
                  Archive Inquiry
                </Button>
              )}
            </div>
          </Card>

          {/* XP Notification */}
          {showXPNotification && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-lg bg-gradient-to-r from-moulna-gold/20 to-yellow-400/20 border border-moulna-gold/40 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-moulna-gold" />
                <span className="text-lg font-bold text-moulna-gold">+100 XP</span>
              </div>
              <p className="text-sm text-muted-foreground">Sale completed! Keep selling to level up.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
