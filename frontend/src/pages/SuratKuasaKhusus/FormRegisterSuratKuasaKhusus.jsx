import React, { useState } from "react";
import api from "../../services/api";

const FormRegisterSuratKuasaKhusus = () => {
  const initialFormState = {
    tanggal: new Date().toISOString().split("T")[0],
    nama_penerima_kuasa: "",
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
      await api.post("/surat-kuasa-khusus", formData);
      setSubmitStatus({
        success: true,
        error: false,
        message: "Data surat kuasa khusus berhasil disimpan!",
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
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Register Surat Kuasa Khusus
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Input data untuk register surat kuasa khusus.
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

                {/* Nama Penerima Kuasa */}
                <div>
                  <label
                    htmlFor="nama_penerima_kuasa"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nama Penerima Kuasa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_penerima_kuasa"
                    id="nama_penerima_kuasa"
                    value={formData.nama_penerima_kuasa}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama penerima kuasa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                </div>

                {/* Nama Pemberi Kuasa */}
                <div className="sm:col-span-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                </div>

                {/* Perkara PN, PT, MA */}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    />
                  </div>
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

export default FormRegisterSuratKuasaKhusus;
