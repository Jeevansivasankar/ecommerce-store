import { useEffect, useState } from "react";
import { supabase } from "../lib/Supabase";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";

function Inventory() {
  const [selectedProduct, setSelectedProduct] = useState(null);
const [newStock, setNewStock] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
    } else {
      setProducts(data);
    }

    setLoading(false);
  }
  function openUpdateModal(product) {
    setSelectedProduct(product);
    setNewStock(product.stock);
  }

  async function updateStock() {
    const { error } = await supabase
      .from("products")
      .update({
        stock: Number(newStock),
      })
      .eq("id", selectedProduct.id);

    if (error) {
  console.error(error);
  toast.error("Failed to update stock.");
  return;
}

    toast.success("Stock updated successfully!");

    setSelectedProduct(null);

    fetchProducts();
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = products.length;

  const inStock = products.filter(
    (p) => p.stock > 5
  ).length;

  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= 5
  ).length;

  const outOfStock = products.filter(
    (p) => p.stock === 0
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-2">
        Inventory
      </h1>

      <p className="text-gray-500 mb-8">
        Manage product inventory
      </p>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Total Products
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {totalProducts}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-green-600">
            In Stock
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {inStock}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-yellow-600">
            Low Stock
          </p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-3">
            {lowStock}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-red-600">
            Out Of Stock
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">
            {outOfStock}
          </h2>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Inventory List
          </h2>

          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-72"
          />

        </div>

        {loading ? (
          <Loader/>
        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Product
                </th>

                <th className="text-left">
                  Category
                </th>

                <th className="text-left">
                  Price
                </th>

                <th className="text-left">
                  Stock
                </th>

                <th className="text-left">
                  Status
                </th>

                <th className="text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.map((product) => (

                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-4 flex items-center gap-3">

                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />

                    {product.name}

                  </td>

                  <td>
                    {product.category}
                  </td>

                  <td>
                    ₹{product.price}
                  </td>

                  <td>
                    {product.stock}
                  </td>

                  <td>

                    {product.stock === 0 ? (

                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                        Out of Stock
                      </span>

                    ) : product.stock <= 5 ? (

                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Low Stock
                      </span>

                    ) : (

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        In Stock
                      </span>

                    )}

                  </td>

                  <td>

                    <button
                      onClick={() => openUpdateModal(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Update Stock
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white p-8 rounded-xl w-96">

            <h2 className="text-2xl font-bold mb-6">
              Update Stock
            </h2>

            <p className="mb-2 font-semibold">
              {selectedProduct.name}
            </p>

            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="border rounded-lg w-full p-3 mb-6"
            />

            <div className="flex gap-3">

              <button
                onClick={updateStock}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Save
              </button>

              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Inventory;