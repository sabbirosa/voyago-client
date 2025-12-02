"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: 20, text: "text-base" },
  md: { icon: 24, text: "text-xl" },
  lg: { icon: 32, text: "text-2xl" },
};

export function Logo({ className, showText = false, size = "md" }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity",
        className
      )}
    >
      <Image
        src="/voyago-icon.png"
        alt="Voyago"
        width={iconSize}
        height={iconSize}
        className="object-contain"
        priority
      />
      {showText && <span className={`${textSize} mt-1 ml-2`}>Voyago</span>}
    </Link>
  );
}
