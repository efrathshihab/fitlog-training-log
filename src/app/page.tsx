"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/workout-card";
import type { Workout } from "@/lib/workouts";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/workouts", { signal, cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !Array.isArray(result)) throw new Error(result.error || "Could not load workouts.");
      setWorkouts(result);
    } catch (reason) {
      if (signal?.aborted) return;
      setError(reason instanceof Error ? reason.message : "Could not load workouts.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => { const controller = new AbortController(); queueMicrotask(() => { if (!controller.signal.aborted) void load(controller.signal); }); return () => controller.abort(); }, [load]);

  return <div className="bg-[#0c0d10]">
    <section className="container-page relative mt-12 min-h-[448px] overflow-hidden rounded-2xl border border-[#222630] bg-[#15171d] lg:h-[448px]">
      <div className="relative z-10 px-7 py-12 sm:px-14 lg:absolute lg:left-14 lg:top-[73px] lg:w-[558px] lg:p-0">
        <p className="eyebrow pt-[6px] leading-[17px]">Workout Library</p>
        <h1 className="display mt-5 text-[clamp(42px,6vw,60px)] leading-[1] text-white" style={{ letterSpacing: "-1.5px" }}>Train with intent. Log<br />every set.</h1>
        <p className="mt-5 max-w-[512px] text-base leading-6 text-[#9ca3af]">FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.</p>
        <Button asChild className="relative mt-7 h-10 w-[179px] rounded-md bg-[#c2f800] px-6 text-xs font-bold uppercase"><a href="#library">Browse Workouts <ArrowDownRight size={12} className="absolute right-1.5" /></a></Button>
      </div>
      <div className="pointer-events-none relative mx-auto h-[290px] w-full max-w-[334px] lg:absolute lg:left-[841px] lg:top-[56px] lg:size-[334px]">
        <Image src="/banner.png" alt="Anatomical athlete training on a seated machine" fill priority sizes="334px" className="object-contain" />
      </div>
    </section>

    <section id="library" className="container-page scroll-mt-8 pb-[76px] pt-16">
      <div className="mb-8">
        <h2 className="display text-[30px] leading-9">The Library</h2><p className="muted mt-1 text-sm leading-5">Twelve lifts covering every major muscle group.</p>
      </div>
      {loading ? <div className="panel flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-sm" role="status" aria-live="polite"><span className="spinner" /><span className="text-sm text-[#b3b9c0]">Loading workouts…</span></div> : error ? <div className="panel flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-sm px-5 text-center" role="alert"><p className="font-display text-3xl font-bold uppercase">The library is taking a breather</p><p className="muted text-sm">{error}</p><Button onClick={() => void load()}>Try again</Button></div> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{workouts.map((workout) => <WorkoutCard key={workout.id} workout={workout} />)}</div>}
    </section>
  </div>;
}
