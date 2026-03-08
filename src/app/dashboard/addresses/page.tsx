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
  Check, Star, Phone, X, Loader2
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "moulna-addresses";

interface Address {
  id: string;
  label: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  emirate: string;
  isDefault: boolean;
}

const EMPTY_FORM: Omit<Address, "id"> = {
  label: "",
  type: "home",
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  emirate: "Dubai",
  isDefault: false,
};

function loadAddresses(): Address[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAddresses(addresses: Address[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  } catch {
    // ignore quota errors
  }
}

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form state
  const [form, setForm] = React.useState<Omit<Address, "id">>(EMPTY_FORM);

  // Load addresses from localStorage on mount
  React.useEffect(() => {
    const loaded = loadAddresses();
    setAddresses(loaded);
    setIsLoading(false);
  }, []);

  // Persist whenever addresses change (skip initial load)
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveAddresses(addresses);
  }, [addresses]);

  const updateForm = (field: keyof Omit<Address, "id">, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getLabelFromType = (type: string) => {
    switch (type) {
      case "home": return "Home";
      case "work": return "Work";
      default: return "Other";
    }
  };

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsAddingNew(true);
  };

  const openEditModal = (address: Address) => {
    setForm({
      label: address.label,
      type: address.type,
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      emirate: address.emirate,
      isDefault: address.isDefault,
    });
    setIsAddingNew(false);
    setEditingId(address.id);
  };

  const closeModal = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Please enter a name.");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Please enter a phone number.");
      return;
    }
    if (!form.addressLine1.trim()) {
      toast.error("Please enter an address.");
      return;
    }

    setIsSaving(true);

    try {
      const label = form.label.trim() || getLabelFromType(form.type);

      if (editingId) {
        // Update existing address
        setAddresses((prev) =>
          prev.map((addr) => {
            if (addr.id === editingId) {
              return { ...addr, ...form, label };
            }
            // If we're setting this as default, unset others
            if (form.isDefault && addr.id !== editingId) {
              return { ...addr, isDefault: false };
            }
            return addr;
          })
        );
        toast.success("Address updated.");
      } else {
        // Create new address
        const newAddress: Address = {
          id: `addr_${Date.now()}`,
          ...form,
          label,
        };

        setAddresses((prev) => {
          let updated = [...prev, newAddress];
          // If new address is default, unset others
          if (newAddress.isDefault) {
            updated = updated.map((addr) =>
              addr.id === newAddress.id ? addr : { ...addr, isDefault: false }
            );
          }
          // If it's the first address, make it default
          if (updated.length === 1) {
            updated[0].isDefault = true;
          }
          return updated;
        });
        toast.success("Address added.");
      }

      closeModal();
    } finally {
      setIsSaving(false);
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success("Default address updated.");
  };

  const deleteAddress = (id: string) => {
    const addr = addresses.find((a) => a.id === id);
    if (addr?.isDefault) {
      toast.error("Cannot delete the default address. Set another as default first.");
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address deleted.");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            Saved Addresses
          </h1>
          <p className="text-muted-foreground">
            Manage your saved locations
          </p>
        </div>
        <Button variant="gold" onClick={openAddModal}>
          <Plus className="w-4 h-4 me-2" />
          Add Address
        </Button>
      </div>

      {/* Address List */}
      {addresses.length > 0 && (
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
                      onClick={() => openEditModal(address)}
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
      )}

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
                  onClick={closeModal}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Label</label>
                  <div className="flex gap-2">
                    {[
                      { type: "home" as const, label: "Home", icon: Home },
                      { type: "work" as const, label: "Work", icon: Building2 },
                      { type: "other" as const, label: "Other", icon: MapPin },
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() => {
                          updateForm("type", option.type);
                          if (!form.label.trim() || form.label === getLabelFromType(form.type)) {
                            updateForm("label", option.label);
                          }
                        }}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors",
                          form.type === option.type
                            ? "border-moulna-gold bg-moulna-gold/10 text-moulna-gold"
                            : "hover:border-moulna-gold"
                        )}
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
                    <Input
                      placeholder="Name for this address"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                    <Input
                      placeholder="+971 50 000 0000"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Line 1</label>
                  <Input
                    placeholder="Street address, villa/building number"
                    value={form.addressLine1}
                    onChange={(e) => updateForm("addressLine1", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address Line 2 (Optional)</label>
                  <Input
                    placeholder="Apartment, suite, floor, landmark"
                    value={form.addressLine2}
                    onChange={(e) => updateForm("addressLine2", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">City</label>
                    <Input
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Emirate</label>
                    <select
                      value={form.emirate}
                      onChange={(e) => updateForm("emirate", e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                    >
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
                    checked={form.isDefault}
                    onChange={(e) => updateForm("isDefault", e.target.checked)}
                    className="rounded text-moulna-gold focus:ring-moulna-gold"
                  />
                  <label htmlFor="setDefault" className="text-sm">
                    Set as default meetup location
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gold"
                    className="flex-1"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="w-4 h-4 me-2 animate-spin" />}
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
            Add your first location to easily share meetup spots with sellers
          </p>
          <Button variant="gold" onClick={openAddModal}>
            <Plus className="w-4 h-4 me-2" />
            Add Address
          </Button>
        </Card>
      )}
    </div>
  );
}
