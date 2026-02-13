"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn, formatAED } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft, ChevronRight, MapPin, CreditCard, Check,
  Sparkles, Truck, Shield, Package, Loader2
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Shipping", icon: MapPin },
  { id: 2, title: "Payment", icon: CreditCard },
  { id: 3, title: "Review", icon: Check },
];

const EMIRATES = [
  "Dubai", "Abu Dhabi", "Sharjah", "Ajman",
  "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"
];

// Mock cart summary
const CART_SUMMARY = {
  items: [
    {
      title: "Handcrafted Arabian Oud Perfume",
      variant: "100ml",
      quantity: 1,
      priceFils: 45000,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100",
    },
    {
      title: "Gold-Plated Pearl Earrings",
      quantity: 2,
      priceFils: 32000,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100",
    },
  ],
  subtotal: 109000,
  discount: 10900,
  shipping: 0,
  total: 98100,
  totalXP: 109,
};

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  // Form state
  const [shippingAddress, setShippingAddress] = React.useState({
    fullName: "",
    phone: "",
    emirate: "",
    area: "",
    street: "",
    building: "",
    apartment: "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "cod">("card");
  const [cardDetails, setCardDetails] = React.useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const updateShipping = (field: keyof typeof shippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const updateCard = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return shippingAddress.fullName && shippingAddress.phone &&
               shippingAddress.emirate && shippingAddress.street;
      case 2:
        return paymentMethod === "cod" || (
          cardDetails.number && cardDetails.expiry && cardDetails.cvc
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push("/checkout/success");
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link href="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Cart</span>
            </Link>

            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/moulna-logo.svg"
                alt="Moulna"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    step >= s.id
                      ? "bg-moulna-gold text-white"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step > s.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={cn(
                    "font-medium hidden sm:block",
                    step >= s.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-4 h-0.5 bg-muted">
                    <div
                      className="h-full bg-moulna-gold transition-all"
                      style={{ width: step > s.id ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <Progress value={progress} className="h-1" indicatorClassName="bg-moulna-gold" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-6">
                      Shipping Address
                    </h2>

                    <div className="grid gap-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name *</label>
                          <Input
                            placeholder="Your full name"
                            value={shippingAddress.fullName}
                            onChange={(e) => updateShipping("fullName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number *</label>
                          <Input
                            placeholder="+971 XX XXX XXXX"
                            value={shippingAddress.phone}
                            onChange={(e) => updateShipping("phone", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Emirate *</label>
                        <select
                          value={shippingAddress.emirate}
                          onChange={(e) => updateShipping("emirate", e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border bg-background"
                        >
                          <option value="">Select emirate</option>
                          {EMIRATES.map((e) => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Area</label>
                          <Input
                            placeholder="e.g., Downtown, JBR"
                            value={shippingAddress.area}
                            onChange={(e) => updateShipping("area", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Street Address *</label>
                          <Input
                            placeholder="Street name"
                            value={shippingAddress.street}
                            onChange={(e) => updateShipping("street", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Building Name/Number</label>
                          <Input
                            placeholder="Building name or number"
                            value={shippingAddress.building}
                            onChange={(e) => updateShipping("building", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Apartment/Villa</label>
                          <Input
                            placeholder="Apt, suite, or villa number"
                            value={shippingAddress.apartment}
                            onChange={(e) => updateShipping("apartment", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Landmark (optional)</label>
                        <Input
                          placeholder="Near a famous landmark"
                          value={shippingAddress.landmark}
                          onChange={(e) => updateShipping("landmark", e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-6">
                      Payment Method
                    </h2>

                    <div className="space-y-4 mb-6">
                      {/* Card Payment */}
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={cn(
                          "w-full p-4 rounded-lg border-2 text-start transition-all",
                          paymentMethod === "card"
                            ? "border-moulna-gold bg-moulna-gold/5"
                            : "border-muted hover:border-moulna-gold/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            paymentMethod === "card" ? "border-moulna-gold" : "border-muted-foreground"
                          )}>
                            {paymentMethod === "card" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-moulna-gold" />
                            )}
                          </div>
                          <CreditCard className="w-5 h-5" />
                          <span className="font-medium">Credit / Debit Card</span>
                        </div>
                      </button>

                      {/* COD */}
                      <button
                        onClick={() => setPaymentMethod("cod")}
                        className={cn(
                          "w-full p-4 rounded-lg border-2 text-start transition-all",
                          paymentMethod === "cod"
                            ? "border-moulna-gold bg-moulna-gold/5"
                            : "border-muted hover:border-moulna-gold/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            paymentMethod === "cod" ? "border-moulna-gold" : "border-muted-foreground"
                          )}>
                            {paymentMethod === "cod" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-moulna-gold" />
                            )}
                          </div>
                          <Package className="w-5 h-5" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                      </button>
                    </div>

                    {/* Card Form */}
                    {paymentMethod === "card" && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Card Number</label>
                          <Input
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) => updateCard("number", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Expiry Date</label>
                            <Input
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) => updateCard("expiry", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">CVC</label>
                            <Input
                              placeholder="123"
                              value={cardDetails.cvc}
                              onChange={(e) => updateCard("cvc", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name on Card</label>
                          <Input
                            placeholder="Name as shown on card"
                            value={cardDetails.name}
                            onChange={(e) => updateCard("name", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Shipping Summary */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Shipping Address</h3>
                      <Button variant="link" size="sm" onClick={() => setStep(1)}>
                        Edit
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.phone}</p>
                      <p>{shippingAddress.street}, {shippingAddress.building}</p>
                      <p>{shippingAddress.area}, {shippingAddress.emirate}</p>
                    </div>
                  </Card>

                  {/* Payment Summary */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Payment Method</h3>
                      <Button variant="link" size="sm" onClick={() => setStep(2)}>
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {paymentMethod === "card" ? (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Card ending in ****{cardDetails.number.slice(-4) || "0000"}</span>
                        </>
                      ) : (
                        <>
                          <Package className="w-5 h-5" />
                          <span>Cash on Delivery</span>
                        </>
                      )}
                    </div>
                  </Card>

                  {/* XP Preview */}
                  <Card className="p-6 bg-gradient-to-r from-moulna-gold/10 to-transparent">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-moulna-gold" />
                      </div>
                      <div>
                        <p className="font-semibold">You&apos;ll earn XP!</p>
                        <p className="text-sm text-muted-foreground">
                          Complete this order to earn <span className="text-moulna-gold font-bold">+{CART_SUMMARY.totalXP} XP</span>
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-4 mt-6">
              {step > 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 me-2" />
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="flex-1"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ms-2" />
                </Button>
              ) : (
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Place Order
                      <Check className="w-4 h-4 ms-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="font-semibold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-4">
                {CART_SUMMARY.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <div className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-moulna-gold text-white text-xs flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      {formatAED(item.priceFils * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatAED(CART_SUMMARY.subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount (WELCOME10)</span>
                  <span>-{formatAED(CART_SUMMARY.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatAED(CART_SUMMARY.total)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-2">
                {[
                  { icon: Shield, label: "Buyer Protection" },
                  { icon: Truck, label: "Free Returns within 14 days" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
