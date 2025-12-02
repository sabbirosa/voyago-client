"use client";

import { Logo } from "@/components/common/Logo";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: React.ReactNode;
  imageTitle: string;
  imageDescription: string;
  footer?: React.ReactNode;
}

export function AuthLayout({
  children,
  imageSrc,
  imageAlt,
  title,
  subtitle,
  imageTitle,
  imageDescription,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left/Right Side - Image (varies by page) */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          {/* Content overlay */}
          <div className="absolute inset-0 flex items-end p-12 text-white">
            <div className="max-w-md">
              <h3 className="text-3xl font-bold mb-4">{imageTitle}</h3>
              <p className="text-lg opacity-90">{imageDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header */}
          <div className="mb-8">
            <Logo showText size="lg" />
            <h2 className="mt-6 text-3xl font-semibold text-foreground">
              {title}
            </h2>
            <div className="mt-2 text-sm text-muted-foreground">{subtitle}</div>
          </div>

          {/* Form Content */}
          {children}

          {/* Footer */}
          {footer && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
