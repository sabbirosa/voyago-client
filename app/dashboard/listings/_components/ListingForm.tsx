"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createListing, updateListing, type Listing } from "@/lib/api/listing";
import { uploadImage } from "@/lib/api/upload";
import {
  createListingSchema,
  feeTypeOptions,
  listingCategoryOptions,
  listingStatusOptions,
  type CreateListingFormData,
} from "@/lib/validation/listing";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ListingFormProps {
  initialData?: Listing | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const commonLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
];

export function ListingForm({
  initialData,
  onSuccess,
  onCancel,
}: ListingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images?.map((img) => img.url) || []
  );
  const [uploadingImages, setUploadingImages] = useState(false);

  const form = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      itinerary: initialData?.itinerary || "",
      city: initialData?.city || "",
      country: initialData?.country || "",
      category: (initialData?.category ||
        "FOOD") as (typeof listingCategoryOptions)[number],
      languages: initialData?.languages || [],
      tourFee: initialData?.tourFee || 0,
      feeType: (initialData?.feeType || "PER_PERSON") as
        | "PER_PERSON"
        | "PER_GROUP",
      duration: initialData?.duration || 1,
      meetingPoint: initialData?.meetingPoint || "",
      meetingLat: initialData?.meetingLat || undefined,
      meetingLng: initialData?.meetingLng || undefined,
      maxGroupSize: initialData?.maxGroupSize || 10,
      status: (initialData?.status ||
        "DRAFT") as (typeof listingStatusOptions)[number],
      images: imageUrls,
    },
  });

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const blob = new Blob([file], { type: file.type });
        return await uploadImage(blob, "listings");
      });

      const urls = await Promise.all(uploadPromises);
      const newUrls = [...imageUrls, ...urls];
      setImageUrls(newUrls);
      form.setValue("images", newUrls);
      setImageFiles((prev) => [...prev, ...Array.from(files)]);
      toast.success(`${urls.length} image(s) uploaded successfully`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload images. Please try again.";
      toast.error(errorMessage);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    form.setValue("images", newUrls);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateListingFormData) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateListing(initialData.id, data);
        toast.success("Listing updated successfully");
      } else {
        await createListing(data);
        toast.success("Listing created successfully");
      }
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save listing. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Amazing Food Tour in Paris" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listingCategoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your tour in detail..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of your tour experience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="itinerary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Itinerary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Day 1: Visit landmarks...&#10;Day 2: Food tour..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional detailed itinerary for multi-day tours
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input placeholder="Paris" {...field} />
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
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Input placeholder="France" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="languages"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Languages *</FormLabel>
                <FormDescription>
                  Select at least one language for the tour
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {commonLanguages.map((lang) => (
                  <FormField
                    key={lang}
                    control={form.control}
                    name="languages"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={lang}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(lang) ?? false}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                return checked
                                  ? field.onChange([...currentValue, lang])
                                  : field.onChange(
                                      currentValue.filter(
                                        (value) => value !== lang
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{lang}</FormLabel>
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

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="tourFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tour Fee *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="50.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feeTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "PER_PERSON" ? "Per Person" : "Per Group"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="3"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="maxGroupSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Group Size *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listingStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="meetingPoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Point</FormLabel>
              <FormControl>
                <Input placeholder="Eiffel Tower, Paris" {...field} />
              </FormControl>
              <FormDescription>
                Where participants should meet for the tour
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Images</FormLabel>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
                disabled={uploadingImages}
                className="cursor-pointer"
              />
              {uploadingImages && <Spinner className="h-4 w-4" />}
            </div>
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {imageUrls.filter(Boolean).map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Listing image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            {initialData ? "Update Listing" : "Create Listing"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
