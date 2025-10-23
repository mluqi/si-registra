// services/googleSheet.js
const { google } = require("googleapis");
const path = require("path");

async function getSheet() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../credentials.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  return sheets;
}

module.exports = { getSheet };
