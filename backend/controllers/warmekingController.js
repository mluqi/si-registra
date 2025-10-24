const { getSheet } = require("../services/googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "form_register_warmeking";

/**
 * @desc    Get all warmeking records
 * @route   GET /api/warmeking
 * @access  Private
 */
exports.getAllWarmeking = async (req, res) => {
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

    const header = rows[0];
    let data = rows.slice(1).map((row) => ({
      id: row[0],
      tanggal_input: row[1],
      permohonan_tentang: row[2],
      nama_pewaris: row[3],
      nama_ahli_waris: row[4],
      keterangan: row[5] || "",
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
          item.permohonan_tentang.toLowerCase().includes(lowercasedSearch) ||
          item.nama_pewaris.toLowerCase().includes(lowercasedSearch) ||
          item.nama_ahli_waris.toLowerCase().includes(lowercasedSearch)
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
    console.error("Error fetching warmeking data:", error);
    res.status(500).json({ message: "Server error while fetching data." });
  }
};

/**
 * @desc    Create a new warmeking record
 * @route   POST /api/warmeking
 * @access  Private
 */
exports.createWarmeking = async (req, res) => {
  try {
    const sheets = await getSheet();
    const {
      tanggal_input,
      permohonan_tentang,
      nama_pewaris,
      nama_ahli_waris,
      keterangan,
    } = req.body;

    if (
      !tanggal_input ||
      !permohonan_tentang ||
      !nama_pewaris ||
      !nama_ahli_waris
    ) {
      return res
        .status(400)
        .json({ message: "Semua kolom wajib diisi kecuali keterangan." });
    }

    const id = uuidv4();
    const newRow = [
      id,
      tanggal_input,
      permohonan_tentang,
      nama_pewaris,
      nama_ahli_waris,
      keterangan || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });

    res.status(201).json({ message: "Data warmeking berhasil dibuat.", id });
  } catch (error) {
    console.error("Create warmeking error:", error);
    res.status(500).json({ message: "Server error during data creation." });
  }
};

/**
 * @desc    Update a warmeking record
 * @route   PUT /api/warmeking/:id
 * @access  Private
 */
exports.updateWarmeking = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params;
    const {
      tanggal_input,
      permohonan_tentang,
      nama_pewaris,
      nama_ahli_waris,
      keterangan,
    } = req.body;

    if (
      !tanggal_input ||
      !permohonan_tentang ||
      !nama_pewaris ||
      !nama_ahli_waris
    ) {
      return res
        .status(400)
        .json({ message: "Semua kolom wajib diisi kecuali keterangan." });
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
      tanggal_input,
      permohonan_tentang,
      nama_pewaris,
      nama_ahli_waris,
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
    console.error("Update warmeking error:", error);
    res.status(500).json({ message: "Server error during data update." });
  }
};

/**
 * @desc    Delete a warmeking record
 * @route   DELETE /api/warmeking/:id
 * @access  Private
 */
exports.deleteWarmeking = async (req, res) => {
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
    console.error("Delete warmeking error:", error);
    res.status(500).json({ message: "Server error during data deletion." });
  }
};
