"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { guideApi, GuideAnalytics } from "@/lib/api/guide";
import { bookingApi } from "@/lib/api/booking";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Star, TrendingUp, Clock, Users, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function GuideDashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<GuideAnalytics | null>(null);
  const [stats, setStats] = useState({
    pendingBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (!fetchingRef.current) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    if (fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
      setLoading(true);
      
      // Use smaller limit and fetch only what we need for stats
      const [analyticsRes, pendingRes, upcomingRes] = await Promise.all([
        guideApi.getAnalytics().catch((err) => {
          // If analytics fails, continue with bookings
          console.warn("Analytics fetch failed:", err);
          return { data: null };
        }),
        bookingApi.getBookings({ status: "PENDING", limit: 10 }).catch(() => ({ data: { bookings: [] } })),
        bookingApi.getBookings({ status: "ACCEPTED", limit: 10 }).catch(() => ({ data: { bookings: [] } })),
      ]);

      if (analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }
      
      const pendingBookings = pendingRes.data?.bookings || [];
      const upcomingBookings = upcomingRes.data?.bookings || [];
      
      // Calculate stats from analytics if available, otherwise use booking counts
      if (analyticsRes.data) {
        setStats({
          pendingBookings: analyticsRes.data.pendingBookings || pendingBookings.length,
          upcomingBookings: analyticsRes.data.upcomingBookings || upcomingBookings.length,
          completedBookings: analyticsRes.data.completedBookings || 0,
        });
      } else {
        setStats({
          pendingBookings: pendingBookings.length,
          upcomingBookings: upcomingBookings.filter((b: any) => {
            const date = new Date(b.date);
            return date > new Date();
          }).length,
          completedBookings: 0,
        });
      }
    } catch (error: any) {
      // Handle 429 rate limit errors gracefully
      if (error?.message?.includes("429") || error?.message?.includes("Too Many Requests")) {
        console.warn("Rate limited, will retry later");
        // Set default values on rate limit
        setStats({
          pendingBookings: 0,
          upcomingBookings: 0,
          completedBookings: 0,
        });
      } else {
        console.error("Failed to fetch dashboard data:", error);
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  const statCards = [
    {
      title: "Total Bookings",
      value: analytics?.totalBookings || 0,
      description: "All-time bookings",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/dashboard/guide/bookings",
    },
    {
      title: "Total Revenue",
      value: `$${analytics?.totalRevenue.toFixed(2) || "0.00"}`,
      description: "Earnings from tours",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Average Rating",
      value: analytics?.averageRating.toFixed(1) || "0.0",
      description: `${analytics?.totalReviews || 0} reviews`,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Pending Requests",
      value: stats.pendingBookings,
      description: "Awaiting your response",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/dashboard/guide/bookings?tab=pending",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your guide business."
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
            <CardDescription>Manage your tours and bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => router.push("/dashboard/listings")}>
              Manage Listings
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/guide/bookings")}>
              View Bookings
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/guide/availability")}>
              Set Availability
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
              ) : stats.pendingBookings > 0 ? (
                `You have ${stats.pendingBookings} pending booking${stats.pendingBookings > 1 ? "s" : ""} awaiting your response`
              ) : stats.upcomingBookings > 0 ? (
                `You have ${stats.upcomingBookings} upcoming tour${stats.upcomingBookings > 1 ? "s" : ""}`
              ) : (
                "No pending bookings. Your tours are ready to go!"
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

