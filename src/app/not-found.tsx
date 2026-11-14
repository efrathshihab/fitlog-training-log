import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <section className="container-page flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
    <Dumbbell className="mb-6 text-[#d5ff29]" size={42} />
    <p className="eyebrow mb-3">404 · Page not found</p>
    <h1 className="display text-6xl sm:text-8xl">LOST YOUR WAY?</h1>
    <p className="muted mt-5 max-w-md">That page or workout isn&apos;t in the library. Head back and pick a lift.</p>
    <Button asChild className="mt-8"><Link href="/"><ArrowLeft size={16} /> Back to workouts</Link></Button>
  </section>;
}
