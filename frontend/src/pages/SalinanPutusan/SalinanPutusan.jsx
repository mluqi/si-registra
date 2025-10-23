import React, { useState, useEffect } from "react";
import api from "../../services/api";

const SalinanPutusan = () => {
  const initialFormState = {
    tanggal_input: new Date().toISOString().split("T")[0],
    nama_pihak: "",
    nomor_perkara: "",
    jumlah_lembaran: "",
    harga_pnbp: 0,
    keterangan: "",
  };

  const HARGA_PER_LEMBAR = 500;
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: "",
  });

  useEffect(() => {
    const jumlah = parseInt(formData.jumlah_lembaran, 10);
    if (!isNaN(jumlah) && jumlah > 0) {
      setFormData((prev) => ({
        ...prev,
        harga_pnbp: jumlah * HARGA_PER_LEMBAR,
      }));
    } else {
      setFormData((prev) => ({ ...prev, harga_pnbp: 0 }));
    }
  }, [formData.jumlah_lembaran]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, error: false, message: "" });
    try {
      await api.post("/salinan-putusan", formData);
      setSubmitStatus({
        success: true,
        error: false,
        message: "Data berhasil disimpan!",
      });
      setFormData(initialFormState);
    } catch (err) {
      setSubmitStatus({
        success: false,
        error: true,
        message: err.response?.data?.message || "Terjadi kesalahan.",
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Register Salinan Putusan
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Input data register salinan putusan
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
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {submitStatus.success ? (
                        <svg
                          className="h-5 w-5 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-rose-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
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
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Tanggal Input */}
                <div>
                  <label
                    htmlFor="tanggal_input"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Tanggal Input
                  </label>
                  <input
                    type="date"
                    name="tanggal_input"
                    id="tanggal_input"
                    value={formData.tanggal_input}
                    onChange={handleChange}
                    required
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed transition-all"
                  />
                </div>

                {/* Nama Pihak */}
                <div>
                  <label
                    htmlFor="nama_pihak"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nama Pihak <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_pihak"
                    id="nama_pihak"
                    value={formData.nama_pihak}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama pihak"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:border-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:border-gray-400"
                  />
                </div>

                {/* Jumlah Lembaran */}
                <div>
                  <label
                    htmlFor="jumlah_lembaran"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Jumlah Lembaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="jumlah_lembaran"
                    id="jumlah_lembaran"
                    value={formData.jumlah_lembaran}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:border-gray-400"
                  />
                </div>

                {/* Harga PNBP - Full Width */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="harga_pnbp"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Harga PNBP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-blue-600 font-semibold text-lg">
                        Rp
                      </span>
                    </div>
                    <input
                      type="text"
                      name="harga_pnbp"
                      id="harga_pnbp"
                      value={new Intl.NumberFormat("id-ID").format(
                        formData.harga_pnbp
                      )}
                      readOnly
                      className="w-full pl-14 pr-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-900 font-bold text-lg focus:outline-none"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Otomatis dihitung: Jumlah Lembaran × Rp{" "}
                    {HARGA_PER_LEMBAR.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Keterangan */}
              <div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 resize-none hover:border-gray-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Simpan Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalinanPutusan;
