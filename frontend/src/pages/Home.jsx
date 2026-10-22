import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJobs } from "../hooks/useJobs";
import { useAuth } from "../hooks/useAuth";
import { JobCard } from "../components/JobCard";
import { JobListSkeleton } from "../components/LoadingState";
import heroImg from "../assets/heros.jpg";

export function Home() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, isRecruiter } = useAuth();

  // Ambil lowongan terbaru dari API backend
  const { data, isLoading, isError } = useJobs({
    limit: 6,
    sort: "newest",
  });

  const jobs = data?.jobs || [];
  const totalJobs = data?.pagination?.total || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20">
        {/* Glow ambient background subtle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#FF7A1A]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141416] border border-[#2A2A2E] text-xs font-medium text-[#B3B3BB]">
                <span className="w-2 h-2 rounded-full bg-[#FF7A1A] animate-pulse" />
                <span>Platform Rekrutmen & Karir Masa Depan</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F5F5] leading-[1.15]">
                Temukan Karir Impian atau Rekrut{" "}
                <span className="text-[#FF7A1A]">Talenta Terbaik</span>
              </h1>

              <p className="text-[#B3B3BB] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Jelajahi ratusan lowongan kerja terverifikasi dengan informasi
                gaji transparan, atau pasang lowongan untuk menemukan kandidat
                potensial bagi perusahaan Anda.
              </p>

              {/* Hero Search Box */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 p-2 rounded-2xl bg-[#141416] border border-[#2A2A2E] shadow-2xl flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex items-center gap-3 px-3 w-full">
                  <i className="fa-solid fa-magnifying-glass text-[#7E7E8A]" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Judul posisi, keahlian, atau perusahaan..."
                    className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-[#0B0B0C] font-bold text-sm shrink-0 transition-all shadow-lg shadow-[#FF7A1A]/20 cursor-pointer"
                >
                  Cari Lowongan
                </button>
              </form>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/jobs"
                  className="px-6 py-3 rounded-xl bg-[#141416] hover:bg-[#1B1B1F] border border-[#2A2A2E] text-sm font-semibold text-[#F5F5F5] transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-compass text-[#FF7A1A]" />
                  Jelajahi Semua Lowongan
                </Link>

                <Link
                  to={
                    isAuthenticated
                      ? isRecruiter
                        ? "/jobs/create"
                        : "/jobs"
                      : "/register"
                  }
                  className="px-6 py-3 rounded-xl bg-transparent hover:bg-[#141416] border border-[#2A2A2E] text-sm font-semibold text-[#B3B3BB] hover:text-[#F5F5F5] transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-briefcase text-xs" />
                  Pasang Lowongan Kerja
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#2A2A2E]/60 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">
                    {totalJobs > 0 ? `${totalJobs}+` : "Tersedia"}
                  </p>
                  <p className="text-xs text-[#7E7E8A]">Lowongan Aktif</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#FF7A1A]">
                    100%
                  </p>
                  <p className="text-xs text-[#7E7E8A]">Perusahaan Resmi</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">
                    Cepat
                  </p>
                  <p className="text-xs text-[#7E7E8A]">Proses Review</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF7A1A]/20 to-transparent rounded-3xl blur-2xl -z-10" />
                <div className="rounded-3xl border border-[#2A2A2E] bg-[#141416]/70 p-4 backdrop-blur-sm shadow-2xl">
                  <img
                    src={heroImg}
                    alt="JobHunt Portal Ilustrasi"
                    className="w-full h-auto rounded-2xl object-cover shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Latest Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF7A1A] mb-1">
              <i className="fa-solid fa-fire" />
              Lowongan Pilihan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5]">
              Peluang Karir Terbaru
            </h2>
            <p className="text-sm text-[#B3B3BB] mt-1">
              Daftar lowongan kerja yang baru saja dipublikasikan oleh para
              perekrut.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF7A1A] hover:text-[#E6690E] transition-colors group"
          >
            Lihat Semua Lowongan
            <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Content Loader / Grid */}
        {isLoading ? (
          <JobListSkeleton count={6} />
        ) : isError ? (
          <div className="p-8 rounded-2xl bg-[#141416] border border-[#2A2A2E] text-center text-[#B3B3BB]">
            <p>
              Gagal memuat lowongan pilihan. Pastikan koneksi server backend
              aktif.
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#141416] border border-[#2A2A2E] text-center text-[#B3B3BB]">
            <p>Belum ada lowongan yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Why JobHunt Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF7A1A]">
            Keunggulan Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mt-2">
            Mengapa Memilih JobHunt?
          </h2>
          <p className="text-sm text-[#B3B3BB] mt-2">
            Kami menghadirkan pengalaman rekrutmen yang lebih transparan, adil,
            dan responsif bagi seluruh pengguna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FF7A1A]/10 border border-[#FF7A1A]/30 flex items-center justify-center text-[#FF7A1A] text-xl">
              <i className="fa-solid fa-coins" />
            </div>
            <h3 className="text-lg font-bold text-[#F5F5F5]">
              Transparansi Gaji
            </h3>
            <p className="text-sm text-[#7E7E8A] leading-relaxed">
              Ketahui rentang kompensasi sejak awal. Tidak ada lagi
              tebak-tebakan gaji di akhir sesi interview.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xl">
              <i className="fa-solid fa-chart-line" />
            </div>
            <h3 className="text-lg font-bold text-[#F5F5F5]">
              Status Lamaran Real-Time
            </h3>
            <p className="text-sm text-[#7E7E8A] leading-relaxed">
              Pantau langsung progress lamaran Anda: apakah sedang menunggu
              review, ditinjau recruiter, atau telah selesai.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
              <i className="fa-solid fa-building-circle-check" />
            </div>
            <h3 className="text-lg font-bold text-[#F5F5F5]">
              Perekrut Terverifikasi
            </h3>
            <p className="text-sm text-[#7E7E8A] leading-relaxed">
              Seluruh lowongan dipasang oleh recruiter resmi. Lindungi diri Anda
              dari penipuan lowongan palsu.
            </p>
          </div>
        </div>
      </section>

      {/* Recruiter Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141416] to-[#1B1B1F] border border-[#2A2A2E] p-8 sm:p-12 lg:p-14">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/20">
              Untuk Perusahaan & Perekrut
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] tracking-tight">
              Ingin Menemukan Kandidat Berbakat Lebih Cepat?
            </h2>
            <p className="text-sm sm:text-base text-[#B3B3BB] leading-relaxed">
              Daftarkan perusahaan Anda sekarang dan pasang lowongan pekerjaan
              dengan mudah. Kelola pelamar dan perbarui status lamaran dalam
              satu dashboard praktis.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to={
                  isAuthenticated && isRecruiter ? "/jobs/create" : "/register"
                }
                className="px-6 py-3.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-[#0B0B0C] font-bold text-sm shadow-xl shadow-[#FF7A1A]/20 transition-all"
              >
                Mulai Pasang Lowongan
              </Link>
              <Link
                to="/jobs"
                className="px-6 py-3.5 rounded-xl bg-[#0B0B0C] hover:bg-[#141416] border border-[#2A2A2E] text-[#F5F5F5] text-sm font-semibold transition-all"
              >
                Lihat Contoh Lowongan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
