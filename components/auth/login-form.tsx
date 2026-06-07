"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { IconLoader } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
        rememberMe: false,
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {},
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
          Sign in
        </p>
        <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-foreground">
          Welcome back.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and password to continue.
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

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Password
            </Label>
            <Link
              href="/forget-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
            className="h-11 rounded-lg border-border/70 bg-card/40 backdrop-blur focus-visible:border-primary/50"
          />
        </div>

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
              Continue <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
