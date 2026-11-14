import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase leading-4", {
  variants: {
    variant: {
      default: "border-[#c2f800] bg-[#c2f800] text-[#0f1115]",
      outline: "border-[#414854] bg-transparent text-[#c6cbd2]",
      subtle: "border-[#414a36] bg-[#28301d] text-[#c2f800]",
    },
  },
  defaultVariants: { variant: "outline" },
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
