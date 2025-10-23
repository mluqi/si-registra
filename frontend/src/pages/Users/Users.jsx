import React, { useState, useEffect } from "react";
import api from "../../services/api";
import UserFormModal from "./UserFormModal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalError, setModalError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Endpoint diubah dari /auth/users menjadi /users
      const { data } = await api.get("/users");
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data pengguna. Anda mungkin tidak memiliki izin.");
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // No client-side search: render full users list

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
    setModalError("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingUser) {
        // Edit mode
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        // Create mode
        await api.post("/users", formData);
      }
      handleCloseModal();
      fetchUsers(); // Refresh data
    } catch (err) {
      setModalError(err.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  const handleDelete = async (userId, userName) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus pengguna "${userName}"?`
      )
    ) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers(); // Refresh data
      } catch (err) {
        setError(err.response?.data?.message || "Gagal menghapus pengguna.");
      }
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        Memuat data pengguna...
      </div>
    );
  }

  if (error) {
    return <div className="py-8 text-center text-rose-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-slate-700">
            Manajemen Pengguna
          </h3>
          <p className="text-sm text-slate-400">
            Kelola akun dan peran pengguna aplikasi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaPlus /> <span>Tambah</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                  Belum ada pengguna terdaftar.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                    {user.role}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      aria-label={`Edit ${user.name}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      className="text-rose-600 hover:text-rose-800"
                      aria-label={`Hapus ${user.name}`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        user={editingUser}
        error={modalError}
      />
    </div>
  );
};

export default Users;
