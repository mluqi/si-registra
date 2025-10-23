const { getSheet } = require(".services/googleSheet");
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

exports.getSheet = async (req, res) => {
  try {
    const sheets = await getSheet();
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1:E10",
    });

    const rows = result.data.values;
    res.json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membaca data dari Google Sheets" });
  }
};

exports.updateSheet = async (req, res) => {
  try {
    const { nama, email } = req.body;
    const sheets = await getSheet();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:B",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[nama, email, new Date().toLocaleString()]],
      },
    });
    res.json({ message: "Data berhasil ditambahkan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menulis data ke Google Sheets" });
  }
};

exports.deleteSheet = async (req, res) => {
  try {
    const { rowId } = req.params;
    if (!rowId) {
      return res.status(400).json({ message: "Row ID is required." });
    }

    const sheets = await getSheet();

    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sheet1!A${rowId}:Z${rowId}`,
    });

    res.json({ message: `Row ${rowId} successfully cleared.` });
  } catch (err) {
    console.error("Delete sheet error:", err);
    res
      .status(500)
      .json({ message: "Failed to delete data from Google Sheets." });
  }
};
