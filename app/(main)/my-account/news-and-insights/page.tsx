import { ArticleCard } from "@/components/news/article-card";
import { getPublishedArticles } from "@/lib/actions/articles";
import { Newspaper } from "lucide-react";

export default async function NewsAndInsightsPage() {
  const articles = await getPublishedArticles();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">News Insight Center</h1>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Newspaper className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No Result</p>
          <p className="text-xs mt-1 opacity-60">
            News and insights will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
