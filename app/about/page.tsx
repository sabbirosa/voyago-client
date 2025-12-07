import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Heart, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Voyago</h1>
            <p className="text-xl text-muted-foreground">
              Connecting travelers with local guides for authentic experiences
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-lg leading-relaxed mb-6">
              Voyago is a platform that brings together travelers and local guides to create
              unforgettable experiences. We believe that the best way to explore a destination
              is through the eyes of someone who calls it home.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our mission is to make travel more meaningful by connecting people with authentic
              local experiences. Whether you're looking for a food tour, an art walk, or an
              adventure in nature, our verified guides are here to help you discover the
              hidden gems of every destination.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-primary" />
                  <CardTitle>Our Community</CardTitle>
                </div>
                <CardDescription>
                  We're building a global community of travelers and guides who share a passion
                  for authentic experiences and cultural exchange.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-6 w-6 text-primary" />
                  <CardTitle>Global Reach</CardTitle>
                </div>
                <CardDescription>
                  From bustling cities to remote destinations, our guides are ready to show you
                  the world from a local perspective.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-6 w-6 text-primary" />
                  <CardTitle>Authentic Experiences</CardTitle>
                </div>
                <CardDescription>
                  Every tour is carefully curated by local guides who know their destination
                  inside and out, ensuring you get a truly authentic experience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle>Verified Guides</CardTitle>
                </div>
                <CardDescription>
                  All our guides go through a verification process to ensure quality and
                  safety for our travelers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Join Us</CardTitle>
              <CardDescription>
                Whether you're a traveler looking for unique experiences or a local guide
                ready to share your knowledge, Voyago is the platform for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>For Travelers:</strong> Browse our curated tours, read reviews from
                  other travelers, and book experiences that match your interests.
                </p>
                <p>
                  <strong>For Guides:</strong> Create your profile, list your tours, and start
                  sharing your local knowledge with travelers from around the world.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

