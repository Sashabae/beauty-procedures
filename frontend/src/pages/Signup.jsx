import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

import bgImage from "../assets/beauty-office.jpg";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const { data: response } = await axios.post(
        `${API_URL}/users/signup`,
        formData,
        {
          withCredentials: true,
        }
      );
      setError(null);
      navigate("/myservices");
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
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {/* Username Field */}
        <div>
          <label className="label-style">Username</label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
            className="input-style"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Email Field */}
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

        {/* Password Field */}
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

        {/* Confirm Password Field */}
        <div>
          <label className="label-style">Confirm Password</label>
          <input
            type="password"
            {...register("passwordconfirm", {
              required: "Confirm password is required",
            })}
            className="input-style"
          />
          {errors.passwordconfirm && (
            <p className="text-red-500 text-sm">
              {errors.passwordconfirm.message}
            </p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Sign Up
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline hover:text-blue-400"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
