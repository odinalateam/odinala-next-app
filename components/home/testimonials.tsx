"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "David Ifeanyi",
    role: "Investor",
    quote:
      "I couldn't be happier with the service I received from Odinala Network. They helped me find my dream home with a smooth and seamless process.",
  },
  {
    name: "Mike Chibueze",
    role: "Buyer",
    quote:
      "Odinala made finding my dream home a breeze. The process was seamless from start to finish and the team was incredibly supportive throughout.",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  const testimonial = testimonials[current];

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-primary/80 uppercase tracking-wider mb-2">
            1% of the industry
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Our Clients Speak
          </h2>
        </div>
        <div className="max-w-2xl mx-auto text-center">
          <Quote className="h-8 w-8 text-primary/20 mx-auto mb-4" />
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground italic mb-8">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">
                {testimonial.role}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={prev}
              className="flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
