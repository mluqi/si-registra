const { getSheet } = require("../services/googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "form_register_surat_legalisasi";

/**
 * @desc    Create a new legalisasi record
 * @route   POST /api/surat-legalisasi
 * @access  Private
 */
exports.createLegalisasi = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { tanggal, nomor_perkara, jumlah_bandel, total_setoran, keterangan } =
      req.body;

    // Basic validation
    if (
      !tanggal ||
      !nomor_perkara ||
      !jumlah_bandel ||
      total_setoran === undefined
    ) {
      return res.status(400).json({
        message: "Kolom Tanggal, Nomor Perkara, dan Jumlah Bandel wajib diisi.",
      });
    }

    const id = uuidv4();
    const newRow = [
      id,
      tanggal,
      nomor_perkara,
      jumlah_bandel,
      total_setoran,
      keterangan || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`, // 6 columns: id, tanggal, nomor_perkara, jumlah_bandel, total_setoran, keterangan
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });

    res.status(201).json({ message: "Data legalisasi berhasil dibuat.", id });
  } catch (error) {
    console.error("Create legalisasi error:", error);
    res.status(500).json({ message: "Server error during data creation." });
  }
};

/**
 * @desc    Get all legalisasi records
 * @route   GET /api/surat-legalisasi
 * @access  Private
 */
exports.getAllLegalisasi = async (req, res) => {
  try {
    const { startDate, endDate, search, page = 1, limit = 10 } = req.query;
    const sheets = await getSheet();
    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
    });

    const rows = resSheet.data.values;
    if (!rows || rows.length <= 1) {
      return res
        .status(200)
        .json({ data: [], total: 0, page: 1, totalPages: 1 });
    }
    let data = rows.slice(1).map((row) => ({
      id: row[0],
      tanggal: row[1],
      nomor_perkara: row[2],
      jumlah_bandel: row[3],
      total_setoran: row[4],
      keterangan: row[5] || "",
    }));

    let filteredData = data;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day

      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.tanggal);
        return itemDate >= start && itemDate <= end;
      });
    }

    if (search) {
      const lowercasedSearch = search.toLowerCase();
      filteredData = filteredData.filter((item) => {
        return item.nomor_perkara.toLowerCase().includes(lowercasedSearch);
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
    console.error("Error fetching legalisasi data:", error);
    res.status(500).json({ message: "Server error while fetching data." });
  }
};

/**
 * @desc    Update a legalisasi record
 * @route   PUT /api/surat-legalisasi/:id
 * @access  Private
 */
exports.updateLegalisasi = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params;
    const { tanggal, nomor_perkara, jumlah_bandel, total_setoran, keterangan } =
      req.body;

    if (
      !tanggal ||
      !nomor_perkara ||
      !jumlah_bandel ||
      total_setoran === undefined
    ) {
      return res.status(400).json({
        message: "Kolom Tanggal, Nomor Perkara, dan Jumlah Bandel wajib diisi.",
      });
    }

    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
    });

    const rows = resSheet.data.values;
    const rowIndex = rows?.findIndex((row) => row[0] === id);

    if (rowIndex === -1 || !rows) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    const updatedRow = [
      id,
      tanggal,
      nomor_perkara,
      jumlah_bandel,
      total_setoran,
      keterangan || "",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex + 1}:F${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [updatedRow] },
    });

    res.status(200).json({ message: "Data berhasil diperbarui." });
  } catch (error) {
    console.error("Update legalisasi error:", error);
    res.status(500).json({ message: "Server error during data update." });
  }
};

/**
 * @desc    Delete a legalisasi record
 * @route   DELETE /api/surat-legalisasi/:id
 * @access  Private
 */
exports.deleteLegalisasi = async (req, res) => {
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
    console.error("Delete legalisasi error:", error);
    res.status(500).json({ message: "Server error during data deletion." });
  }
};
