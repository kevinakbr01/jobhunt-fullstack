import { getApplicationStatusMeta, getJobTypeStyle, formatJobType } from "../utils/formatters";

/**
 * StatusBadge untuk menampilkan status lamaran (pending, reviewed, rejected)
 */
export function ApplicationStatusBadge({ status }) {
  const meta = getApplicationStatusMeta(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${meta.className}`}
    >
      <i className={`${meta.icon} text-[10px]`} />
      {meta.label}
    </span>
  );
}

/**
 * JobTypeBadge untuk menampilkan jenis pekerjaan (full-time, part-time, contract, internship)
 */
export function JobTypeBadge({ type }) {
  const style = getJobTypeStyle(type);
  const label = formatJobType(type);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${style}`}
    >
      {label}
    </span>
  );
}

/**
 * Badge status aktif / nonaktif untuk recruiter
 */
export function JobActiveBadge({ isActive }) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Aktif
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
      Nonaktif
    </span>
  );
}
