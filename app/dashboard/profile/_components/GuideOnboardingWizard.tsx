"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
  createGuideProfileSchema,
  expertiseOptions,
  type CreateGuideProfileFormData,
} from "@/lib/validation/profile";
import { createGuideProfile } from "@/lib/api/user";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GuideOnboardingWizardProps {
  onComplete?: () => void;
}

export function GuideOnboardingWizard({
  onComplete,
}: GuideOnboardingWizardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<CreateGuideProfileFormData>({
    resolver: zodResolver(createGuideProfileSchema),
    defaultValues: {
      expertise: [],
      dailyRate: undefined,
      experienceYears: undefined,
    },
  });

  const selectedExpertise = form.watch("expertise") || [];
  const dailyRate = form.watch("dailyRate");
  const experienceYears = form.watch("experienceYears");

  const canProceedToStep2 = selectedExpertise.length > 0;
  const canProceedToStep3 = dailyRate && dailyRate > 0;

  const onSubmit = async (data: CreateGuideProfileFormData) => {
    setIsLoading(true);
    try {
      await createGuideProfile(data);
      toast.success("Guide profile created successfully!");
      onComplete?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create guide profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Become a Guide</CardTitle>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Expertise */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Select Your Expertise
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose the areas where you can guide tourists. Select at
                    least one.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
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
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2 || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Daily Rate */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Set Your Daily Rate
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    How much do you charge per day for your guiding services?
                  </p>
                </div>
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
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!canProceedToStep3 || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Experience */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Years of Experience
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    How many years of experience do you have as a guide? (Optional)
                  </p>
                </div>
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
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2" />
                        Creating Profile...
                      </>
                    ) : (
                      "Complete Setup"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

