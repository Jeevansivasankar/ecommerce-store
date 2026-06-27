import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/Supabase";
import toast from "react-hot-toast";

function AddProduct() {
  const navigate = useNavigate();
const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) {
     toast.error("Please select an image.");
      return;
    }

    const fileName = `${Date.now()}-${image.name}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, image);

    if (uploadError) {
     toast.error(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from("products")
      .insert([
        {
          name,
          category,
          description,
          price: Number(price),
          stock: Number(stock),
          image_url: publicUrl,
        },
      ]);

    if (error) {
      toast.error(error.message);
      return;
    }

  toast.success("Product Added Successfully!");

    navigate("/admin/products");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl"
      >
        <h1 className="text-3xl font-bold mb-6">
          Add Product
        </h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full border p-3 rounded mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full border p-3 rounded mb-4"
  required
>
  <option value="">Select Category</option>
  <option>Electronics</option>
  <option>Fashion</option>
  <option>Home</option>
  <option>Books</option>
  <option>Sports</option>
  <option>Accessories</option>
</select>

          <label className="block font-semibold mb-2">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border p-3 rounded"
            required
          />

        </div>

        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded mb-4"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border p-3 rounded mb-4"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Stock"
          className="w-full border p-3 rounded mb-4"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />



        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>

      </form>

    </div>
  );
}

export default AddProduct;  