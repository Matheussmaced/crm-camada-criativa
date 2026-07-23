import { getItem, setItem } from "./storage";

type Listener = () => void;

export interface CollectionStore<T extends { id: string }> {
  getAll: () => T[];
  getById: (id: string) => T | undefined;
  add: (item: T) => T;
  update: (id: string, patch: Partial<T>) => T | undefined;
  remove: (id: string) => void;
  replaceAll: (items: T[]) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createCollectionStore<T extends { id: string }>(
  storageKey: string
): CollectionStore<T> {
  let items: T[] = getItem<T[]>(storageKey, []);
  const listeners = new Set<Listener>();

  function persist() {
    setItem(storageKey, items);
    listeners.forEach((listener) => listener());
  }

  return {
    getAll: () => items,
    getById: (id) => items.find((item) => item.id === id),
    add: (item) => {
      items = [...items, item];
      persist();
      return item;
    },
    update: (id, patch) => {
      let updated: T | undefined;
      items = items.map((item) => {
        if (item.id !== id) return item;
        updated = { ...item, ...patch };
        return updated;
      });
      persist();
      return updated;
    },
    remove: (id) => {
      items = items.filter((item) => item.id !== id);
      persist();
    },
    replaceAll: (newItems) => {
      items = newItems;
      persist();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
