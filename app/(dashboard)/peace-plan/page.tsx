import {
  AmbientBackdrop,
  PageHeader,
} from "@/components/dashboard/page-header";
import { PeacePlanCard } from "@/components/peace-plan/PeacePlanCard";

export default function PeacePlanPage() {
  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="cool" />
      <PageHeader
        eyebrow="seven days"
        title="A quiet, seven-day"
        italicAccent="Peace Plan."
        sub="Selam reads your last weeks and writes a small action for each of the next seven days. Sleep reset, buna pause, gentle movement, family check-in — culturally grounded, never clinical."
      />
      <section className="max-w-2xl">
        <PeacePlanCard />
      </section>
    </main>
  );
}
