import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/Supabase";

function Dashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState(0);

  const [totalStock, setTotalStock] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    // Products
    const { data: products } = await supabase
      .from("products")
      .select("*");

    if (products) {
      setProductCount(products.length);

      const stock = products.reduce(
        (total, product) => total + product.stock,
        0
      );

      const value = products.reduce(
        (total, product) =>
          total + product.price * product.stock,
        0
      );

      setTotalStock(stock);
      setInventoryValue(value);
      setLowStockProducts(
        products.filter((p) => p.stock <= 5).length
      );
    }

    // Orders
    const { data: orders } = await supabase
      .from("orders")
      .select("*");

    if (orders) {
      setOrderCount(orders.length);

      const totalRevenue = orders.reduce(
        (total, order) => total + order.total,
        0
      );

      setRevenue(totalRevenue);
      setPendingOrders(
        orders.filter((o) => o.status === "Pending").length
      );

      setDeliveredOrders(
        orders.filter((o) => o.status === "Delivered").length
      );

      setCancelledOrders(
        orders.filter((o) => o.status === "Cancelled").length
      );
    }
    // Recent Orders
    const { data: latestOrders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (latestOrders) {
      setRecentOrders(latestOrders);
    }

    // Users
    const { count } = await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      });

    setUserCount(count || 0);
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-blue-600 text-white p-6 shadow">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Products */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-gray-500">
              📦 Total Products
            </h2>

            <p className="text-4xl font-bold mt-3 text-blue-600">
              {productCount}
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-gray-500">
              🛒 Total Orders
            </h2>

            <p className="text-4xl font-bold mt-3 text-green-600">
              {orderCount}
            </p>
          </div>

          {/* Users */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-gray-500">
              👥 Total Users
            </h2>

            <p className="text-4xl font-bold mt-3 text-purple-600">
              {userCount}
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-gray-500">
              💰 Total Revenue
            </h2>

            <p className="text-3xl font-bold mt-3 text-red-600">
              ₹{revenue.toLocaleString()}
            </p>
          </div>

        </div>
        <h2 className="text-2xl font-bold mt-12 mb-6">
          Sales Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

          <div className="bg-yellow-100 rounded-xl p-6 shadow">
            <h3 className="text-yellow-700 font-semibold">
              Pending Orders
            </h3>

            <p className="text-4xl font-bold mt-3">
              {pendingOrders}
            </p>
          </div>

          <div className="bg-green-100 rounded-xl p-6 shadow">
            <h3 className="text-green-700 font-semibold">
              Delivered Orders
            </h3>

            <p className="text-4xl font-bold mt-3">
              {deliveredOrders}
            </p>
          </div>

          <div className="bg-red-100 rounded-xl p-6 shadow">
            <h3 className="text-red-700 font-semibold">
              Cancelled Orders
            </h3>

            <p className="text-4xl font-bold mt-3">
              {cancelledOrders}
            </p>
          </div>

          <div className="bg-purple-100 rounded-xl p-6 shadow">
            <h3 className="text-purple-700 font-semibold">
              Low Stock Products
            </h3>

            <p className="text-4xl font-bold mt-3">
              {lowStockProducts}
            </p>
          </div>

        </div>

        <h2 className="text-2xl font-bold mt-16 mb-6">
          Quick Actions
        </h2>
        {/* Recent Orders */}

        <div className="bg-white rounded-xl shadow mt-10 mb-12 p-6">
          <h2 className="text-2xl font-bold mb-6">
            Recent Orders
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Customer
                </th>

                <th className="text-left">
                  Total
                </th>

                <th className="text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {recentOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan="3"
                    className="py-6 text-center text-gray-500"
                  >
                    No Orders Yet
                  </td>

                </tr>

              ) : (

                recentOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b"
                  >

                    <td className="py-4">
                      {order.email}
                    </td>

                    <td>
                      ₹{order.total}
                    </td>

                    <td>

                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">

                        {order.status}

                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

          <Link
            to="/admin/products"
            className="bg-white shadow rounded-xl p-6 hover:bg-blue-50 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">📦 Products</h3>
            <p className="text-gray-500 mt-2">Manage Products</p>
          </Link>

          <Link
            to="/admin/products/add"
            className="bg-white shadow rounded-xl p-6 hover:bg-green-50 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">➕ Add Product</h3>
            <p className="text-gray-500 mt-2">Create New Product</p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white shadow rounded-xl p-6 hover:bg-yellow-50 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">🛒 Orders</h3>
            <p className="text-gray-500 mt-2">View Orders</p>
          </Link>

          <Link
            to="/admin/inventory"
            className="bg-white shadow rounded-xl p-6 hover:bg-purple-50 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">📋 Inventory</h3>
            <p className="text-gray-500 mt-2">Check Stock</p>
          </Link>
          <Link
  to="/admin/users"
  className="bg-white shadow rounded-xl p-6 hover:bg-indigo-50 hover:shadow-lg transition"
>
  <h3 className="text-xl font-bold">
    👥 Users
  </h3>

  <p className="text-gray-500 mt-2">
    Manage Users
  </p>
</Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;