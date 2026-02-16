"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell, Package, Star, Sparkles, Trophy, Heart,
  MessageCircle, TrendingDown, CheckCheck, Trash2, Settings
} from "lucide-react";

type NotificationType = "listing" | "xp" | "badge" | "review" | "price_drop" | "message" | "streak" | "system";

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

const NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    type: "listing",
    title: "Seller Replied!",
    message: "Scent of Arabia responded to your inquiry about the Arabian Oud Perfume.",
    read: false,
    createdAt: "2024-02-13T10:30:00Z",
    link: "/dashboard/messages/conv_1",
  },
  {
    id: "notif_2",
    type: "xp",
    title: "XP Earned!",
    message: "You earned 50 XP for leaving a review on Arabian Oud Perfume.",
    read: false,
    createdAt: "2024-02-13T09:15:00Z",
    xpAmount: 50,
  },
  {
    id: "notif_3",
    type: "badge",
    title: "New Badge Unlocked!",
    message: "Congratulations! You've earned the 'Photo Reviewer' badge.",
    read: false,
    createdAt: "2024-02-12T16:45:00Z",
    badgeName: "Photo Reviewer",
  },
  {
    id: "notif_4",
    type: "price_drop",
    title: "Price Drop Alert!",
    message: "Gold-Plated Pearl Earrings from your wishlist is now 20% off!",
    read: true,
    createdAt: "2024-02-12T14:00:00Z",
    link: "/products/gold-plated-pearl-earrings",
    productImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100",
  },
  {
    id: "notif_5",
    type: "streak",
    title: "Streak Warning!",
    message: "Your 7-day login streak is at risk! Log in tomorrow to keep it going.",
    read: true,
    createdAt: "2024-02-11T20:00:00Z",
  },
  {
    id: "notif_6",
    type: "message",
    title: "New Message",
    message: "Scent of Arabia replied to your inquiry.",
    read: true,
    createdAt: "2024-02-11T11:30:00Z",
    link: "/dashboard/messages/conv_1",
  },
  {
    id: "notif_7",
    type: "review",
    title: "Your Review Was Helpful",
    message: "5 people found your review on Traditional Arabic Calligraphy Art helpful!",
    read: true,
    createdAt: "2024-02-10T15:20:00Z",
    xpAmount: 15,
  },
  {
    id: "notif_8",
    type: "listing",
    title: "Listing Saved",
    message: "Traditional Arabic Calligraphy Art was added to your saved items.",
    read: true,
    createdAt: "2024-02-08T12:00:00Z",
    link: "/dashboard/wishlist",
  },
  {
    id: "notif_9",
    type: "system",
    title: "Welcome to Moulna!",
    message: "Your account has been created successfully. You've earned 100 XP!",
    read: true,
    createdAt: "2024-01-15T08:00:00Z",
    xpAmount: 100,
  },
];

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  listing: <Package className="w-5 h-5 text-blue-500" />,
  xp: <Sparkles className="w-5 h-5 text-moulna-gold" />,
  badge: <Trophy className="w-5 h-5 text-yellow-500" />,
  review: <Star className="w-5 h-5 text-yellow-500" />,
  price_drop: <TrendingDown className="w-5 h-5 text-emerald-500" />,
  message: <MessageCircle className="w-5 h-5 text-purple-500" />,
  streak: <Heart className="w-5 h-5 text-red-500" />,
  system: <Bell className="w-5 h-5 text-muted-foreground" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter(n => !n.read);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

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
                      "p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-moulna-gold/5"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      !notification.read ? "bg-moulna-gold/10" : "bg-muted"
                    )}>
                      {notificationIcons[notification.type]}
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
              ? "You've read all your notifications. Great job staying on top of things!"
              : "When you get notifications, they'll appear here."
            }
          </p>
        </Card>
      )}
    </div>
  );
}
