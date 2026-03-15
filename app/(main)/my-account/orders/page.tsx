import { getUserOrders } from "@/lib/actions/public-orders";
import { UserOrdersList } from "@/components/account/user-orders-list";

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">My Orders</h1>
      <UserOrdersList orders={orders} />
    </div>
  );
}
