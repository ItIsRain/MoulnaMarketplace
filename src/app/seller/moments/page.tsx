"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UpgradeBanner } from "@/components/subscription/UpgradeBanner";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Camera, Plus, Trash2, Loader2, Eye, Clock, Video,
  Upload, X, BarChart3, Users, MousePointerClick,
  TrendingUp, ArrowLeft, ArrowRight, ChevronRight, Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface Moment {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  thumbnailUrl?: string;
  caption?: string;
  viewCount: number;
  uniqueViewers: number;
  tapsForward: number;
  tapsBack: number;
  linkClicks: number;
  replies: number;
  engagement: number;
  retentionRate: number;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
}

interface Analytics {
  totalMoments: number;
  totalViews: number;
  totalUniqueViewers: number;
  totalTapsForward: number;
  totalTapsBack: number;
  totalLinkClicks: number;
  totalReplies: number;
  avgViewsPerMoment: number;
  completionRate: number;
  viewsByDay: { date: string; views: number }[];
}

interface Viewer {
  id: string;
  name: string;
  username?: string;
  avatarStyle: string;
  avatarSeed: string;
  level: number;
  viewedAt: string;
  watchDurationMs: number;
  completed: boolean;
}

const PLAN_LIMITS: Record<string, number> = { free: 3, growth: 10, pro: 999999 };

