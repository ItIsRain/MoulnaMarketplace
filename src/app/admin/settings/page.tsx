"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Settings, Globe, Bell, Shield, CreditCard, Percent, Mail,
  Users, Store, Package, Palette, Save, RefreshCw
} from "lucide-react";

const SETTING_SECTIONS = [
  {
    id: "general",
    title: "General Settings",
    icon: Globe,
    settings: [
      { key: "siteName", label: "Site Name", type: "text", value: "Moulna Marketplace" },
      { key: "siteUrl", label: "Site URL", type: "text", value: "https://moulna.ae" },
      { key: "supportEmail", label: "Support Email", type: "email", value: "support@moulna.ae" },
      { key: "defaultCurrency", label: "Default Currency", type: "text", value: "AED" },
    ],
  },
  {
    id: "commission",
    title: "Commission Settings",
    icon: Percent,
    settings: [
      { key: "baseCommission", label: "Base Commission (%)", type: "number", value: "10" },
      { key: "artisanCommission", label: "Artisan Commission (%)", type: "number", value: "7" },
      { key: "newSellerCommission", label: "New Seller Commission (%)", type: "number", value: "12" },
    ],
  },
  {
    id: "notifications",
    title: "Notification Settings",
    icon: Bell,
    toggles: [
      { key: "emailNewOrder", label: "Email on new order", enabled: true },
      { key: "emailNewSeller", label: "Email on new seller application", enabled: true },
      { key: "emailReport", label: "Email on new report", enabled: true },
      { key: "dailyDigest", label: "Daily activity digest", enabled: false },
    ],
  },
  {
    id: "security",
    title: "Security Settings",
    icon: Shield,
    toggles: [
      { key: "twoFactorAdmin", label: "Require 2FA for admins", enabled: true },
      { key: "twoFactorSeller", label: "Require 2FA for sellers", enabled: false },
      { key: "ipWhitelist", label: "Enable IP whitelist", enabled: false },
      { key: "autoLogout", label: "Auto logout after 30 min inactivity", enabled: true },
    ],
  },
  {
    id: "marketplace",
    title: "Marketplace Settings",
    icon: Store,
    toggles: [
      { key: "allowNewSellers", label: "Allow new seller registrations", enabled: true },
      { key: "requireApproval", label: "Require product approval", enabled: true },
      { key: "allowGuestCheckout", label: "Allow guest checkout", enabled: false },
      { key: "enableReviews", label: "Enable product reviews", enabled: true },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<Record<string, string | boolean>>({});

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Platform Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Configure marketplace settings and preferences
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 me-2" />
            Reset
          </Button>
          <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
            <Save className="w-4 h-4 me-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {SETTING_SECTIONS.map((section, sectionIndex) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-moulna-gold" />
                </div>
                <h2 className="font-semibold">{section.title}</h2>
              </div>

              {section.settings && (
                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.key}>
                      <label className="text-sm font-medium mb-1 block">
                        {setting.label}
                      </label>
                      <Input
                        type={setting.type}
                        defaultValue={setting.value}
                        className="max-w-md"
                      />
                    </div>
                  ))}
                </div>
              )}

              {section.toggles && (
                <div className="space-y-4">
                  {section.toggles.map((toggle) => (
                    <div
                      key={toggle.key}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm">{toggle.label}</span>
                      <Switch defaultChecked={toggle.enabled} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50/30">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-red-600" />
          <h2 className="font-semibold text-red-600">Danger Zone</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
            Clear All Cache
          </Button>
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
            Reset Analytics
          </Button>
          <Button variant="destructive">
            Maintenance Mode
          </Button>
        </div>
      </Card>
    </div>
  );
}
