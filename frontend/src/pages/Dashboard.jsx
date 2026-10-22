import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyJobs, useDeactivateJob } from "../hooks/useJobs";
import { JobTypeBadge, JobActiveBadge } from "../components/StatusBadge";
import { formatDate } from "../utils/formatters";
import { TableSkeleton } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../hooks/useToast";

export function Dashboard() {
  const { data: jobs, isLoading, isError, refetch } = useMyJobs();
  const deactivateMutation = useDeactivateJob();
  const toast = useToast();

  const [deactivateModalJob, setDeactivateModalJob] = useState(null);

  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter((j) => j.is_active)?.length || 0;
  const inactiveJobs = totalJobs - activeJobs;

  const handleConfirmDeactivate = async () => {
    if (!deactivateModalJob) return;

    try {
      await deactivateMutation.mutateAsync(deactivateModalJob.id);
      toast.success(`Lowongan "${deactivateModalJob.title}" berhasil dinonaktifkan.`);
      setDeactivateModalJob(null);
    } catch (err) {
      toast.error(err.message || "Gagal menonaktifkan lowongan.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="h-8 w-60 rounded-xl bg-[#141416] animate-pulse" />
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Gagal Memuat Dashboard"
          message="Terjadi gangguan saat mengambil data lowongan milik Anda."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Dashboard & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2E] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
            Dashboard Recruiter
          </h1>
          <p className="text-sm text-[#B3B3BB] mt-1">
            Kelola lowongan pekerjaan yang telah Anda publikasikan dan tinjau pelamar.
          </p>
        </div>

        <Link
          to="/jobs/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-[#0B0B0C] font-bold text-sm shadow-xl shadow-[#FF7A1A]/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <i className="fa-solid fa-plus text-xs" />
          Pasang Lowongan Baru
        </Link>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7E7E8A]">Total Lowongan</span>
            <i className="fa-solid fa-folder-open text-[#FF7A1A]" />
          </div>
          <p className="text-3xl font-extrabold text-[#F5F5F5]">{totalJobs}</p>
          <p className="text-xs text-[#7E7E8A]">Seluruh postingan lowongan Anda</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7E7E8A]">Lowongan Aktif</span>
            <i className="fa-solid fa-circle-check text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{activeJobs}</p>
          <p className="text-xs text-[#7E7E8A]">Dapat dilamar oleh kandidat</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7E7E8A]">Lowongan Nonaktif</span>
            <i className="fa-solid fa-ban text-[#7E7E8A]" />
          </div>
          <p className="text-3xl font-extrabold text-[#7E7E8A]">{inactiveJobs}</p>
          <p className="text-xs text-[#7E7E8A]">Ditutup dari katalog publik</p>
        </div>
      </div>

      {/* Daftar Lowongan Saya */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#F5F5F5]">Daftar Lowongan Pekerjaan</h2>

        {jobs.length === 0 ? (
          <EmptyState
            icon="fa-solid fa-briefcase"
            title="Anda Belum Memasang Lowongan"
            description="Mulai publikasikan kebutuhan talenta untuk perusahaan Anda hari ini."
            actionLabel="Pasang Lowongan Pertama"
            onAction={() => window.location.assign("/jobs/create")}
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#2A2A2E] bg-[#141416] shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#1B1B1F] text-[#7E7E8A] uppercase tracking-wider text-[11px] border-b border-[#2A2A2E]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Lowongan & Perusahaan</th>
                  <th className="px-6 py-4 font-semibold">Tipe</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Dipasang</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2E]">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-[#1B1B1F]/60 transition-colors"
                  >
                    {/* Judul & Perusahaan */}
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="font-bold text-[#F5F5F5] hover:text-[#FF7A1A] transition-colors line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs text-[#7E7E8A] mt-0.5">{job.company}</p>
                      </div>
                    </td>

                    {/* Tipe Pekerjaan */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <JobTypeBadge type={job.type} />
                    </td>

                    {/* Status Aktif */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <JobActiveBadge isActive={Boolean(job.is_active)} />
                    </td>

                    {/* Tanggal */}
                    <td className="px-6 py-4 text-xs text-[#7E7E8A] whitespace-nowrap">
                      {formatDate(job.created_at)}
                    </td>

                    {/* Tombol Aksi */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {/* Lihat Pelamar */}
                        <Link
                          to={`/jobs/${job.id}/applicants`}
                          className="px-3 py-1.5 rounded-xl bg-[#FF7A1A]/10 hover:bg-[#FF7A1A]/20 text-[#FF7A1A] border border-[#FF7A1A]/30 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                          title="Lihat Pelamar"
                        >
                          <i className="fa-solid fa-users text-xs" />
                          <span>Pelamar</span>
                        </Link>

                        {/* Edit Lowongan */}
                        <Link
                          to={`/jobs/${job.id}/edit`}
                          className="p-2 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-[#B3B3BB] hover:text-[#F5F5F5] border border-[#2A2A2E] text-xs transition-colors"
                          title="Ubah Lowongan"
                        >
                          <i className="fa-solid fa-pen-to-square" />
                        </Link>

                        {/* Nonaktifkan Lowongan */}
                        {Boolean(job.is_active) && (
                          <button
                            type="button"
                            onClick={() => setDeactivateModalJob(job)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-colors"
                            title="Tutup / Nonaktifkan Lowongan"
                          >
                            <i className="fa-solid fa-ban" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal Nonaktifkan Lowongan */}
      {deactivateModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141416] border border-[#2A2A2E] p-6 sm:p-8 shadow-2xl relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#F5F5F5]">
                Nonaktifkan Lowongan Ini?
              </h3>
              <p className="text-xs sm:text-sm text-[#B3B3BB] mt-1 leading-relaxed">
                Lowongan <span className="text-[#F5F5F5] font-semibold">"{deactivateModalJob.title}"</span> tidak akan lagi ditampilkan pada katalog pencarian publik dan kandidat tidak dapat lagi melamar.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A2A2E]">
              <button
                type="button"
                onClick={() => setDeactivateModalJob(null)}
                className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#1B1B1F] text-xs font-semibold text-[#B3B3BB] border border-[#2A2A2E]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deactivateMutation.isPending}
                onClick={handleConfirmDeactivate}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {deactivateMutation.isPending ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin text-xs" />
                    Menonaktifkan...
                  </>
                ) : (
                  "Ya, Nonaktifkan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
