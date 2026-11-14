"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Check, ChevronDown, Clock3, Dumbbell, Flame, ListChecks, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutStats } from "@/components/workout-card";
import { usePlan } from "@/context/plan-context";
import type { Workout } from "@/lib/workouts";

type Tab = "plan" | "saved";
type SortKey = "duration" | "calories" | "rating";

function PlanRow({ workout, tab, onDone, onRemove }: { workout: Workout; tab: Tab; onDone: (workout: Workout) => void; onRemove: (workout: Workout) => void }) {
  return <article className="panel flex flex-col gap-4 rounded-sm p-3 sm:flex-row sm:items-center sm:p-4">
    <div className="image-panel relative h-44 w-full shrink-0 rounded-sm sm:size-[80px] lg:size-[84px]"><Image src={workout.image} alt={`${workout.name} exercise`} fill unoptimized sizes="(max-width: 640px) 100vw, 84px" className="object-cover" /></div>
    <div className="min-w-0 flex-1">
      <h3 className="font-display text-[26px] font-extrabold uppercase leading-none tracking-wide">{workout.name}</h3>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-[#9aa3ac]"><Dumbbell size={13} />{workout.equipment}</p>
      <div className="mt-3"><WorkoutStats workout={workout} compact /></div>
    </div>
    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
      <Button variant="outline" size="sm" asChild><Link href={`/workouts/${workout.id}`}>View Details</Link></Button>
      {tab === "plan" && <Button variant="secondary" size="sm" onClick={() => onDone(workout)}><Check size={15} /> Mark as Done</Button>}
      <Button variant="ghost" size="icon" onClick={() => onRemove(workout)} aria-label={`Remove ${workout.name} from ${tab === "plan" ? "today's plan" : "saved workouts"}`} title="Remove"><X size={18} /></Button>
    </div>
  </article>;
}

function EmptyState({ tab }: { tab: Tab }) {
  return <div className="panel flex min-h-[300px] flex-col items-center justify-center rounded-sm px-5 py-10 text-center">
    <span className="mb-5 flex size-12 items-center justify-center rounded-full border border-[#424b35] bg-[#242c1c] text-[#d5ff29]">{tab === "plan" ? <ListChecks size={24} /> : <Bookmark size={24} />}</span>
    <h2 className="display text-4xl">Nothing here yet</h2>
    <p className="muted mt-3 max-w-sm text-sm">Browse the library and add a lift to get today moving.</p>
    <Button asChild className="mt-6"><Link href="/#library">Go to workouts</Link></Button>
  </div>;
}

export default function MyPlanPage() {
  const { planIds, savedIds, hydrated, markDone, removeFromPlan, removeSaved } = usePlan();
  const [tab, setTab] = useState<Tab>("plan");
  const [sort, setSort] = useState<SortKey>("duration");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { if (new URLSearchParams(window.location.search).get("tab") === "saved") setTab("saved"); }, []);

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
  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load]);

  const byId = useMemo(() => new Map(workouts.map((workout) => [workout.id, workout])), [workouts]);
  const planned = useMemo(() => planIds.map((id) => byId.get(id)).filter((item): item is Workout => Boolean(item)), [planIds, byId]);
  const saved = useMemo(() => savedIds.map((id) => byId.get(id)).filter((item): item is Workout => Boolean(item)), [savedIds, byId]);
  const totals = useMemo(() => planned.reduce((sum, workout) => ({ minutes: sum.minutes + workout.duration, calories: sum.calories + workout.caloriesBurned }), { minutes: 0, calories: 0 }), [planned]);
  const items = useMemo(() => [...(tab === "plan" ? planned : saved)].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating || a.name.localeCompare(b.name);
    if (sort === "calories") return a.caloriesBurned - b.caloriesBurned || a.name.localeCompare(b.name);
    return a.duration - b.duration || a.name.localeCompare(b.name);
  }), [tab, planned, saved, sort]);

  function handleDone(workout: Workout) { markDone(workout.id); toast.success(`${workout.name} marked as done.`); }
  function handleRemove(workout: Workout) {
    if (tab === "plan") removeFromPlan(workout.id); else removeSaved(workout.id);
    toast.success(`${workout.name} removed from ${tab === "plan" ? "today's plan" : "saved workouts"}.`);
  }

  return <section className="container-page min-h-[630px] pb-20 pt-10 sm:pt-12">
    <div><p className="eyebrow mb-3">Your training log</p><h1 className="display text-5xl sm:text-6xl">My Plan</h1><p className="muted mt-2 text-sm">Cap of five lifts for today. Finish them, then load more.</p></div>
    <div className="mt-8 grid grid-cols-1 gap-3 rounded-sm border border-[#2d333d] bg-[#13161d] p-4 sm:grid-cols-3 sm:gap-0 sm:p-0">
      {[
        { label: "Exercises", value: planned.length, icon: ListChecks },
        { label: "Minutes", value: totals.minutes, icon: Clock3 },
        { label: "Calories", value: totals.calories, icon: Flame },
      ].map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-4 border-b border-[#303640] p-3 last:border-0 sm:border-b-0 sm:border-r sm:p-7 sm:last:border-r-0"><span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-[#27301d] text-[#d5ff29]"><Icon size={21} /></span><div><p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-[#8f98a3]">{label}</p><p className="font-display text-4xl font-extrabold leading-none">{value}</p></div></div>)}
    </div>
    <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="mt-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="w-full sm:w-auto"><TabsTrigger value="plan" className="flex-1 sm:flex-none">Today&apos;s Plan <span className="ml-1 opacity-70">({planIds.length})</span></TabsTrigger><TabsTrigger value="saved" className="flex-1 sm:flex-none">Saved <span className="ml-1 opacity-70">({savedIds.length})</span></TabsTrigger></TabsList>
        <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#9ca4ae]">Sort By <span className="relative"><select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className="h-11 min-w-36 appearance-none rounded-sm border border-[#3a424b] bg-[#191d24] pl-4 pr-10 text-sm font-bold normal-case tracking-normal text-white focus:outline-none focus:ring-2 focus:ring-[#d5ff29]" aria-label="Sort workouts by"><option value="duration">Duration</option><option value="calories">Calories</option><option value="rating">Rating</option></select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-3.5 text-[#aab1b9]" /></span></label>
      </div>
      {(["plan", "saved"] as const).map((currentTab) => <TabsContent value={currentTab} key={currentTab}>
        {loading || !hydrated ? <div className="panel flex min-h-[230px] flex-col items-center justify-center gap-4 rounded-sm" role="status"><span className="spinner" /><span className="text-sm text-[#b3b9c0]">Loading workouts…</span></div> : error ? <div className="panel flex min-h-[230px] flex-col items-center justify-center gap-4 rounded-sm px-5 text-center" role="alert"><p className="muted text-sm">{error}</p><Button onClick={() => void load()}>Try again</Button></div> : items.length ? <div className="space-y-4">{items.map((workout) => <PlanRow key={workout.id} workout={workout} tab={currentTab} onDone={handleDone} onRemove={handleRemove} />)}</div> : <EmptyState tab={currentTab} />}
      </TabsContent>)}
    </Tabs>
  </section>;
}
