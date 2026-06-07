import {
  AmbientBackdrop,
  PageHeader,
} from "@/components/dashboard/page-header";
import { PreferencesSection } from "@/components/dashboard/preference-section";

export default function Preference() {
  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="cool" />
      <PageHeader
        eyebrow="settings · preferences"
        title="Make Selam"
        italicAccent="yours."
        sub="Language, notifications, appearance — adjust the small details."
      />
      <PreferencesSection />
    </main>
  );
}
