import { useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved";

export function useAutoSave<T>(
  value: T,
  onSave: (value: T) => unknown,
  delayMs = 600
): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const isFirstRun = useRef(true);
  const serialized = JSON.stringify(value);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setStatus("saving");
    let cancelled = false;
    const timeout = setTimeout(async () => {
      await onSave(JSON.parse(serialized));
      if (!cancelled) setStatus("saved");
    }, delayMs);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, delayMs]);

  return status;
}
