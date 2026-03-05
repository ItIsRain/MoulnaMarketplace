"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Users, Search, Filter, MoreVertical, Ban, CheckCircle,
  XCircle, Trash2, Download, Shield,
  Calendar, MapPin, Loader2
} from "lucide-react";

const FILTER_OPTIONS = [
  { id: "all", label: "All Users" },
  { id: "active", label: "Active" },
  { id: "suspended", label: "Suspended" },
  { id: "buyer", label: "Buyers" },
  { id: "seller", label: "Sellers" },
];

const PAGE_SIZE = 20;

interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarStyle: string;
  avatarSeed: string;
  level: number;
  role: string;
  status: string;
  location: string;
  joinDate: string;
}

interface StatusCounts {
  total: number;
  active: number;
  suspended: number;
  newThisWeek: number;
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [statusCounts, setStatusCounts] = React.useState<StatusCounts>({
    total: 0,
    active: 0,
    suspended: 0,
    newThisWeek: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search query
  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/admin/users?page=${page}&filter=${selectedFilter}`;
      if (debouncedSearch) {
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      setUsers(data.users);
      setTotalCount(data.totalCount);
      setStatusCounts(data.statusCounts);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [page, selectedFilter, debouncedSearch]);

  React.useEffect(() => {
    let cancelled = false;

    fetchUsers().then(() => {
      if (cancelled) return;
    });

    return () => {
      cancelled = true;
    };
  }, [fetchUsers]);

  async function handleUserAction(userId: string, action: "suspend" | "reactivate") {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }
      await fetchUsers();
    } catch (err) {
      console.error("Error performing user action:", err);
    } finally {
      setActionLoading(null);
    }
  }

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [selectedFilter, debouncedSearch]);

  function handleExport() {
    const headers = ["Name", "Email", "Username", "Role", "Status", "Location", "Joined"];
    const rows = users.map((u) => [
      u.name,
      u.email,
      u.username,
      u.role,
      u.status,
      u.location || "",
      u.joinDate,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-[18px] h-[18px] text-moulna-gold" />
            <h1 className="text-xl font-display font-semibold text-foreground">User Management</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all registered users on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={users.length === 0}>
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border/60 shadow-sm">
          <div className="p-4 bg-gradient-to-br from-slate-500/10 to-slate-600/5 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Users</p>
            <p className="text-xl font-semibold tabular-nums">
              {statusCounts.total.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Active</p>
            <p className="text-xl font-semibold tabular-nums text-green-600">
              {statusCounts.active.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Suspended</p>
            <p className="text-xl font-semibold tabular-nums text-red-600">
              {statusCounts.suspended.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">New This Week</p>
            <p className="text-xl font-semibold tabular-nums text-blue-600">
              +{statusCounts.newThisWeek.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/60 shadow-sm">
        <div className="px-5 py-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10 h-9 text-[13px]"
            />
          </div>
          <div className="flex gap-1.5">
            {FILTER_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedFilter === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(option.id)}
                className={cn(
                  "text-xs h-9",
                  selectedFilter === option.id &&
                    "bg-moulna-gold hover:bg-moulna-gold-dark"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="border-border/60 shadow-sm">
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <h2 className="text-sm font-semibold">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="text-start px-5 py-3 font-medium text-muted-foreground text-xs">User</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground text-xs">Level</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground text-xs">Role</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground text-xs">Status</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground text-xs">Location</th>
                <th className="text-start px-4 py-3 font-medium text-muted-foreground text-xs">Joined</th>
                <th className="text-end px-5 py-3 font-medium text-muted-foreground text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-moulna-gold" />
                      <p className="text-xs text-muted-foreground">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <DiceBearAvatar
                          seed={user.avatarSeed}
                          style={user.avatarStyle}
                          size="md"
                        />
                        <div>
                          <p className="font-medium text-[13px]">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <LevelBadge level={user.level} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs font-normal",
                          user.role === "seller"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {user.role === "seller" && <Shield className="w-3 h-3 me-1" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={cn(
                          "text-xs font-normal",
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {user.status === "active" ? (
                          <CheckCircle className="w-3 h-3 me-1" />
                        ) : (
                          <XCircle className="w-3 h-3 me-1" />
                        )}
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {user.location || "\u2014"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(user.joinDate)}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {user.status === "active" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600"
                            disabled={actionLoading === user.id}
                            onClick={() => handleUserAction(user.id, "suspend")}
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Ban className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-green-500 hover:text-green-600"
                            disabled={actionLoading === user.id}
                            onClick={() => handleUserAction(user.id, "reactivate")}
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
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
              className="text-xs h-8"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
