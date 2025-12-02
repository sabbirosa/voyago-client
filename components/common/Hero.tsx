"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" style={{ marginTop: '-1rem', paddingTop: 0 }}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-background.png"
          alt="Beautiful travel destination"
          fill
          className="object-cover w-full h-full"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white w-full">
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Explore like a local,
          <br />
          <span className="text-primary">anywhere.</span>
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-gray-200 md:text-xl lg:text-2xl">
          Connect with verified local guides who offer authentic experiences
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          and discover hidden gems in your next destination.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/explore">Start Exploring</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Link href="/register">Become a Guide</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

