import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        "/auth/register",
        form
      );

      navigate("/");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

        <h1 className="text-3xl font-semibold mb-2">
          Create Account
        </h1>

        <p className="text-zinc-400 mb-8">
          Start your interview preparation journey.
        </p>

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="
            w-full
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            px-4
            py-3
            outline-none
            "
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="
            w-full
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            px-4
            py-3
            outline-none
            "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="
            w-full
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            px-4
            py-3
            outline-none
            "
          />

          <button
            className="
            w-full
            bg-white
            text-black
            py-3
            rounded-xl
            font-medium
            "
          >
            Create Account
          </button>

        </form>

        <p className="mt-6 text-zinc-400 text-center">

          Already have an account?

          <Link
            to="/"
            className="ml-2 text-white"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;