"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  MessageSquare, Search, Send, Paperclip, Image as ImageIcon,
  MoreVertical, Phone, Video, Check, CheckCheck, Store
} from "lucide-react";

const CONVERSATIONS = [
  {
    id: "conv_1",
    participant: {
      name: "Scent of Arabia",
      avatar: "scent-of-arabia",
      isShop: true,
      isOnline: true,
    },
    lastMessage: {
      text: "Yes, it's still available! When would you like to meet?",
      timestamp: "2024-02-13T10:30:00Z",
      isFromMe: false,
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: "conv_2",
    participant: {
      name: "Heritage Jewels",
      avatar: "heritage-jewels",
      isShop: true,
      isOnline: false,
    },
    lastMessage: {
      text: "Can you please confirm the ring size?",
      timestamp: "2024-02-12T15:45:00Z",
      isFromMe: false,
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: "conv_3",
    participant: {
      name: "Ahmed K.",
      avatar: "ahmed-k",
      level: 7,
      isOnline: true,
    },
    lastMessage: {
      text: "Thank you for the smooth deal! Hope you enjoy it 😊",
      timestamp: "2024-02-11T09:20:00Z",
      isFromMe: true,
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: "conv_4",
    participant: {
      name: "Calligraphy Dreams",
      avatar: "calligraphy-dreams",
      isShop: true,
      isOnline: false,
    },
    lastMessage: {
      text: "The custom piece will be ready in 3 days",
      timestamp: "2024-02-10T16:00:00Z",
      isFromMe: false,
      isRead: true,
    },
    unreadCount: 0,
  },
];

const MESSAGES = [
  {
    id: "msg_1",
    text: "Hi! I'm interested in the Arabian Oud Perfume. Is it still available? When can we arrange a meetup?",
    timestamp: "2024-02-13T09:00:00Z",
    isFromMe: true,
    status: "read",
  },
  {
    id: "msg_2",
    text: "Hello! Yes, it's still available. I can meet you this weekend — would Abu Dhabi Mall work?",
    timestamp: "2024-02-13T09:15:00Z",
    isFromMe: false,
  },
  {
    id: "msg_3",
    text: "That's great! Do you offer gift wrapping?",
    timestamp: "2024-02-13T09:20:00Z",
    isFromMe: true,
    status: "read",
  },
  {
    id: "msg_4",
    text: "Yes, we do! I can include gift wrapping when we meet. It's complimentary for items over AED 300.",
    timestamp: "2024-02-13T09:25:00Z",
    isFromMe: false,
  },
  {
    id: "msg_5",
    text: "Yes please! That would be perfect.",
    timestamp: "2024-02-13T09:30:00Z",
    isFromMe: true,
    status: "read",
  },
  {
    id: "msg_6",
    text: "Done! I'll have it gift-wrapped and ready for our meetup. 🎁",
    timestamp: "2024-02-13T10:00:00Z",
    isFromMe: false,
  },
  {
    id: "msg_7",
    text: "Yes, it's still available! When would you like to meet?",
    timestamp: "2024-02-13T10:30:00Z",
    isFromMe: false,
  },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = React.useState(CONVERSATIONS[0]);
  const [messageInput, setMessageInput] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredConversations = CONVERSATIONS.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          Messages
        </h1>
        <p className="text-muted-foreground">
          Chat with sellers and manage your conversations
        </p>
      </div>

      <Card className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-e flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "w-full flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors text-start",
                  selectedConversation.id === conv.id && "bg-muted"
                )}
              >
                <div className="relative">
                  <DiceBearAvatar seed={conv.participant.avatar} size="md" />
                  {conv.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{conv.participant.name}</span>
                    {conv.participant.isShop && (
                      <Store className="w-3.5 h-3.5 text-moulna-gold" />
                    )}
                    {'level' in conv.participant && conv.participant.level && (
                      <LevelBadge level={conv.participant.level} size="xs" />
                    )}
                  </div>
                  <p className={cn(
                    "text-sm truncate",
                    conv.lastMessage.isRead ? "text-muted-foreground" : "text-foreground font-medium"
                  )}>
                    {conv.lastMessage.isFromMe && "You: "}
                    {conv.lastMessage.text}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(conv.lastMessage.timestamp)}
                  </span>
                  {conv.unreadCount > 0 && (
                    <Badge className="bg-moulna-gold text-white text-xs h-5 min-w-[20px] flex items-center justify-center">
                      {conv.unreadCount}
                    </Badge>
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
                <DiceBearAvatar seed={selectedConversation.participant.avatar} size="md" />
                {selectedConversation.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{selectedConversation.participant.name}</span>
                  {selectedConversation.participant.isShop && (
                    <Badge variant="outline" className="text-xs">
                      <Store className="w-3 h-3 me-1" />
                      Shop
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedConversation.participant.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {MESSAGES.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex",
                  message.isFromMe ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2",
                  message.isFromMe
                    ? "bg-moulna-gold text-white rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                )}>
                  <p className="text-sm">{message.text}</p>
                  <div className={cn(
                    "flex items-center justify-end gap-1 mt-1",
                    message.isFromMe ? "text-white/70" : "text-muted-foreground"
                  )}>
                    <span className="text-xs">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {message.isFromMe && (
                      message.status === "read" ? (
                        <CheckCheck className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageInput.trim()) {
                    // Send message
                    setMessageInput("");
                  }
                }}
              />
              <Button
                variant="gold"
                size="icon"
                disabled={!messageInput.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
