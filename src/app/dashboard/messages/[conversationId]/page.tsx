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
import {
  ArrowLeft, Send, Paperclip, Image, MoreVertical,
  Phone, Video, Star, Flag, Trash2, Archive, Search,
  Check, CheckCheck, Smile
} from "lucide-react";

const CONVERSATION = {
  id: "conv-1",
  participant: {
    name: "Arabian Scents Boutique",
    avatar: "arabian-scents",
    isOnline: true,
    isVerified: true,
    type: "seller",
  },
  messages: [
    {
      id: "1",
      sender: "them",
      content: "Hello! Thank you for your interest in our Premium Oud Collection. How can I help you today?",
      timestamp: "10:30 AM",
      status: "read",
    },
    {
      id: "2",
      sender: "me",
      content: "Hi! I wanted to ask about the shipping time to Abu Dhabi. Also, do you offer gift wrapping?",
      timestamp: "10:32 AM",
      status: "read",
    },
    {
      id: "3",
      sender: "them",
      content: "Great questions! Shipping to Abu Dhabi typically takes 1-2 business days. And yes, we do offer complimentary gift wrapping on all orders! 🎁",
      timestamp: "10:35 AM",
      status: "read",
    },
    {
      id: "4",
      sender: "me",
      content: "That's perfect! I'm ordering it as a gift. Can you also include a handwritten note?",
      timestamp: "10:38 AM",
      status: "read",
    },
    {
      id: "5",
      sender: "them",
      content: "Absolutely! Just add your message in the order notes and we'll include a beautiful handwritten card with your gift. Is there anything else you'd like to know?",
      timestamp: "10:40 AM",
      status: "read",
    },
    {
      id: "6",
      sender: "me",
      content: "That sounds wonderful! One more thing - do you have any ongoing promotions?",
      timestamp: "10:42 AM",
      status: "delivered",
    },
  ],
  relatedOrder: {
    id: "ORD-2024-1234",
    product: "Premium Oud Collection Set",
    price: 450,
  },
};

export default function ConversationPage() {
  const params = useParams();
  const [message, setMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [CONVERSATION.messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    // In real app, send message
    setMessage("");
  };

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
            <div className="relative">
              <DiceBearAvatar seed={CONVERSATION.participant.avatar} size="md" />
              {CONVERSATION.participant.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">{CONVERSATION.participant.name}</h1>
                {CONVERSATION.participant.isVerified && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {CONVERSATION.participant.isOnline ? "Online" : "Last seen 2h ago"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 mt-4 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Date Separator */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 border-t" />
              <span className="text-xs text-muted-foreground">Today</span>
              <div className="flex-1 border-t" />
            </div>

            {CONVERSATION.messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex",
                  msg.sender === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2",
                  msg.sender === "me"
                    ? "bg-moulna-gold text-white rounded-br-none"
                    : "bg-muted rounded-bl-none"
                )}>
                  <p>{msg.content}</p>
                  <div className={cn(
                    "flex items-center gap-1 mt-1 text-xs",
                    msg.sender === "me" ? "text-white/70 justify-end" : "text-muted-foreground"
                  )}>
                    <span>{msg.timestamp}</span>
                    {msg.sender === "me" && (
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

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <DiceBearAvatar seed={CONVERSATION.participant.avatar} size="xs" />
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="pt-4 border-t mt-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
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
                disabled={!message.trim()}
                className="bg-moulna-gold hover:bg-moulna-gold-dark"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 hidden lg:block space-y-4">
          {/* Participant Info */}
          <Card className="p-4">
            <div className="text-center mb-4">
              <DiceBearAvatar
                seed={CONVERSATION.participant.avatar}
                size="xl"
                className="w-20 h-20 mx-auto mb-3"
              />
              <h3 className="font-semibold">{CONVERSATION.participant.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {CONVERSATION.participant.type === "seller" ? "Seller" : "Buyer"}
              </Badge>
            </div>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 me-1" />
                Follow
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/shops/${CONVERSATION.participant.avatar}`}>
                  View Shop
                </Link>
              </Button>
            </div>
          </Card>

          {/* Related Order */}
          {CONVERSATION.relatedOrder && (
            <Card className="p-4">
              <h4 className="font-medium text-sm mb-3">Related Order</h4>
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {CONVERSATION.relatedOrder.product}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {CONVERSATION.relatedOrder.id}
                  </p>
                  <p className="font-semibold text-moulna-gold mt-1">
                    AED {CONVERSATION.relatedOrder.price}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <Link href={`/dashboard/orders/${CONVERSATION.relatedOrder.id}`}>
                  View Order
                </Link>
              </Button>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-4">
            <h4 className="font-medium text-sm mb-3">Actions</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Archive className="w-4 h-4 me-2" />
                Archive Conversation
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Flag className="w-4 h-4 me-2" />
                Report User
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-red-500">
                <Trash2 className="w-4 h-4 me-2" />
                Delete Conversation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
