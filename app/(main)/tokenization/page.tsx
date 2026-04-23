"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import ParticlesComponent from "@/components/ui/particles-bg";
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
  { id: "what-is-tokenization", label: "What Is Tokenization?" },
  { id: "why-it-matters", label: "Why It Matters" },
  { id: "flagship", label: "Flagship Opportunity" },
  { id: "why-odinala", label: "Why Odinala" },
  { id: "how-it-works", label: "How It Works" },
  { id: "benefits", label: "Key Benefits" },
  { id: "who-its-for", label: "Who It's For" },
  { id: "get-access", label: "Get Early Access" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
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
    title: "Register Interest",
    desc: "Get early access to available opportunities before they open to the public.",
    label: "Start",
  },
  {
    step: "02",
    title: "Verify Your Identity",
    desc: "Secure onboarding process to protect your investment and meet compliance requirements.",
    label: "Verify",
  },
  {
    step: "03",
    title: "Choose Your Investment",
    desc: "Select how many tokens (shares) you want based on your budget and goals.",
    label: "Invest",
  },
  {
    step: "04",
    title: "Track & Manage",
    desc: "Monitor your asset performance via your personal dashboard in real time.",
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

  const goNext = () => setActiveIndex((prev) => (prev + 1) % HOW_IT_WORKS.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + HOW_IT_WORKS.length) % HOW_IT_WORKS.length);

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
              animate={{ height: `${((activeIndex + 1) / HOW_IT_WORKS.length) * 100}%` }}
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
              <motion.div key={activeIndex} initial="hidden" animate="visible" exit="exit">
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
                          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
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
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
              <motion.button
                onClick={goNext}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

export default function TokenizationPage() {
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Own Verified
              <br />
              <span className="text-white/60">Real-World Assets</span>
              <br />
              Digitally
            </h1>
            <p className="text-lg text-white leading-relaxed max-w-xl">
              Secure your share in premium Nigerian real estate through
              blockchain-powered tokenization. Simple. Transparent. Accessible.
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-700 dark:text-violet-300">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold tracking-tight text-violet-900 dark:text-violet-100 leading-tight">
                    Start investing early
                  </p>
                </div>
                <p className="text-[11px] text-violet-700 dark:text-violet-300 leading-relaxed mb-3">
                  Register now to get first access to upcoming tokenized assets before allocations fill up.
                </p>
                <a
                  href="#get-access"
                  className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-violet-800 dark:text-violet-200 hover:text-violet-600 dark:hover:text-violet-100 transition-colors"
                >
                  Register now
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                What Is Real-World Asset Tokenization?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Real-world asset tokenization converts physical assets — like
                real estate, commodities, and financial instruments — into
                digital tokens on a blockchain. Each token represents a verified
                fraction of ownership in the underlying asset.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                It&apos;s the bridge between traditional finance and the future
                of investing — making high-value assets liquid, accessible, and
                transparent for everyone.
              </p>
              <ul className="space-y-3">
                {[
                  "Own a fraction of a property — not the whole thing",
                  "Invest with smaller amounts that fit your budget",
                  "Track ownership transparently on-chain",
                  "Access opportunities previously reserved for the wealthy",
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
                The global tokenization market is projected to reach{" "}
                <strong className="text-foreground">
                  trillions of dollars
                </strong>{" "}
                in value. This is not just a trend — it&apos;s a fundamental
                shift in how assets are owned, traded, and scaled across the
                world.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With Odinala, you&apos;re not just investing. You&apos;re
                entering early into Nigeria&apos;s most innovative property
                investment ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "High entry costs",
                    resolved: "Low minimum investment",
                  },
                  {
                    label: "Lack of transparency",
                    resolved: "On-chain ownership records",
                  },
                  {
                    label: "Limited access",
                    resolved: "Open to diaspora & locals",
                  },
                  {
                    label: "Liquidity constraints",
                    resolved: "Tradeable fractional shares",
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
                This is your opportunity to access institutional-grade assets
                without institutional-level capital.
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
                    A premium, high-demand property — fully verified and
                    structured by Odinala.
                  </p>
                </div>
                <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-4">
                  {[
                    "Premium, high-demand property",
                    "Limited allocation available",
                    "Flexible entry through tokenized shares",
                    "Fully verified and documented",
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
                We understand the biggest concern in real estate: trust.
                That&apos;s why every part of how we operate is built around it.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Verified Assets",
                    desc: "Every asset undergoes strict verification and documentation checks before listing.",
                  },
                  {
                    icon: PieChart,
                    title: "Fractional Ownership",
                    desc: "Invest based on your budget, not the full property price.",
                  },
                  {
                    icon: Eye,
                    title: "Transparent Structure",
                    desc: "Track ownership, performance, and returns with full clarity.",
                  },
                  {
                    icon: Lock,
                    title: "Secure Infrastructure",
                    desc: "Blockchain-backed system ensures trust, traceability, and reduced fraud risk.",
                  },
                  {
                    icon: Globe,
                    title: "Built for Diaspora",
                    desc: "Invest from anywhere in the world with confidence and legal clarity.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Growth-Oriented",
                    desc: "Access a growing market before it becomes mainstream.",
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
                Key Benefits of Tokenized Investing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Tokenization solves the biggest pain points of traditional real
                estate investing — and Odinala delivers it simply.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Zap,
                    title: "Increased Liquidity",
                    desc: "Buy and sell fractional shares more easily than traditional real estate.",
                  },
                  {
                    icon: Users,
                    title: "Greater Accessibility",
                    desc: "Start investing without needing massive upfront capital.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Market Efficiency",
                    desc: "Faster transactions, lower costs, and fewer intermediaries.",
                  },
                  {
                    icon: PieChart,
                    title: "Diversification",
                    desc: "Own multiple assets instead of locking funds into a single property.",
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
                Odinala is designed for a new generation of investors who
                believe wealth should be accessible to everyone.
              </p>
              <ul className="space-y-3">
                {[
                  "Nigerians in diaspora looking for trusted investments back home",
                  "Local investors seeking better ROI opportunities",
                  "First-time investors entering real estate for the first time",
                  "Institutions exploring modern asset structures and digital ownership",
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
                    The Future of Ownership Starts Here
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                    Get Early Access
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-md">
                    Don&apos;t wait until opportunities are fully allocated. Join
                    the next wave of investors and be first to secure your
                    allocation.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {[
                      "Get exclusive access to upcoming assets",
                      "Receive detailed investment briefs",
                      "Be first to secure allocations",
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
