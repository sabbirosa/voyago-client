import { Hero } from "@/components/common/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PopularDestinations } from "@/components/landing/PopularDestinations";
import { TopGuides } from "@/components/landing/TopGuides";
import { Categories } from "@/components/landing/Categories";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PopularDestinations />
      <TopGuides />
      <Categories />
      <Testimonials />
      <CTASection />
    </>
  );
}
