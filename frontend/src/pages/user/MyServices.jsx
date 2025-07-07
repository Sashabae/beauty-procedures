import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function MyServices() {
  const { user, loading: userLoading } = useContext(UserContext);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/registrations/user/${user.id}`,
          {
            withCredentials: true,
          }
        );
        setRegistrations(response.data.data);
        setError(null);
      } catch (error) {
        setError("Failed to load your services.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRegistrations();
    }
  }, [user]);

  if (userLoading || loading) return <p>Loading your procedures...</p>;
  if (error) return <p>{error}</p>;

  if (registrations.length === 0) {
    return <p>You have no registered procedures yet.</p>;
  }

  const handleCancel = async (regId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.delete(`${API_URL}/registrations/${regId}`, {
        withCredentials: true,
      });

      setRegistrations((prev) => prev.filter((reg) => reg.id !== regId));
    } catch (err) {
      console.error("Cancel failed", err);
      alert("Failed to cancel the booking.");
    }
  };

  const handleChangeDate = async (registrationId, newDateId) => {
    try {
      await axios.patch(
        `${API_URL}/registrations/${registrationId}/date`,
        { newDateId },
        {
          withCredentials: true,
        }
      );
      alert("Date updated!");

      const updated = await axios.get(
        `${API_URL}/registrations/user/${user.id}`,
        {
          withCredentials: true,
        }
      );
      setRegistrations(updated.data.data);
    } catch (err) {
      console.error("Date change failed", err);
      alert("Could not change the booking date.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {registrations.map((reg) => (
        <div
          key={reg.id}
          className="card w-full mx-auto max-w-sm bg-base-100 shadow-2xl hover:border-blue-500 border border-black transition duration-200"
        >
          <Link to={`/services/${reg.service_id}`}>
            <figure>
              <img
                src={`${UPLOADS_URL}/${reg.service_image}`}
                alt={reg.service_name}
                className="w-full h-48 object-cover rounded-t-[0.5rem]"
              />
            </figure>
          </Link>
          <div className="card-body">
            <h2 className="card-title">{reg.service_name}</h2>
            <p>
              {" "}
              Date:{" "}
              {new Date(reg.service_date).toLocaleString(undefined, {
                hour12: false,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
              <select
                className="mt-2 select select-bordered"
                onChange={(e) => handleChangeDate(reg.id, e.target.value)}
                defaultValue=""
              >
                <option disabled value="">
                  Change Date
                </option>
                {reg.available_dates?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {new Date(d.service_date).toLocaleString(undefined, {
                      hour12: false,
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </option>
                ))}
              </select>
            </p>
            <p>
              Status:{" "}
              <span
                className={`font-semibold ${
                  reg.status === "pending"
                    ? "text-orange-500"
                    : reg.status === "confirmed"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {reg.status}
              </span>
            </p>
            {reg.status !== "cancelled" && (
              <button
                className="btn btn-sm btn-error mt-4"
                onClick={() => handleCancel(reg.id)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
