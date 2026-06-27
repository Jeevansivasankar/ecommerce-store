import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/Supabase";

function Navbar() {
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          ShopHub
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          {user && (
            <>
              <Link to="/orders">
                My Orders
              </Link>

              <Link to="/profile">
                Profile
              </Link>
            </>
          )}

          <Link to="/cart">
            Cart ({cartCount})
          </Link>

          {user ? (
            <>
            <span className="text-lg font-semibold text-blue-600">
  👋 {user.user_metadata?.full_name || user.email}
</span>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
