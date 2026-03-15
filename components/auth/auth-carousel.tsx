"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
}

const slides: CarouselSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    title: "Find Your Dream Home",
    subtitle: "Discover premium properties across South-East Nigeria",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    title: "Invest in Land",
    subtitle: "Secure your future with verified land listings",
  },
  {
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    title: "Trusted Platform",
    subtitle: "Join thousands of satisfied property seekers",
  },
];

export function AuthCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative hidden lg:block lg:w-1/2 h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Text overlay */}
      <div className="absolute bottom-12 left-8 right-8 z-10 text-white">
        <h2 className="text-3xl font-bold mb-2">{slides[current].title}</h2>
        <p className="text-white/80 text-lg">{slides[current].subtitle}</p>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-8 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === current ? "w-8 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
