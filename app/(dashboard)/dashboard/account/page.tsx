"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconLoader } from "@tabler/icons-react";

import {
  AmbientBackdrop,
  PageHeader,
} from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [loading] = useState(false);

  async function getUser() {
    const { data: session } = await authClient.getSession();
    return session;
  }

  useEffect(() => {
    getUser().then((data) => {
      setFullname(data?.user?.name ?? "");
      setEmail(data?.user?.email ?? "");
    });
  }, []);

  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="warm" />

      <PageHeader
        eyebrow="account"
        title="Edit your"
        italicAccent="details."
        sub="Update the basic information Selam uses to recognise you."
      />

      {!email ? (
        <div className="grid max-w-2xl gap-4 rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
          <Skeleton className="h-5 w-1/2 rounded-full" />
          <Skeleton className="h-5 w-2/3 rounded-full" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      ) : (
        <section className="max-w-2xl rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
          <form className="space-y-5">
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
              >
                Full name
              </Label>
              <Input
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                id="name"
                type="text"
                placeholder="Your full name"
                required
                className="h-11 rounded-lg border-border/70 bg-background/60 backdrop-blur"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
              >
                Email
              </Label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                id="email"
                type="email"
                placeholder="me@example.com"
                required
                className="h-11 rounded-lg border-border/70 bg-background/60 backdrop-blur"
              />
            </div>

            <Button
              disabled={loading}
              type="submit"
              size="lg"
              className="h-12 w-full rounded-full"
            >
              {loading ? (
                <IconLoader className="animate-spin" stroke={2} />
              ) : (
                "Save changes"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Forgot your password?{" "}
              <a
                href="/forget-password"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Reset it
              </a>
            </p>
          </form>
        </section>
      )}
    </main>
  );
}
