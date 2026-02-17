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
  MessageSquare, Search, Eye, Download, Calendar,
  CheckCircle, Clock, AlertCircle, Archive, Loader2, ShoppingBag
} from "lucide-react";

interface InquiryBuyer {
  name: string;
  avatarSeed: string;
  avatarStyle: string;
}

interface InquirySeller {
  name: string;
  avatarSeed: string;
  avatarStyle: string;
}

interface Inquiry {
  id: string;
  buyer: InquiryBuyer;
  seller: InquirySeller;
  product: string;
  status: "new" | "replied" | "sold" | "archived";
  lastMessage: string;
  salePriceFils: number;
  createdAt: string;
}

interface StatusCounts {
  all: number;
  new: number;
  replied: number;
  sold: number;
  archived: number;
}

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { id: "all", label: "All Inquiries" },
  { id: "new", label: "New" },
  { id: "replied", label: "Replied" },
  { id: "sold", label: "Sold" },
  { id: "archived", label: "Archived" },
];

const STATUS_STYLES = {
  new: { bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
  replied: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  sold: { bg: "bg-purple-100", text: "text-purple-700", icon: ShoppingBag },
  archived: { bg: "bg-gray-100", text: "text-gray-700", icon: Archive },
};

export default function AdminInquiriesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [statusCounts, setStatusCounts] = React.useState<StatusCounts>({
    all: 0,
    new: 0,
    replied: 0,
    sold: 0,
    archived: 0,
  });
  const [page, setPage] = React.useState(1);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  React.useEffect(() => {
    let cancelled = false;

    async function fetchInquiries() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/stats?section=inquiries&page=${page}&status=${selectedStatus}`
        );
        if (!res.ok) throw new Error("Failed to fetch inquiries");
        const data = await res.json();
        if (cancelled) return;
        setInquiries(data.inquiries ?? []);
        setTotalCount(data.totalCount ?? 0);
        setStatusCounts(data.statusCounts ?? {
          all: 0,
          new: 0,
          replied: 0,
          sold: 0,
          archived: 0,
        });
      } catch (err) {
        console.error("Error fetching inquiries:", err);
        if (!cancelled) {
          setInquiries([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInquiries();
    return () => { cancelled = true; };
  }, [page, selectedStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Inquiry Management</h1>
          </div>
          <p className="text-muted-foreground">
            Monitor and moderate marketplace inquiries
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 me-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : statusCounts.all.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Inquiries</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : statusCounts.new.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">New</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : statusCounts.replied.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Replied</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : statusCounts.sold.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Sold</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : statusCounts.archived.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Archived</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by inquiry ID, buyer, or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedStatus === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => { setSelectedStatus(option.id); setPage(1); }}
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

      {/* Inquiries Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-start p-4 font-medium">Inquiry ID</th>
                <th className="text-start p-4 font-medium">Buyer</th>
                <th className="text-start p-4 font-medium">Seller</th>
                <th className="text-start p-4 font-medium">Product</th>
                <th className="text-start p-4 font-medium">Status</th>
                <th className="text-end p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
                      <p className="text-muted-foreground">Loading inquiries...</p>
                    </div>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-8 h-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No inquiries found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry, index) => {
                  const statusStyle = STATUS_STYLES[inquiry.status];
                  const StatusIcon = statusStyle?.icon || Clock;

                  return (
                    <motion.tr
                      key={inquiry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-mono font-medium">
                            {inquiry.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(inquiry.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <DiceBearAvatar
                            seed={inquiry.buyer.avatarSeed}
                            style={inquiry.buyer.avatarStyle}
                            size="sm"
                          />
                          <span className="text-sm font-medium">{inquiry.buyer.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <DiceBearAvatar
                            seed={inquiry.seller.avatarSeed}
                            style={inquiry.seller.avatarStyle}
                            size="sm"
                          />
                          <span className="text-sm">{inquiry.seller.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{inquiry.product}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={cn(statusStyle?.bg, statusStyle?.text)}>
                          <StatusIcon className="w-3 h-3 me-1" />
                          {inquiry.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
