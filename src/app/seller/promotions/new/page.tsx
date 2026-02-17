"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatAED } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Rocket, CheckCircle, Loader2, Package, Sparkles
} from "lucide-react";

interface SellerProduct {
  id: string;
  title: string;
  slug: string;
  images: string[];
  price_fils: number;
  status: string;
}

const DURATIONS = [
  { days: 3, label: "3 Days", description: "Quick visibility boost" },
  { days: 7, label: "7 Days", description: "Most popular", popular: true },
  { days: 14, label: "14 Days", description: "Extended reach" },
  { days: 30, label: "30 Days", description: "Maximum exposure" },
];

const PRICE_PER_DAY_FILS = 1500; // Will be fetched from API in checkout

export default function NewBoostPage() {
  const [step, setStep] = React.useState(1);
  const [products, setProducts] = React.useState<SellerProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProduct, setSelectedProduct] = React.useState<SellerProduct | null>(null);
  const [selectedDuration, setSelectedDuration] = React.useState(7);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch("/api/seller/products?status=active")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalFils = PRICE_PER_DAY_FILS * selectedDuration;

  const handleCheckout = async () => {
    if (!selectedProduct) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/ads/boost/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          durationDays: selectedDuration,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create checkout session");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold">Boost a Product</h1>
          <p className="text-muted-foreground">
            Get your product featured at the top of explore &amp; search
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {[
          { num: 1, label: "Select Product" },
          { num: 2, label: "Choose Duration" },
          { num: 3, label: "Confirm & Pay" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step >= s.num
                  ? "bg-moulna-gold text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
            </div>
            <span className={cn("text-sm hidden sm:block", step >= s.num ? "font-medium" : "text-muted-foreground")}>
              {s.label}
            </span>
            {s.num < 3 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Product */}
      {step === 1 && (
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Select a product to boost</h2>
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active products to boost</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/seller/products">Go to Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setStep(2);
                  }}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-moulna-gold/50",
                    selectedProduct?.id === product.id
                      ? "border-moulna-gold bg-moulna-gold/5"
                      : "border-muted"
                  )}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 relative">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium line-clamp-2 mb-1">{product.title}</h3>
                  <p className="text-sm text-moulna-gold font-semibold">
                    {formatAED(product.price_fils)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Step 2: Choose Duration */}
      {step === 2 && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Choose boost duration</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {DURATIONS.map((d) => (
                  <div
                    key={d.days}
                    onClick={() => setSelectedDuration(d.days)}
                    className={cn(
                      "p-5 rounded-lg border-2 cursor-pointer transition-all relative",
                      selectedDuration === d.days
                        ? "border-moulna-gold bg-moulna-gold/5"
                        : "border-muted hover:border-moulna-gold/50"
                    )}
                  >
                    {d.popular && (
                      <Badge variant="sponsored" className="absolute -top-2.5 right-3 text-xs">
                        Popular
                      </Badge>
                    )}
                    <h3 className="text-xl font-bold mb-1">{d.label}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{d.description}</p>
                    <p className="text-lg font-semibold text-moulna-gold">
                      {formatAED(PRICE_PER_DAY_FILS * d.days)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatAED(PRICE_PER_DAY_FILS)}/day
                    </p>
                    {selectedDuration === d.days && (
                      <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-moulna-gold" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  className="bg-moulna-gold hover:bg-moulna-gold-dark"
                  onClick={() => setStep(3)}
                >
                  Continue
                </Button>
              </div>
            </Card>
          </div>

          {/* Selected Product Sidebar */}
          <Card className="p-6 h-fit">
            <h3 className="font-semibold mb-3">Selected Product</h3>
            {selectedProduct && (
              <div>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3 relative">
                  {selectedProduct.images[0] ? (
                    <Image
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium line-clamp-2">{selectedProduct.title}</h4>
                <p className="text-sm text-moulna-gold font-semibold">
                  {formatAED(selectedProduct.price_fils)}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-500 hover:underline mt-2"
                >
                  Change product
                </button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Step 3: Confirm & Pay */}
      {step === 3 && selectedProduct && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="font-semibold mb-6">Boost Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{selectedProduct.title}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{selectedDuration} days</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Rate</span>
                  <span>{formatAED(PRICE_PER_DAY_FILS)}/day</span>
                </div>
                <div className="flex justify-between py-3 text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-moulna-gold">{formatAED(totalFils)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  className="bg-moulna-gold hover:bg-moulna-gold-dark flex-1"
                  onClick={handleCheckout}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 me-2 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 me-2" />
                      Proceed to Payment — {formatAED(totalFils)}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* What you get */}
          <Card className="p-6 h-fit bg-moulna-gold/5 border-moulna-gold/20">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-moulna-gold" />
              What you get
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Your product appears at the top of explore &amp; search results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Eye-catching &quot;Sponsored&quot; golden badge</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Impression &amp; click tracking on your promotions dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Boost starts immediately after payment</span>
              </li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
