import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "../../components/DataTable";
import toast, { Toaster } from "react-hot-toast";
import EditDataModal from "./EditDataModal"; // Pastikan komponen ini ada
import Pagination from "../../components/Pagination"; // Impor komponen Pagination
import { FaSearch } from "react-icons/fa";

const AllData = () => {
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("salinanPutusan");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // State untuk filter, search, dan pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const TABS = {
    salinanPutusan: {
      title: "Salinan Putusan",
      endpoint: "/salinan-putusan",
      columns: [
        { header: "Tanggal", key: "tanggal_input" },
        { header: "Nama Pihak", key: "nama_pihak" },
        { header: "Nomor Perkara", key: "nomor_perkara" },
        { header: "Jml Lembar", key: "jumlah_lembaran" },
        { header: "Harga PNBP", key: "harga_pnbp" },
      ],
    },
    warmeking: {
      title: "Register Warmeking",
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
      endpoint: "/surat-legalisasi",
      columns: [
        { header: "Tanggal", key: "tanggal" },
        { header: "Nomor Perkara", key: "nomor_perkara" },
        { header: "Jml Bandel", key: "jumlah_bandel" },
        { header: "Total Setoran", key: "total_setoran" },
      ],
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: currentPage,
          limit: 10, // atau jumlah item per halaman yang Anda inginkan
          search: submittedQuery,
          startDate,
          endDate,
        };

        const response = await api.get(TABS[activeTab].endpoint, { params });
        const { data, total, page, totalPages: newTotalPages } = response.data;

        setAllData((prev) => ({ ...prev, [activeTab]: data }));
        setTotalItems(total);
        setTotalPages(newTotalPages);
        setCurrentPage(page);
      } catch (err) {
        toast.error(
          `Gagal memuat data untuk ${TABS[activeTab].title}. Silakan coba lagi nanti. ${err.message}}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage, submittedQuery, startDate, endDate]);

  // Reset halaman ke 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, submittedQuery, startDate, endDate]);

  const handleFilter = (e) => {
    e.preventDefault();
    // fetchData akan dipanggil oleh useEffect di atas
    setSubmittedQuery(searchQuery);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const TabButton = ({ tabKey, title }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabKey
          ? "bg-blue-600 text-white shadow"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      {title}
    </button>
  );

  const handleOpenModal = (data) => {
    setEditingData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleEdit = (tabKey, id) => {
    console.log(`Editing item with ID ${id} for tab: ${tabKey}`);
    const dataToEdit = allData[tabKey]?.find((item) => item.id === id);
    if (dataToEdit) {
      handleOpenModal({ ...dataToEdit, tabKey });
    } else {
      console.error("Data to edit not found");
    }
  };

  const handleUpdateSubmit = async (formData) => {
    const { tabKey, id, ...updateData } = formData;
    if (!tabKey || !id) {
      throw new Error("tabKey or id is missing from form data.");
    }

    const toastId = toast.loading("Memperbarui data...");
    await api.put(`${TABS[tabKey].endpoint}/${id}`, updateData);

    // Refresh data for the updated tab
    const response = await api.get(TABS[tabKey].endpoint);
    const { data } = response.data;

    setAllData((prevData) => {
      const updatedTab = prevData[tabKey].map((item) =>
        item.id === id ? { ...item, ...updateData } : item
      );
      return { ...prevData, [tabKey]: updatedTab };
    });

    handleCloseModal();
    toast.success("Data berhasil diperbarui!", { id: toastId });
  };

  const handleDelete = async (tabKey, id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      return;
    }

    console.log(`Deleting item with ID ${id} for tab: ${tabKey}`);
    setLoading(true);
    setError(null);

    try {
      // Assuming your API has a DELETE endpoint like /api/salinan-putusan/:id
      await api.delete(`${TABS[tabKey].endpoint}/${id}`);

      // Optimistic UI update: remove the item from state directly
      setAllData((prevData) => ({
        ...prevData,
        [tabKey]: prevData[tabKey].filter((item) => item.id !== id),
      }));

      console.log("Data deleted successfully.");
      toast.success("Data berhasil dihapus.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Gagal menghapus data. Silakan coba lagi.`
      );
      console.error(`Delete error for ${tabKey} with ID ${id}:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
        Daftar Data Register
      </h1>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg">
          {Object.keys(TABS).map((key) => (
            <TabButton key={key} tabKey={key} title={TABS[key].title} />
          ))}
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form
          onSubmit={handleFilter}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="flex-grow">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cari Data
            </label>
            <div className="flex flex-row items-center justify-between gap-2">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik untuk mencari..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <FaSearch className="mr-2" />
                Cari
              </button>
            </div>
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
        </form>
      </div>

      <div>
        <div className={activeTab ? "block" : "hidden"}>
          <DataTable
            data={allData[activeTab]}
            columns={[
              ...TABS[activeTab].columns,
              {
                header: "Aksi",
                key: "actions",
                render: (rowData) => (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(activeTab, rowData.id)}
                      className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activeTab, rowData.id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                ),
              },
            ]}
            isLoading={loading}
            title={TABS[activeTab].title}
          />
          {allData[activeTab] && allData[activeTab].length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={10}
            />
          )}
        </div>
      </div>

      <EditDataModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleUpdateSubmit}
        editingData={editingData}
        columns={editingData ? TABS[editingData.tabKey].columns : []}
        title={editingData ? TABS[editingData.tabKey].title : ""}
      />
    </div>
  );
};

export default AllData;
