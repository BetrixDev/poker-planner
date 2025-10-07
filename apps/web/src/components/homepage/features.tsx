import { Card } from "@/components/ui/card";
import { Users, Zap, BarChart3, Lock, Globe, Sparkles } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Users,
      title: "Real-time Collaboration",
      description:
        "Invite your entire team to estimate together. See votes in real-time and reach consensus faster than ever.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "No setup required. Create a room, share the link, and start estimating in seconds. Built for speed.",
    },
    {
      icon: BarChart3,
      title: "Insightful Analytics",
      description:
        "Track estimation patterns, velocity trends, and team alignment over time with powerful analytics.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Enterprise-grade security with end-to-end encryption. Your planning sessions stay private.",
    },
    {
      icon: Globe,
      title: "Works Everywhere",
      description:
        "Fully responsive design works seamlessly on desktop, tablet, and mobile. Plan from anywhere.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description:
        "Get smart suggestions based on historical data and similar stories to improve estimation accuracy.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Everything you need to estimate better
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to make your sprint planning sessions
            more productive and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
