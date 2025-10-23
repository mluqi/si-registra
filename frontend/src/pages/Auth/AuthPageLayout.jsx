import React from "react";
import { Outlet } from "react-router-dom";
import { FaDatabase, FaBook } from "react-icons/fa";

const Logo = () => (
  <div className="flex items-center justify-center mb-4">
    {/* Minimal inline logo: circular stack + text */}
    <div className="relative flex items-center space-x-3">
      <img
        src="/icon.png"
        alt="logo-icon"
        className="h-18 bg-blue-600 p-2 rounded-md"
      />{" "}
      <div>
        <h1 className="text-xl font-bold text-slate-700">SI-REGISTRA</h1>
        <p className="text-xs text-slate-400">Sistem Buku Register Digital</p>
        <p className="text-xs text-slate-400">Terintegrasi Pengadilan Negeri</p>
        <p className="text-xs text-slate-400">Singaraja</p>
      </div>
    </div>
  </div>
);

const AuthPageLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-slate-100">
        <Logo />
        {/* Outlet will render the nested route component (Login or Register) */}
        <Outlet />
        <footer className="mt-2 text-center text-xs text-slate-300">
          © {new Date().getFullYear()} SI-REGISTRA
        </footer>
      </div>
    </div>
  );
};

export default AuthPageLayout;
