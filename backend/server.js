require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const logActivityMiddleware = require("./middlewares/logActivity");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const salinanPutusanRoutes = require("./routes/salinanPutusanRoutes");
const warmekingRoutes = require("./routes/warmekingRoutes");
const suratKuasaInsidentilRoutes = require("./routes/suratKuasaInsidentilRoutes");
const suratKeteranganTidakDipidanaRoutes = require("./routes/suratKeteranganTidakDipidanaRoutes");
const suratlegalisasiRoutes = require("./routes/suratLegalisasiRoutes");
const suratKuasaKhususRoutes = require("./routes/suratKuasaKhususRoutes");
const sheetGidRoutes = require("./routes/sheetGidRoutes");
const logRoutes = require("./routes/logRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", logActivityMiddleware("PENGGUNA"), userRoutes);
app.use(
  "/api/salinan-putusan",
  logActivityMiddleware("SALINAN PUTUSAN"),
  salinanPutusanRoutes
);
app.use("/api/warmeking", logActivityMiddleware("WARMEKING"), warmekingRoutes);
app.use(
  "/api/surat-kuasa-insidentil",
  logActivityMiddleware("SK INSIDENTIL"),
  suratKuasaInsidentilRoutes
);
app.use(
  "/api/surat-keterangan-tidak-dipidana",
  logActivityMiddleware("SK TIDAK DIPIDANA"),
  suratKeteranganTidakDipidanaRoutes
);
app.use(
  "/api/surat-legalisasi",
  logActivityMiddleware("SURAT LEGALISASI"),
  suratlegalisasiRoutes
);
app.use(
  "/api/surat-kuasa-khusus",
  logActivityMiddleware("SK KHUSUS"),
  suratKuasaKhususRoutes
);
app.use("/api/sheet-gid", sheetGidRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve frontend build
app.use(express.static(path.join(__dirname, "./public")));

// For any other request, serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

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
