import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkoutActions } from "@/components/workout-actions";
import { WorkoutFetchError, getWorkout } from "@/lib/workouts";

export const dynamic = "force-dynamic";

export default async function WorkoutDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let workout;
  try {
    workout = await getWorkout(Number(id));
  } catch (error) {
    if (error instanceof WorkoutFetchError && error.missing) notFound();
    return <section className="container-page flex min-h-[65vh] flex-col items-center justify-center text-center"><h1 className="display text-5xl">Unable to load workout</h1><p className="muted mt-4">Both workout services are unavailable. Please try again shortly.</p><a href={`/workouts/${id}`} className="mt-6 rounded-sm bg-[#d5ff29] px-5 py-3 text-sm font-extrabold uppercase text-black">Try again</a></section>;
  }

  const specs = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Sets", String(workout.sets)],
    ["Reps", workout.reps],
    ["Duration", `${workout.duration} min`],
    ["Calories", `${workout.caloriesBurned} kcal`],
    ["Rating", workout.rating.toFixed(1)],
  ];

  return <section className="container-page pb-20 pt-10 sm:pt-12">
    <Link href="/#library" className="mb-7 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#9fa6ae] hover:text-[#d5ff29]"><ArrowLeft size={15} /> Back to library</Link>
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
      <div className="image-panel relative min-h-[360px] rounded-sm border border-[#343a43] sm:min-h-[550px] lg:min-h-[790px]">
        <Image src={workout.image} alt={`${workout.name} exercise`} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="eyebrow mb-3 flex items-center gap-2"><Dumbbell size={14} /> Workout Details</p>
        <h1 className="display text-[clamp(3.2rem,5vw,5.5rem)]">{workout.name}</h1>
        <p className="mt-5 text-sm leading-7 text-[#aeb4bd] sm:text-base">{workout.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">{workout.muscleGroups.map((group) => <Badge variant="subtle" key={group}>{group}</Badge>)}</div>
        <div className="panel mt-8 rounded-sm p-5 sm:p-6">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide">Key Specs</h2>
          <dl className="mt-3">{specs.map(([label, value]) => <div className="flex justify-between gap-5 border-b border-[#303640] py-3 text-sm last:border-0 last:pb-0" key={label}><dt className="text-xs font-bold uppercase tracking-wider text-[#8f98a3]">{label}</dt><dd className="text-right font-bold text-white">{value}</dd></div>)}</dl>
        </div>
        <div className="mt-8">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide">Instructions</h2>
          <ol className="mt-4 space-y-3">{workout.instructions.map((instruction, index) => <li key={index} className="flex gap-4 text-sm leading-6 text-[#b5bbc3]"><span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-[#d5ff29] text-xs font-extrabold text-[#111]">{String(index + 1).padStart(2, "0")}</span><span>{instruction}</span></li>)}</ol>
        </div>
        <WorkoutActions workout={workout} />
      </div>
    </div>
  </section>;
}
