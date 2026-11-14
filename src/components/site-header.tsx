"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, ClipboardList } from "lucide-react";
import { usePlan } from "@/context/plan-context";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { planIds, savedIds } = usePlan();
  const workoutActive = pathname === "/" || pathname.startsWith("/workouts/");
  return <header className="border-b border-[#242830] bg-[#0c0d10]">
    <div className="container-page flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3 sm:flex-nowrap">
      <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="FitLog home">
        <Image src="/logo.png" width={28} height={28} alt="" className="size-7 object-contain" />
        <span className="font-display text-[30px] font-extrabold leading-none tracking-wide">FIT<span className="text-[#d5ff29]">LOG</span></span>
      </Link>
      <nav aria-label="Main navigation" className="order-3 flex w-full justify-center gap-2 border-t border-[#252a32] pt-3 sm:order-none sm:w-auto sm:border-0 sm:pt-0">
        <Link href="/" aria-current={workoutActive ? "page" : undefined} className={cn("rounded-sm px-4 py-2 text-sm font-bold transition-colors hover:text-white", workoutActive ? "bg-[#252b24] text-[#d5ff29]" : "text-[#a0a6ae]")}>Workout</Link>
        <Link href="/my-plan" aria-current={pathname === "/my-plan" ? "page" : undefined} className={cn("rounded-sm px-4 py-2 text-sm font-bold transition-colors hover:text-white", pathname === "/my-plan" ? "bg-[#252b24] text-[#d5ff29]" : "text-[#a0a6ae]")}>My Plan</Link>
      </nav>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/my-plan" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#d5ff29] px-3 text-xs font-extrabold text-[#10120c] hover:bg-[#e5ff82]" aria-label={`Plan, ${planIds.length} workouts`}><ClipboardList size={14} /> Plan <span>{planIds.length}</span></Link>
        <Link href="/my-plan?tab=saved" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#535b62] px-3 text-xs font-extrabold text-white hover:border-[#d5ff29]" aria-label={`Saved, ${savedIds.length} workouts`}><Bookmark size={14} /> Saved <span>{savedIds.length}</span></Link>
      </div>
    </div>
  </header>;
}
