"use client";

import { DataTableCommon } from "@/components/common/data-table";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SiteHeader } from "@/components/dashboard/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { deleteListing, type Listing } from "@/lib/api/listing";
import { useAuth } from "@/lib/auth/useAuth";
import { usePaginatedTableData } from "@/lib/hooks/use-paginated-table-data";
import { useTableQuery } from "@/lib/hooks/use-table-query";
import {
  listingCategoryOptions,
  listingStatusOptions,
} from "@/lib/validation/listing";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ListingForm } from "./_components/ListingForm";

export default function ListingsPage() {
  const { user, role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(
    null
  );

  const tableQuery = useTableQuery({
    defaultPageSize: 10,
    filterKeys: ["status", "category", "city", "guideId"],
  });

  // Build query params with guideId filter
  const queryParams = {
    ...tableQuery.query,
  };

  // Add guideId to filters if user is a guide
  if (role === "GUIDE" && user?.id) {
    queryParams.filters = {
      ...queryParams.filters,
      guideId: user.id,
    };
  }

  const {
    data: listings,
    meta,
    isLoading,
    error,
  } = usePaginatedTableData<Listing>(
    {
      path: "/listings",
      withCredentials: true,
    },
    queryParams
  );

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    router.refresh();
    toast.success("Listing created successfully");
  };

  const handleEditSuccess = () => {
    setEditingListing(null);
    router.refresh();
    toast.success("Listing updated successfully");
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    setDeletingListingId(listingId);
    try {
      await deleteListing(listingId);
      toast.success("Listing deleted successfully");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete listing. Please try again.";
      toast.error(errorMessage);
    } finally {
      setDeletingListingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      ACTIVE: "default",
      DRAFT: "secondary",
      INACTIVE: "outline",
      BLOCKED: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const columns: ColumnDef<Listing, unknown>[] = [
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category}</Badge>
      ),
    },
    {
      id: "city",
      header: "Location",
      accessorKey: "city",
      cell: ({ row }) => (
        <div>
          {row.original.city}, {row.original.country}
        </div>
      ),
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "tourFee",
      cell: ({ row }) => (
        <div>
          ${row.original.tourFee.toFixed(2)}{" "}
          {row.original.feeType === "PER_PERSON" ? "/person" : "/group"}
        </div>
      ),
    },
    {
      id: "duration",
      header: "Duration",
      accessorKey: "duration",
      cell: ({ row }) => <div>{row.original.duration}h</div>,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingListing(row.original)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
            disabled={deletingListingId === row.original.id}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Redirect if not a guide or admin (only after auth is loaded)
  useEffect(() => {
    if (!authLoading && role && role !== "GUIDE" && role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [role, router, authLoading]);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Don't render if not a guide or admin (will redirect)
  if (role && role !== "GUIDE" && role !== "ADMIN") {
    return null;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <PageHeader
                  title="Listings"
                  description="Manage your tour listings"
                />
              </div>

              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>My Listings</CardTitle>
                        <CardDescription>
                          Create and manage your tour listings
                        </CardDescription>
                      </div>
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Listing
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DataTableCommon
                      columns={columns}
                      data={listings}
                      isLoading={isLoading}
                      total={meta?.total}
                      page={tableQuery.query.page}
                      pageSize={tableQuery.query.limit}
                      onPageChange={tableQuery.setPage}
                      onPageSizeChange={tableQuery.setPageSize}
                      search={tableQuery.query.search}
                      onSearchChange={tableQuery.setSearch}
                      sortBy={tableQuery.query.sortBy}
                      sortOrder={tableQuery.query.sortOrder}
                      onSortChange={tableQuery.setSort}
                      filters={
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium whitespace-nowrap">
                              Status:
                            </label>
                            <Select
                              value={tableQuery.query.filters.status || "all"}
                              onValueChange={(value) =>
                                tableQuery.setFilter(
                                  "status",
                                  value === "all" ? null : value
                                )
                              }
                            >
                              <SelectTrigger className="w-[130px] h-9">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  All statuses
                                </SelectItem>
                                {listingStatusOptions.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium whitespace-nowrap">
                              Category:
                            </label>
                            <Select
                              value={tableQuery.query.filters.category || "all"}
                              onValueChange={(value) =>
                                tableQuery.setFilter(
                                  "category",
                                  value === "all" ? null : value
                                )
                              }
                            >
                              <SelectTrigger className="w-[130px] h-9">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  All categories
                                </SelectItem>
                                {listingCategoryOptions.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {(tableQuery.query.filters.status ||
                            tableQuery.query.filters.category ||
                            tableQuery.query.search ||
                            tableQuery.query.sortBy) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                tableQuery.clearAllFilters();
                              }}
                              className="h-9 px-2"
                            >
                              <X className="mr-1 h-3 w-3" />
                              Clear all
                            </Button>
                          )}
                        </div>
                      }
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Listing</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new tour listing
            </DialogDescription>
          </DialogHeader>
          <ListingForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingListing}
        onOpenChange={(open) => !open && setEditingListing(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>
              Update the details of your tour listing
            </DialogDescription>
          </DialogHeader>
          {editingListing && (
            <ListingForm
              initialData={editingListing}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingListing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
