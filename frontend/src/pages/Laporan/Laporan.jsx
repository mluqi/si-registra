import React, { useState, useRef } from "react";
import api from "../../services/api";
import DataTable from "../../components/DataTable";
import { FaPrint, FaSearch, FaTable } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import PrintableReport from "../../components/PrintableReport";

const REPORT_TYPES = {
  salinanPutusan: {
    title: "Salinan Putusan",
    gid: import.meta.env.VITE_GID_SALINAN_PUTUSAN,
    endpoint: "/salinan-putusan",
    columns: [
      { header: "Tanggal", key: "tanggal_input" },
      { header: "Nama Pihak", key: "nama_pihak" },
      { header: "Nomor Perkara", key: "nomor_perkara" },
      { header: "Jml Lembar", key: "jumlah_lembaran" },
      { header: "Harga PNBP", key: "harga_pnbp", isNumeric: true },
    ],
  },
  warmeking: {
    title: "Register Warmeking",
    gid: import.meta.env.VITE_GID_WARMEKING,
    endpoint: "/warmeking",
    columns: [
      { header: "Tanggal", key: "tanggal_input" },
      { header: "Permohonan", key: "permohonan_tentang" },
      { header: "Nama Pewaris", key: "nama_pewaris" },
      { header: "Nama Ahli Waris", key: "nama_ahli_waris" },
    ],
  },
  suratKuasaInsidentil: {
    title: "SK Insidentil",
    gid: import.meta.env.VITE_GID_SK_INSIDENTIL,
    endpoint: "/surat-kuasa-insidentil",
    columns: [
      { header: "Tanggal", key: "tanggal_input" },
      { header: "Insidentil", key: "insidentil" },
      { header: "Penerima Kuasa", key: "nama_penerima" },
      { header: "Pemberi Kuasa", key: "nama_pemberi_kuasa" },
      { header: "Perkara PN", key: "perkara_pn" },
      { header: "Perkara PT", key: "perkara_pt" },
      { header: "Perkara MA", key: "perkara_ma" },
    ],
  },
  suratKuasaKhusus: {
    title: "SK Khusus",
    gid: import.meta.env.VITE_GID_SK_KHUSUS,
    endpoint: "/surat-kuasa-khusus",
    columns: [
      { header: "Tanggal", key: "tanggal" },
      { header: "Penerima Kuasa", key: "nama_penerima_kuasa" },
      { header: "Pemberi Kuasa", key: "nama_pemberi_kuasa" },
      { header: "Perkara PN", key: "perkara_pn" },
      { header: "Perkara PT", key: "perkara_pt" },
      { header: "Perkara MA", key: "perkara_ma" },
    ],
  },
  skTidakDipidana: {
    title: "SK Tidak Dipidana",
    gid: import.meta.env.VITE_GID_SK_TIDAK_DIPIDANA,
    endpoint: "/surat-keterangan-tidak-dipidana",
    columns: [
      { header: "Tanggal", key: "tanggal_input" },
      { header: "Nomor SK", key: "nomor_sk" },
      { header: "Nama Pemohon", key: "nama_pemohon" },
      { header: "Alamat", key: "alamat_pemohon" },
    ],
  },
  suratLegalisasi: {
    title: "Surat Legalisasi",
    gid: import.meta.env.VITE_GID_SURAT_LEGALISASI,
    endpoint: "/surat-legalisasi",
    columns: [
      { header: "Tanggal", key: "tanggal" },
      { header: "Nomor Perkara", key: "nomor_perkara" },
      { header: "Jml Bandel", key: "jumlah_bandel" },
      { header: "Total Setoran", key: "total_setoran", isNumeric: true },
    ],
  },
};

const Laporan = () => {
  const [reportType, setReportType] = useState("salinanPutusan");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reportContentRef = useRef();

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    setData([]);
    try {
      const config = REPORT_TYPES[reportType];
      const response = await api.get(config.endpoint, {
        params: { startDate, endDate },
      });
      setData(response.data);
    } catch (err) {
      setError(
        "Gagal memuat data laporan. Pastikan backend mendukung filter tanggal."
      );
      console.error("Fetch report error:", err);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Gunakan contentRef sesuai API terbaru react-to-print
  const handlePrint = useReactToPrint({
    contentRef: reportContentRef, // Ganti dari content ke contentRef
    documentTitle: `Laporan ${
      REPORT_TYPES[reportType]?.title || "Register"
    } - ${startDate} sd ${endDate}`,
  });

  const handleOpenSheet = () => {
    const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
    if (!spreadsheetId) {
      alert(
        "SPREADSHEET_ID tidak ditemukan. Mohon konfigurasi file .env di frontend."
      );
      return;
    }

    const gid = activeReportConfig.gid;
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${gid}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const activeReportConfig = REPORT_TYPES[reportType];

  const total = activeReportConfig.columns.some((c) => c.isNumeric)
    ? data.reduce(
        (acc, item) =>
          acc +
          (Number(
            item[activeReportConfig.columns.find((c) => c.isNumeric).key]
          ) || 0),
        0
      )
    : null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="print:hidden">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
          Laporan Register
        </h1>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-end gap-4">
          <div className="flex-grow">
            <label
              htmlFor="reportType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Jenis Laporan
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.keys(REPORT_TYPES).map((key) => (
                <option key={key} value={key}>
                  {REPORT_TYPES[key].title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Mulai
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Selesai
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleFetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <FaSearch className="mr-2" />
            {loading ? "Memuat..." : "Tampilkan Data"}
          </button>
          <button
            onClick={handlePrint}
            disabled={data.length === 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center"
          >
            <FaPrint className="mr-2" />
            Cetak Laporan
          </button>
          <button
            onClick={handleOpenSheet}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            title="Buka Google Sheet di tab baru"
          >
            <FaTable className="mr-2" />
            Lihat di Sheet
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="print:hidden bg-white rounded-lg shadow-md p-6">
        {error && <div className="text-red-500 text-center p-4">{error}</div>}
        <DataTable
          data={data}
          columns={activeReportConfig.columns}
          isLoading={loading}
          title={`Pratinjau Laporan ${activeReportConfig.title}`}
        />
        {total !== null && data.length > 0 && (
          <div className="text-right mt-4 font-bold text-lg pr-6">
            Total:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(total)}
          </div>
        )}
      </div>

      {/* Hidden Report Content for Printing */}
      <div style={{ display: "none" }}>
        <PrintableReport
          ref={reportContentRef}
          data={data}
          columns={activeReportConfig.columns}
          reportTitle={activeReportConfig.title}
          startDate={startDate}
          endDate={endDate}
          total={total}
        />
      </div>
    </div>
  );
};

export default Laporan;