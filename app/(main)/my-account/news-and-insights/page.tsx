"use client";

import { Newspaper } from "lucide-react";

export default function NewsAndInsightsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">News Insight Center</h1>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Newspaper className="h-10 w-10 mb-3 opacity-40" />
        <p className="text-sm">No Result</p>
        <p className="text-xs mt-1 opacity-60">
          News and insights will appear here
        </p>
      </div>
    </div>
  );
}
