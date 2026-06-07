import {
  AmbientBackdrop,
  PageHeader,
  SectionHeading,
} from "@/components/dashboard/page-header";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Page() {
  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="warm" />

      <PageHeader
        eyebrow="settings"
        title="Quiet"
        italicAccent="controls."
        sub="The small switches that shape how Selam shows up for you."
      />

      <section className="space-y-5">
        <SectionHeading eyebrow="appearance" title="Theme" />
        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Choose how the interface looks. Light keeps things calm; dark works
            well after sunset.
          </p>
          <div className="mt-5">
            <ModeToggle />
          </div>
        </div>
      </section>
    </main>
  );
}
