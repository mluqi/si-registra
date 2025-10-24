const { getSheet } = require("../services/googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "form_register_salinan_putusan";
const HARGA_PER_LEMBAR = 500;

exports.getAllSalinanPutusan = async (req, res) => {
  try {
    const { startDate, endDate, search, page = 1, limit = 10 } = req.query;
    const sheets = await getSheet();
    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:G`,
    });

    const rows = resSheet.data.values;
    if (!rows || rows.length <= 1) {
      return res
        .status(200)
        .json({ data: [], total: 0, page: 1, totalPages: 1 });
    }

    const header = rows[0];
    let data = rows.slice(1).map((row) => ({
      id: row[0],
      tanggal_input: row[1],
      nama_pihak: row[2],
      nomor_perkara: row[3],
      jumlah_lembaran: parseInt(row[4], 10),
      harga_pnbp: parseInt(row[5], 10),
      keterangan: row[6] || "",
    }));

    let filteredData = data;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day

      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.tanggal_input);
        return itemDate >= start && itemDate <= end;
      });
    }

    if (search) {
      const lowercasedSearch = search.toLowerCase();
      filteredData = filteredData.filter((item) => {
        return (
          item.nama_pihak.toLowerCase().includes(lowercasedSearch) ||
          item.nomor_perkara.toLowerCase().includes(lowercasedSearch)
        );
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const total = filteredData.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedData = filteredData.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      data: paginatedData,
      total,
      page: pageNum,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching salinan putusan:", error);
    res.status(500).json({ message: "Server error while fetching data." });
  }
};

exports.createSalinanPutusan = async (req, res) => {
  try {
    const sheets = await getSheet();
    const {
      tanggal_input,
      nama_pihak,
      nomor_perkara,
      jumlah_lembaran,
      keterangan,
    } = req.body;

    if (!tanggal_input || !nama_pihak || !nomor_perkara || !jumlah_lembaran) {
      return res
        .status(400)
        .json({ message: "Semua kolom wajib diisi kecuali keterangan." });
    }

    const jumlah = parseInt(jumlah_lembaran, 10);
    if (isNaN(jumlah) || jumlah <= 0) {
      return res
        .status(400)
        .json({ message: "Jumlah lembaran harus angka positif." });
    }

    const harga_pnbp = jumlah * HARGA_PER_LEMBAR;

    const id = uuidv4();
    const newRow = [
      id,
      tanggal_input,
      nama_pihak,
      nomor_perkara,
      jumlah,
      harga_pnbp,
      keterangan || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });

    res.status(201).json({ message: "Data berhasil dibuat.", id });
  } catch (error) {
    console.error("Create salinan putusan error:", error);
    res.status(500).json({ message: "Server error during data creation." });
  }
};

exports.updateSalinanPutusan = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params;
    const {
      tanggal_input,
      nama_pihak,
      nomor_perkara,
      jumlah_lembaran,
      keterangan,
    } = req.body;

    if (!tanggal_input || !nama_pihak || !nomor_perkara || !jumlah_lembaran) {
      return res
        .status(400)
        .json({ message: "Semua kolom wajib diisi kecuali keterangan." });
    }

    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:G`,
    });

    const rows = resSheet.data.values;
    const rowIndex = rows?.findIndex((row) => row[0] === id);

    if (rowIndex === -1 || !rows) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    const jumlah = parseInt(jumlah_lembaran, 10);
    if (isNaN(jumlah) || jumlah <= 0) {
      return res
        .status(400)
        .json({ message: "Jumlah lembaran harus angka positif." });
    }
    const harga_pnbp = jumlah * HARGA_PER_LEMBAR;

    const updatedRow = [
      id,
      tanggal_input,
      nama_pihak,
      nomor_perkara,
      jumlah,
      harga_pnbp,
      keterangan || "",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex + 1}:G${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [updatedRow] },
    });

    res.status(200).json({ message: "Data berhasil diperbarui." });
  } catch (error) {
    console.error("Update salinan putusan error:", error);
    res.status(500).json({ message: "Server error during data update." });
  }
};

exports.deleteSalinanPutusan = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params;

    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`,
    });

    const ids = resSheet.data.values;
    const rowIndex = ids?.findIndex((row) => row[0] === id);

    if (rowIndex === -1 || !ids) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    // Find the sheetId for SHEET_NAME
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheet = spreadsheetInfo.data.sheets.find(
      (s) => s.properties.title === SHEET_NAME
    );
    if (!sheet) {
      return res
        .status(404)
        .json({ message: `Sheet with name ${SHEET_NAME} not found.` });
    }
    const sheetId = sheet.properties.sheetId;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    res.status(200).json({ message: "Data berhasil dihapus." });
  } catch (error) {
    console.error("Delete salinan putusan error:", error);
    res.status(500).json({ message: "Server error during data deletion." });
  }
};
