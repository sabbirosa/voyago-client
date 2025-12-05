"use client";

import { useEffect, useState } from "react";
import { guideApi, GuideAnalytics, GuideBadge } from "@/lib/api/guide";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Star, TrendingUp, Award, Users } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const badgeIcons: Record<string, { icon: any; color: string }> = {
  SUPER_GUIDE: { icon: Award, color: "text-yellow-600" },
  NEWCOMER: { icon: Users, color: "text-blue-600" },
  TOP_RATED: { icon: Star, color: "text-purple-600" },
  POPULAR: { icon: TrendingUp, color: "text-green-600" },
  VERIFIED: { icon: Award, color: "text-indigo-600" },
  EARLY_ADOPTER: { icon: Award, color: "text-orange-600" },
};

const badgeLabels: Record<string, string> = {
  SUPER_GUIDE: "Super Guide",
  NEWCOMER: "Newcomer",
  TOP_RATED: "Top Rated",
  POPULAR: "Popular",
  VERIFIED: "Verified",
  EARLY_ADOPTER: "Early Adopter",
};

export default function GuideAnalyticsPage() {
  const [analytics, setAnalytics] = useState<GuideAnalytics | null>(null);
  const [badges, setBadges] = useState<GuideBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, badgesRes] = await Promise.all([
        guideApi.getAnalytics(),
        guideApi.getBadges(),
      ]);
      setAnalytics(analyticsRes.data);
      setBadges(badgesRes.data);
    } catch (error) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
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
      title: "Upcoming Tours",
      value: analytics?.upcomingBookings || 0,
      description: "Scheduled tours",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Performance"
        description="Track your guide performance and earnings"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
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
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue and bookings over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : analytics?.monthlyRevenue ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                  <Bar dataKey="bookings" fill="#82ca9d" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Overview of your bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed</span>
                  <Badge variant="secondary">{analytics?.completedBookings || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending</span>
                  <Badge variant="secondary">{analytics?.pendingBookings || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Upcoming</span>
                  <Badge variant="secondary">{analytics?.upcomingBookings || 0}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges & Achievements</CardTitle>
          <CardDescription>Your earned badges and recognition</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : badges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No badges earned yet. Keep guiding!</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge) => {
                const badgeInfo = badgeIcons[badge.badgeType] || badgeIcons.SUPER_GUIDE;
                const Icon = badgeInfo.icon;
                return (
                  <Card key={badge.id} className="border-2">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`rounded-full p-3 ${badgeInfo.color.replace("text-", "bg-").replace("-600", "-100")}`}>
                        <Icon className={`h-6 w-6 ${badgeInfo.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{badgeLabels[badge.badgeType] || badge.badgeType}</div>
                        <div className="text-xs text-muted-foreground">
                          Earned {new Date(badge.earnedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

