import { useCart } from "../context/CartContext";
import NavBar from "../Components/NavBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/Supabase";
import toast from "react-hot-toast";

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [pincode, setPincode] = useState("");

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

async function handlePlaceOrder() {
  if (
  !fullName ||
  !phone ||
  !address ||
  !city ||
  !state ||
  !pincode
) {
  toast.error("Please fill in all delivery details.");
  return;
}
  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error("Please login before placing an order.");
    navigate("/login");
    return;
  }

  // Check stock before placing order
  for (const item of cartItems) {
    const { data: product, error } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (error) {
      console.error(error);
     toast.error("Failed to verify stock.");
      return;
    }

    if (product.stock < item.quantity) {
      toast.error(`${item.name} only has ${product.stock} item(s) left in stock.`);
      return;
    }
  }

  // Save order

  // Save order
const { data: orderData, error: orderError } = await supabase
  .from("orders")
  .insert([
    {
      user_id: user.id,
      email: user.email,
      full_name: fullName,
      phone: phone,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
      items: cartItems,
      total: totalPrice,
      status: "Pending",
    },
  ])
  .select()
  .single();

if (orderError) {
  console.error(orderError);
 toast.error("Failed to place order.");
  return;
}

// Save payment
const { error: paymentError } = await supabase
  .from("payments")
  .insert([
    {
      order_id: orderData.id,
      payment_method: paymentMethod,
      payment_status:
        paymentMethod === "Cash on Delivery"
          ? "Pending"
          : "Paid",
      amount: totalPrice,
    },
  ]);

if (paymentError) {
  console.error(paymentError);
}

  // Reduce stock
  for (const item of cartItems) {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    const newStock = product.stock - item.quantity;

    const { error: updateError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", item.id);

    if (updateError) {
      console.error(updateError);
    }
  }

  // Clear cart
  clearCart();

  // Redirect
  navigate("/order-success");
}

  return (
    <>
      <NavBar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">
          Checkout
        </h1>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">
  Delivery Details
</h2>

<div className="grid md:grid-cols-2 gap-4 mb-8">

  <input
    type="text"
    placeholder="Full Name"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    className="border rounded-lg p-3"
  />

  <input
    type="text"
    placeholder="Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="border rounded-lg p-3"
  />

  <textarea
    placeholder="Full Address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    className="border rounded-lg p-3 md:col-span-2"
    rows="3"
  />

  <input
    type="text"
    placeholder="City"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    className="border rounded-lg p-3"
  />

  <input
    type="text"
    placeholder="State"
    value={state}
    onChange={(e) => setState(e.target.value)}
    className="border rounded-lg p-3"
  />

  <input
    type="text"
    placeholder="PIN Code"
    value={pincode}
    onChange={(e) => setPincode(e.target.value)}
    className="border rounded-lg p-3"
  />

</div>

<hr className="mb-8" />
<h2 className="text-2xl font-bold mb-4">
  Payment Method
</h2>

<div className="bg-gray-50 border rounded-lg p-5 mb-8">

  <label className="flex items-center gap-3 mb-3 cursor-pointer">
    <input
      type="radio"
      name="payment"
      value="Cash on Delivery"
      checked={paymentMethod === "Cash on Delivery"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />

    Cash on Delivery
  </label>

  <label className="flex items-center gap-3 mb-3 cursor-pointer">
    <input
      type="radio"
      name="payment"
      value="UPI"
      checked={paymentMethod === "UPI"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />

    UPI
  </label>

  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="payment"
      value="Credit/Debit Card"
      checked={paymentMethod === "Credit/Debit Card"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />

    Credit / Debit Card
  </label>

</div>

          <h2 className="text-2xl font-bold mb-4">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b py-3"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <h3 className="text-2xl font-bold mt-6">
                Total: ₹{totalPrice}
              </h3>

              <button
                onClick={handlePlaceOrder}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                Place Order
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default Checkout;