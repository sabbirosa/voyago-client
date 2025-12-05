"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingApi } from "@/lib/api/booking";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, TrendingUp, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function TouristDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    upcomingTrips: 0,
    pastTrips: 0,
    totalSpent: 0,
    wishlistCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [upcomingRes, pastRes] = await Promise.all([
        bookingApi.getBookings({ upcoming: true, limit: 100 }),
        bookingApi.getBookings({ past: true, limit: 100 }),
      ]);

      const upcomingBookings = upcomingRes.data.bookings || [];
      const pastBookings = pastRes.data.bookings || [];
      
      const totalSpent = pastBookings
        .filter((b) => b.payment?.status === "SUCCEEDED")
        .reduce((sum, b) => sum + (b.payment?.amount || 0), 0);

      setStats({
        upcomingTrips: upcomingBookings.length,
        pastTrips: pastBookings.length,
        totalSpent,
        wishlistCount: 0, // Will be fetched separately
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Upcoming Trips",
      value: stats.upcomingTrips,
      description: "Tours you're looking forward to",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/dashboard/tourist/bookings?tab=upcoming",
    },
    {
      title: "Past Trips",
      value: stats.pastTrips,
      description: "Completed experiences",
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      href: "/dashboard/tourist/bookings?tab=past",
    },
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      description: "All-time spending",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Wishlist",
      value: stats.wishlistCount,
      description: "Saved tours",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/dashboard/tourist/wishlist",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your travel experiences."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const content = (
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`rounded-full p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );

          if (card.href) {
            return (
              <Link key={card.title} href={card.href}>
                {content}
              </Link>
            );
          }

          return <div key={card.title}>{content}</div>;
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your next adventure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => router.push("/explore")}>
              Explore Tours
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/tourist/wishlist")}>
              View Wishlist
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest bookings and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton className="h-4 w-full" />
              ) : stats.upcomingTrips > 0 ? (
                `You have ${stats.upcomingTrips} upcoming trip${stats.upcomingTrips > 1 ? "s" : ""}`
              ) : (
                "No upcoming trips. Start exploring tours!"
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

