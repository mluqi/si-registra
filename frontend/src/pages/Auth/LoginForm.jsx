import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by AuthContext
    } catch (err) {
      setError(
        err.response?.data?.message || "Login gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-700">
          Selamat Datang
        </h2>
        <p className="text-sm text-slate-400">
          Masuk untuk melanjutkan ke SI-REGISTRA
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-rose-50 p-3 text-center text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white placeholder-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white placeholder-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent shadow-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-transform disabled:opacity-60"
        aria-busy={loading}
      >
        {loading ? "Memuat..." : "Masuk"}
      </button>
    </form>
  );
};

export default LoginForm;
