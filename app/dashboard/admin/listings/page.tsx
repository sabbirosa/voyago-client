"use client";

import { useEffect, useState } from "react";
import { adminApi, AdminListing } from "@/lib/api/admin";
import { DataTableCommon } from "@/components/common/data-table";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle, Eye, Ban } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-500",
  DRAFT: "bg-gray-500",
  INACTIVE: "bg-yellow-500",
  BLOCKED: "bg-red-500",
};

export default function AdminListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });

  useEffect(() => {
    fetchListings();
  }, [page, filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 10 };
      if (filters.status && filters.status !== "all") params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const response = await adminApi.getListings(params);
      setListings(response.data.listings);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (listingId: string, newStatus: string) => {
    try {
      await adminApi.updateListing(listingId, {
        status: newStatus as "DRAFT" | "ACTIVE" | "INACTIVE" | "BLOCKED",
      });
      toast.success("Listing status updated");
      fetchListings();
    } catch (error) {
      toast.error("Failed to update listing");
    }
  };

  const columns: ColumnDef<AdminListing>[] = [
    {
      accessorKey: "title",
      header: "Listing",
      cell: ({ row }) => {
        const listing = row.original;
        return (
          <div className="flex items-center gap-3">
            {listing.images?.[0] && (
              <img
                src={listing.images[0].url}
                alt={listing.title}
                className="w-16 h-16 rounded object-cover"
              />
            )}
            <div>
              <div className="font-medium">{listing.title}</div>
              <div className="text-sm text-muted-foreground">
                {listing.city}, {listing.country}
              </div>
              <div className="text-xs text-muted-foreground">
                Guide: {listing.guide?.name || "Unknown"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className={statusColors[status] || "bg-gray-500"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "avgRating",
      header: "Rating",
      cell: ({ row }) => {
        const listing = row.original;
        return (
          <div className="text-sm">
            {listing.avgRating > 0 ? (
              <>
                ⭐ {listing.avgRating.toFixed(1)} ({listing.totalReviews} reviews)
              </>
            ) : (
              <span className="text-muted-foreground">No reviews</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const listing = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/tours/${listing.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {listing.status !== "ACTIVE" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleStatusChange(listing.id, "ACTIVE")}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            )}
            {listing.status !== "BLOCKED" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleStatusChange(listing.id, "BLOCKED")}
              >
                <Ban className="h-4 w-4 mr-1" />
                Block
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Listing Management"
        description="Approve, feature, and manage tour listings"
      />

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label>Search</Label>
          <Input
            placeholder="Search listings..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTableCommon
        columns={columns}
        data={listings}
        isLoading={loading}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        onPageSizeChange={() => {}}
      />
    </div>
  );
}

