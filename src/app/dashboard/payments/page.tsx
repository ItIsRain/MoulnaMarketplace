"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard, Plus, Trash2, Edit, Shield, CheckCircle,
  Wallet, Building, Star, MoreHorizontal
} from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "1",
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
    holderName: "Ahmed Hassan",
  },
  {
    id: "2",
    type: "card",
    brand: "Mastercard",
    last4: "8834",
    expiryMonth: 8,
    expiryYear: 2025,
    isDefault: false,
    holderName: "Ahmed Hassan",
  },
  {
    id: "3",
    type: "apple_pay",
    brand: "Apple Pay",
    last4: "iPhone",
    isDefault: false,
  },
];

const CARD_BRANDS: Record<string, { bg: string; text: string }> = {
  Visa: { bg: "bg-blue-600", text: "text-white" },
  Mastercard: { bg: "bg-orange-500", text: "text-white" },
  "Apple Pay": { bg: "bg-black", text: "text-white" },
  "Google Pay": { bg: "bg-white border", text: "text-gray-800" },
};

export default function PaymentsPage() {
  const [showAddCard, setShowAddCard] = React.useState(false);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="w-7 h-7 text-moulna-gold" />
              Payment Methods
            </h1>
            <p className="text-muted-foreground">
              Manage your saved payment methods
            </p>
          </div>
          <Button
            onClick={() => setShowAddCard(true)}
            className="bg-moulna-gold hover:bg-moulna-gold-dark"
          >
            <Plus className="w-4 h-4 me-2" />
            Add Payment Method
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Your payment info is secure</p>
              <p className="text-sm text-green-700">
                All card details are encrypted and processed through secure payment providers.
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {PAYMENT_METHODS.map((method, index) => {
            const brandStyle = CARD_BRANDS[method.brand] || { bg: "bg-gray-500", text: "text-white" };
            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "p-6",
                  method.isDefault && "ring-2 ring-moulna-gold ring-offset-2"
                )}>
                  <div className="flex items-center gap-4">
                    {/* Card Visual */}
                    <div className={cn(
                      "w-20 h-12 rounded-lg flex items-center justify-center",
                      brandStyle.bg, brandStyle.text
                    )}>
                      {method.type === "card" ? (
                        <CreditCard className="w-8 h-8" />
                      ) : (
                        <Wallet className="w-8 h-8" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{method.brand}</span>
                        {method.type === "card" && (
                          <span className="text-muted-foreground">•••• {method.last4}</span>
                        )}
                        {method.isDefault && (
                          <Badge className="bg-moulna-gold">Default</Badge>
                        )}
                      </div>
                      {method.type === "card" && method.expiryMonth && (
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                          {method.holderName && ` • ${method.holderName}`}
                        </p>
                      )}
                      {method.type === "apple_pay" && (
                        <p className="text-sm text-muted-foreground">
                          Connected to your {method.last4}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4 me-1" />
                          Set Default
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Add Card Form */}
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Add New Card</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" className="mt-1" />
                </div>
                <div>
                  <Label>Cardholder Name</Label>
                  <Input placeholder="Name on card" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" className="mt-1" />
                  </div>
                  <div>
                    <Label>CVC</Label>
                    <Input placeholder="123" className="mt-1" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
                  Add Card
                </Button>
                <Button variant="outline" onClick={() => setShowAddCard(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Other Payment Options */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Other Payment Options</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="p-4 border rounded-lg hover:border-moulna-gold transition-colors text-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🍎</span>
                </div>
                <div>
                  <p className="font-medium">Apple Pay</p>
                  <p className="text-sm text-muted-foreground">Pay with Face ID or Touch ID</p>
                </div>
              </div>
            </button>
            <button className="p-4 border rounded-lg hover:border-moulna-gold transition-colors text-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white border rounded-lg flex items-center justify-center">
                  <span className="text-2xl">G</span>
                </div>
                <div>
                  <p className="font-medium">Google Pay</p>
                  <p className="text-sm text-muted-foreground">Fast and secure checkout</p>
                </div>
              </div>
            </button>
          </div>
        </Card>

        {/* COD Notice */}
        <Card className="p-4 bg-moulna-gold/10 border-moulna-gold/20">
          <div className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-moulna-gold" />
            <div>
              <p className="font-medium">Cash on Delivery Available</p>
              <p className="text-sm text-muted-foreground">
                You can always pay cash when your order arrives. COD is available for orders up to AED 5,000.
              </p>
            </div>
          </div>
        </Card>
    </div>
  );
}
