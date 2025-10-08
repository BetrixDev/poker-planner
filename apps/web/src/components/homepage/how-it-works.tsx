import { Card } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create a Room",
      description:
        "Start a new planning session in seconds. No account required to get started.",
    },
    {
      number: "02",
      title: "Invite Your Team",
      description:
        "Share the unique room link with your team members via Slack, email, or any channel.",
    },
    {
      number: "03",
      title: "Estimate Together",
      description:
        "Everyone selects their estimate simultaneously. Reveal cards together and discuss.",
    },
    {
      number: "04",
      title: "Reach Consensus",
      description:
        "Discuss differences, re-estimate if needed, and finalize your story points with confidence.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Simple process, powerful results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get your team estimating in four easy steps. No training required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="p-6 md:p-8 relative animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-6xl font-bold text-accent mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
