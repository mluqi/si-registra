import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  FaFileAlt,
  FaBookOpen,
  FaFileSignature,
  FaCertificate,
  FaStamp,
  FaSearch,
  FaCopy,
} from "react-icons/fa";

const StatCard = ({ icon, title, count, bgColor, isLoading }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1 ${bgColor}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-white/80">{title}</p>
          {isLoading ? (
            <div className="mt-2 h-9 w-24 animate-pulse rounded-md bg-white/30"></div>
          ) : (
            <p className="text-4xl font-bold text-white">{count}</p>
          )}
        </div>
        <div className="text-white/20">{icon}</div>
      </div>
      <div className="absolute -bottom-8 -right-8 text-white/10">
        {React.cloneElement(icon, { size: 120 })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [stats, setStats] = useState({
    salinanPutusan: 0,
    warmeking: 0,
    suratKuasaInsidentil: 0,
    suratKuasaKhusus: 0,
    skTidakDipidana: 0,
    suratLegalisasi: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data on initial load for today's date
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const cacheKey = `dashboardCache_${startDate}_${endDate}`;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

    try {
      // Cek cache terlebih dahulu
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { stats, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log("Menggunakan data dari cache dashboard.");
          setStats(stats);
          setLoading(false);
          return; // Hentikan eksekusi jika cache valid
        }
      }

      setLoading(true);
      setError(null);

      const response = await api.get("/dashboard/stats", {
        params: { startDate, endDate },
      });

      const newStats = response.data;
      setStats(newStats);

      // Simpan data baru ke cache
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ stats: newStats, timestamp: Date.now() })
      );
    } catch (err) {
      setError("Gagal memuat data dashboard. Silakan coba lagi nanti.");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cardData = [
    {
      title: "Register Warmeking",
      count: stats.warmeking,
      icon: <FaFileAlt size={48} />,
      bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      title: "SK Tidak Dipidana",
      count: stats.skTidakDipidana,
      icon: <FaCertificate size={48} />,
      bgColor: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
    {
      title: "Surat Kuasa Insidentil",
      count: stats.suratKuasaInsidentil,
      icon: <FaBookOpen size={48} />,
      bgColor: "bg-gradient-to-br from-violet-500 to-violet-600",
    },
    {
      title: "Surat Kuasa Khusus",
      count: stats.suratKuasaKhusus,
      icon: <FaFileSignature size={48} />,
      bgColor: "bg-gradient-to-br from-rose-500 to-rose-600",
    },
    {
      title: "Surat Legalisasi",
      count: stats.suratLegalisasi,
      icon: <FaStamp size={48} />,
      bgColor: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
    {
      title: "Salinan Putusan",
      count: stats.salinanPutusan,
      icon: <FaCopy size={48} />,
      bgColor: "bg-gradient-to-br from-slate-600 to-slate-700",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
        Dashboard
      </h1>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-end gap-4">
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
          onClick={fetchStats}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          <FaSearch className="mr-2" />
          {loading ? "Memuat..." : "Tampilkan"}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-center text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cardData.map((card, index) => (
          <StatCard key={index} {...card} isLoading={loading} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
