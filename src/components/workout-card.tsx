import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Dumbbell, Flame, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Workout } from "@/lib/workouts";

export function WorkoutStats({ workout, compact = false }: { workout: Workout; compact?: boolean }) {
  return <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#c0c5cc] ${compact ? "sm:gap-x-4" : ""}`}>
    <span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-[#ff675d]" />{workout.duration} min</span>
    <span className="inline-flex items-center gap-1.5"><Flame size={14} className="text-[#ff675d]" />{workout.caloriesBurned} kcal</span>
    <span className="inline-flex items-center gap-1.5"><Star size={14} className="text-[#ffca61]" />{workout.rating.toFixed(1)}</span>
  </div>;
}

export function WorkoutCard({ workout }: { workout: Workout }) {
  return <Link href={`/workouts/${workout.id}`} className="group panel flex min-w-0 flex-col overflow-hidden rounded-sm transition-all hover:-translate-y-1 hover:border-[#6b7b3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5ff29]" aria-label={`View ${workout.name} details`}>
    <div className="image-panel relative h-[190px] shrink-0">
      <Image src={workout.image} alt={`${workout.name} exercise`} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
      <span className="absolute right-3 top-3 rounded-sm bg-[#11151bd9] p-1.5 text-[#d5ff29]"><ArrowUpRight size={17} /></span>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="mb-4 flex flex-wrap gap-1.5">{workout.muscleGroups.map((group) => <Badge key={group} variant="subtle">{group}</Badge>)}</div>
      <h3 className="font-display text-[27px] font-extrabold uppercase leading-none tracking-wide group-hover:text-[#d5ff29]">{workout.name}</h3>
      <p className="mt-3 flex items-center gap-2 text-xs text-[#9da5ae]"><Dumbbell size={14} />{workout.equipment}</p>
      <div className="mt-auto border-t border-[#303640] pt-4"><WorkoutStats workout={workout} /></div>
    </div>
  </Link>;
}
