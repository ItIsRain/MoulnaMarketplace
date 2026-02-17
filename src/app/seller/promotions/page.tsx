"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Rocket, Trophy, TrendingUp, Eye, MousePointerClick,
  Plus, Loader2, Calendar, Clock, Package
} from "lucide-react";

interface Boost {
  id: string;
  product_id: string;
  duration_days: number;
  total_fils: number;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  impressions: number;
  clicks: number;
  created_at: string;
  products: {
    id: string;
    title: string;
    slug: string;
    images: string[];
    price_fils: number;
    status: string;
  };
}

export default function SellerPromotionsPage() {
  const [boosts, setBoosts] = React.useState<Boost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<string>("all");

  React.useEffect(() => {
    const params = filter !== "all" ? `?status=${filter}` : "";
    fetch(`/api/ads/boost/my-boosts${params}`)
      .then((res) => res.json())
      .then((data) => setBoosts(data.boosts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const activeBoosts = boosts.filter((b) => b.status === "active");
  const totalSpend = boosts
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.total_fils, 0);
  const totalImpressions = boosts.reduce((sum, b) => sum + b.impressions, 0);
  const totalClicks = boosts.reduce((sum, b) => sum + b.clicks, 0);

  const stats = [
    { label: "Active Boosts", value: String(activeBoosts.length), icon: Rocket, color: "text-green-500" },
    { label: "Total Spend", value: formatAED(totalSpend), icon: TrendingUp, color: "text-moulna-gold" },
    { label: "Impressions", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-blue-500" },
    { label: "Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-purple-500" },
  ];

  const statusVariant = (status: string) => {
    switch (status) {
      case "active": return "active" as const;
      case "expired": return "secondary" as const;
      case "pending": return "pending" as const;
      case "cancelled": return "destructive" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Promotions & Ads</h1>
          <p className="text-muted-foreground">
            Boost your products and get featured on Moulna
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/seller/promotions/seller-of-week">
              <Trophy className="w-4 h-4 me-2" />
              Seller of the Week
            </Link>
          </Button>
          <Button className="bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
            <Link href="/seller/promotions/new">
              <Plus className="w-4 h-4 me-2" />
              Boost a Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/seller/promotions/new">
          <Card className="p-6 hover:border-moulna-gold/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-moulna-gold/10">
                <Rocket className="w-8 h-8 text-moulna-gold" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Product Boost</h3>
                <p className="text-sm text-muted-foreground">
                  Place your product at the top of explore &amp; search results with a &quot;Sponsored&quot; badge.
                  Starting from AED 15/day.
                </p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/seller/promotions/seller-of-week">
          <Card className="p-6 hover:border-moulna-gold/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-100">
                <Trophy className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Seller of the Week</h3>
                <p className="text-sm text-muted-foreground">
                  Get your shop featured on the Moulna homepage for an entire week.
                  Starting from AED 99 &middot; Bid or Buy Now.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Boosts List */}
      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Product Boosts</h2>
          <div className="flex gap-2">
            {["all", "active", "pending", "expired"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(f)}
                className={cn(filter === f && "bg-moulna-gold hover:bg-moulna-gold-dark")}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : boosts.length === 0 ? (
          <div className="p-12 text-center">
            <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No boosts yet</h3>
            <p className="text-muted-foreground mb-4">
              Boost your first product to reach more customers
            </p>
            <Button className="bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
              <Link href="/seller/promotions/new">
                <Plus className="w-4 h-4 me-2" />
                Create Your First Boost
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-start p-4 font-medium">Product</th>
                  <th className="text-start p-4 font-medium">Duration</th>
                  <th className="text-start p-4 font-medium">Cost</th>
                  <th className="text-start p-4 font-medium">Performance</th>
                  <th className="text-start p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {boosts.map((boost, index) => (
                  <motion.tr
                    key={boost.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden relative flex-shrink-0">
                          {boost.products?.images?.[0] ? (
                            <img
                              src={boost.products.images[0]}
                              alt={boost.products.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 m-auto text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{boost.products?.title || "—"}</p>
                          <p className="text-xs text-muted-foreground">{boost.duration_days} days</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {boost.starts_at ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(boost.starts_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {boost.ends_at && new Date(boost.ends_at).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Awaiting payment</span>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{formatAED(boost.total_fils)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          {boost.impressions.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointerClick className="w-3.5 h-3.5 text-purple-500" />
                          {boost.clicks}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariant(boost.status)}>
                        {boost.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
