import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 dark:bg-green-300"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-green-400"></span>
            </span>
            With real-time collaboration
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance animate-fade-in-up">
            Agile estimation made{" "}
            <span className="text-secondary">effortless</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Transform your sprint planning with collaborative planning poker.
            Estimate story points with your team in real-time, reach consensus
            faster, and ship with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
            <Link to="/room" search={{ tab: "create" }}>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 h-12"
              >
                Create or join a room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 bg-transparent"
              >
                <Play className="mr-2 h-4 w-4" />
                Sign up for free
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6 animate-fade-in-up animation-delay-600">
            No account required • Free forever for small teams
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}
