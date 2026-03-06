"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, formatAED, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Trophy, Gavel, Loader2, CheckCircle, XCircle,
  ChevronDown, ChevronUp, DollarSign, Clock, AlertTriangle,
  Zap, TrendingUp, Users, BarChart3
} from "lucide-react";

interface Bid {
  id: string;
  sellerId: string;
  shopName: string;
  shopSlug: string;
  amountFils: number;
  isBuyNow: boolean;
  status: string;
  headline: string | null;
  adminNotes: string | null;
  createdAt: string;
}

interface Auction {
  id: string;
  week_start: string;
  week_end: string;
  status: string;
  current_highest_bid_fils: number;
  total_bids: number;
  closes_at: string;
  winner_bid_id: string | null;
  bids: Bid[];
  winnerShopName: string | null;
  winnerAmountFils: number | null;
}

interface Stats {
  activeAuctions: number;
  pendingApprovals: number;
  totalRevenue: number;
  avgWinningBid: number;
}

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "open", label: "Open" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const REJECT_REASONS = [
  "Inappropriate content",
  "Policy violation",
  "Duplicate account",
  "Suspicious activity",
  "Other",
];

export default function AdminSotwPage() {
  const [auctions, setAuctions] = React.useState<Auction[]>([]);
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [statusCounts, setStatusCounts] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("all");
  const [expandedAuction, setExpandedAuction] = React.useState<string | null>(null);

  // Approve dialog
  const [approveDialog, setApproveDialog] = React.useState<Bid | null>(null);
  const [approving, setApproving] = React.useState(false);

  // Reject dialog
  const [rejectDialog, setRejectDialog] = React.useState<Bid | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");
  const [rejectNotes, setRejectNotes] = React.useState("");
  const [rejecting, setRejecting] = React.useState(false);

  const [toast, setToast] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchAuctions = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`/api/admin/sotw${params}`);
      const data = await res.json();
      setAuctions(data.auctions || []);
      setStats(data.stats || null);
      setStatusCounts(data.statusCounts || {});
    } catch {
      setToast({ type: "error", message: "Failed to load auctions" });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  React.useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleApprove = async () => {
    if (!approveDialog) return;
    setApproving(true);

    try {
      const res = await fetch("/api/admin/sotw/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidId: approveDialog.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: data.error || "Approval failed" });
      } else if (data.chargeStatus === "failed") {
        setToast({ type: "error", message: "Card charge failed. Cascading to next bidder." });
      } else {
        setToast({ type: "success", message: "Bid approved and charged successfully!" });
      }

      setApproveDialog(null);
      fetchAuctions();
    } catch {
      setToast({ type: "error", message: "Failed to approve" });
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog || !rejectReason) return;
    setRejecting(true);

    try {
      const res = await fetch("/api/admin/sotw/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidId: rejectDialog.id,
          reason: rejectReason,
          notes: rejectNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: data.error || "Rejection failed" });
      } else {
        setToast({
          type: "success",
          message: data.cascaded
            ? "Bid rejected. Next highest bidder promoted."
            : "Bid rejected. No remaining bidders — auction cancelled.",
        });
      }

      setRejectDialog(null);
      setRejectReason("");
      setRejectNotes("");
      fetchAuctions();
    } catch {
      setToast({ type: "error", message: "Failed to reject" });
    } finally {
      setRejecting(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "open": return <Badge variant="active">Open</Badge>;
      case "pending_approval": return <Badge variant="warning">Pending Approval</Badge>;
      case "completed": return <Badge variant="success">Completed</Badge>;
      case "cancelled": return <Badge variant="secondary">Cancelled</Badge>;
      case "bought_out": return <Badge variant="gold">Bought Out</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const bidStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge variant="active" className="text-xs">Active</Badge>;
      case "outbid": return <Badge variant="secondary" className="text-xs">Outbid</Badge>;
      case "pending_approval": return <Badge variant="warning" className="text-xs">Pending</Badge>;
      case "charged": return <Badge variant="success" className="text-xs">Charged</Badge>;
      case "charge_failed": return <Badge variant="destructive" className="text-xs">Charge Failed</Badge>;
      case "rejected": return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
      default: return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const statCards = [
    { label: "Active Auctions", value: String(stats?.activeAuctions || 0), icon: Gavel, gradient: "from-blue-500/10 to-blue-600/5", color: "text-blue-500" },
    { label: "Pending Approvals", value: String(stats?.pendingApprovals || 0), icon: Clock, gradient: "from-amber-500/10 to-amber-600/5", color: "text-amber-500" },
    { label: "Total SOTW Revenue", value: formatAED(stats?.totalRevenue || 0), icon: DollarSign, gradient: "from-green-500/10 to-green-600/5", color: "text-green-500" },
    { label: "Avg Winning Bid", value: formatAED(stats?.avgWinningBid || 0), icon: TrendingUp, gradient: "from-yellow-500/10 to-yellow-600/5", color: "text-moulna-gold" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-moulna-gold" />
          SOTW Auctions
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage Seller of the Week auctions, approve winners, and review bids.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={cn("border-border/60 shadow-sm p-4 bg-gradient-to-br", stat.gradient)}>
              <div className="flex items-center gap-2.5 mb-2">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-xl font-semibold tabular-nums">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={filter === tab.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(tab.value)}
            className={cn(
              "text-[13px]",
              filter === tab.value && "bg-moulna-gold hover:bg-moulna-gold-dark"
            )}
          >
            {tab.label}
            {statusCounts[tab.value] !== undefined && (
              <span className="ms-1 text-xs opacity-70">({statusCounts[tab.value]})</span>
            )}
          </Button>
        ))}
      </div>

      {/* Auctions Table */}
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : auctions.length === 0 ? (
        <Card className="border-border/60 shadow-sm p-12 text-center">
          <Trophy className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-sm font-semibold mb-1">No auctions found</h3>
          <p className="text-[13px] text-muted-foreground">
            Auctions are created automatically for upcoming weeks.
          </p>
        </Card>
      ) : (
        <Card className="border-border/60 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground">Week</th>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground">Highest Bid</th>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground">Bids</th>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground">Winner</th>
                  <th className="text-start px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {auctions.map((auction, idx) => {
                  const isExpanded = expandedAuction === auction.id;
                  const pendingBid = auction.bids.find((b) => b.status === "pending_approval");
                  const isPendingRow = auction.status === "pending_approval" || auction.status === "bought_out";

                  return (
                    <React.Fragment key={auction.id}>
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={cn(
                          "border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors",
                          isPendingRow && "bg-amber-50/50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">{auction.week_start}</p>
                          <p className="text-xs text-muted-foreground">
                            to {auction.week_end}
                          </p>
                        </td>
                        <td className="px-4 py-3">{statusBadge(auction.status)}</td>
                        <td className="px-4 py-3 font-medium tabular-nums">
                          {auction.current_highest_bid_fils > 0
                            ? formatAED(auction.current_highest_bid_fils)
                            : "—"}
                        </td>
                        <td className="px-4 py-3 tabular-nums">{auction.total_bids}</td>
                        <td className="px-4 py-3">
                          {auction.winnerShopName ? (
                            <div>
                              <p className="font-medium">{auction.winnerShopName}</p>
                              {auction.winnerAmountFils && (
                                <p className="text-xs text-moulna-gold tabular-nums">{formatAED(auction.winnerAmountFils)}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {pendingBid && (
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                                onClick={() => setApproveDialog(pendingBid)}
                              >
                                <CheckCircle className="w-3.5 h-3.5 me-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 h-7 text-xs"
                                onClick={() => setRejectDialog(pendingBid)}
                              >
                                <XCircle className="w-3.5 h-3.5 me-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {auction.bids.length > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                setExpandedAuction(isExpanded ? null : auction.id)
                              }
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </td>
                      </motion.tr>

                      {/* Expanded bids */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-0">
                            <div className="bg-muted/20 px-5 py-4 border-b border-border/40">
                              <h4 className="font-medium text-[13px] mb-3 flex items-center gap-2 text-muted-foreground">
                                <Gavel className="w-3.5 h-3.5" />
                                All Bids ({auction.bids.length})
                              </h4>
                              <div className="space-y-1.5">
                                {auction.bids.map((bid) => (
                                  <div
                                    key={bid.id}
                                    className={cn(
                                      "flex items-center justify-between p-3 rounded-lg bg-background border border-border/60 text-[13px]",
                                      bid.status === "pending_approval" && "border-amber-300 bg-amber-50/50"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div>
                                        <p className="font-medium">
                                          {bid.shopName}
                                          {bid.isBuyNow && (
                                            <Zap className="w-3.5 h-3.5 text-amber-500 inline ms-1" />
                                          )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {timeAgo(bid.createdAt)}
                                          {bid.headline && ` · "${bid.headline}"`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {bidStatusBadge(bid.status)}
                                      <span className="font-semibold tabular-nums">
                                        {formatAED(bid.amountFils)}
                                      </span>
                                      {bid.status === "pending_approval" && (
                                        <div className="flex gap-1">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-green-600 hover:bg-green-50 h-7 w-7 p-0"
                                            onClick={() => setApproveDialog(bid)}
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-600 hover:bg-red-50 h-7 w-7 p-0"
                                            onClick={() => setRejectDialog(bid)}
                                          >
                                            <XCircle className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Approve Dialog */}
      <Dialog open={!!approveDialog} onOpenChange={(v) => !v && setApproveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Approve SOTW Winner
            </DialogTitle>
            <DialogDescription>
              This will charge the seller&apos;s card and activate their Seller of the Week feature.
            </DialogDescription>
          </DialogHeader>

          {approveDialog && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">{approveDialog.shopName}</span>
                <span className="font-bold text-moulna-gold">
                  {formatAED(approveDialog.amountFils)}
                </span>
              </div>
              {approveDialog.isBuyNow && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <Zap className="w-4 h-4" />
                  Buy Now purchase
                </div>
              )}
              <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
                <strong>This will charge {formatAED(approveDialog.amountFils)}</strong> to
                the seller&apos;s saved card. This action cannot be undone.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialog(null)}
              disabled={approving}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
              disabled={approving}
            >
              {approving ? (
                <>
                  <Loader2 className="w-4 h-4 me-2 animate-spin" />
                  Charging...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 me-2" />
                  Confirm & Charge
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={(v) => !v && setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Reject SOTW Winner
            </DialogTitle>
            <DialogDescription>
              The next highest bidder will be notified and promoted.
            </DialogDescription>
          </DialogHeader>

          {rejectDialog && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">{rejectDialog.shopName}</span>
                <span className="font-bold">{formatAED(rejectDialog.amountFils)}</span>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Reason *</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a reason...</option>
                  {REJECT_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  placeholder="Additional details..."
                  rows={3}
                />
              </div>

              <div className="p-3 bg-moulna-charcoal text-white/80 rounded-lg text-sm border border-moulna-charcoal-light/30">
                The next highest bidder will automatically be notified and promoted to pending approval.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setRejectDialog(null); setRejectReason(""); setRejectNotes(""); }}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejecting || !rejectReason}
            >
              {rejecting ? (
                <>
                  <Loader2 className="w-4 h-4 me-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 me-2" />
                  Reject & Cascade
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
