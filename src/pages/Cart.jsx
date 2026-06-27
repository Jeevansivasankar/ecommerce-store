import NavBar from "../Components/NavBar";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";


function Cart() {
    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <>
            <NavBar />

            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-8">
                    Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <p className="text-gray-500">
                        Your cart is empty.
                    </p>
                ) : (
                    <>
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white shadow rounded-lg p-4 mb-4 flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="font-bold text-lg">
                                        {item.name}
                                    </h2>

                                    <p>₹{item.price}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <button
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="bg-gray-200 px-3 py-1 rounded"
                                        >
                                            -
                                        </button>

                                        <span className="font-semibold">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => increaseQuantity(item.id)}
                                            className="bg-gray-200 px-3 py-1 rounded"
                                        >
                                            +
                                        </button>
                                    </div>

                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="mt-8 text-2xl font-bold">
                            Total: ₹{totalPrice}
                        </div>
                        <Link
                            to="/checkout"
                            className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
                        >
                            Proceed To Checkout
                        </Link>
                    </>
                )}
            </div>
        </>
    );
}

export default Cart;