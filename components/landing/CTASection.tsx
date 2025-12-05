import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of travelers discovering authentic experiences with local guides around the world.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/explore">Explore Tours</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
            <Link href="/register">Become a Guide</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

