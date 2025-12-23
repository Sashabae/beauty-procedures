import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { useNavigate, Link } from "react-router";

import bgImage from "../assets/beauty-surgery.jpg";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [error, setError] = useState(null);

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const { data: response } = await axios.post(
        `${API_URL}/users/login`,
        formData,
        {
          withCredentials: true,
        }
      );

      setUser(response.data);
      setError(null);
      navigate("/services");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message || "An error occurred.");
        } else if (error.request) {
          setError("No response from the server.");
        } else {
          setError("Something went wrong.");
        }
      } else {
        setError("An error occurred.");
      }
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 bg-base-200 rounded-lg shadow-lg w-full sm:w-96 border border-blue-600"
      >
        <h2 className="text-3xl font-bold text-center">Login</h2>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <div>
          <label className="label-style">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input-style"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="label-style">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="input-style"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:underline hover:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
