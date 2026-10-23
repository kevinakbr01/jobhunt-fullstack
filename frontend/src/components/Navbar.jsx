import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export function Navbar() {
  const { user, isAuthenticated, isJobSeeker, isRecruiter, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    toast.info("Anda telah berhasil keluar.");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-[#FF7A1A]" : "text-[#B3B3BB] hover:text-[#F5F5F5]"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2A2A2E] bg-[#0B0B0C]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#FF7A1A] flex items-center justify-center text-[#0B0B0C] shadow-md shadow-[#FF7A1A]/20 transition-transform group-hover:scale-105">
            <i className="fa-solid fa-briefcase text-sm font-bold" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#F5F5F5]">
            Job<span className="text-[#FF7A1A]">Hunt</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Beranda
          </NavLink>
          <NavLink to="/jobs" className={navLinkClass}>
            Cari Lowongan
          </NavLink>

          {isAuthenticated && isJobSeeker && (
            <NavLink to="/applications" className={navLinkClass}>
              Lamaran Saya
            </NavLink>
          )}

          {isAuthenticated && isRecruiter && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink
                to="/jobs/create"
                className="text-sm font-medium text-[#FF7A1A] hover:text-[#E6690E] flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus text-xs" />
                Pasang Lowongan
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Section: Auth Buttons / User Profile */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-[#F5F5F5] hover:text-[#FF7A1A] transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-sm font-semibold text-[#0B0B0C] shadow-md shadow-[#FF7A1A]/20 transition-all hover:scale-102"
              >
                Daftar
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#141416] border border-[#2A2A2E] hover:border-[#FF7A1A]/40 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#FF7A1A]/10 border border-[#FF7A1A]/30 flex items-center justify-center text-[#FF7A1A] text-xs font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold text-[#F5F5F5] leading-tight truncate max-w-[120px]">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-[#7E7E8A] leading-tight">
                    {isRecruiter ? "Recruiter" : "Job Seeker"}
                  </p>
                </div>
                <i
                  className={`fa-solid fa-chevron-down text-[10px] text-[#7E7E8A] transition-transform ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#141416] border border-[#2A2A2E] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-[#2A2A2E]">
                    <p className="text-xs text-[#7E7E8A]">Masuk sebagai</p>
                    <p className="text-sm font-bold text-[#F5F5F5] truncate">{user?.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/20">
                      {isRecruiter ? "Perekrut (Recruiter)" : "Pencari Kerja"}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#B3B3BB] hover:text-[#F5F5F5] hover:bg-[#1B1B1F] transition-colors"
                    >
                      <i className="fa-regular fa-user w-4 text-center" />
                      Profil Saya
                    </Link>

                    {isJobSeeker && (
                      <Link
                        to="/applications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#B3B3BB] hover:text-[#F5F5F5] hover:bg-[#1B1B1F] transition-colors"
                      >
                        <i className="fa-solid fa-file-lines w-4 text-center" />
                        Riwayat Lamaran
                      </Link>
                    )}

                    {isRecruiter && (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#B3B3BB] hover:text-[#F5F5F5] hover:bg-[#1B1B1F] transition-colors"
                      >
                        <i className="fa-solid fa-chart-pie w-4 text-center" />
                        Dashboard Recruiter
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#2A2A2E]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl bg-[#141416] border border-[#2A2A2E] text-[#B3B3BB] hover:text-[#F5F5F5]"
          aria-label="Toggle menu"
        >
          <i
            className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-base`}
          />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2A2A2E] bg-[#0B0B0C] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Beranda
            </NavLink>
            <NavLink
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Cari Lowongan
            </NavLink>

            {isAuthenticated && isJobSeeker && (
              <NavLink
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                Lamaran Saya
              </NavLink>
            )}

            {isAuthenticated && isRecruiter && (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/jobs/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-[#FF7A1A] py-1"
                >
                  + Pasang Lowongan
                </NavLink>
              </>
            )}

            {isAuthenticated && (
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                Profil Akun
              </NavLink>
            )}
          </nav>

          <div className="pt-3 border-t border-[#2A2A2E]">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-[#F5F5F5] bg-[#141416] border border-[#2A2A2E] rounded-xl"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-[#0B0B0C] bg-[#FF7A1A] rounded-xl"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl"
              >
                Keluar ({user?.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
