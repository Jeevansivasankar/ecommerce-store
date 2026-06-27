import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/Supabase";
import toast from "react-hot-toast";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset(e) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

   if (error) {
  console.error(error);
  toast.error(error.message);
  return;
}

   toast.success("Password reset link sent!");
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        <p className="text-gray-600 text-center mb-5">
          Enter your registered email to receive a password reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border rounded-lg p-3 mb-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="text-green-600 mt-4 text-center">
            {message}
          </p>
        )}

        <p className="text-center mt-5">
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;