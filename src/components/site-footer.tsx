import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return <footer className="mt-auto border-t border-[#242830] bg-[#090a0d]">
    <div className="container-page flex min-h-24 flex-col items-start justify-center gap-3 py-6 text-sm text-[#8e95a0] sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" className="flex items-center gap-2 text-white"><Image src="/logo.png" width={22} height={22} alt="" /><span className="font-display text-2xl font-extrabold tracking-wide">FITLOG</span></Link>
      <span>© 2026 FitLog — Workout Library. Train hard, log honest.</span>
    </div>
  </footer>;
}
