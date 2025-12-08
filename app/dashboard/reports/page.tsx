"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { guideApi, GuideAnalytics } from "@/lib/api/guide";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { toast } from "sonner";

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState<GuideAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await guideApi.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      toast.error("Failed to load analytics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports & Analytics" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports & Analytics" />
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No analytics data available
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="View detailed reports and analytics about your tours and bookings"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
            <div className="text-xs text-muted-foreground mt-1">
              All time bookings
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              From completed tours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.averageRating.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              From {analytics.totalReviews} reviews
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.upcomingBookings}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Scheduled tours
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.completedBookings}</div>
            <div className="text-sm text-muted-foreground mt-1">Tours completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.pendingBookings}</div>
            <div className="text-sm text-muted-foreground mt-1">Awaiting response</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.upcomingBookings}</div>
            <div className="text-sm text-muted-foreground mt-1">Scheduled tours</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Revenue & Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="bookings"
                fill="#4F46E5"
                name="Bookings"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#10B981"
                name="Revenue ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">Completion Rate</div>
                <div className="text-sm text-muted-foreground">
                  {analytics.totalBookings > 0
                    ? ((analytics.completedBookings / analytics.totalBookings) * 100).toFixed(1)
                    : 0}%
                </div>
              </div>
              <Badge variant="outline">
                {analytics.completedBookings} / {analytics.totalBookings}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">Average Revenue per Booking</div>
                <div className="text-sm text-muted-foreground">
                  {analytics.completedBookings > 0
                    ? `$${(analytics.totalRevenue / analytics.completedBookings).toFixed(2)}`
                    : "$0.00"}
                </div>
              </div>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">Review Rate</div>
                <div className="text-sm text-muted-foreground">
                  {analytics.completedBookings > 0
                    ? ((analytics.totalReviews / analytics.completedBookings) * 100).toFixed(1)
                    : 0}%
                </div>
              </div>
              <Badge variant="outline">
                {analytics.totalReviews} reviews
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
