import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ToastProvider } from "./components/Toast";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleBasedRoute } from "./components/RoleBasedRoute";

// Halaman Publik
import Home from "./pages/Home";
import JobCatalog from "./pages/JobCatalog";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Halaman Khusus Job Seeker
import Applications from "./pages/Applications";

// Halaman Khusus Recruiter
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";

// Halaman Profil Akun
import Profile from "./pages/Profile";

// Scroll to top saat berpindah route
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// Halaman 404 Tidak Ditemukan
function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FF7A1A]/10 border border-[#FF7A1A]/30 flex items-center justify-center text-[#FF7A1A] font-extrabold text-2xl mx-auto">
          404
        </div>
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-[#B3B3BB]">
          Tautan yang Anda tuju mungkin salah, telah dihapus, atau tidak tersedia lagi.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-[#0B0B0C] font-bold text-sm shadow-lg shadow-[#FF7A1A]/20 transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-[#F5F5F5] font-sans antialiased">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* 1. Halaman Publik */}
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<JobCatalog />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 2. Halaman Khusus Job Seeker */}
                <Route
                  path="/applications"
                  element={
                    <RoleBasedRoute allowedRoles={["job_seeker"]}>
                      <Applications />
                    </RoleBasedRoute>
                  }
                />

                {/* 3. Halaman Khusus Recruiter */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleBasedRoute allowedRoles={["recruiter"]}>
                      <Dashboard />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/jobs/create"
                  element={
                    <RoleBasedRoute allowedRoles={["recruiter"]}>
                      <CreateJob />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/jobs/:id/edit"
                  element={
                    <RoleBasedRoute allowedRoles={["recruiter"]}>
                      <EditJob />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/jobs/:id/applicants"
                  element={
                    <RoleBasedRoute allowedRoles={["recruiter"]}>
                      <Applicants />
                    </RoleBasedRoute>
                  }
                />

                {/* 4. Halaman Akun Terlindungi */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 5. Fallback 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
