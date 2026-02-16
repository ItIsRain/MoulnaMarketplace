"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  shop: {
    title: "Shop",
    links: [
      { name: "All Categories", href: "/explore/categories" },
      { name: "Trending Now", href: "/explore/trending" },
      { name: "New Listings", href: "/explore/new-arrivals" },
      { name: "Gift Cards", href: "/gift-cards" },
    ],
  },
  sell: {
    title: "Sell",
    links: [
      { name: "Sell on Moulna", href: "/sell-with-us" },
      { name: "Pricing", href: "/pricing" },
    ],
  },
  about: {
    title: "About",
    links: [
      { name: "About Moulna", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Press", href: "/press" },
    ],
  },
  help: {
    title: "Help",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Dispute Resolution", href: "/legal/refund-policy" },
    ],
  },
};

const SOCIAL_LINKS = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/moulna_uae" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/moulna_uae" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/moulna" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@moulna" },
];

export function Footer() {
  return (
    <footer className="bg-moulna-charcoal text-white mt-auto">
      {/* Main Footer */}
      <div className="container-app py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo & Contact */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/moulna-logo.svg"
                alt="Moulna"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              Discover unique handmade products from UAE's finest artisans and local brands.
              Shop, earn rewards, and support local creators.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-moulna-gold" />
                <span>Dubai, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-moulna-gold" />
                <a href="mailto:hello@moulna.ae" className="hover:text-moulna-gold transition-colors">
                  hello@moulna.ae
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-moulna-gold" />
                <a href="tel:+97145551234" className="hover:text-moulna-gold transition-colors">
                  +971 4 555 1234
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 mt-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-moulna-gold flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold mb-3 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-moulna-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>© 2025 Moulna. All rights reserved.</span>
            <Link href="/legal/terms" className="hover:text-moulna-gold transition-colors">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-moulna-gold transition-colors">
              Privacy
            </Link>
            <Link href="/legal/cookies" className="hover:text-moulna-gold transition-colors">
              Cookies
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Language/Currency */}
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium">
                EN
              </button>
              <span className="text-moulna-gold font-medium">AED</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
