"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import type { Shop, Product } from "@/lib/types";
import {
  Star, Share2, MapPin, Calendar, MessageCircle, UserPlus,
  Award, Package, Shield, Clock, Instagram, Facebook, Twitter,
  Youtube, Globe, Mail, Phone, Loader2, Store, Play, X, Quote,
  Pencil, FileText, ImageIcon, Video, Milestone,
} from "lucide-react";

// ─── Helpers ───

function getEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

function formatPrice(fils: number): string {
  return `AED ${(fils / 100).toFixed(2)}`;
}

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

// ─── Owner Placeholder ───

function OwnerPlaceholder({
  icon: Icon,
  title,
  description,
  editHref,
  editLabel = "Set Up",
  dark = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  editHref: string;
  editLabel?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn(
      "border-2 border-dashed rounded-2xl p-10 md:p-14 text-center max-w-2xl mx-auto",
      dark ? "border-white/20" : "border-muted-foreground/20"
    )}>
      <Icon className={cn("w-12 h-12 mx-auto mb-4", dark ? "text-white/30" : "text-muted-foreground/40")} />
      <h3 className={cn("font-semibold text-lg mb-2", dark ? "text-white/60" : "text-muted-foreground")}>
        {title}
      </h3>
      <p className={cn("text-sm mb-6 max-w-md mx-auto", dark ? "text-white/40" : "text-muted-foreground/70")}>
        {description}
      </p>
      <Button asChild variant={dark ? "outline" : "gold"} className={dark ? "border-white/30 text-white hover:bg-white/10" : ""}>
        <Link href={editHref}>
          <Pencil className="w-4 h-4 me-2" />
          {editLabel}
        </Link>
      </Button>
    </div>
  );
}

// ─── Tab Definitions ───

interface TabDef {
  id: string;
  label: string;
}

// ─── Page ───

