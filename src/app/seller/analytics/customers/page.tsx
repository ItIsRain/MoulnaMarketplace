"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Users, UserPlus, UserCheck, Heart, TrendingUp, TrendingDown,
  MapPin, Calendar, ArrowUpRight, ArrowDownRight, Star,
  MessageSquare, Repeat, Eye, Download, Loader2
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

interface LocationData {
  location: string;
  customers: number;
  percentage: number;
}

interface CustomerSegment {
  segment: string;
  count: number;
  color: string;
}

interface ApiResponse {
  totalCustomers: number;
  newCustomers: number;
  returningRate: number;
  totalFollowers: number;
  customers: Customer[];
  byLocation: LocationData[];
}

export default function CustomerAnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<ApiResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/seller/analytics?section=customers&period=30d');

        if (!response.ok) {
          throw new Error('Failed to fetch customer analytics');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute customer segments from real data
  const getCustomerSegments = (): CustomerSegment[] => {
    if (!data?.customers) return [];

    const newCustomers = data.customers.filter(c => c.inquiries === 1).length;
    const returningCustomers = data.customers.filter(c => c.inquiries > 1 && c.inquiries < 5).length;
    const vipCustomers = data.customers.filter(c => c.inquiries >= 5).length;

    return [
      { segment: "New", count: newCustomers, color: "bg-blue-500" },
      { segment: "Returning", count: returningCustomers, color: "bg-green-500" },
      { segment: "VIP", count: vipCustomers, color: "bg-purple-500" },
    ].filter(segment => segment.count > 0);
  };

  // Format relative time
  const formatRelativeTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  // Check if customer is VIP (5+ inquiries)
  const isVIP = (inquiries: number): boolean => inquiries >= 5;

  // Get top 5 customers sorted by inquiries
  const getTopCustomers = (): Customer[] => {
    if (!data?.customers) return [];
    return [...data.customers]
      .sort((a, b) => b.inquiries - a.inquiries)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-moulna-gold mx-auto mb-4" />
          <p className="text-muted-foreground">Loading customer analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load customer analytics</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const customerMetrics = [
    {
      label: "Total Customers",
      value: data.totalCustomers.toLocaleString(),
      change: data.newCustomers > 0 ? `+${data.newCustomers}` : '0',
      trend: data.newCustomers > 0 ? "up" : "neutral",
      icon: Users,
      period: "this month",
    },
    {
      label: "New Customers",
      value: data.newCustomers.toLocaleString(),
      change: data.newCustomers > 0 ? `+${data.newCustomers}` : '0',
      trend: data.newCustomers > 0 ? "up" : "neutral",
      icon: UserPlus,
      period: "this month",
    },
    {
      label: "Returning Rate",
      value: `${Math.round(data.returningRate)}%`,
      change: data.returningRate > 50 ? "+Good" : "Low",
      trend: data.returningRate > 50 ? "up" : "down",
      icon: Repeat,
      period: "retention rate",
    },
    {
      label: "Followers",
      value: data.totalFollowers.toLocaleString(),
      change: data.totalFollowers > 0 ? `+${data.totalFollowers}` : '0',
      trend: data.totalFollowers > 0 ? "up" : "neutral",
      icon: Heart,
      period: "total",
    },
  ];

  const topCustomers = getTopCustomers();
  const customerSegments = getCustomerSegments();
  const totalSegmentCustomers = customerSegments.reduce((sum, seg) => sum + seg.count, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Analytics</h1>
          <p className="text-muted-foreground">
            Understand your customer base and engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 me-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {customerMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-moulna-gold/10">
                  <metric.icon className="w-5 h-5 text-moulna-gold" />
                </div>
                {metric.trend !== "neutral" && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      metric.trend === "up"
                        ? "text-green-600 bg-green-100"
                        : "text-red-600 bg-red-100"
                    )}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 me-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 me-1" />
                    )}
                    {metric.change}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{metric.period}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-moulna-gold" />
              <h2 className="font-semibold">Top Customers</h2>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          {topCustomers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No customer data available yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <DiceBearAvatar
                        seed={customer.avatarSeed || customer.username}
                        style={customer.avatarStyle || undefined}
                        size="md"
                      />
                      {isVIP(customer.inquiries) && (
                        <div className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{customer.name}</span>
                        {isVIP(customer.inquiries) && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">VIP</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {customer.inquiries} inquiries · Last: {formatRelativeTime(customer.lastContact)}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="font-bold">{customer.inquiries}</p>
                    <p className="text-xs text-muted-foreground">conversations</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Customer Segments */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Customer Segments</h2>
          </div>

          {customerSegments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No customer segments available yet</p>
            </div>
          ) : (
            <>
              {/* Segment Bar */}
              <div className="h-8 flex rounded-lg overflow-hidden mb-6">
                {customerSegments.map((segment) => (
                  <motion.div
                    key={segment.segment}
                    className={cn("h-full", segment.color)}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(segment.count / totalSegmentCustomers) * 100}%`,
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    title={`${segment.segment}: ${segment.count}`}
                  />
                ))}
              </div>

              {/* Segment Legend */}
              <div className="space-y-3">
                {customerSegments.map((segment, index) => (
                  <motion.div
                    key={segment.segment}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", segment.color)} />
                      <span className="text-sm">{segment.segment}</span>
                    </div>
                    <span className="font-medium">{segment.count}</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Location Map */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Customers by Location</h2>
          </div>
        </div>

        {data.byLocation.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No location data available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.byLocation.map((location, index) => (
              <motion.div
                key={location.location}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-muted/50 text-center"
              >
                <p className="text-2xl font-bold mb-1">{location.customers}</p>
                <p className="font-medium text-sm">{location.location}</p>
                <p className="text-xs text-muted-foreground">{location.percentage}% of total</p>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Customer Journey */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Eye className="w-5 h-5 text-moulna-gold" />
          <h2 className="font-semibold">Customer Journey</h2>
        </div>

        <div className="flex items-center justify-between">
          {[
            { stage: "Total Customers", count: data.totalCustomers, icon: Users },
            { stage: "New This Month", count: data.newCustomers, icon: UserPlus },
            { stage: "Repeat Customers", count: Math.round(data.totalCustomers * (data.returningRate / 100)), icon: Repeat },
            { stage: "VIP (5+ inquiries)", count: data.customers.filter(c => c.inquiries >= 5).length, icon: Star },
          ].map((stage, index) => (
            <React.Fragment key={stage.stage}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-moulna-gold/10 flex items-center justify-center mx-auto mb-2">
                  <stage.icon className="w-8 h-8 text-moulna-gold" />
                </div>
                <p className="font-bold text-lg">{stage.count.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{stage.stage}</p>
              </motion.div>
              {index < 3 && (
                <div className="flex-1 h-0.5 bg-muted mx-2 relative">
                  <motion.div
                    className="absolute inset-y-0 start-0 bg-moulna-gold"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Customer Insights</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {data.newCustomers > 0 && (
                <li className="flex items-start gap-2">
                  <UserPlus className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>You gained {data.newCustomers} new customer{data.newCustomers !== 1 ? 's' : ''} this month!</span>
                </li>
              )}
              {data.returningRate > 0 && (
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-red-500 mt-0.5" />
                  <span>
                    {Math.round(data.returningRate)}% of your customers are returning buyers{data.returningRate >= 50 ? ' - excellent loyalty!' : '.'}
                  </span>
                </li>
              )}
              {data.byLocation.length > 0 && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>
                    {data.byLocation[0].location} is your strongest market with {data.byLocation[0].percentage}% of customers.
                  </span>
                </li>
              )}
              {data.customers.filter(c => c.inquiries >= 5).length > 0 && (
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>
                    You have {data.customers.filter(c => c.inquiries >= 5).length} VIP customer{data.customers.filter(c => c.inquiries >= 5).length !== 1 ? 's' : ''} with 5+ inquiries.
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
