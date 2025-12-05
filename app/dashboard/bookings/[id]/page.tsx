"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { bookingApi, Booking } from "@/lib/api/booking";
import { paymentApi } from "@/lib/api/payment";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { CreditCard, ArrowLeft, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/useAuth";
import { ReviewForm } from "@/components/review/ReviewForm";
import { MessageChat } from "@/components/message/MessageChat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  ACCEPTED: "bg-blue-500",
  PAID: "bg-green-500",
  COMPLETED: "bg-gray-500",
  DECLINED: "bg-red-500",
  CANCELLED: "bg-red-500",
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getBookingById(bookingId);
      setBooking(response.data.booking);
    } catch (error) {
      toast.error("Failed to load booking details");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!booking) return;
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

  const handleAccept = async () => {
    if (!booking) return;
    try {
      await bookingApi.updateBookingStatus(booking.id, {
        status: "ACCEPTED",
      });
      toast.success("Booking accepted successfully");
      fetchBooking();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept booking"
      );
    }
  };

  const handleDecline = async () => {
    if (!booking) return;
    try {
      await bookingApi.updateBookingStatus(booking.id, {
        status: "DECLINED",
      });
      toast.success("Booking declined");
      fetchBooking();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to decline booking"
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Booking Details" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <PageHeader title="Booking Not Found" />
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Booking not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isTourist = user?.role === "TOURIST";
  const isGuide = user?.role === "GUIDE";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Booking Details" />
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking Information</CardTitle>
                <Badge className={statusColors[booking.status] || "bg-gray-500"}>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Booking ID</div>
                <div className="font-mono text-sm">{booking.id}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Tour Date</div>
                <div>{format(new Date(booking.date), "MMMM dd, yyyy 'at' h:mm a")}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Group Size</div>
                <div>{booking.groupSize} person(s)</div>
              </div>
              {booking.note && (
                <div>
                  <div className="text-sm text-muted-foreground">Special Requests</div>
                  <div>{booking.note}</div>
                </div>
              )}
              {booking.cancelReason && (
                <div>
                  <div className="text-sm text-muted-foreground">Cancellation Reason</div>
                  <div className="text-destructive">{booking.cancelReason}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Listing Info */}
          {booking.listing && (
            <Card>
              <CardHeader>
                <CardTitle>Tour Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  {booking.listing.images?.[0] && (
                    <img
                      src={booking.listing.images[0].url}
                      alt={booking.listing.title}
                      className="w-24 h-24 rounded object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{booking.listing.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.listing.city}, {booking.listing.country}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => router.push(`/tours/${booking.listingId}`)}
                    >
                      View Tour Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>{isTourist ? "Guide Information" : "Tourist Information"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isTourist && booking.guide ? (
                <div>
                  <div className="font-semibold">{booking.guide.name}</div>
                  <div className="text-sm text-muted-foreground">{booking.guide.email}</div>
                </div>
              ) : isGuide && booking.tourist ? (
                <div>
                  <div className="font-semibold">{booking.tourist.name}</div>
                  <div className="text-sm text-muted-foreground">{booking.tourist.email}</div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Price</span>
                <span>${(booking.totalPrice - booking.platformFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee</span>
                <span>${booking.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Total</span>
                <span>${booking.totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          {booking.payment && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  className={
                    booking.payment.status === "SUCCEEDED"
                      ? "bg-green-500"
                      : booking.payment.status === "FAILED"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }
                >
                  {booking.payment.status}
                </Badge>
                {booking.payment.paidAt && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Paid on {format(new Date(booking.payment.paidAt), "MMM dd, yyyy")}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isTourist && booking.status === "ACCEPTED" && (
                <Button className="w-full" onClick={handlePayNow}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              )}
              {isGuide && booking.status === "PENDING" && (
                <>
                  <Button className="w-full" onClick={handleAccept}>
                    <Check className="h-4 w-4 mr-2" />
                    Accept Booking
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDecline}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline Booking
                  </Button>
                </>
              )}
              {isTourist && booking.status === "COMPLETED" && !booking.review && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      Write Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Write a Review</DialogTitle>
                      <DialogDescription>
                        Share your experience with this tour
                      </DialogDescription>
                    </DialogHeader>
                    <ReviewForm
                      bookingId={booking.id}
                      onSuccess={() => {
                        fetchBooking();
                      }}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="messages">
          <MessageChat bookingId={booking.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

