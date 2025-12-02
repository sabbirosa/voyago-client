"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/api/upload";
import { createProfile, updateProfile, type Profile } from "@/lib/api/user";
import {
  preferenceOptions,
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/lib/validation/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AvatarUploaderWrapper } from "./AvatarUploaderWrapper";

interface ProfileFormProps {
  initialData?: Profile | null;
  userName?: string;
  onSuccess?: () => void;
}

export function ProfileForm({
  initialData,
  userName,
  onSuccess,
}: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  // Filter preferences to only include valid enum values
  const validPreferences = initialData?.preferences?.filter((p) =>
    preferenceOptions.includes(p as (typeof preferenceOptions)[number])
  ) as (typeof preferenceOptions)[number][] | undefined;

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: userName || "",
      bio: initialData?.bio || "",
      avatarUrl: initialData?.avatarUrl || "",
      languages: initialData?.languages || [],
      city: initialData?.city || "",
      country: initialData?.country || "",
      preferences: validPreferences || [],
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);
    try {
      // Upload image first if there's a new blob
      let avatarUrl = data.avatarUrl;
      if (imageBlob) {
        try {
          avatarUrl = await uploadImage(imageBlob, "avatars");
          toast.success("Image uploaded successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to upload image. Please try again.";
          toast.error(errorMessage);
          setIsLoading(false);
          return;
        }
      }

      // Update profile with the new avatar URL
      const profileData = {
        ...data,
        avatarUrl,
      };

      if (initialData) {
        await updateProfile(profileData);
        toast.success("Profile updated successfully");
      } else {
        await createProfile(profileData);
        toast.success("Profile created successfully");
      }
      
      // Clear the blob after successful upload
      setImageBlob(null);
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPreferences = form.watch("preferences") || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-3">
                    <AvatarUploaderWrapper
                      initialUrl={field.value || null}
                      onUrlChange={(url) => {
                        // Only update form field if it's not a blob URL (i.e., it's a permanent URL)
                        if (url && !url.startsWith("blob:")) {
                          field.onChange(url);
                        }
                      }}
                      onBlobChange={(blob) => {
                        setImageBlob(blob);
                      }}
                    />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>
                    <Input
                      type="url"
                      placeholder="Enter image URL"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    className="min-h-24 resize-none"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New York"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="United States"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="English, Spanish, French"
                  {...field}
                  value={field.value?.join(", ") || ""}
                  onChange={(e) => {
                    const languages = e.target.value
                      .split(",")
                      .map((lang) => lang.trim())
                      .filter((lang) => lang.length > 0);
                    field.onChange(languages);
                  }}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferences"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Travel Preferences</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Select all that apply
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {preferenceOptions.map((preference) => (
                  <FormField
                    key={preference}
                    control={form.control}
                    name="preferences"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={preference}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={selectedPreferences.includes(preference)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, preference]);
                                } else {
                                  field.onChange(
                                    current.filter((p) => p !== preference)
                                  );
                                }
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {preference}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
