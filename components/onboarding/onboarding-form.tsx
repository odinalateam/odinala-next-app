"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { saveOnboarding, skipOnboarding } from "@/lib/actions/onboarding";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { usePostHog } from "posthog-js/react";

const BUDGET_OPTIONS = [
  {
    value: "5M_plus",
    label: "₦5M+ / $10,000+",
    description: "High-value investments",
  },
  {
    value: "1M_5M",
    label: "₦1M–₦5M / $2,000–$10,000",
    description: "Mid-range investments",
  },
  {
    value: "exploring",
    label: "Just exploring",
    description: "No commitment yet",
  },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: "Property", label: "Property" },
  { value: "Land", label: "Land" },
  { value: "Both", label: "Both" },
];

const POPULAR_COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "United Arab Emirates",
  "Ireland",
  "Germany",
  "France",
  "Australia",
  "Netherlands",
  "Nigeria",
];

export function OnboardingForm() {
  const router = useRouter();
  const ph = usePostHog();
  const [country, setCountry] = useState("");
  const [investmentBudget, setInvestmentBudget] = useState("");
  const [propertyTypePreference, setPropertyTypePreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCountries =
    country.length > 0
      ? POPULAR_COUNTRIES.filter((c) =>
          c.toLowerCase().includes(country.toLowerCase())
        )
      : POPULAR_COUNTRIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim()) {
      toast.error("Please enter your country.");
      return;
    }
    if (!investmentBudget) {
      toast.error("Please select your investment budget.");
      return;
    }
    if (!propertyTypePreference) {
      toast.error("Please select your property preference.");
      return;
    }

    setLoading(true);
    const utmSource = sessionStorage.getItem("utm_source") ?? undefined;
    const utmMedium = sessionStorage.getItem("utm_medium") ?? undefined;
    const utmCampaign = sessionStorage.getItem("utm_campaign") ?? undefined;

    const result = await saveOnboarding({
      country: country.trim(),
      investmentBudget,
      propertyTypePreference,
      utmSource,
      utmMedium,
      utmCampaign,
    });
    setLoading(false);

    if (result.success) {
      ph.capture("onboarding_completed", {
        country: country.trim(),
        budget: investmentBudget,
        property_preference: propertyTypePreference,
        skipped: false,
      });
      router.push("/");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  };

  const handleSkip = async () => {
    setSkipping(true);
    const result = await skipOnboarding();
    setSkipping(false);
    if (result.success) {
      ph.capture("onboarding_skipped");
      router.push("/");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Tell us about yourself
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Help us personalise your investment experience. Takes 30 seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Where are you based?</Label>
          <div className="relative">
            <Input
              id="country"
              placeholder="e.g. United Kingdom"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              autoComplete="off"
              className="h-11"
            />
            {showSuggestions && filteredCountries.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-44 overflow-auto">
                {filteredCountries.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors"
                    onMouseDown={() => {
                      setCountry(c);
                      setShowSuggestions(false);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Investment Budget */}
        <div className="space-y-2">
          <Label>How much are you looking to invest?</Label>
          <div className="grid gap-2">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setInvestmentBudget(opt.value)}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                  investmentBudget === opt.value
                    ? "border-foreground bg-muted"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                    investmentBudget === opt.value
                      ? "border-foreground"
                      : "border-muted-foreground"
                  )}
                >
                  {investmentBudget === opt.value && (
                    <div className="h-2 w-2 rounded-full bg-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>What are you interested in?</Label>
          <div className="flex gap-2">
            {PROPERTY_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPropertyTypePreference(opt.value)}
                className={cn(
                  "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors",
                  propertyTypePreference === opt.value
                    ? "border-foreground bg-muted"
                    : "border-border hover:bg-muted/50"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-11"
          disabled={loading || skipping}
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Save & Continue
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <button
          type="button"
          onClick={handleSkip}
          disabled={loading || skipping}
          className="hover:text-foreground transition-colors disabled:opacity-50"
        >
          {skipping ? "Skipping..." : "Skip for now"}
        </button>
      </p>
    </>
  );
}
