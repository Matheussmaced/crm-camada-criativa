import { getItem, setItem } from "./storage";

type Listener = () => void;

export interface RecordStore<T> {
  get: () => T;
  set: (value: T) => void;
  update: (patch: Partial<T>) => T;
  subscribe: (listener: Listener) => () => void;
}

export function createRecordStore<T extends object>(storageKey: string, defaultValue: T): RecordStore<T> {
  // Merge with defaults so new fields introduced later don't come back as undefined
  // for users who already had a saved value under the old shape.
  let value: T = { ...defaultValue, ...getItem<Partial<T>>(storageKey, {}) };
  const listeners = new Set<Listener>();

  function persist() {
    setItem(storageKey, value);
    listeners.forEach((listener) => listener());
  }

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
      persist();
    },
    update: (patch) => {
      value = { ...value, ...patch };
      persist();
      return value;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
