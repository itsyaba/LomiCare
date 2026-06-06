"use client";

import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const next = language === "en" ? "am" : "en";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => setLanguage(next)}
    >
      <Languages className="size-4" />
      {language === "en" ? "EN" : "AM"}
    </Button>
  );
}
