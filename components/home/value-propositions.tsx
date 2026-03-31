import {
  ShieldCheck,
  CreditCard,
  Users,
  BookOpen,
  Headphones,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description:
      "Carefully sourced and vetted through developer documentation and on-site inspections, giving you complete confidence in every property we present.",
  },
  {
    icon: CreditCard,
    title: "Clear Payment Plans",
    description:
      "Flexible installment options and diaspora-friendly mortgage plans designed around your needs.",
  },
  {
    icon: Users,
    title: "Professional Expert Guidance",
    description:
      "Detailed consultations with experienced realtors, from title verification to negotiation, ensuring your decisions are informed, secure, and in your best interest.",
  },
  {
    icon: BookOpen,
    title: "Buyer Toolkits and Resources",
    description:
      "Webinars, checklists, and guides, combined with personalized support, to make your buying process simple, transparent, and stress-free.",
  },
  {
    icon: Headphones,
    title: "24/7 Human Support",
    description:
      "Our team is available to call, email, or WhatsApp, anytime, anywhere, to assist you from start to finish.",
  },
  {
    icon: FileText,
    title: "Legal & Documentation Assistance",
    description:
      "We guide you through every layer of property documentation, from compliance to due diligence, ensuring your transaction is secure, lawful, and worry-free.",
  },
];

export function ValuePropositions() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why Choose Odinala
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
            We provide everything you need for a smooth, secure property buying
            experience
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary/20 hover:bg-primary/[0.02]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <feature.icon className="h-5 w-5" />
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
