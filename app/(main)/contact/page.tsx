import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendlyEmbed } from "@/components/about/calendly-embed";
import { ContactForm } from "@/components/about/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Odinala",
  description:
    "Get in touch with the Odinala team. Book a consultation or send us a message.",
};

export default function Contact() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <Image
          src="/images/hero-bg2.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="relative max-w-6xl mx-auto w-full px-4 py-20 md:py-28">
          <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-3">
            Contact Us
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl text-white">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-xl leading-relaxed">
            Whether you&apos;re looking to invest, partner, or have questions —
            reach out and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="max-w-6xl mx-auto w-full px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <Mail className="w-10 h-10 text-muted-foreground mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Send us a message
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Fill out the form and our team will get back to you as soon as
              possible. We typically respond within 24 hours.
            </p>
            <div className="mt-6">
              <Link href="/auth/sign-up">
                <Button size="lg">Get Started Instead</Button>
              </Link>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Book a Consultation */}
      <section className="bg-muted/50 border-t">
        <div className="max-w-6xl mx-auto w-full px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <Calendar className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Book a Consultation
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Prefer a conversation? Schedule a call with our team to discuss
              investment opportunities, partnerships, or any questions.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <CalendlyEmbed />
          </div>
        </div>
      </section>
    </main>
  );
}
