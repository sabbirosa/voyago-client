"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  updateGuideProfileSchema,
  expertiseOptions,
  type UpdateGuideProfileFormData,
} from "@/lib/validation/profile";
import { updateGuideProfile, type GuideProfile } from "@/lib/api/user";
import { toast } from "sonner";
import { useState } from "react";

interface GuideProfileFormProps {
  initialData?: GuideProfile | null;
  onSuccess?: () => void;
}

export function GuideProfileForm({
  initialData,
  onSuccess,
}: GuideProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateGuideProfileFormData>({
    resolver: zodResolver(updateGuideProfileSchema),
    defaultValues: {
      expertise: initialData?.expertise || [],
      dailyRate: initialData?.dailyRate || undefined,
      experienceYears: initialData?.experienceYears || undefined,
    },
  });

  const onSubmit = async (data: UpdateGuideProfileFormData) => {
    setIsLoading(true);
    try {
      await updateGuideProfile(data);
      toast.success("Guide profile updated successfully");
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update guide profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedExpertise = form.watch("expertise") || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="expertise"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Expertise Areas</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Select all areas where you can guide tourists
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {expertiseOptions.map((expertise) => (
                  <FormItem
                    key={expertise}
                    className="flex flex-row items-start space-x-3 space-y-0 border rounded-md p-3 hover:bg-accent transition-colors"
                  >
                    <FormControl>
                      <Checkbox
                        checked={selectedExpertise.includes(expertise)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, expertise]);
                          } else {
                            field.onChange(
                              current.filter((e) => e !== expertise)
                            );
                          }
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer flex-1">
                      {expertise}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dailyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Rate (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    min="1"
                    step="0.01"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? parseFloat(e.target.value)
                          : undefined
                      )
                    }
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5"
                    min="0"
                    max="50"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined
                      )
                    }
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Saving...
              </>
            ) : (
              "Save Guide Profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

