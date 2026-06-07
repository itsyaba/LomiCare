import {
  AmbientBackdrop,
  PageHeader,
} from "@/components/dashboard/page-header";
import { SecuritySection } from "@/components/dashboard/security-section";

export default function SecurityPage() {
  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="cool" />
      <PageHeader
        eyebrow="settings · security"
        title="Keep your account"
        italicAccent="safe."
        sub="Password, sessions, and account-level protections."
      />
      <SecuritySection />
    </main>
  );
}
