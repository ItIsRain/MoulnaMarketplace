"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  MessageSquare, Search, Send, Paperclip, Image,
  MoreHorizontal, Phone, Video, Star, Archive,
  Clock, CheckCheck, Filter
} from "lucide-react";

const CONVERSATIONS = [
  {
    id: "1",
    customer: {
      name: "Fatima Al Zahra",
      avatar: "fatima-msg",
      isOnline: true,
    },
    lastMessage: "Thank you! Can't wait to receive my order.",
    timestamp: "10:30 AM",
    unread: 0,
    isStarred: true,
    product: "Royal Oud Collection",
  },
  {
    id: "2",
    customer: {
      name: "Ahmed Hassan",
      avatar: "ahmed-msg",
      isOnline: false,
    },
    lastMessage: "Do you have this in a larger size?",
    timestamp: "9:15 AM",
    unread: 2,
    isStarred: false,
    product: "Arabian Nights Perfume",
  },
  {
    id: "3",
    customer: {
      name: "Sara Abdullah",
      avatar: "sara-msg",
      isOnline: true,
    },
    lastMessage: "Perfect, I'll place the order now",
    timestamp: "Yesterday",
    unread: 0,
    isStarred: false,
    product: "Musk Al Emarat",
  },
  {
    id: "4",
    customer: {
      name: "Omar Nasser",
      avatar: "omar-msg",
      isOnline: false,
    },
    lastMessage: "Is this product available for pickup?",
    timestamp: "Yesterday",
    unread: 1,
    isStarred: false,
    product: "Oud Wood Chips",
  },
];

const MESSAGES = [
  {
    id: "1",
    sender: "customer",
    content: "Assalamu alaikum! I'm interested in the Royal Oud Collection. Is it still available?",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    sender: "seller",
    content: "Wa alaikum assalam! Yes, we have it in stock. Would you like me to tell you more about it?",
    timestamp: "10:05 AM",
  },
  {
    id: "3",
    sender: "customer",
    content: "Yes please! How long does the fragrance last?",
    timestamp: "10:10 AM",
  },
  {
    id: "4",
    sender: "seller",
    content: "The Royal Oud Collection is our premium line with excellent longevity. Most customers report 8-12 hours of lasting fragrance, with the base notes remaining even longer. It's perfect for special occasions or everyday luxury.",
    timestamp: "10:15 AM",
  },
  {
    id: "5",
    sender: "customer",
    content: "That sounds perfect! I'll place my order now.",
    timestamp: "10:25 AM",
  },
  {
    id: "6",
    sender: "customer",
    content: "Thank you! Can't wait to receive my order.",
    timestamp: "10:30 AM",
  },
];

export default function SellerMessagesPage() {
  const [selectedConversation, setSelectedConversation] = React.useState(CONVERSATIONS[0]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [messageInput, setMessageInput] = React.useState("");

  const filteredConversations = CONVERSATIONS.filter(conv =>
    conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)]">
        <Card className="h-full flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-80 border-e flex flex-col">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="ps-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 p-4 border-b overflow-x-auto">
              <Button variant="default" size="sm">All</Button>
              <Button variant="outline" size="sm">Unread</Button>
              <Button variant="outline" size="sm">Starred</Button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full p-4 text-start hover:bg-muted/50 transition-colors border-b",
                    selectedConversation.id === conv.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <DiceBearAvatar seed={conv.customer.avatar} size="md" />
                      {conv.customer.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate">{conv.customer.name}</span>
                        <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {conv.product}
                        </Badge>
                        {conv.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                      </div>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-moulna-gold">{conv.unread}</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <DiceBearAvatar seed={selectedConversation.customer.avatar} size="md" />
                  {selectedConversation.customer.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedConversation.customer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.customer.isOnline ? "Online" : "Offline"}
                    {" • "}
                    <span className="text-moulna-gold">{selectedConversation.product}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Star className={cn(
                    "w-5 h-5",
                    selectedConversation.isStarred && "fill-yellow-400 text-yellow-400"
                  )} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Archive className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {MESSAGES.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.sender === "seller" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2",
                      message.sender === "seller"
                        ? "bg-moulna-gold text-white rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    )}
                  >
                    <p>{message.content}</p>
                    <div className={cn(
                      "flex items-center justify-end gap-1 mt-1",
                      message.sender === "seller" ? "text-white/70" : "text-muted-foreground"
                    )}>
                      <span className="text-xs">{message.timestamp}</span>
                      {message.sender === "seller" && (
                        <CheckCheck className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image className="w-5 h-5" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && messageInput.trim()) {
                      // Handle send
                      setMessageInput("");
                    }
                  }}
                />
                <Button size="icon" className="bg-moulna-gold hover:bg-moulna-gold-dark">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
    </div>
  );
}
