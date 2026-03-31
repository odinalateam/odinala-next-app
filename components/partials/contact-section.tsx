import { Mail } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/about/contact-form";

export function ContactSection() {
  return (
    <section className="border-t bg-muted/20">
      <div className="max-w-6xl mx-auto w-full px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <Mail className="h-10 w-10 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Send us a message
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Fill out the form and our team will get back to you as soon as
              possible. We typically respond within 24 hours.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center mt-6 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
            >
              Get Started Instead
            </Link>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
