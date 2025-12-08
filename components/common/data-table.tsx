"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SortOrder } from "@/lib/hooks/use-table-query";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  total?: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  // Search & sorting are driven from outside (via URL/query hooks)
  search?: string;
  onSearchChange?: (value: string) => void;
  sortBy?: string | null;
  sortOrder?: SortOrder | null;
  onSortChange?: (sortBy: string | null, sortOrder: SortOrder | null) => void;
  filters?: React.ReactNode;
};

export function DataTableCommon<TData, TValue>({
  columns,
  data,
  isLoading,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  search,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  filters,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pageCount = total ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  const handleToggleSort = (columnId: string) => {
    if (!onSortChange) return;

    if (sortBy !== columnId) {
      onSortChange(columnId, "asc");
    } else if (sortOrder === "asc") {
      onSortChange(columnId, "desc");
    } else {
      onSortChange(null, null);
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-2 flex-1 justify-between">
          {onSearchChange && (
            <div className="w-full max-w-xs">
              <Input
                placeholder="Search…"
                value={search ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          {filters && <div className="flex items-center gap-2">{filters}</div>}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {typeof total === "number" && <span>{total} items</span>}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border flex-1 flex flex-col min-h-0">
        <div className="w-full flex-1 overflow-y-auto overflow-x-visible">
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnId = header.column.id;
                    const canSort =
                      header.column.getCanSort?.() ?? Boolean(onSortChange);
                    const isActiveSort = sortBy === columnId;
                    const direction = isActiveSort ? sortOrder : null;

                    return (
                      <TableHead
                        key={header.id}
                        onClick={
                          canSort ? () => handleToggleSort(columnId) : undefined
                        }
                        className={
                          canSort ? "cursor-pointer select-none" : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {canSort && (
                          <span className="ml-1 inline-block text-muted-foreground">
                            {direction === "asc" && "↑"}
                            {direction === "desc" && "↓"}
                          </span>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Show skeleton rows
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={`skeleton-cell-${colIndex}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 text-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-xs disabled:opacity-50"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => onPageChange(Math.min(pageCount, page + 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-xs disabled:opacity-50"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
