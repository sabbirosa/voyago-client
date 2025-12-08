"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingApi, Booking } from "@/lib/api/booking";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Eye, CreditCard, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  ACCEPTED: "bg-blue-500",
  PAID: "bg-green-500",
  COMPLETED: "bg-gray-500",
  DECLINED: "bg-red-500",
  CANCELLED: "bg-red-500",
};

export default function TripsPage() {
  const router = useRouter();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [upcomingRes, pastRes] = await Promise.all([
        bookingApi.getBookings({ upcoming: true, limit: 100 }),
        bookingApi.getBookings({ past: true, limit: 100 }),
      ]);
      setUpcomingBookings(upcomingRes.data.bookings);
      setPastBookings(pastRes.data.bookings);
    } catch (error) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {booking.listing?.images?.[0] && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={booking.listing.images[0].url}
                alt={booking.listing.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {booking.listing?.title || "Tour"}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {booking.listing?.city}, {booking.listing?.country}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(booking.date), "MMM dd, yyyy 'at' h:mm a")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {booking.groupSize} person{booking.groupSize !== 1 ? "s" : ""}
                  </div>
                </div>
                {booking.guide && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Guide: <span className="font-medium">{booking.guide.name}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <Badge className={statusColors[booking.status] || "bg-gray-500"}>
                  {booking.status}
                </Badge>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="font-semibold text-lg">
                    ${booking.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              {booking.status === "ACCEPTED" && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Pay Now
                </Button>
              )}
              {booking.status === "PAID" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Contact Guide
                </Button>
              )}
              {booking.status === "COMPLETED" && !booking.review && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                >
                  Write Review
                </Button>
              )}
              {booking.listing && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/tours/${booking.listing.id}`}>View Tour</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Trips"
        description="View and manage all your upcoming and past trips"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming Trips ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Trips ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-32 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming trips</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any upcoming trips. Start exploring tours!
                </p>
                <Button asChild>
                  <Link href="/explore">Explore Tours</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-32 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pastBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No past trips</h3>
                <p className="text-muted-foreground">
                  Your completed trips will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastBookings.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
