"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return <Sonner theme="dark" position="bottom-right" richColors toastOptions={{ style: { background: "#1c2129", border: "1px solid #454d56", color: "#f5f5f2" } }} />;
}
