import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DataTable from "../../components/DataTable";
import toast, { Toaster } from "react-hot-toast";
import EditDataModal from "./EditDataModal";
// import { useNavigate } from "react-router-dom";

const AllData = () => {
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("salinanPutusan");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

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
    const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

    const fetchData = async () => {
      // Cache key is now specific to the active tab
      const CACHE_KEY = `allDataCache_${activeTab}`;

      // If data for this tab already exists in state, don't refetch unless necessary
      if (allData[activeTab]) {
        console.log(`Data untuk ${TABS[activeTab].title} sudah ada.`);
        setLoading(false);
        return;
      }

      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log(
            `Menggunakan data dari cache untuk tab: ${TABS[activeTab].title}.`
          );
          setAllData((prev) => ({ ...prev, [activeTab]: data }));
          setLoading(false);
          return;
        }
      }

      console.log(
        `Mengambil data baru dari API untuk tab: ${TABS[activeTab].title}.`
      );
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(TABS[activeTab].endpoint);
        const newData = response.data;

        setAllData((prev) => ({ ...prev, [activeTab]: newData }));
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: newData, timestamp: Date.now() })
        );
      } catch (err) {
        toast.error(
          `Gagal memuat data untuk ${TABS[activeTab].title}. Silakan coba lagi nanti. ${err.message}}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]); // Dependency array now includes activeTab

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

    await api.put(`${TABS[tabKey].endpoint}/${id}`, updateData);

    // Refresh data for the updated tab
    const response = await api.get(TABS[tabKey].endpoint);
    setAllData((prevData) => ({
      ...prevData,
      [tabKey]: response.data,
    }));

    handleCloseModal();
    toast.success("Data berhasil diperbarui!");
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

      // Invalidate cache for this specific tab
      localStorage.removeItem(`allDataCache_${tabKey}`);
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

      <div>
        {Object.keys(TABS).map((key) => (
          <div key={key} className={activeTab === key ? "block" : "hidden"}>
            <DataTable
              data={allData[key]}
              columns={[
                ...TABS[key].columns,
                {
                  header: "Aksi",
                  key: "actions",
                  render: (rowData) => (
                    <div className="flex space-x-2">
                      <button
                        // Asumsi setiap item data memiliki properti 'id'
                        onClick={() => handleEdit(key, rowData.id)}
                        className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(key, rowData.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  ),
                },
              ]}
              isLoading={loading}
              title={TABS[key].title}
            />
          </div>
        ))}
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
