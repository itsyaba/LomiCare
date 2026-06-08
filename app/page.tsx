import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Layout, Leaf } from "lucide-react";
import LogoutButton from "@/components/auth/logout-button-icon";

import { SelamHero } from "@/components/landing/SelamHero";
import { ScrollStory } from "@/components/landing/ScrollStory";
import HowItWorks from "./_components/how-it-works";
import Features from "./_components/features";
import RetreatShowcase from "./_components/retreat";
import FAQ from "./_components/faq";
import CTABand from "./_components/cta-band";
import { TryDemoButton } from "@/components/demo/TryDemoButton";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex relative min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="size-5 text-primary" strokeWidth={1.75} />
            <span className="font-serif text-2xl tracking-tight">selam</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#story"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Why Selam
            </a>
            <a
              href="#how"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#retreat"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Retreat
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            {session?.user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button
                    className="rounded-full flex items-center gap-2"
                    variant="outline"
                    size="default"
                  >
                    <Layout className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hidden sm:block">
                  <Button className="rounded-full" variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <TryDemoButton
                  size="sm"
                  className="rounded-full"
                  label="Try as guest"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <SelamHero />
        <div id="story">
          <ScrollStory />
        </div>
        <div id="how">
          <HowItWorks />
        </div>
        <div id="features">
          <Features />
        </div>
        <div id="retreat">
          <RetreatShowcase />
        </div>
        <div id="faq">
          <FAQ />
        </div>
        <CTABand />
      </main>

      <footer className="border-t border-border/60 bg-background py-12">
        <div className="container mx-auto grid gap-10 px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Leaf className="size-5 text-primary" strokeWidth={1.75} />
              <span className="font-serif text-xl tracking-tight">selam</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A quiet wellness companion, in your mother tongue.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/70">
              Team
            </p>
            <p>Yeabsira Tarekegn</p>
            <p>Daniel Teshome</p>
            <p>Fikerte Amenu</p>
          </div>

          <div className="text-sm text-muted-foreground md:text-right">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/70">
              Built for
            </p>
            <p>Wellness Hackathon 2026</p>
            <p>ALX Ethiopia &times; Kuriftu Resorts &times; WeVaSphere</p>
            <p className="mt-1 italic">Heal. Build. Thrive.</p>
          </div>
        </div>
        <div className="container mx-auto mt-10 flex flex-col gap-2 border-t border-border/60 px-6 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 Selam Wellness</p>
          <p className="font-serif text-sm italic">ሰላም ይሁንልዎ።</p>
        </div>
      </footer>
    </div>
  );
}
