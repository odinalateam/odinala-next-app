const steps = [
  {
    number: "01",
    title: "Tell Us What You Need",
    description:
      "Share your budget, ideal location, and buying goals. We listen and understand your vision.",
  },
  {
    number: "02",
    title: "Get Curated Options",
    description:
      "We match you with properties that suit you, nothing random. Every option is vetted and tailored.",
  },
  {
    number: "03",
    title: "Inspect & Verify",
    description:
      "Walk through it in-person or virtually. We also do due diligence on your behalf for peace of mind.",
  },
  {
    number: "04",
    title: "Make an Offer & Secure It",
    description:
      "We guide you through offers, paperwork, and trusted payments to make it officially yours.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            We keep things simple, transparent, and human.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-5 left-full w-full h-px border-t-2 border-dashed border-primary/20" />
              )}
              <span className="text-2xl font-bold text-primary/70">
                {step.number}
              </span>
              <h3 className="font-semibold mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
