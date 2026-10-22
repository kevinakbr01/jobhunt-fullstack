import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyApplications } from "../hooks/useApplications";
import { ApplicationStatusBadge, JobTypeBadge } from "../components/StatusBadge";
import { formatDate } from "../utils/formatters";
import { Spinner } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";

export function Applications() {
  const { data: applications, isLoading, isError, refetch } = useMyApplications();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewLetterModal, setViewLetterModal] = useState(null);

  const statusFilters = [
    { label: "Semua", value: "all" },
    { label: "Menunggu", value: "pending" },
    { label: "Ditinjau", value: "reviewed" },
    { label: "Tidak Sesuai", value: "rejected" },
  ];

  const filteredApplications = (applications || []).filter((app) => {
    if (selectedStatus === "all") return true;
    return app.status === selectedStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" text="Memuat riwayat lamaran Anda..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Gagal Memuat Riwayat Lamaran"
          message="Terjadi gangguan saat mengambil data lamaran Anda dari server."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2E] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
            Riwayat Lamaran Saya
          </h1>
          <p className="text-sm text-[#B3B3BB] mt-1">
            Pantau status respon dari setiap lowongan pekerjaan yang telah Anda lamar.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] text-[#0B0B0C] font-bold text-xs sm:text-sm shadow-md shadow-[#FF7A1A]/20 transition-all self-start sm:self-auto"
        >
          <i className="fa-solid fa-magnifying-glass text-xs" />
          Cari Lowongan Lain
        </Link>
      </div>

      {/* Filter Status Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#7E7E8A] mr-1">Filter Status:</span>
        {statusFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setSelectedStatus(f.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedStatus === f.value
                ? "bg-[#FF7A1A] text-[#0B0B0C] font-bold"
                : "bg-[#141416] text-[#B3B3BB] hover:text-[#F5F5F5] border border-[#2A2A2E]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          icon="fa-regular fa-file-lines"
          title={
            selectedStatus === "all"
              ? "Belum Ada Lamaran yang Dikirim"
              : "Tidak Ada Lamaran dengan Status Ini"
          }
          description="Anda belum mengirim lamaran untuk kriteria ini. Jelajahi katalog pekerjaan untuk mulai melamar posisi impian Anda."
          actionLabel="Jelajahi Lowongan"
          onAction={() => window.location.assign("/jobs")}
        />
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] hover:border-[#3A3A40] transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1B1B1F] border border-[#2A2A2E] flex items-center justify-center text-[#FF7A1A] font-bold text-xl shrink-0">
                  {app.company ? app.company.charAt(0).toUpperCase() : "J"}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#B3B3BB]">
                      {app.company}
                    </span>
                    <JobTypeBadge type={app.type} />
                  </div>

                  <Link
                    to={`/jobs/${app.job_id}`}
                    className="text-base sm:text-lg font-bold text-[#F5F5F5] hover:text-[#FF7A1A] transition-colors block"
                  >
                    {app.job_title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#7E7E8A]">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-location-dot" />
                      {app.location || "Remote"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="fa-regular fa-clock" />
                      Dilamar pada {formatDate(app.applied_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-[#2A2A2E]/60">
                <div className="text-left md:text-right">
                  <p className="text-[11px] text-[#7E7E8A] mb-1">Status Respon:</p>
                  <ApplicationStatusBadge status={app.status} />
                </div>

                <div className="flex items-center gap-2">
                  {app.cover_letter && (
                    <button
                      type="button"
                      onClick={() => setViewLetterModal(app)}
                      className="px-3 py-2 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-xs font-semibold text-[#B3B3BB] border border-[#2A2A2E] transition-colors"
                      title="Lihat Cover Letter"
                    >
                      <i className="fa-regular fa-file-lines mr-1.5" />
                      Surat
                    </button>
                  )}

                  <Link
                    to={`/jobs/${app.job_id}`}
                    className="px-3.5 py-2 rounded-xl bg-[#1B1B1F] hover:bg-[#2A2A2E] text-xs font-semibold text-[#F5F5F5] border border-[#2A2A2E] transition-colors"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Cover Letter Preview */}
      {viewLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#141416] border border-[#2A2A2E] p-6 sm:p-8 shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F5]">Surat Pengantar (Cover Letter)</h3>
                <p className="text-xs text-[#B3B3BB] mt-0.5">
                  Untuk posisi: {viewLetterModal.job_title} di {viewLetterModal.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewLetterModal(null)}
                className="text-[#7E7E8A] hover:text-[#F5F5F5] p-1"
                aria-label="Tutup modal"
              >
                <i className="fa-solid fa-xmark text-base" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-[#2A2A2E] text-xs sm:text-sm text-[#F5F5F5] whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
              {viewLetterModal.cover_letter || "Tidak menyertakan cover letter."}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewLetterModal(null)}
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

export default Applications;
