import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in AED (fils to AED display)
export function formatPrice(price: number): string {
  return `AED ${price.toFixed(2)}`;
}

// Format price from fils (integer) to AED display
export function formatAED(priceFils: number): string {
  return `AED ${(priceFils / 100).toFixed(2)}`;
}

// Get discount percentage
export function getDiscountPercentage(priceFils: number, compareAtFils: number): number {
  if (compareAtFils <= priceFils) return 0;
  return Math.round(((compareAtFils - priceFils) / compareAtFils) * 100);
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('en-AE');
}

// Get level info from XP
export function getLevelFromXP(xp: number): {
  level: number;
  title: string;
  color: string;
  xpForNext: number;
  progress: number;
  special?: boolean;
} {
  const LEVELS = [
    { level: 1,  title: "Newcomer",        xpRequired: 0,      color: "#94a3b8" },
    { level: 2,  title: "Explorer",        xpRequired: 500,    color: "#60a5fa" },
    { level: 3,  title: "Regular",         xpRequired: 1500,   color: "#34d399" },
    { level: 4,  title: "Enthusiast",      xpRequired: 3500,   color: "#a78bfa" },
    { level: 5,  title: "Connoisseur",     xpRequired: 7000,   color: "#d4b86a" },
    { level: 6,  title: "Trendsetter",     xpRequired: 12000,  color: "#c7a34d" },
    { level: 7,  title: "Tastemaker",      xpRequired: 20000,  color: "#a8863d" },
    { level: 8,  title: "Elite",           xpRequired: 35000,  color: "#363e42" },
    { level: 9,  title: "Legend",          xpRequired: 60000,  color: "#252a2d" },
    { level: 10, title: "Moulna Patron",   xpRequired: 100000, color: "#c7a34d", special: true },
  ];

  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
      break;
    }
  }

  const xpIntoCurrentLevel = xp - currentLevel.xpRequired;
  const xpNeededForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = xpNeededForNextLevel > 0
    ? Math.min((xpIntoCurrentLevel / xpNeededForNextLevel) * 100, 100)
    : 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    color: currentLevel.color,
    xpForNext: nextLevel.xpRequired - xp,
    progress,
    special: 'special' in currentLevel ? currentLevel.special : undefined,
  };
}

// Generate DiceBear avatar URL
export function getDiceBearAvatar(
  seed: string,
  style: string = 'adventurer',
  backgroundColor?: string,
  size: number = 128
): string {
  const params = new URLSearchParams({
    seed,
    size: size.toString(),
  });

  if (backgroundColor) {
    params.set('backgroundColor', backgroundColor.replace('#', ''));
  }

  return `https://api.dicebear.com/9.x/${style}/svg?${params.toString()}`;
}

// Available DiceBear styles by level
export const AVATAR_STYLES = {
  1: ["adventurer", "adventurer-neutral", "bottts", "thumbs"],
  3: ["lorelei", "lorelei-neutral", "avataaars", "avataaars-neutral"],
  5: ["big-ears", "big-ears-neutral", "micah", "open-peeps"],
  7: ["personas", "notionists", "notionists-neutral", "fun-emoji"],
  10: ["pixel-art", "pixel-art-neutral"],
} as const;

export function getAvailableAvatarStyles(level: number): string[] {
  const styles: string[] = [];
  for (const [lvl, avatarStyles] of Object.entries(AVATAR_STYLES)) {
    if (level >= parseInt(lvl)) {
      styles.push(...avatarStyles);
    }
  }
  return styles;
}

// Format date consistently (avoids SSR/client hydration mismatch)
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-AE', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
}

// Time ago helper
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return past.toLocaleDateString('en-AE', { month: 'short', day: 'numeric' });
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
