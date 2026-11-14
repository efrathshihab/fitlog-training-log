import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-sm border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.12em]", {
  variants: {
    variant: {
      default: "border-[#d5ff29] bg-[#d5ff29] text-[#111]",
      outline: "border-[#414854] bg-transparent text-[#c6cbd2]",
      subtle: "border-[#414a36] bg-[#28301d] text-[#d5ff29]",
    },
  },
  defaultVariants: { variant: "outline" },
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
