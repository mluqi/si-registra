require("dotenv").config();
const bcrypt = require("bcryptjs");
const { getSheet } = require("../services/googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const USER_SHEET_NAME = "users";

async function findUserByEmail(sheets, email) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!C:C`, // Hanya cek kolom email
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      return null;
    }

    return rows.find((row) => row[0] === email);
  } catch (error) {
    // Jika sheet 'users' belum ada, anggap user tidak ditemukan
    if (error.code === 400 && error.message.includes("Unable to parse range")) {
      return null;
    }
    throw error;
  }
}

async function seedSuperAdmin() {
  console.log("🌱 Memulai proses seeding superadmin...");

  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "❌ SUPERADMIN_EMAIL dan SUPERADMIN_PASSWORD harus diatur di file .env"
    );
    return;
  }

  try {
    const sheets = await getSheet();

    const existingUser = await findUserByEmail(sheets, email);
    if (existingUser) {
      console.log("✅ Superadmin sudah ada. Seeding dilewati.");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newRow = [
      uuidv4(),
      "Super Admin",
      email,
      hashedPassword,
      new Date().toISOString(),
      "superadmin",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A:F`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });

    console.log("✅ Superadmin berhasil dibuat!");
  } catch (error) {
    console.error("❌ Gagal membuat superadmin:", error.message);
  }
}

seedSuperAdmin();
