require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const salinanPutusanRoutes = require("./routes/salinanPutusanRoutes");
const warmekingRoutes = require("./routes/warmekingRoutes");
const suratKuasaInsidentilRoutes = require("./routes/suratKuasaInsidentilRoutes");
const suratKeteranganTidakDipidanaRoutes = require("./routes/suratKeteranganTidakDipidanaRoutes");
const suratlegalisasiRoutes = require("./routes/suratLegalisasiRoutes");
const suratKuasaKhususRoutes = require("./routes/suratKuasaKhususRoutes");
const sheetGidRoutes = require("./routes/sheetGidRoutes");

const app = express();
const server = http.createServer(app);

// Konfigurasi CORS dinamis untuk Vercel
const whitelist = ["http://localhost:5173"];
if (process.env.VERCEL_URL) {
  whitelist.push(`https://${process.env.VERCEL_URL}`);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (seperti dari Postman) atau dari whitelist
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/salinan-putusan", salinanPutusanRoutes);
app.use("/api/warmeking", warmekingRoutes);
app.use("/api/surat-kuasa-insidentil", suratKuasaInsidentilRoutes);
app.use(
  "/api/surat-keterangan-tidak-dipidana",
  suratKeteranganTidakDipidanaRoutes
);
app.use("/api/surat-legalisasi", suratlegalisasiRoutes);
app.use("/api/surat-kuasa-khusus", suratKuasaKhususRoutes);
app.use("/api/sheet-gid", sheetGidRoutes);

// --- PENYESUAIAN DEPLOYMENT ---
// 1. Sajikan file statis dari build frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 2. Catch-all route untuk client-side routing (React Router)
// Ini akan mengirimkan index.html untuk setiap request yang tidak cocok dengan API routes di atas.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});
// --- AKHIR PENYESUAIAN DEPLOYMENT ---

// Ekspor aplikasi Express agar Vercel dapat menggunakannya
module.exports = app;
