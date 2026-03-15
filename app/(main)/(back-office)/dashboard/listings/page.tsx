import { getListings } from "@/lib/actions/listings";
import { getCategories } from "@/lib/actions/categories";
import { ListingsClient } from "@/components/dashboard/listings/listings-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listings | Dashboard",
};

export default async function ListingsPage() {
  const [listings, categories] = await Promise.all([
    getListings(),
    getCategories(),
  ]);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Listings</h1>
      <ListingsClient data={listings} categories={categories} />
    </div>
  );
}
