/**
 * Format angka ke format mata uang Rupiah (IDR)
 */
export function formatRupiah(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

/**
 * Format rentang gaji (salary_min dan salary_max)
 */
export function formatSalary(min, max) {
  const hasMin = min !== null && min !== undefined && Number(min) > 0;
  const hasMax = max !== null && max !== undefined && Number(max) > 0;

  if (hasMin && hasMax) {
    return `${formatRupiah(min)} – ${formatRupiah(max)}`;
  }
  if (hasMin) {
    return `Mulai ${formatRupiah(min)}`;
  }
  if (hasMax) {
    return `Hingga ${formatRupiah(max)}`;
  }
  return "Gaji Kompetitif";
}

/**
 * Format label tipe pekerjaan ke bahasa Indonesia yang ramah
 */
export function formatJobType(type) {
  switch (type) {
    case "full-time":
      return "Full Time";
    case "part-time":
      return "Part Time";
    case "contract":
      return "Kontrak";
    case "internship":
      return "Magang";
    default:
      return type || "Penuh Waktu";
  }
}

/**
 * Badge styling metadata untuk tipe pekerjaan
 */
export function getJobTypeStyle(type) {
  switch (type) {
    case "full-time":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "part-time":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "contract":
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    case "internship":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

/**
 * Metadata untuk status lamaran kerja (pending, reviewed, rejected)
 */
export function getApplicationStatusMeta(status) {
  switch (status) {
    case "reviewed":
      return {
        label: "Ditinjau",
        className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        icon: "fa-solid fa-file-circle-check",
      };
    case "rejected":
      return {
        label: "Tidak Sesuai",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        icon: "fa-solid fa-circle-xmark",
      };
    case "pending":
    default:
      return {
        label: "Menunggu",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        icon: "fa-solid fa-clock",
      };
  }
}

/**
 * Format tanggal ramah pengguna / relatif
 */
export function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hari ini";
    }
    if (diffDays === 1) {
      return "Kemarin";
    }
    if (diffDays > 1 && diffDays < 7) {
      return `${diffDays} hari lalu`;
    }
    if (diffDays >= 7 && diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} minggu lalu`;
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}
