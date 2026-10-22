import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useJob, useUpdateJob } from "../hooks/useJobs";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { useToast } from "../hooks/useToast";

// Form edit lowongan dengan state terisolasi tanpa useEffect
function EditJobForm({ job, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    title: job.title || "",
    company: job.company || "",
    location: job.location || "",
    type: job.type || "full-time",
    salary_min:
      job.salary_min !== null && job.salary_min !== undefined ? job.salary_min : "",
    salary_max:
      job.salary_max !== null && job.salary_max !== undefined ? job.salary_max : "",
    description: job.description || "",
    requirements: job.requirements || "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.title.trim()) {
      setErrorMessage("Judul lowongan wajib diisi.");
      return;
    }
    if (!formData.company.trim()) {
      setErrorMessage("Nama perusahaan wajib diisi.");
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage("Deskripsi pekerjaan wajib diisi.");
      return;
    }

    const min = formData.salary_min !== "" ? Number(formData.salary_min) : null;
    const max = formData.salary_max !== "" ? Number(formData.salary_max) : null;

    if (min !== null && max !== null && min > max) {
      setErrorMessage("Gaji minimum tidak boleh lebih besar daripada gaji maksimum.");
      return;
    }

    onSave({
      title: formData.title.trim(),
      company: formData.company.trim(),
      location: formData.location.trim() || null,
      type: formData.type,
      salary_min: min,
      salary_max: max,
      description: formData.description.trim(),
      requirements: formData.requirements.trim() || null,
    }).catch((err) => {
      setErrorMessage(
        err.message || "Gagal memperbarui lowongan. Periksa isian formulir.",
      );
    });
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#2A2A2E] shadow-2xl space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
          <i className="fa-solid fa-circle-exclamation shrink-0 text-base" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Judul Posisi */}
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
            >
              Judul Posisi Lowongan <span className="text-[#FF7A1A]">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              value={formData.title}
              onChange={handleChange}
              placeholder="cth: Senior Frontend Engineer"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors"
            />
          </div>

          {/* Nama Perusahaan */}
          <div>
            <label
              htmlFor="company"
              className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
            >
              Nama Perusahaan <span className="text-[#FF7A1A]">*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              maxLength={150}
              value={formData.company}
              onChange={handleChange}
              placeholder="cth: PT Solusi Teknologi Digital"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors"
            />
          </div>

          {/* Tipe Pekerjaan */}
          <div>
            <label
              htmlFor="type"
              className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
            >
              Tipe Pekerjaan <span className="text-[#FF7A1A]">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] focus:outline-none focus:border-[#FF7A1A] transition-colors cursor-pointer"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Kontrak</option>
              <option value="internship">Magang (Internship)</option>
            </select>
          </div>

          {/* Lokasi */}
          <div className="sm:col-span-2">
            <label
              htmlFor="location"
              className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
            >
              Lokasi Penempatan
            </label>
            <input
              id="location"
              name="location"
              type="text"
              maxLength={150}
              value={formData.location}
              onChange={handleChange}
              placeholder="cth: Jakarta Selatan / Remote"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors"
            />
          </div>

          {/* Rentang Gaji (Min & Max) */}
          <div>
            <label
              htmlFor="salary_min"
              className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
            >
              Gaji Minimum (IDR) <span className="text-[#7E7E8A] font-normal">(Opsional)</span>
            </label>
            <input
              id="salary_min"
              name="salary_min"
              type="number"
              min="0"
              step="100000"
              value={formData.salary_min}
              onChange={handleChange}
              placeholder="cth: 8000000"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="salary_max"
              className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
            >
              Gaji Maksimum (IDR) <span className="text-[#7E7E8A] font-normal">(Opsional)</span>
            </label>
            <input
              id="salary_max"
              name="salary_max"
              type="number"
              min="0"
              step="100000"
              value={formData.salary_max}
              onChange={handleChange}
              placeholder="cth: 15000000"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors"
            />
          </div>
        </div>

        {/* Deskripsi Pekerjaan */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
          >
            Deskripsi Pekerjaan & Tanggung Jawab <span className="text-[#FF7A1A]">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors resize-y"
          />
        </div>

        {/* Kualifikasi & Persyaratan */}
        <div>
          <label
            htmlFor="requirements"
            className="block text-xs font-semibold text-[#B3B3BB] mb-1.5"
          >
            Kualifikasi & Persyaratan <span className="text-[#7E7E8A] font-normal">(Opsional)</span>
          </label>
          <textarea
            id="requirements"
            name="requirements"
            rows={5}
            value={formData.requirements}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#0B0B0C] border border-[#2A2A2E] text-sm text-[#F5F5F5] placeholder-[#7E7E8A] focus:outline-none focus:border-[#FF7A1A] transition-colors resize-y"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2E]">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-transparent hover:bg-[#1B1B1F] text-xs sm:text-sm font-semibold text-[#B3B3BB] border border-[#2A2A2E] transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#E6690E] disabled:opacity-50 text-xs sm:text-sm font-bold text-[#0B0B0C] shadow-lg shadow-[#FF7A1A]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <i className="fa-solid fa-spinner animate-spin text-xs" />
                Menyimpan Perubahan...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk text-xs" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const { data: job, isLoading, isError, refetch } = useJob(id);
  const updateMutation = useUpdateJob();

  const handleSave = async (payload) => {
    await updateMutation.mutateAsync({ id, ...payload });
    toast.success("Lowongan pekerjaan berhasil diperbarui!");
    navigate(`/jobs/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" text="Memuat data lowongan..." />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorState
          title="Lowongan Tidak Ditemukan"
          message="Lowongan pekerjaan yang ingin Anda ubah tidak ditemukan atau sudah tidak aktif."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Validasi kepemilikan
  if (Number(job.recruiter_id) !== Number(user?.id)) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-3xl bg-[#141416] border border-rose-500/20 space-y-4">
          <i className="fa-solid fa-lock text-3xl text-rose-400" />
          <h2 className="text-xl font-bold text-[#F5F5F5]">Akses Ditolak</h2>
          <p className="text-xs text-[#B3B3BB]">
            Anda tidak memiliki izin untuk mengedit lowongan milik perekrut lain.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-5 py-2 rounded-xl bg-[#1B1B1F] text-xs font-semibold text-[#F5F5F5] border border-[#2A2A2E]"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2E] pb-6">
        <div>
          <nav className="flex items-center gap-2 text-xs text-[#7E7E8A] mb-2">
            <Link to="/dashboard" className="hover:text-[#F5F5F5] transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#B3B3BB]">Edit Lowongan #{id}</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-[#F5F5F5] tracking-tight">
            Perbarui Lowongan Pekerjaan
          </h1>
          <p className="text-sm text-[#B3B3BB] mt-1">
            Ubah rincian lowongan kerja untuk memastikan informasi selalu mutakhir.
          </p>
        </div>
      </div>

      {/* Form terisolasi dengan state awal dari job */}
      <EditJobForm
        key={job.id}
        job={job}
        onSave={handleSave}
        isSaving={updateMutation.isPending}
      />
    </div>
  );
}

export default EditJob;
