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
  Users, Search, Filter, Mail, MessageSquare,
  Star, TrendingUp, Calendar, ArrowUpDown,
  MoreHorizontal, Download, UserPlus, Loader2
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  username: string;
  avatarStyle: string | null;
  avatarSeed: string | null;
  location: string | null;
  inquiries: number;
  lastContact: string;
  isRepeat: boolean;
}

interface CustomersData {
  totalCustomers: number;
  newCustomers: number;
  returningRate: number;
  totalFollowers: number;
  customers: Customer[];
}

export default function SellerCustomersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [data, setData] = React.useState<CustomersData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        const response = await fetch("/api/seller/analytics?section=customers");

        if (!response.ok) {
          throw new Error("Failed to fetch customers data");
        }

        const result: CustomersData = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  // Calculate average inquiries from customers data
  const avgInquiries = React.useMemo(() => {
    if (!data || data.customers.length === 0) return 0;
    const total = data.customers.reduce((sum, customer) => sum + customer.inquiries, 0);
    return (total / data.customers.length).toFixed(1);
  }, [data]);

  const filteredCustomers = React.useMemo(() => {
    if (!data) return [];

    return data.customers.filter(customer => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.username.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "repeat") return matchesSearch && customer.isRepeat;
      if (selectedFilter === "new") return matchesSearch && !customer.isRepeat;
      return matchesSearch;
    });
  }, [data, searchQuery, selectedFilter]);

  const stats = React.useMemo(() => {
    if (!data) return [];

    return [
      { label: "Total Customers", value: data.totalCustomers.toLocaleString(), icon: Users },
      { label: "Returning Rate", value: `${data.returningRate}%`, icon: TrendingUp },
      { label: "Avg. Inquiries", value: avgInquiries, icon: MessageSquare },
      { label: "Followers", value: data.totalFollowers.toLocaleString(), icon: UserPlus },
    ];
  }, [data, avgInquiries]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-muted-foreground">
              Manage and engage with your customer base
            </p>
          </div>
          <Button>
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers by name or username..."
                className="ps-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "repeat", "new"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Customers Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-start p-4 font-medium">Customer</th>
                  <th className="text-start p-4 font-medium">Location</th>
                  <th className="text-start p-4 font-medium">Inquiries</th>
                  <th className="text-start p-4 font-medium">Last Contact</th>
                  <th className="text-start p-4 font-medium">Type</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <DiceBearAvatar
                          seed={customer.avatarSeed || customer.username}
                          style={customer.avatarStyle || undefined}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">@{customer.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {customer.location || "N/A"}
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{customer.inquiries}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(customer.lastContact)}
                    </td>
                    <td className="p-4">
                      <Badge variant={customer.isRepeat ? "default" : "secondary"}>
                        {customer.isRepeat ? "Repeat" : "New"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" title="Send email">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Send message">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No customers found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </Card>
    </div>
  );
}
