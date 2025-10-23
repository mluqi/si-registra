import React from "react";
import { useAuth } from "../../context/AuthContext";
import ChangePasswordForm from "./ChangePasswordForm";
import { FaUserCircle, FaEnvelope, FaUserTag } from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center p-8 text-gray-600">
        Memuat informasi pengguna...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
        Profil Pengguna
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Informasi Akun
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <FaUserCircle className="text-blue-500 mr-3 text-2xl" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nama</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.name}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-blue-500 mr-3 text-2xl" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaUserTag className="text-blue-500 mr-3 text-2xl" />
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default Profile;
