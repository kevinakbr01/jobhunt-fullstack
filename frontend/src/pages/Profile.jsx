import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatters";
import { useToast } from "../hooks/useToast";

export function Profile() {
  const { user, isRecruiter, isJobSeeker, logout, refetchUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.info("Anda telah keluar dari akun.");
    navigate("/login");
  };

  const handleRefresh = async () => {
    try {
      await refetchUser();
      toast.success("Data profil berhasil diperbarui.");
    } catch {
      toast.error("Gagal menyegarkan data profil.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-[#2A2A2E] pb-6">
        <h1 className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
          Profil Akun Saya
        </h1>
        <p className="text-sm text-[#B3B3BB] mt-1">
          Kelola informasi akun dan tinjau status keanggotaan Anda di JobHunt.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#2A2A2E] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#2A2A2E]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF7A1A]/10 border border-[#FF7A1A]/30 flex items-center justify-center text-[#FF7A1A] font-extrabold text-2xl shadow-lg shadow-[#FF7A1A]/10">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">
                  {user?.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/20">
                  {isRecruiter ? "Perekrut (Recruiter)" : "Pencari Kerja"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#7E7E8A] mt-1">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="px-4 py-2 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-xs font-semibold text-[#B3B3BB] hover:text-[#F5F5F5] border border-[#2A2A2E] transition-all self-start sm:self-auto flex items-center gap-1.5"
          >
            <i className="fa-solid fa-rotate text-xs" />
            Segarkan Data
          </button>
        </div>

        {/* Informasi Detail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-[#2A2A2E]">
            <span className="text-xs text-[#7E7E8A] block mb-1">Nama Lengkap</span>
            <span className="font-semibold text-[#F5F5F5]">{user?.name}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-[#2A2A2E]">
            <span className="text-xs text-[#7E7E8A] block mb-1">Alamat Email</span>
            <span className="font-semibold text-[#F5F5F5]">{user?.email}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-[#2A2A2E]">
            <span className="text-xs text-[#7E7E8A] block mb-1">Peran / Role Pengguna</span>
            <span className="font-semibold text-[#F5F5F5]">
              {isRecruiter ? "Perekrut Perusahaan" : "Kandidat Pencari Kerja"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-[#2A2A2E]">
            <span className="text-xs text-[#7E7E8A] block mb-1">Bergabung Sejak</span>
            <span className="font-semibold text-[#F5F5F5]">
              {formatDate(user?.created_at)}
            </span>
          </div>
        </div>

        {/* Shortcut Navigasi Berdasarkan Role */}
        <div className="pt-4 border-t border-[#2A2A2E] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {isJobSeeker && (
              <Link
                to="/applications"
                className="px-4 py-2.5 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-xs sm:text-sm font-semibold text-[#F5F5F5] border border-[#2A2A2E] transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-file-lines text-[#FF7A1A]" />
                Lihat Lamaran Saya
              </Link>
            )}

            {isRecruiter && (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2.5 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-xs sm:text-sm font-semibold text-[#F5F5F5] border border-[#2A2A2E] transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-chart-pie text-[#FF7A1A]" />
                  Dashboard Recruiter
                </Link>
                <Link
                  to="/jobs/create"
                  className="px-4 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-xs sm:text-sm font-bold text-[#0B0B0C] transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus text-xs" />
                  Pasang Lowongan
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs sm:text-sm font-semibold text-rose-400 border border-rose-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-xs" />
            Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
