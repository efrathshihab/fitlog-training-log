import { NextResponse } from "next/server";
import { getWorkout, WorkoutFetchError } from "@/lib/workouts";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    return NextResponse.json(await getWorkout(Number(id)));
  } catch (error) {
    const missing = error instanceof WorkoutFetchError && error.missing;
    return NextResponse.json({ error: missing ? "Workout not found" : "We couldn't load this workout. Please try again." }, { status: missing ? 404 : 503 });
  }
}
