"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft, Tag, Percent, Gift, Calendar, Package, Users,
  Zap, Info, CheckCircle
} from "lucide-react";

const PROMOTION_TYPES = [
  {
    id: "percentage",
    name: "Percentage Discount",
    description: "Offer a percentage off the original price",
    icon: Percent,
    example: "e.g., 20% off all products",
  },
  {
    id: "fixed",
    name: "Fixed Amount Off",
    description: "Offer a fixed amount discount",
    icon: Tag,
    example: "e.g., AED 50 off orders over AED 200",
  },
  {
    id: "bogo",
    name: "Buy One Get One",
    description: "Offer free or discounted items on purchase",
    icon: Gift,
    example: "e.g., Buy 2 get 1 free",
  },
  {
    id: "free-shipping",
    name: "Free Shipping",
    description: "Waive shipping fees for qualifying orders",
    icon: Package,
    example: "e.g., Free shipping on orders over AED 100",
  },
];

const APPLIES_TO_OPTIONS = [
  { id: "all", label: "All Products" },
  { id: "category", label: "Specific Categories" },
  { id: "products", label: "Specific Products" },
];

export default function NewPromotionPage() {
  const [selectedType, setSelectedType] = React.useState("percentage");
  const [appliesTo, setAppliesTo] = React.useState("all");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/seller/promotions">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Promotion</h1>
          <p className="text-muted-foreground">
            Set up a new discount or promotional offer
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Promotion Type */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Promotion Type</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {PROMOTION_TYPES.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedType === type.id
                      ? "border-moulna-gold bg-moulna-gold/5"
                      : "border-muted hover:border-moulna-gold/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selectedType === type.id
                          ? "bg-moulna-gold text-white"
                          : "bg-muted"
                      )}
                    >
                      <type.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{type.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {type.description}
                      </p>
                      <p className="text-xs text-moulna-gold">{type.example}</p>
                    </div>
                    {selectedType === type.id && (
                      <CheckCircle className="w-5 h-5 text-moulna-gold" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Promotion Details */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Promotion Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Promotion Name
                </label>
                <Input placeholder="e.g., Summer Sale 2024" />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Promotion Code (Optional)
                </label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., SUMMER20" className="uppercase" />
                  <Button variant="outline">Generate</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to apply automatically
                </p>
              </div>

              {selectedType === "percentage" && (
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Discount Percentage
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="20"
                      className="w-32"
                      min={1}
                      max={100}
                    />
                    <span className="text-lg font-medium">%</span>
                  </div>
                </div>
              )}

              {selectedType === "fixed" && (
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Discount Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">AED</span>
                    <Input
                      type="number"
                      placeholder="50"
                      className="w-32"
                      min={1}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Minimum Order Value (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">AED</span>
                  <Input
                    type="number"
                    placeholder="100"
                    className="w-32"
                    min={0}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Applies To */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Applies To</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                {APPLIES_TO_OPTIONS.map((option) => (
                  <Button
                    key={option.id}
                    variant={appliesTo === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAppliesTo(option.id)}
                    className={cn(
                      appliesTo === option.id &&
                        "bg-moulna-gold hover:bg-moulna-gold-dark"
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {appliesTo === "category" && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Select categories:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Oud", "Perfumes", "Bakhoor", "Gift Sets"].map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="cursor-pointer hover:bg-moulna-gold/10"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {appliesTo === "products" && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Input placeholder="Search products to add..." />
                </div>
              )}
            </div>
          </Card>

          {/* Schedule */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Schedule</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Start Date
                </label>
                <Input type="datetime-local" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  End Date
                </label>
                <Input type="datetime-local" />
              </div>
            </div>
          </Card>

          {/* Limits */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Usage Limits</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Limit total uses</p>
                  <p className="text-sm text-muted-foreground">
                    Maximum number of times this promotion can be used
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch />
                  <Input
                    type="number"
                    placeholder="100"
                    className="w-24"
                    min={1}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Limit per customer</p>
                  <p className="text-sm text-muted-foreground">
                    Maximum uses per customer
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <Input
                    type="number"
                    defaultValue="1"
                    className="w-24"
                    min={1}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Preview</h3>
            <div className="p-4 bg-gradient-to-br from-moulna-gold/20 to-amber-50 rounded-lg text-center">
              <Percent className="w-12 h-12 text-moulna-gold mx-auto mb-3" />
              <p className="font-bold text-xl mb-1">20% OFF</p>
              <p className="text-sm text-muted-foreground">All Products</p>
              <Badge className="mt-3 bg-moulna-gold">SUMMER20</Badge>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Tips</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Use clear, memorable promotion codes</li>
                  <li>• Set reasonable minimum order values</li>
                  <li>• Time promotions with holidays or events</li>
                  <li>• Promote your deals on social media</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full bg-moulna-gold hover:bg-moulna-gold-dark">
              <Zap className="w-4 h-4 me-2" />
              Create Promotion
            </Button>
            <Button variant="outline" className="w-full">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
