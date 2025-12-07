"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getListings, type Listing, type GetListingsQuery } from "@/lib/api/listing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Users, Star, Search, Filter } from "lucide-react";
import { listingCategoryOptions } from "@/lib/validation/listing";
import { toast } from "sonner";

function ExploreContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPage: number } | null>(null);
  
  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "all");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        const query: GetListingsQuery = {
          page: currentPage,
          limit: 12,
          status: "ACTIVE", // Only show active listings
        };

        if (search) query.search = search;
        if (category && category !== "all") query.category = category as any;
        if (city) query.city = city;
        if (country) query.country = country;
        if (minPrice) query.minPrice = parseFloat(minPrice);
        if (maxPrice) query.maxPrice = parseFloat(maxPrice);
        if (sortBy) query.sortBy = sortBy;
        if (sortOrder) query.sortOrder = sortOrder;

        const response = await getListings(query);
        setListings(response.data.listings);
        setMeta(response.meta || null);
      } catch (error) {
        toast.error("Failed to load listings");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [search, category, city, country, minPrice, maxPrice, sortBy, sortOrder, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setCity("");
    setCountry("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const formatPrice = (listing: Listing) => {
    return `$${listing.tourFee.toFixed(2)}${listing.feeType === "PER_PERSON" ? "/person" : "/group"}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Tours</h1>
          <p className="text-muted-foreground">
            Discover amazing tours and experiences around the world
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tours..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {listingCategoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Newest</SelectItem>
                    <SelectItem value="tourFee">Price</SelectItem>
                    <SelectItem value="avgRating">Rating</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Apply Filters</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tours found. Try adjusting your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {listings.length} of {meta?.total || 0} tours
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Link key={listing.id} href={`/tours/${listing.id}`}>
                  <Card className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg h-full flex flex-col">
                    {listing.images?.[0] && (
                      <div className="relative h-48 w-full">
                        <img
                          src={listing.images[0].url}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">{listing.category.replace(/_/g, " ")}</Badge>
                        </div>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{listing.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.city}, {listing.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {listing.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{listing.duration}h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>Up to {listing.maxGroupSize}</span>
                            </div>
                          </div>
                          {listing.avgRating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{listing.avgRating.toFixed(1)}</span>
                              <span className="text-muted-foreground">
                                ({listing.totalReviews})
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-lg font-semibold">{formatPrice(listing)}</span>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {meta.totalPage}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === meta.totalPage}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

