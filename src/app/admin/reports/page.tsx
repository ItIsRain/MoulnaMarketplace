"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Flag, Search, Filter, Eye, CheckCircle, XCircle, Clock,
  AlertTriangle, MessageSquare, Package, Store, User, Ban,
  Calendar, Trash2
} from "lucide-react";

const REPORTS = [
  {
    id: "RPT-001",
    type: "product",
    subject: "Counterfeit Perfume",
    targetName: "Designer Fragrance 100ml",
    targetAvatar: "product-1",
    reportedBy: "Sarah Ahmed",
    reporterAvatar: "sarah-ahmed",
    reason: "Suspected counterfeit item",
    description: "This product appears to be a fake designer perfume. The packaging and branding don't match the authentic product.",
    status: "pending",
    priority: "high",
    date: "Mar 13, 2024",
    seller: "Unknown Seller",
  },
  {
    id: "RPT-002",
    type: "seller",
    subject: "Misleading Product Photos",
    targetName: "Quick Deals Store",
    targetAvatar: "quick-deals",
    reportedBy: "Mohammed Ali",
    reporterAvatar: "mohammed-ali",
    reason: "Misleading photos/description",
    description: "Seller uses stock photos that don't represent the actual products. Multiple customers have complained.",
    status: "investigating",
    priority: "medium",
    date: "Mar 12, 2024",
    seller: "Quick Deals Store",
  },
  {
    id: "RPT-003",
    type: "user",
    subject: "Harassment in Messages",
    targetName: "John Doe",
    targetAvatar: "john-doe",
    reportedBy: "Fatima Hassan",
    reporterAvatar: "fatima-hassan",
    reason: "Harassment/Abusive behavior",
    description: "User sent multiple abusive messages after I declined to lower the price.",
    status: "resolved",
    priority: "high",
    date: "Mar 11, 2024",
    seller: null,
  },
  {
    id: "RPT-004",
    type: "review",
    subject: "Fake Review",
    targetName: "5-star review on Oud Set",
    targetAvatar: "review-1",
    reportedBy: "Ahmed Khalid",
    reporterAvatar: "ahmed-khalid",
    reason: "Fake/Paid review",
    description: "This review appears to be fake. The reviewer account was created the same day and has no order history.",
    status: "pending",
    priority: "low",
    date: "Mar 10, 2024",
    seller: "Arabian Scents Boutique",
  },
];

const STATUS_OPTIONS = [
  { id: "all", label: "All Reports" },
  { id: "pending", label: "Pending" },
  { id: "investigating", label: "Investigating" },
  { id: "resolved", label: "Resolved" },
  { id: "dismissed", label: "Dismissed" },
];

const TYPE_ICONS = {
  product: Package,
  seller: Store,
  user: User,
  review: MessageSquare,
};

export default function AdminReportsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Flag className="w-8 h-8 text-moulna-gold" />
            <h1 className="text-2xl font-bold">Reports & Moderation</h1>
          </div>
          <p className="text-muted-foreground">
            Review and handle reported content
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Flag className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Open Reports</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Investigating</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Resolved (Month)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={selectedStatus === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(option.id)}
                className={cn(
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

      {/* Reports List */}
      <div className="space-y-4">
        {REPORTS.map((report, index) => {
          const TypeIcon = TYPE_ICONS[report.type as keyof typeof TYPE_ICONS] || Flag;

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "p-6",
                  report.priority === "high" && "border-red-200 bg-red-50/30"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        report.type === "product" && "bg-blue-100",
                        report.type === "seller" && "bg-purple-100",
                        report.type === "user" && "bg-orange-100",
                        report.type === "review" && "bg-green-100"
                      )}
                    >
                      <TypeIcon
                        className={cn(
                          "w-6 h-6",
                          report.type === "product" && "text-blue-600",
                          report.type === "seller" && "text-purple-600",
                          report.type === "user" && "text-orange-600",
                          report.type === "review" && "text-green-600"
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">
                          {report.id}
                        </span>
                        <Badge variant="secondary" className="capitalize">
                          {report.type}
                        </Badge>
                        {report.priority === "high" && (
                          <Badge className="bg-red-100 text-red-700">
                            <AlertTriangle className="w-3 h-3 me-1" />
                            High Priority
                          </Badge>
                        )}
                        {report.priority === "medium" && (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            Medium
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{report.subject}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="font-medium">Target:</span> {report.targetName}
                        {report.seller && (
                          <span> · Seller: {report.seller}</span>
                        )}
                      </p>
                      <p className="text-sm mb-3">{report.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <DiceBearAvatar seed={report.reporterAvatar} size="xs" />
                          <span>Reported by {report.reportedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {report.date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Badge
                      className={cn(
                        report.status === "pending" && "bg-yellow-100 text-yellow-700",
                        report.status === "investigating" && "bg-blue-100 text-blue-700",
                        report.status === "resolved" && "bg-green-100 text-green-700",
                        report.status === "dismissed" && "bg-gray-100 text-gray-700"
                      )}
                    >
                      {report.status === "pending" && <Clock className="w-3 h-3 me-1" />}
                      {report.status === "investigating" && <Eye className="w-3 h-3 me-1" />}
                      {report.status === "resolved" && <CheckCircle className="w-3 h-3 me-1" />}
                      {report.status === "dismissed" && <XCircle className="w-3 h-3 me-1" />}
                      {report.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 me-1" />
                        View
                      </Button>
                      {report.status === "pending" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Investigate
                        </Button>
                      )}
                      {report.status === "investigating" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 me-1" />
                            Resolve
                          </Button>
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                        </>
                      )}
                    </div>
                    {(report.type === "seller" || report.type === "user") &&
                      report.status !== "resolved" && (
                        <Button variant="destructive" size="sm">
                          <Ban className="w-4 h-4 me-1" />
                          Ban {report.type}
                        </Button>
                      )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
