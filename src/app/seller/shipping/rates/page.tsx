"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Truck, Plus, Edit, Trash2, MapPin, Package, Clock,
  DollarSign, Save, Info
} from "lucide-react";

const SHIPPING_ZONES = [
  {
    id: "1",
    name: "Dubai",
    regions: ["All Dubai areas"],
    rates: [
      { minWeight: 0, maxWeight: 1, price: 15, deliveryTime: "1-2 days" },
      { minWeight: 1, maxWeight: 5, price: 20, deliveryTime: "1-2 days" },
      { minWeight: 5, maxWeight: 10, price: 30, deliveryTime: "2-3 days" },
    ],
    freeShippingThreshold: 200,
    active: true,
  },
  {
    id: "2",
    name: "Abu Dhabi",
    regions: ["All Abu Dhabi areas"],
    rates: [
      { minWeight: 0, maxWeight: 1, price: 20, deliveryTime: "2-3 days" },
      { minWeight: 1, maxWeight: 5, price: 25, deliveryTime: "2-3 days" },
      { minWeight: 5, maxWeight: 10, price: 35, deliveryTime: "3-4 days" },
    ],
    freeShippingThreshold: 250,
    active: true,
  },
  {
    id: "3",
    name: "Northern Emirates",
    regions: ["Sharjah", "Ajman", "RAK", "Fujairah", "UAQ"],
    rates: [
      { minWeight: 0, maxWeight: 1, price: 20, deliveryTime: "2-3 days" },
      { minWeight: 1, maxWeight: 5, price: 25, deliveryTime: "2-3 days" },
      { minWeight: 5, maxWeight: 10, price: 35, deliveryTime: "3-4 days" },
    ],
    freeShippingThreshold: 250,
    active: true,
  },
  {
    id: "4",
    name: "GCC Countries",
    regions: ["Saudi Arabia", "Kuwait", "Bahrain", "Oman", "Qatar"],
    rates: [
      { minWeight: 0, maxWeight: 1, price: 50, deliveryTime: "5-7 days" },
      { minWeight: 1, maxWeight: 5, price: 75, deliveryTime: "5-7 days" },
      { minWeight: 5, maxWeight: 10, price: 100, deliveryTime: "7-10 days" },
    ],
    freeShippingThreshold: null,
    active: false,
  },
];

export default function ShippingRatesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipping Rates</h1>
          <p className="text-muted-foreground">
            Configure shipping zones and rates for your products
          </p>
        </div>
        <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
          <Plus className="w-4 h-4 me-2" />
          Add Zone
        </Button>
      </div>

      {/* Global Settings */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Global Settings</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Default Processing Time
            </label>
            <div className="flex items-center gap-2">
              <Input type="number" defaultValue="1" className="w-20" />
              <span className="text-sm text-muted-foreground">to</span>
              <Input type="number" defaultValue="2" className="w-20" />
              <span className="text-sm text-muted-foreground">business days</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Handling Fee (per order)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">AED</span>
              <Input type="number" defaultValue="5" className="w-24" />
            </div>
          </div>
        </div>
      </Card>

      {/* Shipping Zones */}
      <div className="space-y-4">
        {SHIPPING_ZONES.map((zone, index) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn("overflow-hidden", !zone.active && "opacity-60")}>
              {/* Zone Header */}
              <div className="p-4 bg-muted/50 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-moulna-gold" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{zone.name}</h3>
                      {zone.freeShippingThreshold && (
                        <Badge variant="secondary" className="text-xs">
                          Free over AED {zone.freeShippingThreshold}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {zone.regions.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Active</span>
                    <Switch defaultChecked={zone.active} />
                  </div>
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Rates Table */}
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-start pb-2 text-sm font-medium text-muted-foreground">
                        Weight Range
                      </th>
                      <th className="text-start pb-2 text-sm font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="text-start pb-2 text-sm font-medium text-muted-foreground">
                        Delivery Time
                      </th>
                      <th className="text-end pb-2 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {zone.rates.map((rate, rateIndex) => (
                      <tr key={rateIndex} className="border-b last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {rate.minWeight} - {rate.maxWeight} kg
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">AED {rate.price}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{rate.deliveryTime}</span>
                          </div>
                        </td>
                        <td className="py-3 text-end">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="w-4 h-4 me-2" />
                  Add Rate
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Shipping Tips</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Offering free shipping can increase conversion rates by up to 30%</li>
              <li>• Consider flat-rate shipping for simplicity</li>
              <li>• Update delivery times during peak seasons</li>
              <li>• Enable same-day delivery in Dubai for competitive advantage</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
          <Save className="w-4 h-4 me-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
