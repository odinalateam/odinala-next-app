import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { ListingWithCategory } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const gradients = [
  "from-emerald-400 to-cyan-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-blue-400 to-indigo-500",
  "from-teal-400 to-emerald-500",
  "from-fuchsia-400 to-purple-500",
  "from-sky-400 to-blue-500",
  "from-lime-400 to-green-500",
  "from-orange-400 to-red-500",
  "from-cyan-400 to-teal-500",
];

interface PropertyCardProps {
  property: ListingWithCategory;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const hasImage = property.images.length > 0;
  const gradientIndex =
    Math.abs(property.id.charCodeAt(0)) % gradients.length;

  return (
    <Link href={`/properties/${property.id}`} className="group">
      {hasImage ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-4 left-4 text-white/80 text-xs font-medium bg-black/20 rounded-full px-2.5 py-1">
            {property.type}
          </span>
        </div>
      ) : (
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br ${gradients[gradientIndex]} flex items-end p-4`}
        >
          <span className="text-white/80 text-xs font-medium bg-black/20 rounded-full px-2.5 py-1">
            {property.type}
          </span>
        </div>
      )}

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-medium text-sm text-foreground group-hover:underline truncate">
            {property.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{property.location}</span>
          </p>
        </div>
        <p className="text-sm font-medium text-foreground whitespace-nowrap">
          {formatPrice(property.price)}
        </p>
      </div>
    </Link>
  );
}
