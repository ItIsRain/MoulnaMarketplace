"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, TrendingDown, MessageSquare, Package,
  Calendar, Download, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart, Target, Zap, Loader2
} from "lucide-react";

const TIME_FILTERS = ["Today", "This Week", "This Month", "This Year"] as const;

type TimePeriod = typeof TIME_FILTERS[number];

interface AnalyticsData {
  totalInquiries: number;
  totalConversations: number;
  avgResponseMinutes: number;
  inquiryTimeline: Array<{ date: string; count: number }>;
  byCategory: Array<{ category: string; inquiries: number; views: number; percentage: number }>;
  topProducts: Array<{ name: string; inquiries: number; views: number }>;
}

const PERIOD_MAP: Record<TimePeriod, string> = {
  "Today": "1d",
  "This Week": "7d",
  "This Month": "30d",
  "This Year": "1y",
};

export default function SalesAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>("This Month");
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const period = PERIOD_MAP[selectedPeriod];
        const response = await fetch(`/api/seller/analytics?section=sales&period=${period}`);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const analyticsData: AnalyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Failed to fetch analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  const formatResponseTime = (minutes: number): string => {
    const hours = minutes / 60;
    return `${hours.toFixed(1)} hrs`;
  };

  const maxInquiries = data?.inquiryTimeline.length
    ? Math.max(...data.inquiryTimeline.map((d) => d.count))
    : 0;

  const metrics = data ? [
    {
      label: "Total Inquiries",
      value: data.totalInquiries.toLocaleString(),
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      label: "Conversations",
      value: data.totalConversations.toLocaleString(),
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      label: "Avg. Response Time",
      value: formatResponseTime(data.avgResponseMinutes),
      icon: Target,
      color: "text-purple-600",
    },
    {
      label: "Total Views",
      value: data.byCategory.reduce((sum, cat) => sum + cat.views, 0).toLocaleString(),
      icon: Zap,
      color: "text-orange-600",
    },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inquiry Analytics</h1>
          <p className="text-muted-foreground">
            Track your inquiry performance and engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" disabled>
            <Calendar className="w-4 h-4 me-2" />
            {selectedPeriod}
          </Button>
          <Button variant="outline" size="sm" disabled={isLoading || !data}>
            <Download className="w-4 h-4 me-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Period Filters */}
      <div className="flex flex-wrap gap-2">
        {TIME_FILTERS.map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
            disabled={isLoading}
            className={cn(
              selectedPeriod === period && "bg-moulna-gold hover:bg-moulna-gold-dark"
            )}
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="p-8">
          <div className="text-center">
            <p className="text-red-600 font-medium mb-2">Failed to load analytics</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </Card>
      )}

      {/* Data Display */}
      {data && !isLoading && !error && (
        <>
          {/* Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg bg-muted", metric.color)}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Inquiry Timeline Chart */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-moulna-gold" />
                  <h2 className="font-semibold">Inquiry Overview</h2>
                </div>
                <Badge variant="secondary">Timeline</Badge>
              </div>

              {/* Simple Bar Chart */}
              {data.inquiryTimeline.length > 0 ? (
                <div className="flex items-end justify-between gap-2 h-48">
                  {data.inquiryTimeline.map((item, index) => (
                    <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        className="w-full bg-moulna-gold/80 rounded-t hover:bg-moulna-gold transition-colors cursor-pointer"
                        initial={{ height: 0 }}
                        animate={{ height: `${maxInquiries > 0 ? (item.count / maxInquiries) * 100 : 0}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        title={`${item.count.toLocaleString()} inquiries`}
                      />
                      <span className="text-xs text-muted-foreground truncate w-full text-center">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  No inquiry data available for this period
                </div>
              )}
            </Card>

            {/* Inquiries by Category */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-moulna-gold" />
                <h2 className="font-semibold">Inquiries by Category</h2>
              </div>
              {data.byCategory.length > 0 ? (
                <div className="space-y-4">
                  {data.byCategory.map((cat, index) => (
                    <motion.div
                      key={cat.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{cat.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {cat.inquiries.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-moulna-gold rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cat.views} views ({cat.percentage}%)
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No category data available
                </div>
              )}
            </Card>
          </div>

          {/* Top Products */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-moulna-gold" />
                <h2 className="font-semibold">Top Performing Listings</h2>
              </div>
            </div>

            {data.topProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-start py-3 text-sm font-medium text-muted-foreground">
                        Product
                      </th>
                      <th className="text-end py-3 text-sm font-medium text-muted-foreground">
                        Inquiries
                      </th>
                      <th className="text-end py-3 text-sm font-medium text-muted-foreground">
                        Views
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((product, index) => (
                      <motion.tr
                        key={product.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                              #{index + 1}
                            </div>
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="text-end py-4 font-medium">
                          {product.inquiries}
                        </td>
                        <td className="text-end py-4 text-muted-foreground">
                          {product.views}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No product data available for this period
              </div>
            )}
          </Card>

          {/* Insights */}
          <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-amber-50 border-moulna-gold/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-moulna-gold/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-moulna-gold" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Inquiry Insights</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>
                      You have {data.totalInquiries} total inquiries with an average response time of {formatResponseTime(data.avgResponseMinutes)}.
                    </span>
                  </li>
                  {data.topProducts.length > 0 && (
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        Your top performing product is "{data.topProducts[0].name}" with {data.topProducts[0].inquiries} inquiries.
                      </span>
                    </li>
                  )}
                  {data.byCategory.length > 0 && (
                    <li className="flex items-start gap-2">
                      <PieChart className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>
                        Most inquiries come from the "{data.byCategory[0].category}" category ({data.byCategory[0].percentage}%).
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
