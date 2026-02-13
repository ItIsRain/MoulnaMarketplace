"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import {
  Users, Search, Filter, MoreVertical, Mail, Ban, CheckCircle,
  XCircle, Eye, Edit, Trash2, Download, UserPlus, Shield,
  Calendar, MapPin
} from "lucide-react";

const USERS = [
  {
    id: "1",
    name: "Sarah Ahmed",
    email: "sarah.ahmed@email.com",
    avatar: "sarah-ahmed",
    level: 6,
    status: "active",
    role: "buyer",
    joinDate: "Jan 15, 2024",
    location: "Dubai, UAE",
    orders: 12,
    spent: 4500,
  },
  {
    id: "2",
    name: "Mohammed Ali",
    email: "m.ali@email.com",
    avatar: "mohammed-ali",
    level: 4,
    status: "active",
    role: "seller",
    joinDate: "Feb 1, 2024",
    location: "Abu Dhabi, UAE",
    orders: 8,
    spent: 3200,
  },
  {
    id: "3",
    name: "Fatima Hassan",
    email: "fatima.h@email.com",
    avatar: "fatima-hassan",
    level: 8,
    status: "active",
    role: "buyer",
    joinDate: "Dec 10, 2023",
    location: "Sharjah, UAE",
    orders: 24,
    spent: 8900,
  },
  {
    id: "4",
    name: "Ahmed Khalid",
    email: "ahmed.k@email.com",
    avatar: "ahmed-khalid",
    level: 2,
    status: "suspended",
    role: "buyer",
    joinDate: "Mar 5, 2024",
    location: "Ajman, UAE",
    orders: 2,
    spent: 450,
  },
  {
    id: "5",
    name: "Layla Omar",
    email: "layla.o@email.com",
    avatar: "layla-omar",
    level: 5,
    status: "active",
    role: "seller",
    joinDate: "Jan 20, 2024",
    location: "Dubai, UAE",
    orders: 6,
    spent: 2100,
  },
];

const FILTER_OPTIONS = [
  { id: "all", label: "All Users" },
  { id: "active", label: "Active" },
  { id: "suspended", label: "Suspended" },
  { id: "buyer", label: "Buyers" },
  { id: "seller", label: "Sellers" },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");

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
          <p className="text-2xl font-bold">12,456</p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">11,892</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">564</p>
          <p className="text-sm text-muted-foreground">Suspended</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">+234</p>
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
              {USERS.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <DiceBearAvatar seed={user.avatar} size="md" />
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
                      {user.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {user.joinDate}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing 1-5 of 12,456 users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
