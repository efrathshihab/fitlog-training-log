"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlan } from "@/context/plan-context";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { planIds, savedIds } = usePlan();
  const isPlan = pathname === "/my-plan";
  const workoutActive = pathname === "/";
  return <header className={cn("relative border-b border-[#1b1f28]", pathname === "/" ? "bg-[#0c0d10]" : "bg-[#0f1115]")}>
    <div className={cn(isPlan ? "container-plan sm:min-h-[66px]" : "container-page sm:min-h-20", "flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3 sm:flex-nowrap sm:py-0")}>
      <Link href="/" className={cn("flex shrink-0 items-center", isPlan ? "ml-1.5 gap-2" : pathname === "/" ? "gap-2.5" : "gap-2")} aria-label="FitLog home">
        <Image src="/logo.png" width={28} height={28} alt="" className="size-7 object-contain" />
        <span className={cn("font-display font-bold leading-7 text-white", pathname === "/" ? "text-lg" : "text-xl")}>FITLOG</span>
      </Link>
      <nav aria-label="Main navigation" className="order-3 flex w-full justify-center gap-1 border-t border-[#252a32] pt-3 sm:absolute sm:left-1/2 sm:top-1/2 sm:order-none sm:w-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:border-0 sm:pt-0">
        <Link href="/" aria-current={workoutActive ? "page" : undefined} className={cn("flex h-7 items-center rounded-full px-4 text-xs font-semibold transition-colors hover:text-white", workoutActive ? "bg-[#1a2312] text-[#c2f800]" : "text-[#9ca3af]")}>Workouts</Link>
        <Link href="/my-plan" aria-current={isPlan ? "page" : undefined} className={cn("flex h-7 items-center rounded-full px-4 text-xs font-semibold transition-colors hover:text-white", isPlan ? "bg-[#1a2312] text-[#c2f800]" : "text-[#9ca3af]")}>My Plan</Link>
      </nav>
      <div className="flex items-center gap-6">
        <Link href="/my-plan" className="inline-flex items-center gap-2 text-xs font-medium text-[#d1d5db] hover:text-white" aria-label={`Plan, ${planIds.length} workouts`}>Plan <span className="flex size-5 items-center justify-center rounded-full bg-[#c2f800] text-[11px] font-bold text-black">{planIds.length}</span></Link>
        <Link href="/my-plan?tab=saved" className="inline-flex items-center gap-2 text-xs font-medium text-[#9ca3af] hover:text-white" aria-label={`Saved, ${savedIds.length} workouts`}>Saved <span className="flex size-5 items-center justify-center rounded-full border border-[#2d313b] text-[11px] text-[#d1d5db]">{savedIds.length}</span></Link>
      </div>
    </div>
  </header>;
}
