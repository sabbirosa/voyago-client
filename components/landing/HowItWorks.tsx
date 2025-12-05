import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, MapPin, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover Tours",
    description: "Browse authentic experiences curated by local guides in your destination.",
  },
  {
    icon: Calendar,
    title: "Book Your Tour",
    description: "Choose your preferred date and group size, then request a booking.",
  },
  {
    icon: MapPin,
    title: "Meet Your Guide",
    description: "Connect with your guide and explore hidden gems like a local.",
  },
  {
    icon: Star,
    title: "Share Your Experience",
    description: "Leave a review and help others discover amazing experiences.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting started with Voyago is simple. Follow these easy steps to begin your adventure.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm font-semibold text-primary mb-2">Step {index + 1}</div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

