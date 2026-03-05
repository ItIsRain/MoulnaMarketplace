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
  Flag, Search, CheckCircle, Clock, AlertTriangle,
  Package, Loader2, Eye, Store, Users, MessageSquare,
  XCircle, ShieldCheck
} from "lucide-react";

interface ReportReporter {
  name: string;
  avatarSeed: string | null;
  avatarStyle: string | null;
}

interface Report {
  id: string;
  reporter: ReportReporter;
  targetType: "product" | "shop" | "user" | "message";
  targetId: string;
  targetName: string;
  reason: string;
  description: string | null;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  priority: "low" | "normal" | "high" | "urgent";
  adminNotes: string | null;
  createdAt: string;
}

interface StatusCounts {
  pending: number;
  investigating: number;
  resolved: number;
  dismissed: number;
  highPriority: number;
  resolvedThisMonth: number;
}

const STATUS_OPTIONS = [
  { id: "all", label: "All Reports" },
  { id: "pending", label: "Pending" },
  { id: "investigating", label: "Investigating" },
  { id: "resolved", label: "Resolved" },
  { id: "dismissed", label: "Dismissed" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
  investigating: { bg: "bg-blue-100", text: "text-blue-700", icon: Eye },
  resolved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  dismissed: { bg: "bg-gray-100", text: "text-gray-700", icon: XCircle },
};

const TARGET_ICONS: Record<string, typeof Package> = {
  product: Package,
  shop: Store,
  user: Users,
  message: MessageSquare,
};

const PAGE_SIZE = 20;

export default function AdminReportsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [statusCounts, setStatusCounts] = React.useState<StatusCounts>({
    pending: 0,
    investigating: 0,
    resolved: 0,
    dismissed: 0,
    highPriority: 0,
    resolvedThisMonth: 0,
  });
  const [page, setPage] = React.useState(1);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Client-side search filter
  const filteredReports = React.useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const q = searchQuery.toLowerCase();
    return reports.filter(
      (r) =>
        r.reporter.name.toLowerCase().includes(q) ||
        r.targetName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }, [reports, searchQuery]);

  const fetchReports = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/reports?page=${page}&status=${selectedStatus}`
      );
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReports(data.reports ?? []);
      setTotalCount(data.totalCount ?? 0);
      setStatusCounts(data.statusCounts ?? {
        pending: 0, investigating: 0, resolved: 0, dismissed: 0,
        highPriority: 0, resolvedThisMonth: 0,
      });
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedStatus]);

  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  React.useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    setUpdatingId(reportId);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status: newStatus }),
      });
      if (res.ok) {
        fetchReports();
      }
    } catch (err) {
      console.error("Failed to update report:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-moulna-gold" />
          <h1 className="text-xl font-display font-semibold text-foreground">Reports & Moderation</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review and handle reported content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Open Reports", value: statusCounts.pending + statusCounts.investigating, icon: Flag, color: "text-red-500" },
          { label: "High Priority", value: statusCounts.highPriority, icon: AlertTriangle, color: "text-amber-500" },
          { label: "Investigating", value: statusCounts.investigating, icon: Clock, color: "text-blue-500" },
          { label: "Resolved (Month)", value: statusCounts.resolvedThisMonth, icon: CheckCircle, color: "text-emerald-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 shadow-sm px-4 py-3">
            <div className="flex items-center gap-3">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <div>
                <p className="text-lg font-bold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/60 shadow-sm px-4 py-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
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
                onClick={() => setSelectedStatus(option.id)}
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

      {/* Reports Table */}
      <Card className="border-border/60 shadow-sm">
        <div className="px-5 pt-5 pb-4 border-b border-border/60 flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Flag className="w-4 h-4 text-moulna-gold" />
            Reports
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {totalCount} total
          </span>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-moulna-gold" />
            <p className="text-xs text-muted-foreground">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-muted-foreground/50" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No reports</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              {selectedStatus !== "all"
                ? `No ${selectedStatus} reports at the moment.`
                : "When users report products, sellers, or content, those reports will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-start px-5 py-3 text-xs font-medium text-muted-foreground">Reporter</th>
                    <th className="text-start px-5 py-3 text-xs font-medium text-muted-foreground">Target</th>
                    <th className="text-start px-5 py-3 text-xs font-medium text-muted-foreground">Reason</th>
                    <th className="text-start px-5 py-3 text-xs font-medium text-muted-foreground">Priority</th>
                    <th className="text-start px-5 py-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-start px-5 py-3 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-end px-5 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => {
                    const statusStyle = STATUS_STYLES[report.status];
                    const StatusIcon = statusStyle?.icon || Clock;
                    const TargetIcon = TARGET_ICONS[report.targetType] || Package;

                    return (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <DiceBearAvatar
                              seed={report.reporter.avatarSeed || "user"}
                              style={report.reporter.avatarStyle || "adventurer"}
                              size="sm"
                            />
                            <span className="text-[13px] font-medium">{report.reporter.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <TargetIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <div>
                              <p className="text-[13px] font-medium truncate max-w-[180px]">{report.targetName}</p>
                              <p className="text-[11px] text-muted-foreground capitalize">{report.targetType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-[13px] capitalize">{report.reason.replace("_", " ")}</span>
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[11px] capitalize",
                              report.priority === "urgent" && "bg-red-100 text-red-700",
                              report.priority === "high" && "bg-amber-100 text-amber-700",
                              report.priority === "normal" && "bg-gray-100 text-gray-600",
                              report.priority === "low" && "bg-gray-50 text-gray-500",
                            )}
                          >
                            {report.priority}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge className={cn(statusStyle?.bg, statusStyle?.text, "text-[11px]")}>
                            <StatusIcon className="w-3 h-3 me-1" />
                            {report.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {report.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                disabled={updatingId === report.id}
                                onClick={() => handleStatusUpdate(report.id, "investigating")}
                              >
                                <Eye className="w-3.5 h-3.5 me-1" />
                                Investigate
                              </Button>
                            )}
                            {(report.status === "pending" || report.status === "investigating") && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                  disabled={updatingId === report.id}
                                  onClick={() => handleStatusUpdate(report.id, "resolved")}
                                >
                                  <CheckCircle className="w-3.5 h-3.5 me-1" />
                                  Resolve
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                                  disabled={updatingId === report.id}
                                  onClick={() => handleStatusUpdate(report.id, "dismissed")}
                                >
                                  <XCircle className="w-3.5 h-3.5 me-1" />
                                  Dismiss
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border/60">
                <p className="text-xs text-muted-foreground tabular-nums">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
