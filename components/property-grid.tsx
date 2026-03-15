import type { ListingWithCategory } from "@/lib/types";
import { PropertyCard } from "@/components/property-card";

interface PropertyGridProps {
  properties: ListingWithCategory[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
