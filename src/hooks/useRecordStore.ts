import { useSyncExternalStore } from "react";
import type { RecordStore } from "@/services/storage/createRecordStore";

export function useRecordStore<T>(store: RecordStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
