"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingApi, Booking } from "@/lib/api/booking";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Eye, Plus } from "lucide-react";
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

export default function ItinerariesPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getBookings({
        upcoming: true,
        limit: 100,
      });
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error("Failed to load itineraries");
    } finally {
      setLoading(false);
    }
  };

  // Group bookings by date (itinerary)
  const groupedBookings = bookings.reduce((acc, booking) => {
    const dateKey = format(new Date(booking.date), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  const itineraryDates = Object.keys(groupedBookings).sort();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Itineraries"
          description="Manage your travel itineraries"
        />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (itineraryDates.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Itineraries"
          description="Manage your travel itineraries"
        />
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No upcoming trips</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any upcoming trips yet. Start exploring tours!
            </p>
            <Button asChild>
              <Link href="/explore">
                <Plus className="h-4 w-4 mr-2" />
                Explore Tours
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Itineraries"
        description="Manage your travel itineraries for upcoming trips"
      />

      <div className="space-y-6">
        {itineraryDates.map((dateKey) => {
          const dateBookings = groupedBookings[dateKey];
          const date = new Date(dateKey);
          const isToday = format(new Date(), "yyyy-MM-dd") === dateKey;
          const isTomorrow =
            format(new Date(Date.now() + 86400000), "yyyy-MM-dd") === dateKey;

          return (
            <Card key={dateKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle>
                        {isToday
                          ? "Today"
                          : isTomorrow
                          ? "Tomorrow"
                          : format(date, "EEEE, MMMM dd, yyyy")}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {dateBookings.length} tour{dateBookings.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dateBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {booking.listing?.images?.[0] && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={booking.listing.images[0].url}
                            alt={booking.listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">
                              {booking.listing?.title || "Tour"}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.listing?.city}, {booking.listing?.country}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {booking.groupSize} person{booking.groupSize !== 1 ? "s" : ""}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(booking.date), "h:mm a")}
                              </div>
                            </div>
                            {booking.guide && (
                              <p className="text-sm text-muted-foreground">
                                Guide: {booking.guide.name}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              className={statusColors[booking.status] || "bg-gray-500"}
                            >
                              {booking.status}
                            </Badge>
                            <div className="text-right">
                              <div className="font-semibold">
                                ${booking.totalPrice.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/dashboard/bookings/${booking.id}`)
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {booking.listing && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={`/tours/${booking.listing.id}`}>
                                View Tour
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
