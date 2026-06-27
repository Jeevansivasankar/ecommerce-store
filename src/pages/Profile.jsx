import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/Supabase";
import Navbar from "../Components/NavBar";
import toast from "react-hot-toast";

function Profile() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getProfile();
    }, []);

async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Logged in user:", user);

  if (!user) {
    navigate("/login");
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  console.log("Profile:", data);
  console.log("Error:", error);

  if (error) {
    toast.error(error.message);
    setLoading(false);
    return;
  }

  setFullName(data.full_name || "");
  setEmail(data.email || "");
  setPhone(data.phone || "");
  setAddress(data.address || "");

  setLoading(false);
}
async function updateProfile(e) {
  e.preventDefault();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      address,
    })
    .eq("id", user.id);

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });

  toast.success("Profile updated successfully!");
}
  async function changePassword() {
  if (!newPassword) {
    toast.error("Enter a new password.");
    return;
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  setNewPassword("");
  toast.success("Password updated successfully!");
  setMessage("✅ Password updated successfully!");
}
    async function logout() {
        await supabase.auth.signOut();
        navigate("/login");
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Loading...
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">

                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                        {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                    </div>

                    <h1 className="text-4xl font-bold text-center mb-8">
                        My Profile
                    </h1>

                    {message && (
                        <div className="mb-6 bg-green-100 text-green-700 p-3 rounded-lg text-center">
                            {message}
                        </div>
                    )}

                    <form onSubmit={updateProfile}>

                        <label className="block font-semibold mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border rounded-lg p-3 mb-6"
                        />

                        <label className="block font-semibold mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full border rounded-lg p-3 mb-6 bg-gray-100"
                        />
                        <label className="block font-semibold mb-2">
                            Phone
                        </label>

                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border rounded-lg p-3 mb-6"
                        />
                        <label className="block font-semibold mb-2">
                            Address
                        </label>

                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border rounded-lg p-3 mb-6"
                            rows={3}
                        />

                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                        >
                            Update Profile
                        </button>

                    </form>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-bold mb-4">
                        Change Password
                    </h2>

                    <input
                        type="password"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border rounded-lg p-3 mb-4"
                    />

                    <button
                        onClick={changePassword}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                    >
                        Change Password
                    </button>

                    <hr className="my-8" />

                    <button
                        onClick={logout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </>
    );
}

export default Profile;