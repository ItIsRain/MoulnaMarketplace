"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell, Package, Star, Gift, MessageSquare, Heart,
  AlertCircle, CheckCircle, Settings, Trash2, Eye, Loader2
} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link: string | null;
  xpAmount: number | null;
  badgeName: string | null;
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  message: { icon: MessageSquare, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
  listing: { icon: Eye, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  xp: { icon: Star, color: "text-moulna-gold", bg: "bg-moulna-gold/10" },
  badge: { icon: Gift, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
  review: { icon: Star, color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  wishlist: { icon: Heart, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  sale: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  system: { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
};

const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "message", label: "Messages" },
  { id: "listing", label: "Listings" },
  { id: "badge", label: "Achievements" },
];

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.ok ? res.json() : { notifications: [], unreadCount: 0 })
      .then((data) => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !n.read;
    return n.type === selectedFilter;
  });

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch {}
  };

  const markAsRead = async (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif?.read) return;
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        const wasUnread = notifications.find((n) => n.id === id && !n.read);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-8">
        <div className="container mx-auto px-4 max-w-3xl flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
        </div>
      </div>
    );
  }

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
              <Link href="/dashboard/profile">
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
            filteredNotifications.map((notification, index) => {
              const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
              const Icon = config.icon;
              const content = (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div
                    className={cn(
                      "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors group",
                      !notification.read && "bg-moulna-gold/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        config.bg
                      )}
                    >
                      <Icon className={cn("w-5 h-5", config.color)} />
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
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-2 hover:bg-muted rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              );

              if (notification.link) {
                return (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div key={notification.id} onClick={() => markAsRead(notification.id)} className="cursor-pointer">
                  {content}
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
}
