"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Store, Search, Filter, Star, CheckCircle, XCircle, Clock,
  Eye, Edit, Ban, Download, Package, Users,
  Calendar, MapPin, TrendingUp, Award, Loader2, ChevronLeft, ChevronRight
} from "lucide-react";

interface Seller {
  id: string;
  name: string;
  slug: string;
  avatarStyle: string;
  avatarSeed: string;
  logoUrl: string | null;
  email: string;
  location: string;
  kycStatus: string;
  status: string;
  totalListings: number;
  followerCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

interface StatusCounts {
  all: number;
  active: number;
  pending: number;
  suspended: number;
}

const STATUS_OPTIONS = [
  { id: "all", label: "All Sellers" },
  { id: "active", label: "Verified" },
  { id: "pending", label: "Pending" },
  { id: "suspended", label: "Suspended" },
];

const ITEMS_PER_PAGE = 12;

export default function AdminSellersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [sellers, setSellers] = React.useState<Seller[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [statusCounts, setStatusCounts] = React.useState<StatusCounts>({
    all: 0,
    active: 0,
    pending: 0,
    suspended: 0,
  });
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSellers = React.useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/admin/sellers?page=${page}&status=${selectedStatus}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch sellers");
      const data = await res.json();
      setSellers(data.sellers ?? []);
      setTotalCount(data.totalCount ?? 0);
      setStatusCounts(
        data.statusCounts ?? { all: 0, active: 0, pending: 0, suspended: 0 }
      );
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setSellers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, selectedStatus, searchQuery]);

  React.useEffect(() => {
    let cancelled = false;

    fetchSellers().then(() => {
      if (cancelled) return;
    });

    return () => {
      cancelled = true;
    };
  }, [fetchSellers]);

  async function handleSellerAction(
    shopId: string,
    action: "approve" | "reject" | "suspend" | "reactivate"
  ) {
    setActionLoading(shopId);
    try {
      const res = await fetch("/api/admin/sellers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId, action }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }
      await fetchSellers();
    } catch (err) {
      console.error("Seller action error:", err);
    } finally {
      setActionLoading(null);
    }
  }

  function handleExport() {
    const headers = ["Name", "Email", "Status", "Listings", "Followers", "Rating", "Location", "Joined"];
    const rows = sellers.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      s.status,
      String(s.totalListings),
      String(s.followerCount),
      String(s.rating ?? ""),
      `"${(s.location || "").replace(/"/g, '""')}"`,
      s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sellers-export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const statCards = [
    {
      label: "Total Sellers",
      value: statusCounts.all,
      icon: Store,
      color: "text-blue-500",
    },
    {
      label: "Verified",
      value: statusCounts.active,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      label: "Pending Review",
      value: statusCounts.pending,
      icon: Clock,
      color: "text-amber-500",
    },
    {
      label: "Artisan Program",
      value: 0,
      icon: Award,
      color: "text-violet-500",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-semibold text-foreground">
            Seller Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review and manage marketplace sellers
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-xs" onClick={handleExport}>
          <Download className="w-4 h-4 me-1.5" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="px-4 py-3 border-border/60 shadow-sm">
              <div className="flex items-center gap-3">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                <div className="flex items-baseline gap-2 flex-1">
                  <span className="text-lg font-bold tabular-nums">
                    {stat.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {stat.label}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/60 shadow-sm">
        <div className="px-5 py-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10 h-9 text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedStatus === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(option.id)}
                className={cn(
                  "text-xs h-9",
                  selectedStatus === option.id &&
                    "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-7 h-7 animate-spin text-moulna-gold mb-3" />
          <p className="text-sm text-muted-foreground">Loading sellers...</p>
        </div>
      ) : sellers.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20">
          <Store className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <h3 className="text-sm font-semibold mb-0.5">No sellers found</h3>
          <p className="text-xs text-muted-foreground">
            {selectedStatus !== "all"
              ? `There are no ${selectedStatus} sellers at the moment.`
              : "No sellers have registered yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Sellers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellers.map((seller, index) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-border/60 shadow-sm hover:border-moulna-gold/30 transition-colors">
                  {/* Header */}
                  <div className="px-5 pt-5 pb-4 border-b border-border/60">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <DiceBearAvatar
                          seed={seller.avatarSeed}
                          style={seller.avatarStyle}
                          size="lg"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold truncate">
                            {seller.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {seller.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "text-[11px] flex-shrink-0",
                          seller.status === "active" &&
                            "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
                          seller.status === "pending" &&
                            "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                          seller.status === "suspended" &&
                            "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        )}
                      >
                        {seller.status === "active" && (
                          <CheckCircle className="w-3 h-3 me-1" />
                        )}
                        {seller.status === "pending" && (
                          <Clock className="w-3 h-3 me-1" />
                        )}
                        {seller.status === "suspended" && (
                          <XCircle className="w-3 h-3 me-1" />
                        )}
                        {seller.status === "active" ? "verified" : seller.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-5 py-3 border-b border-border/60">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-[13px] font-bold tabular-nums">
                            {seller.rating || "-"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {seller.reviewCount} reviews
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-bold tabular-nums">
                          {seller.totalListings}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Products</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-bold tabular-nums">
                          {seller.followerCount.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Followers</p>
                      </div>
                    </div>
                  </div>

                  {/* Meta + Actions */}
                  <div className="px-5 py-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {seller.location || "Unknown"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(seller.createdAt)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-8" asChild>
                        <Link href={`/shops/${seller.slug}`}>
                          <Eye className="w-3.5 h-3.5 me-1" />
                          View
                        </Link>
                      </Button>
                      {seller.status === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-xs h-8"
                            disabled={actionLoading === seller.id}
                            onClick={() => handleSellerAction(seller.id, "approve")}
                          >
                            {actionLoading === seller.id ? (
                              <Loader2 className="w-3.5 h-3.5 me-1 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5 me-1" />
                            )}
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 text-xs h-8"
                            disabled={actionLoading === seller.id}
                            onClick={() => handleSellerAction(seller.id, "reject")}
                          >
                            {actionLoading === seller.id ? (
                              <Loader2 className="w-3.5 h-3.5 me-1 animate-spin" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 me-1" />
                            )}
                            Reject
                          </Button>
                        </>
                      ) : seller.status === "suspended" ? (
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-xs h-8"
                          disabled={actionLoading === seller.id}
                          onClick={() => handleSellerAction(seller.id, "reactivate")}
                        >
                          {actionLoading === seller.id ? (
                            <Loader2 className="w-3.5 h-3.5 me-1 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 me-1" />
                          )}
                          Reactivate
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 text-xs h-8"
                          disabled={actionLoading === seller.id}
                          onClick={() => handleSellerAction(seller.id, "suspend")}
                        >
                          {actionLoading === seller.id ? (
                            <Loader2 className="w-3.5 h-3.5 me-1 animate-spin" />
                          ) : (
                            <Ban className="w-3.5 h-3.5 me-1" />
                          )}
                          Suspend
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="text-xs h-8"
              >
                <ChevronLeft className="w-3.5 h-3.5 me-1" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="text-xs h-8"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ms-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
