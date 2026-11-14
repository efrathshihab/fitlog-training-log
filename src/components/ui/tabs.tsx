"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

function Tabs(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}
function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn("inline-flex h-10 items-center gap-1 rounded-xl border border-[#232732] bg-[#151921] p-[5px]", className)} {...props} />;
}
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn("h-[30px] whitespace-nowrap rounded-lg border border-transparent px-4 text-xs font-normal text-[#8a92a0] outline-none transition-colors data-[state=active]:border-[#2b303d] data-[state=active]:bg-[#1f242d] data-[state=active]:font-bold data-[state=active]:text-white hover:text-white focus-visible:ring-2 focus-visible:ring-[#c2f800]", className)} {...props} />;
}
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("outline-none", className)} {...props} />;
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
