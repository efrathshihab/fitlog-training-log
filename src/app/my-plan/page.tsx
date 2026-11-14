"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutStats } from "@/components/workout-card";
import { usePlan } from "@/context/plan-context";
import type { Workout } from "@/lib/workouts";

type Tab = "plan" | "saved";
type SortKey = "duration" | "calories" | "rating";

function PlanRow({ workout, tab, onDone, onRemove }: { workout: Workout; tab: Tab; onDone: (workout: Workout) => void; onRemove: (workout: Workout) => void }) {
  return <article className="flex flex-col gap-4 rounded-2xl border border-[#232732] bg-[#14171e] p-4 sm:grid sm:grid-cols-[144px_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-2 lg:flex lg:min-h-[114px] lg:flex-row lg:items-center lg:gap-4">
    <div className="image-panel relative h-44 w-full shrink-0 rounded-xl sm:h-20 sm:w-36"><Image src={workout.image} alt={`${workout.name} exercise`} fill unoptimized sizes="(max-width: 640px) 100vw, 144px" className="object-cover" /></div>
    <div className="min-w-0 flex-1">
      <h3 className="font-display text-base font-bold uppercase leading-6">{workout.name}</h3>
      <p className="mt-0.5 text-xs font-semibold leading-4 text-[#8a92a0]">{workout.equipment}</p>
      <div className="mt-1.5"><WorkoutStats workout={workout} compact /></div>
    </div>
    <div className="flex flex-wrap items-center gap-3 sm:col-start-2 lg:justify-end">
      <Button variant="outline" asChild className="h-[34px] rounded-full px-[18px] text-xs font-normal"><Link href={`/workouts/${workout.id}`}>View Details</Link></Button>
      {tab === "plan" && <Button onClick={() => onDone(workout)} className="h-8 rounded-full px-4 text-xs font-semibold"><Check size={14} /> Mark as Done</Button>}
      <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={() => onRemove(workout)} aria-label={`Remove ${workout.name} from ${tab === "plan" ? "today's plan" : "saved workouts"}`} title="Remove"><X size={16} /></Button>
    </div>
  </article>;
}

function EmptyState() {
  return <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-[#2a2e36] bg-[#111317] px-4 text-center">
    <h2 className="display text-xl leading-5">Nothing here yet</h2>
    <p className="mt-2 max-w-sm text-xs leading-4 text-[#a1a1aa]">Browse the library and add a lift to get today moving.</p>
    <Button asChild className="mt-6 h-9 rounded-full bg-[#c2f10d] px-6 text-xs font-semibold"><Link href="/#library">Go to workouts</Link></Button>
  </div>;
}

export default function MyPlanPage() {
  const { planIds, savedIds, hydrated, markDone, removeFromPlan, removeSaved } = usePlan();
  const [tab, setTab] = useState<Tab>("plan");
  const [sort, setSort] = useState<SortKey>("duration");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { queueMicrotask(() => { if (new URLSearchParams(window.location.search).get("tab") === "saved") setTab("saved"); }); }, []);

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

  return <section className="container-plan pb-10 pt-10">
    <div><h1 className="display text-[30px] leading-9">My Plan</h1><p className="mt-2 text-sm leading-5 text-[#8a92a0]">Cap of five lifts for today. Finish them, then load more.</p></div>
    <div className="mt-6 grid grid-cols-1 rounded-2xl border border-[#232732] bg-[#13161d] px-6 py-5 sm:h-[122px] sm:grid-cols-3 sm:gap-0 sm:px-0 sm:py-0">
      {[
        { label: "Exercises", value: planned.length },
        { label: "Minutes", value: totals.minutes },
        { label: "Calories", value: totals.calories },
      ].map(({ label, value }, index) => <div key={label} className="border-b border-[#232732] py-3 last:border-0 sm:border-b-0 sm:border-r sm:py-8 sm:pl-8 sm:first:pl-6 sm:last:border-r-0"><p className="text-xs leading-4 text-[#8a92a0]">{label}</p><p className={`font-display mt-1 text-4xl font-bold leading-10 ${index === 0 ? "text-[#ccff00]" : "text-white"}`}>{value}</p></div>)}
    </div>
    <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="mt-6">
      <div className="mb-6 flex flex-col gap-4 sm:h-12 sm:flex-row sm:items-end sm:justify-between">
        <TabsList className="w-full sm:w-auto"><TabsTrigger value="plan" className="flex-1 data-[state=active]:sm:w-[108px] data-[state=inactive]:sm:w-[103px] sm:flex-none">Today&apos;s Plan</TabsTrigger><TabsTrigger value="saved" className="flex-1 data-[state=active]:sm:w-[108px] data-[state=inactive]:sm:w-[68px] sm:flex-none">Saved</TabsTrigger></TabsList>
        <label className="flex items-center gap-3 text-xs font-normal text-[#8a92a0] sm:mb-[3px]">Sort By <span className="relative"><select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className="h-[34px] w-[93px] appearance-none rounded-[9px] border border-[#232732] bg-[#13161d] pl-3 pr-6 text-xs font-normal text-white focus:outline-none focus:ring-2 focus:ring-[#c2f800]" aria-label="Sort workouts by"><option value="duration">Duration</option><option value="calories">Calories</option><option value="rating">Rating</option></select><ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-2.5 text-[#8a92a0]" /></span></label>
      </div>
      {(["plan", "saved"] as const).map((currentTab) => <TabsContent value={currentTab} key={currentTab}>
        {loading || !hydrated ? <div className="panel flex min-h-[230px] flex-col items-center justify-center gap-4 rounded-xl" role="status"><span className="spinner" /><span className="text-sm text-[#b3b9c0]">Loading workouts…</span></div> : error ? <div className="panel flex min-h-[230px] flex-col items-center justify-center gap-4 rounded-xl px-5 text-center" role="alert"><p className="muted text-sm">{error}</p><Button onClick={() => void load()}>Try again</Button></div> : items.length ? <div className="space-y-4">{items.map((workout) => <PlanRow key={workout.id} workout={workout} tab={currentTab} onDone={handleDone} onRemove={handleRemove} />)}</div> : <EmptyState />}
      </TabsContent>)}
    </Tabs>
  </section>;
}
