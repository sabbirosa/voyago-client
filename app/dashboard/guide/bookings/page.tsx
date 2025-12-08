"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { bookingApi, Booking } from "@/lib/api/booking";
import { DataTableCommon } from "@/components/common/data-table";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, Check, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  ACCEPTED: "bg-blue-500",
  PAID: "bg-green-500",
  COMPLETED: "bg-gray-500",
  DECLINED: "bg-red-500",
  CANCELLED: "bg-red-500",
};

export default function GuideBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "decline" | null>(null);
  const fetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset page when tab changes
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [activeTab]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBookings();
    }, 100); // Small delay to debounce rapid changes
    
    return () => {
      clearTimeout(timeoutId);
      // Cancel any in-flight requests when component unmounts or dependencies change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [activeTab, page]);

  const fetchBookings = async () => {
    if (fetchingRef.current) return;
    
    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    try {
      fetchingRef.current = true;
      setLoading(true);
      const params: any = { page, limit: 10 };
      if (activeTab === "pending") {
        params.status = "PENDING";
      } else if (activeTab === "upcoming") {
        params.status = "ACCEPTED";
      } else if (activeTab === "past") {
        params.past = true;
      }
      const response = await bookingApi.getBookings(params);
      setBookings(response.data.bookings);
      setTotal(response.meta?.total || 0);
    } catch (error: any) {
      // Don't show error if request was aborted
      if (error?.name === "AbortError") {
        return;
      }
      // Handle 429 rate limit errors gracefully
      if (error?.message?.includes("429") || error?.message?.includes("Too Many Requests")) {
        console.warn("Rate limited, please wait a moment");
        // Don't show toast for rate limits, just log
        return;
      }
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
      abortControllerRef.current = null;
    }
  };

  const handleAccept = async () => {
    if (!selectedBooking) return;
    try {
      await bookingApi.updateBookingStatus(selectedBooking.id, {
        status: "ACCEPTED",
      });
      toast.success("Booking accepted successfully");
      setActionDialogOpen(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept booking"
      );
    }
  };

  const handleDecline = async () => {
    if (!selectedBooking) return;
    try {
      await bookingApi.updateBookingStatus(selectedBooking.id, {
        status: "DECLINED",
      });
      toast.success("Booking declined");
      setActionDialogOpen(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to decline booking"
      );
    }
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "listing",
      header: "Tour",
      cell: ({ row }) => {
        const listing = row.original.listing;
        return (
          <div className="flex items-center gap-3">
            {listing?.images?.[0] && (
              <img
                src={listing.images[0].url}
                alt={listing.title}
                className="w-16 h-16 rounded object-cover"
              />
            )}
            <div>
              <div className="font-medium">{listing?.title}</div>
              <div className="text-sm text-muted-foreground">
                {listing?.city}, {listing?.country}
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
          <div className="flex items-center gap-2">
            <div>
              <div className="font-medium">{tourist?.name}</div>
              <div className="text-sm text-muted-foreground">{tourist?.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.date), "MMM dd, yyyy"),
    },
    {
      accessorKey: "groupSize",
      header: "Group Size",
      cell: ({ row }) => `${row.original.groupSize} person(s)`,
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => `$${row.original.totalPrice.toFixed(2)}`,
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {booking.status === "PENDING" && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setActionType("accept");
                    setActionDialogOpen(true);
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setActionType("decline");
                    setActionDialogOpen(true);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking Management"
        description="Review and manage booking requests for your tours"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="upcoming">Accepted/Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past/Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <DataTableCommon
            columns={columns}
            data={bookings}
            isLoading={loading}
            total={total}
            page={page}
            pageSize={10}
            onPageChange={setPage}
            onPageSizeChange={() => {}}
          />
        </TabsContent>
      </Tabs>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "accept" ? "Accept Booking?" : "Decline Booking?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "accept"
                ? "Are you sure you want to accept this booking request? The tourist will be able to proceed with payment."
                : "Are you sure you want to decline this booking request? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={actionType === "accept" ? handleAccept : handleDecline}
              className={actionType === "decline" ? "bg-destructive" : ""}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

