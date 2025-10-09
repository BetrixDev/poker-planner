export function Stats() {
  const stats: any[] = [];

  return (
    <section className="py-16 md:py-24 border-y border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-muted-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                {stat.description}
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase text-foreground/60">
                {stat.company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