export default function ShopPage() {
  const params = useParams();
  const shopSlug = params.shopSlug as string;

  const [shop, setShop] = React.useState<Shop | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isOwner, setIsOwner] = React.useState(false);
  const [followLoading, setFollowLoading] = React.useState(false);
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("");

  const tabBarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch(`/api/shops/${shopSlug}`);
        if (res.ok) {
          const data = await res.json();
          setShop(data.shop);
          setIsFollowing(data.isFollowing);
          setIsOwner(data.isOwner ?? false);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (shopSlug) loadShop();
  }, [shopSlug]);

  React.useEffect(() => {
    if (!shop) return;
    fetch(`/api/products?shop=${shop.slug}&limit=8`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => {});
  }, [shop]);

  // Build tabs once shop is loaded
  const tabs = React.useMemo(() => {
    if (!shop) return [];
    const hasAbout = !!shop.description || shop.coreValues.length > 0;
    const hasStory = shop.storySections.length > 0;
    const hasMilestones = shop.milestones.length > 0;
    const hasWorkshop = !!shop.videoUrl || shop.galleryImages.length > 0;

    const t: TabDef[] = [];
    if (hasAbout || isOwner) t.push({ id: "about", label: "About" });
    if (hasStory || isOwner) t.push({ id: "story", label: "Our Story" });
    if (hasMilestones || isOwner) t.push({ id: "milestones", label: "Journey" });
    if (hasWorkshop || isOwner) t.push({ id: "workshop", label: "Workshop" });
    t.push({ id: "products", label: "Products" });
    t.push({ id: "reviews", label: "Reviews" });
    t.push({ id: "contact", label: "Contact" });
    return t;
  }, [shop, isOwner]);

  // Set default active tab when tabs are ready
  React.useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const handleFollow = async () => {
    if (!shop) return;
    setFollowLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`/api/shops/${shop.slug}/follow`, { method });
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setShop({ ...shop, followerCount: shop.followerCount + (isFollowing ? -1 : 1) });
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    // Scroll to the top of the tab content area
    if (tabBarRef.current) {
      const rect = tabBarRef.current.getBoundingClientRect();
      if (rect.top < 0) {
        tabBarRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // ─── Loading / Not Found ───
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Shop Not Found</h2>
            <p className="text-muted-foreground mb-4">This shop doesn&apos;t exist or has been removed.</p>
            <Button variant="outline" asChild>
              <Link href="/explore/shops">Browse Shops</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const joinDate = new Date(shop.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const hasAbout = !!shop.description || shop.coreValues.length > 0;
  const hasStory = shop.storySections.length > 0;
  const hasMilestones = shop.milestones.length > 0;
  const hasWorkshop = !!shop.videoUrl || shop.galleryImages.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative h-[70vh] min-h-[480px] flex items-end">
          {shop.bannerUrl ? (
            <Image src={shop.bannerUrl} alt={shop.name} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-moulna-gold/40 via-amber-200/30 to-amber-50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 w-full pb-12 pt-20">
            <div className="container mx-auto px-4 text-center text-white">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <DiceBearAvatar
                  seed={shop.avatarSeed || shop.slug}
                  style={shop.avatarStyle || "adventurer"}
                  size="3xl"
                  className="mx-auto border-4 border-white/20 shadow-2xl mb-4"
                />
              </motion.div>

              <motion.h1
                className="font-display text-3xl md:text-5xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {shop.name}
              </motion.h1>

              {shop.tagline && (
                <motion.p
                  className="text-lg md:text-xl text-white/80 mb-4 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {shop.tagline}
                </motion.p>
              )}

              <motion.div
                className="flex items-center justify-center gap-2 mb-6 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                {shop.category && (
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    {shop.category}
                  </Badge>
                )}
                {shop.isVerified && (
                  <Badge variant="gold">
                    <Shield className="w-3 h-3 me-1" />
                    Verified
                  </Badge>
                )}
                {shop.isArtisan && (
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    <Award className="w-3 h-3 me-1" />
                    Artisan
                  </Badge>
                )}
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-4 md:gap-8 text-sm flex-wrap mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-moulna-gold text-moulna-gold" />
                  <span className="font-medium">{shop.rating}</span>
                  <span className="text-white/60">({shop.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <Package className="w-4 h-4" />
                  <span>{shop.totalListings} products</span>
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <UserPlus className="w-4 h-4" />
                  <span>{shop.followerCount} followers</span>
                </div>
                {shop.location && (
                  <div className="flex items-center gap-1 text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span>{shop.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-white/70">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </motion.div>

              {!isOwner ? (
                <motion.div
                  className="flex items-center justify-center gap-3 flex-wrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant={isFollowing ? "outline" : "gold"}
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={isFollowing ? "border-white/30 text-white hover:bg-white/10" : ""}
                  >
                    {isFollowing ? <>Following</> : <><UserPlus className="w-4 h-4 me-2" />Follow</>}
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <MessageCircle className="w-4 h-4 me-2" />
                    Contact
                  </Button>
                  <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white/10">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center justify-center gap-3 flex-wrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Link href="/seller/shop/edit">
                      <Pencil className="w-4 h-4 me-2" />
                      Edit Shop
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ TAB BAR ═══════════ */}
        <div ref={tabBarRef} className="sticky top-16 lg:top-20 z-40 bg-background/95 backdrop-blur-md border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto scrollbar-none py-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "text-moulna-gold bg-moulna-gold/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════ TAB CONTENT ═══════════ */}
        <AnimatePresence mode="wait">
          {/* ── ABOUT ── */}
          {activeTab === "about" && (
            <motion.section key="about" variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="py-16 md:py-24 bg-background">
              <div className="container mx-auto px-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">About {shop.name}</h2>

                {hasAbout ? (
                  <div className={cn("grid gap-12", shop.coreValues.length > 0 ? "md:grid-cols-5" : "max-w-3xl mx-auto")}>
                    {shop.description && (
                      <div className={cn(shop.coreValues.length > 0 ? "md:col-span-3" : "")}>
                        <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                          {shop.description}
                        </p>
                      </div>
                    )}

                    {shop.coreValues.length > 0 && (
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="font-semibold text-lg mb-4">Core Values</h3>
                        {shop.coreValues.map((value, i) => (
                          <Card key={i} className="p-4 border-l-4 border-l-moulna-gold">
                            <p className="font-medium">{value}</p>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <OwnerPlaceholder icon={FileText} title="Tell your story" description="Add a description and core values so visitors know what makes your shop special." editHref="/seller/shop/edit" editLabel="Add Description" />
                )}
              </div>
            </motion.section>
          )}

          {/* ── OUR STORY ── */}
          {activeTab === "story" && (
            <motion.section key="story" variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="py-16 md:py-24 bg-muted/30">
              <div className="container mx-auto px-4">
                {hasStory ? (
                  <div className="space-y-16">
                    {shop.storySections.map((section, i) => (
                      <div key={section.id || i}>
                        {section.type === "text" && (
                          <div className="max-w-3xl mx-auto">
                            {section.title && <h3 className="font-display text-xl md:text-2xl font-bold mb-4">{section.title}</h3>}
                            {section.content && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>}
                          </div>
                        )}
                        {section.type === "image" && section.imageUrl && (
                          <div className="max-w-4xl mx-auto">
                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                              <Image src={section.imageUrl} alt={section.caption || ""} fill className="object-cover" />
                            </div>
                            {section.caption && <p className="text-center text-sm text-muted-foreground mt-3">{section.caption}</p>}
                          </div>
                        )}
                        {section.type === "quote" && (
                          <blockquote className="max-w-2xl mx-auto text-center">
                            <Quote className="w-10 h-10 text-moulna-gold/30 mx-auto mb-4" />
                            <p className="text-xl md:text-2xl italic text-foreground/80 mb-4">&ldquo;{section.content}&rdquo;</p>
                            {section.author && <cite className="text-sm text-muted-foreground not-italic">&mdash; {section.author}</cite>}
                          </blockquote>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="font-display text-2xl md:text-3xl font-bold">Our Story</h2>
                    </div>
                    <OwnerPlaceholder icon={Quote} title="Share your journey" description="Add text sections, images, and quotes to tell the story behind your brand. Visitors love knowing the person behind the products." editHref="/seller/shop/story" editLabel="Write Your Story" />
                  </>
                )}
              </div>
            </motion.section>
          )}

          {/* ── JOURNEY / MILESTONES ── */}
          {activeTab === "milestones" && (
            <motion.section key="milestones" variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="py-16 md:py-24 bg-background">
              <div className="container mx-auto px-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">Our Journey</h2>

                {hasMilestones ? (
                  <div className="max-w-3xl mx-auto relative">
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-moulna-gold/20 -translate-x-1/2" />
                    {shop.milestones.map((ms, i) => (
                      <div key={i} className={cn("relative flex items-start gap-6 mb-12", i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse")}>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-moulna-gold text-white flex items-center justify-center text-sm font-bold z-10 shadow-md md:absolute md:left-1/2 md:-translate-x-1/2">{ms.year}</div>
                        <Card className={cn("flex-1 p-5 md:w-[calc(50%-3rem)]", i % 2 === 0 ? "md:me-auto md:pe-8" : "md:ms-auto md:ps-8")}>
                          <h4 className="font-semibold mb-1">{ms.title}</h4>
                          <p className="text-sm text-muted-foreground">{ms.description}</p>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <OwnerPlaceholder icon={Milestone} title="Highlight key milestones" description="Show visitors the important moments in your shop's history — when you started, major achievements, and growth milestones." editHref="/seller/shop/story" editLabel="Add Milestones" />
                )}
              </div>
            </motion.section>
          )}

          {/* ── WORKSHOP ── */}
          {activeTab === "workshop" && (
            <motion.section key="workshop" variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="py-16 md:py-24 bg-background">
              <div className="container mx-auto px-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">Workshop</h2>

                {hasWorkshop ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-1.5">
                    {/* Video tile first */}
                    {shop.videoUrl && (
                      <div className="relative aspect-square md:col-span-2 md:row-span-2 rounded-sm overflow-hidden group cursor-pointer bg-neutral-900">
                        <iframe
                          src={getEmbedUrl(shop.videoUrl)}
                          title={`${shop.name} video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 rounded-full p-1.5 pointer-events-none">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    )}

                    {/* Gallery images */}
                    {shop.galleryImages.map((img, i) => (
                      <button
                        key={i}
                        className="relative aspect-square rounded-sm overflow-hidden group cursor-pointer"
                        onClick={() => setLightboxImage(img)}
                      >
                        <Image
                          src={img}
                          alt={`${shop.name} workshop ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <OwnerPlaceholder
                    icon={ImageIcon}
                    title="Showcase your workshop"
                    description="Upload photos and videos of your products, workspace, materials, or anything that shows the quality and care behind your brand."
                    editHref="/seller/shop/gallery"
                    editLabel="Upload Media"
                  />
                )}
              </div>
            </motion.section>
          )}

          {/* ── PRODUCTS ── */}
          {activeTab === "products" && (
            <motion.section key="products" variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="py-16 md:py-24 bg-muted/30">
              <div className="container mx-auto px-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">Featured Products</h2>

                {products.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`}>
                        <Card className="overflow-hidden group hover:shadow-lg transition-shadow h-full">
                          <div className="relative aspect-square">
                            {product.images[0] ? (
                              <Image src={product.images[0]} alt={product.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                            {product.badges.length > 0 && (
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {product.badges.slice(0, 2).map((badge) => (
                                  <Badge key={badge} variant={badge as "trending" | "new" | "handmade"} className="text-[10px]">
                                    {badge === "trending" ? "Trending" : badge === "new" ? "New" : badge === "handmade" ? "Handmade" : badge}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <DiceBearAvatar seed={product.seller.avatarSeed || product.seller.slug} style={product.seller.avatarStyle} size="xs" />
                              <span className="text-xs text-muted-foreground truncate">{product.seller.name}</span>
                            </div>
                            <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-moulna-gold transition-colors">{product.title}</h3>
                            <p className="font-bold text-sm">
                              {formatPrice(product.priceFils)}
                              {product.compareAtPriceFils && product.compareAtPriceFils > product.priceFils && (
                                <span className="text-xs text-muted-foreground line-through ms-2">{formatPrice(product.compareAtPriceFils)}</span>
                              )}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : isOwner ? (
                  <OwnerPlaceholder icon={Package} title="List your first product" description="Your products will show up here once you publish them. Visitors will see your latest and best items right on your shop page." editHref="/seller/products/new" editLabel="Add Product" />
                ) : (
                  <Card className="p-12 text-center max-w-md mx-auto">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No products yet</h3>
                    <p className="text-sm text-muted-foreground">This shop hasn&apos;t listed any products yet. Check back soon!</p>
                  </Card>
                )}
              </div>
            </motion.section>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <motion.section key="reviews" variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="py-16 md:py-24 bg-background">
              <div className="container mx-auto px-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">Customer Reviews</h2>

                <div className="max-w-2xl mx-auto">
                  <Card className="p-6 md:p-8">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-2">{shop.rating}</div>
                        <div className="flex justify-center mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={cn("w-5 h-5", star <= Math.round(shop.rating) ? "fill-moulna-gold text-moulna-gold" : "text-muted")} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{shop.reviewCount} reviews</p>
                      </div>
                      <Separator orientation="vertical" className="h-24" />
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-sm w-8">{stars} ★</span>
                            <Progress value={0} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground w-12">0%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.section>
          )}

          {/* ── CONTACT ── */}
          {activeTab === "contact" && (
            <motion.section key="contact" variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="py-16 md:py-24 bg-background">
              <div className="container mx-auto px-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">Get In Touch</h2>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <Card className="p-6">
                    <MapPin className="w-8 h-8 text-moulna-gold mb-4" />
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-sm text-muted-foreground">{shop.location || "UAE"}</p>
                  </Card>

                  <Card className="p-6">
                    <Mail className="w-8 h-8 text-moulna-gold mb-4" />
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {shop.email ? (
                        <a href={`mailto:${shop.email}`} className="flex items-center gap-2 hover:text-moulna-gold transition-colors"><Mail className="w-4 h-4" />{shop.email}</a>
                      ) : isOwner ? <p className="text-muted-foreground/50 italic">No email added yet</p> : null}
                      {shop.phone ? (
                        <a href={`tel:${shop.phone}`} className="flex items-center gap-2 hover:text-moulna-gold transition-colors"><Phone className="w-4 h-4" />{shop.phone}</a>
                      ) : isOwner ? <p className="text-muted-foreground/50 italic">No phone added yet</p> : null}
                      {shop.website ? (
                        <a href={shop.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-moulna-gold transition-colors"><Globe className="w-4 h-4" />{shop.website.replace(/^https?:\/\//, "")}</a>
                      ) : isOwner ? <p className="text-muted-foreground/50 italic">No website added yet</p> : null}
                    </div>
                    {isOwner && (!shop.email || !shop.phone || !shop.website) && (
                      <Button asChild variant="outline" size="sm" className="mt-4">
                        <Link href="/seller/shop/edit"><Pencil className="w-3 h-3 me-1" />Edit Contact</Link>
                      </Button>
                    )}
                  </Card>

                  <Card className="p-6">
                    <Share2 className="w-8 h-8 text-moulna-gold mb-4" />
                    <h3 className="font-semibold mb-2">Follow Us</h3>
                    {(shop.instagram || shop.facebook || shop.twitter || shop.youtube || shop.whatsapp) ? (
                      <div className="flex flex-wrap gap-3">
                        {shop.instagram && <a href={`https://instagram.com/${shop.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-moulna-gold hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>}
                        {shop.facebook && <a href={`https://facebook.com/${shop.facebook}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-moulna-gold hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>}
                        {shop.twitter && <a href={`https://twitter.com/${shop.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-moulna-gold hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>}
                        {shop.youtube && <a href={shop.youtube.startsWith("http") ? shop.youtube : `https://youtube.com/${shop.youtube}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-moulna-gold hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>}
                        {shop.whatsapp && <a href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-moulna-gold hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></a>}
                      </div>
                    ) : isOwner ? (
                      <>
                        <p className="text-sm text-muted-foreground/50 italic mb-4">No social links added yet</p>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/seller/shop/edit"><Pencil className="w-3 h-3 me-1" />Add Socials</Link>
                        </Button>
                      </>
                    ) : <p className="text-sm text-muted-foreground/50">No social links available</p>}
                  </Card>
                </div>

                {shop.operatingHours && Object.keys(shop.operatingHours).length > 0 && (
                  <div className="max-w-md mx-auto mt-10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-moulna-gold" />
                      <h3 className="font-semibold">Operating Hours</h3>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {Object.entries(shop.operatingHours).map(([key, value]) => (
                        <p key={key}><span className="capitalize">{key}:</span> {value}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* ═══════════ LIGHTBOX ═══════════ */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors" onClick={() => setLightboxImage(null)}>
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full">
            <Image src={lightboxImage} alt="Gallery image" fill className="object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
}
