import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Layout, Leaf } from "lucide-react";
import LogoutButton from "@/components/auth/logout-button-icon";
import HeroSection from "./_components/hero";
export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="flex relative min-h-screen flex-col">
      <header className="relative z-20 border-b bg-background/90 backdrop-blur">
        <div className="container  flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="size-5 text-primary" />
            <span className="font-display text-2xl font-bold">Selam</span>
          </div>
          <nav className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ModeToggle />
              {session?.user ? (
                <div className="flex gap-2 items-center">
                  <a href="/dashboard">
                    <Button
                      className="rounded-sm flex items-center gap-2"
                      variant="outline"
                      size="default"
                    >
                      <Layout className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </a>
                  <LogoutButton />
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="rounded-sm" variant="outline">
                      Log in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
      <HeroSection />
      <footer className="border-t bg-background py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Leaf className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm font-medium">Selam Wellness</span>
          </div>
          <div className="text-sm text-muted-foreground mt-4 md:mt-0">
            Built for Wellness Hackathon 2026 - ALX Ethiopia x Kuriftu Resorts
          </div>
        </div>
      </footer>
    </div>
  );
}
