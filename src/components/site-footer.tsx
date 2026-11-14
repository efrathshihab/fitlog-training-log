"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isPlan = pathname === "/my-plan";
  return <footer className={cn("mt-auto border-t border-[#1b1f28]", isHome ? "bg-[#090a0d]" : "bg-[#0f1115]")}>
    <div className={cn(isPlan ? "container-plan sm:min-h-[68px]" : "container-page", isHome ? "sm:min-h-[100px]" : !isPlan ? "sm:min-h-[84px]" : "", "flex flex-col items-start justify-center gap-3 py-5 text-xs text-[#8a92a0] sm:flex-row sm:items-center sm:justify-between sm:py-0")}>
      <Link href="/" className="flex items-center gap-2 text-white"><Image src="/logo.png" width={20} height={20} alt="" /><span className="font-display text-sm font-bold leading-5">FITLOG</span></Link>
      <span>© 2026 FitLog — Workout Library. Train hard, log honest.</span>
    </div>
  </footer>;
}
