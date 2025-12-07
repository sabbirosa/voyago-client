"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { availabilityApi, AvailabilitySlot } from "@/lib/api/availability";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const availabilitySlotSchema = z
  .object({
    date: z.string().optional(),
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    startTime: z
      .string()
      .regex(
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in HH:mm format"
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in HH:mm format"
      ),
    isRecurring: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isRecurring && data.dayOfWeek === undefined) {
        return false;
      }
      if (!data.isRecurring && !data.date) {
        return false;
      }
      return true;
    },
    {
      message:
        "Recurring slots require day of week, one-time slots require date",
    }
  );

type AvailabilitySlotFormData = z.infer<typeof availabilitySlotSchema>;

interface AvailabilitySlotFormProps {
  slot: AvailabilitySlot | null;
  onSuccess: () => void;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function AvailabilitySlotForm({
  slot,
  onSuccess,
}: AvailabilitySlotFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AvailabilitySlotFormData>({
    resolver: zodResolver(availabilitySlotSchema),
    defaultValues: {
      date: slot?.date ? new Date(slot.date).toISOString().slice(0, 16) : "",
      dayOfWeek: slot?.dayOfWeek ?? undefined,
      startTime: slot?.startTime || "09:00",
      endTime: slot?.endTime || "17:00",
      isRecurring: slot?.isRecurring || false,
    },
  });

  const isRecurring = form.watch("isRecurring");

  const onSubmit = async (data: AvailabilitySlotFormData) => {
    try {
      setIsSubmitting(true);
      const payload: any = {
        startTime: data.startTime,
        endTime: data.endTime,
        isRecurring: data.isRecurring,
      };

      if (data.isRecurring) {
        payload.dayOfWeek = data.dayOfWeek;
      } else {
        payload.date = new Date(data.date!).toISOString();
      }

      if (slot) {
        await availabilityApi.updateSlot(slot.id, payload);
        toast.success("Availability slot updated");
      } else {
        await availabilityApi.createSlot(payload);
        toast.success("Availability slot created");
      }
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save availability slot"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Recurring Slot</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isRecurring ? (
          <FormField
            control={form.control}
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day of Week</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dayNames.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
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
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : slot ? "Update Slot" : "Create Slot"}
        </Button>
      </form>
    </Form>
  );
}
