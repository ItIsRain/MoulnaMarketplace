"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  ArrowLeft, Send, Paperclip, Image, MoreVertical, Phone,
  Star, Package, Clock, CheckCheck, Check
} from "lucide-react";

const CONVERSATION = {
  id: "conv-1",
  customer: {
    name: "Sarah Ahmed",
    avatar: "sarah-ahmed",
    level: 6,
    isOnline: true,
    lastSeen: "Online",
  },
  relatedInquiry: {
    id: "MN-2024-8923",
    listing: "Premium Oud Collection Set",
    status: "replied",
  },
};

const MESSAGES = [
  {
    id: "1",
    sender: "customer",
    content: "Assalamu alaikum! I picked up the oud set yesterday and it's absolutely amazing! 🙏",
    time: "10:30 AM",
    status: "read",
  },
  {
    id: "2",
    sender: "seller",
    content: "Wa alaikum assalam! Thank you so much for your kind words, Sarah! We're thrilled you love the collection.",
    time: "10:35 AM",
    status: "read",
  },
  {
    id: "3",
    sender: "customer",
    content: "I have a question - do you have any recommendations for how to best store the oud chips to maintain their quality?",
    time: "10:38 AM",
    status: "read",
  },
  {
    id: "4",
    sender: "seller",
    content: "Great question! For optimal preservation, store the oud chips in a cool, dry place away from direct sunlight. The airtight container we provided is perfect for this. You can also wrap them in a soft cloth for extra protection.",
    time: "10:42 AM",
    status: "read",
  },
  {
    id: "5",
    sender: "customer",
    content: "Perfect, thank you! Also, will you have the limited edition Ramadan collection this year?",
    time: "10:45 AM",
    status: "read",
  },
  {
    id: "6",
    sender: "seller",
    content: "Yes! We're preparing a special Ramadan collection that will launch next month. Would you like me to notify you when it's available?",
    time: "10:48 AM",
    status: "delivered",
  },
  {
    id: "7",
    sender: "customer",
    content: "Yes please! That would be wonderful 💜",
    time: "10:50 AM",
    status: "read",
  },
];

export default function SellerConversationPage() {
  const params = useParams();
  const [message, setMessage] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/seller/messages">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <DiceBearAvatar seed={CONVERSATION.customer.avatar} size="md" />
              {CONVERSATION.customer.isOnline && (
                <div className="absolute bottom-0 end-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{CONVERSATION.customer.name}</span>
                <LevelBadge level={CONVERSATION.customer.level} size="sm" />
              </div>
              <p className="text-sm text-green-600">{CONVERSATION.customer.lastSeen}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Related Inquiry */}
      {CONVERSATION.relatedInquiry && (
        <div className="py-3 border-b">
          <Link
            href={`/seller/orders/${CONVERSATION.relatedInquiry.id}`}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <Package className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{CONVERSATION.relatedInquiry.listing}</p>
              <p className="text-xs text-muted-foreground">
                Inquiry {CONVERSATION.relatedInquiry.id}
              </p>
            </div>
            <Badge variant="secondary" className="capitalize">
              {CONVERSATION.relatedInquiry.status}
            </Badge>
          </Link>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {MESSAGES.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex",
              msg.sender === "seller" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3",
                msg.sender === "seller"
                  ? "bg-moulna-gold text-white rounded-br-md"
                  : "bg-muted rounded-bl-md"
              )}
            >
              <p className="text-sm">{msg.content}</p>
              <div
                className={cn(
                  "flex items-center justify-end gap-1 mt-1",
                  msg.sender === "seller" ? "text-white/70" : "text-muted-foreground"
                )}
              >
                <span className="text-xs">{msg.time}</span>
                {msg.sender === "seller" && (
                  msg.status === "read" ? (
                    <CheckCheck className="w-4 h-4" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )
                )}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Image className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-moulna-gold hover:bg-moulna-gold-dark"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <Button variant="outline" size="sm">
            📦 Share Product
          </Button>
          <Button variant="outline" size="sm">
            🎁 Send Coupon
          </Button>
          <Button variant="outline" size="sm">
            ⭐ Request Review
          </Button>
        </div>
      </div>
    </div>
  );
}
