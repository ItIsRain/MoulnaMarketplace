"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Truck, Package, MapPin, Clock, Plus, Edit,
  Trash2, Globe, CheckCircle, AlertCircle
} from "lucide-react";

const SHIPPING_ZONES = [
  {
    id: "1",
    name: "Dubai",
    regions: ["Dubai"],
    methods: [
      { name: "Standard Delivery", price: 15, days: "2-3" },
      { name: "Express Delivery", price: 30, days: "Same day" },
    ],
    isActive: true,
  },
  {
    id: "2",
    name: "Other Emirates",
    regions: ["Abu Dhabi", "Sharjah", "Ajman", "RAK", "Fujairah", "UAQ"],
    methods: [
      { name: "Standard Delivery", price: 25, days: "3-5" },
      { name: "Express Delivery", price: 45, days: "1-2" },
    ],
    isActive: true,
  },
  {
    id: "3",
    name: "GCC Countries",
    regions: ["Saudi Arabia", "Kuwait", "Bahrain", "Oman", "Qatar"],
    methods: [
      { name: "International Standard", price: 75, days: "5-7" },
    ],
    isActive: false,
  },
];

const SHIPPING_OPTIONS = [
  {
    id: "free-shipping",
    label: "Free Shipping Threshold",
    description: "Offer free shipping on orders above a certain amount",
    enabled: true,
    value: "100",
  },
  {
    id: "local-pickup",
    label: "Local Pickup",
    description: "Allow customers to pick up orders from your location",
    enabled: true,
    location: "Dubai Marina, Dubai",
  },
  {
    id: "gift-wrap",
    label: "Gift Wrapping",
    description: "Offer gift wrapping service for an additional fee",
    enabled: true,
    price: "10",
  },
];

export default function SellerShippingPage() {
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="w-7 h-7 text-moulna-gold" />
              Shipping Settings
            </h1>
            <p className="text-muted-foreground">
              Configure shipping zones, rates, and delivery options
            </p>
          </div>
          <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
            <Plus className="w-4 h-4 me-2" />
            Add Shipping Zone
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Active Zones</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Shipping Methods</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-moulna-gold/20 text-moulna-gold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">AED 100</p>
                <p className="text-sm text-muted-foreground">Free Shipping Min.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Shipping Zones */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-moulna-gold" />
            Shipping Zones
          </h2>
          <div className="space-y-4">
            {SHIPPING_ZONES.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-lg border",
                  !zone.isActive && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{zone.name}</h3>
                      <Badge variant={zone.isActive ? "default" : "secondary"}>
                        {zone.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {zone.regions.map((region) => (
                        <Badge key={region} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={zone.isActive} />
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {zone.methods.map((method) => (
                    <div
                      key={method.name}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {method.days} days
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold">AED {method.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Shipping Options */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-moulna-gold" />
            Shipping Options
          </h2>
          <div className="space-y-4">
            {SHIPPING_OPTIONS.map((option) => (
              <div
                key={option.id}
                className="flex items-start justify-between p-4 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{option.label}</h3>
                    <Badge variant={option.enabled ? "default" : "secondary"}>
                      {option.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {option.description}
                  </p>
                  {option.value && (
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Minimum order:</Label>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">AED</span>
                        <Input
                          defaultValue={option.value}
                          className="w-24 h-8"
                        />
                      </div>
                    </div>
                  )}
                  {option.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{option.location}</span>
                      <Button variant="link" size="sm" className="h-auto p-0">
                        Edit
                      </Button>
                    </div>
                  )}
                  {option.price && (
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Price:</Label>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">AED</span>
                        <Input
                          defaultValue={option.price}
                          className="w-24 h-8"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Switch checked={option.enabled} />
              </div>
            ))}
          </div>
        </Card>

        {/* Packaging */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-moulna-gold" />
            Default Package Dimensions
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Set default package dimensions for shipping calculations. You can override these per product.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label>Length (cm)</Label>
              <Input defaultValue="20" className="mt-1" />
            </div>
            <div>
              <Label>Width (cm)</Label>
              <Input defaultValue="15" className="mt-1" />
            </div>
            <div>
              <Label>Height (cm)</Label>
              <Input defaultValue="10" className="mt-1" />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input defaultValue="0.5" className="mt-1" />
            </div>
          </div>
          <Button className="mt-4">Save Dimensions</Button>
        </Card>

        {/* Carrier Info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Carrier Integration Coming Soon</h3>
              <p className="text-sm text-blue-700">
                We&apos;re working on integrations with Aramex, Emirates Post, and other carriers
                for automated shipping label generation and tracking.
              </p>
            </div>
          </div>
        </Card>
    </div>
  );
}
