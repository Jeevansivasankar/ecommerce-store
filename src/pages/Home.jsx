import { useEffect, useState } from "react";
import { supabase } from "../lib/Supabase";
import Navbar from "../Components/NavBar";

import ProductCard from "../Components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
    checkUser();
  }, []);

  async function fetchFeaturedProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(4);

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  }

  async function checkUser() {
    const { data, error } = await supabase.auth.getUser();

    console.log("USER:", data.user);
    console.log("ERROR:", error);
  }
 

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Shop Smart, Shop Better
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Discover amazing products at unbeatable prices.
          </p>

          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-10">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <div className="text-center text-gray-500">
            No Products Available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-3">
                Fast Delivery
              </h3>

              <p className="text-gray-600">
                Quick and reliable delivery across the country.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-3">
                Secure Payments
              </h3>

              <p className="text-gray-600">
                Safe and trusted payment experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-3">
                Premium Quality
              </h3>

              <p className="text-gray-600">
                Carefully selected products with top quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-6 text-center">
        <p>© 2026 ShopHub. All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default Home;