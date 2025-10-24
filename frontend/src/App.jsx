import { Routes, Route } from "react-router-dom";
import AuthPageLayout from "./pages/Auth/AuthPageLayout";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import SalinanPutusan from "./pages/SalinanPutusan/SalinanPutusan";
import FormRegisterWarmeking from "./pages/RegisterWarmeking/FormRegisterWarmeking";
import FormRegisterSuratKuasaInsidentil from "./pages/SuratKuasaInsidentil/FormRegisterSuratKuasaInsidentil";
import FormRegisterSuratKeteranganTidakDipidana from "./pages/SuratKeteranganTidakDipidana/FormRegisterSuratKeteranganTidakDipidana";
import FormRegisterSuratLegalisasi from "./pages/SuratLegalisasi/FormRegisterSuratLegalisasi";
import FormRegisterSuratKuasaKhusus from "./pages/SuratKuasaKhusus/FormRegisterSuratKuasaKhusus";
import Profile from "./pages/Profile/Profile";
import Laporan from "./pages/Laporan/Laporan";
import AllData from "./pages/DaftarData/AllData";
import LogPage from "./pages/Logs/LogPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthPageLayout />}>
        <Route path="/signin" element={<Login />} />
        {/* <Route path="/register" element={<Register />} />  // Anda bisa menambahkan rute registrasi di sini */}
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route
            element={
              <RoleProtectedRoute allowedRoles={["admin", "superadmin"]} />
            }
          >
            <Route path="/daftar-data" element={<AllData />} />
          </Route>
          <Route element={<RoleProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route path="/users" element={<Users />} />
            <Route path="/log-aktivitas" element={<LogPage />} />
            <Route path="/log-akses" element={<LogPage />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/salinan-putusan" element={<SalinanPutusan />} />
          <Route
            path="/register-warmeking"
            element={<FormRegisterWarmeking />}
          />
          <Route
            path="/register-surat-kuasa-insidentil"
            element={<FormRegisterSuratKuasaInsidentil />}
          />
          <Route
            path="/register-surat-kuasa-khusus"
            element={<FormRegisterSuratKuasaKhusus />}
          />
          <Route
            path="/register-surat-keterangan-tidak-dipidana"
            element={<FormRegisterSuratKeteranganTidakDipidana />}
          />
          <Route
            path="/register-surat-legalisasi"
            element={<FormRegisterSuratLegalisasi />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
