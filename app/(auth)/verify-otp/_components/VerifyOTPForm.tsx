"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth/useAuth";
import { verifyOTPSchema, type VerifyOTPFormData } from "@/lib/validation/auth";
import { toast } from "sonner";

interface VerifyOTPFormProps {
  email: string;
}

export function VerifyOTPForm({ email }: VerifyOTPFormProps) {
  const router = useRouter();
  const { verifyOTP, resendOTP, isLoading } = useAuth();
  const [isResending, setIsResending] = useState(false);

  const form = useForm<VerifyOTPFormData>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  });

  // Update form when email changes
  useEffect(() => {
    if (email) {
      form.setValue("email", email);
    }
  }, [email, form]);

  const onSubmit = async (data: VerifyOTPFormData) => {
    try {
      await verifyOTP(data);
      toast.success("Email verified successfully! Redirecting...");
      // Redirect to login or dashboard
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.";
      toast.error(errorMessage);
      // Clear OTP on error
      form.setValue("otp", "");
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsResending(true);
    try {
      await resendOTP(email);
      toast.success("OTP resent successfully! Please check your email.");
      form.setValue("otp", "");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    disabled={isLoading}
                    onComplete={(value) => {
                      field.onChange(value);
                      // Auto-submit when OTP is complete
                      form.handleSubmit(onSubmit)();
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <input type="hidden" {...form.register("email")} />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || form.watch("otp").length !== 6}
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Verifying
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>
      </Form>

      {/* Resend OTP */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isResending || !email}
            className="font-medium text-primary hover:text-primary/90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
          >
            {isResending && <Spinner className="size-3" />}
            {isResending ? "Resending" : "Resend OTP"}
          </button>
        </p>
      </div>
    </>
  );
}

