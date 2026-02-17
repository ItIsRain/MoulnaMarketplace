"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell, Package, Star, Sparkles, Trophy, Heart,
  MessageCircle, TrendingDown, CheckCheck, Trash2, Settings, Loader2
} from "lucide-react";

type NotificationType = "listing" | "xp" | "badge" | "review" | "price_drop" | "message" | "streak" | "system" | "inquiry" | "level_up" | "promo";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  xpAmount?: number;
  badgeName?: string;
  productImage?: string;
}

const notificationIcons: Record<string, React.ReactNode> = {
  listing: <Package className="w-5 h-5 text-blue-500" />,
  xp: <Sparkles className="w-5 h-5 text-moulna-gold" />,
  badge: <Trophy className="w-5 h-5 text-yellow-500" />,
  review: <Star className="w-5 h-5 text-yellow-500" />,
  price_drop: <TrendingDown className="w-5 h-5 text-emerald-500" />,
  message: <MessageCircle className="w-5 h-5 text-purple-500" />,
  streak: <Heart className="w-5 h-5 text-red-500" />,
  system: <Bell className="w-5 h-5 text-muted-foreground" />,
  inquiry: <MessageCircle className="w-5 h-5 text-blue-500" />,
  level_up: <Trophy className="w-5 h-5 text-moulna-gold" />,
  promo: <Sparkles className="w-5 h-5 text-pink-500" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter(n => !n.read);

  async function markAllAsRead() {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch {
      // silently fail
    }
  }

  async function markAsRead(id: string) {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch {
      // silently fail
    }
  }

  async function deleteNotification(id: string) {
    const notif = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notif && !notif.read) setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
    } catch {
      // silently fail
    }
  }

  // Group notifications by date
  const groupedNotifications = React.useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    filteredNotifications.forEach(notif => {
      const date = new Date(notif.createdAt).toDateString();
      let label = date;
      if (date === today) label = "Today";
      else if (date === yesterday) label = "Yesterday";
      else label = new Date(notif.createdAt).toLocaleDateString('en-AE', {
        month: 'long',
        day: 'numeric',
      });

      if (!groups[label]) groups[label] = [];
      groups[label].push(notif);
    });

    return groups;
  }, [filteredNotifications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <Bell className="w-6 h-6" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : "You're all caught up!"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/settings">
              <Settings className="w-4 h-4 me-2" />
              Settings
            </a>
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 me-2" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "pb-3 text-sm font-medium transition-colors relative",
            filter === "all"
              ? "text-moulna-gold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          All
          {filter === "all" && (
            <motion.div
              layoutId="notifFilter"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-moulna-gold"
            />
          )}
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={cn(
            "pb-3 text-sm font-medium transition-colors relative flex items-center gap-2",
            filter === "unread"
              ? "text-moulna-gold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Unread
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-moulna-gold h-5 px-1.5">
              {unreadCount}
            </Badge>
          )}
          {filter === "unread" && (
            <motion.div
              layoutId="notifFilter"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-moulna-gold"
            />
          )}
        </button>
      </div>

      {/* Notifications List */}
      {Object.keys(groupedNotifications).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([date, notifs]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {date}
              </h3>
              <Card className="divide-y">
                {notifs.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors cursor-pointer",
                      !notification.read && "bg-moulna-gold/5"
                    )}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                      if (notification.link) window.location.href = notification.link;
                    }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      !notification.read ? "bg-moulna-gold/10" : "bg-muted"
                    )}>
                      {notificationIcons[notification.type] || notificationIcons.system}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn(
                            "font-medium",
                            !notification.read && "text-foreground"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                          {notification.xpAmount && (
                            <div className="flex items-center gap-1 text-sm text-moulna-gold mt-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>+{notification.xpAmount} XP</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(notification.createdAt)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-moulna-gold" />
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </h3>
          <p className="text-muted-foreground">
            {filter === "unread"
              ? "You've read all your notifications."
              : "When you get notifications, they'll appear here."
            }
          </p>
        </Card>
      )}
    </div>
  );
}
