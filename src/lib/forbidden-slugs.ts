/**
 * Reserved slugs that cannot be used as shop URLs.
 * Includes app routes, brand names, and common reserved words.
 */
export const FORBIDDEN_SLUGS = new Set([
  // -- App routes --
  "about",
  "admin",
  "api",
  "cart",
  "checkout",
  "contact",
  "dashboard",
  "explore",
  "help",
  "login",
  "register",
  "notifications",
  "pricing",
  "privacy",
  "products",
  "profile",
  "search",
  "seller",
  "sell-with-us",
  "shops",
  "terms",
  "legal",
  "refund-policy",
  "seller-agreement",
  "artisan-program",
  "how-it-works",
  "forgot-password",
  "reset-password",
  "verify-email",
  "verify-phone",
  "onboarding",

  // -- Brand / platform --
  "moulna",
  "moulna-ae",
  "moulna-marketplace",
  "moulna-official",
  "official",
  "support",
  "team",
  "staff",
  "moderator",
  "mod",

  // -- Common reserved words --
  "www",
  "app",
  "mail",
  "blog",
  "news",
  "status",
  "docs",
  "dev",
  "staging",
  "test",
  "demo",
  "null",
  "undefined",
  "true",
  "false",

  // -- Sensitive / impersonation --
  "root",
  "system",
  "sysadmin",
  "superadmin",
  "administrator",
  "webmaster",
  "postmaster",
  "info",
  "noreply",
  "no-reply",
  "abuse",
  "security",
  "billing",
  "payments",
  "settings",
  "account",
]);

/** Generate a slug from a shop name */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

/** Check if a slug is forbidden */
export function isSlugForbidden(slug: string): boolean {
  return FORBIDDEN_SLUGS.has(slug);
}
