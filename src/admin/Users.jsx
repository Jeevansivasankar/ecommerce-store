import { useEffect, useState } from "react";
import { supabase } from "../lib/Supabase";
import toast from "react-hot-toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setUsers(data);
  }
  async function deleteUser(id, name) {
    const confirmDelete = window.confirm(
      `Delete ${name}?`
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      toast.error("Failed to delete user.");
      return;
    }

    toast.success("User deleted successfully!");

    fetchUsers();
  }

  const filteredUsers = users.filter((user) => {
    const name = (user.full_name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();

    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">
        Users Management
      </h1>

      <input
        type="text"
        placeholder="Search Users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-3 mb-6 w-80"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">

                <td className="p-4">
                  {user.full_name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.role}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteUser(user.id, user.full_name)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Users;