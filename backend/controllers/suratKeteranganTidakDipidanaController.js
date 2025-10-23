const { getSheet } = require("../services/googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "form_register_surat_keterangan_tidak_dipidana";

/**
 * @desc    Create a new record
 * @route   POST /api/surat-keterangan-tidak-dipidana
 * @access  Private
 */
exports.createRecord = async (req, res) => {
  try {
    const sheets = await getSheet();
    const {
      tanggal_input,
      nomor_sk,
      nama_pemohon,
      alamat_pemohon,
      keterangan,
    } = req.body;

    // Basic validation
    if (!tanggal_input || !nomor_sk || !nama_pemohon || !alamat_pemohon) {
      return res.status(400).json({
        message: "Kolom Tanggal, Nomor SK, Nama, dan Alamat wajib diisi.",
      });
    }

    const newRow = [
      uuidv4(),
      tanggal_input,
      nomor_sk,
      nama_pemohon,
      alamat_pemohon,
      keterangan || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`, // 6 columns
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });

    res.status(201).json({ message: "Data berhasil dibuat." });
  } catch (error) {
    console.error("Create record error:", error);
    res.status(500).json({ message: "Server error during data creation." });
  }
};

/**
 * @desc    Get all records
 * @route   GET /api/surat-keterangan-tidak-dipidana
 * @access  Private
 */
exports.getAllRecords = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sheets = await getSheet();
    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
    });

    const rows = resSheet.data.values;
    if (!rows || rows.length <= 1) {
      return res.status(200).json([]);
    }

    let data = rows.slice(1).map((row) => ({
      id: row[0],
      tanggal_input: row[1],
      nomor_sk: row[2],
      nama_pemohon: row[3],
      alamat_pemohon: row[4],
      keterangan: row[5] || "",
    }));

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day

      data = data.filter((item) => {
        const itemDate = new Date(item.tanggal_input);
        return itemDate >= start && itemDate <= end;
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Server error while fetching data." });
  }
};

/**
 * @desc    Update a record
 * @route   PUT /api/surat-keterangan-tidak-dipidana/:id
 * @access  Private
 */
exports.updateRecord = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params;
    const {
      tanggal_input,
      nomor_sk,
      nama_pemohon,
      alamat_pemohon,
      keterangan,
    } = req.body;

    // Basic validation
    if (!tanggal_input || !nomor_sk || !nama_pemohon || !alamat_pemohon) {
      return res.status(400).json({
        message: "Kolom Tanggal, Nomor SK, Nama, dan Alamat wajib diisi.",
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
      tanggal_input,
      nomor_sk,
      nama_pemohon,
      alamat_pemohon,
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
    console.error("Update record error:", error);
    res.status(500).json({ message: "Server error during data update." });
  }
};

/**
 * @desc    Delete a record
 * @route   DELETE /api/surat-keterangan-tidak-dipidana/:id
 * @access  Private
 */
exports.deleteRecord = async (req, res) => {
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
    console.error("Delete record error:", error);
    res.status(500).json({ message: "Server error during data deletion." });
  }
};
