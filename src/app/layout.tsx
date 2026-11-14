import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PlanProvider } from "@/context/plan-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { default: "FitLog — Workout Library", template: "%s | FitLog" },
  description: "Train with intent. Browse twelve lifts, build today's plan, and save workouts for later.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PlanProvider><div className="flex min-h-screen flex-col"><SiteHeader /><main className="flex-1">{children}</main><SiteFooter /></div><Toaster /></PlanProvider></body></html>;
}
