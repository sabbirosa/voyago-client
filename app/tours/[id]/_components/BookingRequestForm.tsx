"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Listing } from "@/lib/api/listing";
import { bookingApi } from "@/lib/api/booking";
import { createBookingSchema, CreateBookingFormData } from "@/lib/validation/booking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";
import { DollarSign } from "lucide-react";

interface BookingRequestFormProps {
  listing: Listing;
}

export function BookingRequestForm({ listing }: BookingRequestFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateBookingFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      listingId: listing.id,
      date: "",
      groupSize: 1,
      note: "",
    },
  });

  const groupSize = form.watch("groupSize");
  const basePrice =
    listing.feeType === "PER_PERSON"
      ? listing.tourFee * (groupSize || 1)
      : listing.tourFee;
  const platformFee = basePrice * 0.1; // 10% platform fee
  const totalPrice = basePrice + platformFee;

  const onSubmit = async (data: CreateBookingFormData) => {
    if (!user) {
      toast.error("Please login to book a tour");
      router.push("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      await bookingApi.createBooking({
        ...data,
        date: new Date(data.date).toISOString(),
      });
      toast.success("Booking request sent! The guide will review it shortly.");
      router.push("/dashboard/tourist/bookings");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create booking"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Book This Tour</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Please login to book this tour
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Login to Book
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Tour</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Price Display */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {listing.feeType === "PER_PERSON"
                    ? `$${listing.tourFee} per person`
                    : `$${listing.tourFee} per group`}
                </span>
                <span className="font-semibold">${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Platform fee (10%)</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-semibold flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Total
                </span>
                <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      min={new Date().toISOString().slice(0, 16)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group Size */}
            <FormField
              control={form.control}
              name="groupSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Size</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newValue = Math.max(1, (field.value || 1) - 1);
                          field.onChange(newValue);
                        }}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={listing.maxGroupSize}
                        className="text-center"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          field.onChange(Math.min(listing.maxGroupSize, Math.max(1, value)));
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newValue = Math.min(
                            listing.maxGroupSize,
                            (field.value || 1) + 1
                          );
                          field.onChange(newValue);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Max {listing.maxGroupSize} people
                  </p>
                </FormItem>
              )}
            />

            {/* Note */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or questions..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request Booking"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

