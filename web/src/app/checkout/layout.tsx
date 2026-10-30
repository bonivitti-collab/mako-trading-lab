import { Suspense } from "react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">Loading checkout…</div>}>{children}</Suspense>;
}
