import { useMemo, useState } from "react";

export interface Pagination<T> {
  page: number;
  pageCount: number;
  pageItems: T[];
  setPage: (page: number) => void;
  pageSize: number;
}

export function usePagination<T>(items: T[], pageSize = 10): Pagination<T> {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  return { page: safePage, pageCount, pageItems, setPage, pageSize };
}
