"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";
import { ShopAvatar } from "@/components/avatar/ShopAvatar";
import {
  X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Eye,
  Camera,
} from "lucide-react";

interface Moment {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  thumbnailUrl?: string;
  caption?: string;
  viewCount: number;
  createdAt: string;
  expiresAt: string;
  viewed: boolean;
}

interface ShopMoments {
  shop: {
    id: string;
    name: string;
    slug: string;
    avatarStyle: string;
    avatarSeed?: string;
    logoUrl?: string;
    isVerified: boolean;
  };
  hasUnseen: boolean;
  moments: Moment[];
}

function trackEngagement(momentId: string, action: string, extra?: Record<string, unknown>) {
  fetch("/api/moments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ momentId, action, ...extra }),
  }).catch(() => {});
}

export function FollowedMomentsStrip() {
  const [shops, setShops] = React.useState<ShopMoments[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [activeShopIndex, setActiveShopIndex] = React.useState(0);
  const [activeMomentIndex, setActiveMomentIndex] = React.useState(0);

  React.useEffect(() => {
    fetch("/api/moments/following")
      .then((res) => res.json())
      .then((data) => {
        if (data.shops) setShops(data.shops);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || shops.length === 0) return null;

  const openViewer = (shopIndex: number) => {
    setActiveShopIndex(shopIndex);
    setActiveMomentIndex(0);
    setViewerOpen(true);
  };

  const markShopSeen = (shopIndex: number) => {
    setShops((prev) =>
      prev.map((s, i) =>
        i === shopIndex
          ? {
              ...s,
              hasUnseen: false,
              moments: s.moments.map((m) => ({ ...m, viewed: true })),
            }
          : s
      )
    );
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-moulna-gold" />
          <h3 className="text-sm font-semibold text-muted-foreground">Moments from Sellers You Follow</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
          {shops.map((shopData, index) => (
            <button
              key={shopData.shop.id}
              onClick={() => openViewer(index)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-full p-[2.5px] transition-all",
                  shopData.hasUnseen
                    ? "bg-gradient-to-tr from-moulna-gold via-amber-400 to-yellow-300"
                    : "bg-muted-foreground/20"
                )}
              >
                <div className="w-full h-full rounded-full bg-background p-[2px]">
                  <ShopAvatar
                    logoUrl={shopData.shop.logoUrl}
                    avatarSeed={shopData.shop.avatarSeed || shopData.shop.slug}
                    avatarStyle={shopData.shop.avatarStyle}
                    name={shopData.shop.name}
                    size="md"
                    className={cn(
                      "w-full h-full",
                      !shopData.hasUnseen && "opacity-60"
                    )}
                  />
                </div>
              </div>
              <span className={cn(
                "text-[11px] max-w-[72px] truncate",
                shopData.hasUnseen ? "font-semibold" : "text-muted-foreground"
              )}>
                {shopData.shop.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {viewerOpen && (
          <StoryViewer
            shops={shops}
            activeShopIndex={activeShopIndex}
            activeMomentIndex={activeMomentIndex}
            onShopChange={(i) => {
              setActiveShopIndex(i);
              markShopSeen(i);
            }}
            onMomentChange={setActiveMomentIndex}
            onClose={() => {
              markShopSeen(activeShopIndex);
              setViewerOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Fullscreen Story Viewer ───

function StoryViewer({
  shops,
  activeShopIndex,
  activeMomentIndex,
  onShopChange,
  onMomentChange,
  onClose,
}: {
  shops: ShopMoments[];
  activeShopIndex: number;
  activeMomentIndex: number;
  onShopChange: (i: number) => void;
  onMomentChange: (i: number) => void;
  onClose: () => void;
}) {
  const [paused, setPaused] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const viewStartRef = React.useRef<number>(Date.now());

  const shop = shops[activeShopIndex];
  const moment = shop?.moments[activeMomentIndex];
  const isVideo = moment?.mediaType === "video";
  const DURATION = isVideo ? 15000 : 5000;

  React.useEffect(() => {
    if (!moment) return;
    viewStartRef.current = Date.now();
    trackEngagement(moment.id, "view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeShopIndex, activeMomentIndex]);

  React.useEffect(() => {
    if (paused || !moment) return;

    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        const watchMs = Date.now() - viewStartRef.current;
        trackEngagement(moment.id, "complete", { watchDurationMs: watchMs, completed: true });
        goNext();
      } else {
        timerRef.current = setTimeout(tick, 50);
      }
    };
    timerRef.current = setTimeout(tick, 50);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeShopIndex, activeMomentIndex, paused]);

  const goNext = () => {
    if (moment) trackEngagement(moment.id, "tap_forward");
    const currentShop = shops[activeShopIndex];
    if (activeMomentIndex < currentShop.moments.length - 1) {
      onMomentChange(activeMomentIndex + 1);
    } else if (activeShopIndex < shops.length - 1) {
      const nextShop = activeShopIndex + 1;
      onShopChange(nextShop);
      onMomentChange(0);
    } else {
      onClose();
    }
    setProgress(0);
  };

  const goPrev = () => {
    if (moment) trackEngagement(moment.id, "tap_back");
    if (activeMomentIndex > 0) {
      onMomentChange(activeMomentIndex - 1);
    } else if (activeShopIndex > 0) {
      const prevShop = activeShopIndex - 1;
      onShopChange(prevShop);
      onMomentChange(shops[prevShop].moments.length - 1);
    }
    setProgress(0);
  };

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " ") { e.preventDefault(); setPaused((p) => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeShopIndex, activeMomentIndex]);

  if (!shop || !moment) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {(activeShopIndex > 0 || activeMomentIndex > 0) && (
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur items-center justify-center text-white hover:bg-black/60 transition-colors hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {(activeShopIndex < shops.length - 1 || activeMomentIndex < shop.moments.length - 1) && (
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur items-center justify-center text-white hover:bg-black/60 transition-colors hidden md:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <div className="relative w-full max-w-[420px] h-full max-h-[90vh] mx-auto rounded-xl overflow-hidden">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-3">
          {shop.moments.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: i < activeMomentIndex ? "100%" : i === activeMomentIndex ? `${progress * 100}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center gap-3">
          <Link href={`/shops/${shop.shop.slug}`} onClick={onClose}>
            <ShopAvatar
              logoUrl={shop.shop.logoUrl}
              avatarSeed={shop.shop.avatarSeed || shop.shop.slug}
              avatarStyle={shop.shop.avatarStyle}
              name={shop.shop.name}
              size="sm"
              className="border border-white/30"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/shops/${shop.shop.slug}`} onClick={onClose} className="text-sm font-semibold text-white truncate block hover:underline">
              {shop.shop.name}
            </Link>
            <p className="text-xs text-white/60">{timeAgo(moment.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            {isVideo && (
              <button onClick={() => setMuted(!muted)} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
            <button onClick={() => setPaused(!paused)} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white">
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Media */}
        <div className="w-full h-full bg-black flex items-center justify-center">
          {isVideo ? (
            <video
              ref={videoRef}
              src={moment.mediaUrl}
              className="w-full h-full object-contain"
              autoPlay
              playsInline
              muted={muted}
              loop={false}
            />
          ) : (
            <Image src={moment.mediaUrl} alt={moment.caption || "Moment"} fill className="object-contain" priority />
          )}
        </div>

        {/* Tap zones */}
        <div className="absolute inset-0 z-20 flex">
          <button className="w-1/3 h-full" onClick={goPrev} aria-label="Previous" />
          <button className="w-1/3 h-full" onClick={() => setPaused(!paused)} aria-label="Pause" />
          <button className="w-1/3 h-full" onClick={goNext} aria-label="Next" />
        </div>

        {/* Caption + views */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent px-4 pb-6 pt-16">
          {moment.caption && <p className="text-white text-sm mb-2">{moment.caption}</p>}
          <div className="flex items-center gap-3 text-white/50 text-xs">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {moment.viewCount} views
            </span>
            {moment.viewed && (
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/40 text-[10px] font-medium">
                Viewed
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
