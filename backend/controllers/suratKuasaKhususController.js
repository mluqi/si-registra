const { getSheet } = require("../services/googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "form_register_surat_kuasa_khusus";

/**
 * @desc    Get all surat kuasa khusus records
 * @route   GET /api/surat-kuasa-khusus
 * @access  Private
 */
exports.getAllSuratKuasaKhusus = async (req, res) => {
  try {
    const { startDate, endDate, search, page = 1, limit = 10 } = req.query;
    const sheets = await getSheet();
    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`, // 8 columns
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
      nama_penerima_kuasa: row[2],
      nama_pemberi_kuasa: row[3],
      perkara_pn: row[4] || "",
      perkara_pt: row[5] || "",
      perkara_ma: row[6] || "",
      keterangan: row[7] || "",
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
        return (
          item.nama_penerima_kuasa.toLowerCase().includes(lowercasedSearch) ||
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
    console.error("Error fetching surat kuasa khusus data:", error);
    res.status(500).json({ message: "Server error while fetching data." });
  }
};

/**
 * @desc    Create a new surat kuasa khusus record
 * @route   POST /api/surat-kuasa-khusus
 * @access  Private
 */
exports.createSuratKuasaKhusus = async (req, res) => {
  try {
    const sheets = await getSheet();
    const {
      tanggal,
      nama_penerima_kuasa,
      nama_pemberi_kuasa,
      perkara_pn,
      perkara_pt,
      perkara_ma,
      keterangan,
    } = req.body;

    if (!tanggal || !nama_penerima_kuasa || !nama_pemberi_kuasa) {
      return res.status(400).json({
        message:
          "Kolom Tanggal, Nama Penerima Kuasa, dan Nama Pemberi Kuasa wajib diisi.",
      });
    }

    const id = uuidv4();
    const newRow = [
      id,
      tanggal,
      nama_penerima_kuasa,
      nama_pemberi_kuasa,
      perkara_pn || "",
      perkara_pt || "",
      perkara_ma || "",
      keterangan || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });

    res
      .status(201)
      .json({ message: "Data surat kuasa khusus berhasil dibuat.", id });
  } catch (error) {
    console.error("Create surat kuasa khusus error:", error);
    res.status(500).json({ message: "Server error during data creation." });
  }
};

/**
 * @desc    Update a surat kuasa khusus record
 * @route   PUT /api/surat-kuasa-khusus/:id
 * @access  Private
 */
exports.updateSuratKuasaKhusus = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params;
    const {
      tanggal,
      nama_penerima_kuasa,
      nama_pemberi_kuasa,
      perkara_pn,
      perkara_pt,
      perkara_ma,
      keterangan,
    } = req.body;

    if (!tanggal || !nama_penerima_kuasa || !nama_pemberi_kuasa) {
      return res.status(400).json({
        message:
          "Kolom Tanggal, Nama Penerima Kuasa, dan Nama Pemberi Kuasa wajib diisi.",
      });
    }

    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`,
    });

    const rows = resSheet.data.values;
    const rowIndex = rows?.findIndex((row) => row[0] === id);

    if (rowIndex === -1 || !rows) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    const updatedRow = [
      id,
      tanggal,
      nama_penerima_kuasa,
      nama_pemberi_kuasa,
      perkara_pn || "",
      perkara_pt || "",
      perkara_ma || "",
      keterangan || "",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex + 1}:H${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [updatedRow] },
    });

    res.status(200).json({ message: "Data berhasil diperbarui." });
  } catch (error) {
    console.error("Update surat kuasa khusus error:", error);
    res.status(500).json({ message: "Server error during data update." });
  }
};

/**
 * @desc    Delete a surat kuasa khusus record
 * @route   DELETE /api/surat-kuasa-khusus/:id
 * @access  Private
 */
exports.deleteSuratKuasaKhusus = async (req, res) => {
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
    console.error("Delete surat kuasa khusus error:", error);
    res.status(500).json({ message: "Server error during data deletion." });
  }
};
