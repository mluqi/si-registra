const { getSheet } = require("./googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const LOG_ACCESS_SHEET = "log_access";
const LOG_ACTIVITY_SHEET = "log_activity";

/**
 * Mencatat aktivitas login pengguna.
 * @param {object} logData - Data log yang akan dicatat.
 * @param {string} logData.user - Nama pengguna atau email.
 * @param {string} logData.ip - Alamat IP pengguna.
 * @param {string} logData.browser - User agent browser.
 * @param {'berhasil' | 'gagal'} logData.status - Status login.
 */
const logAccess = async ({ user, ip, browser, status }) => {
  try {
    const sheets = await getSheet();
    const newRow = [
      uuidv4(),
      user,
      ip,
      browser,
      status,
      new Date().toISOString(),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${LOG_ACCESS_SHEET}!A:F`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });
  } catch (error) {
    console.error("Gagal mencatat log akses:", error);
  }
};

/**
 * Mencatat aktivitas umum (CUD).
 * @param {object} logData - Data log yang akan dicatat.
 * @param {string} logData.user - Nama pengguna.
 * @param {string} logData.ip - Alamat IP pengguna.
 * @param {string} logData.browser - User agent browser.
 * @param {string} logData.action - Aksi yang dilakukan (misal: 'CREATE SALINAN PUTUSAN').
 * @param {string} logData.target - ID dari data yang dioperasikan.
 */
const logActivity = async ({ user, ip, browser, action, target }) => {
  try {
    const sheets = await getSheet();
    const newRow = [
      uuidv4(),
      user,
      ip,
      browser,
      action, // Menggunakan kolom 'aksi' untuk deskripsi aktivitas
      new Date().toISOString(),
      target || "", // ID dari data
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${LOG_ACTIVITY_SHEET}!A:G`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });
  } catch (error) {
    console.error("Gagal mencatat log aktivitas:", error);
  }
};

module.exports = { logAccess, logActivity };
