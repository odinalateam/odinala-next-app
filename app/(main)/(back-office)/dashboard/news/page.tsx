import { getArticles } from "@/lib/actions/articles";
import { NewsClient } from "@/components/dashboard/news/news-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Insights | Dashboard",
};

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">News & Insights</h1>
      <NewsClient data={articles} />
    </div>
  );
}
