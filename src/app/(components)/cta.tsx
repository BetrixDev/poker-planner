import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-12 md:p-20">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
              Ready to transform your sprint planning?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
              Join thousands of agile teams who estimate faster and ship with
              more confidence using Poker Planner.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-8 h-12"
              >
                Start Planning Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              No credit card required • Free forever for teams up to 14 members
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
