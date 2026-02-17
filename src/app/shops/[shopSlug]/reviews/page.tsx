"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Star } from "lucide-react";

export default function ShopReviewsPage() {
  const params = useParams();
  const shopSlug = params.shopSlug as string;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <Card className="p-12 text-center max-w-lg mx-auto">
            <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Reviews are not available</h3>
            <p className="text-muted-foreground mb-6">
              Our marketplace focuses on direct communication between buyers and sellers.
            </p>
            <Button variant="gold" asChild>
              <Link href={`/shops/${shopSlug}`}>Back to Shop</Link>
            </Button>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
