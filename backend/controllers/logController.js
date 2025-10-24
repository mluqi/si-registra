const { getSheet } = require("../services/googleSheet");

const LOG_ACCESS_SHEET = "log_access";
const LOG_ACTIVITY_SHEET = "log_activity";

const getLogs = async (req, res, sheetName) => {
  try {
    const { startDate, endDate, page = 1, limit = 15 } = req.query;
    const sheets = await getSheet();
    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}!A:G`, // Ambil hingga kolom G untuk mencakup 'target_id'
    });

    const rows = resSheet.data.values;
    if (!rows || rows.length <= 1) {
      return res.status(200).json({ data: [], total: 0, page, limit });
    }

    const headers = rows[0];
    let allData = rows.slice(1).map((row) => {
      const logEntry = {};
      headers.forEach((header, index) => {
        logEntry[header] = row[index] || "";
      });
      return logEntry;
    });

    // Urutkan berdasarkan tanggal terbaru
    allData.sort((a, b) => new Date(b.akses_record) - new Date(a.akses_record));

    let filteredData = allData;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Sertakan hingga akhir hari

      filteredData = allData.filter((item) => {
        const itemDate = new Date(item.akses_record);
        return itemDate >= start && itemDate <= end;
      });
    }

    const total = filteredData.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    const paginatedData = filteredData.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      data: paginatedData,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error);
    res.status(500).json({ message: "Server error while fetching log data." });
  }
};

/**
 * @desc    Get all access logs with pagination and filtering
 * @route   GET /api/logs/access
 * @access  Private (Admin/Superadmin)
 */
exports.getAccessLogs = (req, res) => {
  getLogs(req, res, LOG_ACCESS_SHEET);
};

/**
 * @desc    Get all activity logs with pagination and filtering
 * @route   GET /api/logs/activity
 * @access  Private (Admin/Superadmin)
 */
exports.getActivityLogs = (req, res) => {
  getLogs(req, res, LOG_ACTIVITY_SHEET);
};
