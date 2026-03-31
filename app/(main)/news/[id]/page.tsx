import { getArticleById } from "@/lib/actions/articles";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Odinala News`,
    description: article.content.slice(0, 160),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article || article.status !== "published") {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto w-full px-4 py-8">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-64 sm:h-80 object-cover rounded-xl mb-6"
        />
      )}

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
        {article.title}
      </h1>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {article.author}
        </span>
        {article.publishedAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      <div className="prose prose-sm max-w-none dark:prose-invert">
        {article.content.split("\n").map((paragraph, i) =>
          paragraph.trim() ? (
            <p key={i}>{paragraph}</p>
          ) : (
            <br key={i} />
          )
        )}
      </div>
    </main>
  );
}
