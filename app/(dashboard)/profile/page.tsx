import { headers } from "next/headers";

import {
  AmbientBackdrop,
  PageHeader,
  SectionHeading,
} from "@/components/dashboard/page-header";
import LogoutButton from "@/components/auth/logout-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import { calculateStreak } from "@/lib/checkins";
import { dbConnect } from "@/lib/db";
import CheckIn from "@/models/CheckIn";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  await dbConnect();

  const checkins = await CheckIn.find({ userId: session?.user.id }).sort({
    date: -1,
  });
  const averageMood =
    checkins.length > 0
      ? checkins.reduce((total, checkin) => total + checkin.mood, 0) /
        checkins.length
      : 0;

  const firstName = session?.user.name?.split(" ")[0] ?? "friend";

  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="cool" />

      <PageHeader
        eyebrow="your account"
        title={`Hello, ${firstName}.`}
        italicAccent="A quiet space."
        sub="The details Selam knows about you, and a soft summary of your time so far."
      />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
          <SectionHeading eyebrow="profile" title="Identity" />
          <div className="mt-6 space-y-5">
            <Field
              id="name"
              label="Display name"
              value={session?.user.name ?? ""}
            />
            <Field
              id="email"
              label="Email"
              value={session?.user.email ?? ""}
            />
            <Field id="language" label="Language preference" value="English" />
            <div className="pt-2">
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
            <SectionHeading eyebrow="summary" title="Time with Selam" />
            <dl className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <Stat label="Check-ins" value={String(checkins.length)} />
              <Stat
                label="Current streak"
                value={`${calculateStreak(checkins)}d`}
              />
              <Stat label="Average mood" value={averageMood.toFixed(1)} />
            </dl>
          </div>

          <div className="rounded-2xl border border-dashed border-border/70 bg-card/40 p-6 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              quiet note
            </p>
            <p className="mt-3 font-serif text-base leading-7 text-foreground">
              Your check-ins stay with you. Selam never shares journal notes
              unless you choose to send them yourself.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
      >
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        readOnly
        className="h-11 rounded-lg border-border/70 bg-background/60 backdrop-blur"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
      <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-2 font-serif text-3xl font-light text-foreground">
        {value}
      </dd>
    </div>
  );
}
