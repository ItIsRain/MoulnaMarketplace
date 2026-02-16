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
  MoreHorizontal, Download, UserPlus
} from "lucide-react";

const CUSTOMERS = [
  {
    id: "1",
    name: "Fatima Al Zahra",
    email: "fatima@email.com",
    avatar: "fatima-customer",
    totalInquiries: 12,
    totalListingsViewed: 45,
    lastInquiry: "2024-01-15",
    rating: 4.8,
    isRepeat: true,
    tags: ["VIP", "Jewelry Lover"],
  },
  {
    id: "2",
    name: "Ahmed Hassan",
    email: "ahmed.h@email.com",
    avatar: "ahmed-customer",
    totalInquiries: 8,
    totalListingsViewed: 23,
    lastInquiry: "2024-01-12",
    rating: 5.0,
    isRepeat: true,
    tags: ["Oud Enthusiast"],
  },
  {
    id: "3",
    name: "Mariam Khalid",
    email: "mariam.k@email.com",
    avatar: "mariam-customer",
    totalInquiries: 5,
    totalListingsViewed: 18,
    lastInquiry: "2024-01-10",
    rating: 4.5,
    isRepeat: true,
    tags: [],
  },
  {
    id: "4",
    name: "Omar Nasser",
    email: "omar.n@email.com",
    avatar: "omar-customer",
    totalInquiries: 3,
    totalListingsViewed: 7,
    lastInquiry: "2024-01-08",
    rating: 4.0,
    isRepeat: false,
    tags: ["New Customer"],
  },
  {
    id: "5",
    name: "Sara Abdullah",
    email: "sara.a@email.com",
    avatar: "sara-customer",
    totalInquiries: 15,
    totalListingsViewed: 62,
    lastInquiry: "2024-01-14",
    rating: 4.9,
    isRepeat: true,
    tags: ["VIP", "Most Active"],
  },
];

const STATS = [
  { label: "Total Customers", value: "1,245", change: "+12%", icon: Users },
  { label: "Repeat Customers", value: "68%", change: "+5%", icon: TrendingUp },
  { label: "Avg. Inquiries", value: "6.2", change: "+8%", icon: MessageSquare },
  { label: "Avg. Rating", value: "4.7", change: "+0.2", icon: Star },
];

export default function SellerCustomersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");

  const filteredCustomers = CUSTOMERS.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === "repeat") return matchesSearch && customer.isRepeat;
    if (selectedFilter === "new") return matchesSearch && !customer.isRepeat;
    if (selectedFilter === "vip") return matchesSearch && customer.tags.includes("VIP");
    return matchesSearch;
  });

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
          {STATS.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
                <Badge variant="outline" className="text-green-600 bg-green-50">
                  {stat.change}
                </Badge>
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
                placeholder="Search customers..."
                className="ps-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "repeat", "new", "vip"].map((filter) => (
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
                  <th className="text-start p-4 font-medium">Inquiries</th>
                  <th className="text-start p-4 font-medium">Listings Viewed</th>
                  <th className="text-start p-4 font-medium">Last Inquiry</th>
                  <th className="text-start p-4 font-medium">Rating</th>
                  <th className="text-start p-4 font-medium">Tags</th>
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
                        <DiceBearAvatar seed={customer.avatar} size="sm" />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{customer.totalInquiries}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{customer.totalListingsViewed}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(customer.lastInquiry)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{customer.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
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
