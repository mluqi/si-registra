import React, { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ChangePasswordForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({
    type: "", // 'success' or 'error'
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (formData.newPassword !== formData.confirmNewPassword) {
      setStatus({ type: "error", message: "Kata sandi baru tidak cocok." });
      return;
    }
    if (formData.newPassword.length < 6) {
      setStatus({
        type: "error",
        message: "Kata sandi baru minimal 6 karakter.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Asumsi ada endpoint di backend untuk mengganti password
      // Endpoint ini membutuhkan userId, currentPassword, dan newPassword
      await api.put(`/users/change-password/${user.id}`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setStatus({ type: "success", message: "Kata sandi berhasil diubah!" });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Gagal mengubah kata sandi. Pastikan kata sandi lama benar.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Ganti Kata Sandi
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {status.message && (
          <div
            className={`p-3 rounded-md text-sm ${
              status.type === "success"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kata Sandi Lama
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kata Sandi Baru
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Mengubah..." : "Ubah Kata Sandi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
