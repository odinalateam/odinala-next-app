import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, Shield, TrendingUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "About Us | Odinala",
  description:
    "Learn about Odinala — the platform digitizing real estate and empowering investors through blockchain technology.",
};

const team = [
  { name: "Golden Ikerionwu", role: "Co-Founder" },
  { name: "Jordan Williams", role: "Technology Director" },
  { name: "Lye Ogunsanya", role: "Policy & Market Development Director" },
  { name: "Engr. Uzo Udemba", role: "CEO / Founder, TUG NIG" },
  { name: "Jude Atebe", role: "CEO, Voucher Net Limited" },
];

const faqs = [
  {
    question: "What is the mission of Odinala?",
    answer:
      "Odinala exists to democratize real estate investment. We believe everyone should have access to property ownership and the wealth-building opportunities that come with it — regardless of income level or geographic location.",
  },
  {
    question: "What is tokenization?",
    answer:
      "Tokenization is the process of converting ownership rights of a real-world asset into digital tokens on a blockchain. Each token represents a fractional share of the underlying property, making it possible to buy, sell, and trade real estate in smaller, more affordable units.",
  },
  {
    question: "What are the benefits of tokenized real estate?",
    answer:
      "Tokenized real estate offers fractional ownership (so you can invest with less capital), greater transparency through blockchain records, the ability to use your tokens as collateral, and a more liquid market where you can trade your shares more easily than traditional property.",
  },
  {
    question: "How is property managed on the platform?",
    answer:
      "Each property listed on the platform is managed by professional property managers. They handle maintenance, tenant relations, and day-to-day operations so that token holders can enjoy passive income without the headaches of direct management.",
  },
  {
    question: "How does the wallet work?",
    answer:
      "Your Odinala wallet is a secure digital wallet that stores your property tokens and manages your transactions. It allows you to view your portfolio, track earnings, and initiate token transfers — all in one place.",
  },
  {
    question: "How is rental income distributed?",
    answer:
      "Rental income is distributed proportionally to token holders after completion of KYC/AML verification. Distributions are made directly to your wallet on a scheduled basis, giving you a steady stream of passive income from your property investments.",
  },
];

const highlights = [
  {
    icon: Building2,
    title: "Fractional Ownership",
    description:
      "Invest in premium properties with as little as you have. Tokenization breaks down barriers to entry.",
  },
  {
    icon: Shield,
    title: "Blockchain Security",
    description:
      "Every transaction is recorded on an immutable ledger, ensuring transparency and trust.",
  },
  {
    icon: TrendingUp,
    title: "Passive Income",
    description:
      "Earn rental yields distributed directly to your wallet — no active management required.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description:
      "Invest in Nigerian real estate from anywhere in the world through our digital platform.",
  },
];

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="relative max-w-6xl mx-auto w-full px-4 py-20 md:py-28">
          <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-3">
            About Odinala
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl text-white">
            What we specialise in
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-xl leading-relaxed">
            Delivering low-maintenance property ownership and access to cash
            flows — powered by blockchain technology and built for everyone.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto w-full px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            The future of real estate investing is Digital
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            We digitize assets and empower small investors through blockchain —
            making property investment accessible, transparent, and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Tokenization & Fractional Ownership
              </CardTitle>
              <CardDescription>
                Breaking down the barriers to property investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Through tokenization, we convert real estate assets into digital
                tokens on the blockchain. This enables fractional ownership —
                meaning you don&apos;t need to buy an entire property to start
                building wealth. Invest in fractions that fit your budget and
                grow your portfolio over time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Technology-Driven Trading
              </CardTitle>
              <CardDescription>
                A modern marketplace for real estate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Our platform leverages smart contracts and decentralized
                technology to facilitate seamless property trading. Buy, sell,
                or transfer property tokens with speed and security —
                transforming how real estate changes hands in Nigeria and
                beyond.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-muted/50 border-y">
        <div className="max-w-6xl mx-auto w-full px-4 py-16 md:py-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item) => (
              <div key={item.title} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto w-full px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Meet the Team
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            A dedicated group of professionals building the future of real
            estate in Africa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {team.map((member) => (
            <Card key={member.name} className="text-center">
              <CardContent className="pt-6 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 border-y">
        <div className="max-w-3xl mx-auto w-full px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about investing with Odinala.
            </p>
          </div>

          <Accordion>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={String(i)}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto w-full px-4 py-16 md:py-24">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Let&apos;s start something new together
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Whether you&apos;re looking to invest, partner, or join our team —
            we&apos;d love to hear from you.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/auth/sign-up">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
