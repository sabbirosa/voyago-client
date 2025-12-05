"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Link from "next/link";

const destinations = [
  { city: "Paris", country: "France", image: "/images/hero-background.png" },
  { city: "Tokyo", country: "Japan", image: "/images/hero-background.png" },
  { city: "New York", country: "USA", image: "/images/hero-background.png" },
  { city: "Barcelona", country: "Spain", image: "/images/hero-background.png" },
  { city: "Bali", country: "Indonesia", image: "/images/hero-background.png" },
  { city: "Rome", country: "Italy", image: "/images/hero-background.png" },
];

export function PopularDestinations() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover tours in the world's most exciting cities
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <Link key={`${dest.city}-${dest.country}`} href={`/explore?city=${dest.city}`}>
              <Card className="group overflow-hidden cursor-pointer transition-shadow hover:shadow-lg">
                <div className="relative h-48 w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-semibold">{dest.city}</span>
                    </div>
                    <p className="text-sm text-gray-200">{dest.country}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

