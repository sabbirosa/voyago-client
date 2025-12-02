"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthLayout } from "../login/_components/AuthLayout";
import { VerifyOTPForm } from "./_components/VerifyOTPForm";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("Email is required for verification");
      router.push("/register");
    }
  }, [email, router]);

  return (
    <AuthLayout
      imageSrc="/images/register-background.png"
      imageAlt="Email verification"
      title="Verify your email"
      subtitle={
        <>
          We've sent a 6-digit verification code to
          {email && (
            <span className="mt-1 block text-sm font-medium text-foreground">
              {email}
            </span>
          )}
          <span className="mt-2 block">
            Please enter the code below to verify your email address.
          </span>
        </>
      }
      imageTitle="Secure your account"
      imageDescription="Email verification helps us ensure your account security and keep your information safe."
      footer={
        <>
          Wrong email?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/90"
          >
            Register again
          </Link>
        </>
      }
    >
      {email && <VerifyOTPForm email={email} />}
    </AuthLayout>
  );
}
