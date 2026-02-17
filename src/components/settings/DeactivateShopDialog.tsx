"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PauseCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export function DeactivateShopDialog({
  open,
  onOpenChange,
  shopName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopName: string;
}) {
  const { fetchProfile } = useAuthStore();
  const [input, setInput] = React.useState("");
  const [isDeactivating, setIsDeactivating] = React.useState(false);

  const matches = input.trim().toLowerCase() === shopName.toLowerCase();

  React.useEffect(() => {
    if (!open) setInput("");
  }, [open]);

  const handleDeactivate = async () => {
    if (!matches) return;

    setIsDeactivating(true);
    try {
      const res = await fetch("/api/settings/shop", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });
      if (res.ok) {
        await fetchProfile();
        toast.success("Shop deactivated. Your listings are now hidden.");
        onOpenChange(false);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to deactivate shop");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center flex-shrink-0">
              <PauseCircle className="w-5 h-5 text-orange-600" />
            </div>
            <DialogTitle className="text-orange-600">Deactivate Shop</DialogTitle>
          </div>
          <DialogDescription>
            Your shop and all listings will be <strong className="text-foreground">temporarily hidden</strong> from
            buyers. You can reactivate anytime from settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20 p-4">
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-1">
              To confirm, type your shop name:
            </p>
            <p className="font-mono text-sm font-semibold text-orange-900 dark:text-orange-200 bg-orange-100 dark:bg-orange-900/40 rounded px-3 py-2 select-all">
              {shopName}
            </p>
          </div>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type "${shopName}" to confirm...`}
            className="font-mono"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeactivating}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 disabled:opacity-40"
            onClick={handleDeactivate}
            disabled={!matches || isDeactivating}
          >
            {isDeactivating ? (
              <Loader2 className="w-4 h-4 me-2 animate-spin" />
            ) : (
              <PauseCircle className="w-4 h-4 me-2" />
            )}
            {isDeactivating ? "Deactivating..." : "Deactivate Shop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
