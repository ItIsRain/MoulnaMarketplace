"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function SellerReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-3">
          <Star className="w-6 h-6 text-moulna-gold" />
          Reviews
        </h1>
      </div>
      <Card className="p-12 text-center">
        <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">Reviews are not available</h3>
        <p className="text-muted-foreground mb-6">
          Our marketplace focuses on direct communication between buyers and sellers.
        </p>
        <Button variant="gold" asChild>
          <Link href="/seller">Back to Dashboard</Link>
        </Button>
      </Card>
    </div>
  );
}
