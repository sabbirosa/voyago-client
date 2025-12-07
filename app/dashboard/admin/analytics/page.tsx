"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminAnalytics, adminApi } from "@/lib/api/admin";
import {
  BarChart3,
  Calendar,
  DollarSign,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AdminAnalyticsPage() {
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
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics Dashboard" />
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
        <PageHeader title="Analytics Dashboard" />
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

  const bookingStatusData = Object.entries(analytics.bookingsByStatus).map(
    ([status, count]) => ({
      status,
      count,
    })
  );

  const categoryData = analytics.popularCategories.map((cat) => ({
    name: cat.category,
    value: cat.count,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Platform insights and statistics"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.totalGuides} guides, {analytics.totalTourists} tourists
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Listings
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalListings}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Active tours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBookings}</div>
            <div className="text-xs text-muted-foreground mt-1">All time</div>
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
              Platform fees: ${analytics.platformFees.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Bookings & Revenue by Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="count"
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

        {/* Bookings by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Bookings by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent ?? 0 * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader>
            <CardTitle>Top Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.topCities.slice(0, 10).map((city, index) => (
                <div
                  key={`${city.city}-${city.country}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">#{index + 1}</span>
                    <span className="font-medium">
                      {city.city}, {city.country}
                    </span>
                  </div>
                  <Badge variant="secondary">{city.count} listings</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Guides */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Guides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.topGuides.map((guide, index) => (
              <div
                key={guide.guideId}
                className="flex items-center justify-between p-3 rounded border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-medium">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-medium">{guide.guideName}</div>
                    <div className="text-sm text-muted-foreground">
                      {guide.bookings} bookings
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ${guide.revenue.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
