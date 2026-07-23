import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc";

export function useSort<T>(
  items: T[],
  initialKey: keyof T,
  getValue: (item: T, key: keyof T) => string | number
) {
  const [sortKey, setSortKey] = useState<keyof T>(initialKey);
  const [direction, setDirection] = useState<SortDirection>("desc");

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      const valueA = getValue(a, sortKey);
      const valueB = getValue(b, sortKey);
      const comparison =
        typeof valueA === "number" && typeof valueB === "number"
          ? valueA - valueB
          : String(valueA).localeCompare(String(valueB));
      return direction === "asc" ? comparison : -comparison;
    });
    return copy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, sortKey, direction]);

  function toggleSort(key: keyof T) {
    if (key === sortKey) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  }

  return { sorted, sortKey, direction, toggleSort };
}
