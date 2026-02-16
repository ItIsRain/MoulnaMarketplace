import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Noto_Sans_Arabic } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Moulna | UAE's Premier Handmade & Artisan Marketplace",
  description: "Discover unique handmade products from UAE's finest artisans and local brands. Shop, earn rewards, and support local creators.",
  keywords: ["handmade", "artisan", "UAE", "marketplace", "local brands", "handcrafted", "Dubai", "Abu Dhabi"],
  openGraph: {
    title: "Moulna | UAE's Premier Handmade & Artisan Marketplace",
    description: "Discover unique handmade products from UAE's finest artisans and local brands.",
    url: "https://moulna.ae",
    siteName: "Moulna",
    locale: "en_AE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${dmSans.variable} ${notoSansArabic.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
        <TooltipProvider delayDuration={300}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                toast: "bg-card border border-border shadow-lg",
                title: "text-foreground font-semibold",
                description: "text-muted-foreground",
              },
            }}
          />
        </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
