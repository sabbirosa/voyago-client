"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Logo } from "@/components/common/Logo";
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
import { useAuth } from "@/lib/auth/useAuth";
import {
  verifyOTPSchema,
  type VerifyOTPFormData,
} from "@/lib/validation/auth";
import { toast } from "sonner";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOTP, resendOTP, isLoading } = useAuth();
  const [isResending, setIsResending] = useState(false);

  const email = searchParams.get("email") || "";

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

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("Email is required for verification");
      router.push("/register");
    }
  }, [email, router]);

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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="mb-8">
            <Logo showText size="lg" />
            <h2 className="mt-6 text-3xl font-semibold text-foreground">
              Verify your email
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We've sent a 6-digit verification code to
            </p>
            {email && (
              <p className="mt-1 text-sm font-medium text-foreground">
                {email}
              </p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Please enter the code below to verify your email address.
            </p>
          </div>

          {/* Form */}
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
                {isLoading ? "Verifying..." : "Verify Email"}
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
                className="font-medium text-primary hover:text-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Wrong email?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              Register again
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0">
          <Image
            src="/images/register-background.png"
            alt="Email verification"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          {/* Content overlay */}
          <div className="absolute inset-0 flex items-end p-12 text-white">
            <div className="max-w-md">
              <h3 className="text-3xl font-bold mb-4">
                Secure your account
              </h3>
              <p className="text-lg opacity-90">
                Email verification helps us ensure your account security and
                keep your information safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

