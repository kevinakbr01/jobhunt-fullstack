import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useJob } from "../hooks/useJobs";
import { useJobApplicants, useUpdateApplicationStatus } from "../hooks/useApplications";
import { formatDate } from "../utils/formatters";
import { ApplicationStatusBadge } from "../components/StatusBadge";
import { TableSkeleton } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../hooks/useToast";

export function Applicants() {
  const { id } = useParams();
  const toast = useToast();

  const { data: job, isLoading: jobLoading } = useJob(id);
  const {
    data: applicants,
    isLoading: applicantsLoading,
    isError,
    refetch,
  } = useJobApplicants(id);

  const updateStatusMutation = useUpdateApplicationStatus();
  const [selectedApplicantLetter, setSelectedApplicantLetter] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      await updateStatusMutation.mutateAsync({
        applicationId,
        jobId: id,
        status: newStatus,
      });
      toast.success("Status lamaran berhasil diperbarui.");
    } catch (err) {
      toast.error(err.message || "Gagal memperbarui status lamaran.");
    } finally {
      setUpdatingId(null);
    }
  };

  const isLoading = jobLoading || applicantsLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-8 w-60 rounded-xl bg-[#141416] animate-pulse" />
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Gagal Memuat Daftar Pelamar"
          message="Terjadi gangguan saat mengambil data pelamar untuk lowongan ini. Pastikan Anda adalah pemilik lowongan."
          onRetry={refetch}
        />
      </div>
    );
  }

  const applicantList = applicants || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2E] pb-6">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#7E7E8A] mb-2">
            <Link to="/dashboard" className="hover:text-[#F5F5F5] transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#B3B3BB]">Daftar Pelamar</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
            Pelamar: {job?.title || "Lowongan"}
          </h1>
          <p className="text-xs sm:text-sm text-[#B3B3BB] mt-1">
            {job?.company} • Total {applicantList.length} berkas lamaran masuk
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/jobs/${id}`}
            className="px-4 py-2 rounded-xl bg-[#141416] hover:bg-[#1B1B1F] text-xs font-semibold text-[#F5F5F5] border border-[#2A2A2E] transition-all"
          >
            Lihat Lowongan
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-xs font-semibold text-[#B3B3BB] border border-[#2A2A2E] transition-all"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {/* Tabel Pelamar */}
      {applicantList.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-users"
          title="Belum Ada Pelamar"
          description="Saat ini belum ada kandidat yang mengajukan lamaran untuk lowongan pekerjaan ini."
          actionLabel="Kembali ke Dashboard"
          onAction={() => window.location.assign("/dashboard")}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#2A2A2E] bg-[#141416] shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#1B1B1F] text-[#7E7E8A] uppercase tracking-wider text-[11px] border-b border-[#2A2A2E]">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama & Email Pelamar</th>
                <th className="px-6 py-4 font-semibold">Tanggal Melamar</th>
                <th className="px-6 py-4 font-semibold">Surat Pengantar</th>
                <th className="px-6 py-4 font-semibold">Status Saat Ini</th>
                <th className="px-6 py-4 font-semibold text-right">Ubah Status Lamaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2E]">
              {applicantList.map((app) => (
                <tr key={app.id} className="hover:bg-[#1B1B1F]/60 transition-colors">
                  {/* Info Pelamar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1B1B1F] border border-[#2A2A2E] flex items-center justify-center text-[#FF7A1A] font-bold text-sm shrink-0">
                        {app.applicant_name ? app.applicant_name.charAt(0).toUpperCase() : "P"}
                      </div>
                      <div>
                        <p className="font-bold text-[#F5F5F5]">{app.applicant_name}</p>
                        <p className="text-xs text-[#7E7E8A]">{app.applicant_email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Tanggal Melamar */}
                  <td className="px-6 py-4 text-xs text-[#7E7E8A] whitespace-nowrap">
                    {formatDate(app.applied_at)}
                  </td>

                  {/* Cover Letter Button */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.cover_letter ? (
                      <button
                        type="button"
                        onClick={() => setSelectedApplicantLetter(app)}
                        className="px-3 py-1.5 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-xs font-semibold text-[#FF7A1A] border border-[#2A2A2E] transition-colors inline-flex items-center gap-1.5"
                      >
                        <i className="fa-regular fa-file-lines text-xs" />
                        Baca Surat
                      </button>
                    ) : (
                      <span className="text-xs text-[#7E7E8A] italic">Tidak ada</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ApplicationStatusBadge status={app.status} />
                  </td>

                  {/* Dropdown Ubah Status */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      {updatingId === app.id && (
                        <i className="fa-solid fa-spinner animate-spin text-xs text-[#FF7A1A]" />
                      )}
                      <select
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-xs text-[#F5F5F5] focus:outline-none focus:border-[#FF7A1A] cursor-pointer"
                      >
                        <option value="pending" className="bg-[#141416]">
                          Menunggu
                        </option>
                        <option value="reviewed" className="bg-[#141416]">
                          Ditinjau
                        </option>
                        <option value="rejected" className="bg-[#141416]">
                          Tidak Sesuai
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Cover Letter Preview */}
      {selectedApplicantLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#141416] border border-[#2A2A2E] p-6 sm:p-8 shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F5]">
                  Surat Pengantar Pelamar
                </h3>
                <p className="text-xs text-[#B3B3BB] mt-0.5">
                  Dari: {selectedApplicantLetter.applicant_name} ({selectedApplicantLetter.applicant_email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicantLetter(null)}
                className="text-[#7E7E8A] hover:text-[#F5F5F5] p-1"
                aria-label="Tutup modal"
              >
                <i className="fa-solid fa-xmark text-base" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-[#2A2A2E] text-xs sm:text-sm text-[#F5F5F5] whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
              {selectedApplicantLetter.cover_letter}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedApplicantLetter(null)}
                className="px-5 py-2 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-xs font-semibold text-[#F5F5F5] border border-[#2A2A2E]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applicants;
