import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/Supabase";
import toast from "react-hot-toast";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

async function handleResetPassword(e) {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  toast.success("Password updated successfully!");

  setTimeout(() => {
    navigate("/login");
  }, 1500);
}

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleResetPassword}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded-lg p-3 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border rounded-lg p-3 mb-6"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;