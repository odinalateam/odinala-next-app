import { getPublishedArticles } from "@/lib/actions/articles";
import { ArticleCard } from "@/components/news/article-card";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Insights | Odinala",
  description: "Latest news, insights, and updates from the Odinala team",
};

export default async function PublicNewsPage() {
  const articles = await getPublishedArticles();

  return (
    <main className="max-w-6xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">News & Insights</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Stay updated with the latest from Odinala
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            No articles published yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
