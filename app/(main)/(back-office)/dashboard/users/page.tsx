import { getUsers } from "@/lib/actions/admin-users";
import { UsersClient } from "@/components/dashboard/users/users-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users | Dashboard",
};

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Users</h1>
      <UsersClient data={users} />
    </div>
  );
}
