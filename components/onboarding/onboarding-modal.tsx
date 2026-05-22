"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getOnboardingStatus, saveOnboarding, skipOnboarding } from "@/lib/actions/onboarding";
import { toast } from "sonner";
import { MapPin, Wallet, Home, ChevronRight } from "lucide-react";

const BUDGET_OPTIONS = [
  { value: "5M_plus", label: "₦5M+ / $10,000+", description: "High-value investments" },
  { value: "1M_5M", label: "₦1M–₦5M / $2,000–$10,000", description: "Mid-range investments" },
  { value: "exploring", label: "Just exploring", description: "No commitment yet" },
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

interface OnboardingModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function OnboardingModal({ forceOpen = false, onClose }: OnboardingModalProps) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [country, setCountry] = useState("");
  const [investmentBudget, setInvestmentBudget] = useState("");
  const [propertyTypePreference, setPropertyTypePreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (isPending || isAdmin || isDashboard) return;

    if (!session) {
      setLoaded(true);
      return;
    }

    getOnboardingStatus().then((status) => {
      if (status && !status.onboardingCompleted && !status.onboardingSkipped) {
        setOpen(true);
      }
      setLoaded(true);
    });
  }, [session, isPending, isAdmin, isDashboard]);

  useEffect(() => {
    if (forceOpen && loaded && !isAdmin && !isDashboard) {
      setOpen(true);
    }
  }, [forceOpen, loaded, isAdmin, isDashboard]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleSkip = async () => {
    setLoading(true);
    const result = await skipOnboarding();
    setLoading(false);
    if (result.success) {
      handleClose();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  };

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
      toast.success("Profile updated! We'll personalise your experience.");
      handleClose();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  };

  const filteredCountries = country.length > 0
    ? POPULAR_COUNTRIES.filter((c) => c.toLowerCase().includes(country.toLowerCase()))
    : POPULAR_COUNTRIES;

  if (!loaded || !session) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Tell us about yourself</DialogTitle>
          <DialogDescription>
            Help us personalise your property investment experience. Takes 30 seconds.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {/* Country */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Where are you based?
            </Label>
            <div className="relative">
              <Input
                placeholder="e.g. United Kingdom"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onFocus={() => setShowCountrySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCountrySuggestions(false), 150)}
                autoComplete="off"
              />
              {showCountrySuggestions && filteredCountries.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-md max-h-44 overflow-auto">
                  {filteredCountries.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors"
                      onMouseDown={() => { setCountry(c); setShowCountrySuggestions(false); }}
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
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              How much are you looking to invest?
            </Label>
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
                  <div className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center",
                    investmentBudget === opt.value ? "border-foreground" : "border-muted-foreground"
                  )}>
                    {investmentBudget === opt.value && (
                      <div className="h-2 w-2 rounded-full bg-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Property Type Preference */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              What are you interested in?
            </Label>
            <div className="flex gap-2">
              {PROPERTY_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPropertyTypePreference(opt.value)}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
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

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Skip for now
            </button>
            <Button type="submit" disabled={loading} className="gap-1.5">
              {loading ? "Saving..." : "Save & Continue"}
              {!loading && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
