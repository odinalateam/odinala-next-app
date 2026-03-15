import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Package, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Odinala",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [userCount, listingCount, orderCount, categoryCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.order.count(),
      prisma.category.count(),
    ]);

  const stats = [
    { label: "Total Users", value: userCount, icon: Users },
    { label: "Listings", value: listingCount, icon: Building },
    { label: "Orders", value: orderCount, icon: Package },
    { label: "Categories", value: categoryCount, icon: Tag },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-1 text-sm mb-6">
        Welcome back, {session!.user.name}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
