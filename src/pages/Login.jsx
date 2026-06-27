import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/Supabase";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkLogin();
  }, []);

 
  useEffect(() => {
  checkLogin();
}, []);

async function checkLogin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  const user = session.user;

  const { data } = await supabase
    .from("admins")
    .select("*")
    .eq("email", user.email)
    .single();

  if (data) {
    navigate("/admin");
  } else {
    navigate("/");
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  toast.success("Login successful!");

  const user = data.user;

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("email", user.email)
    .single();

  if (admin) {
    navigate("/admin");
  } else {
    navigate("/");
  }
}

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          Login
        </button>

        <p className="text-center mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold"
          >
            Register
          </Link>
        </p>

        <p className="text-center mt-3">
          <Link
            to="/forgot-password"
            className="text-red-500"
          >
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;