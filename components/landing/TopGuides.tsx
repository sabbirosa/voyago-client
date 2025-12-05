"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const guides = [
  {
    name: "Maria Garcia",
    location: "Barcelona, Spain",
    rating: 4.9,
    reviews: 127,
    expertise: ["Food", "Culture"],
  },
  {
    name: "Kenji Tanaka",
    location: "Tokyo, Japan",
    rating: 4.8,
    reviews: 89,
    expertise: ["History", "Photography"],
  },
  {
    name: "Sophie Martin",
    location: "Paris, France",
    rating: 5.0,
    reviews: 156,
    expertise: ["Art", "Architecture"],
  },
];

export function TopGuides() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Top Guides</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our verified local guides who bring destinations to life
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {guides.map((guide) => (
            <Card key={guide.name}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>{guide.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{guide.name}</h3>
                    <p className="text-sm text-muted-foreground">{guide.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{guide.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({guide.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {guide.expertise.map((exp) => (
                    <Badge key={exp} variant="secondary">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

