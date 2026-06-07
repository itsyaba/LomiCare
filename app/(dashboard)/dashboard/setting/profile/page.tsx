import { headers } from "next/headers";

import {
  AmbientBackdrop,
  PageHeader,
} from "@/components/dashboard/page-header";
import { ProfileSection } from "@/components/dashboard/profile-section";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="warm" />
      <PageHeader
        eyebrow="settings · profile"
        title="Your"
        italicAccent="identity."
        sub="Manage how you appear inside Selam."
      />
      <ProfileSection session={session!} />
    </main>
  );
}
