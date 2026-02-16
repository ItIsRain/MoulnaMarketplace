"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Bell, Package, Star, Gift, MessageSquare, Heart,
  AlertCircle, CheckCircle, Settings, Trash2, Eye
} from "lucide-react";

const NOTIFICATIONS = [
  {
    id: "1",
    type: "listing",
    title: "New inquiry on your listing!",
    message: "Someone is interested in your Arabian Oud Perfume listing.",
    time: "5 minutes ago",
    read: false,
    icon: Eye,
    color: "text-blue-600",
    bg: "bg-blue-100",
    link: "/seller/orders",
  },
  {
    id: "2",
    type: "reward",
    title: "You earned 100 XP!",
    message: "Congratulations! You've completed the 'First Review' challenge.",
    time: "1 hour ago",
    read: false,
    icon: Gift,
    color: "text-moulna-gold",
    bg: "bg-moulna-gold/10",
    link: "/dashboard/rewards",
  },
  {
    id: "3",
    type: "message",
    title: "New message from Arabian Scents",
    message: "Thanks for reaching out! The item is still available...",
    time: "2 hours ago",
    read: false,
    icon: MessageSquare,
    color: "text-green-600",
    bg: "bg-green-100",
    link: "/dashboard/messages/conv-1",
  },
  {
    id: "4",
    type: "review",
    title: "Someone liked your review",
    message: "Your review on 'Premium Oud Set' received 5 helpful votes.",
    time: "5 hours ago",
    read: true,
    icon: Star,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    link: "/dashboard/reviews",
  },
  {
    id: "5",
    type: "wishlist",
    title: "Price drop on wishlist item!",
    message: "Arabian Nights Perfume is now 20% off.",
    time: "1 day ago",
    read: true,
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-100",
    link: "/products/2",
  },
  {
    id: "6",
    type: "listing",
    title: "Listing Renewed",
    message: "Your listing 'Premium Oud Set' has been automatically renewed.",
    time: "2 days ago",
    read: true,
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
    link: "/seller/products",
  },
  {
    id: "7",
    type: "system",
    title: "Complete your profile",
    message: "Add a profile picture to earn 50 XP bonus.",
    time: "3 days ago",
    read: true,
    icon: AlertCircle,
    color: "text-orange-600",
    bg: "bg-orange-100",
    link: "/dashboard/profile",
  },
];

const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "listings", label: "Listings" },
  { id: "rewards", label: "Rewards" },
  { id: "messages", label: "Messages" },
];

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !n.read;
    return n.type === selectedFilter.slice(0, -1); // Remove 's' from 'listings' etc.
  });

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-moulna-gold" />
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/settings/notifications">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.id}
              variant={selectedFilter === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(option.id)}
              className={cn(
                selectedFilter === option.id &&
                  "bg-moulna-gold hover:bg-moulna-gold-dark"
              )}
            >
              {option.label}
              {option.id === "unread" && unreadCount > 0 && (
                <Badge className="ms-2 bg-red-500 text-white">{unreadCount}</Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <Card className="divide-y">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                {selectedFilter === "unread"
                  ? "You've read all your notifications!"
                  : "No notifications in this category."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={notification.link}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-moulna-gold/5"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      notification.bg
                    )}
                  >
                    <notification.icon className={cn("w-5 h-5", notification.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={cn(
                          "font-medium",
                          !notification.read && "font-semibold"
                        )}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-moulna-gold" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteNotification(notification.id);
                    }}
                    className="p-2 hover:bg-muted rounded-lg opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </Link>
              </motion.div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
