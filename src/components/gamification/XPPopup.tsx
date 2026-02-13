"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface XPPopupProps {
  amount: number;
  show: boolean;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function XPPopup({
  amount,
  show,
  onComplete,
  className,
  style,
}: XPPopupProps) {
  React.useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, -20, -40, -60],
            scale: [0.8, 1.2, 1.1, 0.9],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn(
            "fixed z-50 pointer-events-none flex items-center gap-1 px-3 py-1.5 rounded-full bg-moulna-gold text-white font-bold shadow-lg",
            className
          )}
          style={style}
        >
          <Sparkles className="w-4 h-4" />
          <span>+{amount} XP</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing XP popups
interface XPPopupState {
  id: string;
  amount: number;
  x: number;
  y: number;
}

export function useXPPopup() {
  const [popups, setPopups] = React.useState<XPPopupState[]>([]);

  const showXP = React.useCallback((amount: number, x: number, y: number) => {
    const id = Math.random().toString(36).substring(2);
    setPopups((prev) => [...prev, { id, amount, x, y }]);
  }, []);

  const removePopup = React.useCallback((id: string) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const PopupContainer = React.useCallback(() => (
    <>
      {popups.map((popup) => (
        <XPPopup
          key={popup.id}
          amount={popup.amount}
          show={true}
          onComplete={() => removePopup(popup.id)}
          className="left-0 top-0"
          style={{
            transform: `translate(${popup.x}px, ${popup.y}px)`,
          } as React.CSSProperties}
        />
      ))}
    </>
  ), [popups, removePopup]);

  return { showXP, PopupContainer };
}

// XP callout for showing potential XP before an action
interface XPCalloutProps {
  amount: number;
  action?: string;
  className?: string;
}

export function XPCallout({ amount, action, className }: XPCalloutProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-moulna-gold text-white text-sm",
      className
    )}>
      <Sparkles className="w-3.5 h-3.5" />
      <span className="font-medium">
        +{amount} XP
      </span>
      {action && (
        <span className="text-white/80">{action}</span>
      )}
    </div>
  );
}
