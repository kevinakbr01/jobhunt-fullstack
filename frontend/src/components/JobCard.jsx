import { Link } from "react-router-dom";
import { JobTypeBadge } from "./StatusBadge";
import { formatSalary, formatDate } from "../utils/formatters";

export function JobCard({ job }) {
  if (!job) return null;

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] hover:border-[#FF7A1A]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF7A1A]/5 hover:-translate-y-1"
    >
      <div>
        {/* Header: Company & Type Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1B1B1F] border border-[#2A2A2E] group-hover:border-[#FF7A1A]/30 flex items-center justify-center text-[#FF7A1A] font-bold text-lg shrink-0 transition-colors">
              {job.company ? job.company.charAt(0).toUpperCase() : "J"}
            </div>
            <div>
              <p className="text-xs text-[#B3B3BB] font-medium truncate max-w-[150px] sm:max-w-[200px]">
                {job.company}
              </p>
              <h3 className="text-base sm:text-lg font-bold text-[#F5F5F5] group-hover:text-[#FF7A1A] transition-colors line-clamp-1">
                {job.title}
              </h3>
            </div>
          </div>
          <JobTypeBadge type={job.type} />
        </div>

        {/* Lokasi & Gaji */}
        <div className="space-y-1.5 mb-4 text-xs sm:text-sm text-[#B3B3BB]">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-[#7E7E8A] w-4 text-center shrink-0" />
            <span className="truncate">{job.location || "Lokasi Fleksibel / Remote"}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <i className="fa-solid fa-money-bill-wave text-emerald-400/80 w-4 text-center shrink-0" />
            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
        </div>

        {/* Deskripsi Singkat */}
        {job.description && (
          <p className="text-xs text-[#7E7E8A] line-clamp-2 leading-relaxed mb-4">
            {job.description}
          </p>
        )}
      </div>

      {/* Footer info: Tanggal & Jumlah Pelamar */}
      <div className="pt-4 mt-auto border-t border-[#2A2A2E]/70 flex items-center justify-between text-xs text-[#7E7E8A]">
        <div className="flex items-center gap-1.5">
          <i className="fa-regular fa-clock" />
          <span>{formatDate(job.created_at)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#B3B3BB]">
          <i className="fa-solid fa-users text-xs text-[#FF7A1A]" />
          <span>{job.applicant_count ?? 0} Pelamar</span>
        </div>
      </div>
    </Link>
  );
}

export default JobCard;