export default function SellerMomentsPage() {
  const { shop } = useAuthStore();
  const [moments, setMoments] = React.useState<Moment[]>([]);
  const [analytics, setAnalytics] = React.useState<Analytics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [caption, setCaption] = React.useState("");
  const [preview, setPreview] = React.useState<{ url: string; type: "image" | "video" } | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [selectedMoment, setSelectedMoment] = React.useState<string | null>(null);
  const [viewers, setViewers] = React.useState<Viewer[]>([]);
  const [viewersLoading, setViewersLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const plan = shop?.plan || "free";
  const maxMoments = PLAN_LIMITS[plan] ?? 3;
  const planLabel = plan === "free" ? "Starter" : plan.charAt(0).toUpperCase() + plan.slice(1);

  const fetchMoments = React.useCallback(async () => {
    try {
      const res = await fetch("/api/seller/moments");
      const data = await res.json();
      if (data.moments) setMoments(data.moments);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = React.useCallback(async () => {
    try {
      const res = await fetch("/api/seller/moments?section=analytics&days=30");
      const data = await res.json();
      if (data.analytics) setAnalytics(data.analytics);
    } catch {}
  }, []);

  React.useEffect(() => {
    fetchMoments();
    fetchAnalytics();
  }, [fetchMoments, fetchAnalytics]);

  const fetchViewers = async (momentId: string) => {
    setSelectedMoment(momentId);
    setViewersLoading(true);
    try {
      const res = await fetch(`/api/seller/moments?section=viewers&momentId=${momentId}`);
      const data = await res.json();
      setViewers(data.viewers || []);
    } finally {
      setViewersLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) return;
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview({ url: objectUrl, type: isVideo ? "video" : "image" });
  };

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setSelectedFile(null);
    setCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", "moments");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) { toast.error(uploadData.error || "Upload failed"); return; }

      const createRes = await fetch("/api/seller/moments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl: uploadData.url,
          mediaType: uploadData.mediaType || (selectedFile.type.startsWith("video/") ? "video" : "image"),
          thumbnailUrl: uploadData.thumbnail || null,
          caption: caption.trim() || null,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) { toast.error(createData.error || "Failed to create moment"); return; }
      clearPreview();
      fetchMoments();
      fetchAnalytics();
    } finally {
      setUploading(false);
    }
  };

  const deleteMoment = async (id: string) => {
    const res = await fetch(`/api/seller/moments?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMoments((prev) => prev.filter((m) => m.id !== id));
      if (selectedMoment === id) { setSelectedMoment(null); setViewers([]); }
    }
  };

  function getTimeRemaining(expiresAt: string): string {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }

  const activeMoments = moments.filter((m) => !m.isExpired);
  const expiredMoments = moments.filter((m) => m.isExpired);
  const atLimit = activeMoments.length >= maxMoments;
  const selectedMomentData = moments.find((m) => m.id === selectedMoment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <Camera className="w-6 h-6" />
            Moments
          </h1>
          <p className="text-muted-foreground">
            Share photos and short videos that disappear after 24 hours
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {planLabel}: {activeMoments.length}/{maxMoments === 999999 ? "Unlimited" : maxMoments}
          </Badge>
          <Button
            variant="gold"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || atLimit}
          >
            <Plus className="w-4 h-4 me-2" />
            New Moment
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Plan Limit Warning */}
      {atLimit && plan !== "pro" && (
        <UpgradeBanner currentPlan={plan} feature="moments" />
      )}

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Views", value: (analytics.totalViews ?? 0).toLocaleString(), icon: Eye, color: "text-blue-500" },
            { label: "Unique Viewers", value: (analytics.totalUniqueViewers ?? 0).toLocaleString(), icon: Users, color: "text-emerald-500" },
            { label: "Avg Views/Moment", value: (analytics.avgViewsPerMoment ?? 0).toFixed(1), icon: TrendingUp, color: "text-moulna-gold" },
            { label: "Completion Rate", value: `${analytics.completionRate ?? 0}%`, icon: BarChart3, color: "text-purple-500" },
            { label: "Engagement", value: ((analytics.totalTapsForward ?? 0) + (analytics.totalTapsBack ?? 0) + (analytics.totalLinkClicks ?? 0) + (analytics.totalReplies ?? 0)).toLocaleString(), icon: MousePointerClick, color: "text-rose-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Views Chart (mini sparkline) */}
      {analytics?.viewsByDay && analytics.viewsByDay.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-moulna-gold" />
            Views — Last 30 Days
          </h3>
          <div className="flex items-end gap-[2px] h-16">
            {analytics.viewsByDay.map((day, i) => {
              const views = Number(day.views) || 0;
              const max = Math.max(...analytics.viewsByDay.map((d) => Number(d.views) || 0), 1);
              const height = (views / max) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-moulna-gold/20 hover:bg-moulna-gold/40 rounded-t transition-colors group relative"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${day.date}: ${views} views`}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {views}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{analytics.viewsByDay[0]?.date}</span>
            <span>{analytics.viewsByDay[analytics.viewsByDay.length - 1]?.date}</span>
          </div>
        </Card>
      )}

      {/* Upload Preview */}
      {preview && (
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative w-48 aspect-[9/16] rounded-xl overflow-hidden bg-black flex-shrink-0">
              {preview.type === "video" ? (
                <video src={preview.url} className="w-full h-full object-contain" controls muted />
              ) : (
                <Image src={preview.url} alt="Preview" fill className="object-contain" />
              )}
              <button onClick={clearPreview} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Caption (optional)</label>
                <Input placeholder="Add a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={200} />
                <p className="text-xs text-muted-foreground mt-1">{caption.length}/200</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Disappears after 24 hours
              </div>
              <div className="flex gap-3">
                <Button variant="gold" onClick={handleUpload} disabled={uploading}>
                  {uploading ? (<><Loader2 className="w-4 h-4 me-2 animate-spin" />Uploading...</>) : (<><Upload className="w-4 h-4 me-2" />Post Moment</>)}
                </Button>
                <Button variant="outline" onClick={clearPreview} disabled={uploading}>Cancel</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Active Moments Grid + Detail Panel */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            Active
            {activeMoments.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({activeMoments.length}/{maxMoments === 999999 ? "Unlimited" : maxMoments})
              </span>
            )}
          </h2>

          {loading ? (
            <Card className="p-12 text-center">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
            </Card>
          ) : activeMoments.length === 0 ? (
            <Card className="p-12 text-center">
              <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No active moments</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share a photo or video to connect with your customers
              </p>
              <Button variant="gold" onClick={() => fileInputRef.current?.click()}>
                <Plus className="w-4 h-4 me-2" />
                Add Your First Moment
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {activeMoments.map((moment, index) => (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={cn(
                      "overflow-hidden group relative cursor-pointer transition-all",
                      selectedMoment === moment.id && "ring-2 ring-moulna-gold"
                    )}
                    onClick={() => fetchViewers(moment.id)}
                  >
                    <div className="aspect-[9/16] relative bg-black">
                      {moment.mediaType === "video" ? (
                        <>
                          {moment.thumbnailUrl ? (
                            <Image src={moment.thumbnailUrl} alt={moment.caption || "Moment"} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="w-8 h-8 text-white/40" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <Video className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        </>
                      ) : (
                        <Image src={moment.mediaUrl} alt={moment.caption || "Moment"} fill className="object-cover" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMoment(moment.id); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Stats overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <div className="flex items-center gap-2 text-white text-[11px]">
                          <span className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded">
                            <Eye className="w-3 h-3" />
                            {moment.viewCount}
                          </span>
                          <span className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded">
                            <Users className="w-3 h-3" />
                            {moment.uniqueViewers}
                          </span>
                          <span className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded ms-auto">
                            <Clock className="w-3 h-3" />
                            {getTimeRemaining(moment.expiresAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom stats bar */}
                    <div className="px-2 py-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {moment.retentionRate}% retention
                      </span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Viewer Detail Panel */}
        {selectedMomentData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-80 flex-shrink-0"
          >
            <Card className="p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Moment Details</h3>
                <button onClick={() => { setSelectedMoment(null); setViewers([]); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Moment engagement stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "Views", value: selectedMomentData.viewCount, icon: Eye },
                  { label: "Unique", value: selectedMomentData.uniqueViewers, icon: Users },
                  { label: "Taps Fwd", value: selectedMomentData.tapsForward, icon: ArrowRight },
                  { label: "Taps Back", value: selectedMomentData.tapsBack, icon: ArrowLeft },
                  { label: "Retention", value: `${selectedMomentData.retentionRate}%`, icon: TrendingUp },
                  { label: "Engagement", value: selectedMomentData.engagement, icon: MousePointerClick },
                ].map((s) => (
                  <div key={s.label} className="p-2 rounded-lg bg-muted/50 text-center">
                    <s.icon className="w-3.5 h-3.5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-bold">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Caption & time */}
              {selectedMomentData.caption && (
                <p className="text-sm text-muted-foreground mb-2 italic">&quot;{selectedMomentData.caption}&quot;</p>
              )}
              <p className="text-xs text-muted-foreground mb-4">
                Posted {timeAgo(selectedMomentData.createdAt)} &middot; {getTimeRemaining(selectedMomentData.expiresAt)} left
              </p>

              {/* Viewers list */}
              <div className="border-t pt-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Recent Viewers ({viewers.length})
                </h4>
                {viewersLoading ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin text-muted-foreground" />
                ) : viewers.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No viewers yet</p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {viewers.map((viewer) => (
                      <div key={viewer.id} className="flex items-center gap-2">
                        <DiceBearAvatar
                          seed={viewer.avatarSeed || viewer.name}
                          style={viewer.avatarStyle}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{viewer.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>Lv.{viewer.level}</span>
                            <span>&middot;</span>
                            <span>{timeAgo(viewer.viewedAt)}</span>
                            {viewer.completed && (
                              <Badge className="bg-emerald-500/10 text-emerald-500 text-[9px] px-1 py-0">
                                Watched fully
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Expired Moments */}
      {expiredMoments.length > 0 && (
        <div>
          <h2 className="font-semibold mb-4 text-muted-foreground">
            Expired ({expiredMoments.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {expiredMoments.slice(0, 10).map((moment) => (
              <Card key={moment.id} className="overflow-hidden opacity-50 relative">
                <div className="aspect-[9/16] relative bg-black">
                  {moment.mediaType === "video" ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-white/30" />
                    </div>
                  ) : (
                    <Image src={moment.mediaUrl} alt={moment.caption || "Moment"} fill className="object-cover grayscale" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">Expired</span>
                  </div>
                </div>
                <div className="px-2 py-1.5 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {moment.viewCount}
                  </span>
                  <button
                    onClick={() => deleteMoment(moment.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade CTA at bottom for free/growth */}
      {plan !== "pro" && activeMoments.length > 0 && !atLimit && (
        <UpgradeBanner currentPlan={plan} feature="moments" context="inline" />
      )}
    </div>
  );
}
