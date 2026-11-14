import { NextResponse } from "next/server";
import { getWorkouts } from "@/lib/workouts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getWorkouts());
  } catch {
    return NextResponse.json({ error: "We couldn't load the workout library. Please try again." }, { status: 503 });
  }
}
