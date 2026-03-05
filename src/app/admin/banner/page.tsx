"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon, Save, Loader2, CheckCircle, Eye, Type,
  Link2, Sparkles, Palette, FileText, RotateCcw,
} from "lucide-react";
import { getCurrentCampaign } from "@/lib/campaigns";

interface BannerForm {
  enabled: boolean;
  title: string;
  badge: string;
  description: string;
  link: string;
  image: string;
  gradient: string;
}

function getDefaultBanner(): BannerForm {
  const campaign = getCurrentCampaign();
  return {
    enabled: false,
    title: campaign.title,
    badge: campaign.badge,
    description: campaign.description,
    link: `/explore/${campaign.slug}`,
    image: campaign.image,
    gradient: campaign.gradient,
  };
}

const GRADIENT_PRESETS = [
  { label: "Purple", value: "from-purple-900/80 via-indigo-900/60 to-transparent" },
  { label: "Emerald", value: "from-emerald-900/80 via-teal-900/60 to-transparent" },
  { label: "Orange", value: "from-orange-900/80 via-amber-900/60 to-transparent" },
  { label: "Blue", value: "from-blue-900/80 via-sky-900/60 to-transparent" },
  { label: "Red", value: "from-red-900/80 via-rose-900/60 to-transparent" },
  { label: "Violet", value: "from-violet-900/80 via-purple-900/60 to-transparent" },
  { label: "Cyan", value: "from-cyan-900/80 via-blue-900/60 to-transparent" },
  { label: "Neutral", value: "from-neutral-900/80 via-neutral-800/60 to-transparent" },
  { label: "Gold", value: "from-yellow-900/80 via-amber-900/60 to-transparent" },
];

export default function AdminBannerPage() {
  const [form, setForm] = React.useState<BannerForm>(getDefaultBanner);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchBanner = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.settings?.hero_banner) {
        const parsed =
          typeof data.settings.hero_banner === "string"
            ? JSON.parse(data.settings.hero_banner)
            : data.settings.hero_banner;
        setForm({ ...getDefaultBanner(), ...parsed });
      }
    } catch {
      setToast({ type: "error", message: "Failed to load banner settings" });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [
            { key: "hero_banner", value: JSON.stringify(form) },
          ],
        }),
      });

      if (res.ok) {
        setToast({ type: "success", message: "Banner saved successfully" });
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Failed to save" });
      }
    } catch {
      setToast({ type: "error", message: "Failed to save banner" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
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
          <h1 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-moulna-gold" />
            Hero Banner
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customize the seasonal campaign banner on the homepage
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchBanner} disabled={saving}>
            <RotateCcw className="w-4 h-4 me-2" />
            Reset
          </Button>
          <Button
            size="sm"
            className="bg-moulna-gold hover:bg-moulna-gold-dark"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-5">
          {/* Enable Toggle */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border/60 shadow-sm">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Override Seasonal Banner</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    When enabled, this replaces the automatic date-based campaign banner
                  </p>
                </div>
                <Switch
                  checked={form.enabled}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, enabled: checked }))}
                />
              </div>
            </Card>
          </motion.div>

          {/* Content Fields */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/60 shadow-sm">
              <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
                  <Type className="w-4 h-4 text-moulna-gold" />
                </div>
                <h2 className="text-sm font-semibold">Content</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[13px] font-medium mb-1.5 block text-muted-foreground">
                    Title
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Ramadan Kareem"
                    className="max-w-md"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium mb-1.5 block text-muted-foreground">
                    Badge Text
                  </label>
                  <Input
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    placeholder="e.g. Ramadan Special"
                    className="max-w-md"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium mb-1.5 block text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the campaign..."
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium mb-1.5 block text-muted-foreground flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    Link URL
                  </label>
                  <Input
                    value={form.link}
                    onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                    placeholder="e.g. /explore/ramadan-sale"
                    className="max-w-md"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Image */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/60 shadow-sm">
              <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-moulna-gold" />
                </div>
                <h2 className="text-sm font-semibold">Image</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[13px] font-medium mb-1.5 block text-muted-foreground">
                    Image URL
                  </label>
                  <Input
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Recommended: 1200x420px landscape image
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Gradient */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/60 shadow-sm">
              <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-moulna-gold" />
                </div>
                <h2 className="text-sm font-semibold">Overlay Gradient</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setForm((f) => ({ ...f, gradient: preset.value }))}
                      className={`relative h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        form.gradient === preset.value
                          ? "border-moulna-gold ring-2 ring-moulna-gold/30"
                          : "border-border hover:border-moulna-gold/50"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${preset.value}`} />
                      <div className="absolute inset-0 bg-black/30" />
                      <span className="relative text-[11px] font-medium text-white drop-shadow">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Live Preview */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-border/60 shadow-sm sticky top-24">
              <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-moulna-gold" />
                </div>
                <h2 className="text-sm font-semibold">Live Preview</h2>
                {!form.enabled && (
                  <Badge variant="outline" className="ms-auto text-xs text-muted-foreground">
                    Disabled
                  </Badge>
                )}
              </div>
              <div className="p-5">
                <div className={`relative rounded-xl overflow-hidden ${!form.enabled ? "opacity-50" : ""}`}>
                  <div className="relative h-[220px]">
                    {form.image ? (
                      <Image
                        src={form.image}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                        <FileText className="w-8 h-8 opacity-30" />
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-r ${form.gradient}`} />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-center px-6">
                    {form.badge && (
                      <Badge variant="gold" className="w-fit mb-3 text-xs px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {form.badge}
                      </Badge>
                    )}
                    {form.title && (
                      <h2 className="text-xl md:text-2xl font-display font-bold text-gold-gradient mb-2 max-w-sm drop-shadow-lg">
                        {form.title}
                      </h2>
                    )}
                    {form.description && (
                      <p className="text-white/80 text-xs max-w-sm leading-relaxed line-clamp-3">
                        {form.description}
                      </p>
                    )}
                  </div>
                </div>

                {form.link && (
                  <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Links to: <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">{form.link}</code>
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
