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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

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
  const [selectedInquiry, setSelectedInquiry] = React.useState<Inquiry | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const filteredInquiries = React.useMemo(() => {
    if (!searchQuery.trim()) return inquiries;
    const q = searchQuery.toLowerCase();
    return inquiries.filter(
      (inq) =>
        inq.id.toLowerCase().includes(q) ||
        inq.buyer.name.toLowerCase().includes(q) ||
        inq.seller.name.toLowerCase().includes(q) ||
        inq.product.toLowerCase().includes(q)
    );
  }, [inquiries, searchQuery]);

  const handleExport = React.useCallback(() => {
    const header = "ID,Buyer,Seller,Product,Status,Date";
    const rows = inquiries.map((inq) =>
      [
        inq.id,
        `"${inq.buyer.name.replace(/"/g, '""')}"`,
        `"${inq.seller.name.replace(/"/g, '""')}"`,
        `"${inq.product.replace(/"/g, '""')}"`,
        inq.status,
        inq.createdAt,
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [inquiries]);

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
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-moulna-gold" />
            <h1 className="text-xl font-display font-semibold text-foreground">Inquiry Management</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor and moderate marketplace inquiries
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 me-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Inquiries", value: statusCounts.all, color: "" },
          { label: "New", value: statusCounts.new, color: "text-blue-600" },
          { label: "Replied", value: statusCounts.replied, color: "text-green-600" },
          { label: "Sold", value: statusCounts.sold, color: "text-purple-600" },
          { label: "Archived", value: statusCounts.archived, color: "text-gray-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 shadow-sm px-5 py-4">
            <p className={cn("text-lg font-semibold tabular-nums", stat.color)}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stat.value.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/60 shadow-sm px-5 py-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by inquiry ID, buyer, or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedStatus === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => { setSelectedStatus(option.id); setPage(1); }}
                className={cn(
                  "text-xs",
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
      <Card className="border-border/60 shadow-sm">
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <h2 className="text-sm font-semibold text-foreground">Inquiries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-start px-5 py-3 font-medium text-muted-foreground">Inquiry ID</th>
                <th className="text-start px-5 py-3 font-medium text-muted-foreground">Buyer</th>
                <th className="text-start px-5 py-3 font-medium text-muted-foreground">Seller</th>
                <th className="text-start px-5 py-3 font-medium text-muted-foreground">Product</th>
                <th className="text-start px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-end px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-moulna-gold" />
                      <p className="text-sm text-muted-foreground">Loading inquiries...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No inquiries found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry, index) => {
                  const statusStyle = STATUS_STYLES[inquiry.status];
                  const StatusIcon = statusStyle?.icon || Clock;

                  return (
                    <motion.tr
                      key={inquiry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-5 py-3">
                        <p className="font-mono font-medium tabular-nums">
                          {inquiry.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(inquiry.createdAt)}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <DiceBearAvatar
                            seed={inquiry.buyer.avatarSeed}
                            style={inquiry.buyer.avatarStyle}
                            size="sm"
                          />
                          <span className="font-medium">{inquiry.buyer.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <DiceBearAvatar
                            seed={inquiry.seller.avatarSeed}
                            style={inquiry.seller.avatarStyle}
                            size="sm"
                          />
                          <span>{inquiry.seller.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span>{inquiry.product}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={cn("text-xs", statusStyle?.bg, statusStyle?.text)}>
                          <StatusIcon className="w-3 h-3 me-1" />
                          {inquiry.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedInquiry(inquiry)}>
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
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/60">
          <p className="text-xs text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => { if (!open) setSelectedInquiry(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (() => {
            const statusStyle = STATUS_STYLES[selectedInquiry.status];
            const StatusIcon = statusStyle?.icon || Clock;
            return (
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono font-medium">{selectedInquiry.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Buyer</span>
                  <div className="flex items-center gap-2">
                    <DiceBearAvatar seed={selectedInquiry.buyer.avatarSeed} style={selectedInquiry.buyer.avatarStyle} size="sm" />
                    <span className="font-medium">{selectedInquiry.buyer.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Seller</span>
                  <div className="flex items-center gap-2">
                    <DiceBearAvatar seed={selectedInquiry.seller.avatarSeed} style={selectedInquiry.seller.avatarStyle} size="sm" />
                    <span className="font-medium">{selectedInquiry.seller.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span>{selectedInquiry.product}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={cn("text-xs", statusStyle?.bg, statusStyle?.text)}>
                    <StatusIcon className="w-3 h-3 me-1" />
                    {selectedInquiry.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(selectedInquiry.createdAt)}
                  </span>
                </div>
                {selectedInquiry.lastMessage && (
                  <div>
                    <span className="text-muted-foreground block mb-1">Last Message</span>
                    <p className="bg-muted/50 rounded-md px-3 py-2 text-foreground">{selectedInquiry.lastMessage}</p>
                  </div>
                )}
                {selectedInquiry.status === "sold" && selectedInquiry.salePriceFils > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sale Price</span>
                    <span className="font-semibold text-purple-600">
                      {(selectedInquiry.salePriceFils / 100).toFixed(2)} AED
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
