"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { DataTableCommon } from "@/components/common/data-table";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
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
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  ACCEPTED: "bg-blue-500",
  DECLINED: "bg-red-500",
  PAID: "bg-green-500",
  COMPLETED: "bg-gray-500",
  CANCELLED: "bg-red-500",
};

interface AdminBooking {
  id: string;
  listingId: string;
  touristId: string;
  guideId: string;
  date: string;
  groupSize: number;
  totalPrice: number;
  platformFee: number;
  status: string;
  createdAt: string;
  listing?: {
    id: string;
    title: string;
    city: string;
    country: string;
    images?: Array<{ url: string }>;
  };
  tourist?: {
    id: string;
    name: string;
    email: string;
    profile?: {
      avatarUrl: string | null;
    };
  };
  guide?: {
    id: string;
    name: string;
    email: string;
    profile?: {
      avatarUrl: string | null;
    };
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
  };
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: "all",
  });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchBookings();
  }, [page, filters, search]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 10 };
      if (filters.status && filters.status !== "all") params.status = filters.status;
      if (search) params.search = search;

      const response = await adminApi.getBookings(params);
      setBookings(response.data.bookings || []);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<AdminBooking>[] = [
    {
      accessorKey: "listing",
      header: "Tour",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex items-center gap-3">
            {booking.listing?.images?.[0] && (
              <img
                src={booking.listing.images[0].url}
                alt={booking.listing.title}
                className="w-16 h-16 rounded object-cover"
              />
            )}
            <div>
              <div className="font-medium">{booking.listing?.title || "N/A"}</div>
              <div className="text-sm text-muted-foreground">
                {booking.listing?.city}, {booking.listing?.country}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tourist",
      header: "Tourist",
      cell: ({ row }) => {
        const tourist = row.original.tourist;
        return (
          <div>
            <div className="font-medium">{tourist?.name || "N/A"}</div>
            <div className="text-sm text-muted-foreground">{tourist?.email || ""}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "guide",
      header: "Guide",
      cell: ({ row }) => {
        const guide = row.original.guide;
        return (
          <div>
            <div className="font-medium">{guide?.name || "N/A"}</div>
            <div className="text-sm text-muted-foreground">{guide?.email || ""}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return format(new Date(row.original.date), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "groupSize",
      header: "Group Size",
      cell: ({ row }) => row.original.groupSize,
    },
    {
      accessorKey: "totalPrice",
      header: "Amount",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div>
            <div className="font-medium">${booking.totalPrice.toFixed(2)}</div>
            {booking.payment && (
              <div className="text-xs text-muted-foreground">
                {booking.payment.status === "SUCCEEDED" ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Paid
                  </Badge>
                ) : (
                  <Badge variant="outline">{booking.payment.status}</Badge>
                )}
              </div>
            )}
          </div>
        );
      },
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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        return format(new Date(row.original.createdAt), "MMM dd, yyyy");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <PageHeader
        title="Booking Management"
        description="View and manage all bookings across the platform"
      />

      <div className="flex-1 flex flex-col min-h-0">
        <DataTableCommon
        columns={columns}
        data={bookings}
        isLoading={loading}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        onPageSizeChange={() => {}}
        search={searchInput}
        onSearchChange={setSearchInput}
        filters={
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => {
                  setPage(1);
                  setFilters({ ...filters, status: value });
                }}
              >
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="DECLINED">Declined</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(filters.status !== "all" || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({ status: "all" });
                  setSearchInput("");
                  setSearch("");
                  setPage(1);
                }}
                className="h-9"
              >
                Clear Filters
              </Button>
            )}
          </div>
        }
      />
      </div>
    </div>
  );
}

