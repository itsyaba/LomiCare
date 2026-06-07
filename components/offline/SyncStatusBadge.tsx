"use client";

import { useEffect, useState } from "react";
import { CloudOff, RefreshCcw, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SyncStatusBadge() {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const checkPending = () => {
      try {
        const queue = JSON.parse(localStorage.getItem("selam_offline_queue") ?? "[]");
        setPendingCount(Array.isArray(queue) ? queue.length : 0);
      } catch {
        setPendingCount(0);
      }
    };

    checkPending();
    setOnline(navigator.onLine);

    const handleOnline = () => { setOnline(true); checkPending(); };
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Poll for queue changes
    const interval = setInterval(checkPending, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (syncing || !online) return;
    setSyncing(true);
    try {
      const queue: any[] = JSON.parse(localStorage.getItem("selam_offline_queue") ?? "[]");
      const failed: any[] = [];

      for (const item of queue) {
        try {
          const res = await fetch(item.url, {
            method: item.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.body),
          });
          if (!res.ok) failed.push(item);
        } catch {
          failed.push(item);
        }
      }

      localStorage.setItem("selam_offline_queue", JSON.stringify(failed));
      setPendingCount(failed.length);
    } finally {
      setSyncing(false);
    }
  };

  if (!online) {
    return (
      <Badge variant="outline" className="gap-1 border-red-300 text-red-600 bg-red-50">
        <CloudOff className="size-3" />
        Offline
      </Badge>
    );
  }

  if (pendingCount > 0) {
    return (
      <button onClick={handleSync} disabled={syncing} className="inline-flex">
        <Badge
          variant="outline"
          className="gap-1 border-amber-300 text-amber-700 bg-amber-50 cursor-pointer hover:bg-amber-100"
        >
          <RefreshCcw className={`size-3 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : `${pendingCount} pending sync`}
        </Badge>
      </button>
    );
  }

  return null; // All synced — show nothing
}
