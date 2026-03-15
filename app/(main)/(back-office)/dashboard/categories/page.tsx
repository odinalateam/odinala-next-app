import { getCategories } from "@/lib/actions/categories";
import { CategoriesClient } from "@/components/dashboard/categories/categories-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Dashboard",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Categories</h1>
      <CategoriesClient data={categories} />
    </div>
  );
}
