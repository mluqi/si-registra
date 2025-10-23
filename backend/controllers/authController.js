const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getSheet } = require("../services/googleSheet");
const { v4: uuidv4 } = require("uuid");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const USER_SHEET_NAME = "users";

/**
 * Helper function to find a user by email.
 * @param {google.sheets_v4.Sheets} sheets - The Google Sheets API instance.
 * @param {string} email - The email to search for.
 * @returns {Promise<object|null>} The user row data or null if not found.
 */
async function findUserByEmail(sheets, email) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${USER_SHEET_NAME}!A:F`, // Assuming columns A-F are id, name, email, password, createdAt, role
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    return null;
  }

  // Find the user row by email (assuming email is in the 3rd column, index 2)
  const userRow = rows.find((row) => row[2] === email);
  if (!userRow) {
    return null;
  }

  // Return user as an object for easier access
  return {
    id: userRow[0],
    name: userRow[1],
    email: userRow[2],
    password: userRow[3],
    role: userRow[5] || "petugas", // Default to 'petugas' if role is not set
    rowIndex: rows.indexOf(userRow) + 1, // +1 because sheet rows are 1-indexed
  };
}

exports.register = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password." });
    }

    // Default role is 'petugas'
    const userRole = role || "petugas";

    // Check if user already exists
    const existingUser = await findUserByEmail(sheets, email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Add new user to the sheet
    const newRow = [
      uuidv4(),
      name,
      email,
      hashedPassword,
      new Date().toISOString(),
      userRole,
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A:F`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [newRow],
      },
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

exports.login = async (req, res) => {
  try {
    const sheets = await getSheet();
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    // Find user by email
    const user = await findUserByEmail(sheets, email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Create and sign JWT
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "90d", // Provide a default value
    });

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};
