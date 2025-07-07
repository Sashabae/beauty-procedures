import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
    dates: [],
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await axios.get(`${API_URL}/services/${id}`);
        const data = res.data.data;

        setService({
          name: data.name,
          description: data.description,
          category: data.category,
          duration: data.duration,
          dates: data.dates,
          image: data.image || "",
        });
      } catch (err) {
        setError("Failed to load service data");
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id]);

  // Handle normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  // Handle individual date change
  const handleDateChange = (e) => {
    const { name, value } = e.target; // name is id of the date item
    setService((prev) => ({
      ...prev,
      dates: prev.dates.map((date) =>
        date.id === Number(name) ? { ...date, service_date: value } : date
      ),
    }));
  };

  // Add a new date field
  const addDate = () => {
    setService((prev) => ({
      ...prev,
      dates: [...prev.dates, { id: Date.now(), service_date: "" }],
    }));
  };

  // Remove a date field
  const removeDate = (id) => {
    setService((prev) => ({
      ...prev,
      dates: prev.dates.filter((date) => date.id !== id),
    }));
  };

  // Handle image file change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit PATCH request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", service.name.trim());
      formData.append("description", service.description);
      formData.append("category", service.category);
      formData.append("duration", service.duration);

      service.dates.forEach((date) => {
        formData.append("dates", new Date(date.service_date).toISOString());
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await axios.patch(`${API_URL}/services/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("Service updated successfully");
      navigate(`/services/${id}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to update the service. Please try again."
      );
    }
  };

  if (loading) return <p>Loading procedure data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl mb-4">Edit Procedure</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        encType="multipart/form-data"
      >
        <label>
          Name:
          <input
            name="name"
            value={service.name}
            onChange={handleChange}
            required
            className="input-style"
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={service.description}
            onChange={handleChange}
            required
            className="textarea input-style"
          />
        </label>

        <label>
          Category:
          <select
            name="category"
            value={service.category}
            onChange={handleChange}
            required
            className="input-style"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="tanning">Tanning</option>
            <option value="massage">Massage</option>
            <option value="waxing">Waxing</option>
            <option value="facials">Facials</option>
          </select>
        </label>

        <label>
          Duration (hours):
          <input
            name="duration"
            type="number"
            value={service.duration}
            onChange={handleChange}
            required
            className="input-style"
          />
        </label>

        <label>
          Dates:
          {service.dates.map((date) => (
            <div key={date.id} className="flex gap-2 items-center mb-2">
              <input
                type="datetime-local"
                name={date.id.toString()}
                value={date.service_date}
                onChange={handleDateChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => removeDate(date.id)}
                className="btn btn-error"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDate}
            className="btn btn-primary mb-4"
          >
            Add Date
          </button>
        </label>

        <label>
          Image:
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mt-1"
          />
        </label>

        {/* Show current image only if no new file selected */}
        {service.image && !imageFile && (
          <img
            src={`${UPLOADS_URL}/${service.image}`}
            alt="Current procedure"
            className="w-48 h-32 object-cover mt-2 rounded"
          />
        )}

        <button type="submit" className="submit-button">
          Update Procedure
        </button>
      </form>
    </section>
  );
}
