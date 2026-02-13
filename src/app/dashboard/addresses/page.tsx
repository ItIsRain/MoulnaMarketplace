"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Plus, Edit2, Trash2, Home, Building2,
  Check, Star, Phone, X
} from "lucide-react";

const ADDRESSES = [
  {
    id: "addr_1",
    label: "Home",
    type: "home",
    name: "Sarah Al-Maktoum",
    phone: "+971 50 123 4567",
    addressLine1: "Villa 23, Al Wasl Road",
    addressLine2: "Near Emirates School",
    city: "Dubai",
    emirate: "Dubai",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Work",
    type: "work",
    name: "Sarah Al-Maktoum",
    phone: "+971 50 123 4567",
    addressLine1: "Office 405, Business Bay",
    addressLine2: "Churchill Towers, Tower B",
    city: "Dubai",
    emirate: "Dubai",
    isDefault: false,
  },
  {
    id: "addr_3",
    label: "Parents' House",
    type: "other",
    name: "Mohammed Al-Maktoum",
    phone: "+971 50 987 6543",
    addressLine1: "House 12, Khalidiya",
    addressLine2: "Near Abu Dhabi Mall",
    city: "Abu Dhabi",
    emirate: "Abu Dhabi",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState(ADDRESSES);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return Home;
      case "work":
        return Building2;
      default:
        return MapPin;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            Saved Addresses
          </h1>
          <p className="text-muted-foreground">
            Manage your delivery addresses
          </p>
        </div>
        <Button variant="gold" onClick={() => setIsAddingNew(true)}>
          <Plus className="w-4 h-4 me-2" />
          Add Address
        </Button>
      </div>

      {/* Address List */}
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((address, index) => {
          const TypeIcon = getTypeIcon(address.type);

          return (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "p-6 relative",
                address.isDefault && "border-moulna-gold"
              )}>
                {address.isDefault && (
                  <Badge className="absolute top-4 right-4 bg-moulna-gold">
                    <Star className="w-3 h-3 me-1" />
                    Default
                  </Badge>
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    address.type === "home" && "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
                    address.type === "work" && "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
                    address.type === "other" && "bg-muted text-muted-foreground"
                  )}>
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{address.label}</h3>
                    </div>
                    <p className="font-medium text-sm">{address.name}</p>
                    <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.emirate}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {address.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultAddress(address.id)}
                    >
                      <Check className="w-4 h-4 me-2" />
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(address.id)}
                  >
                    <Edit2 className="w-4 h-4 me-2" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteAddress(address.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Address Modal */}
      {(isAddingNew || editingId) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingId(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Label</label>
                  <div className="flex gap-2">
                    {[
                      { type: "home", label: "Home", icon: Home },
                      { type: "work", label: "Work", icon: Building2 },
                      { type: "other", label: "Other", icon: MapPin },
                    ].map((option) => (
                      <button
                        key={option.type}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border hover:border-moulna-gold transition-colors"
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                    <Input placeholder="Name for this address" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                    <Input placeholder="+971 50 000 0000" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Line 1</label>
                  <Input placeholder="Street address, villa/building number" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Line 2 (Optional)</label>
                  <Input placeholder="Apartment, suite, floor, landmark" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">City</label>
                    <Input placeholder="City" />
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

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="setDefault"
                    className="rounded text-moulna-gold focus:ring-moulna-gold"
                  />
                  <label htmlFor="setDefault" className="text-sm">
                    Set as default delivery address
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="gold" className="flex-1">
                    {editingId ? "Save Changes" : "Add Address"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {addresses.length === 0 && (
        <Card className="p-12 text-center">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No saved addresses</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Add your first delivery address to make checkout faster
          </p>
          <Button variant="gold" onClick={() => setIsAddingNew(true)}>
            <Plus className="w-4 h-4 me-2" />
            Add Address
          </Button>
        </Card>
      )}
    </div>
  );
}
