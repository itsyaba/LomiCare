"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription } from "../ui/alert";
import { Terminal } from "lucide-react";

import { IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";

export function ForgetPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await (authClient as any).forgetPassword({
        email,
        redirectTo: "/reset-password",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "We sent a password reset link to your email.",
            );
          },
          onError: (ctx: { error: { message: string } }) => {
            setError(ctx.error.message);
          },
          onResponse: () => {
            setIsSubmitting(false);
          },
        },
      });
    } catch (err) {
      setError("An error occurred");
      setIsSubmitting(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forget your password</CardTitle>
          <CardDescription>
            Enter your email and get a reset link to your inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border border-red-500" variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <Button disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting ? (
                  <IconLoader className="animate-spin" stroke={2} />
                ) : (
                  "Send a reset link"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
