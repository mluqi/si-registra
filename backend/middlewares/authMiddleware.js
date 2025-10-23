const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { createError } = require("http-errors");
const { getSheet } = require("../services/googleSheet");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const USER_SHEET_NAME = "users";

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        createError(401, "You are not logged in! Please log in to get access.")
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const sheets = await getSheet();
    const sheetRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${USER_SHEET_NAME}!A:F`, // Get all user data up to role
    });

    const rows = sheetRes.data.values;
    if (!rows) {
      return next(
        createError(
          401,
          "The user belonging to this token does no longer exist."
        )
      );
    }

    const currentUserRow = rows.find((row) => row[0] === decoded.id);

    if (!currentUserRow) {
      return next(
        createError(
          401,
          "The user belonging to this token does no longer exist."
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = {
      id: currentUserRow[0],
      name: currentUserRow[1],
      email: currentUserRow[2],
      role: currentUserRow[5] || "petugas", // Default to 'petugas' if role is empty
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return next(createError(401, "Invalid token or session has expired."));
  }
};

/**
 * Middleware to restrict access to certain roles.
 * @param  {...string} roles - List of allowed roles.
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        createError(403, "You do not have permission to perform this action.")
      );
    }
    next();
  };
};
