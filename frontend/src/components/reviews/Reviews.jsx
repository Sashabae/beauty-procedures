import { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "./StarRating";

export default function Reviews({ serviceId, user }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // New review form states
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/reviews/service/${serviceId}?page=${page}&limit=5`
        );
        setReviews(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [serviceId, page]);

  // Reset page to 1 to avoid invalid page
  useEffect(() => {
    setPage(1);
  }, [serviceId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    if (newRating === 0) {
      setError("Please select a rating");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API_URL}/reviews/service/${serviceId}`,
        {
          rating: newRating,
          comment: newComment,
          user_id: user.id,
        },
        { withCredentials: true }
      );

      const newReview = {
        ...res.data.data,
        username: user.username, // Add username from logged user
      };

      setReviews((prev) => [newReview, ...prev]);
      setNewRating(0);
      setNewComment("");
    } catch {
      setError("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(reviewId) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        withCredentials: true,
      });

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete the review.");
    }
  }

  return (
    <section className="pt-10">
      <h2 className="text-2xl font-semibold mb-3">Reviews</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-500 rounded-2xl p-4 mb-4 shadow-sm"
          >
            <div className="flex items-center mb-2 justify-between">
              <span>{review.username}</span>
              <div className="flex gap-7">
                <StarRating rating={review.rating} />
                {user?.id === review.user_id && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-500 text-sm underline cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p className="pl-2 break-words">{review.comment}</p>
          </div>
        ))
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="btn btn-outline disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="btn btn-outline disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="max-w-md space-y-4 mt-6">
          <h3 className="text-xl font-semibold">Write a Review</h3>
          <StarRating rating={newRating} onChange={setNewRating} editable />
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" disabled={submitting} className="submit-button">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </section>
  );
}
