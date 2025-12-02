"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import type { TableQueryState } from "./use-table-query";

type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type PaginatedResponse<T> = {
  success: boolean;
  message?: string;
  data: T[];
  meta?: PaginatedMeta;
};

type UsePaginatedTableDataOptions = {
  /**
   * Base API path, e.g. "/listings" or "/bookings/me"
   */
  path: string;
  /**
   * Whether to send cookies for auth-protected routes.
   */
  withCredentials?: boolean;
};

export function usePaginatedTableData<T>(
  options: UsePaginatedTableDataOptions,
  query: TableQueryState,
) {
  const { path, withCredentials } = options;

  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", String(query.page));
        params.set("limit", String(query.limit));
        if (query.search) {
          params.set("search", query.search);
        }
        if (query.sortBy && query.sortOrder) {
          // Backend can interpret this pair or convert to a single "sort" string if needed.
          params.set("sortBy", query.sortBy);
          params.set("sortOrder", query.sortOrder);
        }
        Object.entries(query.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && `${value}`.length > 0) {
            params.set(key, String(value));
          }
        });

        const queryString = params.toString();
        const fullPath = queryString ? `${path}?${queryString}` : path;

        const response = await apiFetch<PaginatedResponse<T>>(fullPath, {
          method: "GET",
          withCredentials,
          headers: {
            // Ensure we can cancel via AbortController if we extend apiFetch later
          },
        });

        setData(response.data || []);
        if (response.meta) {
          setMeta(response.meta);
        } else {
          // Fallback meta if backend doesn't send it
          setMeta({
            page: query.page,
            limit: query.limit,
            total: response.data?.length ?? 0,
            totalPage: 1,
          });
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError((err as Error).message || "Failed to load data");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
    };
    // We want to refetch whenever query state or path/credentials change.
  }, [path, withCredentials, query.page, query.limit, query.search, query.sortBy, query.sortOrder, JSON.stringify(query.filters)]);

  return {
    data,
    meta,
    isLoading,
    error,
  };
}


