import { getLeads } from "@/lib/actions/leads";
import { LeadsClient } from "@/components/dashboard/leads/leads-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads | Dashboard",
};

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Scored across 5 categories — location, signup source, profile completeness, budget, and email domain.
        </p>
      </div>
      <LeadsClient data={leads} />
    </div>
  );
}
