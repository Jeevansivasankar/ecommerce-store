import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
function handleAddToCart(e) {
  e.stopPropagation();

  if (product.stock <= 0) {
    toast.error("This product is out of stock!");
    return;
  }

  addToCart(product);
  toast.success("Product added to cart!");
}

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
    >
      <img
        src={
          product.image_url ||
          "https://via.placeholder.com/300x200"
        }
        alt={product.name}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        <p className="text-sm text-blue-600 font-medium mb-1">
          {product.category}
        </p>

        <h2 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h2>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-blue-600">
            ₹{product.price}
          </span>

          {product.stock > 0 ? (
            <span className="text-green-600 font-semibold">
              Stock: {product.stock}
            </span>
          ) : (
            <span className="text-red-600 font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full mt-4 py-2 rounded-lg text-white transition ${
            product.stock > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;