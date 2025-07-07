// All user registrations + status edit (confirmation)

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchRegistrations() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/registrations?page=${page}&limit=20`,
          {
            withCredentials: true,
          }
        );
        setRegistrations(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (err) {
        setError("Failed to load registrations.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRegistrations();
  }, [page]);

  const handleStatusChange = async (registrationId, newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/registrations/${registrationId}/status`,
        { newStatus: newStatus },
        { withCredentials: true }
      );

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.registration_id === registrationId
            ? { ...reg, status: newStatus }
            : reg
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status. Try again.");
    }
  };

  if (loading) return <p>Loading registrations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (registrations.length === 0) return <p>No registrations found</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl mb-6 text-center">User Registrations</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-base-300">
              <th className="p-2">ID</th>
              <th className="p-2">Username</th>
              <th>Email</th>
              <th>Procedure Name</th>
              <th>Procedure Date</th>
              <th>Status</th>
              <th>Confirm</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(
              ({
                registration_id,
                username,
                email,
                service_name,
                service_date,
                status,
              }) => (
                <tr key={registration_id} className="text-center">
                  <td className="border p-4">{registration_id}</td>
                  <td className="border p-2">{username}</td>
                  <td className="border p-2">{email}</td>
                  <td className="border p-2">{service_name}</td>
                  <td className="border p-2">
                    {new Date(service_date).toLocaleString()}
                  </td>
                  <td className="border p-2 capitalize">{status}</td>
                  <td className="border p-2">
                    {status !== "confirmed" ? (
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleStatusChange(registration_id, "confirmed")
                        }
                      >
                        Confirm
                      </button>
                    ) : (
                      <span className="text-green-500 font-semibold">
                        Confirmed
                      </span>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
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
    </div>
  );
}
