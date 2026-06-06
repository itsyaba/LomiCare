import { headers } from "next/headers";

import LogoutButton from "@/components/auth/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <main className="grid gap-6 px-4 lg:grid-cols-[1fr_0.8fr] lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={session?.user.name ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={session?.user.email ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language preference</Label>
            <Input id="language" value="English" readOnly />
          </div>
          <LogoutButton />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check-in summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Metric label="Total check-ins" value={String(checkins.length)} />
          <Metric label="Current streak" value={`${calculateStreak(checkins)} days`} />
          <Metric label="Average mood" value={averageMood.toFixed(1)} />
        </CardContent>
      </Card>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
