"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowRight, Dumbbell } from "lucide-react";
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

  return <>
    <section className="container-page relative mt-12 flex min-h-[448px] flex-col overflow-hidden rounded-sm border border-[#2a2e36] bg-[#15171d] lg:flex-row lg:items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,#343c26_0%,#15171d_48%)]" />
      <div className="relative z-10 w-full px-7 py-12 sm:px-12 lg:w-[57%] lg:py-16">
        <p className="eyebrow mb-5 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#d5ff29]" /> Workout Library</p>
        <h1 className="display max-w-[690px] text-[clamp(3.5rem,6.5vw,6.6rem)]">Train with intent.<br /><span className="text-[#d5ff29]">Log every set.</span></h1>
        <p className="mt-6 max-w-lg text-sm leading-7 text-[#a4abb5] sm:text-base">FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.</p>
        <Button asChild size="lg" className="mt-8"><a href="#library"><Dumbbell size={17} /> Browse Workouts <ArrowDownRight size={17} /></a></Button>
      </div>
      <div className="pointer-events-none relative mx-auto h-[290px] w-full max-w-[500px] lg:absolute lg:inset-y-0 lg:right-2 lg:h-full lg:w-[46%]">
        <Image src="/banner.png" alt="Anatomical athlete training on a seated machine" fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-contain object-bottom drop-shadow-[0_25px_28px_#0009]" />
      </div>
    </section>

    <section id="library" className="container-page scroll-mt-8 pb-20 pt-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow mb-3">Find your next lift</p><h2 className="display text-4xl sm:text-5xl">The Library</h2><p className="muted mt-2 text-sm">Twelve lifts covering every major muscle group.</p></div>
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#7e8790]">Explore all workouts <ArrowRight size={16} /></span>
      </div>
      {loading ? <div className="panel flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-sm" role="status" aria-live="polite"><span className="spinner" /><span className="text-sm text-[#b3b9c0]">Loading workouts…</span></div> : error ? <div className="panel flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-sm px-5 text-center" role="alert"><p className="font-display text-3xl font-bold uppercase">The library is taking a breather</p><p className="muted text-sm">{error}</p><Button onClick={() => void load()}>Try again</Button></div> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{workouts.map((workout) => <WorkoutCard key={workout.id} workout={workout} />)}</div>}
    </section>
  </>;
}
