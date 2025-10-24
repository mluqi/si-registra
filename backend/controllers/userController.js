const bcrypt = require("bcryptjs");
const { getSheet } = require("../services/googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const USER_SHEET_NAME = "users";

/**
 * Helper function to find a user by email.
 */
async function findUserByEmail(sheets, email) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${USER_SHEET_NAME}!A:F`,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) return null;

  const userRow = rows.find((row) => row[2] === email);
  if (!userRow) return null;

  return { rowIndex: rows.indexOf(userRow) + 1 };
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const sheets = await getSheet();
    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A:F`,
    });

    const rows = resSheet.data.values;
    if (!rows || rows.length <= 1) return res.status(200).json([]);

    const users = rows.slice(1).map((row, index) => ({
      id: row[0],
      name: row[1],
      email: row[2],
      createdAt: row[4],
      role: row[5] || "petugas",
      rowIndex: index + 2, // Sheet rows are 1-indexed, +1 for header
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error while fetching users." });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const sheets = await getSheet();
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, password, and role are required." });
    }

    const existingUser = await findUserByEmail(sheets, email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const id = uuidv4();
    const newRow = [
      id,
      name,
      email,
      hashedPassword,
      new Date().toISOString(),
      role,
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A:F`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [newRow] },
    });

    res.status(201).json({ message: "User created successfully.", id });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error during user creation." });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, and role are required." });
    }

    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A:F`,
    });

    const rows = resSheet.data.values;
    const userRowIndex = rows?.findIndex((row) => row[0] === id);

    if (userRowIndex === -1 || !rows) {
      return res.status(404).json({ message: "User not found." });
    }

    const rowIndex = userRowIndex + 1;
    const userToUpdate = rows[userRowIndex];

    // Check if new email is already taken by another user
    const existingEmailUserIndex = rows.findIndex((row) => row[2] === email);
    if (
      existingEmailUserIndex !== -1 &&
      existingEmailUserIndex !== userRowIndex
    ) {
      return res
        .status(400)
        .json({ message: "Email is already in use by another user." });
    }

    // Update values: [id, name, email, password, createdAt, role]
    const updatedRow = [
      userToUpdate[0], // id
      name, // new name
      email, // new email
      userToUpdate[3], // keep old password
      userToUpdate[4], // keep old createdAt
      role, // new role
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A${rowIndex}:F${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [updatedRow] },
    });

    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error during user update." });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params;

    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A:A`, // Only need ID column to find the row
    });

    const ids = resSheet.data.values;
    const userRowIndex = ids?.findIndex((row) => row[0] === id);

    if (userRowIndex === -1 || !ids) {
      return res.status(404).json({ message: "User not found." });
    }

    const rowIndex = userRowIndex + 1;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming 'users' is the first sheet
                dimension: "ROWS",
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error during user deletion." });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { id } = req.params; // ID pengguna dari URL
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Kata sandi lama dan baru wajib diisi." });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Kata sandi baru minimal 6 karakter." });
    }

    const resSheet = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A:F`, // Asumsi kolom A-F
    });

    const rows = resSheet.data.values;
    const userRowIndex = rows?.findIndex((row) => row[0] === id);

    if (userRowIndex === -1 || !rows) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    const userRow = rows[userRowIndex];
    const storedHashedPassword = userRow[3]; // Asumsi password di kolom ke-4 (indeks 3)

    // Verifikasi kata sandi lama
    const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Kata sandi lama salah." });
    }

    // Hash kata sandi baru
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Update kata sandi di Google Sheet
    userRow[3] = newHashedPassword; // Update kolom password

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A${userRowIndex + 1}:F${userRowIndex + 1}`, // Sesuaikan range
      valueInputOption: "USER_ENTERED",
      resource: { values: [userRow] },
    });

    res.status(200).json({ message: "Kata sandi berhasil diubah." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error saat mengubah kata sandi." });
  }
};
