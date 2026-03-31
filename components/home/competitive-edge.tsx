import { Wallet, Building2, Shield, Receipt } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Earn Passively",
    description:
      "Purchase properties globally and earn through monthly rental payments managed by our team.",
  },
  {
    icon: Building2,
    title: "Property Managed",
    description:
      "Expert property management for all platform properties, so you can invest without the hassle.",
  },
  {
    icon: Shield,
    title: "Blockchain Secured",
    description:
      "Enhanced security with immutable transaction records ensuring transparency and trust.",
  },
  {
    icon: Receipt,
    title: "Monthly Rent Payment",
    description:
      "Track and manage rental payments at competitive rates, all from your dashboard.",
  },
];

export function CompetitiveEdge() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary/80 uppercase tracking-wider mb-2">
            Our Competitive Edge
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Invest Smarter, Earn More
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
            Beyond buying property, we help you grow your wealth with
            hassle-free investment features
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-6 text-center transition-colors hover:border-primary/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
