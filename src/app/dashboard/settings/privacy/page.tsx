"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Eye, EyeOff, Shield, Users, Activity, Download,
  Trash2, Lock, Globe, UserX, Save, AlertTriangle
} from "lucide-react";

const PRIVACY_SETTINGS = [
  {
    category: "Profile Visibility",
    icon: Eye,
    settings: [
      {
        id: "profile_public",
        label: "Public Profile",
        description: "Allow anyone to view your profile and activity",
        enabled: true,
      },
      {
        id: "show_level",
        label: "Show Level & XP",
        description: "Display your gamification progress publicly",
        enabled: true,
      },
      {
        id: "show_badges",
        label: "Show Badges",
        description: "Display earned badges on your profile",
        enabled: true,
      },
      {
        id: "show_wishlist",
        label: "Public Wishlist",
        description: "Allow others to see your wishlist",
        enabled: false,
      },
      {
        id: "show_reviews",
        label: "Show Reviews",
        description: "Display your reviews on your profile",
        enabled: true,
      },
    ],
  },
  {
    category: "Social & Interactions",
    icon: Users,
    settings: [
      {
        id: "allow_messages",
        label: "Allow Messages",
        description: "Let other users send you direct messages",
        enabled: true,
      },
      {
        id: "allow_follows",
        label: "Allow Followers",
        description: "Let others follow your profile",
        enabled: true,
      },
      {
        id: "show_followers",
        label: "Show Follower Count",
        description: "Display your follower count publicly",
        enabled: true,
      },
      {
        id: "leaderboard_visible",
        label: "Appear on Leaderboards",
        description: "Show your ranking in public leaderboards",
        enabled: true,
      },
    ],
  },
  {
    category: "Activity & Data",
    icon: Activity,
    settings: [
      {
        id: "activity_status",
        label: "Show Activity Status",
        description: "Let others see when you're online",
        enabled: false,
      },
      {
        id: "purchase_history",
        label: "Private Purchase History",
        description: "Keep your purchase history private",
        enabled: true,
      },
      {
        id: "search_history",
        label: "Save Search History",
        description: "Save your searches for better recommendations",
        enabled: true,
      },
      {
        id: "personalized_ads",
        label: "Personalized Recommendations",
        description: "Use your activity for personalized product suggestions",
        enabled: true,
      },
    ],
  },
];

const BLOCKED_USERS = [
  { id: "1", name: "John Doe", blockedAt: "2 weeks ago" },
  { id: "2", name: "Jane Smith", blockedAt: "1 month ago" },
];

export default function PrivacySettingsPage() {
  const [settings, setSettings] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    PRIVACY_SETTINGS.forEach(category => {
      category.settings.forEach(setting => {
        initial[setting.id] = setting.enabled;
      });
    });
    return initial;
  });

  const [isSaving, setIsSaving] = React.useState(false);

  const handleToggle = (id: string) => {
    setSettings(prev => ({
      ...prev,
      [id]: !prev[id],
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
            <Shield className="w-7 h-7 text-moulna-gold" />
            Privacy Settings
          </h1>
          <p className="text-muted-foreground">
            Control who can see your information and activity
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

      {/* Privacy Settings Groups */}
      {PRIVACY_SETTINGS.map((category, categoryIndex) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <category.icon className="w-5 h-5 text-moulna-gold" />
              <h2 className="font-semibold">{category.category}</h2>
            </div>
            <div className="space-y-4">
              {category.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    checked={settings[setting.id]}
                    onCheckedChange={() => handleToggle(setting.id)}
                  />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Blocked Users */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserX className="w-5 h-5 text-moulna-gold" />
          <h2 className="font-semibold">Blocked Users</h2>
        </div>
        {BLOCKED_USERS.length > 0 ? (
          <div className="space-y-3">
            {BLOCKED_USERS.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Blocked {user.blockedAt}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Unblock
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven't blocked any users.</p>
        )}
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-moulna-gold" />
          <h2 className="font-semibold">Data Management</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Download Your Data</p>
              <p className="text-sm text-muted-foreground">
                Get a copy of all data associated with your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 me-1" />
              Request Download
            </Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Clear Search History</p>
              <p className="text-sm text-muted-foreground">
                Delete all your saved searches
              </p>
            </div>
            <Button variant="outline" size="sm">
              Clear
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Clear Browsing Data</p>
              <p className="text-sm text-muted-foreground">
                Delete your recently viewed products
              </p>
            </div>
            <Button variant="outline" size="sm">
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Cookie Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-moulna-gold" />
          <h2 className="font-semibold">Cookie Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Essential Cookies</p>
              <p className="text-sm text-muted-foreground">
                Required for the website to function properly
              </p>
            </div>
            <Badge variant="secondary">Always On</Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Analytics Cookies</p>
              <p className="text-sm text-muted-foreground">
                Help us improve our website
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Marketing Cookies</p>
              <p className="text-sm text-muted-foreground">
                Used for personalized advertising
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="font-semibold text-red-600">Privacy Actions</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Make Profile Private</p>
              <p className="text-sm text-muted-foreground">
                Hide all your information from public view
              </p>
            </div>
            <Button variant="outline" size="sm">
              <EyeOff className="w-4 h-4 me-1" />
              Go Private
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-red-600">Delete All Data</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete all your activity data
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
              <Trash2 className="w-4 h-4 me-1" />
              Delete Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
