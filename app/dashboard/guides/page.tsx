"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { guideApi, PublicGuideProfile } from "@/lib/api/guide";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function GuidesPage() {
  const router = useRouter();
  const [guides, setGuides] = useState<PublicGuideProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchGuides();
  }, [page, search]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await guideApi.getGuides({
        page,
        limit: 12,
        search: search || undefined,
      });
      setGuides(response.data.guides || []);
      setTotal(response.meta?.total || 0);
    } catch (error) {
      toast.error("Failed to load guides");
    } finally {
      setLoading(false);
    }
  };

  if (loading && guides.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Guides"
          description="Browse and connect with verified guides"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-48 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guides"
        description="Browse and connect with verified guides for your travel experiences"
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search guides by name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
      </div>

      {guides.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No guides found</h3>
            <p className="text-muted-foreground">
              {search
                ? "Try adjusting your search terms"
                : "There are no guides available at the moment"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Card
                key={guide.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/guide/${guide.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={guide.profile?.avatarUrl} alt={guide.name} />
                      <AvatarFallback>{guide.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold truncate">{guide.name}</h3>
                        {guide.guideProfile?.verificationStatus === "VERIFIED" && (
                          <Badge className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      {guide.profile?.city && guide.profile?.country && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {guide.profile.city}, {guide.profile.country}
                        </div>
                      )}
                    </div>
                  </div>

                  {guide.profile?.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {guide.profile.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {guide.stats.averageRating > 0
                          ? guide.stats.averageRating.toFixed(1)
                          : "New"}
                      </span>
                      {guide.stats.totalReviews > 0 && (
                        <span className="text-sm text-muted-foreground">
                          ({guide.stats.totalReviews})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {guide.stats.totalListings} tour{guide.stats.totalListings !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {guide.guideProfile?.expertise && guide.guideProfile.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {guide.guideProfile.expertise.slice(0, 3).map((exp) => (
                        <Badge key={exp} variant="outline" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                      {guide.guideProfile.expertise.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{guide.guideProfile.expertise.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {guide.listings && guide.listings.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {guide.listings.slice(0, 3).map((listing) => (
                        <div
                          key={listing.id}
                          className="relative aspect-video rounded overflow-hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/tours/${listing.id}`);
                          }}
                        >
                          {listing.image ? (
                            <Image
                              src={listing.image}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/guide/${guide.id}`);
                    }}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {total > 12 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min((page - 1) * 12 + 1, total)} - {Math.min(page * 12, total)} of{" "}
                {total} guides
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * 12 >= total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
