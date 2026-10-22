import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useJob } from "../hooks/useJobs";
import { useAuth } from "../hooks/useAuth";
import { useMyApplications, useApplyJob } from "../hooks/useApplications";
import { JobTypeBadge, ApplicationStatusBadge } from "../components/StatusBadge";
import { formatSalary, formatDate } from "../utils/formatters";
import { Spinner } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { useToast } from "../hooks/useToast";

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated, isJobSeeker, isRecruiter } = useAuth();

  // State untuk modal kirim lamaran
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  // Ambil detail lowongan dari API
  const { data: job, isLoading, isError, refetch } = useJob(id);

  // Ambil data lamaran saya jika login sebagai job seeker
  const { data: myApplications } = useMyApplications();

  // Mutation apply
  const applyMutation = useApplyJob();

  // Cek apakah user sudah pernah melamar lowongan ini
  const existingApplication = myApplications?.find(
    (app) => Number(app.job_id) === Number(id),
  );

  const isOwner = isRecruiter && Number(job?.recruiter_id) === Number(user?.id);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    try {
      await applyMutation.mutateAsync({
        jobId: id,
        cover_letter: coverLetter,
      });

      toast.success("Lamaran berhasil dikirim! Pantau statusnya di menu Lamaran Saya.");
      setApplyModalOpen(false);
      setCoverLetter("");
    } catch (err) {
      toast.error(err.message || "Gagal mengirim lamaran. Silakan coba lagi.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" text="Memuat informasi lowongan..." />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorState
          title="Lowongan Tidak Ditemukan"
          message="Lowongan pekerjaan yang Anda cari tidak tersedia, telah dinonaktifkan oleh perekrut, atau tautan tidak valid."
          onRetry={refetch}
        />
        <div className="text-center mt-6">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141416] border border-[#2A2A2E] text-sm text-[#F5F5F5] hover:bg-[#1B1B1F]"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            Kembali ke Katalog Lowongan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb navigasi */}
      <nav className="flex items-center gap-2 text-xs text-[#7E7E8A]">
        <Link to="/" className="hover:text-[#F5F5F5] transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link to="/jobs" className="hover:text-[#F5F5F5] transition-colors">
          Lowongan
        </Link>
        <span>/</span>
        <span className="text-[#B3B3BB] truncate max-w-xs">{job.title}</span>
      </nav>

      {/* Header Lowongan Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#2A2A2E] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Logo Inisial Perusahaan */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1B1B1F] border border-[#2A2A2E] flex items-center justify-center text-[#FF7A1A] font-extrabold text-2xl sm:text-3xl shrink-0 shadow-lg shadow-black/40">
              {job.company ? job.company.charAt(0).toUpperCase() : "J"}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm sm:text-base font-semibold text-[#B3B3BB]">
                  {job.company}
                </span>
                <JobTypeBadge type={job.type} />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F5F5F5] tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#B3B3BB] pt-1">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-[#7E7E8A]" />
                  {job.location || "Lokasi Fleksibel / Remote"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-regular fa-calendar text-[#7E7E8A]" />
                  Dipasang {formatDate(job.created_at)}
                </span>
                {job.recruiter_name && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-user-tie text-[#7E7E8A]" />
                      Recruiter: {job.recruiter_name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button Berdasarkan Auth & Role */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0">
            {/* 1. Belum Login */}
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => navigate(`/login?redirect=/jobs/${job.id}`)}
                className="px-6 py-3.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-[#0B0B0C] font-bold text-sm shadow-xl shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-right-to-bracket text-xs" />
                Masuk untuk Melamar
              </button>
            )}

            {/* 2. Login sebagai Recruiter Pemilik Lowongan */}
            {isOwner && (
              <div className="flex flex-wrap gap-2.5">
                <Link
                  to={`/jobs/${job.id}/edit`}
                  className="px-4 py-2.5 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-xs sm:text-sm font-semibold text-[#F5F5F5] border border-[#2A2A2E] transition-all flex items-center gap-2"
                >
                  <i className="fa-regular fa-pen-to-square text-xs" />
                  Edit Lowongan
                </Link>
                <Link
                  to={`/jobs/${job.id}/applicants`}
                  className="px-4 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-xs sm:text-sm font-bold text-[#0B0B0C] transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-users text-xs" />
                  Lihat Pelamar
                </Link>
              </div>
            )}

            {/* 3. Login sebagai Recruiter Lain */}
            {isRecruiter && !isOwner && (
              <div className="px-4 py-2 rounded-xl bg-[#1B1B1F] border border-[#2A2A2E] text-xs text-[#7E7E8A] text-center">
                Akun Recruiter tidak dapat melamar lowongan
              </div>
            )}

            {/* 4. Login sebagai Job Seeker */}
            {isJobSeeker && (
              <>
                {existingApplication ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1B1B1F] border border-[#2A2A2E]">
                    <div className="text-left">
                      <p className="text-xs text-[#7E7E8A]">Status Lamaran Anda:</p>
                      <div className="mt-1">
                        <ApplicationStatusBadge status={existingApplication.status} />
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-semibold cursor-not-allowed"
                    >
                      Sudah Dilamar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(true)}
                    className="px-8 py-3.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-[#0B0B0C] font-bold text-sm shadow-xl shadow-[#FF7A1A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                  >
                    <i className="fa-solid fa-paper-plane text-xs" />
                    Lamar Pekerjaan Ini
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Highlight Gaji & Benefit Banner */}
        <div className="mt-6 pt-6 border-t border-[#2A2A2E] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <i className="fa-solid fa-wallet text-sm" />
            </div>
            <div>
              <p className="text-xs text-[#7E7E8A]">Estimasi Rentang Gaji</p>
              <p className="text-base sm:text-lg font-bold text-emerald-400">
                {formatSalary(job.salary_min, job.salary_max)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deskripsi & Persyaratan Pekerjaan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Deskripsi Pekerjaan */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#2A2A2E] space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#F5F5F5] flex items-center gap-2.5">
              <i className="fa-solid fa-align-left text-[#FF7A1A] text-base" />
              Deskripsi Pekerjaan
            </h2>
            <div className="text-sm text-[#B3B3BB] leading-relaxed whitespace-pre-line space-y-2">
              {job.description}
            </div>
          </div>

          {/* Persyaratan Pekerjaan */}
          {job.requirements && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#2A2A2E] space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#F5F5F5] flex items-center gap-2.5">
                <i className="fa-solid fa-list-check text-[#FF7A1A] text-base" />
                Kualifikasi & Persyaratan
              </h2>
              <div className="text-sm text-[#B3B3BB] leading-relaxed whitespace-pre-line space-y-2">
                {job.requirements}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info Ringkas */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#141416] border border-[#2A2A2E] space-y-5">
            <h3 className="text-base font-bold text-[#F5F5F5]">Informasi Lowongan</h3>
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <p className="text-[#7E7E8A]">Perusahaan</p>
                <p className="font-semibold text-[#F5F5F5] mt-0.5">{job.company}</p>
              </div>
              <div className="border-t border-[#2A2A2E]/60 pt-3">
                <p className="text-[#7E7E8A]">Tipe Pekerjaan</p>
                <div className="mt-1">
                  <JobTypeBadge type={job.type} />
                </div>
              </div>
              <div className="border-t border-[#2A2A2E]/60 pt-3">
                <p className="text-[#7E7E8A]">Lokasi Kantor</p>
                <p className="font-semibold text-[#F5F5F5] mt-0.5">
                  {job.location || "Remote / Fleksibel"}
                </p>
              </div>
              <div className="border-t border-[#2A2A2E]/60 pt-3">
                <p className="text-[#7E7E8A]">Tanggal Publikasi</p>
                <p className="font-semibold text-[#F5F5F5] mt-0.5">
                  {formatDate(job.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Keamanan & Tips Melamar */}
          <div className="p-6 rounded-3xl bg-[#1B1B1F] border border-[#2A2A2E] space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <i className="fa-solid fa-shield-halved" />
              Tips Aman Melamar
            </div>
            <p className="text-xs text-[#7E7E8A] leading-relaxed">
              JobHunt tidak pernah memungut biaya apapun dalam proses rekrutmen. Berhati-hatilah terhadap segala bentuk permintaan transfer uang.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Kirim Lamaran */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#141416] border border-[#2A2A2E] p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#F5F5F5]">Lamar Pekerjaan</h3>
                <p className="text-xs text-[#B3B3BB] mt-1">
                  {job.title} — {job.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="text-[#7E7E8A] hover:text-[#F5F5F5] p-1"
                aria-label="Tutup modal"
              >
                <i className="fa-solid fa-xmark text-base" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="coverLetter"
                  className="block text-xs font-semibold text-[#B3B3BB] mb-2"
                >
                  Surat Pengantar / Cover Letter{" "}
                  <span className="text-[#7E7E8A] font-normal">(Opsional)</span>
                </label>
                <textarea
                  id="coverLetter"
                  rows={6}
                  maxLength={5000}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Jelaskan secara singkat mengapa Anda cocok untuk posisi ini, portofolio relevan, atau ketersediaan bergabung..."
                  className="w-full rounded-2xl bg-[#0B0B0C] border border-[#2A2A2E] p-4 text-xs sm:text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors resize-none"
                />
                <div className="flex justify-between text-[11px] text-[#7E7E8A] mt-1.5">
                  <span>Maksimal 5.000 karakter</span>
                  <span>{coverLetter.length} / 5000</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A2A2E]">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-transparent hover:bg-[#1B1B1F] text-xs font-semibold text-[#B3B3BB] border border-[#2A2A2E]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] disabled:opacity-50 text-xs font-bold text-[#0B0B0C] shadow-lg shadow-[#FF7A1A]/20 flex items-center gap-2 cursor-pointer"
                >
                  {applyMutation.isPending ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin text-xs" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-xs" />
                      Kirim Lamaran Sekarang
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetail;
