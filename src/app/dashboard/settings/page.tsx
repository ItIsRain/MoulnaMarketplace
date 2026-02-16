"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Settings, Bell, Lock, Globe, Moon, Sun, Monitor,
  Mail, Smartphone, Shield, Trash2, Download, ChevronRight
} from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system");
  const [language, setLanguage] = React.useState("en");

  const [notifications, setNotifications] = React.useState({
    orderUpdates: true,
    xpEarned: true,
    badgeUnlocked: true,
    priceDrops: true,
    newProducts: false,
    newsletter: true,
    smsAlerts: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <Settings className="w-6 h-6" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="grid gap-8">
        {/* Appearance */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <div className="flex gap-3">
                {[
                  { id: "light", icon: Sun, label: "Light" },
                  { id: "dark", icon: Moon, label: "Dark" },
                  { id: "system", icon: Monitor, label: "System" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id as typeof theme)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all",
                      theme === option.id
                        ? "border-moulna-gold bg-moulna-gold/10"
                        : "border-muted hover:border-moulna-gold/50"
                    )}
                  >
                    <option.icon className="w-4 h-4" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full max-w-xs h-10 px-3 rounded-lg border bg-background"
              >
                <option value="en">English</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Inquiry Updates</p>
                <p className="text-xs text-muted-foreground">Get notified about your inquiry status</p>
              </div>
              <button
                onClick={() => toggleNotification("orderUpdates")}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors",
                  notifications.orderUpdates ? "bg-moulna-gold" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow transition-transform",
                  notifications.orderUpdates ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">XP Earned</p>
                <p className="text-xs text-muted-foreground">Notifications when you earn XP</p>
              </div>
              <button
                onClick={() => toggleNotification("xpEarned")}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors",
                  notifications.xpEarned ? "bg-moulna-gold" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow transition-transform",
                  notifications.xpEarned ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Badge Unlocked</p>
                <p className="text-xs text-muted-foreground">Celebrate when you unlock badges</p>
              </div>
              <button
                onClick={() => toggleNotification("badgeUnlocked")}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors",
                  notifications.badgeUnlocked ? "bg-moulna-gold" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow transition-transform",
                  notifications.badgeUnlocked ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Price Drop Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when wishlist items go on sale</p>
              </div>
              <button
                onClick={() => toggleNotification("priceDrops")}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors",
                  notifications.priceDrops ? "bg-moulna-gold" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow transition-transform",
                  notifications.priceDrops ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Newsletter</p>
                <p className="text-xs text-muted-foreground">Weekly digest of new products and deals</p>
              </div>
              <button
                onClick={() => toggleNotification("newsletter")}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors",
                  notifications.newsletter ? "bg-moulna-gold" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow transition-transform",
                  notifications.newsletter ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">SMS Alerts</p>
                <p className="text-xs text-muted-foreground">Critical updates via text message</p>
              </div>
              <button
                onClick={() => toggleNotification("smsAlerts")}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors",
                  notifications.smsAlerts ? "bg-moulna-gold" : "bg-muted"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow transition-transform",
                  notifications.smsAlerts ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div className="text-start">
                  <p className="font-medium text-sm">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your password regularly</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div className="text-start">
                  <p className="font-medium text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div className="text-start">
                  <p className="font-medium text-sm">Login History</p>
                  <p className="text-xs text-muted-foreground">View recent login activity</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </Card>

        {/* Data & Privacy */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data & Privacy
          </h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <div className="text-start">
                  <p className="font-medium text-sm">Download My Data</p>
                  <p className="text-xs text-muted-foreground">Get a copy of your account data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30 transition-colors">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div className="text-start">
                  <p className="font-medium text-sm text-red-600 dark:text-red-400">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
