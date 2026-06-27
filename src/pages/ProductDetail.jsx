import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/Supabase";
import NavBar from "../Components/NavBar";
import toast from "react-hot-toast";

function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
        getUser();
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

        setProduct(data);
        setLoading(false);
    }
    async function getUser() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        setUser(user);
    }
    async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  setUser(user);
}

// 👇 ADD THIS HERE
async function fetchReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setReviews(data);
}


    async function submitReview() {
        if (!user) {
            toast.error("Please login first.");
            return;
        }

        if (!comment.trim()) {
            toast.error("Please write a review.");
            return;
        }

        const { error } = await supabase
            .from("reviews")
            .insert([
                {
                    product_id: id,
                    user_id: user.id,
                    user_name:
                        user.user_metadata?.full_name || user.email,
                    rating,
                    comment,
                },
            ]);

        if (error) {
            console.error(error);
            toast.error(error.message);
            return;
        }

        toast.success("Review submitted successfully!");

        setComment("");
        setRating(5);

        fetchReviews();
    }
    async function deleteReview(reviewId) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", reviewId);

        if (error) {
            console.error(error);
            toast.error("Failed to delete review.");
            return;
        }

        toast.success("Review deleted successfully!");
        fetchReviews();
    }

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="text-center mt-20 text-xl">
                    Loading Product...
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />

            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid md:grid-cols-2 gap-10">

                    <div>
                        <img
                            src={
                                product.image_url ||
                                "https://via.placeholder.com/600x400?text=Product"
                            }
                            alt={product.name}
                            className="w-full rounded-xl shadow-lg"
                        />
                    </div>

                    <div>
                        <h1 className="text-4xl font-bold mb-4">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 mb-6">
                            {product.description}
                        </p>

                        <h2 className="text-3xl font-bold text-blue-600 mb-4">
                            ₹{product.price}
                        </h2>

                        <p className="mb-6 text-lg">
                            Stock Available: {product.stock}
                        </p>

                        <button
                            onClick={() => addToCart(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
                        >
                            Add To Cart
                        </button>
                    </div>
                    <hr className="my-12" />

                    <h2 className="text-3xl font-bold mb-6">
                        Customer Reviews
                    </h2>

                    {user && (
                        <div className="bg-gray-100 rounded-xl p-6 mb-10">

                            <h3 className="text-xl font-semibold mb-4">
                                Write a Review
                            </h3>

                            <select
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                className="border rounded-lg p-3 mb-4 w-full"
                            >
                                <option value={5}>★★★★★ (5)</option>
                                <option value={4}>★★★★☆ (4)</option>
                                <option value={3}>★★★☆☆ (3)</option>
                                <option value={2}>★★☆☆☆ (2)</option>
                                <option value={1}>★☆☆☆☆ (1)</option>
                            </select>

                            <textarea
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your review..."
                                className="border rounded-lg w-full p-3 mb-4"
                            />

                            <button
                                onClick={submitReview}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                            >
                                Submit Review
                            </button>

                        </div>
                    )}

                    {reviews.length === 0 ? (

                        <p className="text-gray-500">
                            No reviews yet.
                        </p>

                    ) : (

                        reviews.map((review) => (

                            <div
                                key={review.id}
                                className="bg-white rounded-xl shadow p-6 mb-4"
                            >
                                <div className="flex justify-between items-center">

                                    <div>
                                        <h3 className="font-bold">
                                            {review.user_name}
                                        </h3>

                                        <span className="text-yellow-500">
                                            {"⭐".repeat(review.rating)}
                                        </span>
                                    </div>

                                    {user?.id === review.user_id && (
                                        <button
                                            onClick={() => deleteReview(review.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    )}

                                </div>


                                <p className="text-gray-600 mt-3">
                                    {review.comment}
                                </p>

                                <p className="text-sm text-gray-400 mt-4">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </p>

                            </div>

                        ))

                    )}
                </div>
            </div>
        </>
    );
}

export default ProductDetail;