"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, CheckCircle2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updatePersonalInfo,
  updateFinancialInfo,
  verifyNINAction,
  verifyTINAction,
} from "@/lib/actions/profile";
import type { UserProfile } from "@prisma/client";

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  profile: UserProfile;
}

export function ProfileClient({ user, profile }: ProfileClientProps) {
  const router = useRouter();
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingFinancial, setEditingFinancial] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingFinancial, setSavingFinancial] = useState(false);
  const [verifyingNIN, setVerifyingNIN] = useState(false);
  const [verifyingTIN, setVerifyingTIN] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user.name?.split(" ")[0] || "",
    lastName: user.name?.split(" ").slice(1).join(" ") || "",
    email: user.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    dateOfBirth: profile.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
      : "",
  });

  const [nin, setNin] = useState(profile.nin || "");
  const [ninVerified, setNinVerified] = useState(profile.ninVerified);

  const [financialInfo, setFinancialInfo] = useState({
    citizenship: profile.citizenship || "",
    taxId: profile.taxId || "",
    employmentStatus: profile.employmentStatus || "Employed",
    occupation: profile.occupation || "",
    employerName: profile.employerName || "",
    sourceOfFunds: profile.sourceOfFunds || "",
  });

  const [tinVerified, setTinVerified] = useState(profile.tinVerified);
  const kycStatus = profile.kycStatus;

  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccessMessage(null);
    } else {
      setSuccessMessage(msg);
      setError(null);
    }
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 4000);
  };

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);
    setError(null);
    try {
      await updatePersonalInfo({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone,
        address: personalInfo.address,
        dateOfBirth: personalInfo.dateOfBirth,
      });
      setEditingPersonal(false);
      showMessage("Personal information saved");
      router.refresh();
    } catch (err) {
      showMessage(
        err instanceof Error ? err.message : "Failed to save",
        true
      );
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFinancial(true);
    setError(null);
    try {
      await updateFinancialInfo({
        citizenship: financialInfo.citizenship,
        taxId: financialInfo.taxId,
        employmentStatus: financialInfo.employmentStatus,
        occupation: financialInfo.occupation,
        employerName: financialInfo.employerName,
        sourceOfFunds: financialInfo.sourceOfFunds,
      });
      setEditingFinancial(false);
      showMessage("Financial information saved");
      router.refresh();
    } catch (err) {
      showMessage(
        err instanceof Error ? err.message : "Failed to save",
        true
      );
    } finally {
      setSavingFinancial(false);
    }
  };

  const handleVerifyNIN = async () => {
    setVerifyingNIN(true);
    setError(null);
    try {
      await verifyNINAction(nin);
      setNinVerified(true);
      showMessage("NIN verified successfully");
      router.refresh();
    } catch (err) {
      showMessage(
        err instanceof Error ? err.message : "NIN verification failed",
        true
      );
    } finally {
      setVerifyingNIN(false);
    }
  };

  const handleVerifyTIN = async () => {
    setVerifyingTIN(true);
    setError(null);
    try {
      await verifyTINAction(financialInfo.taxId);
      setTinVerified(true);
      showMessage("TIN verified successfully");
      router.refresh();
    } catch (err) {
      showMessage(
        err instanceof Error ? err.message : "TIN verification failed",
        true
      );
    } finally {
      setVerifyingTIN(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="space-y-8">
      {/* Status Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-400">
          {successMessage}
        </div>
      )}

      {/* Personal Information */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Personal Information</h1>
            <Badge
              variant="outline"
              className={
                kycStatus === "verified"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-transparent"
              }
            >
              KYC: {kycStatus}
            </Badge>
          </div>
          <button
            onClick={() => setEditingPersonal(!editingPersonal)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            {editingPersonal ? "Cancel" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleSavePersonal} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="firstName"
                className="text-sm text-muted-foreground"
              >
                First name
              </label>
              <input
                type="text"
                id="firstName"
                disabled={!editingPersonal}
                value={personalInfo.firstName}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    firstName: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="lastName"
                className="text-sm text-muted-foreground"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                disabled={!editingPersonal}
                value={personalInfo.lastName}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    lastName: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                id="email"
                disabled
                value={personalInfo.email}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="text-sm text-muted-foreground"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                disabled={!editingPersonal}
                value={personalInfo.phone}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    phone: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="address"
                className="text-sm text-muted-foreground"
              >
                Residential Address
              </label>
              <input
                type="text"
                id="address"
                disabled={!editingPersonal}
                value={personalInfo.address}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    address: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="dateOfBirth"
                className="text-sm text-muted-foreground"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                disabled={!editingPersonal}
                value={personalInfo.dateOfBirth}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    dateOfBirth: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* NIN Verification */}
          <div className="space-y-1.5">
            <label htmlFor="nin" className="text-sm text-muted-foreground">
              National Identification Number (NIN)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="nin"
                disabled={ninVerified}
                value={nin}
                onChange={(e) => setNin(e.target.value)}
                placeholder="Enter your 11-digit NIN"
                className={inputClass}
              />
              {ninVerified ? (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 shrink-0 px-3">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerifyNIN}
                  disabled={verifyingNIN || !nin.trim()}
                  className="shrink-0"
                >
                  {verifyingNIN ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      Verifying...
                    </>
                  ) : (
                    "Verify NIN"
                  )}
                </Button>
              )}
            </div>
            {!ninVerified && (
              <p className="text-xs text-muted-foreground/60">
                Save your personal info (name &amp; date of birth) before
                verifying NIN
              </p>
            )}
          </div>

          {editingPersonal && (
            <Button type="submit" disabled={savingPersonal}>
              {savingPersonal ? "Saving..." : "Save Data"}
            </Button>
          )}
        </form>
      </section>

      {/* Financial Information */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Financial Information</h1>
          <button
            onClick={() => setEditingFinancial(!editingFinancial)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            {editingFinancial ? "Cancel" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleSaveFinancial} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="citizenship"
                className="text-sm text-muted-foreground"
              >
                Citizenship
              </label>
              <input
                type="text"
                id="citizenship"
                disabled={!editingFinancial}
                value={financialInfo.citizenship}
                onChange={(e) =>
                  setFinancialInfo({
                    ...financialInfo,
                    citizenship: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="taxId" className="text-sm text-muted-foreground">
                Tax ID Number (TIN)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="taxId"
                  disabled={!editingFinancial || tinVerified}
                  value={financialInfo.taxId}
                  onChange={(e) =>
                    setFinancialInfo({
                      ...financialInfo,
                      taxId: e.target.value,
                    })
                  }
                  placeholder="XXXXXXXX-XXXX"
                  className={inputClass}
                />
                {tinVerified ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 shrink-0 px-3">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyTIN}
                    disabled={
                      verifyingTIN || !financialInfo.taxId.trim()
                    }
                    className="shrink-0"
                  >
                    {verifyingTIN ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        Verifying...
                      </>
                    ) : (
                      "Verify TIN"
                    )}
                  </Button>
                )}
              </div>
              {!tinVerified && (
                <p className="text-xs text-muted-foreground/60">
                  Format: XXXXXXXX-XXXX
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="employmentStatus"
                className="text-sm text-muted-foreground"
              >
                Employment Status
              </label>
              <Select
                disabled={!editingFinancial}
                value={financialInfo.employmentStatus}
                onValueChange={(v) =>
                  setFinancialInfo({
                    ...financialInfo,
                    employmentStatus: v ?? "Employed",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employed">Employed</SelectItem>
                  <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="occupation"
                className="text-sm text-muted-foreground"
              >
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                disabled={!editingFinancial}
                value={financialInfo.occupation}
                onChange={(e) =>
                  setFinancialInfo({
                    ...financialInfo,
                    occupation: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                htmlFor="employerName"
                className="text-sm text-muted-foreground"
              >
                Employer Name
              </label>
              <input
                type="text"
                id="employerName"
                disabled={!editingFinancial}
                value={financialInfo.employerName}
                onChange={(e) =>
                  setFinancialInfo({
                    ...financialInfo,
                    employerName: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="sourceOfFunds"
                className="text-sm text-muted-foreground"
              >
                Source of Funds
              </label>
              <input
                type="text"
                id="sourceOfFunds"
                disabled={!editingFinancial}
                value={financialInfo.sourceOfFunds}
                onChange={(e) =>
                  setFinancialInfo({
                    ...financialInfo,
                    sourceOfFunds: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          {editingFinancial && (
            <Button type="submit" disabled={savingFinancial}>
              {savingFinancial ? "Saving..." : "Save Data"}
            </Button>
          )}
        </form>
      </section>
    </div>
  );
}
