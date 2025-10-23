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

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to si-registra api");
});

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

const PORT = process.env.PORT || 8001;

const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
