import { useEffect, useState } from "react";
import { supabase } from "../lib/Supabase";
import NavBar from "../Components/NavBar";
import toast from "react-hot-toast";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("email", user.email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setOrders(data);
    }

    setLoading(false);
  }
  async function cancelOrder(order) {
    // Restore stock
    for (const item of order.items) {
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (product) {
        await supabase
          .from("products")
          .update({
            stock: product.stock + item.quantity,
          })
          .eq("id", item.id);
      }
    }

    // Update order status
    const { error } = await supabase
      .from("orders")
      .update({
        status: "Cancelled",
      })
      .eq("id", order.id);
if (error) {
  console.error(error);
  toast.error("Failed to cancel order.");
  return;
}

toast.success("Order cancelled successfully!");

    fetchOrders();
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <h2 className="text-center text-2xl mt-20">
          Loading Orders...
        </h2>
      </>
    );
  }

return (
  <>
    <NavBar />

    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          No Orders Found
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow rounded-xl p-6 mb-6"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="font-bold">
                  Status:
                </h2>

                <span
                  className={
                    order.status === "Cancelled"
                      ? "text-red-600 font-semibold"
                      : order.status === "Delivered"
                      ? "text-green-600 font-semibold"
                      : "text-blue-600 font-semibold"
                  }
                >
                  {order.status}
                </span>
              </div>

              <div className="text-right">
                <p className="font-bold">
                  ₹{order.total}
                </p>

                <p className="text-gray-500 text-sm">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <hr className="mb-4" />

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            {(order.status === "Pending" ||
              order.status === "Confirmed") && (
              <>
                <hr className="my-4" />

                <button
                  onClick={() => cancelOrder(order)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  Cancel Order
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  </>
);
}

export default MyOrders;