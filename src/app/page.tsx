import { CTA } from "./(components)/cta";
import { Features } from "./(components)/features";
import { Hero } from "./(components)/hero";
import { Stats } from "./(components)/stats";
import { HowItWorks } from "./(components)/how-it-works";

export default function Home() {
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
