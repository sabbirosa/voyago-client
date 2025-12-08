"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { guideApi, PublicGuideProfile } from "@/lib/api/guide";
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Languages,
  MapPin,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function GuideProfilePage() {
  const params = useParams();
  const router = useRouter();
  const guideId = params.id as string;
  const [guide, setGuide] = useState<PublicGuideProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGuide() {
      if (!guideId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await guideApi.getPublicProfile(guideId);
        if (response.data?.guide) {
          setGuide(response.data.guide);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        console.error("[GuideProfilePage] Error loading guide:", error);
        const errorMessage = error?.message || "Failed to load guide profile";

        // Only redirect to explore if it's a 404 (guide not found)
        // For other errors, show error state on the page
        if (
          errorMessage.includes("404") ||
          errorMessage.includes("not found") ||
          errorMessage.includes("Not Found")
        ) {
          toast.error("Guide not found");
          router.push("/explore");
        } else {
          toast.error(errorMessage);
          // Don't redirect - let user see the error or try again
          setLoading(false);
        }
      } finally {
        setLoading(false);
      }
    }

    loadGuide();
  }, [guideId, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Guide Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The guide profile you're looking for doesn't exist or has been
              removed.
            </p>
            <Button onClick={() => router.push("/explore")} variant="default">
              Browse Guides
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { profile, guideProfile, listings, stats } = guide;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-16">
      {/* Header Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profile?.avatarUrl} alt={guide.name} />
              <AvatarFallback>
                {guide.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{guide.name}</h1>
                  {guideProfile?.verificationStatus === "VERIFIED" && (
                    <Badge className="bg-green-500 mb-2">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified Guide
                    </Badge>
                  )}
                </div>
              </div>
              {profile?.bio && (
                <p className="text-muted-foreground mb-4">{profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile?.city && profile?.country && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.city}, {profile.country}
                  </div>
                )}
                {guideProfile?.experienceYears && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {guideProfile.experienceYears} years experience
                  </div>
                )}
                {profile?.languages && profile.languages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Languages className="h-4 w-4" />
                    {profile.languages.join(", ")}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">
                  {stats.averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.totalBookings} booking
                {stats.totalBookings !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalListings}</div>
              <div className="text-sm text-muted-foreground">Active Tours</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <div className="text-sm text-muted-foreground">
                Total Bookings
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expertise Section */}
      {guideProfile?.expertise && guideProfile.expertise.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {guideProfile.expertise.map((exp) => (
                <Badge key={exp} variant="outline">
                  {exp}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tours Section */}
      <Card>
        <CardHeader>
          <CardTitle>Available Tours</CardTitle>
        </CardHeader>
        <CardContent>
          {listings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No tours available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <Link key={listing.id} href={`/tours/${listing.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full pt-0">
                    {listing.image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={listing.image}
                          alt={listing.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <CardContent className="pt-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {listing.city}, {listing.country}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {listing.avgRating > 0
                              ? listing.avgRating.toFixed(1)
                              : "New"}
                          </span>
                          {listing.totalReviews > 0 && (
                            <span className="text-xs text-muted-foreground">
                              ({listing.totalReviews})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <DollarSign className="h-4 w-4" />
                          {listing.tourFee}
                          {listing.feeType === "PER_PERSON" && (
                            <span className="text-xs">/person</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
