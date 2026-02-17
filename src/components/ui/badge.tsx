import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow",
        secondary:
          "bg-secondary text-secondary-foreground",
        destructive:
          "bg-red-600 text-white",
        outline:
          "bg-muted text-foreground",
        gold:
          "bg-gradient-to-r from-moulna-gold-light to-moulna-gold text-white shadow-sm",
        success:
          "bg-emerald-600 text-white",
        warning:
          "bg-amber-500 text-white",
        error:
          "bg-red-600 text-white",
        info:
          "bg-blue-600 text-white",
        pending:
          "bg-yellow-500 text-black",
        processing:
          "bg-indigo-600 text-white",
        completed:
          "bg-blue-600 text-white",
        closed:
          "bg-emerald-600 text-white",
        cancelled:
          "bg-red-600 text-white",
        trending:
          "bg-gradient-to-r from-orange-500 to-red-500 text-white",
        new:
          "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
        handmade:
          "bg-gradient-to-r from-rose-400 to-pink-500 text-white",
        sponsored:
          "bg-gradient-to-r from-moulna-gold to-amber-500 text-white",
        verified:
          "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
        level:
          "border-2 border-current font-bold",
        active:
          "bg-emerald-600 text-white",
        lowStock:
          "bg-amber-500 text-black",
        outOfStock:
          "bg-red-600 text-white",
        draft:
          "bg-gray-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
