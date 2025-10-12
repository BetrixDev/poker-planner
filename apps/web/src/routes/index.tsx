import { createFileRoute } from "@tanstack/react-router";
import { CTA } from "~/components/homepage/cta";
import { Features } from "~/components/homepage/features";
import { Hero } from "~/components/homepage/hero";
import { HowItWorks } from "~/components/homepage/how-it-works";
import { Stats } from "~/components/homepage/stats";

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
