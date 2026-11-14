import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2f800] disabled:pointer-events-none disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "bg-[#ccff00] text-[#0f1115] hover:bg-[#d9ff53]",
        secondary: "border border-[#3b424c] bg-[#1b2028] text-white hover:bg-[#282e38]",
        outline: "border border-[#374151] bg-transparent text-[#e5e7eb] hover:border-[#c2f800] hover:text-[#c2f800]",
        ghost: "text-[#b0b6bf] hover:bg-[#22262d] hover:text-white",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-11 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
