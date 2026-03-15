"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingFinancial, setEditingFinancial] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ").slice(1).join(" ") || "",
    email: session?.user?.email || "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });

  const [financialInfo, setFinancialInfo] = useState({
    citizenship: "",
    taxId: "",
    employmentStatus: "Employed",
    occupation: "",
    employerName: "",
    sourceOfFunds: "",
  });

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Personal Information</h1>
          <button
            onClick={() => setEditingPersonal(!editingPersonal)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            {editingPersonal ? "Cancel" : "Edit"}
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEditingPersonal(false);
          }}
          className="space-y-5"
        >
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
                  setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
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
                  setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
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
                disabled={!editingPersonal}
                value={personalInfo.email}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, email: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="phoneNumber"
                className="text-sm text-muted-foreground"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                disabled={!editingPersonal}
                value={personalInfo.phoneNumber}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    phoneNumber: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
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
                  setPersonalInfo({ ...personalInfo, address: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* File uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">
                Upload your passport, driver&apos;s license or national ID card
              </label>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center">
                <div className="text-muted-foreground mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  PDF up to 2MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  disabled={!editingPersonal}
                >
                  Upload Asset
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">
                Upload a scanned copy or photo of your utility bill
              </label>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center">
                <div className="text-muted-foreground mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  PDF up to 2MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  disabled={!editingPersonal}
                >
                  Upload Asset
                </Button>
              </div>
            </div>
          </div>

          {editingPersonal && (
            <Button type="submit">Save Data</Button>
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEditingFinancial(false);
          }}
          className="space-y-5"
        >
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="taxId" className="text-sm text-muted-foreground">
                Tax ID Number
              </label>
              <input
                type="text"
                id="taxId"
                disabled={!editingFinancial}
                value={financialInfo.taxId}
                onChange={(e) =>
                  setFinancialInfo({ ...financialInfo, taxId: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
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
              <select
                id="employmentStatus"
                disabled={!editingFinancial}
                value={financialInfo.employmentStatus}
                onChange={(e) =>
                  setFinancialInfo({
                    ...financialInfo,
                    employmentStatus: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Retired">Retired</option>
                <option value="Student">Student</option>
              </select>
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {editingFinancial && (
            <Button type="submit">Save Data</Button>
          )}
        </form>
      </section>
    </div>
  );
}
