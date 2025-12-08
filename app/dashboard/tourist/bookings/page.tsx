"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { bookingApi, Booking } from "@/lib/api/booking";
import { paymentApi } from "@/lib/api/payment";
import { DataTableCommon } from "@/components/common/data-table";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, CreditCard, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  ACCEPTED: "bg-blue-500",
  PAID: "bg-green-500",
  COMPLETED: "bg-gray-500",
  DECLINED: "bg-red-500",
  CANCELLED: "bg-red-500",
};

export default function TouristBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Check for payment success/cancel from Stripe redirect
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");
    if (paymentStatus === "success") {
      toast.success("Payment successful! Your tour is confirmed.");
      // Clean URL
      router.replace("/dashboard/tourist/bookings");
    } else if (paymentStatus === "cancelled") {
      toast.info("Payment was cancelled. You can try again from your booking.");
      router.replace("/dashboard/tourist/bookings");
    }
  }, [searchParams, router]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "past" || tab === "upcoming") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBookings();
  }, [activeTab, page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getBookings({
        upcoming: activeTab === "upcoming",
        past: activeTab === "past",
        page,
        limit: 10,
      });
      setBookings(response.data.bookings);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (booking: Booking) => {
    try {
      const response = await paymentApi.createPaymentSession(booking.id);
      if (response.data.payment.checkoutUrl) {
        window.location.href = response.data.payment.checkoutUrl;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create payment session"
      );
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking || !cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    try {
      await bookingApi.updateBookingStatus(selectedBooking.id, {
        status: "CANCELLED",
        reason: cancelReason,
      });
      toast.success("Booking cancelled successfully");
      setCancelDialogOpen(false);
      setCancelReason("");
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel booking"
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
            {booking.status === "ACCEPTED" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handlePayNow(booking)}
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Pay Now
              </Button>
            )}
            {(booking.status === "PENDING" || booking.status === "ACCEPTED") && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelectedBooking(booking);
                  setCancelDialogOpen(true);
                }}
              >
                <X className="h-4 w-4" />
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
        title="My Bookings"
        description="Manage your tour bookings and payments"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
          <TabsTrigger value="past">Past Trips</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <DataTableCommon
            columns={columns}
            data={bookings.filter((b) => activeTab === "upcoming")}
            isLoading={loading}
            total={total}
            page={page}
            pageSize={10}
            onPageChange={setPage}
            onPageSizeChange={() => {}}
          />
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          <DataTableCommon
            columns={columns}
            data={bookings.filter((b) => activeTab === "past")}
            isLoading={loading}
            total={total}
            page={page}
            pageSize={10}
            onPageChange={setPage}
            onPageSizeChange={() => {}}
          />
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Cancellation Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

