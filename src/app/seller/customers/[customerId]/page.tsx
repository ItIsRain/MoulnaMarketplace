"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  ArrowLeft, MapPin, Calendar,
  MessageSquare, Heart, Loader2,
  Clock, TrendingUp, Award, Gift, User
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  replied: "bg-green-100 text-green-700",
  sold: "bg-purple-100 text-purple-700",
  archived: "bg-gray-100 text-gray-700",
};

interface CustomerData {
  id: string;
  name: string;
  username: string;
  avatarStyle: string | null;
  avatarSeed: string | null;
  location: string | null;
  level: number;
  joinedAt: string;
  totalInquiries: number;
  isFollower: boolean;
  isRepeat: boolean;
}

interface Conversation {
  id: string;
  productId: string | null;
  productTitle: string;
  status: string;
  createdAt: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.customerId as string;
  const [loading, setLoading] = React.useState(true);
  const [customer, setCustomer] = React.useState<CustomerData | null>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);

  React.useEffect(() => {
    fetch(`/api/seller/analytics?section=customer&customerId=${customerId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setCustomer(data.customer);
          setConversations(data.conversations || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/seller/customers">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <Card className="p-12 text-center">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Customer not found</h3>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/seller/customers">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Customer Details</h1>
          <p className="text-muted-foreground">
            View customer information and inquiry history
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Profile */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="text-center mb-6">
              <DiceBearAvatar
                seed={customer.avatarSeed || customer.username || customer.id}
                style={customer.avatarStyle || undefined}
                size="xl"
                className="w-24 h-24 mx-auto mb-4"
              />
              <h2 className="text-xl font-bold">{customer.name}</h2>
              {customer.username && (
                <p className="text-sm text-muted-foreground">@{customer.username}</p>
              )}
              <div className="flex items-center justify-center gap-2 mt-2">
                <LevelBadge level={customer.level} size="sm" />
                {customer.totalInquiries >= 5 && (
                  <Badge className="bg-purple-100 text-purple-700">
                    <Award className="w-3 h-3 me-1" />
                    VIP
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {customer.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Customer since {formatDate(customer.joinedAt)}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button className="flex-1 bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
                <Link href={`/seller/messages?recipientId=${customer.id}`}>
                  <MessageSquare className="w-4 h-4 me-2" />
                  Message
                </Link>
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Customer Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <MessageSquare className="w-5 h-5 mx-auto text-moulna-gold mb-1" />
                <p className="text-xl font-bold">{customer.totalInquiries}</p>
                <p className="text-xs text-muted-foreground">Total Inquiries</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <TrendingUp className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <p className="text-xl font-bold">{customer.isRepeat ? "Yes" : "No"}</p>
                <p className="text-xs text-muted-foreground">Repeat Customer</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Clock className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                <p className="text-xl font-bold">
                  {conversations.length > 0 ? formatDate(conversations[0].createdAt) : "-"}
                </p>
                <p className="text-xs text-muted-foreground">Last Inquiry</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Gift className="w-5 h-5 mx-auto text-green-600 mb-1" />
                <p className="text-xl font-bold">Lv.{customer.level}</p>
                <p className="text-xs text-muted-foreground">Customer Level</p>
              </div>
            </div>
          </Card>

          {/* Engagement */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Engagement</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Follows your shop</span>
                {customer.isFollower ? (
                  <Badge className="bg-green-100 text-green-700">
                    <Heart className="w-3 h-3 me-1 fill-current" />
                    Following
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not following</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer type</span>
                <Badge variant="secondary">
                  {customer.isRepeat ? "Returning" : "New"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Inquiry History */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Inquiry History</h3>
              <Badge variant="secondary">{conversations.length} total</Badge>
            </div>

            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No inquiry history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv, index) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {conv.productTitle}
                        </span>
                        <Badge className={STATUS_COLORS[conv.status] || STATUS_COLORS.new}>
                          {conv.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(conv.createdAt)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/seller/orders/${conv.id}`}>
                        View
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
