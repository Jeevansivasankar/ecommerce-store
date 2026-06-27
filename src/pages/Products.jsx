import { useEffect, useState } from "react";
import { supabase } from "../lib/Supabase";
import ProductCard from "../Components/ProductCard";
import NavBar from "../Components/NavBar";
import Loader from "../Components/Loader";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      console.error(error);
    } else {
      setProducts(data);
    }

    setLoading(false);
  }

const filteredProducts = products.filter((product) => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesPrice =
    (!minPrice || product.price >= Number(minPrice)) &&
    (!maxPrice || product.price <= Number(maxPrice));

  const matchesCategory =
    !selectedCategory || product.category === selectedCategory;

  return matchesSearch && matchesPrice && matchesCategory;
});

  const sortedProducts = [...filteredProducts];

  if (sortOption === "low-high") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sortOption === "high-low") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  if (sortOption === "a-z") {
    sortedProducts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  if (sortOption === "z-a") {
    sortedProducts.sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold mb-8">
            All Products
          </h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 w-full md:w-72"
            />
            <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="border border-gray-300 rounded-lg px-4 py-3"
>
  <option value="">All Categories</option>
  <option value="Keyboard">Keyboard</option>
  <option value="Mouse">Mouse</option>
  <option value="Headset">Headset</option>
  <option value="Speaker">Speaker</option>
  <option value="Accessories">Accessories</option>
  <option value="Laptop">Laptop</option>
</select>

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
            />

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="">Sort By</option>
              <option value="low-high">
                Price Low → High
              </option>
              <option value="high-low">
                Price High → Low
              </option>
              <option value="a-z">
                Name A → Z
              </option>
              <option value="z-a">
                Name Z → A
              </option>
            </select>

          </div>

         {loading ? (
  <Loader />
) : sortedProducts.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              No Products Found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Products;