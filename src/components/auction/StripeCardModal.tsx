"use client";

import * as React from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripeClient } from "@/lib/stripe-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react";

export interface SavedCard {
  paymentMethodId: string;
  brand: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
}

interface StripeCardModalProps {
  open: boolean;
  onClose: () => void;
  clientSecret: string | null;
  onConfirmed: (setupIntentId: string) => void;
  onUseSavedCard?: (paymentMethodId: string, customerId: string) => void;
  savedCard?: SavedCard | null;
  customerId?: string | null;
  loading?: boolean;
}

function CardForm({
  onConfirmed,
  onClose,
  onSwitchToSaved,
  hasSavedCard,
}: {
  onConfirmed: (setupIntentId: string) => void;
  onClose: () => void;
  onSwitchToSaved?: () => void;
  hasSavedCard?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError("");

    const result = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message || "Card verification failed");
      setSubmitting(false);
    } else if (result.setupIntent) {
      onConfirmed(result.setupIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="max-h-[50vh] overflow-y-auto pe-1">
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { address: "never" } },
          }}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Your card is saved securely. You will NOT be charged now.</span>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={submitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || submitting}
          className="flex-1 bg-moulna-gold hover:bg-moulna-gold-dark"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 me-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 me-2" />
              Save Card
            </>
          )}
        </Button>
      </div>

      {hasSavedCard && onSwitchToSaved && (
        <button
          type="button"
          onClick={onSwitchToSaved}
          className="w-full text-center text-sm text-moulna-gold hover:underline"
        >
          Use saved card instead
        </button>
      )}
    </form>
  );
}

function SavedCardView({
  savedCard,
  onUseSavedCard,
  onUseNewCard,
  onClose,
}: {
  savedCard: SavedCard;
  onUseSavedCard: () => void;
  onUseNewCard: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="p-4 border-2 border-moulna-gold rounded-lg bg-moulna-gold/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-moulna-gold" />
          </div>
          <div className="flex-1">
            <p className="font-medium capitalize">
              {savedCard.brand} ending in {savedCard.last4}
            </p>
            {savedCard.expMonth && savedCard.expYear && (
              <p className="text-sm text-muted-foreground">
                Expires {String(savedCard.expMonth).padStart(2, "0")}/{savedCard.expYear}
              </p>
            )}
          </div>
          <CheckCircle className="w-5 h-5 text-moulna-gold" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Your card will NOT be charged now. Only if you win and are approved.</span>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={onUseSavedCard}
          className="flex-1 bg-moulna-gold hover:bg-moulna-gold-dark"
        >
          <CreditCard className="w-4 h-4 me-2" />
          Use This Card
        </Button>
      </div>

      <button
        type="button"
        onClick={onUseNewCard}
        className="w-full text-center text-sm text-moulna-gold hover:underline"
      >
        Use a different card
      </button>
    </div>
  );
}

export function StripeCardModal({
  open,
  onClose,
  clientSecret,
  onConfirmed,
  onUseSavedCard,
  savedCard,
  customerId,
  loading,
}: StripeCardModalProps) {
  const stripePromise = getStripeClient();
  const [showNewCard, setShowNewCard] = React.useState(false);

  // Reset to saved card view when modal opens
  React.useEffect(() => {
    if (open) setShowNewCard(false);
  }, [open]);

  const hasSavedCard = !!savedCard && !!customerId;
  const showSaved = hasSavedCard && !showNewCard;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {showSaved ? "Confirm Payment Method" : "Save Payment Method"}
          </DialogTitle>
          <DialogDescription>
            Your card will be saved securely. You will only be charged if you
            win and are approved by admin.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Preparing secure form...
            </p>
          </div>
        ) : showSaved ? (
          <SavedCardView
            savedCard={savedCard!}
            onUseSavedCard={() => {
              onUseSavedCard?.(savedCard!.paymentMethodId, customerId!);
            }}
            onUseNewCard={() => setShowNewCard(true)}
            onClose={onClose}
          />
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#D4A853",
                },
              },
            }}
          >
            <CardForm
              onConfirmed={onConfirmed}
              onClose={onClose}
              onSwitchToSaved={() => setShowNewCard(false)}
              hasSavedCard={hasSavedCard}
            />
          </Elements>
        ) : (
          <div className="py-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Loading payment form...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
