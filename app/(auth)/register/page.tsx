"use client";

import Link from "next/link";
import { AuthLayout } from "../login/_components/AuthLayout";
import { RegisterForm } from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      imageSrc="/images/register-background.png"
      imageAlt="Travel exploration"
      title="Create your account"
      subtitle="Join thousands of travelers and local guides exploring the world together."
      imageTitle="Explore like a local, anywhere."
      imageDescription="Connect with verified local guides who offer authentic experiences and discover hidden gems in your next destination."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
