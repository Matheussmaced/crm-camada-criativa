import { useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved";

export function useAutoSave<T>(value: T, onSave: (value: T) => void, delayMs = 600): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const isFirstRun = useRef(true);
  const serialized = JSON.stringify(value);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setStatus("saving");
    const timeout = setTimeout(() => {
      onSave(JSON.parse(serialized));
      setStatus("saved");
    }, delayMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, delayMs]);

  return status;
}
