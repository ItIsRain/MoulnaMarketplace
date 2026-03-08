"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export function DeleteAccountDialog({
  open,
  onOpenChange,
  shopName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopName?: string;
}) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const confirmPhrase = shopName || "delete my account";
  const [input, setInput] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const matches = input.trim().toLowerCase() === confirmPhrase.toLowerCase();

  // Reset input when dialog closes
  React.useEffect(() => {
    if (!open) {
      setInput("");
      setPassword("");
    }
  }, [open]);

  const handleDelete = async () => {
    if (!matches || !password) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/settings/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        await logout();
        toast.success("Account deleted successfully");
        router.push("/");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete account");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
          </div>
          <DialogDescription>
            This action is <strong className="text-foreground">permanent and irreversible</strong>.
            All your data, listings, shop, messages, and history will be permanently erased.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-4">
            <p className="text-sm text-red-700 dark:text-red-300 mb-1">
              To confirm, type your {shopName ? "shop name" : "confirmation phrase"}:
            </p>
            <p className="font-mono text-sm font-semibold text-red-900 dark:text-red-200 bg-red-100 dark:bg-red-900/40 rounded px-3 py-2 select-all">
              {confirmPhrase}
            </p>
          </div>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type "${confirmPhrase}" to confirm...`}
            className="font-mono"
            autoComplete="off"
            spellCheck={false}
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password to confirm"
            autoComplete="current-password"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-40"
            onClick={handleDelete}
            disabled={!matches || !password || isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 me-2 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4 me-2" />
            )}
            {isDeleting ? "Deleting..." : "Delete My Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
