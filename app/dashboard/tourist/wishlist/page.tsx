"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { wishlistApi, WishlistItem } from "@/lib/api/wishlist";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, [page]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistApi.getWishlist(page, 12);
      setWishlist(response.data);
      setTotal(response.pagination?.total || 0);
    } catch (error) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!selectedItem) return;

    try {
      setRemovingId(selectedItem.id);
      await wishlistApi.removeFromWishlist(selectedItem.listingId);
      toast.success("Removed from wishlist");
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      fetchWishlist();
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewListing = (listingId: string) => {
    router.push(`/tours/${listingId}`);
  };

  if (loading && wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Wishlist" description="Tours you've saved for later" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Wishlist"
        description={`${total} saved ${total === 1 ? "tour" : "tours"}`}
      />

      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start exploring tours and save your favorites!
            </p>
            <Button onClick={() => router.push("/explore")}>Explore Tours</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.listing?.images?.[0] && (
                  <div className="relative h-48 w-full">
                    <img
                      src={item.listing.images[0].url}
                      alt={item.listing.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedItem(item);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{item.listing?.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {item.listing?.city}, {item.listing?.country}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {item.listing?.avgRating.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <Badge variant="secondary">{item.listing?.category}</Badge>
                  </div>
                  <div className="mt-2 text-lg font-semibold">
                    ${item.listing?.tourFee.toFixed(2)}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleViewListing(item.listingId)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => router.push(`/tours/${item.listingId}`)}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {total > 12 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page * 12 >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this tour from your wishlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={removingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removingId ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

