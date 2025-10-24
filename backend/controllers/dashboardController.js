const { getSheet } = require("../services/googleSheet");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const SHEETS_CONFIG = {
  salinanPutusan: {
    name: "form_register_salinan_putusan",
    dateColumnIndex: 1, // Kolom B
  },
  warmeking: {
    name: "form_register_warmeking",
    dateColumnIndex: 1, // Kolom B
  },
  suratKuasaInsidentil: {
    name: "form_register_surat_kuasa_insidentil",
    dateColumnIndex: 1, // Kolom B
  },
  suratKuasaKhusus: {
    name: "form_register_surat_kuasa_khusus",
    dateColumnIndex: 1, // Kolom B
  },
  skTidakDipidana: {
    name: "form_register_surat_keterangan_tidak_dipidana",
    dateColumnIndex: 1, // Kolom B
  },
  suratLegalisasi: {
    name: "form_register_surat_legalisasi",
    dateColumnIndex: 1, // Kolom B
  },
};

exports.getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sheets = await getSheet();

    const ranges = Object.values(SHEETS_CONFIG).map((config) => config.name);

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges: ranges,
    });

    const valueRanges = response.data.valueRanges;
    const stats = {};

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) {
      end.setHours(23, 59, 59, 999); // Sertakan hingga akhir hari
    }

    Object.keys(SHEETS_CONFIG).forEach((key, index) => {
      const sheetData = valueRanges[index]?.values;
      if (!sheetData || sheetData.length <= 1) {
        stats[key] = 0;
        return;
      }

      const dataRows = sheetData.slice(1);
      const dateColumnIndex = SHEETS_CONFIG[key].dateColumnIndex;

      if (start && end) {
        const filteredRows = dataRows.filter((row) => {
          const itemDate = new Date(row[dateColumnIndex]);
          return itemDate >= start && itemDate <= end;
        });
        stats[key] = filteredRows.length;
      } else {
        stats[key] = dataRows.length;
      }
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error while fetching stats." });
  }
};
