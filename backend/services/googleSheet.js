const { google } = require("googleapis");
const path = require("path");

async function getAuth() {
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    return new google.auth.GoogleAuth({
      credentials, // Gunakan objek credentials
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  } else {
    const path = require("path");
    const KEYFILEPATH = path.join(__dirname, "../credentials.json");
    return new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }
}

async function getSheet() {
  const auth = await getAuth();
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  return sheets;
}

module.exports = { getSheet };
