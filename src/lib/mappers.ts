import type { Shop, Product, ProductSeller, ProductBadge } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbShop(row: any): Shop {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline ?? undefined,
    description: row.description ?? undefined,
    category: row.category ?? undefined,
    avatarStyle: row.avatar_style || "adventurer",
    avatarSeed: row.avatar_seed ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    bannerUrl: row.banner_url ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    website: row.website ?? undefined,
    location: row.location ?? undefined,
    instagram: row.instagram ?? undefined,
    facebook: row.facebook ?? undefined,
    twitter: row.twitter ?? undefined,
    youtube: row.youtube ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    story: row.story ?? undefined,
    storySections: row.story_sections ?? [],
    milestones: row.milestones ?? [],
    coreValues: row.core_values ?? [],
    operatingHours: row.operating_hours ?? {},
    policies: row.policies ?? {},
    branding: row.branding ?? {},
    listingPreferences: row.listing_preferences ?? {},
    totalListings: row.total_listings || 0,
    followerCount: row.follower_count || 0,
    isVerified: row.is_verified || false,
    isArtisan: row.is_artisan || false,
    responseTime: row.response_time ?? undefined,
    workshopSections: row.workshop_sections ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbProductSeller(shop: any): ProductSeller {
  return {
    id: shop.owner_id,
    shopId: shop.id,
    name: shop.name,
    slug: shop.slug,
    avatarStyle: shop.avatar_style || "adventurer",
    avatarSeed: shop.avatar_seed ?? undefined,
    logoUrl: shop.logo_url ?? undefined,
    level: shop.owner_level || shop.level || 1,
    totalListings: shop.total_listings || 0,
    location: shop.location ?? undefined,
    isVerified: shop.is_verified || false,
    responseTime: shop.response_time ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbProduct(row: any, shop?: any, isSponsored = false): Product {
  const createdAt = row.created_at;
  const isNew = (Date.now() - new Date(createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
  const isTrending = (row.view_count || 0) > 100 || (row.inquiry_count || 0) > 10;
  const available = row.status === "active" && (!row.expires_at || new Date(row.expires_at) > new Date());

  const badges: ProductBadge[] = [];
  if (isTrending) badges.push("trending");
  if (isNew) badges.push("new");
  if (row.is_handmade) badges.push("handmade");
  if (isSponsored) badges.push("sponsored");

  const seller: ProductSeller = shop
    ? mapDbProductSeller(shop)
    : {
        id: row.owner_id,
        shopId: row.shop_id,
        name: row.shops?.name || "",
        slug: row.shops?.slug || "",
        avatarStyle: row.shops?.avatar_style || "adventurer",
        avatarSeed: row.shops?.avatar_seed ?? undefined,
        logoUrl: row.shops?.logo_url ?? undefined,
        level: row.shops?.owner_level || row.shops?.level || 1,
        totalListings: row.shops?.total_listings || 0,
        location: row.shops?.location ?? undefined,
        isVerified: row.shops?.is_verified || false,
        responseTime: row.shops?.response_time ?? undefined,
      };

  return {
    id: row.id,
    slug: row.slug,
    ownerId: row.owner_id,
    shopId: row.shop_id,
    title: row.title,
    description: row.description || "",
    shortDescription: row.short_description ?? undefined,
    category: row.category ?? undefined,
    tags: row.tags || [],
    images: row.images || [],
    videoUrl: row.video_url ?? undefined,
    priceFils: row.price_fils,
    compareAtPriceFils: row.compare_at_price_fils ?? undefined,
    costFils: row.cost_fils ?? undefined,
    sku: row.sku ?? undefined,
    condition: row.condition ?? undefined,
    variants: row.variants || [],
    status: row.status,
    listingDuration: row.listing_duration ?? undefined,
    expiresAt: row.expires_at ?? undefined,
    autoRenew: row.auto_renew ?? true,
    allowOffers: row.allow_offers ?? true,
    processingTime: row.processing_time ?? undefined,
    meetupPreference: row.meetup_preference ?? undefined,
    isHandmade: row.is_handmade || false,
    inquiryCount: row.inquiry_count || 0,
    viewCount: row.view_count || 0,
    xpReward: row.xp_reward || 5,
    seller,
    badges,
    isTrending,
    isNew,
    isSponsored,
    available,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    customFields: row.custom_fields || [],
    publishedAt: row.published_at ?? undefined,
  };
}
