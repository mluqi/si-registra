import React, { useState, useEffect } from "react";
import api from "../../services/api";

const FormRegisterSuratLegalisasi = () => {
  const HARGA_PER_BANDEL = 10000;

  const initialFormState = {
    tanggal: new Date().toISOString().split("T")[0],
    nomor_perkara: "",
    jumlah_bandel: "",
    total_setoran: 0,
    keterangan: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: "",
  });

  useEffect(() => {
    const jumlah = parseInt(formData.jumlah_bandel, 10);
    if (!isNaN(jumlah) && jumlah > 0) {
      setFormData((prev) => ({
        ...prev,
        total_setoran: jumlah * HARGA_PER_BANDEL,
      }));
    } else {
      setFormData((prev) => ({ ...prev, total_setoran: 0 }));
    }
  }, [formData.jumlah_bandel, HARGA_PER_BANDEL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, error: false, message: "" });

    try {
      await api.post("/surat-legalisasi", formData);
      setSubmitStatus({
        success: true,
        error: false,
        message: "Data legalisasi berhasil disimpan!",
      });
      setFormData(initialFormState);
    } catch (err) {
      setSubmitStatus({
        success: false,
        error: true,
        message:
          err.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setSubmitStatus({ success: false, error: false, message: "" });
  };

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Register Surat Legalisasi
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Input data untuk register legalisasi surat.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Alert */}
              {submitStatus.message && (
                <div
                  className={`rounded-xl p-4 animate-fadeIn ${
                    submitStatus.success
                      ? "bg-emerald-50 border-l-4 border-emerald-500"
                      : "bg-rose-50 border-l-4 border-rose-500"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      submitStatus.success
                        ? "text-emerald-800"
                        : "text-rose-800"
                    }`}
                  >
                    {submitStatus.message}
                  </p>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Tanggal */}
                <div>
                  <label
                    htmlFor="tanggal"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    id="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    required
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Nomor Perkara */}
                <div>
                  <label
                    htmlFor="nomor_perkara"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nomor Perkara <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomor_perkara"
                    id="nomor_perkara"
                    value={formData.nomor_perkara}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: 123/Pdt.G/2024/PA.Smg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                </div>

                {/* Jumlah Bandel */}
                <div>
                  <label
                    htmlFor="jumlah_bandel"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Jumlah Bandel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="jumlah_bandel"
                    id="jumlah_bandel"
                    value={formData.jumlah_bandel}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                </div>

                {/* Total Setoran */}
                <div>
                  <label
                    htmlFor="total_setoran"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Total Setoran (Rp)
                  </label>
                  <input
                    type="text"
                    name="total_setoran"
                    id="total_setoran"
                    value={new Intl.NumberFormat("id-ID").format(
                      formData.total_setoran
                    )}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl font-semibold"
                  />
                </div>
              </div>

              {/* Keterangan */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="keterangan"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  id="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tambahkan keterangan tambahan (opsional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRegisterSuratLegalisasi;
