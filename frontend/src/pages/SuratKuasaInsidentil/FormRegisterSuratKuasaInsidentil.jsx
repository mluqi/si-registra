import React, { useState } from "react";
import api from "../../services/api"; // Asumsi API service sudah ada

const FormRegisterSuratKuasaInsidentil = () => {
  const initialFormState = {
    tanggal_input: new Date().toISOString().split("T")[0], // Default to today's date
    insidentil: "",
    nama_penerima: "",
    nama_pemberi_kuasa: "",
    perkara_pn: "",
    perkara_pt: "",
    perkara_ma: "",
    keterangan: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, error: false, message: "" });

    try {
      // Ganti endpoint API sesuai dengan backend Anda untuk surat kuasa insidentil
      await api.post("/surat-kuasa-insidentil", formData);
      setSubmitStatus({
        success: true,
        error: false,
        message: "Data surat kuasa insidentil berhasil disimpan!",
      });
      setFormData(initialFormState); // Reset form setelah sukses
    } catch (err) {
      setSubmitStatus({
        success: false,
        error: true,
        message:
          err.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data surat kuasa insidentil.",
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
            Register Surat Kuasa Insidentil
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Input data register surat kuasa insidentil
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
                    disabled // Tidak bisa diubah
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed transition-all"
                  />
                </div>

                {/* Insidentil */}
                <div>
                  <label
                    htmlFor="insidentil"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Insidentil <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="insidentil"
                    id="insidentil"
                    value={formData.insidentil}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Perkara No. 123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:border-gray-400"
                  />
                </div>

                {/* Nama Penerima */}
                <div>
                  <label
                    htmlFor="nama_penerima"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nama Penerima Kuasa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_penerima"
                    id="nama_penerima"
                    value={formData.nama_penerima}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama penerima kuasa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:border-gray-400"
                  />
                </div>

                {/* Nama Pemberi Kuasa */}
                <div>
                  <label
                    htmlFor="nama_pemberi_kuasa"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nama Pemberi Kuasa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_pemberi_kuasa"
                    id="nama_pemberi_kuasa"
                    value={formData.nama_pemberi_kuasa}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama pemberi kuasa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:border-gray-400"
                  />
                </div>

                {/* Perkara PN, PT, MA - dalam satu baris */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="perkara_pn"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Perkara PN
                    </label>
                    <input
                      type="text"
                      name="perkara_pn"
                      id="perkara_pn"
                      value={formData.perkara_pn}
                      onChange={handleChange}
                      placeholder="Nomor perkara di PN"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:border-gray-400"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="perkara_pt"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Perkara PT
                    </label>
                    <input
                      type="text"
                      name="perkara_pt"
                      id="perkara_pt"
                      value={formData.perkara_pt}
                      onChange={handleChange}
                      placeholder="Nomor perkara di PT"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:border-gray-400"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="perkara_ma"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Perkara MA
                    </label>
                    <input
                      type="text"
                      name="perkara_ma"
                      id="perkara_ma"
                      value={formData.perkara_ma}
                      onChange={handleChange}
                      placeholder="Nomor perkara di MA"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Keterangan - Full Width */}
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

export default FormRegisterSuratKuasaInsidentil;
