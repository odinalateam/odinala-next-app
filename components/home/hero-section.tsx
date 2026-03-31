import { HouseHeart } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1647579350413-a6ada4e480ed?q=80&w=3125&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 py-20">
        <p className="text-xs tracking-wider text-white/70 uppercase mb-2">
          YOUR TRUSTED REAL ESTATE PARTNER
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white capitalize max-w-2xl">
          Your partner in building <br />
          <span className="text-amber-500 italic">generational wealth</span> via
          real estate
        </h1>
        <div className="my-6 h-1 w-20 bg-white/70" />
        <p className="mb-8 max-w-md text-base text-white">
          We guide you through the entire journey, from search to inspection, to
          secure a purchase. We are not just a property platform; we are your
          trusted real estate advisor and partner.
        </p>
        <Link
          href="/properties"
          className="flex w-1/5 gap-2 rounded-md bg-white  py-3 text-sm font-semibold tracking-wide text-primary ease-in transition-colors hover:bg-primary/90 hover:text-white  justify-center items-center"
        >
          <HouseHeart className="h-5 w-5" />
          BROWSE PROPERTIES
        </Link>
      </div>
    </section>
  );
}
