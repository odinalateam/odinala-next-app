"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import ParticlesComponent from "@/components/ui/particles-bg";
import { PropertyCard } from "@/components/property-card";
import type { ListingWithCategory } from "@/lib/types";
import { ngnToUsd, formatUsd } from "@/lib/rates";
import {
  ShieldCheck,
  PieChart,
  Eye,
  Lock,
  Globe,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Building2,
  Coins,
  Leaf,
} from "lucide-react";

const TOC = [
  {
    id: "what-is-tokenization",
    label: "Unlocking Ownership Through Tokenization",
  },
  { id: "why-it-matters", label: "Why It Matters" },
  { id: "flagship", label: "Flagship Opportunity" },
  { id: "why-odinala", label: "Why Odinala" },
  { id: "how-it-works", label: "How It Works" },
  { id: "benefits", label: "Key Benefits" },
  { id: "who-its-for", label: "Who It's For" },
  { id: "featured-listings", label: "Browse Properties" },
  { id: "get-access", label: "Get Early Access" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className={`scroll-mt-24 ${className}`}
    >
      {children}
    </motion.section>
  );
}

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Register Your Interest",
    desc: "Sign up in minutes. Get early access to upcoming properties before they open to the public — no commitment required at this stage.",
    label: "Start",
  },
  {
    step: "02",
    title: "Verify Your Identity",
    desc: "A quick, secure ID check to protect your investment and meet compliance requirements. Takes less than 5 minutes.",
    label: "Verify",
  },
  {
    step: "03",
    title: "Pay in Your Currency",
    desc: "Choose how much you want to invest and pay in USD, GBP, or EUR. We convert to Naira, handle the transaction, and issue your ownership tokens.",
    label: "Invest",
  },
  {
    step: "04",
    title: "Track & Grow",
    desc: "Watch your investment from your personal dashboard — see your ownership stake, asset performance, and updates in real time.",
    label: "Grow",
  },
];

function HowItWorksCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const numberX = useTransform(x, [-200, 200], [-20, 20]);
  const numberY = useTransform(y, [-200, 200], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - (rect.left + rect.width / 2));
      mouseY.set(e.clientY - (rect.top + rect.height / 2));
    }
  };

  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % HOW_IT_WORKS.length);
  const goPrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + HOW_IT_WORKS.length) % HOW_IT_WORKS.length
    );

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = HOW_IT_WORKS[activeIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Oversized step number background */}
      <motion.div
        className="absolute -left-4 top-1/2 -translate-y-1/2 text-[16rem] sm:text-[22rem] font-bold text-foreground/[0.03] select-none pointer-events-none leading-none tracking-tighter"
        style={{ x: numberX, y: numberY }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {current.step}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      <div className="relative flex">
        {/* Left column — vertical label + progress */}
        <div className="flex flex-col items-center justify-center pr-10 sm:pr-16 border-r border-border">
          <motion.span
            className="text-xs font-mono text-muted-foreground tracking-widest uppercase"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            How It Works
          </motion.span>
          <div className="relative h-28 w-px bg-border mt-8">
            <motion.div
              className="absolute top-0 left-0 w-full bg-foreground origin-top"
              animate={{
                height: `${((activeIndex + 1) / HOW_IT_WORKS.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 pl-10 sm:pl-16 py-10">
          {/* Step badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
                Step {current.step} — {current.label}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Title + desc with word reveal */}
          <div className="relative mb-10 min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.h2
                  className="text-3xl sm:text-4xl font-light text-foreground leading-tight tracking-tight mb-4"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06 } },
                    exit: {},
                  }}
                >
                  {current.title.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-[0.25em]"
                      variants={{
                        hidden: { opacity: 0, y: 20, rotateX: 90 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          transition: {
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                        exit: {
                          opacity: 0,
                          y: -10,
                          transition: { duration: 0.2 },
                        },
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h2>
                <motion.p
                  className="text-sm text-muted-foreground leading-relaxed max-w-md"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, delay: 0.2 },
                    },
                    exit: { opacity: 0 },
                  }}
                >
                  {current.desc}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Author row pattern — step dots + nav */}
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  className="w-8 h-px bg-foreground"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ originX: 0 }}
                />
                <div className="flex gap-2">
                  {HOW_IT_WORKS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        i === activeIndex
                          ? "bg-foreground w-4"
                          : "bg-foreground/20 hover:bg-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={goPrev}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
              <motion.button
                onClick={goNext}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom ticker */}
      <div className="mt-8 overflow-hidden opacity-[0.06] pointer-events-none">
        <motion.div
          className="flex whitespace-nowrap text-4xl font-bold tracking-tight"
          animate={{ x: [0, -800] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-6">
              {HOW_IT_WORKS.map((s) => s.label).join(" • ")} •
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function TokenizationClient({
  listings,
}: {
  listings: ListingWithCategory[];
}) {
  const [activeSection, setActiveSection] = useState("what-is-tokenization");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ids = TOC.map((t) => t.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <main>
      {/* Hero */}
      <div className="border-b border-border bg-[url(https://images.unsplash.com/photo-1700157710823-2e9e58414802?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-no-repeat bg-cover text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-black/70 text-white/80 px-3 py-1 rounded-full mb-6">
              Early Access Open
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 ">
              <span className="text-white/60">Own Property Back Home.</span>
              <br />
              Pay in Your Currency.
            </h1>
            <p className="text-lg text-white leading-relaxed max-w-xl">
              You pay in USD, GBP, or EUR. We handle the Naira, the paperwork,
              and the verification — so you can invest from anywhere in the
              world, no finance degree required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href="#get-access"
                className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
              >
                Register Early Access
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#what-is-tokenization"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-sm font-medium px-6 py-3 rounded-lg hover:border-white/40 transition-colors"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body — sidebar + content */}
      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex gap-12 lg:gap-16">
          {/* Sticky TOC sidebar — desktop only */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                On this page
              </p>
              <ul className="space-y-1">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block text-sm py-1 pl-3 border-l-2 transition-colors ${
                        activeSection === item.id
                          ? "border-foreground text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Sidebar CTA card */}
              <div className="mt-8 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center shrink-0">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-violet-700 dark:text-violet-300"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold tracking-tight text-violet-900 dark:text-violet-100 leading-tight">
                    Start investing early
                  </p>
                </div>
                <p className="text-[11px] text-violet-700 dark:text-violet-300 leading-relaxed mb-3">
                  Register now to get first access to upcoming tokenized assets
                  before allocations fill up.
                </p>
                <a
                  href="#get-access"
                  className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-violet-800 dark:text-violet-200 hover:text-violet-600 dark:hover:text-violet-100 transition-colors"
                >
                  Register now
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 4L10 8L6 12" />
                  </svg>
                </a>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-16">
            {/* What is Tokenization */}
            <Section id="what-is-tokenization">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Unlocking Ownership Through Tokenization
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Think of it like owning a slice of a property instead of buying
                the whole thing. A single building is divided into many digital
                shares — called tokens. You buy one or more shares, and you
                legally own that portion of the asset. It&apos;s recorded
                securely on a blockchain, so there&apos;s no ambiguity about who
                owns what.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                No tech background needed. No millions required. Whether
                you&apos;re 25 or 65, based in Lagos or London — if you can send
                money online, you can invest through Odinala.
              </p>
              <ul className="space-y-3">
                {[
                  "Own a verified fraction of a property — not the whole thing",
                  "Start with an amount that fits your budget",
                  "Your ownership is recorded and protected — no middlemen, no guesswork",
                  "Access properties previously out of reach for everyday investors",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Use cases */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Building2, label: "Real Estate Ownership" },
                  { icon: Coins, label: "Bonds & Financial Instruments" },
                  { icon: Leaf, label: "Carbon Credits & Sustainability" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <Icon className="w-5 h-5 shrink-0 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Why It Matters */}
            <Section id="why-it-matters">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Why This Opportunity Matters
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For decades, investing in Nigerian property from abroad meant
                navigating currency barriers, unreliable agents, and unclear
                ownership — with no guarantee your money was safe. Odinala
                changes that. You send USD, GBP, or EUR. We handle the
                conversion, the verification, and the paperwork. You get a
                secure, documented stake in the asset.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The global tokenization market is projected to reach{" "}
                <strong className="text-foreground">
                  trillions of dollars
                </strong>{" "}
                in value. Nigeria&apos;s property market is one of the
                fastest-growing in Africa — and Odinala puts you at the front of
                that wave, whether you&apos;re in Houston, Dublin, or Abuja.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Confusing currency barriers",
                    resolved: "Pay in USD, GBP, or EUR",
                  },
                  {
                    label: "Lack of transparency",
                    resolved: "Verified ownership records",
                  },
                  {
                    label: "High entry costs",
                    resolved: "Start with what you have",
                  },
                  {
                    label: "Unreliable agents abroad",
                    resolved: "We manage everything end-to-end",
                  },
                ].map(({ label, resolved }) => (
                  <div
                    key={label}
                    className="p-4 rounded-lg border border-border bg-muted/20"
                  >
                    <p className="text-xs text-muted-foreground line-through mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-semibold">{resolved}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Flagship */}
            <Section id="flagship">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Our Flagship Opportunity
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You don&apos;t need to be wealthy to get started. Our first
                tokenized asset is designed so that anyone — whether you&apos;re
                putting in $500 or $50,000 — can own a verifiable, documented
                stake in premium Nigerian real estate.
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-neutral-950 dark:bg-neutral-900 text-white p-6 sm:p-8">
                  <span className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-3 block">
                    Featured Asset
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">
                    Prime Real Estate in Nigeria
                  </h3>
                  <p className="text-white/60 text-sm">
                    A premium, high-demand property — title verified, on-site
                    inspected, and fully structured by Odinala. Pay in your
                    currency. We deliver the keys.
                  </p>
                </div>
                <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-4">
                  {[
                    "Pay in USD, GBP, or EUR — we handle the Naira",
                    "Limited allocation — early registrants get priority",
                    "Flexible entry: own as little or as much as you want",
                    "Title verified, on-site inspected, fully documented",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-foreground" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Why Odinala */}
            <Section id="why-odinala">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Why Choose Odinala
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We know the biggest fear with Nigerian real estate is losing
                money to fraud, bad titles, or unreliable agents. Every decision
                we&apos;ve made — from how we verify properties to how we hold
                your funds — is built to eliminate those risks.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Verified Assets Only",
                    desc: "We inspect every property on-site and check the title before it ever reaches the platform. No exceptions.",
                  },
                  {
                    icon: PieChart,
                    title: "Invest What You Can",
                    desc: "You don't need millions. Own a verified stake in a premium property with whatever fits your budget.",
                  },
                  {
                    icon: Eye,
                    title: "Full Visibility",
                    desc: "See exactly what you own, what it's worth, and how it's performing — at any time, from anywhere.",
                  },
                  {
                    icon: Lock,
                    title: "Your Money is Protected",
                    desc: "Funds are held securely and only released when ownership is confirmed. You're never exposed unnecessarily.",
                  },
                  {
                    icon: Globe,
                    title: "Built for the Diaspora",
                    desc: "Pay in USD, GBP, or EUR from wherever you live. We handle every step on the ground in Nigeria.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Get In Early",
                    desc: "Nigeria's property market is growing fast. Early investors access better prices and stronger returns.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="p-5 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <Icon className="w-5 h-5 mb-3 text-foreground" />
                    <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Section>

            {/* How It Works */}
            <Section id="how-it-works">
              <HowItWorksCarousel />
            </Section>

            {/* Benefits */}
            <Section id="benefits">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Key Benefits of Investing This Way
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Traditional real estate is slow, expensive, and hard to get into
                — especially from abroad. Tokenization changes the rules, and
                Odinala makes it simple enough for anyone.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Zap,
                    title: "No Minimum Fortune Required",
                    desc: "You don't have to buy the whole property. Invest what you can, start small, and grow over time.",
                  },
                  {
                    icon: Users,
                    title: "Open to Everyone",
                    desc: "First-time investor or seasoned buyer — the platform is designed so anyone can understand and use it.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Cut Out the Middlemen",
                    desc: "Fewer agents, lower fees, faster transactions. Your money goes further toward the actual asset.",
                  },
                  {
                    icon: PieChart,
                    title: "Spread Your Risk",
                    desc: "Own a piece of multiple properties instead of betting everything on one. Diversify without the usual barriers.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-4 p-5 rounded-xl border border-border"
                  >
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Who It's For */}
            <Section id="who-its-for">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Who This Is For
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You don&apos;t have to be a finance expert or a tech person. If
                you want to own property in Nigeria and want to do it safely and
                simply, this is for you.
              </p>
              <ul className="space-y-3">
                {[
                  "You live in the UK, US, Canada, or Europe and want to invest back home — without the usual risks and hassle",
                  "You're a first-timer who's never invested before and wants a clear, guided process",
                  "You're a local investor in Nigeria ready to participate in a new, more accessible class of asset",
                  "You're a seasoned investor looking to diversify beyond stocks, crypto, or traditional property",
                  "You're older and want a low-friction way to build something lasting for your family",
                  "You're young and want to start building wealth now, with whatever you have",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Featured Listings */}
            <Section id="featured-listings">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                    Featured Listings
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Properties Available Now
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Verified and ready for fractional ownership. Pay in your
                    currency.
                  </p>
                </div>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {listings.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {listings.slice(0, 3).map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        secondaryPrice={`${formatUsd(
                          ngnToUsd(property.price)
                        )} USD`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 mt-4">
                    * USD amounts are approximate based on a rate of ₦1,620 per
                    $1. Actual conversion rates may vary.
                  </p>
                </>
              ) : (
                <div className="rounded-xl border border-border border-dashed py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    New listings coming soon. Register your interest to be first
                    to know.
                  </p>
                  <a
                    href="#get-access"
                    className="inline-flex items-center gap-1.5 text-sm font-medium mt-3 hover:underline"
                  >
                    Register now <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </Section>

            {/* CTA */}
            <Section id="get-access">
              <div className="rounded-xl overflow-hidden relative text-white">
                {/* Particles background */}
                <ParticlesComponent id="particles-cta" />
                {/* Dark overlay so text stays readable */}
                <div className="absolute inset-0 bg-black/60 z-10" />
                {/* Content sits above particles */}
                <div className="relative z-20 p-8 sm:p-10">
                  <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-3">
                    Spots Are Limited — Register Now
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                    Get Early Access
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-md">
                    Early registrants get first access to upcoming properties,
                    better allocations, and priority updates. It takes two
                    minutes to register — no payment required upfront.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {[
                      "First access to upcoming tokenized properties",
                      "Receive plain-English investment briefs — no jargon",
                      "Lock in your allocation before it opens to the public",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-white/70"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-white/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/auth/sign-up">
                      <button className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors cursor-pointer">
                        Register Your Interest
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <button className="inline-flex items-center gap-2 border border-white/20 text-white text-sm font-medium px-6 py-3 rounded-lg hover:border-white/40 transition-colors cursor-pointer">
                        Join the Diaspora Investment List
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}
