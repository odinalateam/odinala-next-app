export interface ListingSearchParams {
  q?: string;
  developmentStatus?: string;
  purchaseType?: string;
  features?: string;
  minPrice?: string;
  maxPrice?: string;
}

export type PropertyType = "Property" | "Land";
export type PurchaseType = "recurring_plan" | "one_off";
export type DevelopmentStatus = "ongoing" | "completed" | "uncompleted";
export type PaymentOption = "outright" | "installment";
export type OrderStatus = "Pending" | "Approved" | "Rejected" | "Completed";

export interface Property {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  address: string;
  type: PropertyType;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size: number;
  features: string[];
  images: string[];
  documents: string[];
  status: "Available" | "Sold" | "Under Offer";
  purchaseType: PurchaseType;
  developmentStatus: DevelopmentStatus;
  planStatus?: string | null;
  maxInstallment?: number | null;
  pricePerInstallment?: number | null;
  category?: { id: string; name: string; type: string } | null;
}

// Dashboard types using Prisma models
import type {
  User,
  UserProfile,
  Listing,
  Order,
  Category,
} from "@prisma/client";

export type UserWithProfile = User & {
  profile: UserProfile | null;
};

export type OrderWithRelations = Order & {
  user: User;
  listing: Listing;
};

export type OrderWithFullRelations = Order & {
  user: UserWithProfile;
  listing: Listing;
};

export type ListingWithCategory = Listing & {
  category: Category | null;
};

export type { User, UserProfile, Listing, Order, Category };
