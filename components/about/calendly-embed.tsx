"use client";

const CALENDLY_URL = "https://calendly.com/PLACEHOLDER";

export function CalendlyEmbed() {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      <iframe
        src={CALENDLY_URL}
        className="w-full border-0"
        style={{ minHeight: 700 }}
        title="Book a consultation"
      />
    </div>
  );
}
