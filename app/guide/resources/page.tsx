import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Video,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Users,
  Camera,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function GuideResourcesPage() {
  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn how to create your first listing and start offering tours",
      icon: BookOpen,
      href: "#getting-started",
    },
    {
      title: "Pricing Strategies",
      description: "Best practices for setting competitive and fair prices",
      icon: DollarSign,
      href: "#pricing",
    },
    {
      title: "Marketing Your Tours",
      description: "Tips for attracting travelers and growing your bookings",
      icon: TrendingUp,
      href: "#marketing",
    },
    {
      title: "Photography Tips",
      description: "How to take great photos that showcase your tours",
      icon: Camera,
      href: "#photography",
    },
    {
      title: "Safety Guidelines",
      description: "Important safety information for you and your guests",
      icon: CheckCircle,
      href: "#safety",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step guides on using the platform",
      icon: Video,
      href: "#tutorials",
    },
  ];

  const bestPractices = [
    {
      title: "Create Compelling Listings",
      tips: [
        "Write clear, engaging descriptions that highlight unique aspects",
        "Use high-quality photos that showcase the experience",
        "Set realistic expectations about what travelers will see and do",
        "Include all relevant details (duration, group size, meeting point)",
      ],
    },
    {
      title: "Set Competitive Prices",
      tips: [
        "Research similar tours in your area",
        "Consider your experience level and unique offerings",
        "Factor in all costs (transportation, equipment, time)",
        "Offer value that justifies your price point",
      ],
    },
    {
      title: "Provide Excellent Service",
      tips: [
        "Be punctual and professional",
        "Communicate clearly before and during the tour",
        "Be flexible and accommodating when possible",
        "Ask for reviews after positive experiences",
      ],
    },
    {
      title: "Build Your Reputation",
      tips: [
        "Respond promptly to booking requests",
        "Maintain a high response rate",
        "Encourage reviews from satisfied travelers",
        "Continuously improve based on feedback",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Guide Resources</h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to succeed as a Voyago guide
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={resource.href}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Best Practices for Guides
                </CardTitle>
                <CardDescription>
                  Follow these guidelines to maximize your success on Voyago
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {bestPractices.map((practice, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="font-semibold text-lg">{practice.title}</h3>
                      <ul className="space-y-2">
                        {practice.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Creating Your First Listing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">Location</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Choose a specific meeting point and provide clear directions
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">Duration & Schedule</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Set realistic durations and availability that you can consistently maintain
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-primary" />
                      <span className="font-medium">Photos</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Use at least 3-5 high-quality photos that represent your tour accurately
                    </p>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link href="/dashboard/listings">Create Your Listing</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growing Your Business
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Build Your Profile</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete your profile with a compelling bio, professional photo, and
                        verification badges
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Collect Reviews</h4>
                      <p className="text-sm text-muted-foreground">
                        Encourage satisfied travelers to leave reviews. Positive reviews build
                        trust and increase bookings
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Offer Variety</h4>
                      <p className="text-sm text-muted-foreground">
                        Create multiple listings for different experiences to attract a wider
                        range of travelers
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Stay Active</h4>
                      <p className="text-sm text-muted-foreground">
                        Respond quickly to messages and booking requests. Active guides get
                        more visibility
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
                <CardDescription>
                  Our support team is here to assist you with any questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/guide/support">Contact Support</Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href="mailto:guides@voyago.com">Email Us</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

