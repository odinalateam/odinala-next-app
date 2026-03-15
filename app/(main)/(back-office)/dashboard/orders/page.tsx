import { getOrders } from "@/lib/actions/orders";
import { OrdersClient } from "@/components/dashboard/orders/orders-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Dashboard",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Orders</h1>
      <OrdersClient data={orders} />
    </div>
  );
}
