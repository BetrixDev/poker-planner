import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/homepage/hero";
import { Stats } from "@/components/homepage/stats";
import { Features } from "@/components/homepage/features";
import { HowItWorks } from "@/components/homepage/how-it-works";
import { CTA } from "@/components/homepage/cta";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <main>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  );
}
