import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/Supabase";
import toast from "react-hot-toast";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setName(data.name);
    setDescription(data.description);
    setPrice(data.price);
    setStock(data.stock);
    setImageUrl(data.image_url);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image_url: imageUrl,
      })
      .eq("id", id);

    if (error) {
  console.error(error);
  toast.error(error.message);
  return;
}
  toast.success("Product Updated Successfully!");

    navigate("/admin/products");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl"
      >

        <h1 className="text-3xl font-bold mb-6">
          Edit Product
        </h1>

        <input
          type="text"
          className="w-full border p-3 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          rows="4"
          className="w-full border p-3 rounded mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-3 rounded mb-4"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-3 rounded mb-4"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          type="text"
          className="w-full border p-3 rounded mb-6"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Update Product
        </button>

      </form>

    </div>
  );
}

export default EditProduct;