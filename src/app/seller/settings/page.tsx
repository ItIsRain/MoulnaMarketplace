"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Settings, Store, User, Bell, Shield, CreditCard,
  Truck, MapPin, Mail, Phone, Globe, Instagram,
  Camera, Save, ExternalLink
} from "lucide-react";

const TABS = [
  { id: "shop", label: "Shop Profile", icon: Store },
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "security", label: "Security", icon: Shield },
];

export default function SellerSettingsPage() {
  const [activeTab, setActiveTab] = React.useState("shop");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <Settings className="w-6 h-6" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your shop and account settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <Card className="lg:w-64 p-2 h-fit">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-moulna-gold text-white"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Shop Profile */}
          {activeTab === "shop" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Shop Branding</h2>

                {/* Shop Banner */}
                <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-r from-moulna-gold/20 to-moulna-charcoal/20 mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
                    alt="Shop banner"
                    fill
                    className="object-cover"
                  />
                  <button className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 text-sm font-medium hover:bg-white transition-colors">
                    <Camera className="w-4 h-4" />
                    Change Banner
                  </button>
                </div>

                {/* Shop Logo */}
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <DiceBearAvatar
                      seed="scent-of-arabia"
                      size="3xl"
                      className="border-4 border-white shadow-lg"
                    />
                    <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-moulna-gold text-white hover:bg-moulna-gold-dark transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Shop Name</label>
                      <Input defaultValue="Scent of Arabia" className="max-w-md" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Shop URL</label>
                      <div className="flex items-center gap-2 max-w-md">
                        <span className="text-sm text-muted-foreground">moulna.ae/shop/</span>
                        <Input defaultValue="scent-of-arabia" className="flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-6">Shop Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Tagline</label>
                    <Input
                      defaultValue="Authentic Arabian fragrances, crafted with love"
                      placeholder="A short description of your shop"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">About Your Shop</label>
                    <textarea
                      rows={4}
                      defaultValue="We craft luxurious Arabian oud perfumes using traditional methods passed down through generations. Each fragrance tells a story of heritage and elegance."
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Category</label>
                      <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold">
                        <option>Perfumes & Oud</option>
                        <option>Jewelry</option>
                        <option>Home Décor</option>
                        <option>Fashion</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input defaultValue="Dubai, UAE" className="ps-9" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-6">Social Links</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                      <Instagram className="w-4 h-4" /> Instagram
                    </label>
                    <Input placeholder="@yourusername" defaultValue="@scentofarabia" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Website
                    </label>
                    <Input placeholder="https://yourwebsite.com" />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button variant="gold">
                  <Save className="w-4 h-4 me-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Account Settings */}
          {activeTab === "account" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">First Name</label>
                      <Input defaultValue="Sarah" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Last Name</label>
                      <Input defaultValue="Al-Maktoum" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </label>
                    <Input defaultValue="sarah@scentofarabia.ae" type="email" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone Number
                    </label>
                    <Input defaultValue="+971 50 123 4567" type="tel" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-6">Business Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Trade License Number</label>
                    <Input placeholder="Enter your trade license number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">VAT Number (Optional)</label>
                    <Input placeholder="Enter your VAT registration number" />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button variant="gold">
                  <Save className="w-4 h-4 me-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Order Notifications</h2>
                <div className="space-y-4">
                  {[
                    { id: "new_order", label: "New order received", description: "Get notified when a customer places an order", enabled: true },
                    { id: "order_cancelled", label: "Order cancelled", description: "Get notified when a customer cancels an order", enabled: true },
                    { id: "review_received", label: "New review received", description: "Get notified when a customer leaves a review", enabled: true },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-moulna-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-6">Marketing & Promotions</h2>
                <div className="space-y-4">
                  {[
                    { id: "tips", label: "Seller tips & best practices", description: "Receive tips to help grow your business", enabled: true },
                    { id: "promotions", label: "Promotional opportunities", description: "Get notified about featuring and promotion opportunities", enabled: false },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-moulna-gold peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Payments */}
          {activeTab === "payments" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Payout Method</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border-2 border-moulna-gold bg-moulna-gold/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-moulna-gold/20">
                          <CreditCard className="w-5 h-5 text-moulna-gold" />
                        </div>
                        <div>
                          <p className="font-medium">Bank Account</p>
                          <p className="text-sm text-muted-foreground">Emirates NBD •••• 4521</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Primary</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-6">Payout Schedule</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Payout Frequency</label>
                    <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold">
                      <option>Weekly (every Monday)</option>
                      <option>Bi-weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Next payout: <span className="font-medium text-foreground">AED 12,450.00</span> on <span className="font-medium text-foreground">Monday, Feb 19</span>
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Shipping */}
          {activeTab === "shipping" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Shipping Profiles</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Standard UAE Shipping</h3>
                      <Badge>Default</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Dubai: Free shipping</p>
                      <p>Other Emirates: AED 15</p>
                      <p>Processing time: 1-2 business days</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      Edit Profile
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Shipping Profile
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-6">Return Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Address Line 1</label>
                    <Input defaultValue="Business Bay, Churchill Towers" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">City</label>
                      <Input defaultValue="Dubai" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Emirate</label>
                      <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold">
                        <option>Dubai</option>
                        <option>Abu Dhabi</option>
                        <option>Sharjah</option>
                        <option>Ajman</option>
                        <option>RAK</option>
                        <option>Fujairah</option>
                        <option>UAQ</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button variant="gold">
                  <Save className="w-4 h-4 me-2" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="font-semibold mb-6">Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Current Password</label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">New Password</label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
                    <Input type="password" />
                  </div>
                  <Button variant="gold">Update Password</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-6">Two-Factor Authentication</h2>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">Set Up</Button>
                </div>
              </Card>

              <Card className="p-6 border-red-200 dark:border-red-900">
                <h2 className="font-semibold mb-6 text-red-600">Danger Zone</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div>
                      <p className="font-medium">Deactivate Shop</p>
                      <p className="text-sm text-muted-foreground">
                        Temporarily hide your shop from customers
                      </p>
                    </div>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      Deactivate
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your seller account
                      </p>
                    </div>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
