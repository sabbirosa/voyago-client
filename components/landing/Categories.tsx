import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { UtensilsCrossed, Palette, Mountain, Camera, Moon, TreePine } from "lucide-react";

const categories = [
  { name: "Food", icon: UtensilsCrossed, href: "/explore?category=FOOD" },
  { name: "Art", icon: Palette, href: "/explore?category=ART" },
  { name: "Adventure", icon: Mountain, href: "/explore?category=ADVENTURE" },
  { name: "Photography", icon: Camera, href: "/explore?category=PHOTOGRAPHY" },
  { name: "Nightlife", icon: Moon, href: "/explore?category=NIGHTLIFE" },
  { name: "Nature", icon: TreePine, href: "/explore?category=NATURE" },
];

export function Categories() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find tours that match your interests
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={category.href}>
                <Card className="group cursor-pointer transition-shadow hover:shadow-lg">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

