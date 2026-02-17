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
  Users, Search, Filter, MoreVertical, Mail, Ban, CheckCircle,
  XCircle, Eye, Edit, Trash2, Download, UserPlus, Shield,
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

  React.useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/users?page=${page}&filter=${selectedFilter}`
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();

        if (cancelled) return;

        setUsers(data.users);
        setTotalCount(data.totalCount);
        setStatusCounts(data.statusCounts);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [page, selectedFilter]);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setPage(1);
  }, [selectedFilter]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">User Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage all registered users on the platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
          <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
            <UserPlus className="w-4 h-4 me-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">
            {statusCounts.total.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {statusCounts.active.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {statusCounts.suspended.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Suspended</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            +{statusCounts.newThisWeek.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">New This Week</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <div className="flex gap-2">
            {FILTER_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedFilter === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(option.id)}
                className={cn(
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
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-start p-4 font-medium">User</th>
                <th className="text-start p-4 font-medium">Level</th>
                <th className="text-start p-4 font-medium">Role</th>
                <th className="text-start p-4 font-medium">Status</th>
                <th className="text-start p-4 font-medium">Location</th>
                <th className="text-start p-4 font-medium">Joined</th>
                <th className="text-end p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
                      <p className="text-sm text-muted-foreground">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No users found</p>
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
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <DiceBearAvatar
                          seed={user.avatarSeed}
                          style={user.avatarStyle}
                          size="md"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <LevelBadge level={user.level} size="sm" />
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={cn(
                          user.role === "seller"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {user.role === "seller" && <Shield className="w-3 h-3 me-1" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={cn(
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
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {user.location || "\u2014"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.joinDate)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.status === "active" ? (
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <Ban className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="text-green-500">
                            <CheckCircle className="w-4 h-4" />
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
