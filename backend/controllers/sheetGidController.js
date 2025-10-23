const { getSheet } = require("../services/googleSheet");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

/**
 * @desc    Get GID of a sheet by its name
 * @route   GET /api/sheet-gid/:sheetName
 * @access  Private
 */
exports.getSheetGidByName = async (req, res) => {
  try {
    const { sheetName } = req.params;
    if (!sheetName) {
      return res.status(400).json({ message: "Nama sheet diperlukan." });
    }

    const sheets = await getSheet();
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = spreadsheet.data.sheets.find(
      (s) => s.properties.title === sheetName
    );

    if (!sheet) {
      return res
        .status(404)
        .json({ message: `Sheet dengan nama '${sheetName}' tidak ditemukan.` });
    }

    const gid = sheet.properties.sheetId;
    res.status(200).json({ gid });
  } catch (error) {
    console.error("Error getting sheet GID:", error);
    res.status(500).json({ message: "Server error saat mengambil GID sheet." });
  }
};
