"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Package,
  Calendar, Download, Filter, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart, Target, Zap
} from "lucide-react";

const SALES_METRICS = [
  {
    label: "Total Revenue",
    value: "AED 45,230",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    label: "Orders",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "text-blue-600",
  },
  {
    label: "Average Order Value",
    value: "AED 290",
    change: "+4.1%",
    trend: "up",
    icon: Target,
    color: "text-purple-600",
  },
  {
    label: "Conversion Rate",
    value: "3.8%",
    change: "-0.5%",
    trend: "down",
    icon: Zap,
    color: "text-orange-600",
  },
];

const SALES_BY_CATEGORY = [
  { category: "Oud", sales: 18500, percentage: 41, orders: 62 },
  { category: "Perfumes", sales: 12300, percentage: 27, orders: 48 },
  { category: "Bakhoor", sales: 8200, percentage: 18, orders: 31 },
  { category: "Gift Sets", sales: 6230, percentage: 14, orders: 15 },
];

const TOP_PRODUCTS = [
  { name: "Premium Oud Collection Set", sales: 8500, orders: 28, trend: "up" },
  { name: "Arabian Nights Perfume 100ml", sales: 6400, orders: 35, trend: "up" },
  { name: "Traditional Bakhoor Set", sales: 4200, orders: 24, trend: "down" },
  { name: "Luxury Oud Chips 50g", sales: 3800, orders: 19, trend: "up" },
  { name: "Gift Sampler Collection", sales: 2900, orders: 12, trend: "down" },
];

const SALES_TIMELINE = [
  { date: "Mar 1", sales: 1250 },
  { date: "Mar 5", sales: 1890 },
  { date: "Mar 10", sales: 2340 },
  { date: "Mar 15", sales: 1980 },
  { date: "Mar 20", sales: 2650 },
  { date: "Mar 25", sales: 3120 },
  { date: "Mar 30", sales: 2890 },
];

const TIME_FILTERS = ["Today", "This Week", "This Month", "This Year", "Custom"];

export default function SalesAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("This Month");
  const maxSales = Math.max(...SALES_TIMELINE.map((d) => d.sales));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Analytics</h1>
          <p className="text-muted-foreground">
            Track your sales performance and revenue
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 me-2" />
            Mar 1 - Mar 31, 2024
          </Button>
          <Button variant="outline" size="sm">
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
            className={cn(
              selectedPeriod === period && "bg-moulna-gold hover:bg-moulna-gold-dark"
            )}
          >
            {period}
          </Button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SALES_METRICS.map((metric, index) => (
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
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-moulna-gold" />
              <h2 className="font-semibold">Sales Overview</h2>
            </div>
            <Badge variant="secondary">Daily</Badge>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {SALES_TIMELINE.map((data, index) => (
              <div key={data.date} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full bg-moulna-gold/80 rounded-t hover:bg-moulna-gold transition-colors cursor-pointer"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.sales / maxSales) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  title={`AED ${data.sales.toLocaleString()}`}
                />
                <span className="text-xs text-muted-foreground">{data.date.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Sales by Category */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Sales by Category</h2>
          </div>
          <div className="space-y-4">
            {SALES_BY_CATEGORY.map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm text-muted-foreground">
                    AED {cat.sales.toLocaleString()}
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
                  {cat.orders} orders ({cat.percentage}%)
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Top Selling Products</h2>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-start py-3 text-sm font-medium text-muted-foreground">
                  Product
                </th>
                <th className="text-end py-3 text-sm font-medium text-muted-foreground">
                  Revenue
                </th>
                <th className="text-end py-3 text-sm font-medium text-muted-foreground">
                  Orders
                </th>
                <th className="text-end py-3 text-sm font-medium text-muted-foreground">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((product, index) => (
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
                    AED {product.sales.toLocaleString()}
                  </td>
                  <td className="text-end py-4 text-muted-foreground">
                    {product.orders}
                  </td>
                  <td className="text-end py-4">
                    {product.trend === "up" ? (
                      <Badge className="bg-green-100 text-green-700">
                        <TrendingUp className="w-3 h-3 me-1" />
                        Up
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">
                        <TrendingDown className="w-3 h-3 me-1" />
                        Down
                      </Badge>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-amber-50 border-moulna-gold/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-moulna-gold/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-moulna-gold" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Sales Insights</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Your sales are up 12.5% compared to last month. Great job!</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                <span>Premium Oud Collection is your best performer with 28 orders.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowDownRight className="w-4 h-4 text-orange-600 mt-0.5" />
                <span>Conversion rate dropped slightly. Consider updating product photos.</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
