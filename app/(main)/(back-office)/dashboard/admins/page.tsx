import { getAdmins } from "@/lib/actions/admin-users";
import { AdminsClient } from "@/components/dashboard/admins/admins-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admins | Dashboard",
};

export default async function AdminsPage() {
  const admins = await getAdmins();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Admins</h1>
      <AdminsClient data={admins} />
    </div>
  );
}
