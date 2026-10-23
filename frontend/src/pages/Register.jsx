import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("job_seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Nama lengkap wajib diisi.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Email wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Kata sandi minimal harus 8 karakter.");
      return;
    }

    try {
      setIsLoading(true);

      // Registrasi pengguna
      await register(name.trim(), email.trim(), password, role);

      toast.success("Registrasi berhasil! Memproses login...");

      // Otomatis login agar user langsung masuk ke sesi barunya
      try {
        const loggedInUser = await login(email.trim(), password);
        if (loggedInUser.role === "recruiter") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/jobs", { replace: true });
        }
      } catch {
        toast.info("Silakan login dengan akun yang baru didaftarkan.");
        navigate("/login");
      }
    } catch (err) {
      setErrorMessage(
        err.message || "Gagal melakukan pendaftaran. Silakan periksa kembali formulir.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A1A] flex items-center justify-center text-[#0B0B0C] shadow-lg shadow-[#FF7A1A]/20">
              <i className="fa-solid fa-briefcase text-base font-bold" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#F5F5F5]">
              Job<span className="text-[#FF7A1A]">Hunt</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#F5F5F5]">Buat Akun Baru</h1>
          <p className="text-xs sm:text-sm text-[#B3B3BB]">
            Pilih peran Anda dan mulai gunakan seluruh fitur JobHunt.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#2A2A2E] shadow-2xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
              <i className="fa-solid fa-circle-exclamation shrink-0 text-sm" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pilihan Peran (Role Selector) */}
            <div>
              <label className="block text-xs font-semibold text-[#B3B3BB] mb-2">
                Daftar Sebagai:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("job_seeker")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    role === "job_seeker"
                      ? "bg-[#1B1B1F] border-[#FF7A1A] shadow-md shadow-[#FF7A1A]/10"
                      : "bg-[#0B0B0C] border-[#2A2A2E] hover:border-[#3A3A40]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <i
                      className={`fa-solid fa-user-graduate text-base ${
                        role === "job_seeker" ? "text-[#FF7A1A]" : "text-[#7E7E8A]"
                      }`}
                    />
                    {role === "job_seeker" && (
                      <i className="fa-solid fa-circle-check text-xs text-[#FF7A1A]" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-[#F5F5F5]">Pencari Kerja</p>
                  <p className="text-[11px] text-[#7E7E8A] mt-0.5">
                    Cari lowongan & melamar
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    role === "recruiter"
                      ? "bg-[#1B1B1F] border-[#FF7A1A] shadow-md shadow-[#FF7A1A]/10"
                      : "bg-[#0B0B0C] border-[#2A2A2E] hover:border-[#3A3A40]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <i
                      className={`fa-solid fa-building-user text-base ${
                        role === "recruiter" ? "text-[#FF7A1A]" : "text-[#7E7E8A]"
                      }`}
                    />
                    {role === "recruiter" && (
                      <i className="fa-solid fa-circle-check text-xs text-[#FF7A1A]" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-[#F5F5F5]">Perekrut</p>
                  <p className="text-[11px] text-[#7E7E8A] mt-0.5">
                    Pasang lowongan & kelola
                  </p>
                </button>
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
              >
                Nama Lengkap / Nama Perusahaan
              </label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7E7E8A]" />
                <input
                  id="name"
                  type="text"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth: Kevin Akbar"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
              >
                Alamat Email
              </label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7E7E8A]" />
                <input
                  id="email"
                  type="email"
                  required
                  maxLength={150}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
              >
                Kata Sandi <span className="text-[#7E7E8A] font-normal">(Minimal 8 karakter)</span>
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7E7E8A]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7E7E8A] hover:text-[#F5F5F5] text-xs"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                >
                  <i
                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] disabled:opacity-50 text-[#0B0B0C] font-bold text-sm shadow-xl shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin text-xs" />
                  Mendaftarkan Akun...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#2A2A2E] text-center text-xs text-[#7E7E8A]">
            Sudah memiliki akun?{" "}
            <Link to="/login" className="font-bold text-[#FF7A1A] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
