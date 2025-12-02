"use client";

import Link from "next/link";
import { AuthLayout } from "./_components/AuthLayout";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      imageSrc="/images/login-background.png"
      imageAlt="Beautiful destination"
      title="Welcome back"
      subtitle="Sign in to your account to continue exploring amazing destinations."
      imageTitle="Welcome back to Voyago"
      imageDescription="Continue your journey of discovery with authentic local experiences and unforgettable adventures around the world."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/90"
          >
            Create account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
