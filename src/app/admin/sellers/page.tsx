"use client";

import * as React from "react";
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

  React.useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchSellers() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/sellers?page=${page}&status=${selectedStatus}`
        );
        if (!res.ok) throw new Error("Failed to fetch sellers");
        const data = await res.json();
        if (cancelled) return;
        setSellers(data.sellers ?? []);
        setTotalCount(data.totalCount ?? 0);
        setStatusCounts(
          data.statusCounts ?? { all: 0, active: 0, pending: 0, suspended: 0 }
        );
      } catch (err) {
        console.error("Error fetching sellers:", err);
        if (!cancelled) {
          setSellers([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSellers();
    return () => {
      cancelled = true;
    };
  }, [page, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Seller Management</h1>
          </div>
          <p className="text-muted-foreground">
            Review and manage marketplace sellers
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 me-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{statusCounts.all}</p>
              <p className="text-sm text-muted-foreground">Total Sellers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{statusCounts.active}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">{statusCounts.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Artisan Program</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedStatus === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(option.id)}
                className={cn(
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
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-moulna-gold mb-4" />
          <p className="text-muted-foreground">Loading sellers...</p>
        </div>
      ) : sellers.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24">
          <Store className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No sellers found</h3>
          <p className="text-muted-foreground text-sm">
            {selectedStatus !== "all"
              ? `There are no ${selectedStatus} sellers at the moment.`
              : "No sellers have registered yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Sellers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller, index) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <DiceBearAvatar
                        seed={seller.avatarSeed}
                        style={seller.avatarStyle}
                        size="lg"
                      />
                      <div>
                        <h3 className="font-semibold">{seller.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {seller.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        seller.status === "active" &&
                          "bg-green-100 text-green-700",
                        seller.status === "pending" &&
                          "bg-yellow-100 text-yellow-700",
                        seller.status === "suspended" &&
                          "bg-red-100 text-red-700"
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

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">
                          {seller.rating || "-"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {seller.reviewCount} reviews
                      </p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold">{seller.totalListings}</p>
                      <p className="text-xs text-muted-foreground">Products</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="font-bold">
                        {seller.followerCount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {seller.location || "Unknown"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(seller.createdAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 me-1" />
                      View
                    </Button>
                    {seller.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 me-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 me-1" />
                          Reject
                        </Button>
                      </>
                    ) : seller.status === "suspended" ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 me-1" />
                        Reactivate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600"
                      >
                        <Ban className="w-4 h-4 me-1" />
                        Suspend
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="w-4 h-4 me-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ms-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
