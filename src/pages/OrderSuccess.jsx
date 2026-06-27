import NavBar from "../Components/NavBar";
import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <>
      <NavBar />

      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-10 text-center">

          <h1 className="text-5xl mb-4">
            🎉
          </h1>

          <h2 className="text-3xl font-bold mb-4">
            Order Placed Successfully
          </h2>

          <p className="text-gray-600 mb-6">
            Thank you for shopping with us.
          </p>

          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    </>
  );
}

export default OrderSuccess;