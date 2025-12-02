"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type SortOrder = "asc" | "desc";

export type TableQueryState = {
  page: number;
  limit: number;
  search: string;
  sortBy: string | null;
  sortOrder: SortOrder | null;
  filters: Record<string, string>;
};

type UseTableQueryOptions = {
  defaultPageSize?: number;
  defaultSortBy?: string;
  defaultSortOrder?: SortOrder;
  filterKeys?: string[];
};

/**
 * Hook to keep table query state (search, filters, sorting, pagination)
 * in sync with the URL query parameters so links are shareable and restorable.
 */
export function useTableQuery(options: UseTableQueryOptions = {}) {
  const {
    defaultPageSize = 10,
    defaultSortBy = null,
    defaultSortOrder = null,
    filterKeys = [],
  } = options as UseTableQueryOptions & {
    defaultSortBy: string | null;
    defaultSortOrder: SortOrder | null;
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = useMemo<TableQueryState>(() => {
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || String(defaultPageSize));
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || defaultSortBy;
    const sortOrder = (searchParams.get("sortOrder") as SortOrder | null) || defaultSortOrder;

    const filters: Record<string, string> = {};
    for (const key of filterKeys) {
      const value = searchParams.get(key);
      if (value !== null && value !== "") {
        filters[key] = value;
      }
    }

    return {
      page: Number.isNaN(page) || page < 1 ? 1 : page,
      limit: Number.isNaN(limit) || limit < 1 ? defaultPageSize : limit,
      search,
      sortBy,
      sortOrder,
      filters,
    };
  }, [searchParams, defaultPageSize, defaultSortBy, defaultSortOrder, filterKeys]);

  const updateParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      updater(params);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setPage = useCallback(
    (page: number) => {
      updateParams((params) => {
        params.set("page", String(page));
      });
    },
    [updateParams],
  );

  const setPageSize = useCallback(
    (limit: number) => {
      updateParams((params) => {
        params.set("limit", String(limit));
        params.set("page", "1"); // reset to first page when page size changes
      });
    },
    [updateParams],
  );

  const setSearch = useCallback(
    (value: string) => {
      updateParams((params) => {
        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }
        params.set("page", "1");
      });
    },
    [updateParams],
  );

  const setSort = useCallback(
    (sortBy: string | null, sortOrder: SortOrder | null) => {
      updateParams((params) => {
        if (sortBy && sortOrder) {
          params.set("sortBy", sortBy);
          params.set("sortOrder", sortOrder);
        } else {
          params.delete("sortBy");
          params.delete("sortOrder");
        }
        params.set("page", "1");
      });
    },
    [updateParams],
  );

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      updateParams((params) => {
        if (value && value.length > 0) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
        params.set("page", "1");
      });
    },
    [updateParams],
  );

  return {
    query,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setFilter,
  };
}


