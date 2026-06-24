import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
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

      const res = await api.post(
        "/auth/login",
        form
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Login failed"
      );

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

        <h1 className="text-3xl font-semibold mb-2">
          Welcome Back
        </h1>

        <p className="text-zinc-400 mb-8">
          Sign in to continue.
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
            Sign In
          </button>

        </form>

        <p className="mt-6 text-zinc-400 text-center">

          Don't have an account?

          <Link
            to="/register"
            className="ml-2 text-white"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;