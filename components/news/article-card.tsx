import Link from "next/link";
import { Calendar, User } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  author: string;
  publishedAt: Date | null;
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/news/${article.id}`}
      className="group rounded-xl border bg-card overflow-hidden transition-colors hover:border-primary/20"
    >
      {article.coverImage ? (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">No image</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.content}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {article.author}
          </span>
          {article.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
