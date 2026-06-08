import { AmbientBackdrop } from "@/components/dashboard/page-header";

function Skel({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-muted/60 ${className ?? ""}`}
    />
  );
}

export default function DashboardLoading() {
  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="warm" />
      <div className="space-y-4">
        <Skel className="h-3 w-40" />
        <Skel className="h-10 w-72" />
        <Skel className="h-4 w-96 max-w-full" />
      </div>
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <Skel className="h-44" />
            <Skel className="h-44" />
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Skel className="h-48" />
            <Skel className="h-60" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Skel className="h-40" />
            <Skel className="h-40" />
          </div>
        </div>
        <aside>
          <Skel className="h-72" />
        </aside>
      </section>
      <section className="space-y-4">
        <Skel className="h-3 w-32" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skel className="h-32" />
          <Skel className="h-32" />
          <Skel className="h-32" />
        </div>
      </section>
    </main>
  );
}
