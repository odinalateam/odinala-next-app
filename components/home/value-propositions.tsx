"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Users,
  BookOpen,
  Headphones,
  FileText,
  MapPin,
  CheckCircle2,
  Circle,
  Star,
  Phone,
  Mail,
  Send,
  FileCheck,
  AlertCircle,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description:
      "Carefully sourced and vetted through developer documentation and on-site inspections, giving you complete confidence in every property we present.",
  },
  {
    icon: CreditCard,
    title: "Clear Payment Plans",
    description:
      "Distance should never be the reason you can't own a piece of home. We offer flexible installment options and diaspora-friendly mortgage plans that work around your income, your currency, and your lifestyle. No matter where in the world you are, your path to homeownership starts here.",
  },
  {
    icon: Users,
    title: "Professional Expert Guidance",
    description:
      "Detailed consultations with experienced realtors, from title verification to negotiation, ensuring your decisions are informed, secure, and in your best interest.",
  },
  {
    icon: BookOpen,
    title: "Buyer Toolkits and Resources",
    description:
      "Webinars, checklists, and guides, combined with personalized support, to make your buying process simple, transparent, and stress-free.",
  },
  {
    icon: Headphones,
    title: "24/7 Human Support",
    description:
      "Our team is available to call, email, or WhatsApp, anytime, anywhere, to assist you from start to finish.",
  },
  {
    icon: FileText,
    title: "Legal & Documentation Assistance",
    description:
      "We guide you through every layer of property documentation, from compliance to due diligence, ensuring your transaction is secure, lawful, and worry-free.",
  },
];

// --- Mockup Components ---

function MockupVerifiedListings() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Featured Property
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5" /> Verified
        </span>
      </div>
      <div className="rounded-2xl bg-muted/50 h-56 flex items-center justify-center border">
        <div className="text-center space-y-2">
          <MapPin className="h-10 w-10 text-amber-500 mx-auto" />
          <p className="text-sm text-muted-foreground font-medium">
            Lekki Phase 1, Lagos
          </p>
        </div>
      </div>
      <div>
        <p className="font-semibold text-base">3-Bedroom Terrace Duplex</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          Lekki Phase 1 · Lagos State
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">₦45,000,000</p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>3 bed</span>
          <span>2 bath</span>
          <span>1,200 sqft</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["On-site Inspected", "Title Verified", "Developer Docs"].map((t) => (
          <div
            key={t}
            className="flex flex-col items-center gap-1.5 bg-green-50 border border-green-100 rounded-xl p-3"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-xs text-green-700 text-center leading-tight font-medium">
              {t}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupPaymentPlans() {
  const schedule = [
    { label: "Initial Deposit (5%)", amount: "₦2,250,000", done: true },
    { label: "Month 3", amount: "₦1,500,000", done: true },
    { label: "Month 6", amount: "₦1,500,000", done: false },
    { label: "Month 12", amount: "₦1,500,000", done: false },
    { label: "Final Balance", amount: "₦38,250,000", done: false },
  ];
  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Payment Schedule
        </p>
        <p className="font-semibold text-lg mt-1">Lagos Island Estate</p>
        <p className="text-sm text-muted-foreground">
          24-Month Installment Plan
        </p>
      </div>
      <div className="space-y-2.5">
        {schedule.map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
              row.done
                ? "bg-green-50 border-green-100"
                : "bg-card border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              {row.done ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
              )}
              <span
                className={`text-sm ${
                  row.done ? "text-green-700" : "text-foreground"
                }`}
              >
                {row.label}
              </span>
            </div>
            <span
              className={`text-sm font-semibold ${
                row.done ? "text-green-700" : ""
              }`}
            >
              {row.amount}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-sm text-muted-foreground">Total Price</span>
        <span className="font-bold text-lg">₦45,000,000</span>
      </div>
    </div>
  );
}

