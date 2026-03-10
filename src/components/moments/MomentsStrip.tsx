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

export function MomentsStrip() {
  const [shops, setShops] = React.useState<ShopMoments[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [activeShopIndex, setActiveShopIndex] = React.useState(0);
  const [activeMomentIndex, setActiveMomentIndex] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fetch("/api/moments")
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

  const scrollStrip = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  // Get the latest/first moment for each shop as cover
  const getCoverMoment = (shopData: ShopMoments) => {
    return shopData.moments[0];
  };

  return (
    <>
      <section className="py-10 lg:py-14 bg-background">
        <div className="container-app">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Camera className="w-5 h-5 text-moulna-gold" />
                <span className="text-sm font-medium text-moulna-gold">Fresh Updates</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold">
                Seller&apos;s Moments
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollStrip("left")}
                className="w-9 h-9 rounded-full bg-muted hover:bg-muted-foreground/10 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollStrip("right")}
                className="w-9 h-9 rounded-full bg-muted hover:bg-muted-foreground/10 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cover Image Cards Strip */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          >
            {shops.map((shopData, index) => {
              const cover = getCoverMoment(shopData);
              if (!cover) return null;
              const isVideo = cover.mediaType === "video";
              const coverUrl = isVideo
                ? cover.thumbnailUrl
                : cover.mediaUrl;

              return (
                <motion.button
                  key={shopData.shop.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 8) * 0.05 }}
                  onClick={() => openViewer(index)}
                  className="flex-shrink-0 w-[200px] group relative"
                >
                  {/* Cover Card */}
                  <div
                    className={cn(
                      "relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-muted",
                      shopData.hasUnseen
                        ? "ring-2 ring-moulna-gold ring-offset-2 ring-offset-background"
                        : ""
                    )}
                  >
                    {coverUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={coverUrl}
                        alt={shopData.shop.name}
                        className={cn(
                          "absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                          !shopData.hasUnseen && "brightness-[0.85]"
                        )}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : isVideo ? (
                      <video
                        src={cover.mediaUrl}
                        className={cn(
                          "absolute inset-0 w-full h-full object-cover",
                          !shopData.hasUnseen && "brightness-[0.85]"
                        )}
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-moulna-gold/30 to-amber-500/10 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-moulna-gold/50" />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Unseen indicator */}
                    {shopData.hasUnseen && (
                      <div className="absolute top-3 right-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-moulna-gold block animate-pulse" />
                      </div>
                    )}

                    {/* Moment count */}
                    {shopData.moments.length > 1 && (
                      <div className="absolute top-3 left-3">
                        <span className="text-[11px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {shopData.moments.length} moments
                        </span>
                      </div>
                    )}

                    {/* Video play icon */}
                    {cover.mediaType === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 text-white fill-white ms-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <ShopAvatar
                          logoUrl={shopData.shop.logoUrl}
                          avatarSeed={shopData.shop.avatarSeed || shopData.shop.slug}
                          avatarStyle={shopData.shop.avatarStyle}
                          name={shopData.shop.name}
                          size="xs"
                          className="border border-white/30"
                        />
                        <span className={cn(
                          "text-xs text-white truncate font-medium",
                          !shopData.hasUnseen && "text-white/70"
                        )}>
                          {shopData.shop.name}
                        </span>
                      </div>
                      {cover.caption && (
                        <p className="text-[11px] text-white/70 line-clamp-1">{cover.caption}</p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {viewerOpen && (
          <MomentViewer
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

// ─── Fullscreen Moment Viewer ───

function MomentViewer({
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

  // Track view on each new moment
  React.useEffect(() => {
    if (!moment) return;
    viewStartRef.current = Date.now();
    trackEngagement(moment.id, "view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeShopIndex, activeMomentIndex]);

  // Auto-advance timer
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

  // Keyboard
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
