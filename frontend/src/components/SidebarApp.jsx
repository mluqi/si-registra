import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaCopy,
  FaBookOpen,
  FaCertificate,
  FaFileSignature,
  FaStamp,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaSignOutAlt,
  FaDatabase,
} from "react-icons/fa";
import { HiChartBar } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

const SidebarApp = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-100 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 bottom-0 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className=" border-b mt-24">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            {isCollapsed ? (
              <FaChevronRight size={18} />
            ) : (
              <FaChevronLeft size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink to="/" className={navLinkClasses} end>
          <FaTachometerAlt className="flex-shrink-0" size={20} />
          <span className={`ml-3 ${isCollapsed && "hidden"}`}>Dashboard</span>
        </NavLink>

        <NavLink to="/register-warmeking" className={navLinkClasses}>
          <FaFileAlt className="flex-shrink-0" size={20} />
          <span className={`ml-3 ${isCollapsed && "hidden"}`}>
            Register Warmeking
          </span>
        </NavLink>

        <NavLink
          to="/register-surat-kuasa-insidentil"
          className={navLinkClasses}
        >
          <FaBookOpen className="flex-shrink-0" size={20} />
          <span className={`ml-3 ${isCollapsed && "hidden"}`}>
            SK Insidentil
          </span>
        </NavLink>

        <NavLink to="/register-surat-kuasa-khusus" className={navLinkClasses}>
          <FaFileSignature className="flex-shrink-0" size={20} />
          <span className={`ml-3 ${isCollapsed && "hidden"}`}>SK Khusus</span>
        </NavLink>

        <NavLink
          to="/register-surat-keterangan-tidak-dipidana"
          className={navLinkClasses}
        >
          <FaCertificate className="flex-shrink-0" size={20} />
          <span className={`ml-3 ${isCollapsed && "hidden"}`}>
            SK Tidak Dipidana
          </span>
        </NavLink>

        <NavLink to="/register-surat-legalisasi" className={navLinkClasses}>
          <FaStamp className="flex-shrink-0" size={20} />
          <span className={`ml-3 ${isCollapsed && "hidden"}`}>
            Surat Legalisasi
          </span>
        </NavLink>

        <NavLink to="/salinan-putusan" className={navLinkClasses}>
          <FaCopy className="flex-shrink-0" size={20} />
          <span className={`ml-3 ${isCollapsed && "hidden"}`}>
            Salinan Putusan
          </span>
        </NavLink>

        <NavLink to="/laporan" className={navLinkClasses}>
          <HiChartBar className="flex-shrink-0" size={20} />
          <span className={`ml-3 ${isCollapsed && "hidden"}`}>
            Laporan Register
          </span>
        </NavLink>

        {user && (user.role === "admin" || user.role === "superadmin") && (
          <>
            <NavLink to="/daftar-data" className={navLinkClasses}>
              <FaDatabase className="flex-shrink-0" size={20} />
              <span className={`ml-3 ${isCollapsed && "hidden"}`}>
                Daftar Data
              </span>
            </NavLink>
            <NavLink to="/users" className={navLinkClasses}>
              <FaUsers className="flex-shrink-0" size={20} />
              <span className={`ml-3 ${isCollapsed && "hidden"}`}>
                Pengguna
              </span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Info & Logout Section */}
      <div className="border-t border-gray-200">
        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 bg-gray-50">
            <NavLink
              to="/profile"
              className="block p-2 -m-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FaUserCircle
                  className="text-gray-500 flex-shrink-0"
                  size={32}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user ? user.name : "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user ? user.role : "Role"}
                  </p>
                </div>
              </div>
            </NavLink>
            <button
              onClick={logout}
              className="w-full mt-3 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
            >
              <FaSignOutAlt className="mr-2" size={16} />
              Logout
            </button>
          </div>
        )}

        {/* Collapsed User Info */}
        {isCollapsed && (
          <div className="p-4 flex flex-col items-center space-y-2">
            <NavLink
              to="/profile"
              className="block p-2 -m-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaUserCircle className="text-gray-500 " size={32} />
            </NavLink>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-2 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarApp;
