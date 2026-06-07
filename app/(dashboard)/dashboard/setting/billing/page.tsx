import {
  AmbientBackdrop,
  PageHeader,
} from "@/components/dashboard/page-header";
import BillingSection from "@/components/dashboard/billing-section";

export default function BillingPage() {
  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="warm" />
      <PageHeader
        eyebrow="settings · billing"
        title="Plan &"
        italicAccent="payment."
        sub="Manage your subscription, payment methods, and history."
      />
      <BillingSection />
    </main>
  );
}
