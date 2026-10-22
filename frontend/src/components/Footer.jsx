import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-[#2A2A2E] bg-[#0B0B0C] text-[#B3B3BB] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-[#FF7A1A] flex items-center justify-center text-[#0B0B0C] shadow-md shadow-[#FF7A1A]/20">
                <i className="fa-solid fa-briefcase text-sm font-bold" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#F5F5F5]">
                Job<span className="text-[#FF7A1A]">Hunt</span>
              </span>
            </Link>
            <p className="text-sm text-[#7E7E8A] max-w-sm leading-relaxed">
              Platform karir dan rekrutmen generasi baru yang menghubungkan pencari kerja
              berbakat dengan perusahaan terkemuka secara transparan dan efisien.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#7E7E8A]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141416] border border-[#2A2A2E]">
                <i className="fa-solid fa-shield-halved text-emerald-400" />
                Terverifikasi & Aman
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141416] border border-[#2A2A2E]">
                <i className="fa-solid fa-bolt text-[#FF7A1A]" />
                Respon Cepat
              </span>
            </div>
          </div>

          {/* Untuk Job Seeker */}
          <div>
            <h4 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider mb-4">
              Pencari Kerja
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-[#FF7A1A] transition-colors">
                  Jelajahi Lowongan
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=full-time" className="hover:text-[#FF7A1A] transition-colors">
                  Pekerjaan Full Time
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=internship" className="hover:text-[#FF7A1A] transition-colors">
                  Program Magang
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-[#FF7A1A] transition-colors">
                  Status Lamaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Untuk Recruiter */}
          <div>
            <h4 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider mb-4">
              Perekrut
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs/create" className="hover:text-[#FF7A1A] transition-colors">
                  Pasang Lowongan Baru
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#FF7A1A] transition-colors">
                  Dashboard Manajemen
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FF7A1A] transition-colors">
                  Daftar sebagai Recruiter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-[#2A2A2E]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7E7E8A]">
          <p>© {new Date().getFullYear()} JobHunt. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <span>React 19 & Tailwind CSS v4</span>
            <span>•</span>
            <span>REST API & MySQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
