"use client";

import * as React from "react";
import { Clock } from "lucide-react";

interface AuctionCountdownProps {
  closesAt: string;
  onExpired?: () => void;
}

export function AuctionCountdown({ closesAt, onExpired }: AuctionCountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState("");
  const [urgent, setUrgent] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      const now = Date.now();
      const end = new Date(closesAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Closed");
        setUrgent(false);
        onExpired?.();
        return false;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(" "));
      setUrgent(diff < 1000 * 60 * 60); // < 1 hour
      return true;
    };

    if (!update()) return;

    const interval = setInterval(() => {
      if (!update()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [closesAt, onExpired]);

  if (timeLeft === "Closed") {
    return (
      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Clock className="w-4 h-4" />
        Auction closed
      </span>
    );
  }

  return (
    <span
      className={`text-sm font-mono font-medium flex items-center gap-1.5 ${
        urgent ? "text-red-600" : "text-muted-foreground"
      }`}
    >
      <Clock className={`w-4 h-4 ${urgent ? "animate-pulse" : ""}`} />
      {timeLeft}
    </span>
  );
}
