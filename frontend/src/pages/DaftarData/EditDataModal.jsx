import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditDataModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingData,
  columns,
  title,
}) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    } else {
      setFormData({});
    }
  }, [editingData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Constants for calculations
      const HARGA_PER_LEMBAR = 500;
      const HARGA_PER_BANDEL = 10000;

      // Automatic calculation for 'Salinan Putusan'
      if (title === "Salinan Putusan" && name === "jumlah_lembaran") {
        const jumlah = parseInt(value, 10) || 0;
        newData.harga_pnbp = jumlah * HARGA_PER_LEMBAR;
      }

      // Automatic calculation for 'Surat Legalisasi'
      if (title === "Surat Legalisasi" && name === "jumlah_bandel") {
        const jumlah = parseInt(value, 10) || 0;
        newData.total_setoran = jumlah * HARGA_PER_BANDEL;
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !editingData) return null;

  // Filter out the 'id' field from being displayed in the form
  const formFields = columns.filter((col) => col.key !== "id");

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit {title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map((col) => (
              <div key={col.key} className="mb-4">
                <label
                  htmlFor={col.key}
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  {col.header}
                </label>
                {col.key === "harga_pnbp" || col.key === "total_setoran" ? (
                  <input
                    type="text"
                    name={col.key}
                    id={col.key}
                    value={new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(formData[col.key] || 0)}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                ) : (
                  <input
                    type={
                      col.key.includes("tanggal")
                        ? "date"
                        : col.key.includes("jumlah")
                        ? "number"
                        : "text"
                    }
                    name={col.key}
                    id={col.key}
                    value={
                      col.key.includes("tanggal") && formData[col.key]
                        ? formData[col.key].split("T")[0]
                        : formData[col.key] || ""
                    }
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDataModal;
