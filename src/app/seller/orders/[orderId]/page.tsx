"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn, timeAgo, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft, Phone, MessageSquare, Send, Sparkles,
  Clock, CheckCircle, Inbox, CheckCircle2, DollarSign, Loader2
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  username: string;
  avatarStyle: string;
  avatarSeed: string;
  level: number;
  phone: string | null;
  joinDate: string;
}

interface Listing {
  id: string;
  title: string;
  slug: string;
  priceFils: number;
  image: string | null;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  isFromMe: boolean;
  read: boolean;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  replied: { label: "Replied", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", icon: Inbox },
  sold: { label: "Sold", color: "bg-moulna-gold/10 text-moulna-gold dark:bg-moulna-gold/20 dark:text-moulna-gold", icon: CheckCircle2 },
};

export default function InquiryDetailPage() {
  const params = useParams();
  const inquiryId = params.orderId as string;

  const [inquiryStatus, setInquiryStatus] = React.useState("new");
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [listing, setListing] = React.useState<Listing | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [replyText, setReplyText] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [showSoldForm, setShowSoldForm] = React.useState(false);
  const [salePrice, setSalePrice] = React.useState("");
  const [showXPNotification, setShowXPNotification] = React.useState(false);
  const [updatingStatus, setUpdatingStatus] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/inquiries?id=${inquiryId}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) {
          setInquiryStatus(data.inquiry.status);
          setCustomer(data.customer);
          setListing(data.listing);
          setMessages(data.messages || []);
          if (data.listing) {
            setSalePrice(String(data.listing.priceFils / 100));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [inquiryId]);

  async function handleSendReply() {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: inquiryId,
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
        if (inquiryStatus === "new") {
          setInquiryStatus("replied");
        }
      }
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  async function updateStatus(newStatus: string, salePriceFils?: number) {
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId,
          status: newStatus,
          salePriceFils,
        }),
      });
      if (res.ok) {
        setInquiryStatus(newStatus);
        if (newStatus === "sold") {
          setShowSoldForm(false);
          setShowXPNotification(true);
          setTimeout(() => setShowXPNotification(false), 4000);
        }
      }
    } catch {
      toast.error("Failed to update order");
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  const status = statusConfig[inquiryStatus] || statusConfig.new;
  const StatusIcon = status.icon;

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
              <h1 className="text-2xl font-bold">Inquiry from {customer?.name || "Unknown"}</h1>
              <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1", status.color)}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            <p className="text-muted-foreground">
              About: {listing?.title || "—"}
            </p>
          </div>
        </div>
        {customer?.phone && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={`tel:${customer.phone}`}>
                <Phone className="w-4 h-4 me-2" />
                Call
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`https://wa.me/${customer.phone.replace(/\s/g, "")}?text=Hi ${customer.name}, regarding your inquiry about ${listing?.title || "your listing"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="w-4 h-4 me-2" />
                WhatsApp
              </a>
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Conversation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Reference */}
          {listing && (
            <Card className="p-4">
              <div className="flex items-center gap-4">
                {listing.image ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0" />
                )}
                <div className="flex-1">
                  <Link
                    href={`/products/${listing.slug}`}
                    className="font-medium hover:text-moulna-gold transition-colors"
                  >
                    {listing.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Listed at {formatAED(listing.priceFils)}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/products/${listing.slug}`}>
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
                      seed={msg.isFromMe ? "seller" : (customer?.avatarSeed || "user")}
                      style={msg.isFromMe ? "adventurer" : (customer?.avatarStyle || "adventurer")}
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
            {inquiryStatus !== "sold" && inquiryStatus !== "archived" && (
              <div className="mt-6 pt-4 border-t">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-sm text-moulna-gold">
                    {inquiryStatus === "new" && (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Reply within 1 hour for +50 XP</span>
                      </>
                    )}
                  </div>
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
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Customer</h2>
            <div className="flex items-center gap-3 mb-4">
              <DiceBearAvatar
                seed={customer?.avatarSeed || "user"}
                style={customer?.avatarStyle || "adventurer"}
                size="lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{customer?.name || "Unknown"}</p>
                  {customer && customer.level > 1 && (
                    <LevelBadge level={customer.level} size="sm" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Member since {customer?.joinDate || "—"}
                </p>
              </div>
            </div>
            {customer?.phone && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {inquiryStatus !== "sold" && (
                <>
                  {inquiryStatus === "new" && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={updatingStatus}
                      onClick={() => updateStatus("replied")}
                    >
                      <CheckCircle className="w-4 h-4 me-2" />
                      Mark as Replied
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start border-moulna-gold/50 text-moulna-gold hover:bg-moulna-gold/5"
                    onClick={() => setShowSoldForm(!showSoldForm)}
                    disabled={updatingStatus}
                  >
                    <CheckCircle2 className="w-4 h-4 me-2" />
                    Mark as Sold
                  </Button>
                </>
              )}

              {/* Sold Confirmation Form */}
              {showSoldForm && inquiryStatus !== "sold" && (
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
                    <p className="text-sm font-medium">{customer?.name || "Unknown"}</p>
                  </div>
                  <Button
                    variant="gold"
                    className="w-full"
                    disabled={updatingStatus}
                    onClick={() => updateStatus("sold", Math.round(Number(salePrice) * 100))}
                  >
                    {updatingStatus ? (
                      <Loader2 className="w-4 h-4 me-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 me-2" />
                    )}
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
              {inquiryStatus === "sold" && (
                <div className="p-4 rounded-lg bg-moulna-gold/10 border border-moulna-gold/30 text-center">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-moulna-gold mb-2" />
                  <p className="font-semibold text-moulna-gold">Sold!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sale recorded at AED {Number(salePrice).toLocaleString()}
                  </p>
                </div>
              )}

              {inquiryStatus !== "sold" && inquiryStatus !== "archived" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled={updatingStatus}
                  onClick={() => updateStatus("archived")}
                >
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
