const { getSheet } = require("../services/googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "form_register_surat_kuasa_insidentil";

/**
 * @desc    Get all surat kuasa insidentil records
 * @route   GET /api/surat-kuasa-insidentil
 * @access  Private
 */
exports.getAllSuratKuasaInsidentil = async (req, res) => {
  try {
    const { startDate, endDate, search, page = 1, limit = 10 } = req.query;
    const sheets = await getSheet();
    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:I`, // A:I for 9 columns (with ID)
    });

    const rows = resSheet.data.values;
    if (!rows || rows.length <= 1) {
      return res
        .status(200)
        .json({ data: [], total: 0, page: 1, totalPages: 1 });
    }

    // Assuming the first row is header, and data starts from the second row
    let data = rows.slice(1).map((row) => ({
      id: row[0],
      tanggal_input: row[1],
      insidentil: row[2],
      nama_penerima: row[3],
      nama_pemberi_kuasa: row[4],
      perkara_pn: row[5] || "",
      perkara_pt: row[6] || "",
      perkara_ma: row[7] || "",
      keterangan: row[8] || "",
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
          item.insidentil.toLowerCase().includes(lowercasedSearch) ||
          item.nama_penerima.toLowerCase().includes(lowercasedSearch) ||
          item.nama_pemberi_kuasa.toLowerCase().includes(lowercasedSearch) ||
          item.perkara_pn.toLowerCase().includes(lowercasedSearch)
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
    console.error("Error fetching surat kuasa insidentil data:", error);
    res.status(500).json({ message: "Server error while fetching data." });
  }
};

/**
 * @desc    Create a new surat kuasa insidentil record
 * @route   POST /api/surat-kuasa-insidentil
 * @access  Private
 */
exports.createSuratKuasaInsidentil = async (req, res) => {
  try {
    const sheets = await getSheet();
    const {
      tanggal_input,
      insidentil,
      nama_penerima,
      nama_pemberi_kuasa,
      perkara_pn,
      perkara_pt,
      perkara_ma,
      keterangan,
    } = req.body;

    // Basic validation for required fields
    if (
      !tanggal_input ||
      !insidentil ||
      !nama_penerima ||
      !nama_pemberi_kuasa
    ) {
      return res.status(400).json({
        message:
          "Kolom Tanggal Input, Insidentil, Nama Penerima, dan Nama Pemberi Kuasa wajib diisi.",
      });
    }

    const id = uuidv4();
    const newRow = [
      id,
      tanggal_input,
      insidentil,
      nama_penerima,
      nama_pemberi_kuasa,
      perkara_pn || "",
      perkara_pt || "",
      perkara_ma || "",
      keterangan || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:I`, // Append to 9 columns
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });

    res.status(201).json({
      message: "Data surat kuasa insidentil berhasil dibuat.",
      id,
    });
  } catch (error) {
    console.error("Create surat kuasa insidentil error:", error);
    res.status(500).json({ message: "Server error during data creation." });
  }
};

/**
 * @desc    Update a surat kuasa insidentil record
 * @route   PUT /api/surat-kuasa-insidentil/:id
 * @access  Private
 */
exports.updateSuratKuasaInsidentil = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params;
    const {
      tanggal_input,
      insidentil,
      nama_penerima,
      nama_pemberi_kuasa,
      perkara_pn,
      perkara_pt,
      perkara_ma,
      keterangan,
    } = req.body;

    if (
      !tanggal_input ||
      !insidentil ||
      !nama_penerima ||
      !nama_pemberi_kuasa
    ) {
      return res.status(400).json({
        message:
          "Kolom Tanggal Input, Insidentil, Nama Penerima, dan Nama Pemberi Kuasa wajib diisi.",
      });
    }

    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:I`,
    });

    const rows = resSheet.data.values;
    const rowIndex = rows?.findIndex((row) => row[0] === id);

    if (rowIndex === -1 || !rows) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    const updatedRow = [
      id,
      tanggal_input,
      insidentil,
      nama_penerima,
      nama_pemberi_kuasa,
      perkara_pn || "",
      perkara_pt || "",
      perkara_ma || "",
      keterangan || "",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex + 1}:I${rowIndex + 1}`, // Update 9 columns
      valueInputOption: "USER_ENTERED",
      resource: { values: [updatedRow] },
    });

    res.status(200).json({ message: "Data berhasil diperbarui." });
  } catch (error) {
    console.error("Update surat kuasa insidentil error:", error);
    res.status(500).json({ message: "Server error during data update." });
  }
};

/**
 * @desc    Delete a surat kuasa insidentil record
 * @route   DELETE /api/surat-kuasa-insidentil/:id
 * @access  Private
 */
exports.deleteSuratKuasaInsidentil = async (req, res) => {
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
    console.error("Delete surat kuasa insidentil error:", error);
    res.status(500).json({ message: "Server error during data deletion." });
  }
};
