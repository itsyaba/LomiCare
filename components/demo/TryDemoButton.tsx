"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

type Props = {
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  label?: string;
};

export function TryDemoButton({
  className,
  variant = "default",
  size = "lg",
  label,
}: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/demo/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not start demo");
      }
      toast.success(
        language === "am"
          ? "ሰላም። የእንግዳ ሁነታ ተጀምሯል።"
          : "Welcome. Your demo space is ready.",
      );
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not start demo session.",
      );
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4" />
      )}
      {label ??
        (loading
          ? language === "am"
            ? "በማዘጋጀት ላይ…"
            : "Preparing your space…"
          : language === "am"
            ? "ሰላምን ሞክሩት"
            : "Try Selam as guest")}
      {!loading && <ArrowRight className="size-4" />}
    </Button>
  );
}