function MockupExpertGuidance() {
  return (
    <div className="p-8 space-y-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Your Odinala Agent
      </p>
      <div className="flex items-center gap-5 p-4 rounded-2xl border bg-muted/30">
        <div className="h-16 w-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center shrink-0">
          <span className="text-amber-700 font-bold text-xl">AO</span>
        </div>
        <div>
          <p className="font-semibold text-base">Adaeze Okonkwo</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Senior Realtor · 8 yrs exp
          </p>
          <div className="flex items-center gap-0.5 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1.5">
              (124 reviews)
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {[
          "Title Document Verification",
          "Negotiation Strategy",
          "Due Diligence Review",
          "Offer Structuring",
        ].map((s) => (
          <div
            key={s}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
            {s}
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-500 text-white text-sm font-semibold text-center py-3.5 cursor-pointer">
        Book Free Consultation →
      </div>
    </div>
  );
}

function MockupBuyerToolkit() {
  const checklist = [
    { label: "Property Checklist", done: true },
    { label: "Title Verification Guide", done: true },
    { label: "Mortgage Calculator", done: false },
    { label: "Due Diligence Template", done: false },
  ];
  return (
    <div className="p-8 space-y-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Your Buyer Toolkit
      </p>
      <div className="space-y-2.5">
        {checklist.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl border px-4 py-3"
          >
            {item.done ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
            )}
            <span className="text-sm">{item.label}</span>
            {item.done && (
              <span className="ml-auto text-xs text-green-600 font-medium bg-green-50 rounded-lg px-2 py-0.5">
                Done
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-800">Upcoming Webinar</p>
        <p className="text-sm text-amber-700 mt-1">
          First-Time Buyer Masterclass
        </p>
        <p className="text-xs text-amber-600 mt-1">Saturday, 10:00 AM WAT</p>
        <div className="mt-3 text-sm font-semibold text-amber-700 underline cursor-pointer">
          Register free →
        </div>
      </div>
    </div>
  );
}

function MockupSupport() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Odinala Support
        </p>
        <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
          Online now
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-end">
          <div className="bg-amber-500 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[78%]">
            Hi! I need help understanding the payment plan for Victoria Garden
            City.
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-muted text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[78%]">
            Of course! The plan offers 12–24 month installments with a 5%
            initial deposit.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-amber-500 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[78%]">
            Can we schedule a call?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-muted text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[78%]">
            Absolutely! I&apos;ll send you a booking link right away. ✓✓
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {[
          { icon: Phone, label: "Call" },
          { icon: Mail, label: "Email" },
          { icon: Send, label: "WhatsApp" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex-1 flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-medium text-muted-foreground hover:border-amber-400 hover:text-amber-600 transition-colors"
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground">
        Average response time: &lt; 2 minutes
      </p>
    </div>
  );
}

function MockupLegalDocs() {
  const docs = [
    { label: "Certificate of Occupancy (C of O)", status: "verified" },
    { label: "Survey Plan", status: "verified" },
    { label: "Deed of Assignment", status: "verified" },
    { label: "Land Use Consent", status: "pending" },
    { label: "Building Approval", status: "pending" },
  ];
  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Document Verification
        </p>
        <p className="font-semibold text-base mt-1">
          Victoria Garden City Estate
        </p>
      </div>
      <div className="space-y-2.5">
        {docs.map((doc) => (
          <div
            key={doc.label}
            className="flex items-center gap-3 rounded-xl border px-4 py-3"
          >
            {doc.status === "verified" ? (
              <FileCheck className="h-5 w-5 text-green-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
            )}
            <span className="text-sm flex-1">{doc.label}</span>
            <span
              className={`text-xs font-medium rounded-lg px-2.5 py-1 ${
                doc.status === "verified"
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {doc.status === "verified" ? "Verified" : "In Review"}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-sm text-muted-foreground">3 of 5 verified</span>
        <div className="flex-1 mx-4 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-3/5 bg-green-500 rounded-full" />
        </div>
        <span className="text-sm font-semibold text-green-600">60%</span>
      </div>
    </div>
  );
}

const mockups = [
  MockupVerifiedListings,
  MockupPaymentPlans,
  MockupExpertGuidance,
  MockupBuyerToolkit,
  MockupSupport,
  MockupLegalDocs,
];

function MockupPanel({ activeIndex }: { activeIndex: number }) {
  const [displayed, setDisplayed] = useState(activeIndex);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (activeIndex === displayed) return;
    setVisible(false);
    const t = setTimeout(() => {
      setDisplayed(activeIndex);
      setVisible(true);
    }, 200);
    return () => clearTimeout(t);
  }, [activeIndex, displayed]);

  const ActiveMockup = mockups[displayed];

  return (
    <div
      className="rounded-2xl border bg-card shadow-xl overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 200ms ease, transform 200ms ease",
      }}
    >
      {/* Mock browser chrome */}
      <div className="flex items-center gap-1.5 px-5 py-3.5 border-b bg-muted/40">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
        <span className="h-3 w-3 rounded-full bg-green-400/70" />
        <div className="flex-1 mx-4 bg-background rounded-lg text-xs text-muted-foreground px-3 py-1.5 border text-center">
          app.odinala.com
        </div>
      </div>
      <ActiveMockup />
    </div>
  );
}

export function ValuePropositions() {
  const [activeIndex, setActiveIndex] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = featureRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (i !== -1) setActiveIndex(i);
          }
        });
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );

    featureRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why Choose Odinala
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
            We provide everything you need for a smooth, secure property buying
            experience
          </p>
        </div>

        {/* Desktop: sticky scroll */}
        <div className="hidden lg:flex gap-12 items-start">
          {/* Left: scrollable feature list */}
          <div className="flex-1">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isActive = activeIndex === i;
              return (
                <div
                  key={feature.title}
                  ref={(el) => {
                    featureRefs.current[i] = el;
                  }}
                  className="min-h-[50vh] flex items-center py-10"
                  style={{
                    opacity: isActive ? 1 : 0.35,
                    transition: "opacity 300ms ease",
                  }}
                >
                  <div
                    className={`pl-6 border-l-2 transition-colors duration-300 ${
                      isActive ? "border-amber-500" : "border-transparent"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: sticky mockup */}
          <div className="w-[560px] shrink-0 sticky top-[calc(50vh-320px)] self-start">
            <MockupPanel activeIndex={activeIndex} />
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 transition-colors hover:border-amber-200 hover:bg-amber-500/[0.02]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
