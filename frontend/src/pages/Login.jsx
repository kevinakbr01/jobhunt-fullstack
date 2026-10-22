import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const redirectUrl = searchParams.get("redirect");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Silakan isi email dan kata sandi Anda.");
      return;
    }

    try {
      setIsLoading(true);
      const user = await login(email.trim(), password);

      toast.success(`Selamat datang kembali, ${user.name}!`);

      // Arahkan ke target redirect sebelumnya atau halaman default berdasarkan role
      if (redirectUrl) {
        navigate(decodeURIComponent(redirectUrl), { replace: true });
      } else if (user.role === "recruiter") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/jobs", { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || "Email atau kata sandi tidak sesuai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A1A] flex items-center justify-center text-[#0B0B0C] shadow-lg shadow-[#FF7A1A]/20">
              <i className="fa-solid fa-briefcase text-base font-bold" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#F5F5F5]">
              Job<span className="text-[#FF7A1A]">Hunt</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#F5F5F5]">Masuk ke Akun Anda</h1>
          <p className="text-xs sm:text-sm text-[#B3B3BB]">
            Lanjutkan pencarian karir impian atau kelola proses rekrutmen.
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7E7E8A]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              className="w-full py-3 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] disabled:opacity-50 text-[#0B0B0C] font-bold text-sm shadow-xl shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin text-xs" />
                  Sedang Masuk...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#2A2A2E] text-center text-xs text-[#7E7E8A]">
            Belum memiliki akun?{" "}
            <Link
              to="/register"
              className="font-bold text-[#FF7A1A] hover:underline"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
