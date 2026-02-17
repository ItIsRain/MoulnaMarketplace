"use client";

import { formatAED, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Gavel, Zap } from "lucide-react";

interface Bid {
  amountFils: number;
  shopName: string;
  isBuyNow: boolean;
  createdAt: string;
}

interface BidHistoryProps {
  bids: Bid[];
}

export function BidHistory({ bids }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No bids yet. Be the first to bid!
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {bids.map((bid, i) => (
        <div
          key={`${bid.shopName}-${bid.createdAt}`}
          className={`flex items-center justify-between p-3 rounded-lg ${
            i === 0 ? "bg-moulna-gold/5 border border-moulna-gold/20" : "bg-muted/50"
          }`}
        >
          <div className="flex items-center gap-2">
            {bid.isBuyNow ? (
              <Zap className="w-4 h-4 text-amber-500" />
            ) : (
              <Gavel className="w-4 h-4 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">{bid.shopName}</p>
              <p className="text-xs text-muted-foreground">{timeAgo(bid.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {bid.isBuyNow && (
              <Badge variant="gold" className="text-xs">Buy Now</Badge>
            )}
            <span className={`font-semibold text-sm ${i === 0 ? "text-moulna-gold" : ""}`}>
              {formatAED(bid.amountFils)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
