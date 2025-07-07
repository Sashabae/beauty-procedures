// Page with details of a procedure with it's reviews and booking

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import Reviews from "../../components/reviews/Reviews";
import StarRating from "../../components/reviews/StarRating";
import ServiceBooking from "../../components/services/ServiceBooking";

const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function ServiceDetails() {
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await axios.get(`${API_URL}/services/${id}`);
        setService(res.data.data);
      } catch (error) {
        console.error("Failed to load service details", error);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id]);

  const handleBooked = async () => {
    try {
      const res = await axios.get(`${API_URL}/services/${id}`);
      setService(res.data.data);
    } catch (error) {
      console.error("Failed to refresh service data", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      await axios.delete(`${API_URL}/services/${id}`, {
        withCredentials: true,
      });
      alert("Service deleted successfully");
      navigate("/services");
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete the service");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!service) return <p>Procedure not found</p>;

  return (
    <>
      <section>
        <h1 className="text-4xl pb-10 text-center">{service.name}</h1>
        <figure className="p-5 flex justify-center">
          <img
            src={`${UPLOADS_URL}/${service.image}`}
            alt="Service image"
            className="w-120 h-72 object-cover rounded"
          />
        </figure>
        <div className="flex flex-col gap-5 text-lg">
          {service.dates && (
            <div className="mt-4">
              <p className="text-xl">Dates:</p>
              <p className="text-xs mb-2">(Month/Day/Year)</p>
              {service.dates.length === 0 ? (
                <p>No available dates for this procedure</p>
              ) : (
                <ul className="list-disc list-inside">
                  {service.dates.map((date) => (
                    <li key={date.id}>
                      {new Date(date.service_date).toLocaleString(undefined, {
                        hour12: false,
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <p>Category: {service.category}</p>
          <p>Duration: {service.duration}h</p>
          <div className="flex flex-col gap-1">
            <p>Rating:</p>
            <StarRating rating={service.average_rating} />
          </div>
          <p className="break-words">Description: {service.description}</p>
        </div>
      </section>

      {/* Edit and Delete if user is admin */}
      {user?.role === "admin" && (
        <div className="flex justify-center pt-4 gap-4">
          <button
            onClick={() => navigate(`/services/edit/${id}`)}
            className="btn btn-primary"
          >
            Edit Procedure
          </button>
          <button onClick={handleDelete} className="btn btn-error">
            Delete Procedure
          </button>
        </div>
      )}

      <Reviews serviceId={id} user={user} />

      <section className="pt-10">
        <button
          className="py-2 mt-4 font-semibold rounded-md border transition duration-300 btn btn-info"
          onClick={() => {
            if (!user) {
              navigate("/login");
            } else {
              setShowModal(true);
            }
          }}
        >
          Book this procedure
        </button>

        {showModal && service?.dates?.length > 0 && (
          <ServiceBooking
            serviceId={service.id}
            dates={service.dates}
            onClose={() => setShowModal(false)}
            onBooked={handleBooked}
          />
        )}
      </section>
    </>
  );
}
