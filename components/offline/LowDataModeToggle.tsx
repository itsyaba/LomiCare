"use client";

import { WifiOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLowDataMode } from "@/hooks/useLowDataMode";

export function LowDataModeToggle() {
  const { isLowDataMode, toggleMode } = useLowDataMode();

  return (
    <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border mt-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <WifiOff className="size-4 text-primary" />
        </div>
        <div>
          <Label className="text-base cursor-pointer" onClick={toggleMode}>Low Data Mode</Label>
          <p className="text-xs text-muted-foreground mt-1">Reduce animations and cache data locally.</p>
        </div>
      </div>
      <Switch checked={isLowDataMode} onCheckedChange={toggleMode} />
    </div>
  );
}
