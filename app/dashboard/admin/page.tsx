"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, AdminAnalytics } from "@/lib/api/admin";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Calendar, DollarSign, TrendingUp, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      description: `${analytics?.totalGuides || 0} guides, ${analytics?.totalTourists || 0} tourists`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/dashboard/admin/users",
    },
    {
      title: "Total Listings",
      value: analytics?.totalListings || 0,
      description: "Active tours",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/dashboard/admin/listings",
    },
    {
      title: "Total Bookings",
      value: analytics?.totalBookings || 0,
      description: "All-time bookings",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/dashboard/admin/bookings",
    },
    {
      title: "Total Revenue",
      value: `$${analytics?.totalRevenue.toFixed(2) || "0.00"}`,
      description: `Platform fees: $${analytics?.platformFees.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview and management"
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
            <CardDescription>Manage platform operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => router.push("/dashboard/admin/users")}>
              Manage Users
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/admin/listings")}>
              Manage Listings
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/admin/bookings")}>
              View Bookings
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/admin/reports")}>
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>Current platform metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : analytics ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Guides:</span>
                  <span className="font-medium">{analytics.totalGuides}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Tourists:</span>
                  <span className="font-medium">{analytics.totalTourists}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Listings:</span>
                  <span className="font-medium">{analytics.totalListings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Revenue:</span>
                  <span className="font-medium">${analytics.platformFees.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

