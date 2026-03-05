export interface SeasonalCampaign {
  slug: string;
  title: string;
  description: string;
  image: string;
  gradient: string;
  badge: string;
}

export const SEASONAL_CAMPAIGNS: { start: string; end: string; campaign: SeasonalCampaign }[] = [
  // Ramadan (approx late Feb – late Mar 2026)
  {
    start: "02-15",
    end: "03-25",
    campaign: {
      slug: "ramadan-sale",
      title: "Ramadan Kareem",
      description: "Discover handcrafted gifts, oud collections, and special Ramadan bundles from UAE's finest artisans. Exclusive deals throughout the holy month.",
      image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80",
      gradient: "from-purple-900/80 via-indigo-900/60 to-transparent",
      badge: "Ramadan Special",
    },
  },
  // Eid Al Fitr (late Mar – mid Apr)
  {
    start: "03-26",
    end: "04-15",
    campaign: {
      slug: "eid-al-fitr-sale",
      title: "Eid Mubarak",
      description: "Celebrate Eid with stunning handmade gifts, festive home décor, and exclusive collections. Treat yourself and your loved ones.",
      image: "https://images.unsplash.com/photo-1590076215667-875d4ef2d7de?w=1200&q=80",
      gradient: "from-emerald-900/80 via-teal-900/60 to-transparent",
      badge: "Eid Collection",
    },
  },
  // Summer Sale (Jun – Aug)
  {
    start: "06-01",
    end: "08-31",
    campaign: {
      slug: "summer-sale",
      title: "Summer Sale",
      description: "Beat the heat with cool deals! Up to 50% off on handmade accessories, home fragrances, and artisan crafts all summer long.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      gradient: "from-orange-900/80 via-amber-900/60 to-transparent",
      badge: "Summer Deals",
    },
  },
  // Back to School (Sep)
  {
    start: "09-01",
    end: "09-30",
    campaign: {
      slug: "back-to-school",
      title: "Back to School",
      description: "Start the new school year with unique handmade stationery, calligraphy sets, and personalized accessories for students.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
      gradient: "from-blue-900/80 via-sky-900/60 to-transparent",
      badge: "School Season",
    },
  },
  // UAE National Day (Nov 15 – Dec 10)
  {
    start: "11-15",
    end: "12-10",
    campaign: {
      slug: "national-day-sale",
      title: "UAE National Day",
      description: "Celebrate the spirit of the union with proudly Emirati crafts, heritage items, and patriotic collections from local artisans.",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
      gradient: "from-red-900/80 via-rose-900/60 to-transparent",
      badge: "National Day",
    },
  },
  // Year-End / New Year (Dec 11 – Jan 10)
  {
    start: "12-11",
    end: "01-10",
    campaign: {
      slug: "new-year-sale",
      title: "New Year, New Finds",
      description: "Ring in the new year with exclusive artisan collections. Handpicked gifts, limited editions, and festive deals to start fresh.",
      image: "https://images.unsplash.com/photo-1482245294234-b3f2f8d5f1a4?w=1200&q=80",
      gradient: "from-violet-900/80 via-purple-900/60 to-transparent",
      badge: "New Year Sale",
    },
  },
  // Dubai Shopping Festival (Jan 11 – Feb 14)
  {
    start: "01-11",
    end: "02-14",
    campaign: {
      slug: "dsf-sale",
      title: "Dubai Shopping Festival",
      description: "The biggest shopping event in the region! Explore thousands of handmade products with exclusive DSF deals and surprise discounts.",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80",
      gradient: "from-cyan-900/80 via-blue-900/60 to-transparent",
      badge: "DSF Deals",
    },
  },
];

const DEFAULT_CAMPAIGN: SeasonalCampaign = {
  slug: "deals",
  title: "Explore What's New",
  description: "Discover the latest handmade products, artisan collections, and exclusive finds from UAE's best creators.",
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  gradient: "from-neutral-900/80 via-neutral-800/60 to-transparent",
  badge: "Featured",
};

export function getCurrentCampaign(): SeasonalCampaign {
  const now = new Date();
  const mmdd = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  for (const { start, end, campaign } of SEASONAL_CAMPAIGNS) {
    if (start > end) {
      if (mmdd >= start || mmdd <= end) return campaign;
    } else {
      if (mmdd >= start && mmdd <= end) return campaign;
    }
  }

  return DEFAULT_CAMPAIGN;
}
