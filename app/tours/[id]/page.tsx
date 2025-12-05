"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getListingById, Listing } from "@/lib/api/listing";
import { BookingRequestForm } from "./_components/BookingRequestForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Languages, Star, Heart } from "lucide-react";
import { toast } from "sonner";
import { wishlistApi } from "@/lib/api/wishlist";
import { useAuth } from "@/lib/auth/useAuth";
import { useState, useEffect } from "react";

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true);
        const data = await getListingById(listingId);
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listing");
        toast.error("Failed to load tour details");
      } finally {
        setLoading(false);
      }
    }

    async function checkWishlist() {
      if (isAuthenticated && listingId) {
        try {
          const response = await wishlistApi.checkWishlistStatus(listingId);
          setIsInWishlist(response.data.isInWishlist);
        } catch (err) {
          // Silent fail for wishlist check
        }
      }
    }

    if (listingId) {
      fetchListing();
      checkWishlist();
    }
  }, [listingId, isAuthenticated]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!listingId) return;

    try {
      setWishlistLoading(true);
      if (isInWishlist) {
        await wishlistApi.removeFromWishlist(listingId);
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistApi.addToWishlist(listingId);
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {error || "Tour not found"}
            </p>
            <Button
              onClick={() => router.push("/")}
              className="mt-4 w-full"
              variant="outline"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mainImage = listing.images[0]?.url;
  const guide = listing.guide;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with Image */}
      {mainImage && (
        <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6">
          <img
            src={mainImage}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Category */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{listing.category}</Badge>
                <Badge variant="outline">
                  {listing.city}, {listing.country}
                </Badge>
              </div>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
          </div>

          {/* Guide Card */}
          {guide && (
            <Card>
              <CardHeader>
                <CardTitle>About Your Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={guide.profile?.avatarUrl || undefined} />
                    <AvatarFallback>
                      {guide.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{guide.name}</h3>
                      {guide.guideProfile?.verificationStatus === "VERIFIED" && (
                        <Badge variant="default" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    {guide.profile?.bio && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {guide.profile.bio}
                      </p>
                    )}
                    {guide.guideProfile && (
                      <div className="flex flex-wrap gap-2 text-sm">
                        {guide.guideProfile.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {guide.guideProfile.expertise.slice(0, 3).map((exp) => (
                              <Badge key={exp} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {guide.guideProfile.experienceYears && (
                          <span className="text-muted-foreground">
                            {guide.guideProfile.experienceYears} years experience
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Tour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{listing.description}</p>
            </CardContent>
          </Card>

          {/* Itinerary */}
          {listing.itinerary && (
            <Card>
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{listing.itinerary}</p>
              </CardContent>
            </Card>
          )}

          {/* Key Details */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Duration: {listing.duration} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Max group size: {listing.maxGroupSize} people</span>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <span>Languages: {listing.languages.join(", ")}</span>
              </div>
              {listing.meetingPoint && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{listing.meetingPoint}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          {listing.reviews && listing.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  Reviews ({listing.totalReviews})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {listing.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage
                          src={review.tourist.profile?.avatarUrl || undefined}
                        />
                        <AvatarFallback>
                          {review.tourist.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{review.tourist.name}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.title && (
                          <h4 className="font-medium mb-1">{review.title}</h4>
                        )}
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Widget Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <BookingRequestForm listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}

