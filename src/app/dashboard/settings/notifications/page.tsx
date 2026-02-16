"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Bell, Mail, Smartphone, MessageSquare,
  Gift, Star, Users, TrendingUp, Save, Volume2
} from "lucide-react";

const NOTIFICATION_GROUPS = [
  {
    title: "Inquiries & Conversations",
    icon: MessageSquare,
    settings: [
      { id: "inquiry_reply", label: "Seller replies", description: "When a seller responds to your inquiry", email: true, push: true },
      { id: "inquiry_update", label: "Listing updates", description: "When a listing you inquired about is updated", email: true, push: true },
      { id: "review_reminder", label: "Review reminders", description: "Reminder to review sellers you contacted", email: true, push: false },
    ],
  },
  {
    title: "Messages & Social",
    icon: MessageSquare,
    settings: [
      { id: "new_message", label: "New messages", description: "When someone sends you a message", email: true, push: true },
      { id: "new_follower", label: "New followers", description: "When someone follows your profile", email: false, push: true },
      { id: "mentions", label: "Mentions", description: "When someone mentions you in a review", email: true, push: true },
    ],
  },
  {
    title: "Rewards & Gamification",
    icon: Gift,
    settings: [
      { id: "xp_earned", label: "XP earned", description: "When you earn XP from activities", email: false, push: true },
      { id: "level_up", label: "Level up", description: "When you reach a new level", email: true, push: true },
      { id: "badge_earned", label: "Badge unlocked", description: "When you earn a new badge", email: true, push: true },
      { id: "challenge_reminder", label: "Challenge reminders", description: "Daily challenge notifications", email: false, push: true },
      { id: "streak_warning", label: "Streak warning", description: "When your streak is about to expire", email: true, push: true },
    ],
  },
  {
    title: "Deals & Promotions",
    icon: TrendingUp,
    settings: [
      { id: "price_drop", label: "Price drops", description: "When saved items get a price reduction", email: true, push: true },
      { id: "new_listings", label: "New listings", description: "New listings in categories you follow", email: true, push: false },
      { id: "personalized_deals", label: "Personalized deals", description: "Deals based on your interests", email: true, push: false },
    ],
  },
  {
    title: "Sellers You Follow",
    icon: Users,
    settings: [
      { id: "new_product", label: "New listings", description: "When followed shops add new listings", email: false, push: true },
      { id: "shop_updates", label: "Shop updates", description: "News and updates from your favorite shops", email: true, push: false },
    ],
  },
];

export default function NotificationSettingsPage() {
  const [settings, setSettings] = React.useState<Record<string, { email: boolean; push: boolean }>>(() => {
    const initial: Record<string, { email: boolean; push: boolean }> = {};
    NOTIFICATION_GROUPS.forEach(group => {
      group.settings.forEach(setting => {
        initial[setting.id] = { email: setting.email, push: setting.push };
      });
    });
    return initial;
  });

  const [isSaving, setIsSaving] = React.useState(false);

  const handleToggle = (id: string, type: "email" | "push") => {
    setSettings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: !prev[id][type],
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="w-7 h-7 text-moulna-gold" />
              Notification Settings
            </h1>
            <p className="text-muted-foreground">
              Choose what notifications you want to receive
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-moulna-gold hover:bg-moulna-gold-dark"
          >
            <Save className="w-4 h-4 me-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Quick Actions */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Enable All
            </Button>
            <Button variant="outline" size="sm">
              Disable All
            </Button>
            <Button variant="outline" size="sm">
              Email Only
            </Button>
            <Button variant="outline" size="sm">
              Push Only
            </Button>
          </div>
        </Card>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>Push Notification</span>
          </div>
        </div>

        {/* Notification Groups */}
        {NOTIFICATION_GROUPS.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <group.icon className="w-5 h-5 text-moulna-gold" />
                <h2 className="font-semibold">{group.title}</h2>
              </div>
              <div className="space-y-4">
                {group.settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <Switch
                          checked={settings[setting.id]?.email}
                          onCheckedChange={() => handleToggle(setting.id, "email")}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        <Switch
                          checked={settings[setting.id]?.push}
                          onCheckedChange={() => handleToggle(setting.id, "push")}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Sound Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Sound & Vibration</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notification sounds</p>
                <p className="text-sm text-muted-foreground">Play sound for push notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Vibration</p>
                <p className="text-sm text-muted-foreground">Vibrate for notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
    </div>
  );
}
