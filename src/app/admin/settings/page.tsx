"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Settings, Globe, Bell, Shield, Percent,
  Store, Save, RefreshCw, Loader2, CheckCircle
} from "lucide-react";

// DB key → display config. "fils" keys are stored in fils, displayed as AED.
const LISTING_SETTING_FIELDS = [
  { dbKey: "free_listing_limit", label: "Free Listing Limit", type: "number", isFils: false },
  { dbKey: "listing_fee_fils", label: "Listing Fee (AED)", type: "number", isFils: true },
  { dbKey: "boost_price_per_day_fils", label: "Boost Price per Day (AED)", type: "number", isFils: true },
  { dbKey: "sotw_price_per_week_fils", label: "SOTW Price per Week (AED)", type: "number", isFils: true },
  { dbKey: "listing_boost_bundle_discount_pct", label: "Bundle Discount % (Listing + Boost)", type: "number", isFils: false },
  { dbKey: "listing_full_bundle_discount_pct", label: "Full Bundle Discount % (Listing + Boost + SOTW)", type: "number", isFils: false },
];

const AUCTION_SETTING_FIELDS = [
  { dbKey: "sotw_auction_min_bid_fils", label: "Min Bid (AED)", type: "number", isFils: true },
  { dbKey: "sotw_auction_bid_increment_fils", label: "Bid Increment (AED)", type: "number", isFils: true },
  { dbKey: "sotw_auction_buy_now_fils", label: "Buy Now Price (AED)", type: "number", isFils: true },
  { dbKey: "sotw_auction_close_hours_before", label: "Close Hours Before Week Start", type: "number", isFils: false },
  { dbKey: "sotw_auction_rate_limit_seconds", label: "Rate Limit Between Bids (seconds)", type: "number", isFils: false },
];

const GENERAL_SETTINGS = [
  { dbKey: "site_name", label: "Site Name", type: "text" },
  { dbKey: "site_url", label: "Site URL", type: "text" },
  { dbKey: "support_email", label: "Support Email", type: "email" },
  { dbKey: "default_currency", label: "Default Currency", type: "text" },
];

const NOTIFICATION_TOGGLES = [
  { dbKey: "email_new_listing", label: "Email on new listing" },
  { dbKey: "email_new_seller", label: "Email on new seller application" },
  { dbKey: "email_report", label: "Email on new report" },
  { dbKey: "daily_digest", label: "Daily activity digest" },
];

const SECURITY_TOGGLES = [
  { dbKey: "two_factor_admin", label: "Require 2FA for admins" },
  { dbKey: "two_factor_seller", label: "Require 2FA for sellers" },
  { dbKey: "ip_whitelist", label: "Enable IP whitelist" },
  { dbKey: "auto_logout", label: "Auto logout after 30 min inactivity" },
];

const MARKETPLACE_TOGGLES = [
  { dbKey: "allow_new_sellers", label: "Allow new seller registrations" },
  { dbKey: "require_approval", label: "Require product approval" },
  { dbKey: "allow_guest_browsing", label: "Allow guest browsing" },
  { dbKey: "enable_reviews", label: "Enable seller reviews" },
];

export default function AdminSettingsPage() {
  const [dbSettings, setDbSettings] = React.useState<Record<string, string>>({});
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchSettings = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.settings) {
        setDbSettings(data.settings);
        // Convert fils to AED for display
        const display: Record<string, string> = { ...data.settings };
        const allFilsFields = [...LISTING_SETTING_FIELDS, ...AUCTION_SETTING_FIELDS];
        for (const f of allFilsFields) {
          if (f.isFils && display[f.dbKey]) {
            display[f.dbKey] = (Number(display[f.dbKey]) / 100).toString();
          }
        }
        setFormValues(display);
      }
    } catch {
      setToast({ type: "error", message: "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: string, checked: boolean) => {
    setFormValues((prev) => ({ ...prev, [key]: checked ? "true" : "false" }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert AED display back to fils for storage
      const toSave: { key: string; value: string }[] = [];
      for (const [key, value] of Object.entries(formValues)) {
        const allFilsFields = [...LISTING_SETTING_FIELDS, ...AUCTION_SETTING_FIELDS];
      const filsField = allFilsFields.find((f) => f.dbKey === key && f.isFils);
        if (filsField) {
          toSave.push({ key, value: Math.round(Number(value) * 100).toString() });
        } else {
          toSave.push({ key, value });
        }
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: toSave }),
      });

      if (res.ok) {
        setToast({ type: "success", message: "Settings saved successfully" });
        fetchSettings();
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Failed to save" });
      }
    } catch {
      setToast({ type: "error", message: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchSettings();
    setToast({ type: "success", message: "Settings reset to saved values" });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const sections = [
    {
      id: "general",
      title: "General Settings",
      icon: Globe,
      fields: GENERAL_SETTINGS,
    },
    {
      id: "listing",
      title: "Listing Fee Settings",
      icon: Percent,
      fields: LISTING_SETTING_FIELDS,
    },
    {
      id: "auction",
      title: "SOTW Auction Settings",
      icon: Store,
      fields: AUCTION_SETTING_FIELDS,
    },
    {
      id: "notifications",
      title: "Notification Settings",
      icon: Bell,
      toggles: NOTIFICATION_TOGGLES,
    },
    {
      id: "security",
      title: "Security Settings",
      icon: Shield,
      toggles: SECURITY_TOGGLES,
    },
    {
      id: "marketplace",
      title: "Marketplace Settings",
      icon: Store,
      toggles: MARKETPLACE_TOGGLES,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.type === "success" && <CheckCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

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
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            <RefreshCw className="w-4 h-4 me-2" />
            Reset
          </Button>
          <Button
            className="bg-moulna-gold hover:bg-moulna-gold-dark"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {sections.map((section, sectionIndex) => (
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

              {section.fields && (
                <div className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.dbKey}>
                      <label className="text-sm font-medium mb-1 block">
                        {field.label}
                      </label>
                      <Input
                        type={field.type}
                        value={formValues[field.dbKey] || ""}
                        onChange={(e) => handleChange(field.dbKey, e.target.value)}
                        className="max-w-md"
                        step={field.type === "number" ? "any" : undefined}
                      />
                    </div>
                  ))}
                </div>
              )}

              {section.toggles && (
                <div className="space-y-4">
                  {section.toggles.map((toggle) => (
                    <div
                      key={toggle.dbKey}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm">{toggle.label}</span>
                      <Switch
                        checked={formValues[toggle.dbKey] === "true"}
                        onCheckedChange={(checked) => handleToggle(toggle.dbKey, checked)}
                      />
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
