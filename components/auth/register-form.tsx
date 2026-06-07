"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { IconLoader } from "@tabler/icons-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    await authClient.signUp.email(
      {
        name,
        email,
        password,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  }

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Create account
        </p>
        <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-foreground">
          Welcome to Selam.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A few details and you&apos;re in. No pressure, no spam.
        </p>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="border-destructive/40 bg-destructive/5"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-2">
          <Label
            htmlFor="name"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Name
          </Label>
          <Input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="h-11 rounded-lg border-border/70 bg-card/40 backdrop-blur focus-visible:border-primary/50"
          />
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="email"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="h-11 rounded-lg border-border/70 bg-card/40 backdrop-blur focus-visible:border-primary/50"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Password
            </Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              className="h-11 rounded-lg border-border/70 bg-card/40 backdrop-blur focus-visible:border-primary/50"
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="confirm-password"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Confirm
            </Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
              className="h-11 rounded-lg border-border/70 bg-card/40 backdrop-blur focus-visible:border-primary/50"
            />
          </div>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          By continuing you agree to Selam&apos;s gentle{" "}
          <Link href="/" className="underline-offset-4 hover:underline">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/" className="underline-offset-4 hover:underline">
            privacy
          </Link>
          .
        </p>

        <Button
          disabled={loading}
          type="submit"
          size="lg"
          className="mt-2 h-12 rounded-full"
        >
          {loading ? (
            <IconLoader className="animate-spin" stroke={2} />
          ) : (
            <>
              Create account <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
