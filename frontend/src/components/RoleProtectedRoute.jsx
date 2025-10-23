import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Jika pengguna tidak memiliki peran yang diizinkan, alihkan ke halaman utama.
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Jika peran diizinkan, tampilkan konten halaman.
  return <Outlet />;
};

export default RoleProtectedRoute;
