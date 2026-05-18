/** Shared helpers for client-side paging (and aligned defaults with server-backed lists). */

export const DEFAULT_PAGE_SIZE = 10;

export function slicePage<T>(items: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/** Total pages for a given item count; at least 1 so callers can clamp safely. */
export function totalPagesFromCount(itemCount: number, pageSize: number): number {
  if (itemCount <= 0) {
    return 1;
  }
  return Math.ceil(itemCount / pageSize);
}
