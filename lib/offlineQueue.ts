export type PendingCheckInPayload = {
  mood: number;
  energy: number;
  sleep: number;
  stress: number;
  note?: string;
  language?: "en" | "am";
};

export type PendingQueueItem = {
  id: string;
  payload: PendingCheckInPayload;
  createdAt: string;
};

const PENDING_CHECKINS_KEY = "selam-pending-checkins";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readPendingCheckIns() {
  if (!canUseStorage()) {
    return [] as PendingQueueItem[];
  }

  try {
    const raw = window.localStorage.getItem(PENDING_CHECKINS_KEY);
    return raw ? (JSON.parse(raw) as PendingQueueItem[]) : [];
  } catch {
    return [];
  }
}

export function writePendingCheckIns(items: PendingQueueItem[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(PENDING_CHECKINS_KEY, JSON.stringify(items));
}

export function queuePendingCheckIn(payload: PendingCheckInPayload) {
  const item: PendingQueueItem = {
    id: crypto.randomUUID(),
    payload,
    createdAt: new Date().toISOString(),
  };
  const current = readPendingCheckIns();
  writePendingCheckIns([...current, item]);
  return item;
}

export function removePendingCheckIn(id: string) {
  const current = readPendingCheckIns();
  writePendingCheckIns(current.filter((item) => item.id !== id));
}

export function clearPendingCheckIns() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(PENDING_CHECKINS_KEY);
}

export async function syncPendingCheckIns(
  sendCheckIn: (payload: PendingCheckInPayload) => Promise<boolean>,
) {
  const items = readPendingCheckIns();
  const remaining: PendingQueueItem[] = [];
  let synced = 0;

  for (const item of items) {
    const ok = await sendCheckIn(item.payload);
    if (ok) {
      synced += 1;
      continue;
    }

    remaining.push(item);
  }

  writePendingCheckIns(remaining);
  return synced;
}

export function getPendingCheckInCount() {
  return readPendingCheckIns().length;
}

export function cacheSnapshot<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readSnapshot<T>(key: string) {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
