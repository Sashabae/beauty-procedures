import { useState } from "react";
import axios from "axios";

export default function CreateService({ onClose }) {
  const [serviceData, setServiceData] = useState({
    name: "",
    category: "",
    description: "",
    dates: [],
    duration: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setServiceData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleDatesChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      dates: prevData.dates.map((date) =>
        date.id === parseInt(name) ? { ...date, service_date: value } : date
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", serviceData.name.trim());
      formData.append("category", serviceData.category);
      formData.append("description", serviceData.description);
      formData.append("duration", parseInt(serviceData.duration, 10));

      serviceData.dates.forEach((date) => {
        formData.append("dates", new Date(date.service_date).toISOString());
      });

      if (serviceData.image) {
        formData.append("image", serviceData.image);
      }

      // Debug:
      // for (let [key, val] of formData.entries()) {
      //   console.log(key, val);
      // }

      const response = await axios.post(`${API_URL}/services`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Service created successfully!");
      onClose();
      window.location.reload();

      // console.log("Service created:", response.data.data);

      setServiceData({
        name: "",
        category: "",
        description: "",
        dates: [],
        duration: "",
        image: null,
      });
    } catch (err) {
      console.error("Error creating service:", err.response || err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the service"
      );
    } finally {
      setLoading(false);
    }
  };
  const addDate = () => {
    setServiceData((prevData) => ({
      ...prevData,
      dates: [...prevData.dates, { id: Date.now(), service_date: "" }],
    }));
  };

  const removeDate = (id) => {
    setServiceData((prevData) => ({
      ...prevData,
      dates: prevData.dates.filter((date) => date.id !== id),
    }));
  };

  return (
    <section className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-base-300 p-6 rounded-xl shadow-md w-full max-w-lg overflow-auto max-h-[90vh]">
        <h1 className="text-3xl mb-5">Create New Service</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="label-style">Service Name</label>
            <input
              type="text"
              name="name"
              value={serviceData.name}
              onChange={handleChange}
              className="input-style"
              required
            />
          </div>

          <div className="mb-4">
            <label className="label-style">Category</label>
            <select
              name="category"
              value={serviceData.category}
              onChange={handleChange}
              className="input-style"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="tanning">Tanning</option>
              <option value="massage">Massage</option>
              <option value="waxing">Waxing</option>
              <option value="facials">Facials</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="label-style">Description</label>
            <textarea
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              className="input-style"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="label-style mb-2">Dates</label>
            {serviceData.dates.map((date) => (
              <div key={date.id} className="flex gap-2 mb-2">
                <input
                  type="datetime-local"
                  name={date.id.toString()}
                  value={date.service_date}
                  onChange={handleDatesChange}
                  className="input-style"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeDate(date.id)}
                  className="btn btn-red"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDate}
              className="btn bg-base-100 mb-4"
            >
              Add Date
            </button>
          </div>

          <div className="mb-4">
            <label className="label-style">Service Duration (h)</label>
            <input
              type="number"
              name="duration"
              value={serviceData.duration}
              onChange={handleChange}
              className="input-style"
              required
            />
          </div>

          <div className="mb-4">
            <label className="label-style">Service Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="input-style w-full"
              accept="image/*"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-info font-semibold rounded-md border hover:border-blue-300 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary font-semibold rounded-md border hover:border-blue-300 transition duration-300"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
