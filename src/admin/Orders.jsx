import { useEffect, useState } from "react";
import { supabase } from "../lib/Supabase";
import Loader from "../Components/Loader";
import toast from "react-hot-toast";
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setOrders(data);
    }

    setLoading(false);
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      toast.error("Failed to update status.");
      return;
    }

    toast.success("Order status updated successfully!");


    fetchOrders();
  }
  async function deleteOrder(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      toast.error("Failed to delete order.");
      return;
    }

    toast.success("Order deleted successfully!");

    fetchOrders();
  }

  if (loading) {
    return <Loader />;
  }
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      (order.full_name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Orders Management
        </h1>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          <input
            type="text"
            placeholder="Search by customer or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-80"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Address</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t"
                >
                  <td className="p-4">
                    <div className="font-semibold">
                      {order.full_name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {order.email}
                    </div>
                  </td>

                  <td className="p-4">
                    {order.phone}
                  </td>

                  <td className="p-4">
                    <div>{order.address}</div>

                    <div className="text-sm text-gray-500">
                      {order.city}, {order.state}
                    </div>

                    <div className="text-sm">
                      {order.pincode}
                    </div>
                  </td>
                  <td className="p-4">
                    ₹{order.total}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white
                    ${order.status === "Pending"
                          ? "bg-yellow-500"
                          : order.status === "Confirmed"
                            ? "bg-blue-500"
                            : order.status === "Packed"
                              ? "bg-indigo-500"
                              : order.status === "Shipped"
                                ? "bg-purple-500"
                                : order.status === "Out for Delivery"
                                  ? "bg-pink-500"
                                  : order.status === "Cancelled"
                                    ? "bg-red-600"
                                    : "bg-green-600"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center">

                    <div className="flex justify-center gap-2">

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                        }
                        className="border rounded px-3 py-2"
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Packed</option>
                        <option>Shipped</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>

                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>

                    </div>

                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default Orders;