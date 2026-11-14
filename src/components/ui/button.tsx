import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-extrabold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5ff29] disabled:pointer-events-none disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "bg-[#d5ff29] text-[#0d1012] hover:bg-[#e3ff75]",
        secondary: "border border-[#3b424c] bg-[#1b2028] text-white hover:bg-[#282e38]",
        outline: "border border-[#454b54] bg-transparent text-white hover:border-[#d5ff29] hover:text-[#d5ff29]",
        ghost: "text-[#b0b6bf] hover:bg-[#22262d] hover:text-white",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6",
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
